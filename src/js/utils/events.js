// ==========================================================================
// Event utils
// ==========================================================================

import is from './is';

// Check for passive event listener support
// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
// https://www.youtube.com/watch?v=NPM6172J22g
const supportsPassiveListeners = (() => {
    // Test via a getter in the options object to see if the passive property is accessed
    let supported = false;
    try {
        const options = Object.defineProperty({}, 'passive', {
            get() {
                supported = true;
                return null;
            },
        });
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
    } catch (e) {
        // Do nothing
    }

    return supported;
})();

// Toggle event listener
export function toggleListener(elements, event, callback, toggle = false, passive = true, capture = false) {
    // Bail if no elemetns, event, or callback
    if (is.empty(elements) || is.empty(event) || !is.function(callback)) {
        return;
    }

    // If a nodelist is passed, call itself on each node
    if (is.nodeList(elements) || is.array(elements)) {
        // Create listener for each node
        Array.from(elements).forEach(element => {
            if (element instanceof Node) {
                toggleListener.call(null, element, event, callback, toggle, passive, capture);
            }
        });

        return;
    }

    // Allow multiple events
    const events = event.split(' ');

    // Build options
    // Default to just the capture boolean for browsers with no passive listener support
    let options = capture;

    // If passive events listeners are supported
    if (supportsPassiveListeners) {
        options = {
            // Whether the listener can be passive (i.e. default never prevented)
            passive,
            // Whether the listener is a capturing listener or not
            capture,
        };
    }

    // If a single node is passed, bind the event listener
    events.forEach(type => {
        elements[toggle ? 'addEventListener' : 'removeEventListener'](type, callback, options);
    });
}

// Bind event handler
export function on(element, events = '', callback, passive = true, capture = false) {
    toggleListener(element, events, callback, true, passive, capture);
}

// Unbind event handler
export function off(element, events = '', callback, passive = true, capture = false) {
    toggleListener(element, events, callback, false, passive, capture);
}

// Trigger event
export function trigger(element, type = '', bubbles = false, detail = {}) {
    // Bail if no element
    if (!is.element(element) || is.empty(type)) {
        return;
    }

    // Create and dispatch the event
    const event = new CustomEvent(type, {
        bubbles,
        detail: Object.assign({}, detail, {
            plyr: this,
        }),
    });

    // Dispatch the event
    element.dispatchEvent(event);
}
