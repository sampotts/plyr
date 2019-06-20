// ==========================================================================
// Load image avoiding xhr/fetch CORS issues
// Server status can't be obtained this way unfortunately, so this uses "naturalWidth" to determine if the image has loaded
// By default it checks if it is at least 1px, but you can add a second argument to change this
// ==========================================================================

export default function loadImage(src, minWidth = 1) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        const handler = () => {
            delete image.onload;
            delete image.onerror;
            (image.naturalWidth >= minWidth ? resolve : reject)(image);
        };

        Object.assign(image, { onload: handler, onerror: handler, src });
    });
}
