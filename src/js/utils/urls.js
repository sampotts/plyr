// ==========================================================================
// URL utils
// ==========================================================================

import is from './is';

/**
 * Parse a string to a URL object
 * @param {string} input - the URL to be parsed
 * @param {boolean} safe - failsafe parsing
 */
export function parseUrl(input, safe = true) {
    let url = input;

    if (safe) {
        const parser = document.createElement('a');
        parser.href = url;
        url = parser.href;
    }

    try {
        return new URL(url);
    } catch (e) {
        return null;
    }
}

// Convert object to URLSearchParams
export function buildUrlParams(input) {
    if (!is.object(input)) {
        return '';
    }

    const params = new URLSearchParams();

    Object.entries(input).forEach(([
        key,
        value,
    ]) => {
        params.set(key, value);
    });

    return params;
}
