// ==========================================================================
// Plyr source update
// ==========================================================================

import { providers, types } from './config/types';
import html5 from './html5';
import media from './media';
import support from './support';
import ui from './ui';
import { createElement, insertElement, removeElement, setAttributes } from './utils/elements';
import is from './utils/is';
import { getDeep } from './utils/objects';
import captions from './captions';

const source = {
    // Add elements to HTML5 media (source, tracks, etc)
    insertElements(type, attributes) {
        if (is.string(attributes)) {
            insertElement(type, this.media, {
                src: attributes,
            });
        } else if (is.array(attributes)) {
            attributes.forEach(attribute => {
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

        const tracks = Array.from(this.media.querySelectorAll('track'));
        removeElement(tracks);
        this.captions.currentTrack = -1;

        // Destroy instance and re-setup
        this.destroy.call(
            this,
            () => {
                // Reset quality options
                this.options.quality = [];

                // Remove elements
                removeElement(this.media);

                // Reset class name
                if (is.element(this.elements.container)) {
                    this.elements.container.removeAttribute('class');
                }

                // retain old provider and type
                const prevType = this.type;
                const prevProvider = this.provider;

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
                });

                if (prevType === type && prevProvider === provider && provider === providers.html5) {
                    /**
                     * if provider is html5 and setting is same as prev source,
                     * retain media element (because ios system has limited resource,
                     * can't create many video resource)
                     */
                    setAttributes(this.media, attributes);
                } else {
                    this.media = null;
                    this.media = createElement(tagName, attributes);
                }

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
                ui.addStylehookToFullscreenContainer.call(this);

                // Set new sources for html5
                if (this.isHTML5) {
                    source.insertElements.call(this, 'source', sources);
                    this.media.setAttribute('src', sources[0].src);
                }

                // Set video title
                this.config.title = input.title;

                // Set up from scratch
                media.setup.call(this);

                let defaultCaption = null
                // HTML5 stuff
                if (this.isHTML5) {
                    // Setup captions
                    if ('tracks' in input) {
                        source.insertElements.call(this, 'track', input.tracks);
                        const defaultTracks = input.tracks.filter(track => track.default);
                        if (defaultTracks.length > 0 ){
                            defaultCaption = defaultTracks[0].srclang;
                        }
                        captions.update.call(this);
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
                captions.setDefault.call(this, defaultCaption);
            },
            true,
        );
    },
};

export default source;
