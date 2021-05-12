// ==========================================================================
// Style utils
// ==========================================================================

import { closest } from './arrays';
import is from './is';

// Check support for a CSS declaration
export function supportsCSS(declaration) {
  if (!window || !window.CSS) {
    return false;
  }

  return window.CSS.supports(declaration);
}

// Standard/common aspect ratios
const standardRatios = [
  [1, 1],
  [4, 3],
  [3, 4],
  [5, 4],
  [4, 5],
  [3, 2],
  [2, 3],
  [16, 10],
  [10, 16],
  [16, 9],
  [9, 16],
  [21, 9],
  [9, 21],
  [32, 9],
  [9, 32],
].reduce((out, [x, y]) => ({ ...out, [x / y]: [x, y] }), {});

// Validate an aspect ratio
export function validateAspectRatio(input) {
  if (!is.array(input) && (!is.string(input) || !input.includes(':'))) {
    return false;
  }

  const ratio = is.array(input) ? input : input.split(':');

  return ratio.map(Number).every(is.number);
}

// Reduce an aspect ratio to it's lowest form
export function reduceAspectRatio(ratio) {
  if (!is.array(ratio) || !ratio.every(is.number)) {
    return null;
  }

  const [width, height] = ratio;
  const getDivider = (w, h) => (h === 0 ? w : getDivider(h, w % h));
  const divider = getDivider(width, height);

  return [width / divider, height / divider];
}

// Calculate an aspect ratio
export function getAspectRatio(input) {
  const parse = (ratio) => (validateAspectRatio(ratio) ? ratio.split(':').map(Number) : null);
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
    ratio = [videoWidth, videoHeight];
  }

  return reduceAspectRatio(ratio);
}

// Set aspect ratio for responsive container
export function setAspectRatio(input) {
  if (!this.isVideo) {
    return {};
  }

  const { wrapper } = this.elements;
  const ratio = getAspectRatio.call(this, input);

  if (!is.array(ratio)) {
    return {};
  }

  const [x, y] = reduceAspectRatio(ratio);
  const useNative = supportsCSS(`aspect-ratio: ${x}/${y}`);
  const padding = (100 / x) * y;

  if (useNative) {
    wrapper.style.aspectRatio = `${x}/${y}`;
  } else {
    wrapper.style.paddingBottom = `${padding}%`;
  }

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
    wrapper.classList.add(this.config.classNames.videoFixedRatio);
  }

  return { padding, ratio };
}

// Round an aspect ratio to closest standard ratio
export function roundAspectRatio(x, y, tolerance = 0.05) {
  const ratio = x / y;
  const closestRatio = closest(Object.keys(standardRatios), ratio);

  // Check match is within tolerance
  if (Math.abs(closestRatio - ratio) <= tolerance) {
    return standardRatios[closestRatio];
  }

  // No match
  return [x, y];
}

// Get the size of the viewport
// https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
export function getViewportSize() {
  const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  return [width, height];
}
