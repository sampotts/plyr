// ==========================================================================
// Animation utils
// ==========================================================================

import is from './is';

export const transitionEndEvent = (() => {
  const element = document.createElement('span');

  const events = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend',
  };

  const type = Object.keys(events).find(event => element.style[event] !== undefined);

  return is.string(type) ? events[type] : false;
})();

// Force repaint of element
export function repaint(element, delay) {
  setTimeout(() => {
    try {
      element.hidden = true;
      // eslint-disable-next-line no-unused-expressions
      element.offsetHeight;
      element.hidden = false;
    }
    catch {}
  }, delay);
}
