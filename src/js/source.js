// ==========================================================================
// Plyr source update
// ==========================================================================

import { providers } from './types';
import utils from './utils';
import html5 from './html5';
import media from './media';
import ui from './ui';
import support from './support';

const source = {
    // Add elements to HTML5 media (source, tracks, etc)
    insertElements(type, attributes) {
        if (utils.is.string(attributes)) {
            utils.insertElement(type, this.media, {
                src: attributes,
            });
        } else if (utils.is.array(attributes)) {
            attributes.forEach(attribute => {
                utils.insertElement(type, this.media, attribute);
            });
        }
    },

    // Update source
    // Sources are not checked for support so be careful
    change(input) {
        if (!utils.is.object(input) || !('sources' in input) || !input.sources.length) {
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
                utils.removeElement(this.media);
                this.media = null;

                // Reset class name
                if (utils.is.element(this.elements.container)) {
                    this.elements.container.removeAttribute('class');
                }

                // Set the type and provider
                this.type = input.type;
                this.provider = !utils.is.empty(input.sources[0].provider) ? input.sources[0].provider : providers.html5;

                // Check for support
                this.supported = support.check(this.type, this.provider, this.config.playsinline);

                // Create new markup
                switch (`${this.provider}:${this.type}`) {
                    case 'html5:video':
                        this.media = utils.createElement('video');
                        break;

                    case 'html5:audio':
                        this.media = utils.createElement('audio');
                        break;

                    case 'youtube:video':
                    case 'vimeo:video':
                        this.media = utils.createElement('div', {
                            src: input.sources[0].src,
                        });
                        break;

                    default:
                        break;
                }

                // Inject the new element
                this.elements.container.appendChild(this.media);

                // Autoplay the new source?
                if (utils.is.boolean(input.autoplay)) {
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
                    if ('poster' in input) {
                        this.media.setAttribute('poster', input.poster);
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
                    source.insertElements.call(this, 'source', input.sources);
                }

                // Set video title
                this.config.title = input.title;

                // Set up from scratch
                media.setup.call(this);

                // HTML5 stuff
                if (this.isHTML5) {
                    // Setup captions
                    if ('tracks' in input) {
                        source.insertElements.call(this, 'track', input.tracks);
                    }

                    // Load HTML5 sources
                    this.media.load();
                }

                // If HTML5 or embed but not fully supported, setupInterface and call ready now
                if (this.isHTML5 || (this.isEmbed && !this.supported.ui)) {
                    // Setup interface
                    ui.build.call(this);
                }

                // Update the fullscreen support
                this.fullscreen.update();
            },
            true,
        );
    },
};

export default source;
