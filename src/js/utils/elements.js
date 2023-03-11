// ==========================================================================
// Element utils
// ==========================================================================

import is from './is';
import { extend } from './objects';

// Wrap an element
export function wrap(elements, wrapper) {
  // Convert `elements` to an array, if necessary.
  const targets = elements.length ? elements : [elements];

  // Loops backwards to prevent having to clone the wrapper on the
  // first element (see `child` below).
  Array.from(targets)
    .reverse()
    .forEach((element, index) => {
      const child = index > 0 ? wrapper.cloneNode(true) : wrapper;
      // Cache the current parent and sibling.
      const parent = element.parentNode;
      const sibling = element.nextSibling;

      // Wrap the element (is automatically removed from its current
      // parent).
      child.appendChild(element);

      // If the element had a sibling, insert the wrapper before
      // the sibling to maintain the HTML structure; otherwise, just
      // append it to the parent.
      if (sibling) {
        parent.insertBefore(child, sibling);
      } else {
        parent.appendChild(child);
      }
    });
}

// Set attributes
export function setAttributes(element, attributes) {
  if (!is.element(element) || is.empty(attributes)) return;

  // Assume null and undefined attributes should be left out,
  // Setting them would otherwise convert them to "null" and "undefined"
  Object.entries(attributes)
    .filter(([, value]) => !is.nullOrUndefined(value))
    .forEach(([key, value]) => element.setAttribute(key, value));
}

// Create a DocumentFragment
export function createElement(type, attributes, text) {
  // Create a new <element>
  const element = document.createElement(type);

  // Set all passed attributes
  if (is.object(attributes)) {
    setAttributes(element, attributes);
  }

  // Add text node
  if (is.string(text)) {
    element.innerText = text;
  }

  // Return built element
  return element;
}

// Insert an element after another
export function insertAfter(element, target) {
  if (!is.element(element) || !is.element(target)) return;

  target.parentNode.insertBefore(element, target.nextSibling);
}

// Insert a DocumentFragment
export function insertElement(type, parent, attributes, text) {
  if (!is.element(parent)) return;

  parent.appendChild(createElement(type, attributes, text));
}

// Remove element(s)
export function removeElement(element) {
  if (is.nodeList(element) || is.array(element)) {
    Array.from(element).forEach(removeElement);
    return;
  }

  if (!is.element(element) || !is.element(element.parentNode)) {
    return;
  }

  element.parentNode.removeChild(element);
}

// Remove all child elements
export function emptyElement(element) {
  if (!is.element(element)) return;

  let { length } = element.childNodes;

  while (length > 0) {
    element.removeChild(element.lastChild);
    length -= 1;
  }
}

// Replace element
export function replaceElement(newChild, oldChild) {
  if (!is.element(oldChild) || !is.element(oldChild.parentNode) || !is.element(newChild)) return null;

  oldChild.parentNode.replaceChild(newChild, oldChild);

  return newChild;
}

// Get an attribute object from a string selector
export function getAttributesFromSelector(sel, existingAttributes) {
  // For example:
  // '.test' to { class: 'test' }
  // '#test' to { id: 'test' }
  // '[data-test="test"]' to { 'data-test': 'test' }

  if (!is.string(sel) || is.empty(sel)) return {};

  const attributes = {};
  const existing = extend({}, existingAttributes);

  sel.split(',').forEach((s) => {
    // Remove whitespace
    const selector = s.trim();
    const className = selector.replace('.', '');
    const stripped = selector.replace(/[[\]]/g, '');
    // Get the parts and value
    const parts = stripped.split('=');
    const [key] = parts;
    const value = parts.length > 1 ? parts[1].replace(/["']/g, '') : '';
    // Get the first character
    const start = selector.charAt(0);

    switch (start) {
      case '.':
        // Add to existing classname
        if (is.string(existing.class)) {
          attributes.class = `${existing.class} ${className}`;
        } else {
          attributes.class = className;
        }
        break;

      case '#':
        // ID selector
        attributes.id = selector.replace('#', '');
        break;

      case '[':
        // Attribute selector
        attributes[key] = value;

        break;

      default:
        break;
    }
  });

  return extend(existing, attributes);
}

// Toggle hidden
export function toggleHidden(element, hidden) {
  if (!is.element(element)) return;

  let hide = hidden;

  if (!is.boolean(hide)) {
    hide = !element.hidden;
  }

  // eslint-disable-next-line no-param-reassign
  element.hidden = hide;
}

// Mirror Element.classList.toggle, with IE compatibility for "force" argument
export function toggleClass(element, className, force) {
  if (is.nodeList(element)) {
    return Array.from(element).map((e) => toggleClass(e, className, force));
  }

  if (is.element(element)) {
    let method = 'toggle';
    if (typeof force !== 'undefined') {
      method = force ? 'add' : 'remove';
    }

    element.classList[method](className);
    return element.classList.contains(className);
  }

  return false;
}

// Has class name
export function hasClass(element, className) {
  return is.element(element) && element.classList.contains(className);
}

// Element matches selector
export function matches(element, selector) {
  const { prototype } = Element;

  function match() {
    return Array.from(document.querySelectorAll(selector)).includes(this);
  }

  const method =
    prototype.matches ||
    prototype.webkitMatchesSelector ||
    prototype.mozMatchesSelector ||
    prototype.msMatchesSelector ||
    match;

  return method.call(element, selector);
}

// Closest ancestor element matching selector (also tests element itself)
export function closest(element, selector) {
  const { prototype } = Element;

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
  function closestElement() {
    let el = this;

    do {
      if (matches.matches(el, selector)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  }

  const method = prototype.closest || closestElement;

  return method.call(element, selector);
}

// Find all elements
export function getElements(selector) {
  return this.elements.container.querySelectorAll(selector);
}

// Find a single element
export function getElement(selector) {
  return this.elements.container.querySelector(selector);
}

// Set focus and tab focus class
export function setFocus(element = null, focusVisible = false) {
  if (!is.element(element)) return;

  // Set regular focus
  element.focus({ preventScroll: true, focusVisible });
}
