// ==========================================================================
// Animation utils
// ==========================================================================

import { toggleHidden } from './elements';
import is from './is';

export const transitionEndEvent = (() => {
    const element = document.createElement('span');

    const events = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd otransitionend',
        transition: 'transitionend',
    };

    const type = Object.keys(events).find(
        event => element.style[event] !== undefined,
    );

    return is.string(type) ? events[type] : false;
})();

// Force repaint of element
export function repaint(element) {
    setTimeout(() => {
        try {
            toggleHidden(element, true);
            element.offsetHeight; // eslint-disable-line
            toggleHidden(element, false);
        } catch (e) {
            // Do nothing
        }
    }, 0);
}
