import { formatTime } from '../utils/time';
import { on, once, toggleListener, triggerEvent } from '../utils/events';
import { createElement, emptyElement, getAttributesFromSelector, getElement, getElements, hasClass, matches, removeElement, setAttributes, setFocus, toggleClass, toggleHidden } from '../utils/elements';
import fetch from '../utils/fetch';

/**
 * Preview thumbnails for seek hover and scrubbing
 * Seeking: Hover over the seek bar (desktop only): shows a small preview container above the seek bar
 * Scrubbing: Click and drag the seek bar (desktop and mobile): shows the preview image over the entire video, as if the video is scrubbing at very high speed
 *
 * Notes:
 * - Thumbs are set via JS settings on Plyr init, not HTML5 'track' property. Using the track property would be a bit gross, because it doesn't support custom 'kinds'. kind=metadata might be used for something else, and we want to allow multiple thumbnails tracks. Tracks must have a unique combination of 'kind' and 'label'. We would have to do something like kind=metadata,label=thumbnails1 / kind=metadata,label=thumbnails2. Square peg, round hole
 * - VTT info: the image URL is relative to the VTT, not the current document. But if the url starts with a slash, it will naturally be relative to the current domain. https://support.jwplayer.com/articles/how-to-add-preview-thumbnails
 * - This implementation uses multiple separate img elements. Other implementations use background-image on one element. This would be nice and simple, but Firefox and Safari have flickering issues with replacing backgrounds of larger images. It seems that Youtube perhaps only avoids this because they don't have the option for high-res previews (even the fullscreen ones, when mousedown/seeking). Images appear over the top of each other, and previous ones are discarded once the new ones have been rendered
 */

class PreviewThumbnails {
    /**
     * PreviewThumbnails constructor.
     * @param {object} player
     * @return {PreviewThumbnails}
     */
    constructor(player) {
        this.player = player;
        this.thumbnailsDefs = [];
        this.lastMousemoveEventTime = Date.now();
        this.mouseDown = false;
        this.loadedImages = [];

        if (this.enabled) {
            this.load();
        }
    }

    get enabled() {
        return (
            this.player.isHTML5 && 
            this.player.isVideo && 
            this.player.config.previewThumbnails.enabled
        );
    }

    load() {
        // Turn off the regular seek tooltip
        this.player.config.tooltips.seek = false;

        this.getThumbnailsDefs()
            .then(() => {
                // Initiate DOM listeners so that our preview thumbnails can be used
                this.listeners();

                // Build HTML DOM elements
                this.elements();

                // Check to see if thumb container size was specified manually in CSS
                this.determineContainerAutoSizing();
            });
    }

    // Download VTT files and parse them
    getThumbnailsDefs() {
        return new Promise((resolve, reject) => {
            if (!this.player.config.previewThumbnails.src) {
                throw new Error('Missing previewThumbnails.src config attribute');
            }

            // previewThumbnails.src can be string or list. If string, convert into single-element list
            const configSrc = this.player.config.previewThumbnails.src
            const urls = typeof configSrc === 'string' ? [configSrc] : configSrc
            const promises = [];

            // Loop through each src url. Download and process the VTT file, storing the resulting data in this.thumbnailsDefs
            for (const url of urls) {
                promises.push(this.getThumbnailDef(url));
            }

            Promise.all(promises)
                .then(() => {
                    // Sort smallest to biggest (e.g., [120p, 480p, 1080p])
                    this.thumbnailsDefs.sort((x, y) => x.height - y.height)
                    this.player.debug.log('Preview thumbnails: thumbnailsDefs: ' + JSON.stringify(this.thumbnailsDefs, null, 4))

                    resolve()
                });
        })
    }

    // Process individual VTT file
    getThumbnailDef(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    const thumbnailsDef = {
                        frames: this.parseVtt(response),
                        height: null,
                        urlPrefix: '',
                    };

                    // If the URLs don't start with '/', then we need to set their relative path to be the location of the VTT file
                    // If the URLs do start with '/', then they obviously don't need a prefix, so it will remain blank
                    if (!thumbnailsDef.frames[0].text.startsWith('/')) {
                        thumbnailsDef.urlPrefix = url.substring(0, url.lastIndexOf('/') + 1);
                    }

                    // Download the first frame, so that we can determine/set the height of this thumbnailsDef
                    const tempImage = new Image();
                    tempImage.src = thumbnailsDef.urlPrefix + thumbnailsDef.frames[0].text;
                    tempImage.onload = () => {
                        thumbnailsDef.height = tempImage.naturalHeight;
                        thumbnailsDef.width = tempImage.naturalWidth;

                        this.thumbnailsDefs.push(thumbnailsDef);

                        resolve();
                    }
                })
        })
    }

    /**
     * Setup hooks for Plyr and window events
     */
    listeners() {
        // Mouse hover over seek bar
        on.call(
            this.player,
            this.player.elements.progress,
            'mousemove',
            event => {
                // Wait until media has a duration
                if (this.player.media.duration) {
                    // Calculate seek hover position as approx video seconds
                    const clientRect = this.player.elements.progress.getBoundingClientRect();
                    const percentage = 100 / clientRect.width * (event.pageX - clientRect.left);
                    this.seekTime = this.player.media.duration * (percentage / 100);
                    if (this.seekTime < 0) this.seekTime = 0; // The mousemove fires for 10+px out to the left
                    if (this.seekTime > this.player.media.duration - 1) this.seekTime = this.player.media.duration - 1; // Took 1 second off the duration for safety, because different players can disagree on the real duration of a video
                    this.mousePosX = event.pageX;

                    // Set time text inside image container
                    this.player.elements.display.previewThumbnailTimeText.innerText = formatTime(this.seekTime);

                    // Download and show image
                    this.showImageAtCurrentTime();
                }
            }
        );

        // Touch device seeking - performs same function as above
        on.call(
            this.player,
            this.player.elements.progress,
            'touchmove',
            event => {
                // Wait until media has a duration
                if (this.player.media.duration) {
                    // Calculate seek hover position as approx video seconds
                    this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);

                    // Download and show image
                    this.showImageAtCurrentTime();
                }
            }
        );

        // Hide thumbnail preview - on mouse click, mouse leave, and video play/seek. All four are required, e.g., for buffering
        on.call(
            this.player,
            this.player.elements.progress,
            'mouseleave click',
            () => {
                this.hideThumbContainer(true);
            }
        );
        this.player.on('play', () => {
            this.hideThumbContainer(true);
        });
        this.player.on('seeked', () => {
            this.hideThumbContainer(false);
        });

        // Show scrubbing preview
        on.call(
            this.player,
            this.player.elements.progress,
            'mousedown touchstart',
            event => {
                // Only act on left mouse button (0), or touch device (!event.button)
                if (!event.button || event.button === 0) {
                    this.mouseDown = true;
                    // Wait until media has a duration
                    if (this.player.media.duration) {
                        this.showScrubbingContainer();
                        this.hideThumbContainer(true);

                        // Download and show image
                        this.showImageAtCurrentTime();
                    }
                }
            }
        );
        on.call(
            this.player,
            this.player.media,
            'timeupdate',
            () => {
                this.timeAtLastTimeupdate = this.player.media.currentTime;
            }
        );
        on.call(
            this.player,
            this.player.elements.progress,
            'mouseup touchend',
            () => {
                this.mouseDown = false;

                // Hide scrubbing preview. But wait until the video has successfully seeked before hiding the scrubbing preview
                if (Math.ceil(this.timeAtLastTimeupdate) === Math.ceil(this.player.media.currentTime)) {
                    // The video was already seeked/loaded at the chosen time - hide immediately
                    this.hideScrubbingContainer();
                } else {
                    // The video hasn't seeked yet. Wait for that
                    once.call(
                        this.player,
                        this.player.media,
                        'timeupdate',
                        () => {
                            // Re-check mousedown - we might have already started scrubbing again
                            if (!this.mouseDown) {
                                this.hideScrubbingContainer();
                            }
                        }
                    );
                }
            }
        );
    }

    /**
     * Create HTML elements for image containers
     */
    elements() {
        // Create HTML element: plyr__preview-thumbnail-container
        const previewThumbnailContainer = createElement(
            'div',
            {
                class: this.player.config.classNames.previewThumbnails.thumbnailContainer,
            },
        );

        this.player.elements.progress.appendChild(previewThumbnailContainer);
        this.player.elements.display.previewThumbnailContainer = previewThumbnailContainer;

        // Create HTML element, parent+span: time text (e.g., 01:32:00)
        const timeTextContainer = createElement(
            'div',
            {
                class: this.player.config.classNames.previewThumbnails.timeTextContainer
            },
        );

        this.player.elements.display.previewThumbnailContainer.appendChild(timeTextContainer);

        const timeText = createElement(
            'span',
            {},
            '00:00',
        );

        timeTextContainer.appendChild(timeText);
        this.player.elements.display.previewThumbnailTimeText = timeText;

        // Create HTML element: plyr__preview-scrubbing-container
        const previewScrubbingContainer = createElement(
            'div',
            {
                class: this.player.config.classNames.previewThumbnails.scrubbingContainer,
            },
        );

        this.player.elements.wrapper.appendChild(previewScrubbingContainer);
        this.player.elements.display.previewScrubbingContainer = previewScrubbingContainer;
    }

    showImageAtCurrentTime() {
        if (this.mouseDown) {
            this.setScrubbingContainerSize();
        } else {
            this.showThumbContainer();
            this.setThumbContainerSizeAndPos();
        }

        // Find the desired thumbnail index
        const thumbNum = this.thumbnailsDefs[0].frames.findIndex(frame => this.seekTime >= frame.startTime && this.seekTime <= frame.endTime);
        let qualityIndex = 0;

        // Check to see if we've already downloaded higher quality versions of this image
        for (let i = 1; i < this.thumbnailsDefs.length; i++) {
            if (this.loadedImages.includes(this.thumbnailsDefs[i].frames[thumbNum].text)) {
                qualityIndex = i;
            }
        }

        // Only proceed if either thumbnum or thumbfilename has changed
        if (thumbNum !== this.showingThumb) {
            this.showingThumb = thumbNum;
            this.loadImage(qualityIndex);
        }
    }

    // Show the image that's currently specified in this.showingThumb
    loadImage(qualityIndex = 0) {
        let thumbNum = this.showingThumb;

        const frame = this.thumbnailsDefs[qualityIndex].frames[thumbNum];
        const thumbFilename = this.thumbnailsDefs[qualityIndex].frames[thumbNum].text;
        const urlPrefix = this.thumbnailsDefs[qualityIndex].urlPrefix;
        const thumbURL = urlPrefix + thumbFilename;

        if (!this.currentImageElement || this.currentImageElement.getAttribute('data-thumbfilename') !== thumbFilename) {
            // If we're already loading a previous image, remove its onload handler - we don't want it to load after this one
            // Only do this if not using jpeg sprites. Without jpeg sprites we really want to show as many images as possible, as a best-effort
            if (this.loadingImage && this.usingJpegSprites) this.loadingImage.onload = null;

            // We're building and adding a new image. In other implementations of similar functionality (Youtube), background image is instead used. But this causes issues with larger images in Firefox and Safari - switching between background images causes a flicker. Putting a new image over the top does not
            const previewImage = new Image();
            previewImage.src = thumbURL;
            previewImage.setAttribute('data-thumbnum', thumbNum);
            previewImage.setAttribute('data-thumbfilename', thumbFilename);
            this.showingThumbFilename = thumbFilename;

            // For some reason, passing the named function directly causes it to execute immediately. So I've wrapped it in an anonymous function...
            previewImage.onload = () => this.showImage(previewImage, frame, qualityIndex, thumbNum, thumbFilename, true);
            this.loadingImage = previewImage;
            this.removeOldImages(previewImage);
        } else {
            // Update the existing image
            this.showImage(this.currentImageElement, frame, qualityIndex, thumbNum, thumbFilename, false);
            this.currentImageElement.setAttribute('data-thumbnum', thumbNum);
            this.removeOldImages(this.currentImageElement);
        }
    }

    showImage(previewImage, frame, qualityIndex, thumbNum, thumbFilename, newImage = true) {
        this.player.debug.log('Showing thumb: ' + thumbFilename + '. num: ' + thumbNum + '. qual: ' + qualityIndex + '. newimg: ' + newImage);
        this.setImageSizeAndOffset(previewImage, frame);

        if (newImage) {
            this.currentContainer.appendChild(previewImage);
            this.currentImageElement = previewImage;

            if (!this.loadedImages.includes(thumbFilename)) this.loadedImages.push(thumbFilename);
        }

        // Preload images before and after the current one
        // Show higher quality of the same frame
        // Each step here has a short time delay, and only continues if still hovering/seeking the same spot. This is to protect slow connections from overloading
        this.preloadNearby(thumbNum, true)
            .then(this.preloadNearby(thumbNum, false))
            .then(this.getHigherQuality(qualityIndex, previewImage, frame, thumbFilename));
    }

    // Remove all preview images that aren't the designated current image
    removeOldImages(currentImage) {
        // Get a list of all images, convert it from a DOM list to an array
        const allImages = Array.from(this.currentContainer.children);

        for (let image of allImages) {
            if (image.tagName === 'IMG') {
                const removeDelay = this.usingJpegSprites ? 500 : 1000;

                if (image.getAttribute('data-thumbnum') !== currentImage.getAttribute('data-thumbnum') && !image.getAttribute('data-deleting')) {
                    // Wait 200ms, as the new image can take some time to show on certain browsers (even though it was downloaded before showing). This will prevent flicker, and show some generosity towards slower clients
                    // First set attribute 'deleting' to prevent multi-handling of this on repeat firing of this function
                    image.setAttribute('data-deleting', 'true');
                    const currentContainer = this.currentContainer; // This has to be set before the timeout - to prevent issues switching between hover and scrub

                    setTimeout(() => {
                        currentContainer.removeChild(image);
                        this.player.debug.log('Removing thumb: ' + image.getAttribute('data-thumbfilename'));
                    }, removeDelay)
                }
            }
        }
    }

    // Preload images before and after the current one. Only if the user is still hovering/seeking the same frame
    // This will only preload the lowest quality
    preloadNearby(thumbNum, forward = true) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const oldThumbFilename = this.thumbnailsDefs[0].frames[thumbNum].text;

                if (this.showingThumbFilename === oldThumbFilename) {
                    // Find the nearest thumbs with different filenames. Sometimes it'll be the next index, but in the case of jpeg sprites, it might be 100+ away
                    let thumbnailsDefsCopy
                    if (forward) {
                        thumbnailsDefsCopy = this.thumbnailsDefs[0].frames.slice(thumbNum);
                    } else {
                        thumbnailsDefsCopy = this.thumbnailsDefs[0].frames.slice(0, thumbNum).reverse();
                    }

                    let foundOne = false;

                    for (const frame of thumbnailsDefsCopy) {
                        const newThumbFilename = frame.text;

                        if (newThumbFilename !== oldThumbFilename) {
                            // Found one with a different filename. Make sure it hasn't already been loaded on this page visit
                            if (!this.loadedImages.includes(newThumbFilename)) {
                                foundOne = true;
                                this.player.debug.log('Preloading thumb filename: ' + newThumbFilename);

                                const urlPrefix = this.thumbnailsDefs[0].urlPrefix;
                                const thumbURL = urlPrefix + newThumbFilename;

                                const previewImage = new Image();
                                previewImage.src = thumbURL;
                                previewImage.onload = () => {
                                    this.player.debug.log('Preloaded thumb filename: ' + newThumbFilename);
                                    if (!this.loadedImages.includes(newThumbFilename)) this.loadedImages.push(newThumbFilename);

                                    // We don't resolve until the thumb is loaded
                                    resolve()
                                };
                            }

                            break;
                        }
                    }

                    // If there are none to preload then we want to resolve immediately
                    if (!foundOne) resolve();
                }
            }, 300)
        })
    }

    // If user has been hovering current image for half a second, look for a higher quality one
    getHigherQuality(currentQualityIndex, previewImage, frame, thumbFilename) {
        if (currentQualityIndex < this.thumbnailsDefs.length - 1) {
            // Only use the higher quality version if it's going to look any better - if the current thumb is of a lower pixel density than the thumbnail container
            let previewImageHeight = previewImage.naturalHeight;
            if (this.usingJpegSprites) previewImageHeight = frame.h;

            if (previewImageHeight < this.thumbContainerHeight) {
                // Recurse back to the loadImage function - show a higher quality one, but only if the viewer is on this frame for a while
                setTimeout(() => {
                    // Make sure the mouse hasn't already moved on and started hovering at another image
                    if (this.showingThumbFilename === thumbFilename) {
                        this.player.debug.log('Showing higher quality thumb for: ' + thumbFilename)
                        this.loadImage(currentQualityIndex + 1);
                    }
                }, 300)
            }
        }
    }

    get currentContainer() {
        if (this.mouseDown) {
            return this.player.elements.display.previewScrubbingContainer;
        } else {
            return this.player.elements.display.previewThumbnailContainer;
        }
    }

    get usingJpegSprites() {
        if (this.thumbnailsDefs[0].frames[0].w) {
            return true;
        } else {
            return false;
        }
    }

    get thumbAspectRatio() {
        if (this.usingJpegSprites) {
            return this.thumbnailsDefs[0].frames[0].w / this.thumbnailsDefs[0].frames[0].h;
        } else {
            return this.thumbnailsDefs[0].width / this.thumbnailsDefs[0].height;
        }
    }

    get thumbContainerHeight() {
        if (this.mouseDown) {
            // return this.player.elements.container.clientHeight;
            // return this.player.media.clientHeight;
            return this.player.media.clientWidth / this.thumbAspectRatio; // Can't use media.clientHeight - html5 video goes big and does black bars above and below
        } else {
            // return this.player.elements.container.clientHeight / 4;
            return this.player.media.clientWidth / this.thumbAspectRatio / 4;
        }
    }

    get currentImageElement() {
        if (this.mouseDown) {
            return this.currentScrubbingImageElement;
        } else {
            return this.currentThumbnailImageElement;
        }
    }
    set currentImageElement(element) {
        if (this.mouseDown) {
            this.currentScrubbingImageElement = element;
        } else {
            this.currentThumbnailImageElement = element;
        }
    }

    showThumbContainer() {
        this.player.elements.display.previewThumbnailContainer.style.opacity = 1;
    }
    hideThumbContainer(clearShowing = false) {
        this.player.elements.display.previewThumbnailContainer.style.opacity = 0;

        if (clearShowing) {
            this.showingThumb = null;
            this.showingThumbFilename = null;
        }
    }

    showScrubbingContainer() {
        this.player.elements.display.previewScrubbingContainer.style.opacity = 1;
    }
    hideScrubbingContainer() {
        this.player.elements.display.previewScrubbingContainer.style.opacity = 0;
        this.showingThumb = null;
        this.showingThumbFilename = null;
    }

    determineContainerAutoSizing() {
        if (this.player.elements.display.previewThumbnailContainer.clientHeight > 20) {
            this.sizeSpecifiedInCSS = true; // This will prevent auto sizing in this.setThumbContainerSizeAndPos()
        }
    }

    // Set the size to be about a quarter of the size of video. Unless option dynamicSize === false, in which case it needs to be set in CSS
    setThumbContainerSizeAndPos() {
        if (!this.sizeSpecifiedInCSS) {
            const thumbWidth = this.thumbContainerHeight * this.thumbAspectRatio;
            this.player.elements.display.previewThumbnailContainer.style.height = `${this.thumbContainerHeight}px`;
            this.player.elements.display.previewThumbnailContainer.style.width = `${thumbWidth}px`;
        }

        this.setThumbContainerPos();
    }

    setThumbContainerPos() {
        const seekbarRect = this.player.elements.progress.getBoundingClientRect();
        const plyrRect = this.player.elements.container.getBoundingClientRect();
        const previewContainer = this.player.elements.display.previewThumbnailContainer;

        // Find the lowest and highest desired left-position, so we don't slide out the side of the video container
        const minVal = (plyrRect.left - seekbarRect.left + 10);
        const maxVal = (plyrRect.right - seekbarRect.left - (previewContainer.clientWidth) - 10);

        // Set preview container position to: mousepos, minus seekbar.left, minus half of previewContainer.clientWidth
        let previewPos = this.mousePosX - seekbarRect.left - (previewContainer.clientWidth / 2);
        if (previewPos < minVal) {
            previewPos = minVal;
        }
        if (previewPos > maxVal) {
            previewPos = maxVal;
        }
        previewContainer.style.left = previewPos + 'px';
    }

    // Can't use 100% width, in case the video is a different aspect ratio to the video container
    setScrubbingContainerSize() {
        this.player.elements.display.previewScrubbingContainer.style.width = `${this.player.media.clientWidth}px`;
        this.player.elements.display.previewScrubbingContainer.style.height = `${this.player.media.clientWidth/this.thumbAspectRatio}px`; // Can't use media.clientHeight - html5 video goes big and does black bars above and below
    }

    // Jpeg sprites need to be offset to the correct location
    setImageSizeAndOffset(previewImage, frame) {
        if (this.usingJpegSprites) {
            // Find difference between jpeg height and preview container height
            const heightMulti = this.thumbContainerHeight / frame.h;

            previewImage.style.height = `${previewImage.naturalHeight * heightMulti}px`;
            previewImage.style.width = `${previewImage.naturalWidth * heightMulti}px`;
            previewImage.style.left = `-${Math.ceil(frame.x * heightMulti)}px`;
            previewImage.style.top = `-${frame.y * heightMulti}px`; // todo: might need to round this one up too
        }
    }

    // Arg: vttDataString example: "WEBVTT\n\n1\n00:00:05.000 --> 00:00:10.000\n1080p-00001.jpg"
    parseVtt(vttDataString) {
        const processedList = [];
        const frames = vttDataString.split(/\r\n\r\n|\n\n|\r\r/);

        for (const frame of frames) {
            const result = {};

            for (const line of frame.split(/\r\n|\n|\r/)) {
                if (result.startTime == null) {
                    // The line with start and end times on it is the first line of interest
                    const matchTimes = line.match(/([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{2,3})/) // Note that this currently ignores caption formatting directives that are optionally on the end of this line - fine for non-captions VTT

                    if (matchTimes) {
                        result.startTime = Number(matchTimes[1]) * 60 * 60 + Number(matchTimes[2]) * 60 + Number(matchTimes[3]) + Number("0." + matchTimes[4])
                        result.endTime = Number(matchTimes[6]) * 60 * 60 + Number(matchTimes[7]) * 60 + Number(matchTimes[8]) + Number("0." + matchTimes[9])
                    }
                } else {
                    // If we already have the startTime, then we're definitely up to the text line(s)
                    if (line.trim().length > 0) {
                        if (!result.text) {
                            const lineSplit = line.trim().split('#xywh=');
                            result.text = lineSplit[0];

                            // If there's content in lineSplit[1], then we have jpeg sprites. If not, then it's just one frame per jpeg
                            if (lineSplit[1]) {
                                const xywh = lineSplit[1].split(',');
                                result.x = xywh[0];
                                result.y = xywh[1];
                                result.w = xywh[2];
                                result.h = xywh[3];
                            }
                        }
                    }
                }
            }

            if (result.text) {
                processedList.push(result);
            }
        }

        return processedList;
    }
}

export default PreviewThumbnails;
