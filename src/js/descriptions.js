// ==========================================================================
// Plyr Captions
// TODO: Create as class
// ==========================================================================

import tts from 'basic-tts';
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

const descriptions = {
  // Setup descriptions
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
        this.config.settings.includes('descriptions')
      ) {
        controls.setDescriptionsMenu.call(this);
      }

      return;
    }

    // Inject the container
    if (!is.element(this.elements.descriptions)) {
      this.elements.descriptions = createElement('div', getAttributesFromSelector(this.config.selectors.descriptions));
      insertAfter(this.elements.descriptions, this.elements.wrapper);
    }

    // Fix IE descriptions if CORS is used
    // Fetch descriptions and inject as blobs instead (data URIs not supported!)
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
    // * toggled:   The real descriptions state

    const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];
    const languages = dedupe(browserLanguages.map(language => language.split('-')[0]));
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
    if (this.isHTML5 && !browser.isIE) {
      const trackEvents = this.config.descriptions.update ? 'addtrack removetrack' : 'removetrack';
      on.call(this, this.media.textTracks, trackEvents, descriptions.update.bind(this));
    }

    // Setup speaker
    this.speaker = tts.createSpeaker({
      voice: 'Microsoft David Desktop - English (United States)',
      //voice: 'Google US English', //TODO: configure
      lang: 'en-US', //TODO: configure
      volume: 1,
      pitch: 1,
      rate: 1,
    });

    // Update available languages in list next tick (the event must not be triggered before the listeners)
    setTimeout(descriptions.update.bind(this), 0);
  },

  // Update available language options in settings based on tracks
  update() {
    const tracks = descriptions.getTracks.call(this, true);
    // Get the wanted language
    const { active, language, meta, currentTrackNode } = this.descriptions;
    const languageExists = Boolean(tracks.find(track => track.language === language));

    // Handle tracks (add event listener and "pseudo"-default)
    if (this.isHTML5 && this.isVideo && !browser.isIE) {
      tracks
        .filter(track => !meta.get(track))
        .forEach(track => {
          this.debug.log('Track added', track);

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
      on.call(this, this.media, 'playing descriptionsenabled descriptionsdisabled', () =>
        descriptions.updateCues.call(this),
      );
      on.call(this, this.media, 'seeked', () => descriptions.clearCues.call(this));
    }

    // Update language first time it matches, or if the previous matching track was removed
    if ((languageExists && this.language !== language) || !tracks.includes(currentTrackNode)) {
      descriptions.setLanguage.call(this, language);
      descriptions.toggle.call(this, active && languageExists);
    }

    // Enable or disable descriptions based on track length
    toggleClass(this.elements.container, this.config.classNames.descriptions.enabled, !is.empty(tracks));

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
  // Used internally for the currentDescTrack setter with the passive option forced to false
  set(index, passive = true) {
    const tracks = descriptions.getTracks.call(this);

    // Disable descriptions if setting to -1
    if (index === -1) {
      descriptions.toggle.call(this, false, passive);
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

    if (this.descriptions.currentDescTrack !== index) {
      this.descriptions.currentDescTrack = index;
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

    if (this.isHTML5 && this.isVideo && !browser.isIE) {
      // If we change the active track while a cue is already displayed we need to update it
      descriptions.updateCues.call(this);
    }
  },

  // Set descriptions by language
  // Used internally for the language setter with the passive option forced to false
  setLanguage(input, passive = true) {
    if (!is.string(input)) {
      this.debug.warn('Invalid language argument', input);
      return;
    }
    // Normalize
    const language = input.toLowerCase();
    this.descriptions.language = language;

    // Set currentDescTrack
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
    // Filter out removed tracks and tracks that aren't descriptions/subtitles (for example metadata)
    return tracks
      .filter(track => !this.isHTML5 || update || this.descriptions.meta.has(track))
      .filter(track => ['descriptions'].includes(track.kind));
  },

  // Match tracks based on languages and get the first
  findTrack(languages, force = false) {
    const tracks = descriptions.getTracks.call(this);
    const sortIsDefault = track => Number((this.descriptions.meta.get(track) || {}).default);
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
    return descriptions.getTracks.call(this)[this.currentDescTrack];
  },

  // Get UI label for track
  getLabel(track) {
    let currentDescTrack = track;

    if (!is.track(currentDescTrack) && support.textTracks && this.descriptions.toggled) {
      currentDescTrack = descriptions.getCurrentTrack.call(this);
    }

    if (is.track(currentDescTrack)) {
      if (!is.empty(currentDescTrack.label)) {
        return currentDescTrack.label;
      }

      if (!is.empty(currentDescTrack.language)) {
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
      this.debug.warn('No descriptions element to render to');
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
      const track = descriptions.getCurrentTrack.call(this);

      cues = Array.from((track || {}).activeCues || [])
        .map(cue => cue.getCueAsHTML())
        .map(getHTML);
    }

    // Set new description text
    const content = cues.map(cueText => cueText.trim()).join('\n');
    // const changed = content !== this.elements.descriptions.innerHTML;
    const changed = content !== this.elements.descriptions.textContent;

    if (!this.descriptions.active) {
      // this.speaker.cancel(); //TODO:
    }

    if (content && changed && this.playing && this.descriptions.active) {
      // Empty the container and create a new child element
      emptyElement(this.elements.descriptions);
      const description = createElement('span', getAttributesFromSelector(this.config.selectors.description));
      description.innerHTML = content;
      this.elements.descriptions.appendChild(description);

      //Utterance
      this.pause();

      this.speaker
        .speak(content)
        .then(() => {
          this.debug.log('SPOKEN: ', content);
          this.play();
        })
        .catch(err => {
          this.debug.log('An error has occurred: ', err);
        });

      // Trigger event
      triggerEvent.call(this, this.media, 'cuechange');
    }
  },

  clearCues(input) {
    // Reset descriptions
    emptyElement(this.elements.descriptions);
  },
};

export default descriptions;
