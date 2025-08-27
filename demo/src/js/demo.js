// ==========================================================================
// Plyr.io demo
// This code is purely for the https://plyr.io website
// Please see README.md in the root or github.com/sampotts/plyr
// ==========================================================================

import * as Sentry from '@sentry/browser';
import Shr from 'shr-buttons';

import Plyr from '../../../src/js/plyr';
import sources from './sources';

import 'custom-event-polyfill';
import 'url-polyfill';

const commonConfig = {
  iconUrl: 'dist/demo.svg',
  debug: true,
  keyboard: {
    global: true,
  },
  tooltips: {
    controls: true,
  },
  captions: {
    active: true,
  },
  fullscreen: {
    iosNative: true,
  },
  playsinline: true,
};

(() => {
  const production = 'plyr.io';
  const isProduction = window.location.host.includes(production);

  // Sentry for demo site (https://plyr.io) only
  if (isProduction) {
    try {
      Sentry.init({
        dsn: 'https://d4ad9866ad834437a4754e23937071e4@sentry.io/305555',
        whitelistUrls: [production].map(d => new RegExp(`https://(([a-z0-9])+(.))*${d}`)),
      });
    }
    catch {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    const selector = '#player';

    // Setup share buttons
    Shr.setup('.js-shr', {
      count: {
        className: 'button__count',
      },
      wrapper: {
        className: 'button--with-count',
      },
    });

    // Setup type toggle
    const buttons = document.querySelectorAll('[data-source]');
    const types = Object.keys(sources);
    const historySupport = Boolean(window.history && window.history.pushState);
    let currentType = window.location.hash.substring(1);
    const hasInitialType = Boolean(currentType);
    // If there's no current type set, assume video
    if (!hasInitialType) currentType = 'video';

    // Setup the player as video by default
    const player = new Plyr(selector, {
      ...commonConfig,
      ...sources[currentType],
    });

    // Expose for tinkering in the console
    window.player = player;

    /* The audio player needs the container element shown/hidden
     * The video player needs the media element shown/hidden
     * */
    function showHlsPlayer() {
      if (window.player.elements && window.player.elements.container) {
        window.player.elements.container.hidden = true;
        if (window.player.media) {
          window.player.media.hidden = true;
          window.player.pause();
        }
      }
      if (window.playerHls.elements && window.playerHls.elements.container) {
        window.playerHls.elements.container.hidden = false;
        if (window.playerHls.media) {
          window.playerHls.media.hidden = false;
        }
      }
    }

    /* The audio player needs the container element shown/hidden
     * The video player needs the media element shown/hidden
     * */
    function showMainPlayer() {
      if (window.player.elements && window.player.elements.container) {
        window.player.elements.container.hidden = false;
        window.player.hidden = false;
        if (window.player.media) {
          window.player.media.hidden = false;
          window.player.media.pause();
        }
      }
      if (window.playerHls.elements && window.playerHls.elements.container) {
        window.playerHls.elements.container.hidden = true;
        window.playerHls.hidden = true;
        if (window.playerHls.media) {
          window.playerHls.media.hidden = true;
        }
      }
    }

    function render(type) {
      // Remove active classes
      Array.from(buttons).forEach(button => button.classList.toggle('active', false));

      // Set active on parent
      document.querySelector(`[data-source="${type}"]`).classList.toggle('active', true);

      // Show cite
      Array.from(document.querySelectorAll('.plyr__cite')).forEach((cite) => {
        cite.hidden = true;
      });

      document.querySelector(`.plyr__cite--${type}`).hidden = false;

      if (type === 'mux') {
        showHlsPlayer();
      }
      else {
        showMainPlayer();
      }
    }

    // Set a new source
    function setSource(type, init) {
      // Bail if new type isn't known, it's the current type, or current type is empty (video is default) and new type is video
      if (!types.includes(type) || (!init && type === currentType) || (!currentType.length && type === 'video')) {
        return;
      }

      const sourceConfig = sources[type];
      const hlsSource = sourceConfig.hlsSource;
      if (hlsSource) {
        const playerHls = new Plyr('#player-hls', { ...commonConfig, ...sourceConfig });
        window.playerHls = playerHls;
        const video = playerHls.media;
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(hlsSource);
          hls.attachMedia(video);
        }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // eslint-disable-next-line no-undef
          video.src = videoSrc;
        }
      }
      else {
        if (window.playerHls) {
          window.playerHls.destroy();
        }
        player.source = sourceConfig;
      }
      // Set the current type for next time
      currentType = type;
      render(type);
    }

    // Bind to each button
    Array.from(buttons).forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.getAttribute('data-source');
        setSource(type);

        if (historySupport) {
          window.history.pushState({ type }, '', `#${type}`);
        }
      });
    });

    // List for backwards/forwards
    window.addEventListener('popstate', (event) => {
      if (event.state && Object.keys(event.state).includes('type')) {
        setSource(event.state.type);
      }
    });

    // Replace current history state
    if (historySupport && types.includes(currentType)) {
      window.history.replaceState({ type: currentType }, '', hasInitialType ? `#${currentType}` : '');
    }

    // If it's not video, load the source
    if (currentType !== 'video') {
      setSource(currentType, true);
    }

    render(currentType);
  });
})();
