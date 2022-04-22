// ==========================================================================
// Plyr MPEG-DASH helpers
// ==========================================================================

import { triggerEvent } from '../utils/events';
import is from '../utils/is';
import { setAspectRatio } from '../utils/style';

const mpd = {
  // Get quality levels
  getQualityOptions() {
    const qualityList = this.dash.getBitrateInfoListFor('video').map((bitrate) => {
      return bitrate.height;
    });

    return [0x7fffffff, ...qualityList];
  },

  getAudioTrackOptions() {
    const audioTrackList = this.dash.getTracksFor('audio').map((audioTrack) => {
      return audioTrack.id;
    });

    return audioTrackList;
  },

  setup() {
    if (!this.isMPD) {
      return;
    }

    const player = this;

    // Set speed options from config
    player.options.speed = player.config.speed.options;

    // Set aspect ratio if fixed
    if (!is.empty(this.config.ratio)) {
      setAspectRatio.call(player);
    }

    // Quality
    Object.defineProperty(player.media, 'quality', {
      get() {
        const currentIndex = player.dash.getQualityFor('video');
        console.log("get", "quality", currentIndex);
        if(currentIndex){
          return player.dash.getBitrateInfoListFor('video')[currentIndex].height;
        }
        return 0x7fffffff;
      },
      set(input) {
        const cfg = {
          'streaming': {
            'abr': {
              'autoSwitchBitrate': {}
            }
          }
        };

        if (input === 0x7fffffff) {
          cfg.streaming.abr.autoSwitchBitrate['video'] = true;
          player.dash.updateSettings(cfg);
        } else {
          const currentIndex = player.dash.getQualityFor('video');
          const currentHeight = (currentIndex) ? player.dash.getBitrateInfoListFor('video')[currentIndex].height : 0;
          for (const bitrate of player.dash.getBitrateInfoListFor('video')) {
            if (bitrate.height === input) {
              // Disable auto switch quality
              cfg.streaming.abr.autoSwitchBitrate['video'] = false;
              player.dash.updateSettings(cfg);
              // Update quality
              player.dash.setQualityFor('video', bitrate.qualityIndex, (bitrate.height > currentHeight));
              break;
            }
          }
        }

        // If we're using an external handler...
        if (player.config.quality.forced && is.function(player.config.quality.onChange)) {
          player.config.quality.onChange(input);
        }

        // Trigger change event
        triggerEvent.call(player, player.media, 'qualitychange', false, {
          quality: input,
        });
      },
    });

    // Audio track
    Object.defineProperty(player.media, 'audioTrack', {
      get() {
        try {
          const currentTrack = player.dash.getCurrentTrackFor('audio');
          if (currentTrack) {
            return currentTrack.id;
          }
          return "Default";
        }catch(e){}
      },
      set(input) {
        const cfg = {
          'streaming': {
            'trackSwitchMode': {
              'audio': 'alwaysReplace'
            }
          }
        };
        for (const track of player.dash.getTracksFor('audio')) {
          if (track.id === input) {
            // Update audio track
            player.dash.updateSettings(cfg);
            player.dash.setCurrentTrack(track);
            break;
          }
        }

        // If we're using an external handler...
        if (player.config.audioTrack.forced && is.function(player.config.audioTrack.onChange)) {
          player.config.audioTrack.onChange(input);
        }

        // Trigger change event
        triggerEvent.call(player, player.media, 'audiotrackchange', false, {
          audioTrack: input,
        });
      },
    });
  },
};

export default mpd;
