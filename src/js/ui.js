// ==========================================================================
// Plyr UI
// ==========================================================================

import captions from './captions';
import controls from './controls';
import i18n from './i18n';
import support from './support';
import browser from './utils/browser';
import { getElement, toggleClass } from './utils/elements';
import { ready, triggerEvent } from './utils/events';
import is from './utils/is';
import loadImage from './utils/loadImage';

const ui = {
    addStyleHook() {
        toggleClass(this.elements.container, this.config.selectors.container.replace('.', ''), true);
        toggleClass(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
    },

    // Toggle native HTML5 media controls
    toggleNativeControls(toggle = false) {
        if (toggle && this.isHTML5) {
            this.media.setAttribute('controls', '');
        } else {
            this.media.removeAttribute('controls');
        }
    },

    // Setup the UI
    build() {
        // Re-attach media element listeners
        // TODO: Use event bubbling?
        this.listeners.media();

        // Don't setup interface if no support
        if (!this.supported.ui) {
            this.debug.warn(`Basic support only for ${this.provider} ${this.type}`);

            // Restore native controls
            ui.toggleNativeControls.call(this, true);

            // Bail
            return;
        }

        // Inject custom controls if not present
        if (!is.element(this.elements.controls)) {
            // Inject custom controls
            controls.inject.call(this);

            // Re-attach control listeners
            this.listeners.controls();
        }

        // Remove native controls
        ui.toggleNativeControls.call(this);

        // Setup captions for HTML5
        if (this.isHTML5) {
            captions.setup.call(this);
        }

        // Reset volume
        this.volume = null;

        // Reset mute state
        this.muted = null;

        // Reset speed
        this.speed = null;

        // Reset loop state
        this.loop = null;

        // Reset quality setting
        this.quality = null;

        // Reset volume display
        controls.updateVolume.call(this);

        // Reset time display
        controls.timeUpdate.call(this);

        // Update the UI
        ui.checkPlaying.call(this);

        // Check for picture-in-picture support
        toggleClass(
            this.elements.container,
            this.config.classNames.pip.supported,
            support.pip && this.isHTML5 && this.isVideo,
        );

        // Check for airplay support
        toggleClass(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5);

        // Add iOS class
        toggleClass(this.elements.container, this.config.classNames.isIos, browser.isIos);

        // Add touch class
        toggleClass(this.elements.container, this.config.classNames.isTouch, this.touch);

        // Ready for API calls
        this.ready = true;

        // Ready event at end of execution stack
        setTimeout(() => {
            triggerEvent.call(this, this.media, 'ready');
        }, 0);

        // Set the title
        ui.setTitle.call(this);

        // Assure the poster image is set, if the property was added before the element was created
        if (this.poster) {
            ui.setPoster.call(this, this.poster, false).catch(() => {});
        }

        // Manually set the duration if user has overridden it.
        // The event listeners for it doesn't get called if preload is disabled (#701)
        if (this.config.duration) {
            controls.durationUpdate.call(this);
        }
    },

    // Setup aria attribute for play and iframe title
    setTitle() {
        // Find the current text
        let label = i18n.get('play', this.config);

        // If there's a media title set, use that for the label
        if (is.string(this.config.title) && !is.empty(this.config.title)) {
            label += `, ${this.config.title}`;
        }

        // If there's a play button, set label
        Array.from(this.elements.buttons.play || []).forEach(button => {
            button.setAttribute('aria-label', label);
        });

        // Set iframe title
        // https://github.com/sampotts/plyr/issues/124
        if (this.isEmbed) {
            const iframe = getElement.call(this, 'iframe');

            if (!is.element(iframe)) {
                return;
            }

            // Default to media type
            const title = !is.empty(this.config.title) ? this.config.title : 'video';
            const format = i18n.get('frameTitle', this.config);

            iframe.setAttribute('title', format.replace('{title}', title));
        }
    },

    // Toggle poster
    togglePoster(enable) {
        toggleClass(this.elements.container, this.config.classNames.posterEnabled, enable);
    },

    // Set the poster image (async)
    // Used internally for the poster setter, with the passive option forced to false
    setPoster(poster, passive = true) {
        // Don't override if call is passive
        if (passive && this.poster) {
            return Promise.reject(new Error('Poster already set'));
        }

        // Set property synchronously to respect the call order
        this.media.setAttribute('poster', poster);

        // Wait until ui is ready
        return (
            ready
                .call(this)
                // Load image
                .then(() => loadImage(poster))
                .catch(err => {
                    // Hide poster on error unless it's been set by another call
                    if (poster === this.poster) {
                        ui.togglePoster.call(this, false);
                    }
                    // Rethrow
                    throw err;
                })
                .then(() => {
                    // Prevent race conditions
                    if (poster !== this.poster) {
                        throw new Error('setPoster cancelled by later call to setPoster');
                    }
                })
                .then(() => {
                    Object.assign(this.elements.poster.style, {
                        backgroundImage: `url('${poster}')`,
                        // Reset backgroundSize as well (since it can be set to "cover" for padded thumbnails for youtube)
                        backgroundSize: '',
                    });
                    ui.togglePoster.call(this, true);
                    return poster;
                })
        );
    },

    // Check playing state
    checkPlaying(event) {
        // Class hooks
        toggleClass(this.elements.container, this.config.classNames.playing, this.playing);
        toggleClass(this.elements.container, this.config.classNames.paused, this.paused);
        toggleClass(this.elements.container, this.config.classNames.stopped, this.stopped);

        // Set state
        Array.from(this.elements.buttons.play || []).forEach(target => {
            target.pressed = this.playing;
        });

        // Only update controls on non timeupdate events
        if (is.event(event) && event.type === 'timeupdate') {
            return;
        }

        // Toggle controls
        ui.toggleControls.call(this);
    },

    // Check if media is loading
    checkLoading(event) {
        this.loading = ['stalled', 'waiting'].includes(event.type);

        // Clear timer
        clearTimeout(this.timers.loading);

        // Timer to prevent flicker when seeking
        this.timers.loading = setTimeout(() => {
            // Update progress bar loading class state
            toggleClass(this.elements.container, this.config.classNames.loading, this.loading);

            // Update controls visibility
            ui.toggleControls.call(this);
        }, this.loading ? 250 : 0);
    },

    // Toggle controls based on state and `force` argument
    toggleControls(force) {
        const { controls } = this.elements;

        if (controls && this.config.hideControls) {
            // Show controls if force, loading, paused, or button interaction, otherwise hide
            this.toggleControls(Boolean(force || this.loading || this.paused || controls.pressed || controls.hover));
        }
    },
};

export default ui;
