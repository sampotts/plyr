// ==========================================================================
// Plyr Captions
// TODO: Create as class
// ==========================================================================

import controls from './controls';
import i18n from './i18n';
import support from './support';
import utils from './utils';

const captions = {
    // Setup captions
    setup() {
        // Requires UI support
        if (!this.supported.ui) {
            return;
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

        // Try to load the value from storage
        let active = this.storage.get('captions');

        // Otherwise fall back to the default config
        if (!utils.is.boolean(active)) {
            ({ active } = this.config.captions);
        }

        // Get language from storage, fallback to config
        let language = this.storage.get('language') || this.config.captions.language;
        if (language === 'auto') {
            [ language ] = (navigator.language || navigator.userLanguage).split('-');
        }
        // Set language and show if active
        captions.setLanguage.call(this, language, active);

        // Watch changes to textTracks and update captions menu
        if (this.isHTML5) {
            const trackEvents = this.config.captions.update ? 'addtrack removetrack' : 'removetrack';
            utils.on.call(this, this.media.textTracks, trackEvents, captions.update.bind(this));
        }

        // Update available languages in list next tick (the event must not be triggered before the listeners)
        setTimeout(captions.update.bind(this), 0);
    },

    update() {
        const tracks = captions.getTracks.call(this, true);
        // Get the wanted language
        const { language, meta } = this.captions;

        // Handle tracks (add event listener and "pseudo"-default)
        if (this.isHTML5 && this.isVideo) {
            tracks
                .filter(track => !meta.get(track))
                .forEach(track => {
                    this.debug.log('Track added', track);
                    // Attempt to store if the original dom element was "default"
                    meta.set(track, {
                        default: track.mode === 'showing',
                    });

                    // Turn off native caption rendering to avoid double captions
                    track.mode = 'hidden';

                    // Add event listener for cue changes
                    utils.on.call(this, track, 'cuechange', () => captions.updateCues.call(this));
                });
        }

        const trackRemoved = !tracks.find(track => track === this.captions.currentTrackNode);
        const firstMatch = this.language !== language && tracks.find(track => track.language === language);

        // Update language if removed or first matching track added
        if (trackRemoved || firstMatch) {
            captions.setLanguage.call(this, language, this.config.captions.active);
        }

        // Enable or disable captions based on track length
        utils.toggleClass(this.elements.container, this.config.classNames.captions.enabled, !utils.is.empty(tracks));

        // Update available languages in list
        if ((this.config.controls || []).includes('settings') && this.config.settings.includes('captions')) {
            controls.setCaptionsMenu.call(this);
        }
    },

    set(index, setLanguage = true, show = true) {
        const tracks = captions.getTracks.call(this);

        // Disable captions if setting to -1
        if (index === -1) {
            this.toggleCaptions(false);
            return;
        }

        if (!utils.is.number(index)) {
            this.debug.warn('Invalid caption argument', index);
            return;
        }

        if (!(index in tracks)) {
            this.debug.warn('Track not found', index);
            return;
        }

        if (this.captions.currentTrack !== index) {
            this.captions.currentTrack = index;
            const track = captions.getCurrentTrack.call(this);
            const { language } = track || {};

            // Store reference to node for invalidation on remove
            this.captions.currentTrackNode = track;

            // Prevent setting language in some cases, since it can violate user's intentions
            if (setLanguage) {
                this.captions.language = language;
            }

            // Handle Vimeo captions
            if (this.isVimeo) {
                this.embed.enableTextTrack(language);
            }

            // Trigger event
            utils.dispatchEvent.call(this, this.media, 'languagechange');
        }

        if (this.isHTML5 && this.isVideo) {
            // If we change the active track while a cue is already displayed we need to update it
            captions.updateCues.call(this);
        }

        // Show captions
        if (show) {
            this.toggleCaptions(true);
        }
    },

    setLanguage(language, show = true) {
        if (!utils.is.string(language)) {
            this.debug.warn('Invalid language argument', language);
            return;
        }
        // Normalize
        this.captions.language = language.toLowerCase();

        // Set currentTrack
        const tracks = captions.getTracks.call(this);
        const track = captions.getCurrentTrack.call(this, true);
        captions.set.call(this, tracks.indexOf(track), false, show);
    },

    // Get current valid caption tracks
    // If update is false it will also ignore tracks without metadata
    // This is used to "freeze" the language options when captions.update is false
    getTracks(update = false) {
        // Handle media or textTracks missing or null
        const tracks = Array.from((this.media || {}).textTracks || []);
        // For HTML5, use cache instead of current tracks when it exists (if captions.update is false)
        // Filter out removed tracks and tracks that aren't captions/subtitles (for example metadata)
        return tracks
            .filter(track => !this.isHTML5 || update || this.captions.meta.has(track))
            .filter(track => [
                'captions',
                'subtitles',
            ].includes(track.kind));
    },

    // Get the current track for the current language
    getCurrentTrack(fromLanguage = false) {
        const tracks = captions.getTracks.call(this);
        const sortIsDefault = track => Number((this.captions.meta.get(track) || {}).default);
        const sorted = Array.from(tracks).sort((a, b) => sortIsDefault(b) - sortIsDefault(a));
        return (!fromLanguage && tracks[this.currentTrack]) || sorted.find(track => track.language === this.captions.language) || sorted[0];
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

    // Update captions using current track's active cues
    // Also optional array argument in case there isn't any track (ex: vimeo)
    updateCues(input) {
        // Requires UI
        if (!this.supported.ui) {
            return;
        }

        if (!utils.is.element(this.elements.captions)) {
            this.debug.warn('No captions element to render to');
            return;
        }

        // Only accept array or empty input
        if (!utils.is.nullOrUndefined(input) && !Array.isArray(input)) {
            this.debug.warn('updateCues: Invalid input', input);
            return;
        }

        let cues = input;

        // Get cues from track
        if (!cues) {
            const track = captions.getCurrentTrack.call(this);
            cues = Array.from((track || {}).activeCues || [])
                .map(cue => cue.getCueAsHTML())
                .map(utils.getHTML);
        }

        // Set new caption text
        const content = cues.map(cueText => cueText.trim()).join('\n');
        const changed = content !== this.elements.captions.innerHTML;

        if (changed) {
            // Empty the container and create a new child element
            utils.emptyElement(this.elements.captions);
            const caption = utils.createElement('span', utils.getAttributesFromSelector(this.config.selectors.caption));
            caption.innerHTML = content;
            this.elements.captions.appendChild(caption);

            // Trigger event
            utils.dispatchEvent.call(this, this.media, 'cuechange');
        }
    },
};

export default captions;
