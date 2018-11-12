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
        this.showingThumb = null; // Index of the currently displayed thumbnail
        this.lastMousemoveEventTime = Date.now();
        this.mouseDown = false;
        this.imageShowCounter = 0;
        this.imageTryShowCounter = 0;

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
        this.getThumbnailsDefs()
            .then(() => {
                // Initiate DOM listeners so that our preview thumbnails can be used
                this.listeners();

                // Build HTML DOM elements
                this.elements();

                // Turn off the regular seek tooltip
                this.player.config.tooltips.seek = false;

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
    getThumbnailDef (url) {
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
                this.hideThumbContainer();
            }
        );
        this.player.on('play', () => {
            this.hideThumbContainer();
        });
        this.player.on('seeked', () => {
            this.hideThumbContainer();
        });

        // Show scrubbing preview
        on.call(
            this.player,
            this.player.elements.progress,
            'mousedown touchstart',
            () => {
                this.mouseDown = true;
                this.showScrubbingContainer();
                this.hideThumbContainer();
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
                class: this.player.config.classNames.previewThumbnailContainer,
            },
        );

        this.player.elements.progress.appendChild(previewThumbnailContainer);
        this.player.elements.display.previewThumbnailContainer = previewThumbnailContainer;

        const timeText = createElement(
            'span',
            {},
            '00:00',
        );

        this.player.elements.display.previewThumbnailContainer.appendChild(timeText);
        this.player.elements.display.previewThumbnailTimeText = timeText;

        // Create HTML element: plyr__preview-scrubbing-container
        const previewScrubbingContainer = createElement(
            'div',
            {
                class: this.player.config.classNames.previewScrubbingContainer,
            },
        );

        this.player.elements.wrapper.appendChild(previewScrubbingContainer);
        this.player.elements.display.previewScrubbingContainer = previewScrubbingContainer;
    }

    showImageAtCurrentTime () {
        if (!this.mouseDown) {
            this.showThumbContainer();
        }

        this.setThumbContainerSizeAndPos();

        // Check when we last loaded an image - don't show more than one new one every 500ms
        if (this.lastMousemoveEventTime < Date.now() - 150) {
            this.lastMousemoveEventTime = Date.now();

            // Find the first thumbnail that's after `time`. Note `this.seekTime+1` - we're actually looking 1 second ahead, because it's more likely then that the viewer will actually get to see the preview frame in the actual video. This hack should be removed if we ever choose to make it seek to the nearest thumb time
            const thumbNum = this.thumbnailsDefs[0].frames.findIndex(frame => this.seekTime+1 >= frame.startTime && this.seekTime <= frame.endTime);

            // Only show if the thumbnail to show is different to last time
            if (thumbNum !== this.showingThumb) {
                this.showingThumb = thumbNum;
                this.showImage();
            }
        } else {
            // Set a timeout so that we always fire this function once after the mouse stops moving. If not for this, the mouse preview would often be a bit stale
            if (!this.mousemoveEventTimeout) {
                this.mousemoveEventTimeout = setTimeout(() => {
                    // Don't follow through after the timeout if it's since been hidden
                    if (this.player.elements.display.previewThumbnailContainer.style.opacity === 1) {
                        this.showImageAtCurrentTime();
                        this.mousemoveEventTimeout = null;
                    }
                }, 200)
            }
        }
    }

    // Show the image that's currently specified in this.showingThumb
    showImage (qualityIndex = 0) {
        this.imageTryShowCounter += 1;
        const localImageTryShowCounter = this.imageTryShowCounter;
        let thumbNum = this.showingThumb;

        if (thumbNum === this.thumbnailsDefs[qualityIndex].frames.length) {
            // It can attempt to preview up to 5 seconds out past the end of the video. So we'll just show the last frame
            thumbNum -= 1;
            this.showingThumb = thumbNum;
        }

        this.player.debug.log(`Preview thumbnails: showing thumbnum: ${thumbNum}: ${JSON.stringify(this.thumbnailsDefs[qualityIndex].frames[thumbNum])}`);

        const thumbFilename = this.thumbnailsDefs[qualityIndex].frames[thumbNum].text;
        const urlPrefix = this.thumbnailsDefs[qualityIndex].urlPrefix;
        const thumbURL = urlPrefix + thumbFilename;

        // We're building and adding a new image. In other implementations of similar functionality (Youtube), background image is instead used. But this causes issues with larger images in Firefox and Safari - switching between background images causes a flicker. Putting a new image over the top does not
        const previewImage = new Image();
        previewImage.src = thumbURL;
        previewImage.setAttribute('data-thumbnum', thumbNum);

        previewImage.onload = () => {
            // Many images are loaded within milliseconds of each other. An earlier one might be the last one to finish loading. Make sure we don't show an images out of order
            if (localImageTryShowCounter >= this.imageShowCounter) {
                this.imageShowCounter = localImageTryShowCounter;

                this.currentContainer.appendChild(previewImage);

                // Now that this one is showing, start pre-loading a batch of nearby images. But only if this isn't a revisit
                // this.preloadNearbyImages(thumbNum);
                this.thumbnailsDefs[qualityIndex].frames[thumbNum].loaded = true

                this.removeOldImages();

                // Look for a higher quality version of the same frame
                if (qualityIndex < this.thumbnailsDefs.length - 1) {
                    // Only use the higher quality version if it's going to look any better - if the current thumb is of a lower pixel density than the thumbnail container
                    let previewContainerHeight = this.player.elements.display.previewThumbnailContainer.clientHeight;
                    if (this.mouseDown) previewContainerHeight = this.player.elements.display.previewScrubbingContainer.clientHeight;
                    // Adjust for HiDPI screen
                    if (window.devicePixelRatio) previewContainerHeight *= window.devicePixelRatio;

                    if (previewImage.naturalHeight < previewContainerHeight) {
                        // Recurse this function - show a higher quality one, but only if the viewer is on this frame for a while
                        setTimeout(() => {
                            // Make sure the mouse hasn't already moved on and started hovering at another frame
                            if (this.showingThumb === thumbNum) {
                                this.showImage(qualityIndex + 1);
                            }
                        }, 150)
                    }
                }
            }
        }
    }

    // Not using this -- Preloading looked like maybe a good idea, but it seems to actually cause more trouble than it solves. Slow connections get really backed up. Fast connections don't really need it
    // If we were to try using this again, we might need to look at not starting a second preload while another is still going?
    preloadNearbyImages(thumbNum, amountToPreload=30) {
        const actualShowingThumb = [...this.currentContainer.children].reverse()[0].getAttribute('data-thumbnum');
        if (actualShowingThumb && Number(actualShowingThumb) === this.showingThumb) {
            let startNum = thumbNum - amountToPreload/2;
            let endNum = thumbNum + amountToPreload/2;
            if (startNum < 0) startNum = 0;
            if (endNum > this.thumbnailsDefs[0].frames.length - 1) endNum = this.thumbnailsDefs[0].frames.length - 1;

            for (let i = startNum; i <= endNum; i++) {
                if (!this.thumbnailsDefs[0].frames[i].loaded) {
                    this.player.debug.log('Thumbnail previews: preloading: ' + i);

                    const thumbFilename = this.thumbnailsDefs[0].frames[i].text;
                    const urlPrefix = this.thumbnailsDefs[0].urlPrefix;
                    const thumbURL = urlPrefix + thumbFilename;

                    // We're building and adding a new image. In other implementations of similar functionality (Youtube), background image is instead used. But this causes issues with larger images in Firefox and Safari - switching between background images causes a flicker. Putting a new image over the top does not
                    const previewImage = new Image();
                    previewImage.src = thumbURL;

                    // Set loaded attribute. This will prevent us from wasting CPU constantly trying to preload images that we already have loaded
                    this.thumbnailsDefs[0].frames[i].loaded = true;
                }
            }
        }
    }

    removeOldImages() {
        // Get a list of all images, and reverse it - so that we can start from the end and delete all except for the most recent
        const allImages = [...this.currentContainer.children].reverse();

        // Start at the third image image - so we leave the last two images. Leaving only one might result in flickering if the newest one hasn't finished rendering yet
        for (let i = 2; i < allImages.length; i++) {
            if (allImages[i].tagName === 'IMG') {
                this.currentContainer.removeChild(allImages[i]);
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

    showThumbContainer() {
        this.player.elements.display.previewThumbnailContainer.style.opacity = 1;
    }
    hideThumbContainer() {
        this.player.elements.display.previewThumbnailContainer.style.opacity = 0;
    }

    showScrubbingContainer() {
        this.player.elements.display.previewScrubbingContainer.style.opacity = 1;
    }
    hideScrubbingContainer() {
        this.player.elements.display.previewScrubbingContainer.style.opacity = 0;
    }

    determineContainerAutoSizing() {
        if (this.player.elements.display.previewThumbnailContainer.clientHeight > 20) {
            this.sizeSpecifiedInCSS = true; // This will prevent auto sizing in this.setThumbContainerSizeAndPos()
        }
    }

    // Set the size to be about a quarter of the size of video. Unless option dynamicSize === false, in which case it needs to be set in CSS
    setThumbContainerSizeAndPos() {
        // if (this.player.config.previewThumbnails.autoSize) {
        if (!this.sizeSpecifiedInCSS) {
            const videoAspectRatio = this.player.media.videoWidth / this.player.media.videoHeight;
            const thumbHeight = this.player.elements.container.clientHeight / 4;
            const thumbWidth = thumbHeight * videoAspectRatio;
            this.player.elements.display.previewThumbnailContainer.style.height = `${thumbHeight}px`;
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

    // Arg: vttDataString example: "WEBVTT\n\n1\n00:00:05.000 --> 00:00:10.000\n1080p-00001.jpg"
    parseVtt (vttDataString) {
      const processedList = []
      const frames = vttDataString.split(/\r\n\r\n|\n\n|\r\r/)

      for (const frame of frames) {
        const result = {}

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
                result.text = line.trim()
              } else {
                result.text += '\n' + line.trim()
              }
            }
          }
        }

        if (result.text) {
          processedList.push(result)
        }
      }

      return processedList
    }
}

export default PreviewThumbnails;
