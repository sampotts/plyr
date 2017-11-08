// ==========================================================================
// Plyr UI
// ==========================================================================

import utils from './utils';
import captions from './captions';
import controls from './controls';
import fullscreen from './fullscreen';
import listeners from './listeners';

const ui = {
    addStyleHook() {
        utils.toggleClass(this.elements.container, this.config.selectors.container.replace('.', ''), true);
        utils.toggleClass(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
    },

    // Toggle native HTML5 media controls
    toggleNativeControls(toggle) {
        if (toggle && this.isHTML5) {
            this.media.setAttribute('controls', '');
        } else {
            this.media.removeAttribute('controls');
        }
    },

    // Setup the UI
    build() {
        // Re-attach media element listeners
        // TODO: Use event bubbling
        listeners.media.call(this);

        // Don't setup interface if no support
        if (!this.supported.ui) {
            this.warn(`Basic support only for ${this.type}`);

            // Remove controls
            utils.removeElement.call(this, 'controls');

            // Remove large play
            utils.removeElement.call(this, 'buttons.play');

            // Restore native controls
            ui.toggleNativeControls.call(this, true);

            // Bail
            return;
        }

        // Inject custom controls if not present
        if (!utils.is.htmlElement(this.elements.controls)) {
            // Inject custom controls
            controls.inject.call(this);

            // Re-attach control listeners
            listeners.controls.call(this);
        }

        // If there's no controls, bail
        if (!utils.is.htmlElement(this.elements.controls)) {
            return;
        }

        // Remove native controls
        ui.toggleNativeControls.call(this);

        // Setup fullscreen
        fullscreen.setup.call(this);

        // Captions
        captions.setup.call(this);

        // Reset volume
        this.volume = null;

        // Reset mute state
        this.muted = null;

        // Reset speed
        this.speed = null;

        // Reset loop state
        this.loop = null;

        // Reset quality options
        this.options.quality = [];

        // Reset time display
        ui.timeUpdate.call(this);

        // Update the UI
        ui.checkPlaying.call(this);

        // Ready for API calls
        this.ready = true;

        // Ready event at end of execution stack
        utils.dispatchEvent.call(this, this.media, 'ready');

        // Autoplay
        // TODO: check we still need this?
        /* if (this.isEmbed && this.config.autoplay) {
            this.play();
        } */
    },

    // Show the duration on metadataloaded
    displayDuration() {
        if (!this.supported.ui) {
            return;
        }

        // If there's only one time display, display duration there
        if (!this.elements.display.duration && this.config.displayDuration && this.media.paused) {
            ui.updateTimeDisplay.call(this, this.duration, this.elements.display.currentTime);
        }

        // If there's a duration element, update content
        if (this.elements.display.duration) {
            ui.updateTimeDisplay.call(this, this.duration, this.elements.display.duration);
        }

        // Update the tooltip (if visible)
        controls.updateSeekTooltip.call(this);
    },

    // Setup aria attribute for play and iframe title
    setTitle() {
        // Find the current text
        let label = this.config.i18n.play;

        // If there's a media title set, use that for the label
        if (utils.is.string(this.config.title) && !utils.is.empty(this.config.title)) {
            label += `, ${this.config.title}`;

            // Set container label
            this.elements.container.setAttribute('aria-label', this.config.title);
        }

        // If there's a play button, set label
        if (this.supported.ui) {
            if (utils.is.htmlElement(this.elements.buttons.play)) {
                this.elements.buttons.play.setAttribute('aria-label', label);
            }
            if (utils.is.htmlElement(this.elements.buttons.playLarge)) {
                this.elements.buttons.playLarge.setAttribute('aria-label', label);
            }
        }

        // Set iframe title
        // https://github.com/sampotts/plyr/issues/124
        if (this.isEmbed) {
            const iframe = utils.getElement.call(this, 'iframe');

            if (!utils.is.htmlElement(iframe)) {
                return;
            }

            // Default to media type
            const title = !utils.is.empty(this.config.title) ? this.config.title : 'video';

            iframe.setAttribute('title', this.config.i18n.frameTitle.replace('{title}', title));
        }
    },

    // Check playing state
    checkPlaying() {
        utils.toggleClass(this.elements.container, this.config.classNames.playing, !this.media.paused);

        utils.toggleClass(this.elements.container, this.config.classNames.stopped, this.media.paused);

        this.toggleControls(this.media.paused);
    },

    // Update volume UI and storage
    updateVolume() {
        // Update the <input type="range"> if present
        if (this.supported.ui) {
            const value = this.muted ? 0 : this.volume;

            if (utils.is.htmlElement(this.elements.inputs.volume)) {
                ui.setRange.call(this, this.elements.inputs.volume, value);
            }
        }

        // Toggle class if muted
        utils.toggleClass(this.elements.container, this.config.classNames.muted, this.muted);

        // Update checkbox for mute state
        if (this.supported.ui && utils.is.htmlElement(this.elements.buttons.mute)) {
            utils.toggleState(this.elements.buttons.mute, this.muted);
        }
    },

    // Check if media is loading
    checkLoading(event) {
        this.loading = event.type === 'waiting';

        // Clear timer
        clearTimeout(this.timers.loading);

        // Timer to prevent flicker when seeking
        this.timers.loading = setTimeout(() => {
            // Toggle container class hook
            utils.toggleClass(this.elements.container, this.config.classNames.loading, this.loading);

            // Show controls if loading, hide if done
            this.toggleControls(this.loading);
        }, this.loading ? 250 : 0);
    },

    // Update seek value and lower fill
    setRange(target, value) {
        if (!utils.is.htmlElement(target)) {
            return;
        }

        target.value = value;

        // Webkit range fill
        controls.updateRangeFill.call(this, target);
    },

    // Set <progress> value
    setProgress(target, input) {
        // Default to 0
        const value = !utils.is.undefined(input) ? input : 0;
        const progress = !utils.is.undefined(target) ? target : this.elements.display.buffer;

        // Update value and label
        if (utils.is.htmlElement(progress)) {
            progress.value = value;

            // Update text label inside
            const label = progress.getElementsByTagName('span')[0];
            if (utils.is.htmlElement(label)) {
                label.childNodes[0].nodeValue = value;
            }
        }
    },

    // Update <progress> elements
    updateProgress(event) {
        if (!this.supported.ui) {
            return;
        }

        let value = 0;

        if (event) {
            switch (event.type) {
                // Video playing
                case 'timeupdate':
                case 'seeking':
                    value = utils.getPercentage(this.currentTime, this.duration);

                    // Set seek range value only if it's a 'natural' time event
                    if (event.type === 'timeupdate') {
                        ui.setRange.call(this, this.elements.inputs.seek, value);
                    }

                    break;

                // Check buffer status
                case 'playing':
                case 'progress':
                    value = (() => {
                        const { buffered } = this.media;

                        if (buffered && buffered.length) {
                            // HTML5
                            return utils.getPercentage(buffered.end(0), this.duration);
                        } else if (utils.is.number(buffered)) {
                            // YouTube returns between 0 and 1
                            return buffered * 100;
                        }

                        return 0;
                    })();

                    ui.setProgress.call(this, this.elements.display.buffer, value);

                    break;

                default:
                    break;
            }
        }
    },

    // Update the displayed time
    updateTimeDisplay(value, element) {
        // Bail if there's no duration display
        if (!utils.is.htmlElement(element)) {
            return null;
        }

        // Fallback to 0
        const time = !Number.isNaN(value) ? value : 0;

        let secs = parseInt(time % 60, 10);
        let mins = parseInt((time / 60) % 60, 10);
        const hours = parseInt((time / 60 / 60) % 60, 10);

        // Do we need to display hours?
        const displayHours = parseInt((this.duration / 60 / 60) % 60, 10) > 0;

        // Ensure it's two digits. For example, 03 rather than 3.
        secs = `0${secs}`.slice(-2);
        mins = `0${mins}`.slice(-2);

        // Generate display
        const display = `${(displayHours ? `${hours}:` : '') + mins}:${secs}`;

        // Render
        element.textContent = display;

        // Return for looping
        return display;
    },

    // Handle time change event
    timeUpdate(event) {
        // Duration
        ui.updateTimeDisplay.call(this, this.currentTime, this.elements.display.currentTime);

        // Ignore updates while seeking
        if (event && event.type === 'timeupdate' && this.media.seeking) {
            return;
        }

        // Playing progress
        ui.updateProgress.call(this, event);
    },
};

export default ui;
