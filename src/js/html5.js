// ==========================================================================
// Plyr HTML5 helpers
// ==========================================================================

import support from './support';
import utils from './utils';

const html5 = {
    getSources() {
        if (!this.isHTML5) {
            return null;
        }

        return this.media.querySelectorAll('source');
    },

    // Get quality levels
    getQualityOptions() {
        if (!this.isHTML5) {
            return null;
        }

        // Get sources
        const sources = html5.getSources.call(this);

        if (utils.is.empty(sources)) {
            return null;
        }

        // Get <source> with size attribute
        const sizes = Array.from(sources).filter(source => !utils.is.empty(source.getAttribute('size')));

        // If none, bail
        if (utils.is.empty(sizes)) {
            return null;
        }

        // Reduce to unique list
        return utils.dedupe(sizes.map(source => Number(source.getAttribute('size'))));
    },

    extend() {
        if (!this.isHTML5) {
            return;
        }

        const player = this;

        // Quality
        Object.defineProperty(player.media, 'quality', {
            get() {
                // Get sources
                const sources = html5.getSources.call(player);

                if (utils.is.empty(sources)) {
                    return null;
                }

                const matches = Array.from(sources).filter(source => source.getAttribute('src') === player.source);

                if (utils.is.empty(matches)) {
                    return null;
                }

                return Number(matches[0].getAttribute('size'));
            },
            set(input) {
                // Get sources
                const sources = html5.getSources.call(player);

                if (utils.is.empty(sources)) {
                    return;
                }

                // Get matches for requested size
                const matches = Array.from(sources).filter(source => Number(source.getAttribute('size')) === input);

                // No matches for requested size
                if (utils.is.empty(matches)) {
                    return;
                }

                // Get supported sources
                const supported = matches.filter(source => support.mime.call(player, source.getAttribute('type')));

                // No supported sources
                if (utils.is.empty(supported)) {
                    return;
                }

                // Trigger change event
                utils.dispatchEvent.call(player, player.media, 'qualityrequested', false, {
                    quality: input,
                });

                // Get current state
                const { currentTime, playing } = player;

                // Set new source
                player.media.src = supported[0].getAttribute('src');

                // Load new source
                player.media.load();

                // Resume playing
                if (playing) {
                    player.play();
                }

                // Restore time
                player.currentTime = currentTime;

                // Trigger change event
                utils.dispatchEvent.call(player, player.media, 'qualitychange', false, {
                    quality: input,
                });
            },
        });
    },

    // Cancel current network requests
    // See https://github.com/sampotts/plyr/issues/174
    cancelRequests() {
        if (!this.isHTML5) {
            return;
        }

        // Remove child sources
        utils.removeElement(html5.getSources());

        // Set blank video src attribute
        // This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
        // Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection
        this.media.setAttribute('src', this.config.blankVideo);

        // Load the new empty source
        // This will cancel existing requests
        // See https://github.com/sampotts/plyr/issues/174
        this.media.load();

        // Debugging
        this.debug.log('Cancelled network requests');
    },
};

export default html5;
