// ==========================================================================
// Plyr fullscreen API
// ==========================================================================

import utils from './utils';

// Determine the prefix
const prefix = (() => {
    let value = false;

    if (utils.is.function(document.cancelFullScreen)) {
        value = '';
    } else {
        // Check for fullscreen support by vendor prefix
        ['webkit', 'o', 'moz', 'ms', 'khtml'].some(pre => {
            if (utils.is.function(document[`${pre}CancelFullScreen`])) {
                value = pre;
                return true;
            } else if (utils.is.function(document.msExitFullscreen) && document.msFullscreenEnabled) {
                // Special case for MS (when isn't it?)
                value = 'ms';
                return true;
            }

            return false;
        });
    }

    return value;
})();

// Fullscreen API
const fullscreen = {
    // Get the prefix
    prefix,

    // Check if we can use it
    enabled: document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled,

    // Yet again Microsoft awesomeness,
    // Sometimes the prefix is 'ms', sometimes 'MS' to keep you on your toes
    eventType: prefix === 'ms' ? 'MSFullscreenChange' : `${prefix}fullscreenchange`,

    // Is an element fullscreen
    isFullScreen(element) {
        if (!fullscreen.enabled) {
            return false;
        }

        const target = utils.is.nullOrUndefined(element) ? document.body : element;

        switch (prefix) {
            case '':
                return document.fullscreenElement === target;

            case 'moz':
                return document.mozFullScreenElement === target;

            default:
                return document[`${prefix}FullscreenElement`] === target;
        }
    },

    // Make an element fullscreen
    requestFullScreen(element) {
        if (!fullscreen.enabled) {
            return false;
        }

        const target = utils.is.nullOrUndefined(element) ? document.body : element;

        return !prefix.length ? target.requestFullScreen() : target[prefix + (prefix === 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
    },

    // Bail from fullscreen
    cancelFullScreen() {
        if (!fullscreen.enabled) {
            return false;
        }

        return !prefix.length ? document.cancelFullScreen() : document[prefix + (prefix === 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
    },

    // Get the current element
    element() {
        if (!fullscreen.enabled) {
            return null;
        }

        return !prefix.length ? document.fullscreenElement : document[`${prefix}FullscreenElement`];
    },

    // Setup fullscreen
    setup() {
        if (!this.supported.ui || this.isAudio || !this.config.fullscreen.enabled) {
            return;
        }

        // Check for native support
        const nativeSupport = fullscreen.enabled;

        if (nativeSupport || (this.config.fullscreen.fallback && !utils.inFrame())) {
            this.console.log(`${nativeSupport ? 'Native' : 'Fallback'} fullscreen enabled`);

            // Add styling hook to show button
            utils.toggleClass(this.elements.container, this.config.classNames.fullscreen.enabled, true);
        } else {
            this.console.log('Fullscreen not supported and fallback disabled');
        }

        // Toggle state
        if (this.elements.buttons && this.elements.buttons.fullscreen) {
            utils.toggleState(this.elements.buttons.fullscreen, false);
        }

        // Trap focus in container
        utils.trapFocus.call(this);
    },
};

export default fullscreen;
