// ==========================================================================
// Plyr UI
// ==========================================================================

import captions from './captions';
import controls from './controls';
import i18n from './i18n';
import support from './support';
import utils from './utils';

// Sniff out the browser
const browser = utils.getBrowser();

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
        controls.updateVolume.call(this);

        // Reset time display
        controls.timeUpdate.call(this);

        // Update the UI
        ui.checkPlaying.call(this);

        // Check for picture-in-picture support
        utils.toggleClass(this.elements.container, this.config.classNames.pip.supported, support.pip && this.isHTML5 && this.isVideo);

        // Check for airplay support
        utils.toggleClass(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5);

        // Add iOS class
        utils.toggleClass(this.elements.container, this.config.classNames.isIos, browser.isIos);

        // Add touch class
        utils.toggleClass(this.elements.container, this.config.classNames.isTouch, this.touch);

        // Ready for API calls
        this.ready = true;

        // Ready event at end of execution stack
        setTimeout(() => {
            utils.dispatchEvent.call(this, this.media, 'ready');
        }, 0);

        // Set the title
        ui.setTitle.call(this);

        // Set the poster image
        ui.setPoster.call(this);
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
            const format = i18n.get('frameTitle', this.config);

            iframe.setAttribute('title', format.replace('{title}', title));
        }
    },

    // Set the poster image
    setPoster() {
        if (!utils.is.element(this.elements.poster) || utils.is.empty(this.poster)) {
            return;
        }

        // Set the inline style
        const posters = this.poster.split(',');
        this.elements.poster.style.backgroundImage = posters.map(p => `url('${p}')`).join(',');
    },

    // Check playing state
    checkPlaying(event) {
        // Class hooks
        utils.toggleClass(this.elements.container, this.config.classNames.playing, this.playing);
        utils.toggleClass(this.elements.container, this.config.classNames.paused, this.paused);
        utils.toggleClass(this.elements.container, this.config.classNames.stopped, this.stopped);

        // Set ARIA state
        utils.toggleState(this.elements.buttons.play, this.playing);

        // Only update controls on non timeupdate events
        if (utils.is.event(event) && event.type === 'timeupdate') {
            return;
        }

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
};

export default ui;
