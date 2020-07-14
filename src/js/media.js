// ==========================================================================
// Plyr Media
// ==========================================================================

import { createElement, toggleClass, wrap } from './utils/elements';

const media = {
  // Setup media
  setup() {
    // If there's no media, bail
    if (!this.media) {
      this.debug.warn('No media element found!');
      return;
    }

    // Add type class
    toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', this.type), true);

    // Add provider class
    toggleClass(this.elements.container, this.config.classNames.provider.replace('{0}', this.provider.name), true);

    // Add video class for embeds
    // This will require changes if audio embeds are added
    if (this.isEmbed) {
      toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', 'video'), true);
    }

    // Inject the player wrapper
    if (this.isVideo) {
      // Create the wrapper div
      this.elements.wrapper = createElement('div', {
        class: this.config.classNames.video,
      });

      // Wrap the video in a container
      wrap(this.media, this.elements.wrapper);

      // Poster image container
      this.elements.poster = createElement('div', {
        class: this.config.classNames.poster,
      });

      this.elements.wrapper.appendChild(this.elements.poster);
    }

    // Some providers might not have the same speed array
    // So we filter out the speeds set in config with the speed from the provider
    this.setOptions({ speed: this.provider.filterSpeed(this.config.speed.options) });

    if (this.provider === undefined) {
      this.debug.warn('No provider found!');
      return;
    }
    // Provider should be already set when we call this
    this.provider.setup(this);
  },
};

export default media;
