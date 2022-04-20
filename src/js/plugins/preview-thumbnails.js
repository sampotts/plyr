import { createElement } from '../utils/elements';
import { once } from '../utils/events';
import fetch from '../utils/fetch';
import is from '../utils/is';
import { clamp } from '../utils/numbers';
import { formatTime } from '../utils/time';

// Arg: vttDataString example: "WEBVTT\n\n1\n00:00:05.000 --> 00:00:10.000\n1080p-00001.jpg"
const parseVtt = (vttDataString) => {
  const processedList = [];
  const frames = vttDataString.split(/\r\n\r\n|\n\n|\r\r/);

  frames.forEach((frame) => {
    const result = {};
    const lines = frame.split(/\r\n|\n|\r/);

    lines.forEach((line) => {
      if (!is.number(result.startTime)) {
        // The line with start and end times on it is the first line of interest
        const matchTimes = line.match(
          /([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/,
        ); // Note that this currently ignores caption formatting directives that are optionally on the end of this line - fine for non-captions VTT

        if (matchTimes) {
          result.startTime =
            Number(matchTimes[1] || 0) * 60 * 60 +
            Number(matchTimes[2]) * 60 +
            Number(matchTimes[3]) +
            Number(`0.${matchTimes[4]}`);
          result.endTime =
            Number(matchTimes[6] || 0) * 60 * 60 +
            Number(matchTimes[7]) * 60 +
            Number(matchTimes[8]) +
            Number(`0.${matchTimes[9]}`);
        }
      } else if (!is.empty(line.trim()) && is.empty(result.text)) {
        // If we already have the startTime, then we're definitely up to the text line(s)
        const lineSplit = line.trim().split('#xywh=');
        [result.text] = lineSplit;

        // If there's content in lineSplit[1], then we have sprites. If not, then it's just one frame per image
        if (lineSplit[1]) {
          [result.x, result.y, result.w, result.h] = lineSplit[1].split(',');
        }
      }
    });

    if (result.text) {
      processedList.push(result);
    }
  });

  return processedList;
};

/**
 * Preview thumbnails for seek hover and scrubbing
 * Seeking: Hover over the seek bar (desktop only): shows a small preview container above the seek bar
 * Scrubbing: Click and drag the seek bar (desktop and mobile): shows the preview image over the entire video, as if the video is scrubbing at very high speed
 *
 * Notes:
 * - Thumbs are set via JS settings on Plyr init, not HTML5 'track' property. Using the track property would be a bit gross, because it doesn't support custom 'kinds'. kind=metadata might be used for something else, and we want to allow multiple thumbnails tracks. Tracks must have a unique combination of 'kind' and 'label'. We would have to do something like kind=metadata,label=thumbnails1 / kind=metadata,label=thumbnails2. Square peg, round hole
 * - VTT info: the image URL is relative to the VTT, not the current document. But if the url starts with a slash, it will naturally be relative to the current domain. https://support.jwplayer.com/articles/how-to-add-preview-thumbnails
 * - This implementation uses multiple separate img elements. Other implementations use background-image on one element. This would be nice and simple, but Firefox and Safari have flickering issues with replacing backgrounds of larger images. It seems that YouTube perhaps only avoids this because they don't have the option for high-res previews (even the fullscreen ones, when mousedown/seeking). Images appear over the top of each other, and previous ones are discarded once the new ones have been rendered
 */

const fitRatio = (ratio, outer) => {
  const targetRatio = outer.width / outer.height;
  const result = {};
  if (ratio > targetRatio) {
    result.width = outer.width;
    result.height = (1 / ratio) * outer.width;
  } else {
    result.height = outer.height;
    result.width = ratio * outer.height;
  }

  return result;
};

class PreviewThumbnails {
  /**
   * PreviewThumbnails constructor.
   * @param {Plyr} player
   * @return {PreviewThumbnails}
   */
  constructor(player) {
    this.player = player;
    this.thumbnails = [];
    this.loaded = false;
    this.lastMouseMoveTime = Date.now();
    this.mouseDown = false;
    this.loadedImages = [];

    this.elements = {
      thumb: {},
      scrubbing: {},
    };

    this.load();
  }

  get enabled() {
    return this.player.isHTML5 && this.player.isVideo && this.player.config.previewThumbnails.enabled;
  }

  load = () => {
    // Toggle the regular seek tooltip
    if (this.player.elements.display.seekTooltip) {
      this.player.elements.display.seekTooltip.hidden = this.enabled;
    }

    if (!this.enabled) return;

    this.getThumbnails().then(() => {
      if (!this.enabled) {
        return;
      }

      // Render DOM elements
      this.render();

      // Check to see if thumb container size was specified manually in CSS
      this.determineContainerAutoSizing();

      this.loaded = true;
    });
  };

  // Download VTT files and parse them
  getThumbnails = () => {
    return new Promise((resolve) => {
      const { src } = this.player.config.previewThumbnails;

      if (is.empty(src)) {
        throw new Error('Missing previewThumbnails.src config attribute');
      }

      // Resolve promise
      const sortAndResolve = () => {
        // Sort smallest to biggest (e.g., [120p, 480p, 1080p])
        this.thumbnails.sort((x, y) => x.height - y.height);

        this.player.debug.log('Preview thumbnails', this.thumbnails);

        resolve();
      };

      // Via callback()
      if (is.function(src)) {
        src((thumbnails) => {
          this.thumbnails = thumbnails;
          sortAndResolve();
        });
      }
      // VTT urls
      else {
        // If string, convert into single-element list
        const urls = is.string(src) ? [src] : src;
        // Loop through each src URL. Download and process the VTT file, storing the resulting data in this.thumbnails
        const promises = urls.map((u) => this.getThumbnail(u));
        // Resolve
        Promise.all(promises).then(sortAndResolve);
      }
    });
  };

  // Process individual VTT file
  getThumbnail = (url) => {
    return new Promise((resolve) => {
      fetch(url).then((response) => {
        const thumbnail = {
          frames: parseVtt(response),
          height: null,
          urlPrefix: '',
        };

        // If the URLs don't start with '/', then we need to set their relative path to be the location of the VTT file
        // If the URLs do start with '/', then they obviously don't need a prefix, so it will remain blank
        // If the thumbnail URLs start with with none of '/', 'http://' or 'https://', then we need to set their relative path to be the location of the VTT file
        if (
          !thumbnail.frames[0].text.startsWith('/') &&
          !thumbnail.frames[0].text.startsWith('http://') &&
          !thumbnail.frames[0].text.startsWith('https://')
        ) {
          thumbnail.urlPrefix = url.substring(0, url.lastIndexOf('/') + 1);
        }

        // Download the first frame, so that we can determine/set the height of this thumbnailsDef
        const tempImage = new Image();

        tempImage.onload = () => {
          thumbnail.height = tempImage.naturalHeight;
          thumbnail.width = tempImage.naturalWidth;

          this.thumbnails.push(thumbnail);

          resolve();
        };

        tempImage.src = thumbnail.urlPrefix + thumbnail.frames[0].text;
      });
    });
  };

  startMove = (event) => {
    if (!this.loaded) return;

    if (!is.event(event) || !['touchmove', 'mousemove'].includes(event.type)) return;

    // Wait until media has a duration
    if (!this.player.media.duration) return;

    if (event.type === 'touchmove') {
      // Calculate seek hover position as approx video seconds
      this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
    } else {
      // Calculate seek hover position as approx video seconds
      const clientRect = this.player.elements.progress.getBoundingClientRect();
      const percentage = (100 / clientRect.width) * (event.pageX - clientRect.left);
      this.seekTime = this.player.media.duration * (percentage / 100);

      if (this.seekTime < 0) {
        // The mousemove fires for 10+px out to the left
        this.seekTime = 0;
      }

      if (this.seekTime > this.player.media.duration - 1) {
        // Took 1 second off the duration for safety, because different players can disagree on the real duration of a video
        this.seekTime = this.player.media.duration - 1;
      }

      this.mousePosX = event.pageX;

      // Set time text inside image container
      this.elements.thumb.time.innerText = formatTime(this.seekTime);

      // Get marker point for time
      const point = this.player.config.markers?.points?.find(({ time: t }) => t === Math.round(this.seekTime));

      // Append the point label to the tooltip
      if (point) {
        // this.elements.thumb.time.innerText.concat('\n');
        this.elements.thumb.time.insertAdjacentHTML('afterbegin', `${point.label}<br>`);
      }
    }

    // Download and show image
    this.showImageAtCurrentTime();
  };

  endMove = () => {
    this.toggleThumbContainer(false, true);
  };

  startScrubbing = (event) => {
    // Only act on left mouse button (0), or touch device (event.button does not exist or is false)
    if (is.nullOrUndefined(event.button) || event.button === false || event.button === 0) {
      this.mouseDown = true;

      // Wait until media has a duration
      if (this.player.media.duration) {
        this.toggleScrubbingContainer(true);
        this.toggleThumbContainer(false, true);

        // Download and show image
        this.showImageAtCurrentTime();
      }
    }
  };

  endScrubbing = () => {
    this.mouseDown = false;

    // Hide scrubbing preview. But wait until the video has successfully seeked before hiding the scrubbing preview
    if (Math.ceil(this.lastTime) === Math.ceil(this.player.media.currentTime)) {
      // The video was already seeked/loaded at the chosen time - hide immediately
      this.toggleScrubbingContainer(false);
    } else {
      // The video hasn't seeked yet. Wait for that
      once.call(this.player, this.player.media, 'timeupdate', () => {
        // Re-check mousedown - we might have already started scrubbing again
        if (!this.mouseDown) {
          this.toggleScrubbingContainer(false);
        }
      });
    }
  };

  /**
   * Setup hooks for Plyr and window events
   */
  listeners = () => {
    // Hide thumbnail preview - on mouse click, mouse leave (in listeners.js for now), and video play/seek. All four are required, e.g., for buffering
    this.player.on('play', () => {
      this.toggleThumbContainer(false, true);
    });

    this.player.on('seeked', () => {
      this.toggleThumbContainer(false);
    });

    this.player.on('timeupdate', () => {
      this.lastTime = this.player.media.currentTime;
    });
  };

  /**
   * Create HTML elements for image containers
   */
  render = () => {
    // Create HTML element: plyr__preview-thumbnail-container
    this.elements.thumb.container = createElement('div', {
      class: this.player.config.classNames.previewThumbnails.thumbContainer,
    });

    // Wrapper for the image for styling
    this.elements.thumb.imageContainer = createElement('div', {
      class: this.player.config.classNames.previewThumbnails.imageContainer,
    });
    this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer);

    // Create HTML element, parent+span: time text (e.g., 01:32:00)
    const timeContainer = createElement('div', {
      class: this.player.config.classNames.previewThumbnails.timeContainer,
    });

    this.elements.thumb.time = createElement('span', {}, '00:00');
    timeContainer.appendChild(this.elements.thumb.time);

    this.elements.thumb.imageContainer.appendChild(timeContainer);

    // Inject the whole thumb
    if (is.element(this.player.elements.progress)) {
      this.player.elements.progress.appendChild(this.elements.thumb.container);
    }

    // Create HTML element: plyr__preview-scrubbing-container
    this.elements.scrubbing.container = createElement('div', {
      class: this.player.config.classNames.previewThumbnails.scrubbingContainer,
    });

    this.player.elements.wrapper.appendChild(this.elements.scrubbing.container);
  };

  destroy = () => {
    if (this.elements.thumb.container) {
      this.elements.thumb.container.remove();
    }
    if (this.elements.scrubbing.container) {
      this.elements.scrubbing.container.remove();
    }
  };

  showImageAtCurrentTime = () => {
    if (this.mouseDown) {
      this.setScrubbingContainerSize();
    } else {
      this.setThumbContainerSizeAndPos();
    }

    // Find the desired thumbnail index
    // TODO: Handle a video longer than the thumbs where thumbNum is null
    const thumbNum = this.thumbnails[0].frames.findIndex(
      (frame) => this.seekTime >= frame.startTime && this.seekTime <= frame.endTime,
    );
    const hasThumb = thumbNum >= 0;
    let qualityIndex = 0;

    // Show the thumb container if we're not scrubbing
    if (!this.mouseDown) {
      this.toggleThumbContainer(hasThumb);
    }

    // No matching thumb found
    if (!hasThumb) {
      return;
    }

    // Check to see if we've already downloaded higher quality versions of this image
    this.thumbnails.forEach((thumbnail, index) => {
      if (this.loadedImages.includes(thumbnail.frames[thumbNum].text)) {
        qualityIndex = index;
      }
    });

    // Only proceed if either thumb num or thumbfilename has changed
    if (thumbNum !== this.showingThumb) {
      this.showingThumb = thumbNum;
      this.loadImage(qualityIndex);
    }
  };

  // Show the image that's currently specified in this.showingThumb
  loadImage = (qualityIndex = 0) => {
    const thumbNum = this.showingThumb;
    const thumbnail = this.thumbnails[qualityIndex];
    const { urlPrefix } = thumbnail;
    const frame = thumbnail.frames[thumbNum];
    const thumbFilename = thumbnail.frames[thumbNum].text;
    const thumbUrl = urlPrefix + thumbFilename;

    if (!this.currentImageElement || this.currentImageElement.dataset.filename !== thumbFilename) {
      // If we're already loading a previous image, remove its onload handler - we don't want it to load after this one
      // Only do this if not using sprites. Without sprites we really want to show as many images as possible, as a best-effort
      if (this.loadingImage && this.usingSprites) {
        this.loadingImage.onload = null;
      }

      // We're building and adding a new image. In other implementations of similar functionality (YouTube), background image
      // is instead used. But this causes issues with larger images in Firefox and Safari - switching between background
      // images causes a flicker. Putting a new image over the top does not
      const previewImage = new Image();
      previewImage.src = thumbUrl;
      previewImage.dataset.index = thumbNum;
      previewImage.dataset.filename = thumbFilename;
      this.showingThumbFilename = thumbFilename;

      this.player.debug.log(`Loading image: ${thumbUrl}`);

      // For some reason, passing the named function directly causes it to execute immediately. So I've wrapped it in an anonymous function...
      previewImage.onload = () => this.showImage(previewImage, frame, qualityIndex, thumbNum, thumbFilename, true);
      this.loadingImage = previewImage;
      this.removeOldImages(previewImage);
    } else {
      // Update the existing image
      this.showImage(this.currentImageElement, frame, qualityIndex, thumbNum, thumbFilename, false);
      this.currentImageElement.dataset.index = thumbNum;
      this.removeOldImages(this.currentImageElement);
    }
  };

  showImage = (previewImage, frame, qualityIndex, thumbNum, thumbFilename, newImage = true) => {
    this.player.debug.log(
      `Showing thumb: ${thumbFilename}. num: ${thumbNum}. qual: ${qualityIndex}. newimg: ${newImage}`,
    );
    this.setImageSizeAndOffset(previewImage, frame);

    if (newImage) {
      this.currentImageContainer.appendChild(previewImage);
      this.currentImageElement = previewImage;

      if (!this.loadedImages.includes(thumbFilename)) {
        this.loadedImages.push(thumbFilename);
      }
    }

    // Preload images before and after the current one
    // Show higher quality of the same frame
    // Each step here has a short time delay, and only continues if still hovering/seeking the same spot. This is to protect slow connections from overloading
    this.preloadNearby(thumbNum, true)
      .then(this.preloadNearby(thumbNum, false))
      .then(this.getHigherQuality(qualityIndex, previewImage, frame, thumbFilename));
  };

  // Remove all preview images that aren't the designated current image
  removeOldImages = (currentImage) => {
    // Get a list of all images, convert it from a DOM list to an array
    Array.from(this.currentImageContainer.children).forEach((image) => {
      if (image.tagName.toLowerCase() !== 'img') {
        return;
      }

      const removeDelay = this.usingSprites ? 500 : 1000;

      if (image.dataset.index !== currentImage.dataset.index && !image.dataset.deleting) {
        // Wait 200ms, as the new image can take some time to show on certain browsers (even though it was downloaded before showing). This will prevent flicker, and show some generosity towards slower clients
        // First set attribute 'deleting' to prevent multi-handling of this on repeat firing of this function
        // eslint-disable-next-line no-param-reassign
        image.dataset.deleting = true;

        // This has to be set before the timeout - to prevent issues switching between hover and scrub
        const { currentImageContainer } = this;

        setTimeout(() => {
          currentImageContainer.removeChild(image);
          this.player.debug.log(`Removing thumb: ${image.dataset.filename}`);
        }, removeDelay);
      }
    });
  };

  // Preload images before and after the current one. Only if the user is still hovering/seeking the same frame
  // This will only preload the lowest quality
  preloadNearby = (thumbNum, forward = true) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const oldThumbFilename = this.thumbnails[0].frames[thumbNum].text;

        if (this.showingThumbFilename === oldThumbFilename) {
          // Find the nearest thumbs with different filenames. Sometimes it'll be the next index, but in the case of sprites, it might be 100+ away
          let thumbnailsClone;
          if (forward) {
            thumbnailsClone = this.thumbnails[0].frames.slice(thumbNum);
          } else {
            thumbnailsClone = this.thumbnails[0].frames.slice(0, thumbNum).reverse();
          }

          let foundOne = false;

          thumbnailsClone.forEach((frame) => {
            const newThumbFilename = frame.text;

            if (newThumbFilename !== oldThumbFilename) {
              // Found one with a different filename. Make sure it hasn't already been loaded on this page visit
              if (!this.loadedImages.includes(newThumbFilename)) {
                foundOne = true;
                this.player.debug.log(`Preloading thumb filename: ${newThumbFilename}`);

                const { urlPrefix } = this.thumbnails[0];
                const thumbURL = urlPrefix + newThumbFilename;
                const previewImage = new Image();
                previewImage.src = thumbURL;
                previewImage.onload = () => {
                  this.player.debug.log(`Preloaded thumb filename: ${newThumbFilename}`);
                  if (!this.loadedImages.includes(newThumbFilename)) this.loadedImages.push(newThumbFilename);

                  // We don't resolve until the thumb is loaded
                  resolve();
                };
              }
            }
          });

          // If there are none to preload then we want to resolve immediately
          if (!foundOne) {
            resolve();
          }
        }
      }, 300);
    });
  };

  // If user has been hovering current image for half a second, look for a higher quality one
  getHigherQuality = (currentQualityIndex, previewImage, frame, thumbFilename) => {
    if (currentQualityIndex < this.thumbnails.length - 1) {
      // Only use the higher quality version if it's going to look any better - if the current thumb is of a lower pixel density than the thumbnail container
      let previewImageHeight = previewImage.naturalHeight;

      if (this.usingSprites) {
        previewImageHeight = frame.h;
      }

      if (previewImageHeight < this.thumbContainerHeight) {
        // Recurse back to the loadImage function - show a higher quality one, but only if the viewer is on this frame for a while
        setTimeout(() => {
          // Make sure the mouse hasn't already moved on and started hovering at another image
          if (this.showingThumbFilename === thumbFilename) {
            this.player.debug.log(`Showing higher quality thumb for: ${thumbFilename}`);
            this.loadImage(currentQualityIndex + 1);
          }
        }, 300);
      }
    }
  };

  get currentImageContainer() {
    return this.mouseDown ? this.elements.scrubbing.container : this.elements.thumb.imageContainer;
  }

  get usingSprites() {
    return Object.keys(this.thumbnails[0].frames[0]).includes('w');
  }

  get thumbAspectRatio() {
    if (this.usingSprites) {
      return this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h;
    }

    return this.thumbnails[0].width / this.thumbnails[0].height;
  }

  get thumbContainerHeight() {
    if (this.mouseDown) {
      const { height } = fitRatio(this.thumbAspectRatio, {
        width: this.player.media.clientWidth,
        height: this.player.media.clientHeight,
      });
      return height;
    }

    // If css is used this needs to return the css height for sprites to work (see setImageSizeAndOffset)
    if (this.sizeSpecifiedInCSS) {
      return this.elements.thumb.imageContainer.clientHeight;
    }

    return Math.floor(this.player.media.clientWidth / this.thumbAspectRatio / 4);
  }

  get currentImageElement() {
    return this.mouseDown ? this.currentScrubbingImageElement : this.currentThumbnailImageElement;
  }

  set currentImageElement(element) {
    if (this.mouseDown) {
      this.currentScrubbingImageElement = element;
    } else {
      this.currentThumbnailImageElement = element;
    }
  }

  toggleThumbContainer = (toggle = false, clearShowing = false) => {
    const className = this.player.config.classNames.previewThumbnails.thumbContainerShown;
    this.elements.thumb.container.classList.toggle(className, toggle);

    if (!toggle && clearShowing) {
      this.showingThumb = null;
      this.showingThumbFilename = null;
    }
  };

  toggleScrubbingContainer = (toggle = false) => {
    const className = this.player.config.classNames.previewThumbnails.scrubbingContainerShown;
    this.elements.scrubbing.container.classList.toggle(className, toggle);

    if (!toggle) {
      this.showingThumb = null;
      this.showingThumbFilename = null;
    }
  };

  determineContainerAutoSizing = () => {
    if (this.elements.thumb.imageContainer.clientHeight > 20 || this.elements.thumb.imageContainer.clientWidth > 20) {
      // This will prevent auto sizing in this.setThumbContainerSizeAndPos()
      this.sizeSpecifiedInCSS = true;
    }
  };

  // Set the size to be about a quarter of the size of video. Unless option dynamicSize === false, in which case it needs to be set in CSS
  setThumbContainerSizeAndPos = () => {
    const { imageContainer } = this.elements.thumb;

    if (!this.sizeSpecifiedInCSS) {
      const thumbWidth = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
      imageContainer.style.height = `${this.thumbContainerHeight}px`;
      imageContainer.style.width = `${thumbWidth}px`;
    } else if (imageContainer.clientHeight > 20 && imageContainer.clientWidth < 20) {
      const thumbWidth = Math.floor(imageContainer.clientHeight * this.thumbAspectRatio);
      imageContainer.style.width = `${thumbWidth}px`;
    } else if (imageContainer.clientHeight < 20 && imageContainer.clientWidth > 20) {
      const thumbHeight = Math.floor(imageContainer.clientWidth / this.thumbAspectRatio);
      imageContainer.style.height = `${thumbHeight}px`;
    }

    this.setThumbContainerPos();
  };

  setThumbContainerPos = () => {
    const scrubberRect = this.player.elements.progress.getBoundingClientRect();
    const containerRect = this.player.elements.container.getBoundingClientRect();
    const { container } = this.elements.thumb;
    // Find the lowest and highest desired left-position, so we don't slide out the side of the video container
    const min = containerRect.left - scrubberRect.left + 10;
    const max = containerRect.right - scrubberRect.left - container.clientWidth - 10;
    // Set preview container position to: mousepos, minus seekbar.left, minus half of previewContainer.clientWidth
    const position = this.mousePosX - scrubberRect.left - container.clientWidth / 2;
    const clamped = clamp(position, min, max);

    // Move the popover position
    container.style.left = `${clamped}px`;

    // The arrow can follow the cursor
    container.style.setProperty('--preview-arrow-offset', `${position - clamped}px`);
  };

  // Can't use 100% width, in case the video is a different aspect ratio to the video container
  setScrubbingContainerSize = () => {
    const { width, height } = fitRatio(this.thumbAspectRatio, {
      width: this.player.media.clientWidth,
      height: this.player.media.clientHeight,
    });
    this.elements.scrubbing.container.style.width = `${width}px`;
    this.elements.scrubbing.container.style.height = `${height}px`;
  };

  // Sprites need to be offset to the correct location
  setImageSizeAndOffset = (previewImage, frame) => {
    if (!this.usingSprites) return;

    // Find difference between height and preview container height
    const multiplier = this.thumbContainerHeight / frame.h;

    // eslint-disable-next-line no-param-reassign
    previewImage.style.height = `${previewImage.naturalHeight * multiplier}px`;
    // eslint-disable-next-line no-param-reassign
    previewImage.style.width = `${previewImage.naturalWidth * multiplier}px`;
    // eslint-disable-next-line no-param-reassign
    previewImage.style.left = `-${frame.x * multiplier}px`;
    // eslint-disable-next-line no-param-reassign
    previewImage.style.top = `-${frame.y * multiplier}px`;
  };
}

export default PreviewThumbnails;
