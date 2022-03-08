import { createElement } from '../utils/elements';
import { once } from '../utils/events';

import is from '../utils/is';
import { formatTime } from '../utils/time';
import {clamp} from '../utils/numbers'

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
    this.config=null;


    this.lastMouseMoveTime = Date.now();
    this.mouseDown = false;
    this.loadedImages = [];
    


    this.elements = {
      thumb: {},
      scrubbing: {},
    };

    this.interval=0;
    this.itemInPage=0;

    this.player.on("loadeddata",()=>{
      this.load();
    });
  }

  get enabled() {
    return this.player.isHTML5 && this.player.isVideo && this.player.config.previewThumbnails.enabled;
  }

  load = () => {
    // Toggle the regular seek tooltip
    if (this.player.elements.display.seekTooltip) {
      this.player.elements.display.seekTooltip.hidden = this.enabled;
    }

    if (!this.enabled) {
      return;
    }

    this.config=this.player.config.previewThumbnails;

    this.prepareThumbnails();
    this.render();
    this.determineContainerAutoSizing();

    this.loaded = true;
  };

  
  prepareThumbnails = () => {

    this.itemInPage= this.config.column*this.config.row;
    this.interval= this.player.duration/this.itemInPage*this.config.src.length;

    this.player.config.previewThumbnails.src.forEach(SingleUrl => {
      this.thumbnails.push({
        url:SingleUrl,
        isLoading:false,
        isLoaded:false,
        image:null,
        blob:null
      });
    });
    
  };


  startMove = (event) => {
    if (!this.loaded) {
      return;
    }
    
    if (!is.event(event) || !['touchmove', 'mousemove'].includes(event.type)) {
      return;
    }
    
    // Wait until media has a duration
    if (!this.player.media.duration) {
      return;
    }

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

    this.elements.thumb.container.appendChild(timeContainer);

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

    const perIndex= Math.floor(this.seekTime / this.interval);

    const thumbNum= perIndex + 1 - this.itemInPage * (Math.ceil((perIndex + 1) / this.itemInPage) - 1);

    const hasThumb = thumbNum >= 0;

    let qualityIndex = clamp(Math.ceil((perIndex + 1) / this.itemInPage) - 1, 0, this.thumbnails.length-1);
    // Show the thumb container if we're not scrubbing
    if (!this.mouseDown) {
      this.toggleThumbContainer(hasThumb);
    }

    // Only proceed if either thumbnum or thumbfilename has changed
    if (thumbNum !== this.showingThumb) {
      this.showingThumb = thumbNum;
      this.loadImage(qualityIndex);
    }
  };

  // Show the image that's currently specified in this.showingThumb
  loadImage = (qualityIndex = 0) => {
    const thumbNum = this.showingThumb;
    const thumbnail = this.thumbnails[qualityIndex];

    if(thumbnail.isLoading==false && thumbnail.isLoaded==false){
      thumbnail.isLoading=true;

      fetch(thumbnail.url)
        .then(response=>response.blob())
        .then(blob=>{
          const imageObjectURL = URL.createObjectURL(blob);

          thumbnail.blob=imageObjectURL;
          thumbnail.image= new Image();;
          thumbnail.image.src= thumbnail.blob;

          thumbnail.isLoading=false;
          thumbnail.isLoaded=true;
        });
      
    }

    if(thumbnail.isLoaded==false) return;

    this.showImage(thumbnail.image, qualityIndex, thumbNum, true);
  };

  showImage = (previewImage, qualityIndex, thumbNum, newImage = true) => {
    this.player.debug.log(
      `num: ${thumbNum}. qual: ${qualityIndex}. newimg: ${newImage}`,
    );
    this.setImageSizeAndOffset(previewImage, qualityIndex);

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
    if (this.mouseDown) {
      return this.elements.scrubbing.container;
    }

    return this.elements.thumb.imageContainer;
  }


  get thumbAspectRatio() {
    return this.config.width / this.config.height;
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
    if (this.mouseDown) {
      return this.currentScrubbingImageElement;
    }

    return this.currentThumbnailImageElement;
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
    if (!this.sizeSpecifiedInCSS) {
      debugger;
      const thumbWidth = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
      this.elements.thumb.imageContainer.style.height = `${this.thumbContainerHeight}px`;
      this.elements.thumb.imageContainer.style.width = `${thumbWidth}px`;
    } else if (
      this.elements.thumb.imageContainer.clientHeight > 20 &&
      this.elements.thumb.imageContainer.clientWidth < 20
    ) {
      const thumbWidth = Math.floor(this.elements.thumb.imageContainer.clientHeight * this.thumbAspectRatio);
      this.elements.thumb.imageContainer.style.width = `${thumbWidth}px`;
    } else if (
      this.elements.thumb.imageContainer.clientHeight < 20 &&
      this.elements.thumb.imageContainer.clientWidth > 20
    ) {
      const thumbHeight = Math.floor(this.elements.thumb.imageContainer.clientWidth / this.thumbAspectRatio);
      this.elements.thumb.imageContainer.style.height = `${thumbHeight}px`;
    }

    this.setThumbContainerPos();
  };

  setThumbContainerPos = () => {
    const seekbarRect = this.player.elements.progress.getBoundingClientRect();
    const plyrRect = this.player.elements.container.getBoundingClientRect();
    const { container } = this.elements.thumb;
    // Find the lowest and highest desired left-position, so we don't slide out the side of the video container
    const minVal = plyrRect.left - seekbarRect.left + 10;
    const maxVal = plyrRect.right - seekbarRect.left - container.clientWidth - 10;
    // Set preview container position to: mousepos, minus seekbar.left, minus half of previewContainer.clientWidth
    let previewPos = this.mousePosX - seekbarRect.left - container.clientWidth / 2;

    if (previewPos < minVal) {
      previewPos = minVal;
    }

    if (previewPos > maxVal) {
      previewPos = maxVal;
    }

    container.style.left = `${previewPos}px`;
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
    // Find difference between height and preview container height
    const multiplier = this.thumbContainerHeight / this.config.height;

    // eslint-disable-next-line no-param-reassign
    previewImage.style.height = `${this.config.height * multiplier}px`;
    // eslint-disable-next-line no-param-reassign
    previewImage.style.width = `${this.config.width * multiplier}px`;
    // eslint-disable-next-line no-param-reassign
    previewImage.style.left = `-${frame * this.config.width}px`;
    // eslint-disable-next-line no-param-reassign
    previewImage.style.top = `-${frame * this.config.height}px`;
  };
}

export default PreviewThumbnails;
