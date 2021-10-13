// ==========================================================================
// Plyr storage
// ==========================================================================

import is from './utils/is';
import { extend } from './utils/objects';

class Storage {
  constructor(player) {
    this.enabled = player.config.storage.enabled;
    this.key = player.config.storage.key;
  }

  // Check for actual support (see if we can use it)
  static get supported() {
    try {
      if (!('localStorage' in window)) {
        return false;
      }

      const test = '___test';

      // Try to use it (it might be disabled, e.g. user is in private mode)
      // see: https://github.com/sampotts/plyr/issues/131
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);

      return true;
    } catch (_) {
      return false;
    }
  }

  get = (key) => {
    if (!Storage.supported || !this.enabled) {
      return null;
    }

    const store = window.localStorage.getItem(this.key);

    if (is.empty(store)) {
      return null;
    }

    const json = JSON.parse(store);

    return is.string(key) && key.length ? json[key] : json;
  };

  set = (object) => {
    // Bail if we don't have localStorage support or it's disabled
    if (!Storage.supported || !this.enabled) {
      return;
    }

    // Can only store objectst
    if (!is.object(object)) {
      return;
    }

    // Get current storage
    let storage = this.get();

    // Default to empty object
    if (is.empty(storage)) {
      storage = {};
    }

    // Update the working copy of the values
    extend(storage, object);

    // Update storage
    try {
      window.localStorage.setItem(this.key, JSON.stringify(storage));
    } catch (_) {
      // Do nothing
    }
  };
}

export default Storage;
