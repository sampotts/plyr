// ==========================================================================
// Plyr Media
// ==========================================================================

import support from './support';
import utils from './utils';
import youtube from './plugins/youtube';
import vimeo from './plugins/vimeo';
import ui from './ui';

// Sniff out the browser
const browser = utils.getBrowser();

const media = {
    // Setup media
    setup() {
        // If there's no media, bail
        if (!this.media) {
            this.warn('No media element found!');
            return;
        }

        // Add type class
        utils.toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', this.type), true);

        // Add video class for embeds
        // This will require changes if audio embeds are added
        if (this.isEmbed) {
            utils.toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', 'video'), true);
        }

        if (this.supported.ui) {
            // Check for picture-in-picture support
            utils.toggleClass(
                this.elements.container,
                this.config.classNames.pip.supported,
                support.pip && this.type === 'video'
            );

            // Check for airplay support
            utils.toggleClass(
                this.elements.container,
                this.config.classNames.airplay.supported,
                support.airplay && this.isHTML5
            );

            // If there's no autoplay attribute, assume the video is stopped and add state class
            utils.toggleClass(this.elements.container, this.config.classNames.stopped, this.config.autoplay);

            // Add iOS class
            utils.toggleClass(this.elements.container, this.config.classNames.isIos, browser.isIos);

            // Add touch class
            utils.toggleClass(this.elements.container, this.config.classNames.isTouch, support.touch);
        }

        // Inject the player wrapper
        if (['video', 'youtube', 'vimeo'].includes(this.type)) {
            // Create the wrapper div
            this.elements.wrapper = utils.createElement('div', {
                class: this.config.classNames.video,
            });

            // Wrap the video in a container
            utils.wrap(this.media, this.elements.wrapper);
        }

        // Embeds
        if (this.isEmbed) {
            switch (this.type) {
                case 'youtube':
                    youtube.setup.call(this);
                    break;

                case 'vimeo':
                    vimeo.setup.call(this);
                    break;

                default:
                    break;
            }
        }

        ui.setTitle.call(this);
    },

    // Cancel current network requests
    // See https://github.com/sampotts/plyr/issues/174
    cancelRequests() {
        if (!this.isHTML5) {
            return;
        }

        // Remove child sources
        Array.from(this.media.querySelectorAll('source')).forEach(utils.removeElement);

        // Set blank video src attribute
        // This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
        // Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection
        this.media.setAttribute('src', this.config.blankVideo);

        // Load the new empty source
        // This will cancel existing requests
        // See https://github.com/sampotts/plyr/issues/174
        this.media.load();

        // Debugging
        this.log('Cancelled network requests');
    },
};

export default media;
