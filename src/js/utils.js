// ==========================================================================
// Plyr utils
// ==========================================================================

import loadjs from 'loadjs';

import support from './support';
import { providers } from './types';

const utils = {
    // Check variable types
    is: {
        plyr(input) {
            return this.instanceof(input, window.Plyr);
        },
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
        weakMap(input) {
            return this.instanceof(input, window.WeakMap);
        },
        nodeList(input) {
            return this.instanceof(input, window.NodeList);
        },
        element(input) {
            return this.instanceof(input, window.Element);
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
            return this.instanceof(input, TextTrack) || (!this.nullOrUndefined(input) && this.string(input.kind));
        },
        url(input) {
            return !this.nullOrUndefined(input) && /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(input);
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

    // Fetch wrapper
    // Using XHR to avoid issues with older browsers
    fetch(url, responseType = 'text') {
        return new Promise((resolve, reject) => {
            try {
                const request = new XMLHttpRequest();

                // Check for CORS support
                if (!('withCredentials' in request)) {
                    return;
                }

                request.addEventListener('load', () => {
                    if (responseType === 'text') {
                        try {
                            resolve(JSON.parse(request.responseText));
                        } catch (e) {
                            resolve(request.responseText);
                        }
                    } else {
                        resolve(request.response);
                    }
                });

                request.addEventListener('error', () => {
                    throw new Error(request.statusText);
                });

                request.open('GET', url, true);

                // Set the required response type
                request.responseType = responseType;

                request.send();
            } catch (e) {
                reject(e);
            }
        });
    },

    // Load an external script
    loadScript(url) {
        return new Promise((resolve, reject) => {
            loadjs(url, {
                success: resolve,
                error: reject,
            });
        });
    },

    // Load an external SVG sprite
    loadSprite(url, id) {
        if (!utils.is.string(url)) {
            return;
        }

        const prefix = 'cache-';
        const hasId = utils.is.string(id);
        let isCached = false;

        const exists = () => document.querySelectorAll(`#${id}`).length;

        function injectSprite(data) {
            // Check again incase of race condition
            if (hasId && exists()) {
                return;
            }

            // Inject content
            this.innerHTML = data;

            // Inject the SVG to the body
            document.body.insertBefore(this, document.body.childNodes[0]);
        }

        // Only load once if ID set
        if (!hasId || !exists()) {
            // Create container
            const container = document.createElement('div');
            utils.toggleHidden(container, true);

            if (hasId) {
                container.setAttribute('id', id);
            }

            // Check in cache
            if (support.storage) {
                const cached = window.localStorage.getItem(prefix + id);
                isCached = cached !== null;

                if (isCached) {
                    const data = JSON.parse(cached);
                    injectSprite.call(container, data.content);
                    return;
                }
            }

            // Get the sprite
            utils
                .fetch(url)
                .then(result => {
                    if (utils.is.empty(result)) {
                        return;
                    }

                    if (support.storage) {
                        window.localStorage.setItem(
                            prefix + id,
                            JSON.stringify({
                                content: result,
                            }),
                        );
                    }

                    injectSprite.call(container, result);
                })
                .catch(() => {});
        }
    },

    // Generate a random ID
    generateId(prefix) {
        return `${prefix}-${Math.floor(Math.random() * 10000)}`;
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
        if (!utils.is.element(element) || !utils.is.element(element.parentNode)) {
            return;
        }

        if (utils.is.nodeList(element) || utils.is.array(element)) {
            Array.from(element).forEach(utils.removeElement);
            return;
        }

        element.parentNode.removeChild(element);
    },

    // Remove all child elements
    emptyElement(element) {
        let { length } = element.childNodes;

        while (length > 0) {
            element.removeChild(element.lastChild);
            length -= 1;
        }
    },

    // Replace element
    replaceElement(newChild, oldChild) {
        if (!utils.is.element(oldChild) || !utils.is.element(oldChild.parentNode) || !utils.is.element(newChild)) {
            return null;
        }

        oldChild.parentNode.replaceChild(newChild, oldChild);

        return newChild;
    },

    // Set attributes
    setAttributes(element, attributes) {
        if (!utils.is.element(element) || utils.is.empty(attributes)) {
            return;
        }

        Object.entries(attributes).forEach(([
            key,
            value,
        ]) => {
            element.setAttribute(key, value);
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

    // Toggle hidden
    toggleHidden(element, hidden) {
        if (!utils.is.element(element)) {
            return;
        }

        let hide = hidden;

        if (!utils.is.boolean(hide)) {
            hide = !element.hasAttribute('hidden');
        }

        if (hide) {
            element.setAttribute('hidden', '');
        } else {
            element.removeAttribute('hidden');
        }
    },

    // Toggle class on an element
    toggleClass(element, className, toggle) {
        if (utils.is.element(element)) {
            const contains = element.classList.contains(className);

            element.classList[toggle ? 'add' : 'remove'](className);

            return (toggle && !contains) || (!toggle && contains);
        }

        return null;
    },

    // Has class name
    hasClass(element, className) {
        return utils.is.element(element) && element.classList.contains(className);
    },

    // Element matches selector
    matches(element, selector) {
        const prototype = { Element };

        function match() {
            return Array.from(document.querySelectorAll(selector)).includes(this);
        }

        const matches = prototype.matches || prototype.webkitMatchesSelector || prototype.mozMatchesSelector || prototype.msMatchesSelector || match;

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
                fastForward: utils.getElement.call(this, this.config.selectors.buttons.fastForward),
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
                currentTime: utils.getElement.call(this, this.config.selectors.display.currentTime),
                duration: utils.getElement.call(this, this.config.selectors.display.duration),
            };

            // Seek tooltip
            if (utils.is.element(this.elements.progress)) {
                this.elements.display.seekTooltip = this.elements.progress.querySelector(`.${this.config.classNames.tooltip}`);
            }

            return true;
        } catch (error) {
            // Log it
            this.debug.warn('It looks like there is a problem with your custom controls HTML', error);

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
    trapFocus(element = null, toggle = false) {
        if (!utils.is.element(element)) {
            return;
        }

        const focusable = utils.getElements.call(this, 'button:not(:disabled), input:not(:disabled), [tabindex]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const trap = event => {
            // Bail if not tab key or not fullscreen
            if (event.key !== 'Tab' || event.keyCode !== 9) {
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
        };

        if (toggle) {
            utils.on(this.elements.container, 'keydown', trap, false);
        } else {
            utils.off(this.elements.container, 'keydown', trap, false);
        }
    },

    // Toggle event listener
    toggleListener(elements, event, callback, toggle = false, passive = true, capture = false) {
        // Bail if no elemetns, event, or callback
        if (utils.is.empty(elements) || utils.is.empty(event) || !utils.is.function(callback)) {
            return;
        }

        // If a nodelist is passed, call itself on each node
        if (utils.is.nodeList(elements) || utils.is.array(elements)) {
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
        // Default to just the capture boolean for browsers with no passive listener support
        let options = capture;

        // If passive events listeners are supported
        if (support.passiveListeners) {
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
    },

    // Bind event handler
    on(element, events = '', callback, passive = true, capture = false) {
        utils.toggleListener(element, events, callback, true, passive, capture);
    },

    // Unbind event handler
    off(element, events = '', callback, passive = true, capture = false) {
        utils.toggleListener(element, events, callback, false, passive, capture);
    },

    // Trigger event
    dispatchEvent(element, type = '', bubbles = false, detail = {}) {
        // Bail if no element
        if (!utils.is.element(element) || utils.is.empty(type)) {
            return;
        }

        // Create and dispatch the event
        const event = new CustomEvent(type, {
            bubbles,
            detail: Object.assign({}, detail, {
                plyr: utils.is.plyr(this) ? this : null,
            }),
        });

        // Dispatch the event
        element.dispatchEvent(event);
    },

    // Toggle aria-pressed state on a toggle button
    // http://www.ssbbartgroup.com/blog/how-not-to-misuse-aria-states-properties-and-roles
    toggleState(element, input) {
        // If multiple elements passed
        if (utils.is.array(element) || utils.is.nodeList(element)) {
            Array.from(element).forEach(target => utils.toggleState(target, input));
            return;
        }

        // Bail if no target
        if (!utils.is.element(element)) {
            return;
        }

        // Get state
        const pressed = element.getAttribute('aria-pressed') === 'true';
        const state = utils.is.boolean(input) ? input : !pressed;

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

    // Time helpers
    getHours(value) {
        return parseInt((value / 60 / 60) % 60, 10);
    },
    getMinutes(value) {
        return parseInt((value / 60) % 60, 10);
    },
    getSeconds(value) {
        return parseInt(value % 60, 10);
    },

    // Format time to UI friendly string
    formatTime(time = 0, displayHours = false, inverted = false) {
        // Bail if the value isn't a number
        if (!utils.is.number(time)) {
            return this.formatTime(null, displayHours, inverted);
        }

        // Format time component to add leading zero
        const format = value => `0${value}`.slice(-2);

        // Breakdown to hours, mins, secs
        let hours = this.getHours(time);
        const mins = this.getMinutes(time);
        const secs = this.getSeconds(time);

        // Do we need to display hours?
        if (displayHours || hours > 0) {
            hours = `${hours}:`;
        } else {
            hours = '';
        }

        // Render
        return `${inverted ? '-' : ''}${hours}${format(mins)}:${format(secs)}`;
    },

    // Replace all occurances of a string in a string
    replaceAll(input = '', find = '', replace = '') {
        return input.replace(new RegExp(find.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'g'), replace.toString());
    },

    // Convert to title case
    toTitleCase(input = '') {
        return input.toString().replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase());
    },

    // Convert string to pascalCase
    toPascalCase(input = '') {
        let string = input.toString();

        // Convert kebab case
        string = utils.replaceAll(string, '-', ' ');

        // Convert snake case
        string = utils.replaceAll(string, '_', ' ');

        // Convert to title case
        string = utils.toTitleCase(string);

        // Convert to pascal case
        return utils.replaceAll(string, ' ', '');
    },

    // Convert string to pascalCase
    toCamelCase(input = '') {
        let string = input.toString();

        // Convert to pascal case
        string = utils.toPascalCase(string);

        // Convert first character to lowercase
        return string.charAt(0).toLowerCase() + string.slice(1);
    },

    // Deep extend destination object with N more objects
    extend(target = {}, ...sources) {
        if (!sources.length) {
            return target;
        }

        const source = sources.shift();

        if (!utils.is.object(source)) {
            return target;
        }

        Object.keys(source).forEach(key => {
            if (utils.is.object(source[key])) {
                if (!Object.keys(target).includes(key)) {
                    Object.assign(target, { [key]: {} });
                }

                utils.extend(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        });

        return utils.extend(target, ...sources);
    },

    // Remove duplicates in an array
    dedupe(array) {
        if (!utils.is.array(array)) {
            return array;
        }

        return array.filter((item, index) => array.indexOf(item) === index);
    },

    // Get the closest value in an array
    closest(array, value) {
        if (!utils.is.array(array) || !array.length) {
            return null;
        }

        return array.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
    },

    // Get the provider for a given URL
    getProviderByUrl(url) {
        // YouTube
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url)) {
            return providers.youtube;
        }

        // Vimeo
        if (/^https?:\/\/player.vimeo.com\/video\/\d{8,}(?=\b|\/)/.test(url)) {
            return providers.vimeo;
        }

        return null;
    },

    // Parse YouTube ID from URL
    parseYouTubeId(url) {
        if (utils.is.empty(url)) {
            return null;
        }

        const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        return url.match(regex) ? RegExp.$2 : url;
    },

    // Parse Vimeo ID from URL
    parseVimeoId(url) {
        if (utils.is.empty(url)) {
            return null;
        }

        if (utils.is.number(Number(url))) {
            return url;
        }

        const regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
        return url.match(regex) ? RegExp.$2 : url;
    },

    // Convert a URL to a location object
    parseUrl(url) {
        const parser = document.createElement('a');
        parser.href = url;
        return parser;
    },

    // Get URL query parameters
    getUrlParams(input) {
        let search = input;

        // Parse URL if needed
        if (input.startsWith('http://') || input.startsWith('https://')) {
            ({ search } = this.parseUrl(input));
        }

        if (this.is.empty(search)) {
            return null;
        }

        const hashes = search.slice(search.indexOf('?') + 1).split('&');

        return hashes.reduce((params, hash) => {
            const [
                key,
                val,
            ] = hash.split('=');

            return Object.assign(params, { [key]: decodeURIComponent(val) });
        }, {});
    },

    // Convert object to URL parameters
    buildUrlParams(input) {
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
    get transitionEndEvent() {
        const element = document.createElement('span');

        const events = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend',
        };

        const type = Object.keys(events).find(event => element.style[event] !== undefined);

        return utils.is.string(type) ? events[type] : false;
    },

    // Force repaint of element
    repaint(element) {
        setTimeout(() => {
            utils.toggleHidden(element, true);
            element.offsetHeight; // eslint-disable-line
            utils.toggleHidden(element, false);
        }, 0);
    },
};

export default utils;
