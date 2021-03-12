// ==========================================================================
// Plyr source update
// ==========================================================================

import { providers } from './config/types';
import html5 from './html5';
import media from './media';
import PreviewThumbnails from './plugins/preview-thumbnails';
import support from './support';
import ui from './ui';
import { createElement, insertElement, removeElement } from './utils/elements';
import is from './utils/is';
import { getDeep } from './utils/objects';

const source = {
  // Add elements to HTML5 media (source, tracks, etc)
  insertElements(type, attributes) {
    if (is.string(attributes)) {
      insertElement(type, this.media, {
        src: attributes,
      });
    } else if (is.array(attributes)) {
      attributes.forEach((attribute) => {
        insertElement(type, this.media, attribute);
      });
    }
  },

  // Update source
  // Sources are not checked for support so be careful
  change(input) {
    if (!getDeep(input, 'sources.length')) {
      this.debug.warn('Invalid source format');
      return;
    }

    // Cancel current network requests
    html5.cancelRequests.call(this);

    // Destroy instance and re-setup
    this.destroy.call(
      this,
      () => {
        // Reset quality options
        this.options.quality = [];

        // Remove elements
        removeElement(this.media);
        this.media = null;

        // Reset class name
        if (is.element(this.elements.container)) {
          this.elements.container.removeAttribute('class');
        }

        // Set the type and provider
        const { sources, type } = input;
        const [{ provider = providers.html5, src }] = sources;
        const tagName = provider === 'html5' ? type : 'div';
        const attributes = provider === 'html5' ? {} : { src };

        Object.assign(this, {
          provider,
          type,
          // Check for support
          supported: support.check(type, provider, this.config.playsinline),
          // Create new element
          media: createElement(tagName, attributes),
        });

        // Inject the new element
        this.elements.container.appendChild(this.media);

        // Autoplay the new source?
        if (is.boolean(input.autoplay)) {
          this.config.autoplay = input.autoplay;
        }

        // Set attributes for audio and video
        if (this.isHTML5) {
          if (this.config.crossorigin) {
            this.media.setAttribute('crossorigin', '');
          }
          if (this.config.autoplay) {
            this.media.setAttribute('autoplay', '');
          }
          if (!is.empty(input.poster)) {
            this.poster = input.poster;
          }
          if (this.config.loop.active) {
            this.media.setAttribute('loop', '');
          }
          if (this.config.muted) {
            this.media.setAttribute('muted', '');
          }
          if (this.config.playsinline) {
            this.media.setAttribute('playsinline', '');
          }
        }

        // Restore class hook
        ui.addStyleHook.call(this);

        // Set new sources for html5
        if (this.isHTML5) {
          source.insertElements.call(this, 'source', sources);
        }

        // Set video title
        this.config.title = input.title;

        // Set up from scratch
        media.setup.call(this);

        // HTML5 stuff
        if (this.isHTML5) {
          // Setup captions
          if (Object.keys(input).includes('tracks')) {
            source.insertElements.call(this, 'track', input.tracks);
          }
        }

        // If HTML5 or embed but not fully supported, setupInterface and call ready now
        if (this.isHTML5 || (this.isEmbed && !this.supported.ui)) {
          // Setup interface
          ui.build.call(this);
        }

        // Load HTML5 sources
        if (this.isHTML5) {
          this.media.load();
        }

        // Update previewThumbnails config & reload plugin
        if (!is.empty(input.previewThumbnails)) {
          Object.assign(this.config.previewThumbnails, input.previewThumbnails);

          // Cleanup previewThumbnails plugin if it was loaded
          if (this.previewThumbnails && this.previewThumbnails.loaded) {
            this.previewThumbnails.destroy();
            this.previewThumbnails = null;
          }

          // Create new instance if it is still enabled
          if (this.config.previewThumbnails.enabled) {
            this.previewThumbnails = new PreviewThumbnails(this);
          }
        }

        // Update the fullscreen support
        this.fullscreen.update();
      },
      true,
    );
  },
};

export default source;
