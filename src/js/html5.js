// ==========================================================================
// Plyr HTML5 helpers
// ==========================================================================

import support from './support';
import utils from './utils';

const html5 = {
    getSources() {
        if (!this.isHTML5) {
            return [];
        }

        const sources = Array.from(this.media.querySelectorAll('source'));

        // Filter out unsupported sources
        return sources.filter(source => support.mime.call(this, source.getAttribute('type')));
    },

    // Get quality levels
    getQualityOptions() {
        // Get sizes from <source> elements
        const sizes = html5.getSources.call(this)
            .map(source => Number(source.getAttribute('size')))
            .filter(Boolean);

        // Reduce to unique list
        return utils.dedupe(sizes);
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
                const [source] = sources.filter(source => source.getAttribute('src') === player.source);

                // Return size, if match is found
                return source && Number(source.getAttribute('size'));
            },
            set(input) {
                // Get sources
                const sources = html5.getSources.call(player);

                // Get first match for requested size
                const source = sources.find(source => Number(source.getAttribute('size')) === input);

                // No matching source found
                if (!source) {
                    return;
                }

                // Trigger change event
                utils.dispatchEvent.call(player, player.media, 'qualityrequested', false, {
                    quality: input,
                });

                // Get current state
                const { currentTime, playing } = player;

                // Set new source
                player.media.src = source.getAttribute('src');

                // Restore time
                const onLoadedMetaData = () => {
                    player.currentTime = currentTime;
                    player.off('loadedmetadata', onLoadedMetaData);
                };
                player.on('loadedmetadata', onLoadedMetaData);

                // Load new source
                player.media.load();

                // Resume playing
                if (playing) {
                    player.play();
                }

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
