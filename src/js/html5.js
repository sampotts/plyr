// ==========================================================================
// Plyr HTML5 helpers
// ==========================================================================

import { types } from './config/types';
import PlyrProvider from './plugins/providers';
import support from './support';
import ui from './ui';
import { removeElement } from './utils/elements';
import { triggerEvent } from './utils/events';
import is from './utils/is';
import { silencePromise } from './utils/promise';
import { setAspectRatio } from './utils/style';

class HTML5Provider extends PlyrProvider {
  static get name() {
    return 'html5';
  }

  static type(player) {
    return player.media.tagName.toLowerCase() === 'video' ? types.video : types.audio;
  }

  static get availableSpeed() {
    return [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4];
  }

  static get supportCaptions() {
    return true;
  }

  static getSources(player) {
    if (!player.isHTML5) {
      return [];
    }

    const sources = Array.from(player.media.querySelectorAll('source'));

    // Filter out unsupported sources (if type is specified)
    return sources.filter(source => {
      const type = source.getAttribute('type');

      if (is.empty(type)) {
        return true;
      }

      return support.mime.call(player, type);
    });
  }

  // Get quality levels
  static getQualityOptions(player) {
    // Whether we're forcing all options (e.g. for streaming)
    if (player.config.quality.forced) {
      return player.config.quality.options;
    }

    // Get sizes from <source> elements
    return HTML5Provider.getSources(player)
      .map(source => Number(source.getAttribute('size')))
      .filter(Boolean);
  }

  static setup(player) {
    if (!player.isHTML5) {
      return;
    }

    // Set aspect ratio if fixed
    if (!is.empty(player.config.ratio)) {
      setAspectRatio.call(player);
    }

    // Quality
    Object.defineProperty(player.media, 'quality', {
      get() {
        // Get sources
        const sources = HTML5Provider.getSources(player);
        const source = sources.find(s => s.getAttribute('src') === player.source);

        // Return size, if match is found
        return source && Number(source.getAttribute('size'));
      },
      set(input) {
        if (player.quality === input) {
          return;
        }

        // If we're using an an external handler...
        if (player.config.quality.forced && is.function(player.config.quality.onChange)) {
          player.config.quality.onChange(input);
        } else {
          // Get sources
          const sources = HTML5Provider.getSources(player);
          // Get first match for requested size
          const source = sources.find(s => Number(s.getAttribute('size')) === input);

          // No matching source found
          if (!source) {
            return;
          }

          // Get current state
          const { currentTime, paused, preload, readyState, playbackRate } = player.media;

          // Set new source
          player.media.setAttribute('src', source.getAttribute('src'));

          // Prevent loading if preload="none" and the current source isn't loaded (#1044)
          if (preload !== 'none' || readyState) {
            // Restore time
            player.once('loadedmetadata', () => {
              // eslint-disable-next-line no-param-reassign
              player.speed = playbackRate;
              // eslint-disable-next-line no-param-reassign
              player.currentTime = currentTime;

              // Resume playing
              if (!paused) {
                silencePromise(player.play());
              }
            });

            // Load new source
            player.media.load();
          }
        }

        // Trigger change event
        triggerEvent.call(player, player.media, 'qualitychange', false, {
          quality: input,
        });
      },
    });
  }

  // Cancel current network requests
  // See https://github.com/sampotts/plyr/issues/174
  static cancelRequests(player) {
    if (!player.isHTML5) {
      return;
    }

    // Remove child sources
    removeElement(HTML5Provider.getSources(player));

    // Set blank video src attribute
    // This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
    // Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection
    player.media.setAttribute('src', player.config.blankVideo);

    // Load the new empty source
    // This will cancel existing requests
    // See https://github.com/sampotts/plyr/issues/174
    player.media.load();

    // Debugging
    player.debug.log('Cancelled network requests');
  }

  static async destroy(player) {
    // Restore native video controls
    ui.toggleNativeControls.call(player, true);
  }
}

export default HTML5Provider;
