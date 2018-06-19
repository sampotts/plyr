// ==========================================================================
// Element utils
// ==========================================================================

import { toggleListener } from './events';
import is from './is';

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
    if (!is.element(element) || is.empty(attributes)) {
        return;
    }

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

// Inaert an element after another
export function insertAfter(element, target) {
    target.parentNode.insertBefore(element, target.nextSibling);
}

// Insert a DocumentFragment
export function insertElement(type, parent, attributes, text) {
    // Inject the new <element>
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
    let { length } = element.childNodes;

    while (length > 0) {
        element.removeChild(element.lastChild);
        length -= 1;
    }
}

// Replace element
export function replaceElement(newChild, oldChild) {
    if (!is.element(oldChild) || !is.element(oldChild.parentNode) || !is.element(newChild)) {
        return null;
    }

    oldChild.parentNode.replaceChild(newChild, oldChild);

    return newChild;
}

// Get an attribute object from a string selector
export function getAttributesFromSelector(sel, existingAttributes) {
    // For example:
    // '.test' to { class: 'test' }
    // '#test' to { id: 'test' }
    // '[data-test="test"]' to { 'data-test': 'test' }

    if (!is.string(sel) || is.empty(sel)) {
        return {};
    }

    const attributes = {};
    const existing = existingAttributes;

    sel.split(',').forEach(s => {
        // Remove whitespace
        const selector = s.trim();
        const className = selector.replace('.', '');
        const stripped = selector.replace(/[[\]]/g, '');

        // Get the parts and value
        const parts = stripped.split('=');
        const key = parts[0];
        const value = parts.length > 1 ? parts[1].replace(/["']/g, '') : '';

        // Get the first character
        const start = selector.charAt(0);

        switch (start) {
            case '.':
                // Add to existing classname
                if (is.object(existing) && is.string(existing.class)) {
                    existing.class += ` ${className}`;
                }

                attributes.class = className;
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

    return attributes;
}

// Toggle hidden
export function toggleHidden(element, hidden) {
    if (!is.element(element)) {
        return;
    }

    let hide = hidden;

    if (!is.boolean(hide)) {
        hide = !element.hasAttribute('hidden');
    }

    if (hide) {
        element.setAttribute('hidden', '');
    } else {
        element.removeAttribute('hidden');
    }
}

// Mirror Element.classList.toggle, with IE compatibility for "force" argument
export function toggleClass(element, className, force) {
    if (is.element(element)) {
        let method = 'toggle';
        if (typeof force !== 'undefined') {
            method = force ? 'add' : 'remove';
        }

        element.classList[method](className);
        return element.classList.contains(className);
    }

    return null;
}

// Has class name
export function hasClass(element, className) {
    return is.element(element) && element.classList.contains(className);
}

// Element matches selector
export function matches(element, selector) {
    const prototype = { Element };

    function match() {
        return Array.from(document.querySelectorAll(selector)).includes(this);
    }

    const matches =
        prototype.matches ||
        prototype.webkitMatchesSelector ||
        prototype.mozMatchesSelector ||
        prototype.msMatchesSelector ||
        match;

    return matches.call(element, selector);
}

// Find all elements
export function getElements(selector) {
    return this.elements.container.querySelectorAll(selector);
}

// Find a single element
export function getElement(selector) {
    return this.elements.container.querySelector(selector);
}

// Get the focused element
export function getFocusElement() {
    let focused = document.activeElement;

    if (!focused || focused === document.body) {
        focused = null;
    } else {
        focused = document.querySelector(':focus');
    }

    return focused;
}

// Trap focus inside container
export function trapFocus(element = null, toggle = false) {
    if (!is.element(element)) {
        return;
    }

    const focusable = getElements.call(this, 'button:not(:disabled), input:not(:disabled), [tabindex]');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = event => {
        // Bail if not tab key or not fullscreen
        if (event.key !== 'Tab' || event.keyCode !== 9) {
            return;
        }

        // Get the current focused element
        const focused = getFocusElement();

        if (focused === last && !event.shiftKey) {
            // Move focus to first element that can be tabbed if Shift isn't used
            first.focus();
            event.preventDefault();
        } else if (focused === first && event.shiftKey) {
            // Move focus to last element that can be tabbed if Shift is used
            last.focus();
            event.preventDefault();
        }
    };

    toggleListener.call(this, this.elements.container, 'keydown', trap, toggle, false);
}
