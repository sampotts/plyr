// ==========================================================================
// Plyr.io demo
// This code is purely for the https://plyr.io website
// Please see README.md in the root or github.com/sampotts/plyr
// ==========================================================================

import './tab-focus';
import 'custom-event-polyfill';
import 'url-polyfill';

import * as Sentry from '@sentry/browser';
import Shr from 'shr-buttons';

import Plyr from '../../../src/js/plyr';
import sources from './sources';
import toggleClass from './toggle-class';

(() => {
  const production = 'plyr.io';
  const isProduction = window.location.host.includes(production);

  // Sentry for demo site (https://plyr.io) only
  if (isProduction) {
    Sentry.init({
      dsn: 'https://d4ad9866ad834437a4754e23937071e4@sentry.io/305555',
      whitelistUrls: [production].map((d) => new RegExp(`https://(([a-z0-9])+(.))*${d}`)),
    });
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

    // Setup the player
    const player = new Plyr(selector, {
      debug: true,
      title: 'View From A Blue Moon',
      iconUrl: 'dist/demo.svg',
      keyboard: {
        global: true,
      },
      tooltips: {
        controls: true,
      },
      captions: {
        active: true,
      },
      /* ads: {
        enabled: isProduction,
        publisherId: '918848828995742',
      }, */
      previewThumbnails: {
        enabled: true,
        src: ['https://cdn.plyr.io/static/demo/thumbs/100p.vtt', 'https://cdn.plyr.io/static/demo/thumbs/240p.vtt'],
      },
      vimeo: {
        // Prevent Vimeo blocking plyr.io demo site
        referrerPolicy: 'no-referrer',
      },
      mediaMetadata: {
        title: 'View From A Blue Moon',
        album: 'Sports',
        artist: 'Brainfarm',
        artwork: [
          {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
            type: 'image/jpeg',
          },
        ],
      },
      markers: {
        enabled: true,
        points: [
          {
            time: 10,
            label: 'first marker',
          },
          {
            time: 40,
            label: 'second marker',
          },
          {
            time: 120,
            label: '<strong>third</strong> marker',
          },
        ],
      },
    });

    // Expose for tinkering in the console
    window.player = player;

    // Setup type toggle
    const buttons = document.querySelectorAll('[data-source]');
    const types = Object.keys(sources);
    const historySupport = Boolean(window.history && window.history.pushState);
    let currentType = window.location.hash.substring(1);
    const hasInitialType = currentType.length;

    function render(type) {
      // Remove active classes
      Array.from(buttons).forEach((button) => toggleClass(button.parentElement, 'active', false));

      // Set active on parent
      toggleClass(document.querySelector(`[data-source="${type}"]`), 'active', true);

      // Show cite
      Array.from(document.querySelectorAll('.plyr__cite')).forEach((cite) => {
        // eslint-disable-next-line no-param-reassign
        cite.hidden = true;
      });

      document.querySelector(`.plyr__cite--${type}`).hidden = false;
    }

    // Set a new source
    function setSource(type, init) {
      // Bail if new type isn't known, it's the current type, or current type is empty (video is default) and new type is video
      if (!types.includes(type) || (!init && type === currentType) || (!currentType.length && type === 'video')) {
        return;
      }

      // Set the new source
      player.source = sources[type];

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

    // If there's no current type set, assume video
    if (!hasInitialType) {
      currentType = 'video';
    }

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
