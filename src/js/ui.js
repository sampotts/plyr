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

        // Assure the poster image is set, if the property was added before the element was created
        if (this.poster && this.elements.poster && !this.elements.poster.style.backgroundImage) {
            ui.setPoster.call(this, this.poster);
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
        if (utils.is.string(this.config.title) && !utils.is.empty(this.config.title)) {
            label += `, ${this.config.title}`;
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

    // Toggle poster
    togglePoster(enable) {
        utils.toggleClass(this.elements.container, this.config.classNames.posterEnabled, enable);
    },

    // Set the poster image (async)
    setPoster(poster) {
        // Set property regardless of validity
        this.media.setAttribute('poster', poster);

        // Bail if element is missing
        if (!utils.is.element(this.elements.poster)) {
            return Promise.reject();
        }

        // Load the image, and set poster if successful
        const loadPromise = utils.loadImage(poster).then(() => {
            this.elements.poster.style.backgroundImage = `url('${poster}')`;
            Object.assign(this.elements.poster.style, {
                backgroundImage: `url('${poster}')`,
                // Reset backgroundSize as well (since it can be set to "cover" for padded thumbnails for youtube)
                backgroundSize: '',
            });
            ui.togglePoster.call(this, true);
            return poster;
        });

        // Hide the element if the poster can't be loaded (otherwise it will just be a black element covering the video)
        loadPromise.catch(() => ui.togglePoster.call(this, false));

        // Return the promise so the caller can use it as well
        return loadPromise;
    },

    // Check playing state
    checkPlaying(event) {
        // Class hooks
        utils.toggleClass(this.elements.container, this.config.classNames.playing, this.playing);
        utils.toggleClass(this.elements.container, this.config.classNames.paused, this.paused);
        utils.toggleClass(this.elements.container, this.config.classNames.stopped, this.stopped);

        // Set state
        Array.from(this.elements.buttons.play).forEach(target => {
            target.pressed = this.playing;
        });

        // Only update controls on non timeupdate events
        if (utils.is.event(event) && event.type === 'timeupdate') {
            return;
        }

        // Toggle controls
        ui.toggleControls.call(this);
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
            // Update progress bar loading class state
            utils.toggleClass(this.elements.container, this.config.classNames.loading, this.loading);

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
