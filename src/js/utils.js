// ==========================================================================
// Plyr utils
// ==========================================================================

import support from './support';

const utils = {
    // Check variable types
    is: {
        object(input) {
            return this.getConstructor(input) === Object;
        },
        number(input) {
            return this.getConstructor(input) === Number && !Number.isNaN(input);
        },
        string(input) {
            return this.getConstructor(input) === String;
        },
        boolean(input) {
            return this.getConstructor(input) === Boolean;
        },
        function(input) {
            return this.getConstructor(input) === Function;
        },
        array(input) {
            return !this.nullOrUndefined(input) && Array.isArray(input);
        },
        nodeList(input) {
            return this.instanceof(input, window.NodeList);
        },
        htmlElement(input) {
            return this.instanceof(input, window.HTMLElement);
        },
        textNode(input) {
            return this.getConstructor(input) === Text;
        },
        event(input) {
            return this.instanceof(input, window.Event);
        },
        cue(input) {
            return this.instanceof(input, window.TextTrackCue) || this.instanceof(input, window.VTTCue);
        },
        track(input) {
            return this.instanceof(input, window.TextTrack) || this.string(input.kind);
        },
        nullOrUndefined(input) {
            return input === null || typeof input === 'undefined';
        },
        empty(input) {
            return (
                this.nullOrUndefined(input) ||
                ((this.string(input) || this.array(input) || this.nodeList(input)) && !input.length) ||
                (this.object(input) && !Object.keys(input).length)
            );
        },
        instanceof(input, constructor) {
            return Boolean(input && constructor && input instanceof constructor);
        },
        getConstructor(input) {
            return !this.nullOrUndefined(input) ? input.constructor : null;
        },
    },

    // Unfortunately, due to mixed support, UA sniffing is required
    getBrowser() {
        return {
            isIE: /* @cc_on!@ */ false || !!document.documentMode,
            isWebkit: 'WebkitAppearance' in document.documentElement.style && !/Edge/.test(navigator.userAgent),
            isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
            isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform),
        };
    },

    // Load an external script
    loadScript(url, callback) {
        // Check script is not already referenced
        if (document.querySelectorAll(`script[src="${url}"]`).length) {
            return;
        }

        // Build the element
        const element = document.createElement('script');
        element.src = url;

        // Find first script
        const first = document.getElementsByTagName('script')[0];

        // Bind callback
        if (utils.is.function(callback)) {
            element.addEventListener('load', event => callback.call(null, event), false);
        }

        // Inject
        first.parentNode.insertBefore(element, first);
    },

    // Load an external SVG sprite
    loadSprite(url, id) {
        if (!utils.is.string(url)) {
            return;
        }

        const prefix = 'cache-';
        const hasId = utils.is.string(id);
        let isCached = false;

        function updateSprite(data) {
            // Inject content
            this.innerHTML = data;

            // Inject the SVG to the body
            document.body.insertBefore(this, document.body.childNodes[0]);
        }

        // Only load once
        if (!hasId || !document.querySelectorAll(`#${id}`).length) {
            // Create container
            const container = document.createElement('div');
            container.setAttribute('hidden', '');

            if (hasId) {
                container.setAttribute('id', id);
            }

            // Check in cache
            if (support.storage) {
                const cached = window.localStorage.getItem(prefix + id);
                isCached = cached !== null;

                if (isCached) {
                    const data = JSON.parse(cached);
                    updateSprite.call(container, data.content);
                    return;
                }
            }

            // Get the sprite
            fetch(url)
                .then(response => (response.ok ? response.text() : null))
                .then(text => {
                    if (text === null) {
                        return;
                    }

                    if (support.storage) {
                        window.localStorage.setItem(
                            prefix + id,
                            JSON.stringify({
                                content: text,
                            })
                        );
                    }

                    updateSprite.call(container, text);
                })
                .catch(() => {});
        }
    },

    // Generate a random ID
    generateId(prefix) {
        return `${prefix}-${Math.floor(Math.random() * 10000)}`;
    },

    // Determine if we're in an iframe
    inFrame() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },

    // Wrap an element
    wrap(elements, wrapper) {
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
    },

    // Create a DocumentFragment
    createElement(type, attributes, text) {
        // Create a new <element>
        const element = document.createElement(type);

        // Set all passed attributes
        if (utils.is.object(attributes)) {
            utils.setAttributes(element, attributes);
        }

        // Add text node
        if (utils.is.string(text)) {
            element.textContent = text;
        }

        // Return built element
        return element;
    },

    // Inaert an element after another
    insertAfter(element, target) {
        target.parentNode.insertBefore(element, target.nextSibling);
    },

    // Insert a DocumentFragment
    insertElement(type, parent, attributes, text) {
        // Inject the new <element>
        parent.appendChild(utils.createElement(type, attributes, text));
    },

    // Remove an element
    removeElement(element) {
        if (!utils.is.htmlElement(element) || !utils.is.htmlElement(element.parentNode)) {
            return null;
        }

        element.parentNode.removeChild(element);

        return element;
    },

    // Remove all child elements
    emptyElement(element) {
        let { length } = element.childNodes;

        while (length > 0) {
            element.removeChild(element.lastChild);
            length -= 1;
        }
    },

    // Set attributes
    setAttributes(element, attributes) {
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
    },

    // Get an attribute object from a string selector
    getAttributesFromSelector(sel, existingAttributes) {
        // For example:
        // '.test' to { class: 'test' }
        // '#test' to { id: 'test' }
        // '[data-test="test"]' to { 'data-test': 'test' }

        if (!utils.is.string(sel) || utils.is.empty(sel)) {
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
                    if (utils.is.object(existing) && utils.is.string(existing.class)) {
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
    },

    // Toggle class on an element
    toggleClass(element, className, toggle) {
        if (utils.is.htmlElement(element)) {
            const contains = element.classList.contains(className);

            element.classList[toggle ? 'add' : 'remove'](className);

            return (toggle && !contains) || (!toggle && contains);
        }

        return null;
    },

    // Has class name
    hasClass(element, className) {
        return utils.is.htmlElement(element) && element.classList.contains(className);
    },

    // Element matches selector
    matches(element, selector) {
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
    },

    // Find all elements
    getElements(selector) {
        return this.elements.container.querySelectorAll(selector);
    },

    // Find a single element
    getElement(selector) {
        return this.elements.container.querySelector(selector);
    },

    // Find the UI controls and store references in custom controls
    // TODO: Allow settings menus with custom controls
    findElements() {
        try {
            this.elements.controls = utils.getElement.call(this, this.config.selectors.controls.wrapper);

            // Buttons
            this.elements.buttons = {
                play: utils.getElements.call(this, this.config.selectors.buttons.play),
                pause: utils.getElement.call(this, this.config.selectors.buttons.pause),
                restart: utils.getElement.call(this, this.config.selectors.buttons.restart),
                rewind: utils.getElement.call(this, this.config.selectors.buttons.rewind),
                forward: utils.getElement.call(this, this.config.selectors.buttons.forward),
                mute: utils.getElement.call(this, this.config.selectors.buttons.mute),
                pip: utils.getElement.call(this, this.config.selectors.buttons.pip),
                airplay: utils.getElement.call(this, this.config.selectors.buttons.airplay),
                settings: utils.getElement.call(this, this.config.selectors.buttons.settings),
                captions: utils.getElement.call(this, this.config.selectors.buttons.captions),
                fullscreen: utils.getElement.call(this, this.config.selectors.buttons.fullscreen),
            };

            // Progress
            this.elements.progress = utils.getElement.call(this, this.config.selectors.progress);

            // Inputs
            this.elements.inputs = {
                seek: utils.getElement.call(this, this.config.selectors.inputs.seek),
                volume: utils.getElement.call(this, this.config.selectors.inputs.volume),
            };

            // Display
            this.elements.display = {
                buffer: utils.getElement.call(this, this.config.selectors.display.buffer),
                duration: utils.getElement.call(this, this.config.selectors.display.duration),
                currentTime: utils.getElement.call(this, this.config.selectors.display.currentTime),
            };

            // Seek tooltip
            if (utils.is.htmlElement(this.elements.progress)) {
                this.elements.display.seekTooltip = this.elements.progress.querySelector(
                    `.${this.config.classNames.tooltip}`
                );
            }

            return true;
        } catch (error) {
            // Log it
            this.console.warn('It looks like there is a problem with your custom controls HTML', error);

            // Restore native video controls
            this.toggleNativeControls(true);

            return false;
        }
    },

    // Get the focused element
    getFocusElement() {
        let focused = document.activeElement;

        if (!focused || focused === document.body) {
            focused = null;
        } else {
            focused = document.querySelector(':focus');
        }

        return focused;
    },

    // Trap focus inside container
    trapFocus() {
        const focusable = utils.getElements.call(this, 'button:not(:disabled), input:not(:disabled), [tabindex]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        utils.on(
            this.elements.container,
            'keydown',
            event => {
                // Bail if not tab key or not fullscreen
                if (event.key !== 'Tab' || event.keyCode !== 9 || !this.fullscreen.active) {
                    return;
                }

                // Get the current focused element
                const focused = utils.getFocusElement();

                if (focused === last && !event.shiftKey) {
                    // Move focus to first element that can be tabbed if Shift isn't used
                    first.focus();
                    event.preventDefault();
                } else if (focused === first && event.shiftKey) {
                    // Move focus to last element that can be tabbed if Shift is used
                    last.focus();
                    event.preventDefault();
                }
            },
            false
        );
    },

    // Toggle event listener
    toggleListener(elements, event, callback, toggle, passive, capture) {
        // Bail if no elements
        if (utils.is.nullOrUndefined(elements)) {
            return;
        }

        // If a nodelist is passed, call itself on each node
        if (utils.is.nodeList(elements)) {
            // Create listener for each node
            Array.from(elements).forEach(element => {
                if (element instanceof Node) {
                    utils.toggleListener.call(null, element, event, callback, toggle, passive, capture);
                }
            });

            return;
        }

        // Allow multiple events
        const events = event.split(' ');

        // Build options
        // Default to just capture boolean
        let options = utils.is.boolean(capture) ? capture : false;

        // If passive events listeners are supported
        if (support.passiveListeners) {
            options = {
                // Whether the listener can be passive (i.e. default never prevented)
                passive: utils.is.boolean(passive) ? passive : true,
                // Whether the listener is a capturing listener or not
                capture: utils.is.boolean(capture) ? capture : false,
            };
        }

        // If a single node is passed, bind the event listener
        events.forEach(type => {
            elements[toggle ? 'addEventListener' : 'removeEventListener'](type, callback, options);
        });
    },

    // Bind event handler
    on(element, events, callback, passive, capture) {
        utils.toggleListener(element, events, callback, true, passive, capture);
    },

    // Unbind event handler
    off(element, events, callback, passive, capture) {
        utils.toggleListener(element, events, callback, false, passive, capture);
    },

    // Trigger event
    dispatchEvent(element, type, bubbles, detail) {
        // Bail if no element
        if (!element || !type) {
            return;
        }

        // Create and dispatch the event
        const event = new CustomEvent(type, {
            bubbles: utils.is.boolean(bubbles) ? bubbles : false,
            detail: Object.assign({}, detail, {
                plyr: this instanceof Plyr ? this : null,
            }),
        });

        // Dispatch the event
        element.dispatchEvent(event);
    },

    // Toggle aria-pressed state on a toggle button
    // http://www.ssbbartgroup.com/blog/how-not-to-misuse-aria-states-properties-and-roles
    toggleState(element, input) {
        // Bail if no target
        if (!utils.is.htmlElement(element)) {
            return;
        }

        // Get state
        const state = utils.is.boolean(input) ? input : !element.getAttribute('aria-pressed');

        // Set the attribute on target
        element.setAttribute('aria-pressed', state);
    },

    // Get percentage
    getPercentage(current, max) {
        if (current === 0 || max === 0 || Number.isNaN(current) || Number.isNaN(max)) {
            return 0;
        }
        return (current / max * 100).toFixed(2);
    },

    // Deep extend/merge destination object with N more objects
    // http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
    // Removed call to arguments.callee (used explicit function name instead)
    extend(...objects) {
        const { length } = objects;

        // Bail if nothing to merge
        if (!length) {
            return null;
        }

        // Return first if specified but nothing to merge
        if (length === 1) {
            return objects[0];
        }

        // First object is the destination
        let destination = Array.prototype.shift.call(objects);
        if (!utils.is.object(destination)) {
            destination = {};
        }

        // Loop through all objects to merge
        objects.forEach(source => {
            if (!utils.is.object(source)) {
                return;
            }

            Object.keys(source).forEach(property => {
                if (source[property] && source[property].constructor && source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    utils.extend(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            });
        });

        return destination;
    },

    // Parse YouTube ID from URL
    parseYouTubeId(url) {
        const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        return url.match(regex) ? RegExp.$2 : url;
    },

    // Parse Vimeo ID from URL
    parseVimeoId(url) {
        if (utils.is.number(Number(url))) {
            return url;
        }

        const regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
        return url.match(regex) ? RegExp.$2 : url;
    },

    // Convert object to URL parameters
    buildUrlParameters(input) {
        if (!utils.is.object(input)) {
            return '';
        }

        return Object.keys(input)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(input[key])}`)
            .join('&');
    },

    // Remove HTML from a string
    stripHTML(source) {
        const fragment = document.createDocumentFragment();
        const element = document.createElement('div');
        fragment.appendChild(element);
        element.innerHTML = source;
        return fragment.firstChild.innerText;
    },

    // Get aspect ratio for dimensions
    getAspectRatio(width, height) {
        const getRatio = (w, h) => (h === 0 ? w : getRatio(h, w % h));
        const ratio = getRatio(width, height);
        return `${width / ratio}:${height / ratio}`;
    },

    // Get the transition end event
    transitionEnd: (() => {
        const element = document.createElement('span');

        const events = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend',
        };

        const type = Object.keys(events).find(event => element.style[event] !== undefined);

        return typeof type === 'string' ? type : false;
    })(),
};

export default utils;
