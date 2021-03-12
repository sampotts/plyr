// ==========================================================================
// YouTube plugin
// ==========================================================================

import ui from '../ui';
import { createElement, replaceElement, toggleClass } from '../utils/elements';
import { triggerEvent } from '../utils/events';
import fetch from '../utils/fetch';
import is from '../utils/is';
import loadImage from '../utils/load-image';
import loadScript from '../utils/load-script';
import { extend } from '../utils/objects';
import { format, generateId } from '../utils/strings';
import { setAspectRatio } from '../utils/style';

// Parse YouTube ID from URL
function parseId(url) {
  if (is.empty(url)) {
    return null;
  }

  const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  return url.match(regex) ? RegExp.$2 : url;
}

// Set playback state and trigger change (only on actual change)
function assurePlaybackState(play) {
  if (play && !this.embed.hasPlayed) {
    this.embed.hasPlayed = true;
  }
  if (this.media.paused === play) {
    this.media.paused = !play;
    triggerEvent.call(this, this.media, play ? 'play' : 'pause');
  }
}

function getHost(config) {
  if (config.noCookie) {
    return 'https://www.youtube-nocookie.com';
  }

  if (window.location.protocol === 'http:') {
    return 'http://www.youtube.com';
  }

  // Use YouTube's default
  return undefined;
}

const youtube = {
  setup() {
    // Add embed class for responsive
    toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

    // Setup API
    if (is.object(window.YT) && is.function(window.YT.Player)) {
      youtube.ready.call(this);
    } else {
      // Reference current global callback
      const callback = window.onYouTubeIframeAPIReady;

      // Set callback to process queue
      window.onYouTubeIframeAPIReady = () => {
        // Call global callback if set
        if (is.function(callback)) {
          callback();
        }

        youtube.ready.call(this);
      };

      // Load the SDK
      loadScript(this.config.urls.youtube.sdk).catch((error) => {
        this.debug.warn('YouTube API failed to load', error);
      });
    }
  },

  // Get the media title
  getTitle(videoId) {
    const url = format(this.config.urls.youtube.api, videoId);

    fetch(url)
      .then((data) => {
        if (is.object(data)) {
          const { title, height, width } = data;

          // Set title
          this.config.title = title;
          ui.setTitle.call(this);

          // Set aspect ratio
          this.embed.ratio = [width, height];
        }

        setAspectRatio.call(this);
      })
      .catch(() => {
        // Set aspect ratio
        setAspectRatio.call(this);
      });
  },

  // API ready
  ready() {
    const player = this;
    const config = player.config.youtube;
    // Ignore already setup (race condition)
    const currentId = player.media && player.media.getAttribute('id');
    if (!is.empty(currentId) && currentId.startsWith('youtube-')) {
      return;
    }

    // Get the source URL or ID
    let source = player.media.getAttribute('src');

    // Get from <div> if needed
    if (is.empty(source)) {
      source = player.media.getAttribute(this.config.attributes.embed.id);
    }

    // Replace the <iframe> with a <div> due to YouTube API issues
    const videoId = parseId(source);
    const id = generateId(player.provider);
    // Replace media element
    const container = createElement('div', { id, 'data-poster': config.customControls ? player.poster : undefined });
    player.media = replaceElement(container, player.media);

    // Only load the poster when using custom controls
    if (config.customControls) {
      const posterSrc = (s) => `https://i.ytimg.com/vi/${videoId}/${s}default.jpg`;

      // Check thumbnail images in order of quality, but reject fallback thumbnails (120px wide)
      loadImage(posterSrc('maxres'), 121) // Higest quality and unpadded
        .catch(() => loadImage(posterSrc('sd'), 121)) // 480p padded 4:3
        .catch(() => loadImage(posterSrc('hq'))) // 360p padded 4:3. Always exists
        .then((image) => ui.setPoster.call(player, image.src))
        .then((src) => {
          // If the image is padded, use background-size "cover" instead (like youtube does too with their posters)
          if (!src.includes('maxres')) {
            player.elements.poster.style.backgroundSize = 'cover';
          }
        })
        .catch(() => {});
    }

    // Setup instance
    // https://developers.google.com/youtube/iframe_api_reference
    player.embed = new window.YT.Player(player.media, {
      videoId,
      host: getHost(config),
      playerVars: extend(
        {},
        {
          // Autoplay
          autoplay: player.config.autoplay ? 1 : 0,
          // iframe interface language
          hl: player.config.hl,
          // Only show controls if not fully supported or opted out
          controls: player.supported.ui && config.customControls ? 0 : 1,
          // Disable keyboard as we handle it
          disablekb: 1,
          // Allow iOS inline playback
          playsinline: !player.config.fullscreen.iosNative ? 1 : 0,
          // Captions are flaky on YouTube
          cc_load_policy: player.captions.active ? 1 : 0,
          cc_lang_pref: player.config.captions.language,
          // Tracking for stats
          widget_referrer: window ? window.location.href : null,
        },
        config,
      ),
      events: {
        onError(event) {
          // YouTube may fire onError twice, so only handle it once
          if (!player.media.error) {
            const code = event.data;
            // Messages copied from https://developers.google.com/youtube/iframe_api_reference#onError
            const message =
              {
                2: 'The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.',
                5: 'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.',
                100: 'The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.',
                101: 'The owner of the requested video does not allow it to be played in embedded players.',
                150: 'The owner of the requested video does not allow it to be played in embedded players.',
              }[code] || 'An unknown error occured';

            player.media.error = { code, message };

            triggerEvent.call(player, player.media, 'error');
          }
        },
        onPlaybackRateChange(event) {
          // Get the instance
          const instance = event.target;

          // Get current speed
          player.media.playbackRate = instance.getPlaybackRate();

          triggerEvent.call(player, player.media, 'ratechange');
        },
        onReady(event) {
          // Bail if onReady has already been called. See issue #1108
          if (is.function(player.media.play)) {
            return;
          }
          // Get the instance
          const instance = event.target;

          // Get the title
          youtube.getTitle.call(player, videoId);

          // Create a faux HTML5 API using the YouTube API
          player.media.play = () => {
            assurePlaybackState.call(player, true);
            instance.playVideo();
          };

          player.media.pause = () => {
            assurePlaybackState.call(player, false);
            instance.pauseVideo();
          };

          player.media.stop = () => {
            instance.stopVideo();
          };

          player.media.duration = instance.getDuration();
          player.media.paused = true;

          // Seeking
          player.media.currentTime = 0;
          Object.defineProperty(player.media, 'currentTime', {
            get() {
              return Number(instance.getCurrentTime());
            },
            set(time) {
              // If paused and never played, mute audio preventively (YouTube starts playing on seek if the video hasn't been played yet).
              if (player.paused && !player.embed.hasPlayed) {
                player.embed.mute();
              }

              // Set seeking state and trigger event
              player.media.seeking = true;
              triggerEvent.call(player, player.media, 'seeking');

              // Seek after events sent
              instance.seekTo(time);
            },
          });

          // Playback speed
          Object.defineProperty(player.media, 'playbackRate', {
            get() {
              return instance.getPlaybackRate();
            },
            set(input) {
              instance.setPlaybackRate(input);
            },
          });

          // Volume
          let { volume } = player.config;
          Object.defineProperty(player.media, 'volume', {
            get() {
              return volume;
            },
            set(input) {
              volume = input;
              instance.setVolume(volume * 100);
              triggerEvent.call(player, player.media, 'volumechange');
            },
          });

          // Muted
          let { muted } = player.config;
          Object.defineProperty(player.media, 'muted', {
            get() {
              return muted;
            },
            set(input) {
              const toggle = is.boolean(input) ? input : muted;
              muted = toggle;
              instance[toggle ? 'mute' : 'unMute']();
              instance.setVolume(volume * 100);
              triggerEvent.call(player, player.media, 'volumechange');
            },
          });

          // Source
          Object.defineProperty(player.media, 'currentSrc', {
            get() {
              return instance.getVideoUrl();
            },
          });

          // Ended
          Object.defineProperty(player.media, 'ended', {
            get() {
              return player.currentTime === player.duration;
            },
          });

          // Get available speeds
          const speeds = instance.getAvailablePlaybackRates();
          // Filter based on config
          player.options.speed = speeds.filter((s) => player.config.speed.options.includes(s));

          // Set the tabindex to avoid focus entering iframe
          if (player.supported.ui && config.customControls) {
            player.media.setAttribute('tabindex', -1);
          }

          triggerEvent.call(player, player.media, 'timeupdate');
          triggerEvent.call(player, player.media, 'durationchange');

          // Reset timer
          clearInterval(player.timers.buffering);

          // Setup buffering
          player.timers.buffering = setInterval(() => {
            // Get loaded % from YouTube
            player.media.buffered = instance.getVideoLoadedFraction();

            // Trigger progress only when we actually buffer something
            if (player.media.lastBuffered === null || player.media.lastBuffered < player.media.buffered) {
              triggerEvent.call(player, player.media, 'progress');
            }

            // Set last buffer point
            player.media.lastBuffered = player.media.buffered;

            // Bail if we're at 100%
            if (player.media.buffered === 1) {
              clearInterval(player.timers.buffering);

              // Trigger event
              triggerEvent.call(player, player.media, 'canplaythrough');
            }
          }, 200);

          // Rebuild UI
          if (config.customControls) {
            setTimeout(() => ui.build.call(player), 50);
          }
        },
        onStateChange(event) {
          // Get the instance
          const instance = event.target;

          // Reset timer
          clearInterval(player.timers.playing);

          const seeked = player.media.seeking && [1, 2].includes(event.data);

          if (seeked) {
            // Unset seeking and fire seeked event
            player.media.seeking = false;
            triggerEvent.call(player, player.media, 'seeked');
          }

          // Handle events
          // -1   Unstarted
          // 0    Ended
          // 1    Playing
          // 2    Paused
          // 3    Buffering
          // 5    Video cued
          switch (event.data) {
            case -1:
              // Update scrubber
              triggerEvent.call(player, player.media, 'timeupdate');

              // Get loaded % from YouTube
              player.media.buffered = instance.getVideoLoadedFraction();
              triggerEvent.call(player, player.media, 'progress');

              break;

            case 0:
              assurePlaybackState.call(player, false);

              // YouTube doesn't support loop for a single video, so mimick it.
              if (player.media.loop) {
                // YouTube needs a call to `stopVideo` before playing again
                instance.stopVideo();
                instance.playVideo();
              } else {
                triggerEvent.call(player, player.media, 'ended');
              }

              break;

            case 1:
              // Restore paused state (YouTube starts playing on seek if the video hasn't been played yet)
              if (config.customControls && !player.config.autoplay && player.media.paused && !player.embed.hasPlayed) {
                player.media.pause();
              } else {
                assurePlaybackState.call(player, true);

                triggerEvent.call(player, player.media, 'playing');

                // Poll to get playback progress
                player.timers.playing = setInterval(() => {
                  triggerEvent.call(player, player.media, 'timeupdate');
                }, 50);

                // Check duration again due to YouTube bug
                // https://github.com/sampotts/plyr/issues/374
                // https://code.google.com/p/gdata-issues/issues/detail?id=8690
                if (player.media.duration !== instance.getDuration()) {
                  player.media.duration = instance.getDuration();
                  triggerEvent.call(player, player.media, 'durationchange');
                }
              }

              break;

            case 2:
              // Restore audio (YouTube starts playing on seek if the video hasn't been played yet)
              if (!player.muted) {
                player.embed.unMute();
              }
              assurePlaybackState.call(player, false);

              break;

            case 3:
              // Trigger waiting event to add loading classes to container as the video buffers.
              triggerEvent.call(player, player.media, 'waiting');

              break;

            default:
              break;
          }

          triggerEvent.call(player, player.elements.container, 'statechange', false, {
            code: event.data,
          });
        },
      },
    });
  },
};

export default youtube;
