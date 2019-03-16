// ==========================================================================
// Style utils
// ==========================================================================

import is from './is';

/* function reduceAspectRatio(width, height) {
    const getRatio = (w, h) => (h === 0 ? w : getRatio(h, w % h));
    const ratio = getRatio(width, height);
    return `${width / ratio}:${height / ratio}`;
} */

// Set aspect ratio for responsive container
export function setAspectRatio(input) {
    let ratio = input;

    if (!is.string(ratio) && !is.nullOrUndefined(this.embed)) {
        ({ ratio } = this.embed);
    }

    if (!is.string(ratio)) {
        ({ ratio } = this.config);
    }

    const [x, y] = ratio.split(':').map(Number);
    const padding = (100 / x) * y;

    this.elements.wrapper.style.paddingBottom = `${padding}%`;

    // For Vimeo we have an extra <div> to hide the standard controls and UI
    if (this.isVimeo && this.supported.ui) {
        const height = 240;
        const offset = (height - padding) / (height / 50);
        this.media.style.transform = `translateY(-${offset}%)`;
    }

    return { padding, ratio };
}

export default { setAspectRatio };
