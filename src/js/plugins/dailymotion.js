// ==========================================================================
// Vimeo plugin
// ==========================================================================

import ui from '../ui';
import { createElement, replaceElement, toggleClass } from '../utils/elements';
import { triggerEvent } from '../utils/events';
import fetch from '../utils/fetch';
import is from '../utils/is';
import loadScript from '../utils/load-script';
import { extend } from '../utils/objects';
import { format } from '../utils/strings';
import { setAspectRatio } from '../utils/style';

// Parse DailyMotion ID from URL
function parseId(url) {
  if (is.empty(url)) {
    return null;
  }

  if (is.number(Number(url))) {
    return url;
  }

  const regex = /^.*(dailymotion.com\/|video\/)(\w+).*/;
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

const dailymotion = {
  setup() {
    const player = this;
    // Add embed class for responsive
    toggleClass(player.elements.wrapper, player.config.classNames.embed, true);

    // Can't set speed for dailymotion
    player.options.speed = [1];

    // Set intial ratio
    setAspectRatio.call(player);

    // Load the SDK if not already
    if (is.object(window.DM) && is.function(window.DM.player)) {
      dailymotion.ready.call(player);
    } else {
      loadScript(player.config.urls.dailymotion.sdk)
        .then(() => {
          dailymotion.ready.call(player);
        })
        .catch(error => {
          player.debug.warn('DailyMotion SDK (all.js) failed to load', error);
        });
    }
  },

  // API Ready
  ready() {
    // Following previous plugin procedure
    const player = this;
    // Getting dailymotion config
    const config = player.config.dailymotion;
    // Get the source URL or ID if it's an <iframe />
    let source = player.media.getAttribute('src');

    // Get from <div> if needed
    if (is.empty(source)) {
      source = player.media.getAttribute(this.config.attributes.embed.id);
    }
    const videoId = parseId(source);
    // Get poster, if already set
    const { poster } = player;
    // This div will be replaced by an iframe by DM.player
    const container = createElement('div');
    // We need to keep the previous element to implement the destroy method and keep the same behaviour as Youtube and Vimeo
    const previousElement = player.media.cloneNode();
    player.media = replaceElement(container, player.media);

    // Get poster image
    fetch(format(player.config.urls.dailymotion.api, videoId), 'json')
      .then(response => {
        if (is.empty(response)) {
          return;
        }
        // Set Title
        player.config.title = response.title;
        ui.setTitle.call(player);

        // Set aspect ratio
        player.embed.ratio = [response.width, response.height];

        // Set and show poster
        ui.setPoster.call(player, response.thumbnail_1080_url).catch(() => {});
        setAspectRatio.call(player);
      })
      .catch(() => {
        setAspectRatio(player);
      });

    // Setup instance
    // https://developer.dailymotion.com/tools/sdks#sdk-javascript-player-api
    player.embed = window.DM.player(container, {
      video: videoId,
      params: extend(
        {},
        {
          autoplay: player.config.autoplay, // Autoplay
          controls: !player.supported.ui,
          mute: player.config.muted,
          origin: window.location.hostname,
          'subtitles-default': player.config.captions.language,
        },
        config,
      ),
    });
    container.setAttribute('data-poster', poster);
    player.embed.destroy = () => {
      player.media = replaceElement(previousElement, player.media);
    };
    player.media.paused = true;

    player.embed.addEventListener('apiready', () => {
      // Set the tabindex to avoid focus entering iframe
      if (player.supported.ui) {
        player.media.setAttribute('tabindex', -1);
      }

      player.media.currentTime = 0;
      player.media.duration = player.embed.duration;
      triggerEvent.call(player, player.media, 'timeupdate');
      triggerEvent.call(player, player.media, 'durationchange');

      // Create a faux HTML5 API using the DailyMotion API
      /*
       * Methods
       */
      player.media.play = () => {
        assurePlaybackState.call(player, true);
        return player.embed.play();
      };

      player.media.pause = () => {
        assurePlaybackState.call(player, false);
        return player.embed.pause();
      };

      player.media.stop = () => {
        player.embed.pause();
        player.embed.seek(0);
      };

      /*
       * Properties
       */
      let { currentTime } = player.embed;
      // Seeking
      Object.defineProperty(player.media, 'currentTime', {
        get() {
          return currentTime;
        },
        set(time) {
          // If paused and never played, mute audio preventively
          if (player.paused && !player.embed.hasPlayed) {
            player.embed.setMuted(true);
          }

          // Set seeking state and trigger event
          player.media.seeking = true;
          triggerEvent.call(player, player.media, 'seeking');

          // Seek after events sent
          player.embed.seek(time);
          if (player.paused && !player.embed.hasPlayed) {
            player.pause();
            player.embed.setMuted(false);
          }
        },
      });

      // Volume
      let { volume } = player.config;
      Object.defineProperty(player.media, 'volume', {
        get() {
          return volume;
        },
        set(input) {
          player.embed.setVolume(input);
          volume = input;
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
          const toggle = is.boolean(input) ? input : false;
          muted = toggle;
          player.embed.setMuted(toggle);
          triggerEvent.call(player, player.media, 'volumechange');
        },
      });

      // DailyMotion doesn't provide the source
      Object.defineProperty(player.media, 'currentSrc', {
        get() {
          return '';
        },
      });

      // Ended
      Object.defineProperty(player.media, 'ended', {
        get() {
          return player.embed.ended;
        },
      });

      /*
       * Events Listeners
       */
      player.embed.addEventListener('error', () => {
        // DailyMotion may fire onError twice, so only handle it once
        if (!player.media.error) {
          const { code, message } = player.embed.error;
          player.media.error = { code, message };

          triggerEvent.call(player, player.media, 'error');
        }
      });

      player.embed.addEventListener('play', () => {
        assurePlaybackState.call(player, true);
        triggerEvent.call(player, player.media, 'playing');
      });

      player.embed.addEventListener('pause', () => {
        assurePlaybackState.call(player, false);
      });

      player.embed.addEventListener('durationchange', () => {
        player.media.duration = player.embed.duration;
        triggerEvent.call(player, player.media, 'durationchange');
      });

      player.embed.addEventListener('timeupdate', () => {
        player.media.seeking = false;
        currentTime = player.embed.currentTime;
        triggerEvent.call(player, player.media, 'timeupdate');
      });

      player.embed.addEventListener('progress', () => {
        const buffered = player.embed.bufferedTime / player.embed.duration; // percent [0; 1]
        player.media.buffered = buffered;
        triggerEvent.call(player, player.media, 'progress');

        // Check all loaded
        if (parseInt(buffered, 10) === 1) {
          triggerEvent.call(player, player.media, 'canplaythrough');
        }
      });
      player.embed.addEventListener('seeked', () => {
        player.media.seeking = false;
        triggerEvent.call(player, player.media, 'seeked');
      });

      player.embed.addEventListener('ended', () => {
        assurePlaybackState.call(player, false);
        // DailyMotion doesn't support loop for a single video, so mimick it.
        if (player.media.loop) {
          // DailyMotion needs a call to `stop` before playing again
          player.media.stop();
          player.media.play();
        } else {
          triggerEvent.call(player, player.media, 'ended');
        }
      });
      player.embed.addEventListener('waiting', () => {
        triggerEvent.call(player, player.media, 'waiting');
      });

      // Rebuild UI
      setTimeout(() => ui.build.call(player), 50);
    });
  },
};

export default dailymotion;
