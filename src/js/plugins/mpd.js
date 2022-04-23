// ==========================================================================
// Plyr MPEG-DASH helpers
// ==========================================================================

import { triggerEvent } from '../utils/events';
import is from '../utils/is';
import { setAspectRatio } from '../utils/style';

const mpd = {
  getTrackName(track) {
    if(track.id){
      return track.id;
    }
    return `_index${track.index}`;
  },

  getTrackLabel(track) {
    // Normal label
    const browserLanguage = navigator.language;
    for (const label of track.labels) {
      if (label.lang && label.lang === browserLanguage) {
        return label.text;
      }
    }
    if(track.labels[0]){
      return track.labels[0].text;
    }

    // No label
    const outputStr = [];
    if(track.lang){
      outputStr.push(`Lang: ${track.lang}`);
    }
    if(track.id){
      outputStr.push(`ID: ${track.id}`);
    }
    outputStr.push(`Index: ${track.index}`);
    return outputStr.join(", ");
  },

  getVideoTrackLabels() {
    const labels = {};

    for (const track of this.dash.getTracksFor('video')) {
      const name = mpd.getTrackName.call(this, track);
      const text = mpd.getTrackLabel.call(this, track);
      labels[name] = text;
    }

    return labels;
  },

  getAudioTrackLabels() {
    const labels = {};

    for (const track of this.dash.getTracksFor('audio')) {
      const name = mpd.getTrackName.call(this, track);
      const text = mpd.getTrackLabel.call(this, track);
      labels[name] = text;
    }

    return labels;
  },

  getQualityOptions() {
    const qualityList = this.dash.getBitrateInfoListFor('video').map((bitrate) => {
      return bitrate.height;
    });

    return [0x7fffffff, ...qualityList];
  },

  getAudioTrackOptions() {
    const audioTrackList = this.dash.getTracksFor('audio').map((audioTrack) => {
      return mpd.getTrackName.call(this, audioTrack);
    });

    return audioTrackList;
  },

  getVideoTrackOptions() {
    const videoTrackList = this.dash.getTracksFor('video').map((videoTrack) => {
      return mpd.getTrackName.call(this, videoTrack);
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
        const dashConfig = {
          streaming: {
            abr: {
              autoSwitchBitrate: {},
            },
          },
        };

        if (input === 0x7fffffff) {
          // Enabling auto switch quality
          dashConfig.streaming.abr.autoSwitchBitrate.video = true;
          player.dash.updateSettings(dashConfig);
        } else {
          // Get quality by height
          const currentIndex = player.dash.getQualityFor('video');
          const currentHeight = (currentIndex) ? player.dash.getBitrateInfoListFor('video')[currentIndex].height : 0;
          for (const bitrate of player.dash.getBitrateInfoListFor('video')) {
            if (bitrate.height === input) {
              // Disabling auto switch quality
              dashConfig.streaming.abr.autoSwitchBitrate.video = false;
              player.dash.updateSettings(dashConfig);
              // Update quality
              player.dash.setQualityFor('video', bitrate.qualityIndex, bitrate.height > currentHeight);
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
            return mpd.getTrackName.call(player, currentTrack);
          }
        }catch(e){

        }
      },
      set(input) {
        // Replace already buffered frames
        player.dash.updateSettings({
          streaming: {
            trackSwitchMode: {
              audio: 'alwaysReplace',
            },
          },
        });

        let match;
        if (typeof input === 'string') {
          match = input.match(/^_index([0-9]+)$/);
        }
        if (match) {
          const index = parseInt(match[1]);
          for (const track of player.dash.getTracksFor('audio')) {
            if (track.index === index) {
              // Update video track
              player.dash.setCurrentTrack(track);
              break;
            }
          }
        } else {
          for (const track of player.dash.getTracksFor('audio')) {
            if (track.id === input) {
              // Update audio track
              player.dash.setCurrentTrack(track);
              break;
            }
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
        triggerEvent.call(player, player.media, 'qualitylistupdate', false, {
          list: mpd.getQualityOptions.call(player),
        });
      },
    });

    // Video track
    Object.defineProperty(player.media, 'videoTrack', {
      get() {
        try {
          const currentTrack = player.dash.getCurrentTrackFor('video');
          if (currentTrack) {
            return mpd.getTrackName.call(player, currentTrack);
          }
        }catch(e){

        }
      },
      set(input) {
        let match;
        if (typeof input === 'string') {
          match = input.match(/^_index([0-9]+)$/);
        }
        if (match) {
          const index = parseInt(match[1]);
          for (const track of player.dash.getTracksFor('video')) {
            if (track.index === index) {
              // Update video track
              player.dash.setCurrentTrack(track);
              break;
            }
          }
        } else {
          for (const track of player.dash.getTracksFor('video')) {
            if (track.id === input) {
              // Update video track
              player.dash.setCurrentTrack(track);
              break;
            }
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
        triggerEvent.call(player, player.media, 'qualitylistupdate', false, {
          list: mpd.getQualityOptions.call(player),
        });
      },
    });

    // Update settings list
    const triggerEvents = () => {
      triggerEvent.call(player, player.media, 'qualitylistupdate', false, {
        list: mpd.getQualityOptions.call(player),
      });
      triggerEvent.call(player, player.media, 'audiotracklistupdate', false, {
        list: mpd.getAudioTrackOptions.call(player),
      });
      triggerEvent.call(player, player.media, 'videotracklistupdate', false, {
        list: mpd.getVideoTrackOptions.call(player),
      });
      triggerEvent.call(player, player.media, 'audiotracklabelsupdate', false, {
        list: mpd.getAudioTrackLabels.call(player),
      });
      triggerEvent.call(player, player.media, 'videotracklabelsupdate', false, {
        list: mpd.getVideoTrackLabels.call(player),
      });
    };

    player.dash.on('periodSwitchCompleted', triggerEvents);
  },
};

export default mpd;
