// ==========================================================================
// Plyr.io demo
// This code is purely for the https://plyr.io website
// Please see README.md in the root or github.com/sampotts/plyr
// ==========================================================================

import './tab-focus';

import Plyr from '../../../src/js/plyr';
import sources from './sources';
import toggleClass from './toggle-class';

(() => {
  const production = 'plyr.io';

  document.addEventListener('DOMContentLoaded', () => {
    const selector = '#player';

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
      vimeo: {
        // Prevent Vimeo blocking plyr.io demo site
        referrerPolicy: 'no-referrer',
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
      Array.from(document.querySelectorAll('.ggs-plyr__cite')).forEach((cite) => {
        // eslint-disable-next-line no-param-reassign
        cite.hidden = true;
      });

      document.querySelector(`.ggs-plyr__cite--${type}`).hidden = false;
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
