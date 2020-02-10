// ==========================================================================
// Array utils
// ==========================================================================

import is from './is';

// Remove duplicates in an array
export function dedupe(array) {
    if (!is.array(array)) {
        return array;
    }

    return array.filter((item, index) => array.indexOf(item) === index);
}

// Get the closest value in an array
export function closest(array, value) {
    if (!is.array(array) || !array.length) {
        return null;
    }

    return array.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
}
