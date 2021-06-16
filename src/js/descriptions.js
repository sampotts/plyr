// ==========================================================================
// Plyr Descriptions
// TODO: Create as class
// ==========================================================================

import tts from 'basic-tts';

import controls from './controls';
import support from './support';
import { dedupe } from './utils/arrays';
import browser from './utils/browser';
import { createElement, emptyElement, getAttributesFromSelector, insertAfter, toggleClass } from './utils/elements';
import { on, triggerEvent } from './utils/events';
import i18n from './utils/i18n';
import is from './utils/is';
import { getHTML } from './utils/strings';

const descriptions = {
  // Setup descriptions
  setup() {
    // Requires UI support
    if (!this.supported.ui) {
      return;
    }

    // Only Vimeo and HTML5 video supported at this point
    if (!this.isVideo || this.isYouTube || (this.isHTML5 && !support.textTracks) || browser.isIE) {
      // Clear menu and hide
      if (
        is.array(this.config.controls) &&
        this.config.controls.includes('settings') &&
        this.config.settings.includes('descriptions')
      ) {
        controls.setDescriptionsMenu.call(this);
      }

      return;
    }

    if (!tts.isSupported()) {
      this.debug.log('[descriptions] speech synthesis not supported');
      return;
    }

    // Inject the container
    if (!is.element(this.elements.descriptions)) {
      this.elements.descriptions = createElement('div', getAttributesFromSelector(this.config.selectors.descriptions));

      insertAfter(this.elements.descriptions, this.elements.wrapper);
    }

    // Get and set initial data
    // The "preferred" options are not realized unless / until the wanted language has a match
    // * languages: Array of user's browser languages.
    // * language:  The language preferred by user settings or config
    // * active:    The state preferred by user settings or config
    // * toggled:   The real descriptions state

    const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];
    const languages = dedupe(browserLanguages.map((language) => language.split('-')[0]));
    let language = (this.storage.get('language') || this.config.descriptions.language || 'auto').toLowerCase();

    // Use first browser language when language is 'auto'
    if (language === 'auto') {
      [language] = languages;
    }

    let active = this.storage.get('descriptions');
    if (!is.boolean(active)) {
      ({ active } = this.config.descriptions);
    }

    Object.assign(this.descriptions, {
      toggled: false,
      active,
      language,
      languages,
    });

    // Watch changes to textTracks and update descriptions menu
    if (this.isHTML5) {
      const trackEvents = this.config.descriptions.update ? 'addtrack removetrack' : 'removetrack';
      on.call(this, this.media.textTracks, trackEvents, descriptions.update.bind(this));
    }
    descriptions.setupTextToSpeech(language);

    // Update available languages in list next tick (the event must not be triggered before the listeners)
    setTimeout(descriptions.update.bind(this), 0);
  },

  setupTextToSpeech(language) {
    // wait on voices to be loaded before fetching list
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();

      const speakerVoice = voices.find((voice) => {
        return voice.lang.includes(language);
      });

      // Setup Text to Speech
      descriptions.speaker = tts.createSpeaker({
        voice: speakerVoice.name,
        lang: speakerVoice.lang,
        volume: 1,
        pitch: 1,
        rate: 1,
      });
    };
  },

  // Update available language options in settings based on tracks
  update() {
    const tracks = descriptions.getTracks.call(this, true);
    // Get the wanted language
    const { active, language, meta, currentTrackNode } = this.descriptions;
    const languageExists = Boolean(tracks.find((track) => track.language === language));

    // Handle tracks (add event listener and "pseudo"-default)
    if (this.isHTML5 && this.isVideo) {
      tracks
        .filter((track) => !meta.get(track))
        .forEach((track) => {
          this.debug.log('[descriptions] Track added', track);

          // Attempt to store if the original dom element was "default"
          meta.set(track, {
            default: track.mode === 'showing',
          });

          // Turn off native caption rendering to avoid double descriptions
          // Note: mode='hidden' forces a track to download. To ensure every track
          // isn't downloaded at once, only 'showing' tracks should be reassigned
          // eslint-disable-next-line no-param-reassign
          if (track.mode === 'showing') {
            // eslint-disable-next-line no-param-reassign
            track.mode = 'hidden';
          }

          // Add event listener for cue changes
          on.call(this, track, 'cuechange', () => descriptions.updateCues.call(this));
        });
    }

    // Update language first time it matches, or if the previous matching track was removed
    if ((languageExists && this.language !== language) || !tracks.includes(currentTrackNode)) {
      descriptions.setLanguage.call(this, language);
      descriptions.toggle.call(this, active && languageExists);
    }

    // Enable or disable descriptions based on track length
    toggleClass(this.elements.container, this.config.classNames.descriptions.enabled, !is.empty(tracks));
    toggleClass(this.elements.container, this.config.classNames.debug.enabled, this.config.debug);

    // Update available languages in list
    if (
      is.array(this.config.controls) &&
      this.config.controls.includes('settings') &&
      this.config.settings.includes('descriptions')
    ) {
      controls.setDescriptionsMenu.call(this);
    }
  },

  // Toggle descriptions display
  // Used internally for the toggleDescriptions method, with the passive option forced to false
  toggle(input, passive = true) {
    // If there's no full support
    if (!this.supported.ui) {
      return;
    }

    const { toggled } = this.descriptions; // Current state
    const activeClass = this.config.classNames.descriptions.active;
    // Get the next state
    // If the method is called without parameter, toggle based on current value
    const active = is.nullOrUndefined(input) ? !toggled : input;

    // Update state and trigger event
    if (active !== toggled) {
      // When passive, don't override user preferences
      if (!passive) {
        this.descriptions.active = active;
        this.storage.set({ descriptions: active });
      }

      // Force language if the call isn't passive and there is no matching language to toggle to
      if (!this.language && active && !passive) {
        const tracks = descriptions.getTracks.call(this);
        const track = descriptions.findTrack.call(
          this,
          [this.descriptions.language, ...this.descriptions.languages],
          true,
        );

        // Override user preferences to avoid switching languages if a matching track is added
        this.descriptions.language = track.language;

        // Set caption, but don't store in localStorage as user preference
        descriptions.set.call(this, tracks.indexOf(track));
        return;
      }

      // Toggle button if it's enabled
      if (this.elements.buttons.descriptions) {
        this.elements.buttons.descriptions.pressed = active;
      }

      // Add class hook
      toggleClass(this.elements.container, activeClass, active);

      this.descriptions.toggled = active;

      // Update settings menu
      controls.updateSetting.call(this, 'descriptions');

      if (!this.descriptions.active) {
        window.speechSynthesis.cancel();
        return;
      }

      // Trigger event (not used internally)
      triggerEvent.call(this, this.media, active ? 'descriptionsenabled' : 'descriptionsdisabled');
    }

    // Wait for the call stack to clear before setting mode='hidden'
    // on the active track - forcing the browser to download it
    setTimeout(() => {
      if (active && this.descriptions.toggled) {
        this.descriptions.currentTrackNode.mode = 'hidden';
      }
    });
  },

  // Set descriptions by track index
  // Used internally for the currentTrack setter with the passive option forced to false
  set(index, passive = true) {
    const tracks = descriptions.getTracks.call(this);

    // Disable descriptions if setting to -1
    if (index === -1) {
      descriptions.toggle.call(this, false, passive);
      return;
    }

    if (!is.number(index)) {
      this.debug.warn('[descriptions] Invalid description argument', index);
      return;
    }

    if (!(index in tracks)) {
      this.debug.warn('[descriptions] Track not found', index);
      return;
    }

    if (this.descriptions.currentTrack !== index) {
      this.descriptions.currentTrack = index;
      const track = tracks[index];
      const { language } = track || {};

      // Store reference to node for invalidation on remove
      this.descriptions.currentTrackNode = track;

      // Update settings menu
      controls.updateSetting.call(this, 'descriptions');

      // When passive, don't override user preferences
      if (!passive) {
        this.descriptions.language = language;
        this.storage.set({ language });
      }

      // Handle Vimeo descriptions
      if (this.isVimeo) {
        this.embed.enableTextTrack(language);
      }

      // Trigger event
      triggerEvent.call(this, this.media, 'languagechange');
    }

    // Show descriptions
    descriptions.toggle.call(this, true, passive);

    if (this.isHTML5 && this.isVideo) {
      // If we change the active track while a cue is already displayed we need to update it
      descriptions.updateCues.call(this);
    }
  },

  // Set descriptions by language
  // Used internally for the language setter with the passive option forced to false
  setLanguage(input, passive = true) {
    if (!is.string(input)) {
      this.debug.warn('[descriptions] Invalid language argument', input);
      return;
    }
    // Normalize
    const language = input.toLowerCase();
    this.descriptions.language = language;

    // Set currentTrack
    const tracks = descriptions.getTracks.call(this);
    const track = descriptions.findTrack.call(this, [language]);
    descriptions.set.call(this, tracks.indexOf(track), passive);
  },

  // Get current valid caption tracks
  // If update is false it will also ignore tracks without metadata
  // This is used to "freeze" the language options when descriptions.update is false
  getTracks(update = false) {
    // Handle media or textTracks missing or null
    const tracks = Array.from((this.media || {}).textTracks || []);
    // For HTML5, use cache instead of current tracks when it exists (if descriptions.update is false)
    // Filter out removed tracks and tracks that aren't descriptions (for example metadata)
    return tracks
      .filter((track) => !this.isHTML5 || update || this.descriptions.meta.has(track))
      .filter((track) => ['descriptions'].includes(track.kind));
  },

  // Match tracks based on languages and get the first
  findTrack(languages, force = false) {
    const tracks = descriptions.getTracks.call(this);
    const sortIsDefault = (track) => Number((this.descriptions.meta.get(track) || {}).default);
    const sorted = Array.from(tracks).sort((a, b) => sortIsDefault(b) - sortIsDefault(a));
    let track;

    languages.every((language) => {
      track = sorted.find((t) => t.language === language);
      return !track; // Break iteration if there is a match
    });

    // If no match is found but is required, get first
    return track || (force ? sorted[0] : undefined);
  },

  // Get the current track
  getCurrentTrack() {
    return descriptions.getTracks.call(this)[this.currentTrackDescriptions];
  },

  // Get UI label for track
  getLabel(track) {
    let currentTrack = track;

    if (!is.track(currentTrack) && support.textTracks && this.descriptions.toggled) {
      currentTrack = descriptions.getCurrentTrack.call(this);
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

  // Update descriptions using current track's active cues
  // Also optional array argument in case there isn't any track (ex: vimeo)
  updateCues(input) {
    // Requires UI
    if (!this.supported.ui) {
      return;
    }

    if (!is.element(this.elements.descriptions)) {
      this.debug.warn('[descriptions] No descriptions element to render to');
      return;
    }

    // Only accept array or empty input
    if (!is.nullOrUndefined(input) && !Array.isArray(input)) {
      this.debug.warn('[descriptions] updateCues: Invalid input', input);
      return;
    }

    if (!this.descriptions.active) {
      window.speechSynthesis.cancel();
      return;
    }

    let cues = input;

    // Get cues from track
    if (!cues) {
      const track = descriptions.getCurrentTrack.call(this);

      cues = Array.from((track || {}).activeCues || [])
        .map((cue) => cue.getCueAsHTML())
        .map(getHTML);
    }

    // Set new description text
    const content = cues.map((cueText) => cueText.trim()).join('\n');
    const changed = content !== this.elements.descriptions.innerHTML;

    if (content && changed && this.playing && this.descriptions.active) {
      // Empty the container and create a new child element
      emptyElement(this.elements.descriptions);
      const description = createElement('span', getAttributesFromSelector(this.config.selectors.description));
      description.innerHTML = content;
      this.elements.descriptions.appendChild(description);

      this.pause();

      // Utterance
      descriptions.speaker
        .speak(content)
        .then(() => {
          this.play();
          this.debug.log('[descriptions] Success !');
        })
        .catch((e) => {
          this.play();
          this.debug.error('[descriptions] An error occurred :', e);
        });

      // Trigger event
      triggerEvent.call(this, this.media, 'cuechange');
    }
  },
};

export default descriptions;
