// ==========================================================================
// Sprite loader
// ==========================================================================

import Storage from '../storage';
import fetch from './fetch';
import is from './is';

// Load an external SVG sprite
export default function loadSprite(url, id) {
  if (!is.string(url)) {
    return;
  }

  const prefix = 'cache';
  const hasId = is.string(id);
  let isCached = false;
  const exists = () => document.getElementById(id) !== null;

  const update = (container, data) => {
    // eslint-disable-next-line no-param-reassign
    container.innerHTML = data;

    // Check again incase of race condition
    if (hasId && exists()) {
      return;
    }

    // Inject the SVG to the body
    document.body.insertAdjacentElement('afterbegin', container);
  };

  // Only load once if ID set
  if (!hasId || !exists()) {
    const useStorage = Storage.supported;
    // Create container
    const container = document.createElement('div');
    container.setAttribute('hidden', '');

    if (hasId) {
      container.setAttribute('id', id);
    }

    // Check in cache
    if (useStorage) {
      const cached = window.localStorage.getItem(`${prefix}-${id}`);
      isCached = cached !== null;

      if (isCached) {
        const data = JSON.parse(cached);
        update(container, data.content);
      }
    }

    // Get the sprite
    fetch(url)
      .then((result) => {
        if (is.empty(result)) {
          return;
        }

        if (useStorage) {
          try {
            window.localStorage.setItem(
              `${prefix}-${id}`,
              JSON.stringify({
                content: result,
              }),
            );
          } catch (_) {
            // Do nothing
          }
        }

        update(container, result);
      })
      .catch(() => {});
  }
}
