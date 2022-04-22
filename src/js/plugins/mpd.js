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

  getVideoTrackOptions() {
    const videoTrackList = this.dash.getTracksFor('video').map((videoTrack) => {
      return videoTrack.id;
    });

    return videoTrackList;
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
        const settings = player.dash.getSettings();
        if (settings.streaming && settings.streaming.abr && settings.streaming.abr.autoSwitchBitrate && settings.streaming.abr.autoSwitchBitrate.video) {
          return 0x7fffffff;
        }
        const currentIndex = player.dash.getQualityFor('video');
        const bitrateList = player.dash.getBitrateInfoListFor('video');
        if(typeof currentIndex === 'number' && bitrateList[currentIndex]){
          return bitrateList[currentIndex].height;
        }
        return 0;
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
          // Auto quality
          cfg.streaming.abr.autoSwitchBitrate['video'] = true;
          player.dash.updateSettings(cfg);
        } else {
          // Get quality by height
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
        }catch(e){

        }
        return "default";
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

    // Video track
    Object.defineProperty(player.media, 'videoTrack', {
      get() {
        try {
          const currentTrack = player.dash.getCurrentTrackFor('video');
          if (currentTrack) {
            return currentTrack.id;
          }
        }catch(e){

        }
        return "default";
      },
      set(input) {
        for (const track of player.dash.getTracksFor('video')) {
          if (track.id === input) {
            // Update video track
            player.dash.setCurrentTrack(track);
            break;
          }
        }

        // If we're using an external handler...
        if (player.config.videoTrack.forced && is.function(player.config.videoTrack.onChange)) {
          player.config.videoTrack.onChange(input);
        }

        // Trigger change event
        triggerEvent.call(player, player.media, 'videotrackchange', false, {
          videoTrack: input,
        });
      },
    });
  },
};

export default mpd;
