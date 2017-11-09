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
        if (!['video', 'vimeo'].includes(this.type) || (this.type === 'video' && !support.textTracks)) {
            this.captions.tracks = null;

            // Clear menu and hide
            if (this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
                controls.setCaptionsMenu.call(this);
            }

            return;
        }

        // Inject the container
        if (!utils.is.htmlElement(this.elements.captions)) {
            this.elements.captions = utils.createElement(
                'div',
                utils.getAttributesFromSelector(this.config.selectors.captions)
            );
            utils.insertAfter(this.elements.captions, this.elements.wrapper);
        }

        // Get tracks from HTML5
        if (this.type === 'video') {
            this.captions.tracks = this.media.textTracks;
        }

        // Set the class hook
        utils.toggleClass(
            this.elements.container,
            this.config.classNames.captions.enabled,
            !utils.is.empty(this.captions.tracks)
        );

        // If no caption file exists, hide container for caption text
        if (utils.is.empty(this.captions.tracks)) {
            return;
        }

        // Enable UI
        captions.show.call(this);

        // Get a track
        const setCurrentTrack = () => {
            // Reset by default
            this.captions.currentTrack = null;

            // Filter doesn't seem to work for a TextTrackList :-(
            Array.from(this.captions.tracks).forEach(track => {
                if (track.language === this.captions.language.toLowerCase()) {
                    this.captions.currentTrack = track;
                }
            });
        };

        // Get current track
        setCurrentTrack();

        // If we couldn't get the requested language, revert to default
        if (!utils.is.track(this.captions.currentTrack)) {
            const { language } = this.config.captions;

            // Reset to default
            // We don't update user storage as the selected language could become available
            this.captions.language = language;

            // Get fallback track
            setCurrentTrack();

            // If no match, disable captions
            if (!utils.is.track(this.captions.currentTrack)) {
                this.toggleCaptions(false);
            }

            controls.updateSetting.call(this, 'captions');
        }

        // Setup HTML5 track rendering
        if (this.type === 'video') {
            // Turn off native caption rendering to avoid double captions
            Array.from(this.captions.tracks).forEach(track => {
                // Remove previous bindings (if we've changed source or language)
                utils.off(track, 'cuechange', event => captions.setCue.call(this, event));

                // Hide captions
                // eslint-disable-next-line
                track.mode = 'hidden';
            });

            // Check if suported kind
            const supported =
                this.captions.currentTrack && ['captions', 'subtitles'].includes(this.captions.currentTrack.kind);

            if (utils.is.track(this.captions.currentTrack) && supported) {
                utils.on(this.captions.currentTrack, 'cuechange', event => captions.setCue.call(this, event));

                // If we change the active track while a cue is already displayed we need to update it
                if (this.captions.currentTrack.activeCues && this.captions.currentTrack.activeCues.length > 0) {
                    captions.setCue.call(this, this.captions.currentTrack);
                }
            }
        } else if (this.type === 'vimeo' && this.captions.active) {
            this.embed.enableTextTrack(this.captions.language);
        }

        // Set available languages in list
        if (this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
            controls.setCaptionsMenu.call(this);
        }
    },

    // Display active caption if it contains text
    setCue(input) {
        // Get the track from the event if needed
        const track = utils.is.event(input) ? input.target : input;
        const active = track.activeCues[0];

        // Display a cue, if there is one
        if (utils.is.cue(active)) {
            captions.set.call(this, active.getCueAsHTML());
        } else {
            captions.set.call(this);
        }

        utils.dispatchEvent.call(this, this.media, 'cuechange');
    },

    // Set the current caption
    set(input) {
        // Requires UI
        if (!this.supported.ui) {
            return;
        }

        if (utils.is.htmlElement(this.elements.captions)) {
            const content = utils.createElement('span');

            // Empty the container
            utils.emptyElement(this.elements.captions);

            // Default to empty
            const caption = !utils.is.undefined(input) ? input : '';

            // Set the span content
            if (utils.is.string(caption)) {
                content.textContent = caption.trim();
            } else {
                content.appendChild(caption);
            }

            // Set new caption text
            this.elements.captions.appendChild(content);
        } else {
            this.warn('No captions element to render to');
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
