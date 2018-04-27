// ==========================================================================
// Plyr UI
// ==========================================================================

import utils from './utils';
import captions from './captions';
import controls from './controls';
import i18n from './i18n';

const ui = {
    addStyleHook() {
        utils.toggleClass(this.elements.container, this.config.selectors.container.replace('.', ''), true);
        utils.toggleClass(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
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
        if (!utils.is.element(this.elements.controls)) {
            // Inject custom controls
            controls.inject.call(this);

            // Re-attach control listeners
            this.listeners.controls();
        }

        // Remove native controls
        ui.toggleNativeControls.call(this);

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

        // Reset quality setting
        this.quality = null;

        // Reset volume display
        ui.updateVolume.call(this);

        // Reset time display
        ui.timeUpdate.call(this);

        // Update the UI
        ui.checkPlaying.call(this);

        // Ready for API calls
        this.ready = true;

        // Ready event at end of execution stack
        setTimeout(() => {
            utils.dispatchEvent.call(this, this.media, 'ready');
        }, 0);

        // Set the title
        ui.setTitle.call(this);
    },

    // Setup aria attribute for play and iframe title
    setTitle() {
        // Find the current text
        let label = i18n.get('play', this.config);

        // If there's a media title set, use that for the label
        if (utils.is.string(this.config.title) && !utils.is.empty(this.config.title)) {
            label += `, ${this.config.title}`;

            // Set container label
            this.elements.container.setAttribute('aria-label', this.config.title);
        }

        // If there's a play button, set label
        if (utils.is.nodeList(this.elements.buttons.play)) {
            Array.from(this.elements.buttons.play).forEach(button => {
                button.setAttribute('aria-label', label);
            });
        }

        // Set iframe title
        // https://github.com/sampotts/plyr/issues/124
        if (this.isEmbed) {
            const iframe = utils.getElement.call(this, 'iframe');

            if (!utils.is.element(iframe)) {
                return;
            }

            // Default to media type
            const title = !utils.is.empty(this.config.title) ? this.config.title : 'video';

            iframe.setAttribute('title', i18n.get('frameTitle', this.config));
        }
    },

    // Check playing state
    checkPlaying() {
        // Class hooks
        utils.toggleClass(this.elements.container, this.config.classNames.playing, this.playing);
        utils.toggleClass(this.elements.container, this.config.classNames.stopped, this.paused);

        // Set ARIA state
        utils.toggleState(this.elements.buttons.play, this.playing);

        // Toggle controls
        this.toggleControls(!this.playing);
    },

    // Check if media is loading
    checkLoading(event) {
        this.loading = [
            'stalled',
            'waiting',
        ].includes(event.type);

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

    // Check if media failed to load
    checkFailed() {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/networkState
        this.failed = this.media.networkState === 3;

        if (this.failed) {
            utils.toggleClass(this.elements.container, this.config.classNames.loading, false);
            utils.toggleClass(this.elements.container, this.config.classNames.error, true);
        }

        // Clear timer
        clearTimeout(this.timers.failed);

        // Timer to prevent flicker when seeking
        this.timers.loading = setTimeout(() => {
            // Toggle container class hook
            utils.toggleClass(this.elements.container, this.config.classNames.loading, this.loading);

            // Show controls if loading, hide if done
            this.toggleControls(this.loading);
        }, this.loading ? 250 : 0);
    },

    // Update volume UI and storage
    updateVolume() {
        if (!this.supported.ui) {
            return;
        }

        // Update range
        if (utils.is.element(this.elements.inputs.volume)) {
            ui.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume);
        }

        // Update mute state
        if (utils.is.element(this.elements.buttons.mute)) {
            utils.toggleState(this.elements.buttons.mute, this.muted || this.volume === 0);
        }
    },

    // Update seek value and lower fill
    setRange(target, value = 0) {
        if (!utils.is.element(target)) {
            return;
        }

        // eslint-disable-next-line
        target.value = value;

        // Webkit range fill
        controls.updateRangeFill.call(this, target);
    },

    // Set <progress> value
    setProgress(target, input) {
        const value = utils.is.number(input) ? input : 0;
        const progress = utils.is.element(target) ? target : this.elements.display.buffer;

        // Update value and label
        if (utils.is.element(progress)) {
            progress.value = value;

            // Update text label inside
            const label = progress.getElementsByTagName('span')[0];
            if (utils.is.element(label)) {
                label.childNodes[0].nodeValue = value;
            }
        }
    },

    // Update <progress> elements
    updateProgress(event) {
        if (!this.supported.ui || !utils.is.event(event)) {
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
                    ui.setProgress.call(this, this.elements.display.buffer, this.buffered * 100);

                    break;

                default:
                    break;
            }
        }
    },

    // Update the displayed time
    updateTimeDisplay(target = null, time = 0, inverted = false) {
        // Bail if there's no element to display or the value isn't a number
        if (!utils.is.element(target) || !utils.is.number(time)) {
            return;
        }

        // Always display hours if duration is over an hour
        const forceHours = utils.getHours(this.duration) > 0;

        // eslint-disable-next-line no-param-reassign
        target.textContent = utils.formatTime(time, forceHours, inverted);
    },

    // Handle time change event
    timeUpdate(event) {
        // Only invert if only one time element is displayed and used for both duration and currentTime
        const invert = !utils.is.element(this.elements.display.duration) && this.config.invertTime;

        // Duration
        ui.updateTimeDisplay.call(this, this.elements.display.currentTime, invert ? this.duration - this.currentTime : this.currentTime, invert);

        // Ignore updates while seeking
        if (event && event.type === 'timeupdate' && this.media.seeking) {
            return;
        }

        // Playing progress
        ui.updateProgress.call(this, event);
    },

    // Show the duration on metadataloaded
    durationUpdate() {
        if (!this.supported.ui) {
            return;
        }

        // If there's a spot to display duration
        const hasDuration = utils.is.element(this.elements.display.duration);

        // If there's only one time display, display duration there
        if (!hasDuration && this.config.displayDuration && this.paused) {
            ui.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration);
        }

        // If there's a duration element, update content
        if (hasDuration) {
            ui.updateTimeDisplay.call(this, this.elements.display.duration, this.duration);
        }

        // Update the tooltip (if visible)
        controls.updateSeekTooltip.call(this);
    },
};

export default ui;
