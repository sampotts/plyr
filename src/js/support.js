// ==========================================================================
// Plyr support checks
// ==========================================================================

import utils from './utils';

// Check for feature support
const support = {
    // Basic support
    audio: 'canPlayType' in document.createElement('audio'),
    video: 'canPlayType' in document.createElement('video'),

    // Check for support
    // Basic functionality vs full UI
    check(type, provider, playsinline) {
        let api = false;
        let ui = false;
        const browser = utils.getBrowser();
        const canPlayInline = browser.isIPhone && playsinline && support.playsinline;

        switch (`${provider}:${type}`) {
            case 'html5:video':
                api = support.video;
                ui = api && support.rangeInput && (!browser.isIPhone || canPlayInline);
                break;

            case 'html5:audio':
                api = support.audio;
                ui = api && support.rangeInput;
                break;

            case 'youtube:video':
            case 'vimeo:video':
                api = true;
                ui = support.rangeInput && (!browser.isIPhone || canPlayInline);
                break;

            default:
                api = support.audio && support.video;
                ui = api && support.rangeInput;
        }

        return {
            api,
            ui,
        };
    },

    // Picture-in-picture support
    // Safari only currently
    pip: (() => {
        const browser = utils.getBrowser();
        return !browser.isIPhone && utils.is.function(utils.createElement('video').webkitSetPresentationMode);
    })(),

    // Airplay support
    // Safari only currently
    airplay: utils.is.function(window.WebKitPlaybackTargetAvailabilityEvent),

    // Inline playback support
    // https://webkit.org/blog/6784/new-video-policies-for-ios/
    playsinline: 'playsInline' in document.createElement('video'),

    // Check for mime type support against a player instance
    // Credits: http://diveintohtml5.info/everything.html
    // Related: http://www.leanbackplayer.com/test/h5mt.html
    mime(type) {
        const { media } = this;

        try {
            // Bail if no checking function
            if (!this.isHTML5 || !utils.is.function(media.canPlayType)) {
                return false;
            }

            // Check directly if codecs specified
            if (type.includes('codecs=')) {
                return media.canPlayType(type).replace(/no/, '');
            }

            // Type specific checks
            if (this.isVideo) {
                switch (type) {
                    case 'video/webm':
                        return media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, '');

                    case 'video/mp4':
                        return media.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, '');

                    case 'video/ogg':
                        return media.canPlayType('video/ogg; codecs="theora"').replace(/no/, '');

                    default:
                        return false;
                }
            } else if (this.isAudio) {
                switch (type) {
                    case 'audio/mpeg':
                        return media.canPlayType('audio/mpeg;').replace(/no/, '');

                    case 'audio/ogg':
                        return media.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '');

                    case 'audio/wav':
                        return media.canPlayType('audio/wav; codecs="1"').replace(/no/, '');

                    default:
                        return false;
                }
            }
        } catch (e) {
            return false;
        }

        // If we got this far, we're stuffed
        return false;
    },

    // Check for textTracks support
    textTracks: 'textTracks' in document.createElement('video'),

    // Check for passive event listener support
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    // https://www.youtube.com/watch?v=NPM6172J22g
    passiveListeners: (() => {
        // Test via a getter in the options object to see if the passive property is accessed
        let supported = false;
        try {
            const options = Object.defineProperty({}, 'passive', {
                get() {
                    supported = true;
                    return null;
                },
            });
            window.addEventListener('test', null, options);
        } catch (e) {
            // Do nothing
        }

        return supported;
    })(),

    // <input type="range"> Sliders
    rangeInput: (() => {
        const range = document.createElement('input');
        range.type = 'range';
        return range.type === 'range';
    })(),

    // Touch
    // NOTE: Remember a device can be mouse + touch enabled so we check on first touch event
    touch: 'ontouchstart' in document.documentElement,

    // Detect transitions support
    transitions: utils.transitionEndEvent !== false,

    // Reduced motion iOS & MacOS setting
    // https://webkit.org/blog/7551/responsive-design-for-motion/
    reducedMotion: 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion)').matches,
};

export default support;
