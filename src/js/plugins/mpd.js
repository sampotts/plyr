// ==========================================================================
// Plyr MPEG-DASH helpers
// ==========================================================================

import { triggerEvent } from '../utils/events';
import i18n from '../utils/i18n';
import is from '../utils/is';
import { setAspectRatio } from '../utils/style';

const mpd = {
  // Reserved value that must not be the same as other values
  qualityAutoMagicValue: Infinity,

  // Get name of track
  getTrackName(track) {
    if (track.id) {
      return track.id;
    }
    return `_index${track.index}`;
  },

  // Get human-like name of track
  getTrackLabel(track) {
    // Normal label
    const labelByLanguage = track.labels.find((e) => e.lang && e.lang === navigator.language);
    if (labelByLanguage) {
      return labelByLanguage;
    }
    if (track.labels[0]) {
      return track.labels[0].text;
    }

    // When label doesn't exist
    const outputStr = [];
    if (track.lang) {
      outputStr.push(`Lang: ${track.lang}`);
    }
    if (track.id) {
      outputStr.push(`ID: ${track.id}`);
    }
    outputStr.push(`Index: ${track.index}`);
    return outputStr.join(', ');
  },

  // Get video labels
  getVideoTrackLabels() {
    const labels = {};
    this.dash.getTracksFor('video').forEach((track) => {
      const name = mpd.getTrackName.call(this, track);
      const text = mpd.getTrackLabel.call(this, track);
      labels[name] = text;
    });
    return labels;
  },

  // Get audio labels
  getAudioTrackLabels() {
    const labels = {};
    this.dash.getTracksFor('audio').forEach((track) => {
      const name = mpd.getTrackName.call(this, track);
      const text = mpd.getTrackLabel.call(this, track);
      labels[name] = text;
    });
    return labels;
  },

  // Get quality levels
  getQualityOptions() {
    const qualityList = [];
    this.dash.getBitrateInfoListFor('video').forEach((bitrate) => {
      if (!qualityList.includes(bitrate.height)) {
        qualityList.push(bitrate.height);
      }
    });
    // "Auto"
    qualityList.push(mpd.qualityAutoMagicValue);
    // Sort by DESC
    qualityList.sort((a, b) => b - a);
    if (this.config.quality.allowOverwrite) {
      // Update supported options
      this.config.quality.options = qualityList;
    }
    return qualityList;
  },

  // Get audio tracks
  getAudioTrackOptions() {
    const audioTrackList = this.dash.getTracksFor('audio').map((audioTrack) => {
      return mpd.getTrackName.call(this, audioTrack);
    });
    return audioTrackList;
  },

  // Get video tracks
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

    // Config hacks
    if (!player.config.quality.options.includes(mpd.qualityAutoMagicValue)) {
      player.config.quality.options.push(mpd.qualityAutoMagicValue);
    }
    if (!player.config.i18n.qualityLabel) {
      player.config.i18n.qualityLabel = {};
    }
    player.config.i18n.qualityLabel[mpd.qualityAutoMagicValue] = i18n.get('qualityAuto', player.config);

    // Set speed options from config
    player.options.speed = player.config.speed.options;

    // Set aspect ratio if fixed
    if (!is.empty(this.config.ratio)) {
      setAspectRatio.call(player);
    }

    // Quality
    Object.defineProperty(player.media, 'quality', {
      get() {
        // Check "auto" attribute
        const settings = player.dash.getSettings();
        if (
          settings.streaming &&
          settings.streaming.abr &&
          settings.streaming.abr.autoSwitchBitrate &&
          settings.streaming.abr.autoSwitchBitrate.video
        ) {
          return mpd.qualityAutoMagicValue;
        }
        // Get quality value
        const currentIndex = player.dash.getQualityFor('video');
        const bitrateList = player.dash.getBitrateInfoListFor('video');
        if (typeof currentIndex === 'number' && bitrateList[currentIndex]) {
          return bitrateList[currentIndex].height;
        }
        return undefined;
      },
      set(input) {
        const dashConfig = {
          streaming: {
            abr: {
              autoSwitchBitrate: {},
            },
          },
        };

        // If "auto"
        if (input === mpd.qualityAutoMagicValue) {
          // Enabling auto switch quality
          dashConfig.streaming.abr.autoSwitchBitrate.video = true;
          player.dash.updateSettings(dashConfig);
        } else {
          // Get quality by height
          const currentIndex = player.dash.getQualityFor('video');
          const currentHeight = currentIndex ? player.dash.getBitrateInfoListFor('video')[currentIndex].height : 0;
          // Sorting bitrates by DESC
          const bitrateList = player.dash.getBitrateInfoListFor('video');
          bitrateList.sort((a, b) => b.bitrate - a.bitrate);
          // Find quality
          const quality = bitrateList.find((e) => e.height === input);
          // Disabling auto switch quality
          dashConfig.streaming.abr.autoSwitchBitrate.video = false;
          player.dash.updateSettings(dashConfig);
          // Update quality
          if (quality) {
            player.dash.setQualityFor('video', quality.qualityIndex, quality.height > currentHeight);
          }
        }

        // If we're using an external handler...
        if (is.function(player.config.quality.onChange)) {
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
        if (player.dash.getActiveStream()) {
          const currentTrack = player.dash.getCurrentTrackFor('audio');
          if (currentTrack) {
            return mpd.getTrackName.call(player, currentTrack);
          }
        }
        return undefined;
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
          // Find by index
          const index = parseInt(match[1], 10);
          const track = player.dash.getTracksFor('audio').find((e) => e.index === index);
          // Update video track
          if (track) {
            player.dash.setCurrentTrack(track);
          }
        } else {
          // Find by id
          const track = player.dash.getTracksFor('audio').find((e) => e.id === input);
          // Update audio track
          if (track) {
            player.dash.setCurrentTrack(track);
          }
        }

        // If we're using an external handler...
        if (is.function(player.config.audioTrack.onChange)) {
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
        if (player.dash.getActiveStream()) {
          const currentTrack = player.dash.getCurrentTrackFor('video');
          if (currentTrack) {
            return mpd.getTrackName.call(player, currentTrack);
          }
        }
        return undefined;
      },
      set(input) {
        let match;
        if (typeof input === 'string') {
          match = input.match(/^_index([0-9]+)$/);
        }
        if (match) {
          // Find by index
          const index = parseInt(match[1], 10);
          const track = player.dash.getTracksFor('video').find((e) => e.index === index);
          // Update video track
          if (track) {
            player.dash.setCurrentTrack(track);
          }
        } else {
          // Find by id
          const track = player.dash.getTracksFor('video').find((e) => e.id === input);
          // Update video track
          if (track) {
            player.dash.setCurrentTrack(track);
          }
        }

        // If we're using an external handler...
        if (is.function(player.config.videoTrack.onChange)) {
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

    // Update settings list when perion changed
    player.dash.on('periodSwitchCompleted', () => {
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
    });
  },
};

export default mpd;
