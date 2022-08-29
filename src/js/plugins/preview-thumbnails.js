import { createElement } from '../utils/elements';
import { once } from '../utils/events';

import is from '../utils/is';
import { formatTime } from '../utils/time';
import { clamp }  from '../utils/numbers'
import { triggerEvent,on } from '../utils/events';

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
    this.loaded=false;

    this.player.on('loadeddata',()=>{
      if(this.enabled)
        this.load();
    });

    this.config=null;

    this.interval=0;
    this.itemInPage=0;
    this.seekTime=0;

    this.scrub=false;

    this.thumbnails=[];

    this.elements={
      thumb:{},
      scrubbing:{}
    };

  }

  get enabled() {
    return this.player.isHTML5 && this.player.isVideo && this.player.config.previewThumbnails.enabled && this.player.config.previewThumbnails.src.length > 0;
  }


  load=()=>{

    if (this.player.elements.display.seekTooltip) {
      this.player.elements.display.seekTooltip.hidden = true;
    }

    this.config= this.player.config.previewThumbnails;
    this.itemInPage= (this.config.column*this.config.row);
    this.interval= this.player.duration/((this.itemInPage*this.config.src.length) - this.config.blankFrame);
    
    debugger;
    
    var Toplam= (this.itemInPage*this.config.src.length);

    console.log(Toplam - this.config.blankFrame);

    this.config.src.forEach(url => {
      this.thumbnails.push({
        url,
        isLoading:false,
        isLoaded:false,
        image:null,
        blob:null
      });
    });

    this.render();
    this.loaded=true;
  }

  showTime= async (event,time) =>{
    this.scrub=true;
    this.seekTime=time;

    const posWidth= event.pageX;
    var Thumbnail= this.getThumbnail();

    if(Thumbnail!=null)
      this.show(
        {
          thumbnail:Thumbnail,
          event:{
            second,
            posWidth
          }
        }
      )
  }

  render= ()=>{
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
  }
  
  getImage = (imageIndex)=>{
    var getImage= this.thumbnails[imageIndex];

    if(getImage.isLoaded===false){
      getImage.isLoading=true;

      fetch(getImage.url)
      .then(res=>res.blob())
      .then(blob=>{
        const imageObjectURL = URL.createObjectURL(blob);
        getImage.blob=imageObjectURL
        getImage.image= new Image();
        getImage.image.src= getImage.blob;
        getImage.image.onload=()=>{
          getImage.isLoaded=true;
        };
      })
    }

    return getImage;
  }

  getThumbnail = () =>{

    const {
      column,
      row
    } = this.config;

    const perIndex=  Math.floor(this.seekTime / this.interval);
    const imageIndex= clamp(Math.ceil((perIndex + 1) / this.itemInPage) - 1, 0, this.thumbnails.length-1);

    var getImage= this.getImage(imageIndex);

    if(getImage.isLoading==true && getImage.isLoaded==false) return null;

    const width = getImage.image.naturalWidth / row;
    const height= getImage.image.naturalHeight / column;
    const indexInImage= perIndex + 1 - this.itemInPage * (Math.ceil((perIndex + 1) / this.itemInPage) - 1)
    const rowIndex = Math.ceil(indexInImage / row) - 1
    const colIndex = indexInImage - rowIndex * row - 1

    return {
      image:imageIndex,
      inIndex: indexInImage,
      rowIndex:rowIndex,
      colIndex:colIndex,
      width,
      height
    }
  }

  startMove= (event)=>{
    
    if (!is.event(event) || !['touchmove', 'mousemove'].includes(event.type)) {
      return;
    }

    if (event.type === 'touchmove') {
      this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
    } else {
      
      const clientRect = this.player.elements.progress.getBoundingClientRect();
      const percentage = (100 / clientRect.width) * (event.pageX - clientRect.left);
      this.seekTime = this.player.media.duration * (percentage / 100);

      if (this.seekTime < 0) {
        this.seekTime = 0;
      }

      if (this.seekTime > this.player.media.duration - 1) {
        this.seekTime = this.player.media.duration - 1;
      }

      this.elements.thumb.time.innerText = formatTime(this.seekTime);
    }

    const second= this.seekTime;
    const posWidth= event.pageX;

    var Thumbnail= this.getThumbnail();

    if(Thumbnail!=null)
      this.show(
        {
          thumbnail:Thumbnail,
          event:{
            second,
            posWidth
          }
        }
      )
    
  }

  endMove = (event)=>{
    const className = this.player.config.classNames.previewThumbnails.thumbContainerShown;

    if(this.elements.thumb.container.classList.contains(className)===true){
      this.elements.thumb.container.classList.toggle(className, false);
    }
  }

  startScrubbing = (event) => {
    // Only act on left mouse button (0), or touch device (event.button does not exist or is false)
    if (is.nullOrUndefined(event.button) || event.button === false || event.button === 0) {
      this.scrub = true;
      this.endMove();
    }
  };

  endScrubbing = () => {
    
    this.scrub = false;

    const className = this.player.config.classNames.previewThumbnails.scrubbingContainerShown;

    if(this.elements.scrubbing.container.classList.contains(className)==true){
      this.elements.scrubbing.container.classList.toggle(className, false);
    }

  };

  show = (detail)=>{
    let El= this.elements.thumb.imageContainer;

    if(this.scrub){
      El= this.elements.scrubbing.container;
    }

    El.style.backgroundImage=`url(${this.thumbnails[detail.thumbnail.image].blob})`;
    El.style.height= `${detail.thumbnail.height}px`;
    El.style.width=`${detail.thumbnail.width}px`;
    El.style.backgroundPosition= `-${detail.thumbnail.colIndex * detail.thumbnail.width}px -${detail.thumbnail.rowIndex*detail.thumbnail.height}px`;

    this.scrub==true?this.showOnVideo(detail):this.showOnProgress(detail);

  }

  showOnProgress= (detail)=>{
    const className = this.player.config.classNames.previewThumbnails.thumbContainerShown;

    if(this.elements.thumb.container.classList.contains(className)===false){
      this.elements.thumb.container.classList.toggle(className, true);
    }

    const seekbarRect = this.player.elements.progress.getBoundingClientRect();
    const plyrRect = this.player.elements.container.getBoundingClientRect();
    const { container } = this.elements.thumb;
    // Find the lowest and highest desired left-position, so we don't slide out the side of the video container
    const minVal = plyrRect.left - seekbarRect.left + 10;
    const maxVal = plyrRect.right - seekbarRect.left - container.clientWidth - 10;
    // Set preview container position to: mousepos, minus seekbar.left, minus half of previewContainer.clientWidth
    let previewPos = detail.event.posWidth - seekbarRect.left - container.clientWidth / 2;

    if (previewPos < minVal) {
      previewPos = minVal;
    }

    if (previewPos > maxVal) {
      previewPos = maxVal;
    }

    this.elements.thumb.container.style.left = `${previewPos}px`;
  }

  showOnVideo= (detail)=>{
    const className = this.player.config.classNames.previewThumbnails.scrubbingContainerShown;

    if(this.elements.scrubbing.container.classList.contains(className)==false){
      this.elements.scrubbing.container.classList.toggle(className, true);
    }

    const { width, height } = fitRatio(detail.thumbnail.width/detail.thumbnail.height, {
      width: this.player.media.clientWidth,
      height: this.player.media.clientHeight,
    });

    var Scale= 'scale('+(height/detail.thumbnail.height)+')';
    this.elements.scrubbing.container.style.transform= Scale;
    
  }
}

export default PreviewThumbnails;
