// Test setup: fill gaps in jsdom that Plyr's support checks touch when the module loads.

// jsdom has no text track classes; src/js/utils/is.js refers to the global TextTrack by name.
globalThis.TextTrack ??= class TextTrack {};
globalThis.TextTrackCue ??= class TextTrackCue {};

// jsdom defines window.matchMedia but it can't be called; src/js/support.js calls it at import time.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  });
}
