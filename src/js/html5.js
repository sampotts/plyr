// ==========================================================================
// Plyr HTML5 helpers
// ==========================================================================

import support from './support';
import { removeElement } from './utils/elements';
import { triggerEvent } from './utils/events';

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
        const sizes = html5.getSources
            .call(this)
            .map(source => Number(source.getAttribute('size')))
            .filter(Boolean);
        return sizes.map((size, index) => ({
            label: `${size}`,
            height: size,
            index,
        }));
    },

    extend() {
        if (!this.isHTML5) {
            return;
        }

        const player = this;

        // Quality
        const qualityLevels = html5.getQualityOptions.call(player);
        Object.defineProperty(player.media, 'quality', {
            get() {
                // Get sources
                const sources = html5.getSources.call(player);
                const source = sources.find(source => source.getAttribute('src') === player.source);
                if (!source) {
                    return undefined;
                }
                const sourceIndex = sources.indexOf(source);

                // Return label, if match is found
                return qualityLevels[sourceIndex].label;
            },
            set(input) {
                // Get sources
                const sources = html5.getSources.call(player);

                // Get first match for requested size
                const source = sources.find(source => source.getAttribute('size') === input.label);

                // No matching source found
                if (!source) {
                    return;
                }

                // Get current state
                const { currentTime, paused, preload, readyState } = player.media;

                // Set new source
                player.media.src = source.getAttribute('src');

                // Prevent loading if preload="none" and the current source isn't loaded (#1044)
                if (preload !== 'none' || readyState) {
                    // Restore time
                    player.once('loadedmetadata', () => {
                        player.currentTime = currentTime;

                        // Resume playing
                        if (!paused) {
                            player.play();
                        }
                    });

                    // Load new source
                    player.media.load();
                }

                // Trigger change event
                triggerEvent.call(player, player.media, 'qualitychange', false, {
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
        removeElement(html5.getSources.call(this));

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
