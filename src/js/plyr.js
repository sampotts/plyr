// ==========================================================================
// Plyr
// plyr.js v3.0.0
// https://github.com/sampotts/plyr
// License: The MIT License (MIT)
// ==========================================================================

import defaults from './defaults';
import types from './types';
import support from './support';
import utils from './utils';

import captions from './captions';
import controls from './controls';
import fullscreen from './fullscreen';
import listeners from './listeners';
import media from './media';
import storage from './storage';
import source from './source';
import ui from './ui';

// Globals
let scrollPosition = {
    x: 0,
    y: 0,
};

// Plyr instance
class Plyr {
    constructor(target, options) {
        this.timers = {};
        this.ready = false;

        // Set the media element
        this.media = target;

        // String selector passed
        if (utils.is.string(this.media)) {
            this.media = document.querySelectorAll(this.media);
        }

        // jQuery, NodeList or Array passed, use first element
        if (
            (window.jQuery && this.media instanceof jQuery) ||
            utils.is.nodeList(this.media) ||
            utils.is.array(this.media)
        ) {
            // eslint-disable-next-line
            this.media = this.media[0];
        }

        // Set config
        this.config = utils.extend(
            {},
            defaults,
            options,
            (() => {
                try {
                    return JSON.parse(this.media.getAttribute('data-plyr'));
                } catch (e) {
                    return null;
                }
            })()
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
            enabled: null,
            tracks: null,
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
        };

        // Debugging
        this.log = () => {};
        this.warn = () => {};
        this.error = () => {};
        if (this.config.debug && 'console' in window) {
            this.log = console.log; // eslint-disable-line
            this.warn = console.warn; // eslint-disable-line
            this.error = console.error; // eslint-disable-line
            this.log('Debugging enabled');
        }

        // Log config options and support
        this.log('Config', this.config);
        this.log('Support', support);

        // We need an element to setup
        if (this.media === null || utils.is.undefined(this.media) || !utils.is.htmlElement(this.media)) {
            this.error('Setup failed: no suitable element passed');
            return;
        }

        // Bail if the element is initialized
        if (this.media.plyr) {
            this.warn('Target already setup');
            return;
        }

        // Bail if not enabled
        if (!this.config.enabled) {
            this.error('Setup failed: disabled by config');
            return;
        }

        // Bail if disabled or no basic support
        // You may want to disable certain UAs etc
        if (!support.check().api) {
            this.error('Setup failed: no support');
            return;
        }

        // Cache original element state for .destroy()
        this.elements.original = this.media.cloneNode(true);

        // Set media type based on tag or data attribute
        // Supported: video, audio, vimeo, youtube
        const type = this.media.tagName.toLowerCase();

        // Different setup based on type
        switch (type) {
            // TODO: Handle passing an iframe for true progressive enhancement
            // case 'iframe':
            case 'div':
                this.type = this.media.getAttribute('data-type');
                this.embedId = this.media.getAttribute('data-video-id');

                if (utils.is.empty(this.type)) {
                    this.error('Setup failed: embed type missing');
                    return;
                }

                if (utils.is.empty(this.embedId)) {
                    this.error('Setup failed: video id missing');
                    return;
                }

                // Clean up
                this.media.removeAttribute('data-type');
                this.media.removeAttribute('data-video-id');
                break;

            case 'video':
            case 'audio':
                this.type = type;

                if (this.media.hasAttribute('crossorigin')) {
                    this.config.crossorigin = true;
                }
                if (this.media.hasAttribute('autoplay')) {
                    this.config.autoplay = true;
                }
                if (this.media.hasAttribute('playsinline')) {
                    this.config.inline = true;
                }
                if (this.media.hasAttribute('muted')) {
                    this.config.muted = true;
                }
                if (this.media.hasAttribute('loop')) {
                    this.config.loop.active = true;
                }

                break;

            default:
                this.error('Setup failed: unsupported type');
                return;
        }

        // Setup local storage for user settings
        storage.setup.call(this);

        // Check for support again but with type
        this.supported = support.check(this.type, this.config.inline);

        // If no support for even API, bail
        if (!this.supported.api) {
            this.error('Setup failed: no support');
            return;
        }

        // Store reference
        this.media.plyr = this;

        // Wrap media
        this.elements.container = utils.createElement('div');
        utils.wrap(this.media, this.elements.container);

        // Allow focus to be captured
        this.elements.container.setAttribute('tabindex', 0);

        // Global listeners
        listeners.global.call(this);

        // Add style hook
        ui.addStyleHook.call(this);

        // Setup media
        media.setup.call(this);

        // Listen for events if debugging
        if (this.config.debug) {
            utils.on(this.elements.container, this.config.events.join(' '), event => {
                this.log(`event: ${event.type}`);
            });
        }

        // Setup interface
        // If embed but not fully supported, build interface now to avoid flash of controls
        if (this.isHTML5 || (this.isEmbed && !this.supported.ui)) {
            ui.build.call(this);
        }
    }

    // ---------------------------------------
    // API
    // ---------------------------------------

    /**
     * If the player is HTML5
     */
    get isHTML5() {
        return types.html5.includes(this.type);
    }

    /**
     * If the player is an embed - e.g. YouTube or Vimeo
     */
    get isEmbed() {
        return types.embed.includes(this.type);
    }

    /**
     * Play the media
     */
    play() {
        if ('play' in this.media) {
            this.media.play();
        }

        // Allow chaining
        return this;
    }

    /**
     * Pause the media
     */
    pause() {
        if ('pause' in this.media) {
            this.media.pause();
        }

        // Allow chaining
        return this;
    }

    /**
     * Toggle playback based on current status
     * @param {boolean} toggle
     */
    togglePlay(toggle) {
        // True toggle if nothing passed
        if ((!utils.is.boolean(toggle) && this.media.paused) || toggle) {
            return this.play();
        }

        return this.pause();
    }

    /**
     * Stop playback
     */
    stop() {
        return this.restart().pause();
    }

    /**
     * Restart playback
     */
    restart() {
        this.currentTime = 0;
        return this;
    }

    /**
     * Rewind
     * @param {number} seekTime - how far to rewind in seconds. Defaults to the config.seekTime
     */
    rewind(seekTime) {
        this.currentTime = this.currentTime - (utils.is.number(seekTime) ? seekTime : this.config.seekTime);
        return this;
    }

    /**
     * Fast forward
     * @param {number} seekTime - how far to fast forward in seconds. Defaults to the config.seekTime
     */
    forward(seekTime) {
        this.currentTime = this.currentTime + (utils.is.number(seekTime) ? seekTime : this.config.seekTime);
        return this;
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
        this.media.currentTime = targetTime.toFixed(4);

        // Logging
        this.log(`Seeking to ${this.currentTime} seconds`);
    }

    get currentTime() {
        return Number(this.media.currentTime);
    }

    /**
     * Get the duration of the current media
     */
    get duration() {
        // Faux duration set via config
        const fauxDuration = parseInt(this.config.duration, 10);

        // True duration
        const realDuration = Number(this.media.duration);

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
            ({ volume } = storage.get.call(this));
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

        // Set the player volume
        this.media.volume = volume;

        // Toggle muted state
        if (volume === 0) {
            this.muted = true;
        }
    }

    /**
     * Get the current player volume
     */
    get volume() {
        return this.media.volume;
    }

    // Increase volume
    increaseVolume(step) {
        const volume = this.media.muted ? 0 : this.media.volume;

        return this.setVolume(volume + utils.is.number(step) ? step : 1);
    }

    // Decrease volume
    decreaseVolume(step) {
        const volume = this.media.muted ? 0 : this.media.volume;

        return this.setVolume(volume - utils.is.number(step) ? step : 1);
    }

    // Toggle mute
    set muted(mute) {
        // If the method is called without parameter, toggle based on current value
        const toggle = utils.is.boolean(mute) ? mute : !this.media.muted;

        // Set button state
        utils.toggleState(this.elements.buttons.mute, toggle);

        // Set mute on the player
        this.media.muted = toggle;
    }

    get muted() {
        return this.media.muted;
    }

    // Playback speed
    set speed(input) {
        // Load speed from storage or default value
        let speed = utils.is.number(input)
            ? input
            : parseFloat(storage.get.call(this).speed || this.speed.selected || this.config.speed.default);

        // Set min/max
        if (speed < 0.1) {
            speed = 0.1;
        }
        if (speed > 2.0) {
            speed = 2.0;
        }

        if (!this.config.speed.options.includes(speed)) {
            this.warn(`Unsupported speed (${speed})`);
            return;
        }

        // Set media speed
        this.media.playbackRate = speed;
    }

    get speed() {
        return this.media.playbackRate;
    }

    // Set playback quality
    set quality(input) {
        // Load speed from storage or default value
        const quality = utils.is.string(input)
            ? input
            : parseFloat(storage.get.call(this).quality || this.config.quality.selected);

        if (!this.config.quality.options.includes(quality)) {
            this.warn(`Unsupported quality option (${quality})`);
            return;
        }

        // Set media speed
        switch (this.type) {
            case 'youtube':
                this.utils.dispatchEvent.call(this, this.media, 'qualityrequested', false, {
                    quality,
                });

                this.embed.setPlaybackQuality(quality);

                break;

            default:
                this.warn('Quality options are only available for YouTube');
                break;
        }
    }

    get quality() {
        // Set media speed
        switch (this.type) {
            case 'youtube':
                return this.embed.getPlaybackQuality();

            default:
                this.warn('Quality options are only available for YouTube');
                return null;
        }
    }

    // Toggle loop
    // TODO: Finish logic
    // TODO: Set the indicator on load as user may pass loop as config
    /* loop(input) {
        // Set default to be a true toggle
        const type = ['start', 'end', 'all', 'none', 'toggle'].includes(input) ? input : 'toggle';

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
        }

        // Allow chaining
        return this;
    } */

    // Media source
    set src(input) {
        source.change.call(this, input);
    }

    get src() {
        return this.media.currentSrc;
    }

    // Poster image
    set poster(input) {
        if (this.type !== 'video') {
            this.warn('Poster can only be set on HTML5 video');
            return;
        }

        if (utils.is.string(input)) {
            this.media.setAttribute('poster', input);
        }
    }

    get poster() {
        if (this.type !== 'video') {
            return null;
        }

        return this.media.getAttribute('poster');
    }

    // Toggle captions
    toggleCaptions(input) {
        // If there's no full support, or there's no caption toggle
        if (!this.supported.ui || !utils.is.htmlElement(this.elements.buttons.captions)) {
            return this;
        }

        // If the method is called without parameter, toggle based on current value
        const show = utils.is.boolean(input)
            ? input
            : this.elements.container.className.indexOf(this.config.classNames.captions.active) === -1;

        // Nothing to change...
        if (this.captions.enabled === show) {
            return this;
        }

        // Set global
        this.captions.enabled = show;

        // Toggle state
        utils.toggleState(this.elements.buttons.captions, this.captions.enabled);

        // Add class hook
        utils.toggleClass(this.elements.container, this.config.classNames.captions.active, this.captions.enabled);

        // Trigger an event
        utils.dispatchEvent.call(this, this.media, this.captions.enabled ? 'captionsenabled' : 'captionsdisabled');

        // Allow chaining
        return this;
    }

    // Caption language
    set language(input) {
        // Nothing specified
        if (!utils.is.string(input)) {
            return;
        }

        // Normalize
        const language = input.toLowerCase();

        // If nothing to change, bail
        if (this.captions.language === language) {
            return;
        }

        // Reset UI
        this.toggleCaptions(true);

        // Update config
        this.captions.language = language;

        // Trigger an event
        utils.dispatchEvent.call(this, this.media, 'captionchange');

        // Clear caption
        captions.set.call(this);

        // Re-run setup
        captions.setup.call(this);
    }

    get language() {
        return this.captions.language;
    }

    // Toggle fullscreen
    // Requires user input event
    toggleFullscreen(event) {
        // Check for native support
        if (fullscreen.enabled) {
            // If it's a fullscreen change event, update the UI
            if (utils.is.event(event) && event.type === fullscreen.eventType) {
                this.fullscreen.active = fullscreen.isFullScreen(this.elements.container);
            } else {
                // Else it's a user request to enter or exit
                if (!this.fullscreen.active) {
                    // Request full screen
                    fullscreen.requestFullScreen(this.elements.container);
                } else {
                    // Bail from fullscreen
                    fullscreen.cancelFullScreen();
                }

                // Check if we're actually full screen (it could fail)
                this.fullscreen.active = fullscreen.isFullScreen(this.elements.container);

                return this;
            }
        } else {
            // Otherwise, it's a simple toggle
            this.fullscreen.active = !this.fullscreen.active;

            // Add class hook
            utils.toggleClass(
                this.elements.container,
                this.config.classNames.fullscreen.fallback,
                this.fullscreen.active
            );

            // Make sure we don't lose scroll position
            if (this.fullscreen.active) {
                scrollPosition = {
                    x: window.pageXOffset || 0,
                    y: window.pageYOffset || 0,
                };
            } else {
                window.scrollTo(scrollPosition.x, scrollPosition.y);
            }

            // Bind/unbind escape key
            document.body.style.overflow = this.fullscreen.active ? 'hidden' : '';
        }

        // Set button state
        if (this.elements.buttons && this.elements.buttons.fullscreen) {
            utils.toggleState(this.elements.buttons.fullscreen, this.fullscreen.active);
        }

        // Trigger an event
        utils.dispatchEvent.call(this, this.media, this.fullscreen.active ? 'enterfullscreen' : 'exitfullscreen');

        return this;
    }

    // Toggle picture-in-picture
    // TODO: update player with state, support, enabled
    // TODO: detect outside changes
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

    get pip() {
        if (!support.pip) {
            return null;
        }

        return this.media.webkitPresentationMode;
    }

    // Trigger airplay
    // TODO: update player with state, support, enabled
    airplay() {
        // Bail if no support
        if (!support.airplay) {
            return this;
        }

        // Show dialog
        this.media.webkitShowPlaybackTargetPicker();

        return this;
    }

    // Show the player controls in fullscreen mode
    toggleControls(toggle) {
        const player = this;

        // We need controls of course...
        if (!utils.is.htmlElement(this.elements.controls)) {
            return player;
        }

        // Don't hide if config says not to, it's audio, or not ready or loading
        if (!this.supported.ui || !this.config.hideControls || this.type === 'audio') {
            return player;
        }

        let delay = 0;
        let show = toggle;
        let isEnterFullscreen = false;
        const loading = utils.hasClass(this.elements.container, this.config.classNames.loading);

        // Default to false if no boolean
        if (!utils.is.boolean(toggle)) {
            if (utils.is.event(toggle)) {
                // Is the enter fullscreen event
                isEnterFullscreen = toggle.type === 'enterfullscreen';

                // Whether to show controls
                show = ['mousemove', 'touchstart', 'mouseenter', 'focus'].includes(toggle.type);

                // Delay hiding on move events
                if (['mousemove', 'touchmove'].includes(toggle.type)) {
                    delay = 2000;
                }

                // Delay a little more for keyboard users
                if (toggle.type === 'focus') {
                    delay = 3000;
                }
            } else {
                show = utils.hasClass(this.elements.container, this.config.classNames.hideControls);
            }
        }

        // Clear timer every movement
        window.clearTimeout(this.timers.hover);

        // If the mouse is not over the controls, set a timeout to hide them
        if (show || this.media.paused || loading) {
            // Check if controls toggled
            const toggled = utils.toggleClass(this.elements.container, this.config.classNames.hideControls, false);

            // Trigger event
            if (toggled) {
                utils.dispatchEvent.call(this, this.media, 'controlsshown');
            }

            // Always show controls when paused or if touch
            if (this.media.paused || loading) {
                return player;
            }

            // Delay for hiding on touch
            if (support.touch) {
                delay = 3000;
            }
        }

        // If toggle is false or if we're playing (regardless of toggle),
        // then set the timer to hide the controls
        if (!show || !this.media.paused) {
            this.timers.hover = window.setTimeout(() => {
                // If the mouse is over the controls (and not entering fullscreen), bail
                if ((this.elements.controls.pressed || this.elements.controls.hover) && !isEnterFullscreen) {
                    return;
                }

                // Check if controls toggled
                const toggled = utils.toggleClass(this.elements.container, this.config.classNames.hideControls, true);

                // Trigger event and close menu
                if (toggled) {
                    utils.dispatchEvent.call(this, this.media, 'controlshidden');

                    if (this.config.controls.includes('settings') && !utils.is.empty(this.config.settings)) {
                        controls.toggleMenu.call(this, false);
                    }
                }
            }, delay);
        }

        return this;
    }

    // Event listeners
    on(event, callback) {
        utils.on(this.elements.container, event, callback);

        return this;
    }

    off(event, callback) {
        utils.off(this.elements.container, event, callback);

        return this;
    }

    // Check for support
    supports(type) {
        return support.mime.call(this, type);
    }

    // Destroy an instance
    // Event listeners are removed when elements are removed
    // http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
    destroy(callback, soft = false) {
        const done = () => {
            // Reset overflow (incase destroyed while in fullscreen)
            document.body.style.overflow = '';

            // GC for embed
            this.embed = null;

            // If it's a soft destroy, make minimal changes
            if (soft) {
                utils.removeElement(this.elements.captions);
                Array.from(this.elements.buttons.play).forEach(button => utils.removeElement(button));
                utils.removeElement(this.elements.controls);
                utils.removeElement(this.elements.wrapper);

                // Clear for GC
                this.elements.captions = null;
                this.elements.controls = null;
                this.elements.buttons.play = null;
                this.elements.wrapper = null;

                // Callback
                if (utils.is.function(callback)) {
                    callback();
                }
            } else {
                // Replace the container with the original element provided
                const parent = this.elements.container.parentNode;

                if (utils.is.htmlElement(parent)) {
                    parent.replaceChild(this.elements.original, this.elements.container);
                }

                // Event
                utils.dispatchEvent.call(this, this.elements.original, 'destroyed', true);

                // Callback
                if (utils.is.function(callback)) {
                    callback.call(this.elements.original);
                }

                // Clear for GC
                this.elements = null;
            }
        };

        // Type specific stuff
        switch (this.type) {
            case 'youtube':
                // Clear timers
                window.clearInterval(this.timers.buffering);
                window.clearInterval(this.timers.playing);

                // Destroy YouTube API
                this.embed.destroy();

                // Clean up
                done();

                break;

            case 'vimeo':
                // Destroy Vimeo API
                // then clean up (wait, to prevent postmessage errors)
                this.embed.unload().then(done);

                // Vimeo does not always return
                window.setTimeout(done, 200);

                break;

            case 'video':
            case 'audio':
                // Restore native video controls
                ui.toggleNativeControls.call(this, true);

                // Clean up
                done();

                break;

            default:
                break;
        }
    }
}

export default Plyr;
