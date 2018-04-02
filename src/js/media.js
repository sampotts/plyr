// ==========================================================================
// Plyr Media
// ==========================================================================

import support from './support';
import utils from './utils';
import youtube from './plugins/youtube';
import vimeo from './plugins/vimeo';
import html5 from './html5';
import ui from './ui';

// Sniff out the browser
const browser = utils.getBrowser();

const media = {
    // Setup media
    setup() {
        // If there's no media, bail
        if (!this.media) {
            this.debug.warn('No media element found!');
            return;
        }

        // Add type class
        utils.toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', this.type), true);

        // Add provider class
        utils.toggleClass(this.elements.container, this.config.classNames.provider.replace('{0}', this.provider), true);

        // Add video class for embeds
        // This will require changes if audio embeds are added
        if (this.isEmbed) {
            utils.toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', 'video'), true);
        }

        if (this.supported.ui) {
            // Check for picture-in-picture support
            utils.toggleClass(this.elements.container, this.config.classNames.pip.supported, support.pip && this.isHTML5 && this.isVideo);

            // Check for airplay support
            utils.toggleClass(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5);

            // If there's no autoplay attribute, assume the video is stopped and add state class
            utils.toggleClass(this.elements.container, this.config.classNames.stopped, this.config.autoplay);

            // Add iOS class
            utils.toggleClass(this.elements.container, this.config.classNames.isIos, browser.isIos);

            // Add touch class
            utils.toggleClass(this.elements.container, this.config.classNames.isTouch, this.touch);
        }

        // Inject the player wrapper
        if (this.isVideo) {
            // Create the wrapper div
            this.elements.wrapper = utils.createElement('div', {
                class: this.config.classNames.video,
            });

            // Wrap the video in a container
            utils.wrap(this.media, this.elements.wrapper);
        }

        if (this.isEmbed) {
            switch (this.provider) {
                case 'youtube':
                    youtube.setup.call(this);
                    break;

                case 'vimeo':
                    vimeo.setup.call(this);
                    break;

                default:
                    break;
            }
        } else if (this.isHTML5) {
            ui.setTitle.call(this);

            html5.extend.call(this);
        }
    },
};

export default media;
