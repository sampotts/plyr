// ==========================================================================
// HLSjs https://github.com/video-dev/hls.js
// ==========================================================================

import { providers } from './config/types';
import { triggerEvent } from './utils/events';
import is from './utils/is';
import loadScript from './utils/load-script';

const hlsjs = {
  setup() {
    if (!is.function(window.Hls)) {
      loadScript(this.config.urls.hlsjs.sdk)
        .then(() => {
          hlsjs.ready.call(this);
        })
        .catch((error) => {
          this.debug.warn('Hlsjs failed to load', error);
        });
    } else {
      hlsjs.ready.call(this);
    }
  },

  ready() {
    const player = this;
    if (!window.Hls.isSupported()) {
      this.provider = providers.html5;
      player.media.src = player.config.src;
    } else {
      // eslint-disable-next-line no-undef
      const hls = new Hls({
        // startLevel: this.config.adaptive.startLevel,
        // Buffer config
        maxBufferLength: this.config.buffer.maxBufferLength < 30 ? this.config.buffer.maxBufferLength : 10,
        maxMaxBufferLength: this.config.buffer.maxMaxBufferLength < 60 ? this.config.buffer.maxMaxBufferLength : 60,
      });

      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        const qualities = hls.levels.map((level) => level.height);
        player.options.quality = [-1, ...qualities]; // clone array without ref
        player.config.quality.options =
          qualities[0] < qualities[qualities.length - 1] ? [-1, ...qualities.reverse()] : [-1, ...qualities]; // force support quality from manifest
        player.quality = -1; // Auto level switch quality
        this.setQualityMenu.call(player, player.options.quality);
      });

      hls.on(window.Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(this.config.src);
      });

      hls.detachMedia();
      hls.attachMedia(player.media);

      window.hls = hls;

      // Quality
      Object.defineProperty(player.media, 'quality', {
        get() {
          const { currentLevel, levels } = window.hls;
          return levels && levels[currentLevel] ? levels[currentLevel].height : -1;
        },

        set(input) {
          // If we're using an an external handler...
          if (player.config.quality.forced && is.function(player.config.quality.onChange)) {
            player.config.quality.onChange(input);
          } else if (input === -1) {
            player.debug.log('Set quality to auto');
            window.hls.nextLevel = -1;
          } else {
            player.debug.log(`Set quality to manual: ${input}p`);
            const newLevel = window.hls.levels.map((o) => o.height).indexOf(input);
            window.hls.currentLevel = newLevel;
          }

          // Trigger change event
          triggerEvent.call(player, player.media, 'qualitychange', false, {
            quality: input,
          });
        },
      });
    }
  },
};

export default hlsjs;
