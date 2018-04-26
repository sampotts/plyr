// ==========================================================================
// Plyr
// plyr.js v3.2.4
// https://github.com/sampotts/plyr
// License: The MIT License (MIT)
// ==========================================================================

import { providers, types } from './types';
import defaults from './defaults';
import support from './support';
import utils from './utils';

import Console from './console';
import Fullscreen from './fullscreen';
import Listeners from './listeners';
import Storage from './storage';
import Ads from './plugins/ads';

import captions from './captions';
import controls from './controls';
import media from './media';
import source from './source';
import ui from './ui';

// Private properties
// TODO: Use a WeakMap for private globals
// const globals = new WeakMap();

// Plyr instance
class Plyr {
    constructor(target, options) {
        this.timers = {};

        // State
        this.ready = false;
        this.loading = false;
        this.failed = false;

        // Touch device
        this.touch = support.touch;

        // Set the media element
        this.media = target;

        // String selector passed
        if (utils.is.string(this.media)) {
            this.media = document.querySelectorAll(this.media);
        }

        // jQuery, NodeList or Array passed, use first element
        if ((window.jQuery && this.media instanceof jQuery) || utils.is.nodeList(this.media) || utils.is.array(this.media)) {
            // eslint-disable-next-line
            this.media = this.media[0];
        }

        // Set config
        this.config = utils.extend(
            {},
            defaults,
            options || {},
            (() => {
                try {
                    return JSON.parse(this.media.getAttribute('data-plyr-config'));
                } catch (e) {
                    return {};
                }
            })(),
        );

        // Elements cache
        this.elements = {
            container: null,
            buttons: {},
            display: {},
            progress: {},
            inputs: {},
            settings: {
                menu: null,
                panes: {},
                tabs: {},
            },
            captions: null,
        };

        // Captions
        this.captions = {
            active: null,
            currentTrack: null,
        };

        // Fullscreen
        this.fullscreen = {
            active: false,
        };

        // Options
        this.options = {
            speed: [],
            quality: [],
            captions: [],
        };

        // Debugging
        // TODO: move to globals
        this.debug = new Console(this.config.debug);

        // Log config options and support
        this.debug.log('Config', this.config);
        this.debug.log('Support', support);

        // We need an element to setup
        if (utils.is.nullOrUndefined(this.media) || !utils.is.element(this.media)) {
            this.debug.error('Setup failed: no suitable element passed');
            return;
        }

        // Bail if the element is initialized
        if (this.media.plyr) {
            this.debug.warn('Target already setup');
            return;
        }

        // Bail if not enabled
        if (!this.config.enabled) {
            this.debug.error('Setup failed: disabled by config');
            return;
        }

        // Bail if disabled or no basic support
        // You may want to disable certain UAs etc
        if (!support.check().api) {
            this.debug.error('Setup failed: no support');
            return;
        }

        // Cache original element state for .destroy()
        // TODO: Investigate a better solution as I suspect this causes reported double load issues?
        setTimeout(() => {
            const clone = this.media.cloneNode(true);

            // Prevent the clone autoplaying
            if (clone.getAttribute('autoplay')) {
                clone.pause();
            }

            this.elements.original = clone;
        }, 0);

        // Set media type based on tag or data attribute
        // Supported: video, audio, vimeo, youtube
        const type = this.media.tagName.toLowerCase();

        // Embed properties
        let iframe = null;
        let url = null;
        let params = null;

        // Different setup based on type
        switch (type) {
            case 'div':
                // Find the frame
                iframe = this.media.querySelector('iframe');

                // <iframe> type
                if (utils.is.element(iframe)) {
                    // Detect provider
                    url = iframe.getAttribute('src');
                    this.provider = utils.getProviderByUrl(url);

                    // Rework elements
                    this.elements.container = this.media;
                    this.media = iframe;

                    // Reset classname
                    this.elements.container.className = '';

                    // Get attributes from URL and set config
                    params = utils.getUrlParams(url);
                    if (!utils.is.empty(params)) {
                        const truthy = [
                            '1',
                            'true',
                        ];

                        if (truthy.includes(params.autoplay)) {
                            this.config.autoplay = true;
                        }
                        if (truthy.includes(params.loop)) {
                            this.config.loop.active = true;
                        }

                        // TODO: replace fullscreen.iosNative with this playsinline config option
                        // YouTube requires the playsinline in the URL
                        if (this.isYouTube) {
                            this.config.playsinline = truthy.includes(params.playsinline);
                        } else {
                            this.config.playsinline = true;
                        }
                    }
                } else {
                    // <div> with attributes
                    this.provider = this.media.getAttribute(this.config.attributes.embed.provider);

                    // Remove attribute
                    this.media.removeAttribute(this.config.attributes.embed.provider);
                }

                // Unsupported or missing provider
                if (utils.is.empty(this.provider) || !Object.keys(providers).includes(this.provider)) {
                    this.debug.error('Setup failed: Invalid provider');
                    return;
                }

                // Audio will come later for external providers
                this.type = types.video;

                break;

            case 'video':
            case 'audio':
                this.type = type;
                this.provider = providers.html5;

                // Get config from attributes
                if (this.media.hasAttribute('crossorigin')) {
                    this.config.crossorigin = true;
                }
                if (this.media.hasAttribute('autoplay')) {
                    this.config.autoplay = true;
                }
                if (this.media.hasAttribute('playsinline')) {
                    this.config.playsinline = true;
                }
                if (this.media.hasAttribute('muted')) {
                    this.config.muted = true;
                }
                if (this.media.hasAttribute('loop')) {
                    this.config.loop.active = true;
                }

                break;

            default:
                this.debug.error('Setup failed: unsupported type');
                return;
        }

        // Check for support again but with type
        this.supported = support.check(this.type, this.provider, this.config.playsinline);

        // If no support for even API, bail
        if (!this.supported.api) {
            this.debug.error('Setup failed: no support');
            return;
        }

        // Create listeners
        this.listeners = new Listeners(this);

        // Setup local storage for user settings
        this.storage = new Storage(this);

        // Store reference
        this.media.plyr = this;

        // Wrap media
        if (!utils.is.element(this.elements.container)) {
            this.elements.container = utils.createElement('div');
            utils.wrap(this.media, this.elements.container);
        }

        // Allow focus to be captured
        this.elements.container.setAttribute('tabindex', 0);

        // Add style hook
        ui.addStyleHook.call(this);

        // Setup media
        media.setup.call(this);

        // Listen for events if debugging
        if (this.config.debug) {
            utils.on(this.elements.container, this.config.events.join(' '), event => {
                this.debug.log(`event: ${event.type}`);
            });
        }

        // Setup interface
        // If embed but not fully supported, build interface now to avoid flash of controls
        if (this.isHTML5 || (this.isEmbed && !this.supported.ui)) {
            ui.build.call(this);
        }

        // Container listeners
        this.listeners.container();

        // Global listeners
        this.listeners.global();

        // Setup fullscreen
        this.fullscreen = new Fullscreen(this);

        // Setup ads if provided
        this.ads = new Ads(this);

        // Autoplay if required
        if (this.config.autoplay) {
            this.play();
        }
    }

    // ---------------------------------------
    // API
    // ---------------------------------------

    /**
     * Types and provider helpers
     */
    get isHTML5() {
        return Boolean(this.provider === providers.html5);
    }
    get isEmbed() {
        return Boolean(this.isYouTube || this.isVimeo);
    }
    get isYouTube() {
        return Boolean(this.provider === providers.youtube);
    }
    get isVimeo() {
        return Boolean(this.provider === providers.vimeo);
    }
    get isVideo() {
        return Boolean(this.type === types.video);
    }
    get isAudio() {
        return Boolean(this.type === types.audio);
    }

    /**
     * Play the media, or play the advertisement (if they are not blocked)
     */
    play() {
        if (!utils.is.function(this.media.play)) {
            return null;
        }

        // If ads are enabled, wait for them first
        /* if (this.ads.enabled && !this.ads.initialized) {
            return this.ads.managerPromise.then(() => this.ads.play()).catch(() => this.media.play());
        } */

        // Return the promise (for HTML5)
        return this.media.play();
    }

    /**
     * Pause the media
     */
    pause() {
        if (!this.playing || !utils.is.function(this.media.pause)) {
            return;
        }

        this.media.pause();
    }

    /**
     * Get paused state
     */
    get paused() {
        return Boolean(this.media.paused);
    }

    /**
     * Get playing state
     */
    get playing() {
        return Boolean(this.ready && !this.paused && !this.ended && (this.isHTML5 ? this.media.readyState > 2 : true));
    }

    /**
     * Get ended state
     */
    get ended() {
        return Boolean(this.media.ended);
    }

    /**
     * Toggle playback based on current status
     * @param {boolean} input
     */
    togglePlay(input) {
        // Toggle based on current state if nothing passed
        const toggle = utils.is.boolean(input) ? input : !this.playing;

        if (toggle) {
            this.play();
        } else {
            this.pause();
        }
    }

    /**
     * Stop playback
     */
    stop() {
        if (this.isHTML5) {
            this.media.load();
        } else if (utils.is.function(this.media.stop)) {
            this.media.stop();
        }
    }

    /**
     * Restart playback
     */
    restart() {
        this.currentTime = 0;
    }

    /**
     * Rewind
     * @param {number} seekTime - how far to rewind in seconds. Defaults to the config.seekTime
     */
    rewind(seekTime) {
        this.currentTime = this.currentTime - (utils.is.number(seekTime) ? seekTime : this.config.seekTime);
    }

    /**
     * Fast forward
     * @param {number} seekTime - how far to fast forward in seconds. Defaults to the config.seekTime
     */
    forward(seekTime) {
        this.currentTime = this.currentTime + (utils.is.number(seekTime) ? seekTime : this.config.seekTime);
    }

    /**
     * Seek to a time
     * @param {number} input - where to seek to in seconds. Defaults to 0 (the start)
     */
    set currentTime(input) {
        let targetTime = 0;

        if (utils.is.number(input)) {
            targetTime = input;
        }

        // Normalise targetTime
        if (targetTime < 0) {
            targetTime = 0;
        } else if (targetTime > this.duration) {
            targetTime = this.duration;
        }

        // Set
        this.media.currentTime = targetTime;

        // Logging
        this.debug.log(`Seeking to ${this.currentTime} seconds`);
    }

    /**
     * Get current time
     */
    get currentTime() {
        return Number(this.media.currentTime);
    }

    /**
     * Get buffered
     */
    get buffered() {
        const { buffered } = this.media;

        // YouTube / Vimeo return a float between 0-1
        if (utils.is.number(buffered)) {
            return buffered;
        }

        // HTML5
        // TODO: Handle buffered chunks of the media
        // (i.e. seek to another section buffers only that section)
        if (buffered && buffered.length && this.duration > 0) {
            return buffered.end(0) / this.duration;
        }

        return 0;
    }

    /**
     * Get seeking status
     */
    get seeking() {
        return Boolean(this.media.seeking);
    }

    /**
     * Get the duration of the current media
     */
    get duration() {
        // Faux duration set via config
        const fauxDuration = parseFloat(this.config.duration);

        // True duration
        const realDuration = this.media ? Number(this.media.duration) : 0;

        // If custom duration is funky, use regular duration
        return !Number.isNaN(fauxDuration) ? fauxDuration : realDuration;
    }

    /**
     * Set the player volume
     * @param {number} value - must be between 0 and 1. Defaults to the value from local storage and config.volume if not set in storage
     */
    set volume(value) {
        let volume = value;
        const max = 1;
        const min = 0;

        if (utils.is.string(volume)) {
            volume = Number(volume);
        }

        // Load volume from storage if no value specified
        if (!utils.is.number(volume)) {
            volume = this.storage.get('volume');
        }

        // Use config if all else fails
        if (!utils.is.number(volume)) {
            ({ volume } = this.config);
        }

        // Maximum is volumeMax
        if (volume > max) {
            volume = max;
        }
        // Minimum is volumeMin
        if (volume < min) {
            volume = min;
        }

        // Update config
        this.config.volume = volume;

        // Set the player volume
        this.media.volume = volume;

        // If muted, and we're increasing volume manually, reset muted state
        if (!utils.is.empty(value) && this.muted && volume > 0) {
            this.muted = false;
        }
    }

    /**
     * Get the current player volume
     */
    get volume() {
        return Number(this.media.volume);
    }

    /**
     * Increase volume
     * @param {boolean} step - How much to decrease by (between 0 and 1)
     */
    increaseVolume(step) {
        const volume = this.media.muted ? 0 : this.volume;
        this.volume = volume + (utils.is.number(step) ? step : 1);
    }

    /**
     * Decrease volume
     * @param {boolean} step - How much to decrease by (between 0 and 1)
     */
    decreaseVolume(step) {
        const volume = this.media.muted ? 0 : this.volume;
        this.volume = volume - (utils.is.number(step) ? step : 1);
    }

    /**
     * Set muted state
     * @param {boolean} mute
     */
    set muted(mute) {
        let toggle = mute;

        // Load muted state from storage
        if (!utils.is.boolean(toggle)) {
            toggle = this.storage.get('muted');
        }

        // Use config if all else fails
        if (!utils.is.boolean(toggle)) {
            toggle = this.config.muted;
        }

        // Update config
        this.config.muted = toggle;

        // Set mute on the player
        this.media.muted = toggle;
    }

    /**
     * Get current muted state
     */
    get muted() {
        return Boolean(this.media.muted);
    }

    /**
     * Check if the media has audio
     */
    get hasAudio() {
        // Assume yes for all non HTML5 (as we can't tell...)
        if (!this.isHTML5) {
            return true;
        }

        if (this.isAudio) {
            return true;
        }

        // Get audio tracks
        return (
            Boolean(this.media.mozHasAudio) ||
            Boolean(this.media.webkitAudioDecodedByteCount) ||
            Boolean(this.media.audioTracks && this.media.audioTracks.length)
        );
    }

    /**
     * Set playback speed
     * @param {number} speed - the speed of playback (0.5-2.0)
     */
    set speed(input) {
        let speed = null;

        if (utils.is.number(input)) {
            speed = input;
        }

        if (!utils.is.number(speed)) {
            speed = this.storage.get('speed');
        }

        if (!utils.is.number(speed)) {
            speed = this.config.speed.selected;
        }

        // Set min/max
        if (speed < 0.1) {
            speed = 0.1;
        }
        if (speed > 2.0) {
            speed = 2.0;
        }

        if (!this.config.speed.options.includes(speed)) {
            this.debug.warn(`Unsupported speed (${speed})`);
            return;
        }

        // Update config
        this.config.speed.selected = speed;

        // Set media speed
        this.media.playbackRate = speed;
    }

    /**
     * Get current playback speed
     */
    get speed() {
        return Number(this.media.playbackRate);
    }

    /**
     * Set playback quality
     * Currently HTML5 & YouTube only
     * @param {number} input - Quality level
     */
    set quality(input) {
        let quality = null;

        if (!utils.is.empty(input)) {
            quality = Number(input);
        }

        if (!utils.is.number(quality) || quality === 0) {
            quality = this.storage.get('quality');
        }

        if (!utils.is.number(quality)) {
            quality = this.config.quality.selected;
        }

        if (!utils.is.number(quality)) {
            quality = this.config.quality.default;
        }

        if (!this.options.quality.length) {
            return;
        }

        if (!this.options.quality.includes(quality)) {
            const closest = utils.closest(this.options.quality, quality);
            this.debug.warn(`Unsupported quality option: ${quality}, using ${closest} instead`);
            quality = closest;
        }

        // Update config
        this.config.quality.selected = quality;

        // Set quality
        this.media.quality = quality;
    }

    /**
     * Get current quality level
     */
    get quality() {
        return this.media.quality;
    }

    /**
     * Toggle loop
     * TODO: Finish fancy new logic. Set the indicator on load as user may pass loop as config
     * @param {boolean} input - Whether to loop or not
     */
    set loop(input) {
        const toggle = utils.is.boolean(input) ? input : this.config.loop.active;
        this.config.loop.active = toggle;
        this.media.loop = toggle;

        // Set default to be a true toggle
        /* const type = ['start', 'end', 'all', 'none', 'toggle'].includes(input) ? input : 'toggle';

        switch (type) {
            case 'start':
                if (this.config.loop.end && this.config.loop.end <= this.currentTime) {
                    this.config.loop.end = null;
                }
                this.config.loop.start = this.currentTime;
                // this.config.loop.indicator.start = this.elements.display.played.value;
                break;

            case 'end':
                if (this.config.loop.start >= this.currentTime) {
                    return this;
                }
                this.config.loop.end = this.currentTime;
                // this.config.loop.indicator.end = this.elements.display.played.value;
                break;

            case 'all':
                this.config.loop.start = 0;
                this.config.loop.end = this.duration - 2;
                this.config.loop.indicator.start = 0;
                this.config.loop.indicator.end = 100;
                break;

            case 'toggle':
                if (this.config.loop.active) {
                    this.config.loop.start = 0;
                    this.config.loop.end = null;
                } else {
                    this.config.loop.start = 0;
                    this.config.loop.end = this.duration - 2;
                }
                break;

            default:
                this.config.loop.start = 0;
                this.config.loop.end = null;
                break;
        } */
    }

    /**
     * Get current loop state
     */
    get loop() {
        return Boolean(this.media.loop);
    }

    /**
     * Set new media source
     * @param {object} input - The new source object (see docs)
     */
    set source(input) {
        source.change.call(this, input);
    }

    /**
     * Get current source
     */
    get source() {
        return this.media.currentSrc;
    }

    /**
     * Set the poster image for a HTML5 video
     * @param {input} - the URL for the new poster image
     */
    set poster(input) {
        if (!this.isHTML5 || !this.isVideo) {
            this.debug.warn('Poster can only be set on HTML5 video');
            return;
        }

        if (utils.is.string(input)) {
            this.media.setAttribute('poster', input);
        }
    }

    /**
     * Get the current poster image
     */
    get poster() {
        if (!this.isHTML5 || !this.isVideo) {
            return null;
        }

        return this.media.getAttribute('poster');
    }

    /**
     * Set the autoplay state
     * @param {boolean} input - Whether to autoplay or not
     */
    set autoplay(input) {
        const toggle = utils.is.boolean(input) ? input : this.config.autoplay;
        this.config.autoplay = toggle;
    }

    /**
     * Get the current autoplay state
     */
    get autoplay() {
        return Boolean(this.config.autoplay);
    }

    /**
     * Toggle captions
     * @param {boolean} input - Whether to enable captions
     */
    toggleCaptions(input) {
        // If there's no full support
        if (!this.supported.ui) {
            return;
        }

        // If the method is called without parameter, toggle based on current value
        const show = utils.is.boolean(input) ? input : !this.elements.container.classList.contains(this.config.classNames.captions.active);

        // Nothing to change...
        if (this.captions.active === show) {
            return;
        }

        // Set global
        this.captions.active = show;

        // Toggle state
        utils.toggleState(this.elements.buttons.captions, this.captions.active);

        // Add class hook
        utils.toggleClass(this.elements.container, this.config.classNames.captions.active, this.captions.active);

        // Trigger an event
        utils.dispatchEvent.call(this, this.media, this.captions.active ? 'captionsenabled' : 'captionsdisabled');
    }

    /**
     * Set the captions language
     * @param {string} - Two character ISO language code (e.g. EN, FR, PT, etc)
     */
    set language(input) {
        // Nothing specified
        if (!utils.is.string(input)) {
            return;
        }

        // If empty string is passed, assume disable captions
        if (utils.is.empty(input)) {
            this.toggleCaptions(false);
            return;
        }

        // Normalize
        const language = input.toLowerCase();

        // Check for support
        if (!this.options.captions.includes(language)) {
            this.debug.warn(`Unsupported language option: ${language}`);
            return;
        }

        // Ensure captions are enabled
        this.toggleCaptions(true);

        // Enabled only
        if (language === 'enabled') {
            return;
        }

        // If nothing to change, bail
        if (this.language === language) {
            return;
        }

        // Update config
        this.captions.language = language;

        // Clear caption
        captions.setText.call(this, null);

        // Update captions
        captions.setLanguage.call(this);

        // Trigger an event
        utils.dispatchEvent.call(this, this.media, 'languagechange');
    }

    /**
     * Get the current captions language
     */
    get language() {
        return this.captions.language;
    }

    /**
     * Toggle picture-in-picture playback on WebKit/MacOS
     * TODO: update player with state, support, enabled
     * TODO: detect outside changes
     */
    set pip(input) {
        const states = {
            pip: 'picture-in-picture',
            inline: 'inline',
        };

        // Bail if no support
        if (!support.pip) {
            return;
        }

        // Toggle based on current state if not passed
        const toggle = utils.is.boolean(input) ? input : this.pip === states.inline;

        // Toggle based on current state
        this.media.webkitSetPresentationMode(toggle ? states.pip : states.inline);
    }

    /**
     * Get the current picture-in-picture state
     */
    get pip() {
        if (!support.pip) {
            return null;
        }

        return this.media.webkitPresentationMode;
    }

    /**
     * Trigger the airplay dialog
     * TODO: update player with state, support, enabled
     */
    airplay() {
        // Show dialog if supported
        if (support.airplay) {
            this.media.webkitShowPlaybackTargetPicker();
        }
    }

    /**
     * Toggle the player controls
     * @param {boolean} toggle - Whether to show the controls
     */
    toggleControls(toggle) {
        // We need controls of course...
        if (!utils.is.element(this.elements.controls)) {
            return;
        }

        // Don't hide if no UI support or it's audio
        if (!this.supported.ui || this.isAudio) {
            return;
        }

        let delay = 0;
        let show = toggle;
        let isEnterFullscreen = false;

        // Get toggle state if not set
        if (!utils.is.boolean(toggle)) {
            if (utils.is.event(toggle)) {
                // Is the enter fullscreen event
                isEnterFullscreen = toggle.type === 'enterfullscreen';

                // Events that show the controls
                const showEvents = [
                    'touchstart',
                    'touchmove',
                    'mouseenter',
                    'mousemove',
                    'focusin',
                ];

                // Events that delay hiding
                const delayEvents = [
                    'touchmove',
                    'touchend',
                    'mousemove',
                ];

                // Whether to show controls
                show = showEvents.includes(toggle.type);

                // Delay hiding on move events
                if (delayEvents.includes(toggle.type)) {
                    delay = 2000;
                }

                // Delay a little more for keyboard users
                if (!this.touch && toggle.type === 'focusin') {
                    delay = 3000;
                    utils.toggleClass(this.elements.controls, this.config.classNames.noTransition, true);
                }
            } else {
                show = utils.hasClass(this.elements.container, this.config.classNames.hideControls);
            }
        }

        // Clear timer on every call
        clearTimeout(this.timers.controls);

        // If the mouse is not over the controls, set a timeout to hide them
        if (show || this.paused || this.loading) {
            // Check if controls toggled
            const toggled = utils.toggleClass(this.elements.container, this.config.classNames.hideControls, false);

            // Trigger event
            if (toggled) {
                utils.dispatchEvent.call(this, this.media, 'controlsshown');
            }

            // Always show controls when paused or if touch
            if (this.paused || this.loading) {
                return;
            }

            // Delay for hiding on touch
            if (this.touch) {
                delay = 3000;
            }
        }

        // If toggle is false or if we're playing (regardless of toggle),
        // then set the timer to hide the controls
        if (!show || this.playing) {
            this.timers.controls = setTimeout(() => {
                // We need controls of course...
                if (!utils.is.element(this.elements.controls)) {
                    return;
                }

                // If the mouse is over the controls (and not entering fullscreen), bail
                if ((this.elements.controls.pressed || this.elements.controls.hover) && !isEnterFullscreen) {
                    return;
                }

                // Restore transition behaviour
                if (!utils.hasClass(this.elements.container, this.config.classNames.hideControls)) {
                    utils.toggleClass(this.elements.controls, this.config.classNames.noTransition, false);
                }

                // Set hideControls class
                const toggled = utils.toggleClass(this.elements.container, this.config.classNames.hideControls, this.config.hideControls);

                // Trigger event and close menu
                if (toggled) {
                    utils.dispatchEvent.call(this, this.media, 'controlshidden');

                    if (this.config.controls.includes('settings') && !utils.is.empty(this.config.settings)) {
                        controls.toggleMenu.call(this, false);
                    }
                }
            }, delay);
        }
    }

    /**
     * Add event listeners
     * @param {string} event - Event type
     * @param {function} callback - Callback for when event occurs
     */
    on(event, callback) {
        utils.on(this.elements.container, event, callback);
    }

    /**
     * Remove event listeners
     * @param {string} event - Event type
     * @param {function} callback - Callback for when event occurs
     */
    off(event, callback) {
        utils.off(this.elements.container, event, callback);
    }

    /**
     * Destroy an instance
     * Event listeners are removed when elements are removed
     * http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
     * @param {function} callback - Callback for when destroy is complete
     * @param {boolean} soft - Whether it's a soft destroy (for source changes etc)
     */
    destroy(callback, soft = false) {
        if (!this.ready) {
            return;
        }

        const done = () => {
            // Reset overflow (incase destroyed while in fullscreen)
            document.body.style.overflow = '';

            // GC for embed
            this.embed = null;

            // If it's a soft destroy, make minimal changes
            if (soft) {
                if (Object.keys(this.elements).length) {
                    // Remove elements
                    utils.removeElement(this.elements.buttons.play);
                    utils.removeElement(this.elements.captions);
                    utils.removeElement(this.elements.controls);
                    utils.removeElement(this.elements.wrapper);

                    // Clear for GC
                    this.elements.buttons.play = null;
                    this.elements.captions = null;
                    this.elements.controls = null;
                    this.elements.wrapper = null;
                }

                // Callback
                if (utils.is.function(callback)) {
                    callback();
                }
            } else {
                // Unbind listeners
                this.listeners.clear();

                // Replace the container with the original element provided
                utils.replaceElement(this.elements.original, this.elements.container);

                // Event
                utils.dispatchEvent.call(this, this.elements.original, 'destroyed', true);

                // Callback
                if (utils.is.function(callback)) {
                    callback.call(this.elements.original);
                }

                // Reset state
                this.ready = false;

                // Clear for garbage collection
                setTimeout(() => {
                    this.elements = null;
                    this.media = null;
                }, 200);
            }
        };

        // Stop playback
        this.stop();

        // Type specific stuff
        switch (`${this.provider}:${this.type}`) {
            case 'html5:video':
            case 'html5:audio':
                // Clear timeout
                clearTimeout(this.timers.loading);

                // Restore native video controls
                ui.toggleNativeControls.call(this, true);

                // Clean up
                done();

                break;

            case 'youtube:video':
                // Clear timers
                clearInterval(this.timers.buffering);
                clearInterval(this.timers.playing);

                // Destroy YouTube API
                if (this.embed !== null && utils.is.function(this.embed.destroy)) {
                    this.embed.destroy();
                }

                // Clean up
                done();

                break;

            case 'vimeo:video':
                // Destroy Vimeo API
                // then clean up (wait, to prevent postmessage errors)
                if (this.embed !== null) {
                    this.embed.unload().then(done);
                }

                // Vimeo does not always return
                setTimeout(done, 200);

                break;

            default:
                break;
        }
    }

    /**
     * Check for support for a mime type (HTML5 only)
     * @param {string} type - Mime type
     */
    supports(type) {
        return support.mime.call(this, type);
    }

    /**
     * Check for support
     * @param {string} type - Player type (audio/video)
     * @param {string} provider - Provider (html5/youtube/vimeo)
     * @param {bool} inline - Where player has `playsinline` sttribute
     */
    static supported(type, provider, inline) {
        return support.check(type, provider, inline);
    }

    /**
     * Load an SVG sprite into the page
     * @param {string} url - URL for the SVG sprite
     * @param {string} [id] - Unique ID
     */
    static loadSprite(url, id) {
        return utils.loadSprite(url, id);
    }
}

export default Plyr;
