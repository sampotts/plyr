// ==========================================================================
// Plyr Captions
// TODO: Create as class
// ==========================================================================

import controls from './controls';
import support from './support';
import { dedupe } from './utils/arrays';
import browser from './utils/browser';
import {
    createElement,
    emptyElement,
    getAttributesFromSelector,
    insertAfter,
    removeElement,
    toggleClass,
} from './utils/elements';
import { on, triggerEvent } from './utils/events';
import fetch from './utils/fetch';
import i18n from './utils/i18n';
import is from './utils/is';
import { getHTML } from './utils/strings';
import { parseUrl } from './utils/urls';

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
            if (
                is.array(this.config.controls) &&
                this.config.controls.includes('settings') &&
                this.config.settings.includes('captions')
            ) {
                controls.setCaptionsMenu.call(this);
            }

            return;
        }

        // Inject the container
        if (!is.element(this.elements.captions)) {
            this.elements.captions = createElement('div', getAttributesFromSelector(this.config.selectors.captions));

            insertAfter(this.elements.captions, this.elements.wrapper);
        }

        // Fix IE captions if CORS is used
        // Fetch captions and inject as blobs instead (data URIs not supported!)
        if (browser.isIE && window.URL) {
            const elements = this.media.querySelectorAll('track');

            Array.from(elements).forEach(track => {
                const src = track.getAttribute('src');
                const url = parseUrl(src);

                if (
                    url !== null &&
                    url.hostname !== window.location.href.hostname &&
                    ['http:', 'https:'].includes(url.protocol)
                ) {
                    fetch(src, 'blob')
                        .then(blob => {
                            track.setAttribute('src', window.URL.createObjectURL(blob));
                        })
                        .catch(() => {
                            removeElement(track);
                        });
                }
            });
        }

        // Get and set initial data
        // The "preferred" options are not realized unless / until the wanted language has a match
        // * languages: Array of user's browser languages.
        // * language:  The language preferred by user settings or config
        // * active:    The state preferred by user settings or config
        // * toggled:   The real captions state

        const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];
        const languages = dedupe(browserLanguages.map(language => language.split('-')[0]));
        let language = (this.storage.get('language') || this.config.captions.language || 'auto').toLowerCase();

        // Use first browser language when language is 'auto'
        if (language === 'auto') {
            [language] = languages;
        }

        let active = this.storage.get('captions');
        if (!is.boolean(active)) {
            ({ active } = this.config.captions);
        }

        Object.assign(this.captions, {
            toggled: false,
            active,
            language,
            languages,
        });

        // Watch changes to textTracks and update captions menu
        if (this.isHTML5) {
            const trackEvents = this.config.captions.update ? 'addtrack removetrack' : 'removetrack';
            on.call(this, this.media.textTracks, trackEvents, captions.update.bind(this));
        }

        // Update available languages in list next tick (the event must not be triggered before the listeners)
        setTimeout(captions.update.bind(this), 0);
    },

    // Update available language options in settings based on tracks
    update() {
        const tracks = captions.getTracks.call(this, true);
        // Get the wanted language
        const { active, language, meta, currentTrackNode } = this.captions;
        const languageExists = Boolean(tracks.find(track => track.language === language));

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
                    // eslint-disable-next-line no-param-reassign
                    track.mode = 'hidden';

                    // Add event listener for cue changes
                    on.call(this, track, 'cuechange', () => captions.updateCues.call(this));
                });
        }

        // Update language first time it matches, or if the previous matching track was removed
        if ((languageExists && this.language !== language) || !tracks.includes(currentTrackNode)) {
            captions.setLanguage.call(this, language);
            captions.toggle.call(this, active && languageExists);
        }

        // Enable or disable captions based on track length
        toggleClass(this.elements.container, this.config.classNames.captions.enabled, !is.empty(tracks));

        // Update available languages in list
        if ((this.config.controls || []).includes('settings') && this.config.settings.includes('captions')) {
            controls.setCaptionsMenu.call(this);
        }
    },

    // Toggle captions display
    // Used internally for the toggleCaptions method, with the passive option forced to false
    toggle(input, passive = true) {
        // If there's no full support
        if (!this.supported.ui) {
            return;
        }

        const { toggled } = this.captions; // Current state
        const activeClass = this.config.classNames.captions.active;
        // Get the next state
        // If the method is called without parameter, toggle based on current value
        const active = is.nullOrUndefined(input) ? !toggled : input;

        // Update state and trigger event
        if (active !== toggled) {
            // When passive, don't override user preferences
            if (!passive) {
                this.captions.active = active;
                this.storage.set({ captions: active });
            }

            // Force language if the call isn't passive and there is no matching language to toggle to
            if (!this.language && active && !passive) {
                const tracks = captions.getTracks.call(this);
                const track = captions.findTrack.call(this, [this.captions.language, ...this.captions.languages], true);

                // Override user preferences to avoid switching languages if a matching track is added
                this.captions.language = track.language;

                // Set caption, but don't store in localStorage as user preference
                captions.set.call(this, tracks.indexOf(track));
                return;
            }

            // Toggle button if it's enabled
            if (this.elements.buttons.captions) {
                this.elements.buttons.captions.pressed = active;
            }

            // Add class hook
            toggleClass(this.elements.container, activeClass, active);

            this.captions.toggled = active;

            // Update settings menu
            controls.updateSetting.call(this, 'captions');

            // Trigger event (not used internally)
            triggerEvent.call(this, this.media, active ? 'captionsenabled' : 'captionsdisabled');
        }
    },

    // Set captions by track index
    // Used internally for the currentTrack setter with the passive option forced to false
    set(index, passive = true) {
        const tracks = captions.getTracks.call(this);

        // Disable captions if setting to -1
        if (index === -1) {
            captions.toggle.call(this, false, passive);
            return;
        }

        if (!is.number(index)) {
            this.debug.warn('Invalid caption argument', index);
            return;
        }

        if (!(index in tracks)) {
            this.debug.warn('Track not found', index);
            return;
        }

        if (this.captions.currentTrack !== index) {
            this.captions.currentTrack = index;
            const track = tracks[index];
            const { language } = track || {};

            // Store reference to node for invalidation on remove
            this.captions.currentTrackNode = track;

            // Update settings menu
            controls.updateSetting.call(this, 'captions');

            // When passive, don't override user preferences
            if (!passive) {
                this.captions.language = language;
                this.storage.set({ language });
            }

            // Handle Vimeo captions
            if (this.isVimeo) {
                this.embed.enableTextTrack(language);
            }

            // Trigger event
            triggerEvent.call(this, this.media, 'languagechange');
        }

        // Show captions
        captions.toggle.call(this, true, passive);

        if (this.isHTML5 && this.isVideo) {
            // If we change the active track while a cue is already displayed we need to update it
            captions.updateCues.call(this);
        }
    },

    // Set captions by language
    // Used internally for the language setter with the passive option forced to false
    setLanguage(input, passive = true) {
        if (!is.string(input)) {
            this.debug.warn('Invalid language argument', input);
            return;
        }
        // Normalize
        const language = input.toLowerCase();
        this.captions.language = language;

        // Set currentTrack
        const tracks = captions.getTracks.call(this);
        const track = captions.findTrack.call(this, [language]);
        captions.set.call(this, tracks.indexOf(track), passive);
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
            .filter(track => ['captions', 'subtitles'].includes(track.kind));
    },

    // Match tracks based on languages and get the first
    findTrack(languages, force = false) {
        const tracks = captions.getTracks.call(this);
        const sortIsDefault = track => Number((this.captions.meta.get(track) || {}).default);
        const sorted = Array.from(tracks).sort((a, b) => sortIsDefault(b) - sortIsDefault(a));
        let track;

        languages.every(language => {
            track = sorted.find(t => t.language === language);
            return !track; // Break iteration if there is a match
        });

        // If no match is found but is required, get first
        return track || (force ? sorted[0] : undefined);
    },

    // Get the current track
    getCurrentTrack() {
        return captions.getTracks.call(this)[this.currentTrack];
    },

    // Get UI label for track
    getLabel(track) {
        let currentTrack = track;

        if (!is.track(currentTrack) && support.textTracks && this.captions.toggled) {
            currentTrack = captions.getCurrentTrack.call(this);
        }

        if (is.track(currentTrack)) {
            if (!is.empty(currentTrack.label)) {
                return currentTrack.label;
            }

            if (!is.empty(currentTrack.language)) {
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

        if (!is.element(this.elements.captions)) {
            this.debug.warn('No captions element to render to');
            return;
        }

        // Only accept array or empty input
        if (!is.nullOrUndefined(input) && !Array.isArray(input)) {
            this.debug.warn('updateCues: Invalid input', input);
            return;
        }

        let cues = input;

        // Get cues from track
        if (!cues) {
            const track = captions.getCurrentTrack.call(this);

            cues = Array.from((track || {}).activeCues || [])
                .map(cue => cue.getCueAsHTML())
                .map(getHTML);
        }

        // Set new caption text
        const content = cues.map(cueText => cueText.trim()).join('\n');
        const changed = content !== this.elements.captions.innerHTML;

        if (changed) {
            // Empty the container and create a new child element
            emptyElement(this.elements.captions);
            const caption = createElement('span', getAttributesFromSelector(this.config.selectors.caption));
            caption.innerHTML = content;
            this.elements.captions.appendChild(caption);

            // Trigger event
            triggerEvent.call(this, this.media, 'cuechange');
        }
    },
};

export default captions;
