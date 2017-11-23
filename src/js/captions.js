// ==========================================================================
// Plyr Captions
// ==========================================================================

import support from './support';
import utils from './utils';
import controls from './controls';
import storage from './storage';

const captions = {
    // Setup captions
    setup() {
        // Requires UI support
        if (!this.supported.ui) {
            return;
        }

        // Set default language if not set
        if (!utils.is.empty(storage.get.call(this).language)) {
            this.captions.language = storage.get.call(this).language;
        } else if (utils.is.empty(this.captions.language)) {
            this.captions.language = this.config.captions.language.toLowerCase();
        }

        // Set captions enabled state if not set
        if (!utils.is.boolean(this.captions.enabled)) {
            if (!utils.is.empty(storage.get.call(this).language)) {
                this.captions.enabled = storage.get.call(this).captions;
            } else {
                this.captions.enabled = this.config.captions.active;
            }
        }

        // Only Vimeo and HTML5 video supported at this point
        if (!this.isVideo || this.isYouTube || (this.isHTML5 && !support.textTracks)) {
            // Clear menu and hide
            if (this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
                controls.setCaptionsMenu.call(this);
            }

            return;
        }

        // Inject the container
        if (!utils.is.htmlElement(this.elements.captions)) {
            this.elements.captions = utils.createElement('div', utils.getAttributesFromSelector(this.config.selectors.captions));

            utils.insertAfter(this.elements.captions, this.elements.wrapper);
        }

        // Set the class hook
        utils.toggleClass(this.elements.container, this.config.classNames.captions.enabled, !utils.is.empty(captions.getTracks.call(this)));

        // If no caption file exists, hide container for caption text
        if (utils.is.empty(captions.getTracks.call(this))) {
            return;
        }

        // Set language
        captions.setLanguage.call(this);

        // Enable UI
        captions.show.call(this);

        // Set available languages in list
        if (this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
            controls.setCaptionsMenu.call(this);
        }
    },

    // Set the captions language
    setLanguage() {
        // Setup HTML5 track rendering
        if (this.isHTML5 && this.isVideo) {
            captions.getTracks.call(this).forEach(track => {
                // Remove previous bindings
                utils.on(track, 'cuechange', event => captions.setCue.call(this, event));

                // Turn off native caption rendering to avoid double captions
                // eslint-disable-next-line
                track.mode = 'hidden';
            });

            // Get current track
            const currentTrack = captions.getCurrentTrack.call(this);

            // Check if suported kind
            if (utils.is.track(currentTrack)) {
                // If we change the active track while a cue is already displayed we need to update it
                if (Array.from(currentTrack.activeCues || []).length) {
                    captions.setCue.call(this, currentTrack);
                }
            }
        } else if (this.isVimeo && this.captions.active) {
            this.embed.enableTextTrack(this.language);
        }
    },

    // Get the tracks
    getTracks() {
        // Return empty array at least
        if (utils.is.nullOrUndefined(this.media)) {
            return [];
        }

        // Only get accepted kinds
        return Array.from(this.media.textTracks || []).filter(track => ['captions', 'subtitles'].includes(track.kind));
    },

    // Get the current track for the current language
    getCurrentTrack() {
        return captions.getTracks.call(this).find(track => track.language.toLowerCase() === this.language);
    },

    // Display active caption if it contains text
    setCue(input) {
        // Get the track from the event if needed
        const track = utils.is.event(input) ? input.target : input;
        const active = track.activeCues[0];
        const currentTrack = captions.getCurrentTrack.call(this);

        // Only display current track
        if (track !== currentTrack) {
            return;
        }

        // Display a cue, if there is one
        if (utils.is.cue(active)) {
            captions.setText.call(this, active.getCueAsHTML());
        } else {
            captions.setText.call(this, null);
        }

        utils.dispatchEvent.call(this, this.media, 'cuechange');
    },

    // Set the current caption
    setText(input) {
        // Requires UI
        if (!this.supported.ui) {
            return;
        }

        if (utils.is.htmlElement(this.elements.captions)) {
            const content = utils.createElement('span');

            // Empty the container
            utils.emptyElement(this.elements.captions);

            // Default to empty
            const caption = !utils.is.nullOrUndefined(input) ? input : '';

            // Set the span content
            if (utils.is.string(caption)) {
                content.textContent = caption.trim();
            } else {
                content.appendChild(caption);
            }

            // Set new caption text
            this.elements.captions.appendChild(content);
        } else {
            this.console.warn('No captions element to render to');
        }
    },

    // Display captions container and button (for initialization)
    show() {
        // If there's no caption toggle, bail
        if (!utils.is.htmlElement(this.elements.buttons.captions)) {
            return;
        }

        // Try to load the value from storage
        let active = storage.get.call(this).captions;

        // Otherwise fall back to the default config
        if (!utils.is.boolean(active)) {
            ({ active } = this.config.captions);
        } else {
            this.captions.active = active;
        }

        if (active) {
            utils.toggleClass(this.elements.container, this.config.classNames.captions.active, true);
            utils.toggleState(this.elements.buttons.captions, true);
        }
    },
};

export default captions;
