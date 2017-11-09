// ==========================================================================
// Plyr source update
// ==========================================================================

import types from './types';
import utils from './utils';
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
            this.console.warn('Invalid source format');
            return;
        }

        // Cancel current network requests
        media.cancelRequests.call(this);

        // Destroy instance and re-setup
        this.destroy.call(
            this,
            () => {
                // TODO: Reset menus here

                // Remove elements
                utils.removeElement(this.media);
                this.media = null;

                // Reset class name
                if (utils.is.htmlElement(this.elements.container)) {
                    this.elements.container.removeAttribute('class');
                }

                // Set the type
                if ('type' in input) {
                    this.type = input.type;

                    // Get child type for video (it might be an embed)
                    if (this.type === 'video') {
                        const firstSource = input.sources[0];

                        if ('type' in firstSource && types.embed.includes(firstSource.type)) {
                            this.type = firstSource.type;
                        }
                    }
                }

                // Check for support
                this.supported = support.check(this.type, this.config.inline);

                // Create new markup
                switch (this.type) {
                    case 'video':
                        this.media = utils.createElement('video');
                        break;

                    case 'audio':
                        this.media = utils.createElement('audio');
                        break;

                    case 'youtube':
                    case 'vimeo':
                        this.media = utils.createElement('div');
                        this.embedId = input.sources[0].src;
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
                    if (this.config.inline) {
                        this.media.setAttribute('playsinline', '');
                    }
                }

                // Restore class hooks
                utils.toggleClass(
                    this.elements.container,
                    this.config.classNames.captions.active,
                    this.supported.ui && this.captions.enabled
                );

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
            },
            true
        );
    },
};

export default source;
