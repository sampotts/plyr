// ==========================================================================
// Plyr Captions
// TODO: Create as class
// ==========================================================================

import support from './support';
import utils from './utils';
import controls from './controls';
import i18n from './i18n';

const captions = {
    // Setup captions
    setup() {
        // Requires UI support
        if (!this.supported.ui) {
            return;
        }

        // Set default language if not set
        const stored = this.storage.get('language');

        if (!utils.is.empty(stored)) {
            this.captions.language = stored;
        }

        if (utils.is.empty(this.captions.language)) {
            this.captions.language = this.config.captions.language.toLowerCase();
        }

        // Set captions enabled state if not set
        if (!utils.is.boolean(this.captions.active)) {
            const active = this.storage.get('captions');

            if (utils.is.boolean(active)) {
                this.captions.active = active;
            } else {
                this.captions.active = this.config.captions.active;
            }
        }

        // Only Vimeo and HTML5 video supported at this point
        if (!this.isVideo || this.isYouTube || (this.isHTML5 && !support.textTracks)) {
            // Clear menu and hide
            if (utils.is.array(this.config.controls) && this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
                controls.setCaptionsMenu.call(this);
            }

            return;
        }

        // Inject the container
        if (!utils.is.element(this.elements.captions)) {
            this.elements.captions = utils.createElement('div', utils.getAttributesFromSelector(this.config.selectors.captions));

            utils.insertAfter(this.elements.captions, this.elements.wrapper);
        }

        // Set the class hook
        utils.toggleClass(this.elements.container, this.config.classNames.captions.enabled, !utils.is.empty(captions.getTracks.call(this)));

        // Get tracks
        const tracks = captions.getTracks.call(this);

        // If no caption file exists, hide container for caption text
        if (utils.is.empty(tracks)) {
            return;
        }

        // Get browser info
        const browser = utils.getBrowser();

        // Fix IE captions if CORS is used
        // Fetch captions and inject as blobs instead (data URIs not supported!)
        if (browser.isIE && window.URL) {
            const elements = this.media.querySelectorAll('track');

            Array.from(elements).forEach(track => {
                const src = track.getAttribute('src');
                const href = utils.parseUrl(src);

                if (href.hostname !== window.location.href.hostname && [
                    'http:',
                    'https:',
                ].includes(href.protocol)) {
                    utils
                        .fetch(src, 'blob')
                        .then(blob => {
                            track.setAttribute('src', window.URL.createObjectURL(blob));
                        })
                        .catch(() => {
                            utils.removeElement(track);
                        });
                }
            });
        }

        // Set language
        captions.setLanguage.call(this);

        // Enable UI
        captions.show.call(this);

        // Set available languages in list
        if (utils.is.array(this.config.controls) && this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
            controls.setCaptionsMenu.call(this);
        }
    },

    // Set the captions language
    setLanguage() {
        // Setup HTML5 track rendering
        if (this.isHTML5 && this.isVideo) {
            captions.getTracks.call(this).forEach(track => {
                // Show track
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
        return Array.from(this.media.textTracks || []).filter(track => [
            'captions',
            'subtitles',
        ].includes(track.kind));
    },

    // Get the current track for the current language
    getCurrentTrack() {
        const tracks = captions.getTracks.call(this);

        if (!tracks.length) {
            return null;
        }

        // Get track based on current language
        let track = tracks.find(track => track.language.toLowerCase() === this.language);

        // Get the <track> with default attribute
        if (!track) {
            track = utils.getElement.call(this, 'track[default]');
        }

        // Get the first track
        if (!track) {
            [track] = tracks;
        }

        return track;
    },

    // Get UI label for track
    getLabel(track) {
        let currentTrack = track;

        if (!utils.is.track(currentTrack) && support.textTracks && this.captions.active) {
            currentTrack = captions.getCurrentTrack.call(this);
        }

        if (utils.is.track(currentTrack)) {
            if (!utils.is.empty(currentTrack.label)) {
                return currentTrack.label;
            }

            if (!utils.is.empty(currentTrack.language)) {
                return track.language.toUpperCase();
            }

            return i18n.get('enabled', this.config);
        }

        return i18n.get('disabled', this.config);
    },

    // Display active caption if it contains text
    setCue(input) {
        // Get the track from the event if needed
        const track = utils.is.event(input) ? input.target : input;
        const { activeCues } = track;
        const active = activeCues.length && activeCues[0];
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

        if (utils.is.element(this.elements.captions)) {
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
            this.debug.warn('No captions element to render to');
        }
    },

    // Display captions container and button (for initialization)
    show() {
        // Try to load the value from storage
        let active = this.storage.get('captions');

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
