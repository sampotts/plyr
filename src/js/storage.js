// ==========================================================================
// Plyr storage
// ==========================================================================

import support from './support';
import utils from './utils';

// Get contents of local storage
function get() {
    const store = window.localStorage.getItem(this.config.storage.key);

    if (utils.is.empty(store)) {
        return {};
    }

    return JSON.parse(store);
}

// Save a value back to local storage
function set(object) {
    // Bail if we don't have localStorage support or it's disabled
    if (!support.storage || !this.config.storage.enabled) {
        return;
    }

    // Can only store objectst
    if (!utils.is.object(object)) {
        return;
    }

    // Get current storage
    const storage = get.call(this);

    // Update the working copy of the values
    utils.extend(storage, object);

    // Update storage
    window.localStorage.setItem(this.config.storage.key, JSON.stringify(storage));
}

// Setup localStorage
function setup() {
    let value = null;
    let storage = {};

    // Bail if we don't have localStorage support or it's disabled
    if (!support.storage || !this.config.storage.enabled) {
        return storage;
    }

    // Clean up old volume
    // https://github.com/sampotts/plyr/issues/171
    window.localStorage.removeItem('plyr-volume');

    // load value from the current key
    value = window.localStorage.getItem(this.config.storage.key);

    if (!value) {
        // Key wasn't set (or had been cleared), move along
    } else if (/^\d+(\.\d+)?$/.test(value)) {
        // If value is a number, it's probably volume from an older
        // version of this. See: https://github.com/sampotts/plyr/pull/313
        // Update the key to be JSON
        set({
            volume: parseFloat(value),
        });
    } else {
        // Assume it's JSON from this or a later version of plyr
        storage = JSON.parse(value);
    }

    return storage;
}

export default { setup, set, get };
