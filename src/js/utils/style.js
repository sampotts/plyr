// ==========================================================================
// Style utils
// ==========================================================================

import is from './is';

export function validateRatio(input) {
  if (!is.array(input) && (!is.string(input) || !input.includes(':'))) {
    return false;
  }

  const ratio = is.array(input) ? input : input.split(':');

  return ratio.map(Number).every(is.number);
}

export function reduceAspectRatio(ratio) {
  if (!is.array(ratio) || !ratio.every(is.number)) {
    return null;
  }

  const [width, height] = ratio;
  const getDivider = (w, h) => (h === 0 ? w : getDivider(h, w % h));
  const divider = getDivider(width, height);

  return [width / divider, height / divider];
}

export function getAspectRatio(input) {
  const parse = (ratio) => (validateRatio(ratio) ? ratio.split(':').map(Number) : null);
  // Try provided ratio
  let ratio = parse(input);

  // Get from config
  if (ratio === null) {
    ratio = parse(this.config.ratio);
  }

  // Get from embed
  if (ratio === null && !is.empty(this.embed) && is.array(this.embed.ratio)) {
    ({ ratio } = this.embed);
  }

  // Get from HTML5 video
  if (ratio === null && this.isHTML5) {
    const { videoWidth, videoHeight } = this.media;
    ratio = reduceAspectRatio([videoWidth, videoHeight]);
  }

  return ratio;
}

// Set aspect ratio for responsive container
export function setAspectRatio(input) {
  if (!this.isVideo) {
    return {};
  }

  const { wrapper } = this.elements;
  const ratio = getAspectRatio.call(this, input);
  const [w, h] = is.array(ratio) ? ratio : [0, 0];
  const padding = (100 / w) * h;

  wrapper.style.paddingBottom = `${padding}%`;

  // For Vimeo we have an extra <div> to hide the standard controls and UI
  if (this.isVimeo && !this.config.vimeo.premium && this.supported.ui) {
    const height = (100 / this.media.offsetWidth) * parseInt(window.getComputedStyle(this.media).paddingBottom, 10);
    const offset = (height - padding) / (height / 50);

    if (this.fullscreen.active) {
      wrapper.style.paddingBottom = null;
    } else {
      this.media.style.transform = `translateY(-${offset}%)`;
    }
  } else if (this.isHTML5) {
    wrapper.classList.toggle(this.config.classNames.videoFixedRatio, ratio !== null);
  }

  return { padding, ratio };
}

export default { setAspectRatio };
