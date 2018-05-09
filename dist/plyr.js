(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('Plyr', factory) :
	(global.Plyr = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var loadjs_umd = createCommonjsModule(function (module, exports) {
(function(root, factory) {
  if (typeof undefined === 'function' && undefined.amd) {
    undefined([], factory);
  } else {
    module.exports = factory();
  }
}(commonjsGlobal, function() {
/**
 * Global dependencies.
 * @global {Object} document - DOM
 */

var devnull = function() {},
    bundleIdCache = {},
    bundleResultCache = {},
    bundleCallbackQueue = {};


/**
 * Subscribe to bundle load event.
 * @param {string[]} bundleIds - Bundle ids
 * @param {Function} callbackFn - The callback function
 */
function subscribe(bundleIds, callbackFn) {
  // listify
  bundleIds = bundleIds.push ? bundleIds : [bundleIds];

  var depsNotFound = [],
      i = bundleIds.length,
      numWaiting = i,
      fn,
      bundleId,
      r,
      q;

  // define callback function
  fn = function (bundleId, pathsNotFound) {
    if (pathsNotFound.length) depsNotFound.push(bundleId);

    numWaiting--;
    if (!numWaiting) callbackFn(depsNotFound);
  };

  // register callback
  while (i--) {
    bundleId = bundleIds[i];

    // execute callback if in result cache
    r = bundleResultCache[bundleId];
    if (r) {
      fn(bundleId, r);
      continue;
    }

    // add to callback queue
    q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
    q.push(fn);
  }
}


/**
 * Publish bundle load event.
 * @param {string} bundleId - Bundle id
 * @param {string[]} pathsNotFound - List of files not found
 */
function publish(bundleId, pathsNotFound) {
  // exit if id isn't defined
  if (!bundleId) return;

  var q = bundleCallbackQueue[bundleId];

  // cache result
  bundleResultCache[bundleId] = pathsNotFound;

  // exit if queue is empty
  if (!q) return;

  // empty callback queue
  while (q.length) {
    q[0](bundleId, pathsNotFound);
    q.splice(0, 1);
  }
}


/**
 * Execute callbacks.
 * @param {Object or Function} args - The callback args
 * @param {string[]} depsNotFound - List of dependencies not found
 */
function executeCallbacks(args, depsNotFound) {
  // accept function as argument
  if (args.call) args = {success: args};

  // success and error callbacks
  if (depsNotFound.length) (args.error || devnull)(depsNotFound);
  else (args.success || devnull)(args);
}


/**
 * Load individual file.
 * @param {string} path - The file path
 * @param {Function} callbackFn - The callback function
 */
function loadFile(path, callbackFn, args, numTries) {
  var doc = document,
      async = args.async,
      maxTries = (args.numRetries || 0) + 1,
      beforeCallbackFn = args.before || devnull,
      pathStripped = path.replace(/^(css|img)!/, ''),
      isCss,
      e;

  numTries = numTries || 0;

  if (/(^css!|\.css$)/.test(path)) {
    isCss = true;

    // css
    e = doc.createElement('link');
    e.rel = 'stylesheet';
    e.href = pathStripped; //.replace(/^css!/, '');  // remove "css!" prefix
  } else if (/(^img!|\.(png|gif|jpg|svg)$)/.test(path)) {
    // image
    e = doc.createElement('img');
    e.src = pathStripped;    
  } else {
    // javascript
    e = doc.createElement('script');
    e.src = path;
    e.async = async === undefined ? true : async;
  }

  e.onload = e.onerror = e.onbeforeload = function (ev) {
    var result = ev.type[0];

    // Note: The following code isolates IE using `hideFocus` and treats empty
    // stylesheets as failures to get around lack of onerror support
    if (isCss && 'hideFocus' in e) {
      try {
        if (!e.sheet.cssText.length) result = 'e';
      } catch (x) {
        // sheets objects created from load errors don't allow access to
        // `cssText`
        result = 'e';
      }
    }

    // handle retries in case of load failure
    if (result == 'e') {
      // increment counter
      numTries += 1;

      // exit function and try again
      if (numTries < maxTries) {
        return loadFile(path, callbackFn, args, numTries);
      }
    }

    // execute callback
    callbackFn(path, result, ev.defaultPrevented);
  };

  // add to document (unless callback returns `false`)
  if (beforeCallbackFn(path, e) !== false) doc.head.appendChild(e);
}


/**
 * Load multiple files.
 * @param {string[]} paths - The file paths
 * @param {Function} callbackFn - The callback function
 */
function loadFiles(paths, callbackFn, args) {
  // listify paths
  paths = paths.push ? paths : [paths];

  var numWaiting = paths.length,
      x = numWaiting,
      pathsNotFound = [],
      fn,
      i;

  // define callback function
  fn = function(path, result, defaultPrevented) {
    // handle error
    if (result == 'e') pathsNotFound.push(path);

    // handle beforeload event. If defaultPrevented then that means the load
    // will be blocked (ex. Ghostery/ABP on Safari)
    if (result == 'b') {
      if (defaultPrevented) pathsNotFound.push(path);
      else return;
    }

    numWaiting--;
    if (!numWaiting) callbackFn(pathsNotFound);
  };

  // load scripts
  for (i=0; i < x; i++) loadFile(paths[i], fn, args);
}


/**
 * Initiate script load and register bundle.
 * @param {(string|string[])} paths - The file paths
 * @param {(string|Function)} [arg1] - The bundleId or success callback
 * @param {Function} [arg2] - The success or error callback
 * @param {Function} [arg3] - The error callback
 */
function loadjs(paths, arg1, arg2) {
  var bundleId,
      args;

  // bundleId (if string)
  if (arg1 && arg1.trim) bundleId = arg1;

  // args (default is {})
  args = (bundleId ? arg2 : arg1) || {};

  // throw error if bundle is already defined
  if (bundleId) {
    if (bundleId in bundleIdCache) {
      throw "LoadJS";
    } else {
      bundleIdCache[bundleId] = true;
    }
  }

  // load scripts
  loadFiles(paths, function (pathsNotFound) {
    // execute callbacks
    executeCallbacks(args, pathsNotFound);

    // publish bundle load event
    publish(bundleId, pathsNotFound);
  }, args);
}


/**
 * Execute callbacks when dependencies have been satisfied.
 * @param {(string|string[])} deps - List of bundle ids
 * @param {Object} args - success/error arguments
 */
loadjs.ready = function ready(deps, args) {
  // subscribe to bundle load event
  subscribe(deps, function (depsNotFound) {
    // execute callbacks
    executeCallbacks(args, depsNotFound);
  });

  return loadjs;
};


/**
 * Manually satisfy bundle dependencies.
 * @param {string} bundleId - The bundle id
 */
loadjs.done = function done(bundleId) {
  publish(bundleId, []);
};


/**
 * Reset loadjs dependencies statuses
 */
loadjs.reset = function reset() {
  bundleIdCache = {};
  bundleResultCache = {};
  bundleCallbackQueue = {};
};


/**
 * Determine if bundle has already been defined
 * @param String} bundleId - The bundle id
 */
loadjs.isDefined = function isDefined(bundleId) {
  return bundleId in bundleIdCache;
};


// export
return loadjs;

}));
});

// ==========================================================================
// Plyr supported types and providers
// ==========================================================================

var providers = {
    html5: 'html5',
    youtube: 'youtube',
    vimeo: 'vimeo'
};

var types = {
    audio: 'audio',
    video: 'video'
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// ==========================================================================

var utils = {
    // Check variable types
    is: {
        object: function object(input) {
            return this.getConstructor(input) === Object;
        },
        number: function number(input) {
            return this.getConstructor(input) === Number && !Number.isNaN(input);
        },
        string: function string(input) {
            return this.getConstructor(input) === String;
        },
        boolean: function boolean(input) {
            return this.getConstructor(input) === Boolean;
        },
        function: function _function(input) {
            return this.getConstructor(input) === Function;
        },
        array: function array(input) {
            return !this.nullOrUndefined(input) && Array.isArray(input);
        },
        weakMap: function weakMap(input) {
            return this.instanceof(input, WeakMap);
        },
        nodeList: function nodeList(input) {
            return this.instanceof(input, NodeList);
        },
        element: function element(input) {
            return this.instanceof(input, Element);
        },
        textNode: function textNode(input) {
            return this.getConstructor(input) === Text;
        },
        event: function event(input) {
            return this.instanceof(input, Event);
        },
        cue: function cue(input) {
            return this.instanceof(input, TextTrackCue) || this.instanceof(input, VTTCue);
        },
        track: function track(input) {
            return this.instanceof(input, TextTrack) || !this.nullOrUndefined(input) && this.string(input.kind);
        },
        url: function url(input) {
            return !this.nullOrUndefined(input) && /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(input);
        },
        nullOrUndefined: function nullOrUndefined(input) {
            return input === null || typeof input === 'undefined';
        },
        empty: function empty(input) {
            return this.nullOrUndefined(input) || (this.string(input) || this.array(input) || this.nodeList(input)) && !input.length || this.object(input) && !Object.keys(input).length;
        },
        instanceof: function _instanceof$$1(input, constructor) {
            return Boolean(input && constructor && input instanceof constructor);
        },
        getConstructor: function getConstructor(input) {
            return !this.nullOrUndefined(input) ? input.constructor : null;
        }
    },

    // Unfortunately, due to mixed support, UA sniffing is required
    getBrowser: function getBrowser() {
        return {
            isIE: /* @cc_on!@ */false || !!document.documentMode,
            isWebkit: 'WebkitAppearance' in document.documentElement.style && !/Edge/.test(navigator.userAgent),
            isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
            isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform)
        };
    },


    // Fetch wrapper
    // Using XHR to avoid issues with older browsers
    fetch: function fetch(url) {
        var responseType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text';

        return new Promise(function (resolve, reject) {
            try {
                var request = new XMLHttpRequest();

                // Check for CORS support
                if (!('withCredentials' in request)) {
                    return;
                }

                request.addEventListener('load', function () {
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

                request.addEventListener('error', function () {
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
    loadScript: function loadScript(url) {
        return new Promise(function (resolve, reject) {
            loadjs_umd(url, {
                success: resolve,
                error: reject
            });
        });
    },


    // Load an external SVG sprite
    loadSprite: function loadSprite(url, id) {
        if (!utils.is.string(url)) {
            return;
        }

        var prefix = 'cache-';
        var hasId = utils.is.string(id);
        var isCached = false;

        var exists = function exists() {
            return document.querySelectorAll('#' + id).length;
        };

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
            var container = document.createElement('div');
            utils.toggleHidden(container, true);

            if (hasId) {
                container.setAttribute('id', id);
            }

            // Check in cache
            if (support.storage) {
                var cached = window.localStorage.getItem(prefix + id);
                isCached = cached !== null;

                if (isCached) {
                    var data = JSON.parse(cached);
                    injectSprite.call(container, data.content);
                    return;
                }
            }

            // Get the sprite
            utils.fetch(url).then(function (result) {
                if (utils.is.empty(result)) {
                    return;
                }

                if (support.storage) {
                    window.localStorage.setItem(prefix + id, JSON.stringify({
                        content: result
                    }));
                }

                injectSprite.call(container, result);
            }).catch(function () {});
        }
    },


    // Generate a random ID
    generateId: function generateId(prefix) {
        return prefix + '-' + Math.floor(Math.random() * 10000);
    },


    // Wrap an element
    wrap: function wrap(elements, wrapper) {
        // Convert `elements` to an array, if necessary.
        var targets = elements.length ? elements : [elements];

        // Loops backwards to prevent having to clone the wrapper on the
        // first element (see `child` below).
        Array.from(targets).reverse().forEach(function (element, index) {
            var child = index > 0 ? wrapper.cloneNode(true) : wrapper;

            // Cache the current parent and sibling.
            var parent = element.parentNode;
            var sibling = element.nextSibling;

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
    createElement: function createElement(type, attributes, text) {
        // Create a new <element>
        var element = document.createElement(type);

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
    insertAfter: function insertAfter(element, target) {
        target.parentNode.insertBefore(element, target.nextSibling);
    },


    // Insert a DocumentFragment
    insertElement: function insertElement(type, parent, attributes, text) {
        // Inject the new <element>
        parent.appendChild(utils.createElement(type, attributes, text));
    },


    // Remove element(s)
    removeElement: function removeElement(element) {
        if (utils.is.nodeList(element) || utils.is.array(element)) {
            Array.from(element).forEach(utils.removeElement);
            return;
        }

        if (!utils.is.element(element) || !utils.is.element(element.parentNode)) {
            return;
        }

        element.parentNode.removeChild(element);
    },


    // Remove all child elements
    emptyElement: function emptyElement(element) {
        var length = element.childNodes.length;


        while (length > 0) {
            element.removeChild(element.lastChild);
            length -= 1;
        }
    },


    // Replace element
    replaceElement: function replaceElement(newChild, oldChild) {
        if (!utils.is.element(oldChild) || !utils.is.element(oldChild.parentNode) || !utils.is.element(newChild)) {
            return null;
        }

        oldChild.parentNode.replaceChild(newChild, oldChild);

        return newChild;
    },


    // Set attributes
    setAttributes: function setAttributes(element, attributes) {
        if (!utils.is.element(element) || utils.is.empty(attributes)) {
            return;
        }

        Object.entries(attributes).forEach(function (_ref) {
            var _ref2 = slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            element.setAttribute(key, value);
        });
    },


    // Get an attribute object from a string selector
    getAttributesFromSelector: function getAttributesFromSelector(sel, existingAttributes) {
        // For example:
        // '.test' to { class: 'test' }
        // '#test' to { id: 'test' }
        // '[data-test="test"]' to { 'data-test': 'test' }

        if (!utils.is.string(sel) || utils.is.empty(sel)) {
            return {};
        }

        var attributes = {};
        var existing = existingAttributes;

        sel.split(',').forEach(function (s) {
            // Remove whitespace
            var selector = s.trim();
            var className = selector.replace('.', '');
            var stripped = selector.replace(/[[\]]/g, '');

            // Get the parts and value
            var parts = stripped.split('=');
            var key = parts[0];
            var value = parts.length > 1 ? parts[1].replace(/["']/g, '') : '';

            // Get the first character
            var start = selector.charAt(0);

            switch (start) {
                case '.':
                    // Add to existing classname
                    if (utils.is.object(existing) && utils.is.string(existing.class)) {
                        existing.class += ' ' + className;
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
    toggleHidden: function toggleHidden(element, hidden) {
        if (!utils.is.element(element)) {
            return;
        }

        var hide = hidden;

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
    toggleClass: function toggleClass(element, className, toggle) {
        if (utils.is.element(element)) {
            var contains = element.classList.contains(className);

            element.classList[toggle ? 'add' : 'remove'](className);

            return toggle && !contains || !toggle && contains;
        }

        return null;
    },


    // Has class name
    hasClass: function hasClass(element, className) {
        return utils.is.element(element) && element.classList.contains(className);
    },


    // Element matches selector
    matches: function matches(element, selector) {
        var prototype = { Element: Element };

        function match() {
            return Array.from(document.querySelectorAll(selector)).includes(this);
        }

        var matches = prototype.matches || prototype.webkitMatchesSelector || prototype.mozMatchesSelector || prototype.msMatchesSelector || match;

        return matches.call(element, selector);
    },


    // Find all elements
    getElements: function getElements(selector) {
        return this.elements.container.querySelectorAll(selector);
    },


    // Find a single element
    getElement: function getElement(selector) {
        return this.elements.container.querySelector(selector);
    },


    // Get the focused element
    getFocusElement: function getFocusElement() {
        var focused = document.activeElement;

        if (!focused || focused === document.body) {
            focused = null;
        } else {
            focused = document.querySelector(':focus');
        }

        return focused;
    },


    // Trap focus inside container
    trapFocus: function trapFocus() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var toggle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!utils.is.element(element)) {
            return;
        }

        var focusable = utils.getElements.call(this, 'button:not(:disabled), input:not(:disabled), [tabindex]');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        var trap = function trap(event) {
            // Bail if not tab key or not fullscreen
            if (event.key !== 'Tab' || event.keyCode !== 9) {
                return;
            }

            // Get the current focused element
            var focused = utils.getFocusElement();

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
    toggleListener: function toggleListener(elements, event, callback) {
        var toggle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var passive = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
        var capture = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        // Bail if no elemetns, event, or callback
        if (utils.is.empty(elements) || utils.is.empty(event) || !utils.is.function(callback)) {
            return;
        }

        // If a nodelist is passed, call itself on each node
        if (utils.is.nodeList(elements) || utils.is.array(elements)) {
            // Create listener for each node
            Array.from(elements).forEach(function (element) {
                if (element instanceof Node) {
                    utils.toggleListener.call(null, element, event, callback, toggle, passive, capture);
                }
            });

            return;
        }

        // Allow multiple events
        var events = event.split(' ');

        // Build options
        // Default to just the capture boolean for browsers with no passive listener support
        var options = capture;

        // If passive events listeners are supported
        if (support.passiveListeners) {
            options = {
                // Whether the listener can be passive (i.e. default never prevented)
                passive: passive,
                // Whether the listener is a capturing listener or not
                capture: capture
            };
        }

        // If a single node is passed, bind the event listener
        events.forEach(function (type) {
            elements[toggle ? 'addEventListener' : 'removeEventListener'](type, callback, options);
        });
    },


    // Bind event handler
    on: function on(element) {
        var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var callback = arguments[2];
        var passive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

        utils.toggleListener(element, events, callback, true, passive, capture);
    },


    // Unbind event handler
    off: function off(element) {
        var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var callback = arguments[2];
        var passive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

        utils.toggleListener(element, events, callback, false, passive, capture);
    },


    // Trigger event
    dispatchEvent: function dispatchEvent(element) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var detail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        // Bail if no element
        if (!utils.is.element(element) || utils.is.empty(type)) {
            return;
        }

        // Create and dispatch the event
        var event = new CustomEvent(type, {
            bubbles: bubbles,
            detail: Object.assign({}, detail, {
                plyr: this
            })
        });

        // Dispatch the event
        element.dispatchEvent(event);
    },


    // Toggle aria-pressed state on a toggle button
    // http://www.ssbbartgroup.com/blog/how-not-to-misuse-aria-states-properties-and-roles
    toggleState: function toggleState(element, input) {
        // If multiple elements passed
        if (utils.is.array(element) || utils.is.nodeList(element)) {
            Array.from(element).forEach(function (target) {
                return utils.toggleState(target, input);
            });
            return;
        }

        // Bail if no target
        if (!utils.is.element(element)) {
            return;
        }

        // Get state
        var pressed = element.getAttribute('aria-pressed') === 'true';
        var state = utils.is.boolean(input) ? input : !pressed;

        // Set the attribute on target
        element.setAttribute('aria-pressed', state);
    },


    // Format string
    format: function format(input) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        if (utils.is.empty(input)) {
            return input;
        }

        return input.toString().replace(/{(\d+)}/g, function (match, i) {
            return utils.is.string(args[i]) ? args[i] : '';
        });
    },


    // Get percentage
    getPercentage: function getPercentage(current, max) {
        if (current === 0 || max === 0 || Number.isNaN(current) || Number.isNaN(max)) {
            return 0;
        }

        return (current / max * 100).toFixed(2);
    },


    // Time helpers
    getHours: function getHours(value) {
        return parseInt(value / 60 / 60 % 60, 10);
    },
    getMinutes: function getMinutes(value) {
        return parseInt(value / 60 % 60, 10);
    },
    getSeconds: function getSeconds(value) {
        return parseInt(value % 60, 10);
    },


    // Format time to UI friendly string
    formatTime: function formatTime() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var displayHours = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var inverted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        // Bail if the value isn't a number
        if (!utils.is.number(time)) {
            return this.formatTime(null, displayHours, inverted);
        }

        // Format time component to add leading zero
        var format = function format(value) {
            return ('0' + value).slice(-2);
        };

        // Breakdown to hours, mins, secs
        var hours = this.getHours(time);
        var mins = this.getMinutes(time);
        var secs = this.getSeconds(time);

        // Do we need to display hours?
        if (displayHours || hours > 0) {
            hours = hours + ':';
        } else {
            hours = '';
        }

        // Render
        return '' + (inverted ? '-' : '') + hours + format(mins) + ':' + format(secs);
    },


    // Replace all occurances of a string in a string
    replaceAll: function replaceAll() {
        var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var find = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        return input.replace(new RegExp(find.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'g'), replace.toString());
    },


    // Convert to title case
    toTitleCase: function toTitleCase() {
        var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        return input.toString().replace(/\w\S*/g, function (text) {
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        });
    },


    // Convert string to pascalCase
    toPascalCase: function toPascalCase() {
        var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var string = input.toString();

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
    toCamelCase: function toCamelCase() {
        var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var string = input.toString();

        // Convert to pascal case
        string = utils.toPascalCase(string);

        // Convert first character to lowercase
        return string.charAt(0).toLowerCase() + string.slice(1);
    },


    // Deep extend destination object with N more objects
    extend: function extend() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        for (var _len2 = arguments.length, sources = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            sources[_key2 - 1] = arguments[_key2];
        }

        if (!sources.length) {
            return target;
        }

        var source = sources.shift();

        if (!utils.is.object(source)) {
            return target;
        }

        Object.keys(source).forEach(function (key) {
            if (utils.is.object(source[key])) {
                if (!Object.keys(target).includes(key)) {
                    Object.assign(target, defineProperty({}, key, {}));
                }

                utils.extend(target[key], source[key]);
            } else {
                Object.assign(target, defineProperty({}, key, source[key]));
            }
        });

        return utils.extend.apply(utils, [target].concat(toConsumableArray(sources)));
    },


    // Remove duplicates in an array
    dedupe: function dedupe(array) {
        if (!utils.is.array(array)) {
            return array;
        }

        return array.filter(function (item, index) {
            return array.indexOf(item) === index;
        });
    },


    // Get the closest value in an array
    closest: function closest(array, value) {
        if (!utils.is.array(array) || !array.length) {
            return null;
        }

        return array.reduce(function (prev, curr) {
            return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
        });
    },


    // Get the provider for a given URL
    getProviderByUrl: function getProviderByUrl(url) {
        // YouTube
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url)) {
            return providers.youtube;
        }

        // Vimeo
        if (/^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(url)) {
            return providers.vimeo;
        }

        return null;
    },


    // Parse YouTube ID from URL
    parseYouTubeId: function parseYouTubeId(url) {
        if (utils.is.empty(url)) {
            return null;
        }

        var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        return url.match(regex) ? RegExp.$2 : url;
    },


    // Parse Vimeo ID from URL
    parseVimeoId: function parseVimeoId(url) {
        if (utils.is.empty(url)) {
            return null;
        }

        if (utils.is.number(Number(url))) {
            return url;
        }

        var regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
        return url.match(regex) ? RegExp.$2 : url;
    },


    // Convert a URL to a location object
    parseUrl: function parseUrl(url) {
        var parser = document.createElement('a');
        parser.href = url;
        return parser;
    },


    // Get URL query parameters
    getUrlParams: function getUrlParams(input) {
        var search = input;

        // Parse URL if needed
        if (input.startsWith('http://') || input.startsWith('https://')) {
            var _parseUrl = this.parseUrl(input);

            search = _parseUrl.search;
        }

        if (this.is.empty(search)) {
            return null;
        }

        var hashes = search.slice(search.indexOf('?') + 1).split('&');

        return hashes.reduce(function (params, hash) {
            var _hash$split = hash.split('='),
                _hash$split2 = slicedToArray(_hash$split, 2),
                key = _hash$split2[0],
                val = _hash$split2[1];

            return Object.assign(params, defineProperty({}, key, decodeURIComponent(val)));
        }, {});
    },


    // Convert object to URL parameters
    buildUrlParams: function buildUrlParams(input) {
        if (!utils.is.object(input)) {
            return '';
        }

        return Object.keys(input).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(input[key]);
        }).join('&');
    },


    // Remove HTML from a string
    stripHTML: function stripHTML(source) {
        var fragment = document.createDocumentFragment();
        var element = document.createElement('div');
        fragment.appendChild(element);
        element.innerHTML = source;
        return fragment.firstChild.innerText;
    },


    // Get aspect ratio for dimensions
    getAspectRatio: function getAspectRatio(width, height) {
        var getRatio = function getRatio(w, h) {
            return h === 0 ? w : getRatio(h, w % h);
        };
        var ratio = getRatio(width, height);
        return width / ratio + ':' + height / ratio;
    },


    // Get the transition end event
    get transitionEndEvent() {
        var element = document.createElement('span');

        var events = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };

        var type = Object.keys(events).find(function (event) {
            return element.style[event] !== undefined;
        });

        return utils.is.string(type) ? events[type] : false;
    },

    // Force repaint of element
    repaint: function repaint(element) {
        setTimeout(function () {
            utils.toggleHidden(element, true);
            element.offsetHeight; // eslint-disable-line
            utils.toggleHidden(element, false);
        }, 0);
    }
};

// ==========================================================================

// Check for feature support
var support = {
    // Basic support
    audio: 'canPlayType' in document.createElement('audio'),
    video: 'canPlayType' in document.createElement('video'),

    // Check for support
    // Basic functionality vs full UI
    check: function check(type, provider, playsinline) {
        var api = false;
        var ui = false;
        var browser = utils.getBrowser();
        var canPlayInline = browser.isIPhone && playsinline && support.playsinline;

        switch (provider + ':' + type) {
            case 'html5:video':
                api = support.video;
                ui = api && support.rangeInput && (!browser.isIPhone || canPlayInline);
                break;

            case 'html5:audio':
                api = support.audio;
                ui = api && support.rangeInput;
                break;

            case 'youtube:video':
            case 'vimeo:video':
                api = true;
                ui = support.rangeInput && (!browser.isIPhone || canPlayInline);
                break;

            default:
                api = support.audio && support.video;
                ui = api && support.rangeInput;
        }

        return {
            api: api,
            ui: ui
        };
    },


    // Picture-in-picture support
    // Safari only currently
    pip: function () {
        var browser = utils.getBrowser();
        return !browser.isIPhone && utils.is.function(utils.createElement('video').webkitSetPresentationMode);
    }(),

    // Airplay support
    // Safari only currently
    airplay: utils.is.function(window.WebKitPlaybackTargetAvailabilityEvent),

    // Inline playback support
    // https://webkit.org/blog/6784/new-video-policies-for-ios/
    playsinline: 'playsInline' in document.createElement('video'),

    // Check for mime type support against a player instance
    // Credits: http://diveintohtml5.info/everything.html
    // Related: http://www.leanbackplayer.com/test/h5mt.html
    mime: function mime(type) {
        var media = this.media;


        try {
            // Bail if no checking function
            if (!this.isHTML5 || !utils.is.function(media.canPlayType)) {
                return false;
            }

            // Check directly if codecs specified
            if (type.includes('codecs=')) {
                return media.canPlayType(type).replace(/no/, '');
            }

            // Type specific checks
            if (this.isVideo) {
                switch (type) {
                    case 'video/webm':
                        return media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, '');

                    case 'video/mp4':
                        return media.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, '');

                    case 'video/ogg':
                        return media.canPlayType('video/ogg; codecs="theora"').replace(/no/, '');

                    default:
                        return false;
                }
            } else if (this.isAudio) {
                switch (type) {
                    case 'audio/mpeg':
                        return media.canPlayType('audio/mpeg;').replace(/no/, '');

                    case 'audio/ogg':
                        return media.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '');

                    case 'audio/wav':
                        return media.canPlayType('audio/wav; codecs="1"').replace(/no/, '');

                    default:
                        return false;
                }
            }
        } catch (e) {
            return false;
        }

        // If we got this far, we're stuffed
        return false;
    },


    // Check for textTracks support
    textTracks: 'textTracks' in document.createElement('video'),

    // Check for passive event listener support
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    // https://www.youtube.com/watch?v=NPM6172J22g
    passiveListeners: function () {
        // Test via a getter in the options object to see if the passive property is accessed
        var supported = false;
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function get() {
                    supported = true;
                    return null;
                }
            });
            window.addEventListener('test', null, options);
        } catch (e) {
            // Do nothing
        }

        return supported;
    }(),

    // <input type="range"> Sliders
    rangeInput: function () {
        var range = document.createElement('input');
        range.type = 'range';
        return range.type === 'range';
    }(),

    // Touch
    // NOTE: Remember a device can be mouse + touch enabled so we check on first touch event
    touch: 'ontouchstart' in document.documentElement,

    // Detect transitions support
    transitions: utils.transitionEndEvent !== false,

    // Reduced motion iOS & MacOS setting
    // https://webkit.org/blog/7551/responsive-design-for-motion/
    reducedMotion: 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion)').matches
};

// ==========================================================================

var html5 = {
    getSources: function getSources() {
        if (!this.isHTML5) {
            return null;
        }

        return this.media.querySelectorAll('source');
    },


    // Get quality levels
    getQualityOptions: function getQualityOptions() {
        if (!this.isHTML5) {
            return null;
        }

        // Get sources
        var sources = html5.getSources.call(this);

        if (utils.is.empty(sources)) {
            return null;
        }

        // Get <source> with size attribute
        var sizes = Array.from(sources).filter(function (source) {
            return !utils.is.empty(source.getAttribute('size'));
        });

        // If none, bail
        if (utils.is.empty(sizes)) {
            return null;
        }

        // Reduce to unique list
        return utils.dedupe(sizes.map(function (source) {
            return Number(source.getAttribute('size'));
        }));
    },
    extend: function extend() {
        if (!this.isHTML5) {
            return;
        }

        var player = this;

        // Quality
        Object.defineProperty(player.media, 'quality', {
            get: function get() {
                // Get sources
                var sources = html5.getSources.call(player);

                if (utils.is.empty(sources)) {
                    return null;
                }

                var matches = Array.from(sources).filter(function (source) {
                    return source.getAttribute('src') === player.source;
                });

                if (utils.is.empty(matches)) {
                    return null;
                }

                return Number(matches[0].getAttribute('size'));
            },
            set: function set(input) {
                // Get sources
                var sources = html5.getSources.call(player);

                if (utils.is.empty(sources)) {
                    return;
                }

                // Get matches for requested size
                var matches = Array.from(sources).filter(function (source) {
                    return Number(source.getAttribute('size')) === input;
                });

                // No matches for requested size
                if (utils.is.empty(matches)) {
                    return;
                }

                // Get supported sources
                var supported = matches.filter(function (source) {
                    return support.mime.call(player, source.getAttribute('type'));
                });

                // No supported sources
                if (utils.is.empty(supported)) {
                    return;
                }

                // Trigger change event
                utils.dispatchEvent.call(player, player.media, 'qualityrequested', false, {
                    quality: input
                });

                // Get current state
                var currentTime = player.currentTime,
                    playing = player.playing;

                // Set new source

                player.media.src = supported[0].getAttribute('src');

                // Load new source
                player.media.load();

                // Resume playing
                if (playing) {
                    player.play();
                }

                // Restore time
                player.currentTime = currentTime;

                // Trigger change event
                utils.dispatchEvent.call(player, player.media, 'qualitychange', false, {
                    quality: input
                });
            }
        });
    },


    // Cancel current network requests
    // See https://github.com/sampotts/plyr/issues/174
    cancelRequests: function cancelRequests() {
        if (!this.isHTML5) {
            return;
        }

        // Remove child sources
        utils.removeElement(html5.getSources());

        // Set blank video src attribute
        // This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
        // Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection
        this.media.setAttribute('src', this.config.blankVideo);

        // Load the new empty source
        // This will cancel existing requests
        // See https://github.com/sampotts/plyr/issues/174
        this.media.load();

        // Debugging
        this.debug.log('Cancelled network requests');
    }
};

// ==========================================================================

var i18n = {
    get: function get$$1() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (utils.is.empty(key) || utils.is.empty(config) || !Object.keys(config.i18n).includes(key)) {
            return '';
        }

        var string = config.i18n[key];

        var replace = {
            '{seektime}': config.seekTime,
            '{title}': config.title
        };

        Object.entries(replace).forEach(function (_ref) {
            var _ref2 = slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            string = utils.replaceAll(string, key, value);
        });

        return string;
    }
};

// ==========================================================================

// Sniff out the browser
var browser = utils.getBrowser();

var ui = {
    addStyleHook: function addStyleHook() {
        utils.toggleClass(this.elements.container, this.config.selectors.container.replace('.', ''), true);
        utils.toggleClass(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
    },


    // Toggle native HTML5 media controls
    toggleNativeControls: function toggleNativeControls() {
        var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (toggle && this.isHTML5) {
            this.media.setAttribute('controls', '');
        } else {
            this.media.removeAttribute('controls');
        }
    },


    // Setup the UI
    build: function build() {
        var _this = this;

        // Re-attach media element listeners
        // TODO: Use event bubbling?
        this.listeners.media();

        // Don't setup interface if no support
        if (!this.supported.ui) {
            this.debug.warn('Basic support only for ' + this.provider + ' ' + this.type);

            // Restore native controls
            ui.toggleNativeControls.call(this, true);

            // Bail
            return;
        }

        // Inject custom controls if not present
        if (!utils.is.element(this.elements.controls)) {
            // Inject custom controls
            controls.inject.call(this);

            // Re-attach control listeners
            this.listeners.controls();
        }

        // Remove native controls
        ui.toggleNativeControls.call(this);

        // Captions
        captions.setup.call(this);

        // Reset volume
        this.volume = null;

        // Reset mute state
        this.muted = null;

        // Reset speed
        this.speed = null;

        // Reset loop state
        this.loop = null;

        // Reset quality setting
        this.quality = null;

        // Reset volume display
        ui.updateVolume.call(this);

        // Reset time display
        ui.timeUpdate.call(this);

        // Update the UI
        ui.checkPlaying.call(this);

        // Check for picture-in-picture support
        utils.toggleClass(this.elements.container, this.config.classNames.pip.supported, support.pip && this.isHTML5 && this.isVideo);

        // Check for airplay support
        utils.toggleClass(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5);

        // Add iOS class
        utils.toggleClass(this.elements.container, this.config.classNames.isIos, browser.isIos);

        // Add touch class
        utils.toggleClass(this.elements.container, this.config.classNames.isTouch, this.touch);

        // Ready for API calls
        this.ready = true;

        // Ready event at end of execution stack
        setTimeout(function () {
            utils.dispatchEvent.call(_this, _this.media, 'ready');
        }, 0);

        // Set the title
        ui.setTitle.call(this);

        // Set the poster image
        ui.setPoster.call(this);
    },


    // Setup aria attribute for play and iframe title
    setTitle: function setTitle() {
        // Find the current text
        var label = i18n.get('play', this.config);

        // If there's a media title set, use that for the label
        if (utils.is.string(this.config.title) && !utils.is.empty(this.config.title)) {
            label += ', ' + this.config.title;

            // Set container label
            this.elements.container.setAttribute('aria-label', this.config.title);
        }

        // If there's a play button, set label
        if (utils.is.nodeList(this.elements.buttons.play)) {
            Array.from(this.elements.buttons.play).forEach(function (button) {
                button.setAttribute('aria-label', label);
            });
        }

        // Set iframe title
        // https://github.com/sampotts/plyr/issues/124
        if (this.isEmbed) {
            var iframe = utils.getElement.call(this, 'iframe');

            if (!utils.is.element(iframe)) {
                return;
            }

            // Default to media type
            var title = !utils.is.empty(this.config.title) ? this.config.title : 'video';
            var format = i18n.get('frameTitle', this.config);

            iframe.setAttribute('title', format.replace('{title}', title));
        }
    },


    // Set the poster image
    setPoster: function setPoster() {
        if (!utils.is.element(this.elements.poster) || utils.is.empty(this.poster)) {
            return;
        }

        // Set the inline style
        var posters = this.poster.split(',');
        this.elements.poster.style.backgroundImage = posters.map(function (p) {
            return 'url(\'' + p + '\')';
        }).join(',');
    },


    // Check playing state
    checkPlaying: function checkPlaying(event) {
        // Class hooks
        utils.toggleClass(this.elements.container, this.config.classNames.playing, this.playing);
        utils.toggleClass(this.elements.container, this.config.classNames.paused, this.paused);
        utils.toggleClass(this.elements.container, this.config.classNames.stopped, this.stopped);

        // Set ARIA state
        utils.toggleState(this.elements.buttons.play, this.playing);

        // Only update controls on non timeupdate events
        if (utils.is.event(event) && event.type === 'timeupdate') {
            return;
        }

        // Toggle controls
        this.toggleControls(!this.playing);
    },


    // Check if media is loading
    checkLoading: function checkLoading(event) {
        var _this2 = this;

        this.loading = ['stalled', 'waiting'].includes(event.type);

        // Clear timer
        clearTimeout(this.timers.loading);

        // Timer to prevent flicker when seeking
        this.timers.loading = setTimeout(function () {
            // Toggle container class hook
            utils.toggleClass(_this2.elements.container, _this2.config.classNames.loading, _this2.loading);

            // Show controls if loading, hide if done
            _this2.toggleControls(_this2.loading);
        }, this.loading ? 250 : 0);
    },


    // Check if media failed to load
    checkFailed: function checkFailed() {
        var _this3 = this;

        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/networkState
        this.failed = this.media.networkState === 3;

        if (this.failed) {
            utils.toggleClass(this.elements.container, this.config.classNames.loading, false);
            utils.toggleClass(this.elements.container, this.config.classNames.error, true);
        }

        // Clear timer
        clearTimeout(this.timers.failed);

        // Timer to prevent flicker when seeking
        this.timers.loading = setTimeout(function () {
            // Toggle container class hook
            utils.toggleClass(_this3.elements.container, _this3.config.classNames.loading, _this3.loading);

            // Show controls if loading, hide if done
            _this3.toggleControls(_this3.loading);
        }, this.loading ? 250 : 0);
    },


    // Update volume UI and storage
    updateVolume: function updateVolume() {
        if (!this.supported.ui) {
            return;
        }

        // Update range
        if (utils.is.element(this.elements.inputs.volume)) {
            ui.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume);
        }

        // Update mute state
        if (utils.is.element(this.elements.buttons.mute)) {
            utils.toggleState(this.elements.buttons.mute, this.muted || this.volume === 0);
        }
    },


    // Update seek value and lower fill
    setRange: function setRange(target) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (!utils.is.element(target)) {
            return;
        }

        // eslint-disable-next-line
        target.value = value;

        // Webkit range fill
        controls.updateRangeFill.call(this, target);
    },


    // Set <progress> value
    setProgress: function setProgress(target, input) {
        var value = utils.is.number(input) ? input : 0;
        var progress = utils.is.element(target) ? target : this.elements.display.buffer;

        // Update value and label
        if (utils.is.element(progress)) {
            progress.value = value;

            // Update text label inside
            var label = progress.getElementsByTagName('span')[0];
            if (utils.is.element(label)) {
                label.childNodes[0].nodeValue = value;
            }
        }
    },


    // Update <progress> elements
    updateProgress: function updateProgress(event) {
        if (!this.supported.ui || !utils.is.event(event)) {
            return;
        }

        var value = 0;

        if (event) {
            switch (event.type) {
                // Video playing
                case 'timeupdate':
                case 'seeking':
                    value = utils.getPercentage(this.currentTime, this.duration);

                    // Set seek range value only if it's a 'natural' time event
                    if (event.type === 'timeupdate') {
                        ui.setRange.call(this, this.elements.inputs.seek, value);
                    }

                    break;

                // Check buffer status
                case 'playing':
                case 'progress':
                    ui.setProgress.call(this, this.elements.display.buffer, this.buffered * 100);

                    break;

                default:
                    break;
            }
        }
    },


    // Update the displayed time
    updateTimeDisplay: function updateTimeDisplay() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var inverted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        // Bail if there's no element to display or the value isn't a number
        if (!utils.is.element(target) || !utils.is.number(time)) {
            return;
        }

        // Always display hours if duration is over an hour
        var forceHours = utils.getHours(this.duration) > 0;

        // eslint-disable-next-line no-param-reassign
        target.textContent = utils.formatTime(time, forceHours, inverted);
    },


    // Handle time change event
    timeUpdate: function timeUpdate(event) {
        // Only invert if only one time element is displayed and used for both duration and currentTime
        var invert = !utils.is.element(this.elements.display.duration) && this.config.invertTime;

        // Duration
        ui.updateTimeDisplay.call(this, this.elements.display.currentTime, invert ? this.duration - this.currentTime : this.currentTime, invert);

        // Ignore updates while seeking
        if (event && event.type === 'timeupdate' && this.media.seeking) {
            return;
        }

        // Playing progress
        ui.updateProgress.call(this, event);
    },


    // Show the duration on metadataloaded
    durationUpdate: function durationUpdate() {
        if (!this.supported.ui) {
            return;
        }

        // If there's a spot to display duration
        var hasDuration = utils.is.element(this.elements.display.duration);

        // If there's only one time display, display duration there
        if (!hasDuration && this.config.displayDuration && this.paused) {
            ui.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration);
        }

        // If there's a duration element, update content
        if (hasDuration) {
            ui.updateTimeDisplay.call(this, this.elements.display.duration, this.duration);
        }

        // Update the tooltip (if visible)
        controls.updateSeekTooltip.call(this);
    }
};

// ==========================================================================

// Sniff out the browser
var browser$1 = utils.getBrowser();

var controls = {
    // Webkit polyfill for lower fill range
    updateRangeFill: function updateRangeFill(target) {
        // Get range from event if event passed
        var range = utils.is.event(target) ? target.target : target;

        // Needs to be a valid <input type='range'>
        if (!utils.is.element(range) || range.getAttribute('type') !== 'range') {
            return;
        }

        // Set aria value for https://github.com/sampotts/plyr/issues/905
        range.setAttribute('aria-valuenow', range.value);

        // WebKit only
        if (!browser$1.isWebkit) {
            return;
        }

        // Set CSS custom property
        range.style.setProperty('--value', range.value / range.max * 100 + '%');
    },


    // Get icon URL
    getIconUrl: function getIconUrl() {
        var url = new URL(this.config.iconUrl, window.location);
        var cors = url.host !== window.location.host || browser$1.isIE && !window.svg4everybody;

        return {
            url: this.config.iconUrl,
            cors: cors
        };
    },


    // Find the UI controls and store references in custom controls
    // TODO: Allow settings menus with custom controls
    findElements: function findElements() {
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
                fullscreen: utils.getElement.call(this, this.config.selectors.buttons.fullscreen)
            };

            // Progress
            this.elements.progress = utils.getElement.call(this, this.config.selectors.progress);

            // Inputs
            this.elements.inputs = {
                seek: utils.getElement.call(this, this.config.selectors.inputs.seek),
                volume: utils.getElement.call(this, this.config.selectors.inputs.volume)
            };

            // Display
            this.elements.display = {
                buffer: utils.getElement.call(this, this.config.selectors.display.buffer),
                currentTime: utils.getElement.call(this, this.config.selectors.display.currentTime),
                duration: utils.getElement.call(this, this.config.selectors.display.duration)
            };

            // Seek tooltip
            if (utils.is.element(this.elements.progress)) {
                this.elements.display.seekTooltip = this.elements.progress.querySelector('.' + this.config.classNames.tooltip);
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


    // Create <svg> icon
    createIcon: function createIcon(type, attributes) {
        var namespace = 'http://www.w3.org/2000/svg';
        var iconUrl = controls.getIconUrl.call(this);
        var iconPath = (!iconUrl.cors ? iconUrl.url : '') + '#' + this.config.iconPrefix;

        // Create <svg>
        var icon = document.createElementNS(namespace, 'svg');
        utils.setAttributes(icon, utils.extend(attributes, {
            role: 'presentation',
            focusable: 'false'
        }));

        // Create the <use> to reference sprite
        var use = document.createElementNS(namespace, 'use');
        var path = iconPath + '-' + type;

        // Set `href` attributes
        // https://github.com/sampotts/plyr/issues/460
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:href
        if ('href' in use) {
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', path);
        } else {
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path);
        }

        // Add <use> to <svg>
        icon.appendChild(use);

        return icon;
    },


    // Create hidden text label
    createLabel: function createLabel(type, attr) {
        var text = i18n.get(type, this.config);
        var attributes = Object.assign({}, attr);

        switch (type) {
            case 'pip':
                text = 'PIP';
                break;

            case 'airplay':
                text = 'AirPlay';
                break;

            default:
                break;
        }

        if ('class' in attributes) {
            attributes.class += ' ' + this.config.classNames.hidden;
        } else {
            attributes.class = this.config.classNames.hidden;
        }

        return utils.createElement('span', attributes, text);
    },


    // Create a badge
    createBadge: function createBadge(text) {
        if (utils.is.empty(text)) {
            return null;
        }

        var badge = utils.createElement('span', {
            class: this.config.classNames.menu.value
        });

        badge.appendChild(utils.createElement('span', {
            class: this.config.classNames.menu.badge
        }, text));

        return badge;
    },


    // Create a <button>
    createButton: function createButton(buttonType, attr) {
        var button = utils.createElement('button');
        var attributes = Object.assign({}, attr);
        var type = utils.toCamelCase(buttonType);

        var toggle = false;
        var label = void 0;
        var icon = void 0;
        var labelPressed = void 0;
        var iconPressed = void 0;

        if (!('type' in attributes)) {
            attributes.type = 'button';
        }

        if ('class' in attributes) {
            if (attributes.class.includes(this.config.classNames.control)) {
                attributes.class += ' ' + this.config.classNames.control;
            }
        } else {
            attributes.class = this.config.classNames.control;
        }

        // Large play button
        switch (buttonType) {
            case 'play':
                toggle = true;
                label = 'play';
                labelPressed = 'pause';
                icon = 'play';
                iconPressed = 'pause';
                break;

            case 'mute':
                toggle = true;
                label = 'mute';
                labelPressed = 'unmute';
                icon = 'volume';
                iconPressed = 'muted';
                break;

            case 'captions':
                toggle = true;
                label = 'enableCaptions';
                labelPressed = 'disableCaptions';
                icon = 'captions-off';
                iconPressed = 'captions-on';
                break;

            case 'fullscreen':
                toggle = true;
                label = 'enterFullscreen';
                labelPressed = 'exitFullscreen';
                icon = 'enter-fullscreen';
                iconPressed = 'exit-fullscreen';
                break;

            case 'play-large':
                attributes.class += ' ' + this.config.classNames.control + '--overlaid';
                type = 'play';
                label = 'play';
                icon = 'play';
                break;

            default:
                label = type;
                icon = buttonType;
        }

        // Setup toggle icon and labels
        if (toggle) {
            // Icon
            button.appendChild(controls.createIcon.call(this, iconPressed, { class: 'icon--pressed' }));
            button.appendChild(controls.createIcon.call(this, icon, { class: 'icon--not-pressed' }));

            // Label/Tooltip
            button.appendChild(controls.createLabel.call(this, labelPressed, { class: 'label--pressed' }));
            button.appendChild(controls.createLabel.call(this, label, { class: 'label--not-pressed' }));

            // Add aria attributes
            attributes['aria-pressed'] = false;
        } else {
            button.appendChild(controls.createIcon.call(this, icon));
            button.appendChild(controls.createLabel.call(this, label));
        }

        // Merge attributes
        utils.extend(attributes, utils.getAttributesFromSelector(this.config.selectors.buttons[type], attributes));

        utils.setAttributes(button, attributes);

        // We have multiple play buttons
        if (type === 'play') {
            if (!utils.is.array(this.elements.buttons[type])) {
                this.elements.buttons[type] = [];
            }

            this.elements.buttons[type].push(button);
        } else {
            this.elements.buttons[type] = button;
        }

        return button;
    },


    // Create an <input type='range'>
    createRange: function createRange(type, attributes) {
        // Seek label
        var label = utils.createElement('label', {
            for: attributes.id,
            id: attributes.id + '-label',
            class: this.config.classNames.hidden
        }, i18n.get(type, this.config));

        // Seek input
        var input = utils.createElement('input', utils.extend(utils.getAttributesFromSelector(this.config.selectors.inputs[type]), {
            type: 'range',
            min: 0,
            max: 100,
            step: 0.01,
            value: 0,
            autocomplete: 'off',
            // A11y fixes for https://github.com/sampotts/plyr/issues/905
            role: 'slider',
            'aria-labelledby': attributes.id + '-label',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': 0
        }, attributes));

        this.elements.inputs[type] = input;

        // Set the fill for webkit now
        controls.updateRangeFill.call(this, input);

        return {
            label: label,
            input: input
        };
    },


    // Create a <progress>
    createProgress: function createProgress(type, attributes) {
        var progress = utils.createElement('progress', utils.extend(utils.getAttributesFromSelector(this.config.selectors.display[type]), {
            min: 0,
            max: 100,
            value: 0,
            role: 'presentation',
            'aria-hidden': true
        }, attributes));

        // Create the label inside
        if (type !== 'volume') {
            progress.appendChild(utils.createElement('span', null, '0'));

            var suffix = '';
            switch (type) {
                case 'played':
                    suffix = i18n.get('played', this.config);
                    break;

                case 'buffer':
                    suffix = i18n.get('buffered', this.config);
                    break;

                default:
                    break;
            }

            progress.textContent = '% ' + suffix.toLowerCase();
        }

        this.elements.display[type] = progress;

        return progress;
    },


    // Create time display
    createTime: function createTime(type) {
        var attributes = utils.getAttributesFromSelector(this.config.selectors.display[type]);

        var container = utils.createElement('div', utils.extend(attributes, {
            class: 'plyr__time ' + attributes.class,
            'aria-label': i18n.get(type, this.config)
        }), '00:00');

        // Reference for updates
        this.elements.display[type] = container;

        return container;
    },


    // Create a settings menu item
    createMenuItem: function createMenuItem(value, list, type, title) {
        var badge = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        var checked = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        var item = utils.createElement('li');

        var label = utils.createElement('label', {
            class: this.config.classNames.control
        });

        var radio = utils.createElement('input', utils.extend(utils.getAttributesFromSelector(this.config.selectors.inputs[type]), {
            type: 'radio',
            name: 'plyr-' + type,
            value: value,
            checked: checked,
            class: 'plyr__sr-only'
        }));

        var faux = utils.createElement('span', { hidden: '' });

        label.appendChild(radio);
        label.appendChild(faux);
        label.insertAdjacentHTML('beforeend', title);

        if (utils.is.element(badge)) {
            label.appendChild(badge);
        }

        item.appendChild(label);
        list.appendChild(item);
    },


    // Update hover tooltip for seeking
    updateSeekTooltip: function updateSeekTooltip(event) {
        var _this = this;

        // Bail if setting not true
        if (!this.config.tooltips.seek || !utils.is.element(this.elements.inputs.seek) || !utils.is.element(this.elements.display.seekTooltip) || this.duration === 0) {
            return;
        }

        // Calculate percentage
        var percent = 0;
        var clientRect = this.elements.inputs.seek.getBoundingClientRect();
        var visible = this.config.classNames.tooltip + '--visible';

        var toggle = function toggle(_toggle) {
            utils.toggleClass(_this.elements.display.seekTooltip, visible, _toggle);
        };

        // Hide on touch
        if (this.touch) {
            toggle(false);
            return;
        }

        // Determine percentage, if already visible
        if (utils.is.event(event)) {
            percent = 100 / clientRect.width * (event.pageX - clientRect.left);
        } else if (utils.hasClass(this.elements.display.seekTooltip, visible)) {
            percent = parseFloat(this.elements.display.seekTooltip.style.left, 10);
        } else {
            return;
        }

        // Set bounds
        if (percent < 0) {
            percent = 0;
        } else if (percent > 100) {
            percent = 100;
        }

        // Display the time a click would seek to
        ui.updateTimeDisplay.call(this, this.elements.display.seekTooltip, this.duration / 100 * percent);

        // Set position
        this.elements.display.seekTooltip.style.left = percent + '%';

        // Show/hide the tooltip
        // If the event is a moues in/out and percentage is inside bounds
        if (utils.is.event(event) && ['mouseenter', 'mouseleave'].includes(event.type)) {
            toggle(event.type === 'mouseenter');
        }
    },


    // Hide/show a tab
    toggleTab: function toggleTab(setting, toggle) {
        utils.toggleHidden(this.elements.settings.tabs[setting], !toggle);
    },


    // Set the quality menu
    // TODO: Vimeo support
    setQualityMenu: function setQualityMenu(options) {
        var _this2 = this;

        // Menu required
        if (!utils.is.element(this.elements.settings.panes.quality)) {
            return;
        }

        var type = 'quality';
        var list = this.elements.settings.panes.quality.querySelector('ul');

        // Set options if passed and filter based on config
        if (utils.is.array(options)) {
            this.options.quality = options.filter(function (quality) {
                return _this2.config.quality.options.includes(quality);
            });
        }

        // Toggle the pane and tab
        var toggle = !utils.is.empty(this.options.quality) && this.options.quality.length > 1;
        controls.toggleTab.call(this, type, toggle);

        // Check if we need to toggle the parent
        controls.checkMenu.call(this);

        // If we're hiding, nothing more to do
        if (!toggle) {
            return;
        }

        // Empty the menu
        utils.emptyElement(list);

        // Get the badge HTML for HD, 4K etc
        var getBadge = function getBadge(quality) {
            var label = '';

            switch (quality) {
                case 2160:
                    label = '4K';
                    break;

                case 1440:
                case 1080:
                case 720:
                    label = 'HD';
                    break;

                case 576:
                case 480:
                    label = 'SD';
                    break;

                default:
                    break;
            }

            if (!label.length) {
                return null;
            }

            return controls.createBadge.call(_this2, label);
        };

        // Sort options by the config and then render options
        this.options.quality.sort(function (a, b) {
            var sorting = _this2.config.quality.options;
            return sorting.indexOf(a) > sorting.indexOf(b) ? 1 : -1;
        }).forEach(function (quality) {
            var label = controls.getLabel.call(_this2, 'quality', quality);
            controls.createMenuItem.call(_this2, quality, list, type, label, getBadge(quality));
        });

        controls.updateSetting.call(this, type, list);
    },


    // Translate a value into a nice label
    // TODO: Localisation
    getLabel: function getLabel(setting, value) {
        switch (setting) {
            case 'speed':
                return value === 1 ? i18n.get('normal', this.config) : value + '&times;';

            case 'quality':
                if (utils.is.number(value)) {
                    return value + 'p';
                }

                return utils.toTitleCase(value);

            case 'captions':
                return captions.getLabel.call(this);

            default:
                return null;
        }
    },


    // Update the selected setting
    updateSetting: function updateSetting(setting, container, input) {
        var pane = this.elements.settings.panes[setting];
        var value = null;
        var list = container;

        switch (setting) {
            case 'captions':
                if (this.captions.active) {
                    if (this.options.captions.length > 2 || !this.options.captions.some(function (lang) {
                        return lang === 'enabled';
                    })) {
                        value = this.captions.language;
                    } else {
                        value = 'enabled';
                    }
                } else {
                    value = '';
                }

                break;

            default:
                value = !utils.is.empty(input) ? input : this[setting];

                // Get default
                if (utils.is.empty(value)) {
                    value = this.config[setting].default;
                }

                // Unsupported value
                if (!utils.is.empty(this.options[setting]) && !this.options[setting].includes(value)) {
                    this.debug.warn('Unsupported value of \'' + value + '\' for ' + setting);
                    return;
                }

                // Disabled value
                if (!this.config[setting].options.includes(value)) {
                    this.debug.warn('Disabled value of \'' + value + '\' for ' + setting);
                    return;
                }

                break;
        }

        // Get the list if we need to
        if (!utils.is.element(list)) {
            list = pane && pane.querySelector('ul');
        }

        // If there's no list it means it's not been rendered...
        if (!utils.is.element(list)) {
            return;
        }

        // Update the label
        var label = this.elements.settings.tabs[setting].querySelector('.' + this.config.classNames.menu.value);
        label.innerHTML = controls.getLabel.call(this, setting, value);

        // Find the radio option and check it
        var target = list && list.querySelector('input[value="' + value + '"]');

        if (utils.is.element(target)) {
            target.checked = true;
        }
    },


    // Set the looping options
    /* setLoopMenu() {
        // Menu required
        if (!utils.is.element(this.elements.settings.panes.loop)) {
            return;
        }
         const options = ['start', 'end', 'all', 'reset'];
        const list = this.elements.settings.panes.loop.querySelector('ul');
         // Show the pane and tab
        utils.toggleHidden(this.elements.settings.tabs.loop, false);
        utils.toggleHidden(this.elements.settings.panes.loop, false);
         // Toggle the pane and tab
        const toggle = !utils.is.empty(this.loop.options);
        controls.toggleTab.call(this, 'loop', toggle);
         // Empty the menu
        utils.emptyElement(list);
         options.forEach(option => {
            const item = utils.createElement('li');
             const button = utils.createElement(
                'button',
                utils.extend(utils.getAttributesFromSelector(this.config.selectors.buttons.loop), {
                    type: 'button',
                    class: this.config.classNames.control,
                    'data-plyr-loop-action': option,
                }),
                i18n.get(option, this.config)
            );
             if (['start', 'end'].includes(option)) {
                const badge = controls.createBadge.call(this, '00:00');
                button.appendChild(badge);
            }
             item.appendChild(button);
            list.appendChild(item);
        });
    }, */

    // Get current selected caption language
    // TODO: rework this to user the getter in the API?

    // Set a list of available captions languages
    setCaptionsMenu: function setCaptionsMenu() {
        var _this3 = this;

        // TODO: Captions or language? Currently it's mixed
        var type = 'captions';
        var list = this.elements.settings.panes.captions.querySelector('ul');

        // Toggle the pane and tab
        var toggle = captions.getTracks.call(this).length;
        controls.toggleTab.call(this, type, toggle);

        // Empty the menu
        utils.emptyElement(list);

        // Check if we need to toggle the parent
        controls.checkMenu.call(this);

        // If there's no captions, bail
        if (!toggle) {
            return;
        }

        // Re-map the tracks into just the data we need
        var tracks = captions.getTracks.call(this).map(function (track) {
            return {
                language: !utils.is.empty(track.language) ? track.language : 'enabled',
                label: captions.getLabel.call(_this3, track)
            };
        });

        // Add the "Disabled" option to turn off captions
        tracks.unshift({
            language: '',
            label: i18n.get('disabled', this.config)
        });

        // Generate options
        tracks.forEach(function (track) {
            controls.createMenuItem.call(_this3, track.language, list, 'language', track.label, track.language !== 'enabled' ? controls.createBadge.call(_this3, track.language.toUpperCase()) : null, track.language.toLowerCase() === _this3.captions.language.toLowerCase());
        });

        // Store reference
        this.options.captions = tracks.map(function (track) {
            return track.language;
        });

        controls.updateSetting.call(this, type, list);
    },


    // Set a list of available captions languages
    setSpeedMenu: function setSpeedMenu(options) {
        var _this4 = this;

        // Do nothing if not selected
        if (!this.config.controls.includes('settings') || !this.config.settings.includes('speed')) {
            return;
        }

        // Menu required
        if (!utils.is.element(this.elements.settings.panes.speed)) {
            return;
        }

        var type = 'speed';

        // Set the speed options
        if (utils.is.array(options)) {
            this.options.speed = options;
        } else if (this.isHTML5 || this.isVimeo) {
            this.options.speed = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        }

        // Set options if passed and filter based on config
        this.options.speed = this.options.speed.filter(function (speed) {
            return _this4.config.speed.options.includes(speed);
        });

        // Toggle the pane and tab
        var toggle = !utils.is.empty(this.options.speed) && this.options.speed.length > 1;
        controls.toggleTab.call(this, type, toggle);

        // Check if we need to toggle the parent
        controls.checkMenu.call(this);

        // If we're hiding, nothing more to do
        if (!toggle) {
            return;
        }

        // Get the list to populate
        var list = this.elements.settings.panes.speed.querySelector('ul');

        // Empty the menu
        utils.emptyElement(list);

        // Create items
        this.options.speed.forEach(function (speed) {
            var label = controls.getLabel.call(_this4, 'speed', speed);
            controls.createMenuItem.call(_this4, speed, list, type, label);
        });

        controls.updateSetting.call(this, type, list);
    },


    // Check if we need to hide/show the settings menu
    checkMenu: function checkMenu() {
        var tabs = this.elements.settings.tabs;

        var visible = !utils.is.empty(tabs) && Object.values(tabs).some(function (tab) {
            return !tab.hidden;
        });

        utils.toggleHidden(this.elements.settings.menu, !visible);
    },


    // Show/hide menu
    toggleMenu: function toggleMenu(event) {
        var form = this.elements.settings.form;

        var button = this.elements.buttons.settings;

        // Menu and button are required
        if (!utils.is.element(form) || !utils.is.element(button)) {
            return;
        }

        var show = utils.is.boolean(event) ? event : utils.is.element(form) && form.hasAttribute('hidden');

        if (utils.is.event(event)) {
            var isMenuItem = utils.is.element(form) && form.contains(event.target);
            var isButton = event.target === this.elements.buttons.settings;

            // If the click was inside the form or if the click
            // wasn't the button or menu item and we're trying to
            // show the menu (a doc click shouldn't show the menu)
            if (isMenuItem || !isMenuItem && !isButton && show) {
                return;
            }

            // Prevent the toggle being caught by the doc listener
            if (isButton) {
                event.stopPropagation();
            }
        }

        // Set form and button attributes
        if (utils.is.element(button)) {
            button.setAttribute('aria-expanded', show);
        }

        if (utils.is.element(form)) {
            utils.toggleHidden(form, !show);
            utils.toggleClass(this.elements.container, this.config.classNames.menu.open, show);

            if (show) {
                form.removeAttribute('tabindex');
            } else {
                form.setAttribute('tabindex', -1);
            }
        }
    },


    // Get the natural size of a tab
    getTabSize: function getTabSize(tab) {
        var clone = tab.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.opacity = 0;
        clone.removeAttribute('hidden');

        // Prevent input's being unchecked due to the name being identical
        Array.from(clone.querySelectorAll('input[name]')).forEach(function (input) {
            var name = input.getAttribute('name');
            input.setAttribute('name', name + '-clone');
        });

        // Append to parent so we get the "real" size
        tab.parentNode.appendChild(clone);

        // Get the sizes before we remove
        var width = clone.scrollWidth;
        var height = clone.scrollHeight;

        // Remove from the DOM
        utils.removeElement(clone);

        return {
            width: width,
            height: height
        };
    },


    // Toggle Menu
    showTab: function showTab() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var menu = this.elements.settings.menu;

        var pane = document.getElementById(target);

        // Nothing to show, bail
        if (!utils.is.element(pane)) {
            return;
        }

        // Are we targetting a tab? If not, bail
        var isTab = pane.getAttribute('role') === 'tabpanel';
        if (!isTab) {
            return;
        }

        // Hide all other tabs
        // Get other tabs
        var current = menu.querySelector('[role="tabpanel"]:not([hidden])');
        var container = current.parentNode;

        // Set other toggles to be expanded false
        Array.from(menu.querySelectorAll('[aria-controls="' + current.getAttribute('id') + '"]')).forEach(function (toggle) {
            toggle.setAttribute('aria-expanded', false);
        });

        // If we can do fancy animations, we'll animate the height/width
        if (support.transitions && !support.reducedMotion) {
            // Set the current width as a base
            container.style.width = current.scrollWidth + 'px';
            container.style.height = current.scrollHeight + 'px';

            // Get potential sizes
            var size = controls.getTabSize.call(this, pane);

            // Restore auto height/width
            var restore = function restore(e) {
                // We're only bothered about height and width on the container
                if (e.target !== container || !['width', 'height'].includes(e.propertyName)) {
                    return;
                }

                // Revert back to auto
                container.style.width = '';
                container.style.height = '';

                // Only listen once
                utils.off(container, utils.transitionEndEvent, restore);
            };

            // Listen for the transition finishing and restore auto height/width
            utils.on(container, utils.transitionEndEvent, restore);

            // Set dimensions to target
            container.style.width = size.width + 'px';
            container.style.height = size.height + 'px';
        }

        // Set attributes on current tab
        utils.toggleHidden(current, true);
        current.setAttribute('tabindex', -1);

        // Set attributes on target
        utils.toggleHidden(pane, false);

        var tabs = utils.getElements.call(this, '[aria-controls="' + target + '"]');
        Array.from(tabs).forEach(function (tab) {
            tab.setAttribute('aria-expanded', true);
        });
        pane.removeAttribute('tabindex');

        // Focus the first item
        pane.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex]')[0].focus();
    },


    // Build the default HTML
    // TODO: Set order based on order in the config.controls array?
    create: function create(data) {
        var _this5 = this;

        // Do nothing if we want no controls
        if (utils.is.empty(this.config.controls)) {
            return null;
        }

        // Create the container
        var container = utils.createElement('div', utils.getAttributesFromSelector(this.config.selectors.controls.wrapper));

        // Restart button
        if (this.config.controls.includes('restart')) {
            container.appendChild(controls.createButton.call(this, 'restart'));
        }

        // Rewind button
        if (this.config.controls.includes('rewind')) {
            container.appendChild(controls.createButton.call(this, 'rewind'));
        }

        // Play/Pause button
        if (this.config.controls.includes('play')) {
            container.appendChild(controls.createButton.call(this, 'play'));
        }

        // Fast forward button
        if (this.config.controls.includes('fast-forward')) {
            container.appendChild(controls.createButton.call(this, 'fast-forward'));
        }

        // Progress
        if (this.config.controls.includes('progress')) {
            var progress = utils.createElement('div', utils.getAttributesFromSelector(this.config.selectors.progress));

            // Seek range slider
            var seek = controls.createRange.call(this, 'seek', {
                id: 'plyr-seek-' + data.id
            });
            progress.appendChild(seek.label);
            progress.appendChild(seek.input);

            // Buffer progress
            progress.appendChild(controls.createProgress.call(this, 'buffer'));

            // TODO: Add loop display indicator

            // Seek tooltip
            if (this.config.tooltips.seek) {
                var tooltip = utils.createElement('span', {
                    role: 'tooltip',
                    class: this.config.classNames.tooltip
                }, '00:00');

                progress.appendChild(tooltip);
                this.elements.display.seekTooltip = tooltip;
            }

            this.elements.progress = progress;
            container.appendChild(this.elements.progress);
        }

        // Media current time display
        if (this.config.controls.includes('current-time')) {
            container.appendChild(controls.createTime.call(this, 'currentTime'));
        }

        // Media duration display
        if (this.config.controls.includes('duration')) {
            container.appendChild(controls.createTime.call(this, 'duration'));
        }

        // Toggle mute button
        if (this.config.controls.includes('mute')) {
            container.appendChild(controls.createButton.call(this, 'mute'));
        }

        // Volume range control
        if (this.config.controls.includes('volume')) {
            var volume = utils.createElement('div', {
                class: 'plyr__volume'
            });

            // Set the attributes
            var attributes = {
                max: 1,
                step: 0.05,
                value: this.config.volume
            };

            // Create the volume range slider
            var range = controls.createRange.call(this, 'volume', utils.extend(attributes, {
                id: 'plyr-volume-' + data.id
            }));
            volume.appendChild(range.label);
            volume.appendChild(range.input);

            this.elements.volume = volume;

            container.appendChild(volume);
        }

        // Toggle captions button
        if (this.config.controls.includes('captions')) {
            container.appendChild(controls.createButton.call(this, 'captions'));
        }

        // Settings button / menu
        if (this.config.controls.includes('settings') && !utils.is.empty(this.config.settings)) {
            var menu = utils.createElement('div', {
                class: 'plyr__menu',
                hidden: ''
            });

            menu.appendChild(controls.createButton.call(this, 'settings', {
                id: 'plyr-settings-toggle-' + data.id,
                'aria-haspopup': true,
                'aria-controls': 'plyr-settings-' + data.id,
                'aria-expanded': false
            }));

            var form = utils.createElement('form', {
                class: 'plyr__menu__container',
                id: 'plyr-settings-' + data.id,
                hidden: '',
                'aria-labelled-by': 'plyr-settings-toggle-' + data.id,
                role: 'tablist',
                tabindex: -1
            });

            var inner = utils.createElement('div');

            var home = utils.createElement('div', {
                id: 'plyr-settings-' + data.id + '-home',
                'aria-labelled-by': 'plyr-settings-toggle-' + data.id,
                role: 'tabpanel'
            });

            // Create the tab list
            var tabs = utils.createElement('ul', {
                role: 'tablist'
            });

            // Build the tabs
            this.config.settings.forEach(function (type) {
                var tab = utils.createElement('li', {
                    role: 'tab',
                    hidden: ''
                });

                var button = utils.createElement('button', utils.extend(utils.getAttributesFromSelector(_this5.config.selectors.buttons.settings), {
                    type: 'button',
                    class: _this5.config.classNames.control + ' ' + _this5.config.classNames.control + '--forward',
                    id: 'plyr-settings-' + data.id + '-' + type + '-tab',
                    'aria-haspopup': true,
                    'aria-controls': 'plyr-settings-' + data.id + '-' + type,
                    'aria-expanded': false
                }), i18n.get(type, _this5.config));

                var value = utils.createElement('span', {
                    class: _this5.config.classNames.menu.value
                });

                // Speed contains HTML entities
                value.innerHTML = data[type];

                button.appendChild(value);
                tab.appendChild(button);
                tabs.appendChild(tab);

                _this5.elements.settings.tabs[type] = tab;
            });

            home.appendChild(tabs);
            inner.appendChild(home);

            // Build the panes
            this.config.settings.forEach(function (type) {
                var pane = utils.createElement('div', {
                    id: 'plyr-settings-' + data.id + '-' + type,
                    hidden: '',
                    'aria-labelled-by': 'plyr-settings-' + data.id + '-' + type + '-tab',
                    role: 'tabpanel',
                    tabindex: -1
                });

                var back = utils.createElement('button', {
                    type: 'button',
                    class: _this5.config.classNames.control + ' ' + _this5.config.classNames.control + '--back',
                    'aria-haspopup': true,
                    'aria-controls': 'plyr-settings-' + data.id + '-home',
                    'aria-expanded': false
                }, i18n.get(type, _this5.config));

                pane.appendChild(back);

                var options = utils.createElement('ul');

                pane.appendChild(options);
                inner.appendChild(pane);

                _this5.elements.settings.panes[type] = pane;
            });

            form.appendChild(inner);
            menu.appendChild(form);
            container.appendChild(menu);

            this.elements.settings.form = form;
            this.elements.settings.menu = menu;
        }

        // Picture in picture button
        if (this.config.controls.includes('pip') && support.pip) {
            container.appendChild(controls.createButton.call(this, 'pip'));
        }

        // Airplay button
        if (this.config.controls.includes('airplay') && support.airplay) {
            container.appendChild(controls.createButton.call(this, 'airplay'));
        }

        // Toggle fullscreen button
        if (this.config.controls.includes('fullscreen')) {
            container.appendChild(controls.createButton.call(this, 'fullscreen'));
        }

        // Larger overlaid play button
        if (this.config.controls.includes('play-large')) {
            this.elements.container.appendChild(controls.createButton.call(this, 'play-large'));
        }

        this.elements.controls = container;

        if (this.isHTML5) {
            controls.setQualityMenu.call(this, html5.getQualityOptions.call(this));
        }

        controls.setSpeedMenu.call(this);

        return container;
    },


    // Insert controls
    inject: function inject() {
        var _this6 = this;

        // Sprite
        if (this.config.loadSprite) {
            var icon = controls.getIconUrl.call(this);

            // Only load external sprite using AJAX
            if (icon.cors) {
                utils.loadSprite(icon.url, 'sprite-plyr');
            }
        }

        // Create a unique ID
        this.id = Math.floor(Math.random() * 10000);

        // Null by default
        var container = null;
        this.elements.controls = null;

        // Set template properties
        var props = {
            id: this.id,
            seektime: this.config.seekTime,
            title: this.config.title
        };
        var update = true;

        if (utils.is.string(this.config.controls) || utils.is.element(this.config.controls)) {
            // String or HTMLElement passed as the option
            container = this.config.controls;
        } else if (utils.is.function(this.config.controls)) {
            // A custom function to build controls
            // The function can return a HTMLElement or String
            container = this.config.controls.call(this, props);
        } else {
            // Create controls
            container = controls.create.call(this, {
                id: this.id,
                seektime: this.config.seekTime,
                speed: this.speed,
                quality: this.quality,
                captions: captions.getLabel.call(this)
                // TODO: Looping
                // loop: 'None',
            });
            update = false;
        }

        // Replace props with their value
        var replace = function replace(input) {
            var result = input;

            Object.entries(props).forEach(function (_ref) {
                var _ref2 = slicedToArray(_ref, 2),
                    key = _ref2[0],
                    value = _ref2[1];

                result = utils.replaceAll(result, '{' + key + '}', value);
            });

            return result;
        };

        // Update markup
        if (update) {
            if (utils.is.string(this.config.controls)) {
                container = replace(container);
            } else if (utils.is.element(container)) {
                container.innerHTML = replace(container.innerHTML);
            }
        }

        // Controls container
        var target = void 0;

        // Inject to custom location
        if (utils.is.string(this.config.selectors.controls.container)) {
            target = document.querySelector(this.config.selectors.controls.container);
        }

        // Inject into the container by default
        if (!utils.is.element(target)) {
            target = this.elements.container;
        }

        // Inject controls HTML
        if (utils.is.element(container)) {
            target.appendChild(container);
        } else if (container) {
            target.insertAdjacentHTML('beforeend', container);
        }

        // Find the elements if need be
        if (!utils.is.element(this.elements.controls)) {
            controls.findElements.call(this);
        }

        // Edge sometimes doesn't finish the paint so force a redraw
        if (window.navigator.userAgent.includes('Edge')) {
            utils.repaint(target);
        }

        // Setup tooltips
        if (this.config.tooltips.controls) {
            var labels = utils.getElements.call(this, [this.config.selectors.controls.wrapper, ' ', this.config.selectors.labels, ' .', this.config.classNames.hidden].join(''));

            Array.from(labels).forEach(function (label) {
                utils.toggleClass(label, _this6.config.classNames.hidden, false);
                utils.toggleClass(label, _this6.config.classNames.tooltip, true);
                label.setAttribute('role', 'tooltip');
            });
        }
    }
};

// ==========================================================================

var captions = {
    // Setup captions
    setup: function setup() {
        // Requires UI support
        if (!this.supported.ui) {
            return;
        }

        // Set default language if not set
        var stored = this.storage.get('language');

        if (!utils.is.empty(stored)) {
            this.captions.language = stored;
        }

        if (utils.is.empty(this.captions.language)) {
            this.captions.language = this.config.captions.language.toLowerCase();
        }

        // Set captions enabled state if not set
        if (!utils.is.boolean(this.captions.active)) {
            var active = this.storage.get('captions');

            if (utils.is.boolean(active)) {
                this.captions.active = active;
            } else {
                this.captions.active = this.config.captions.active;
            }
        }

        // Only Vimeo and HTML5 video supported at this point
        if (!this.isVideo || this.isYouTube || this.isHTML5 && !support.textTracks) {
            // Clear menu and hide
            if (utils.is.array(this.config.controls) && this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
                controls.setCaptionsMenu.call(this);
            }

            return;
        }

        // Inject the container
        if (!utils.is.element(this.elements.captions)) {
            this.elements.captions = utils.createElement('div', utils.getAttributesFromSelector(this.config.selectors.captions));

            utils.insertAfter(this.elements.captions, this.elements.wrapper);
        }

        // Set the class hook
        utils.toggleClass(this.elements.container, this.config.classNames.captions.enabled, !utils.is.empty(captions.getTracks.call(this)));

        // Get tracks
        var tracks = captions.getTracks.call(this);

        // If no caption file exists, hide container for caption text
        if (utils.is.empty(tracks)) {
            return;
        }

        // Get browser info
        var browser = utils.getBrowser();

        // Fix IE captions if CORS is used
        // Fetch captions and inject as blobs instead (data URIs not supported!)
        if (browser.isIE && window.URL) {
            var elements = this.media.querySelectorAll('track');

            Array.from(elements).forEach(function (track) {
                var src = track.getAttribute('src');
                var href = utils.parseUrl(src);

                if (href.hostname !== window.location.href.hostname && ['http:', 'https:'].includes(href.protocol)) {
                    utils.fetch(src, 'blob').then(function (blob) {
                        track.setAttribute('src', window.URL.createObjectURL(blob));
                    }).catch(function () {
                        utils.removeElement(track);
                    });
                }
            });
        }

        // Set language
        captions.setLanguage.call(this);

        // Enable UI
        captions.show.call(this);

        // Set available languages in list
        if (utils.is.array(this.config.controls) && this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
            controls.setCaptionsMenu.call(this);
        }
    },


    // Set the captions language
    setLanguage: function setLanguage() {
        var _this = this;

        // Setup HTML5 track rendering
        if (this.isHTML5 && this.isVideo) {
            captions.getTracks.call(this).forEach(function (track) {
                // Show track
                utils.on(track, 'cuechange', function (event) {
                    return captions.setCue.call(_this, event);
                });

                // Turn off native caption rendering to avoid double captions
                // eslint-disable-next-line
                track.mode = 'hidden';
            });

            // Get current track
            var currentTrack = captions.getCurrentTrack.call(this);

            // Check if suported kind
            if (utils.is.track(currentTrack)) {
                // If we change the active track while a cue is already displayed we need to update it
                if (Array.from(currentTrack.activeCues || []).length) {
                    captions.setCue.call(this, currentTrack);
                }
            }
        } else if (this.isVimeo && this.captions.active) {
            this.embed.enableTextTrack(this.language);
        }
    },


    // Get the tracks
    getTracks: function getTracks() {
        // Return empty array at least
        if (utils.is.nullOrUndefined(this.media)) {
            return [];
        }

        // Only get accepted kinds
        return Array.from(this.media.textTracks || []).filter(function (track) {
            return ['captions', 'subtitles'].includes(track.kind);
        });
    },


    // Get the current track for the current language
    getCurrentTrack: function getCurrentTrack() {
        var _this2 = this;

        var tracks = captions.getTracks.call(this);

        if (!tracks.length) {
            return null;
        }

        // Get track based on current language
        var track = tracks.find(function (track) {
            return track.language.toLowerCase() === _this2.language;
        });

        // Get the <track> with default attribute
        if (!track) {
            track = utils.getElement.call(this, 'track[default]');
        }

        // Get the first track
        if (!track) {
            var _tracks = slicedToArray(tracks, 1);

            track = _tracks[0];
        }

        return track;
    },


    // Get UI label for track
    getLabel: function getLabel(track) {
        var currentTrack = track;

        if (!utils.is.track(currentTrack) && support.textTracks && this.captions.active) {
            currentTrack = captions.getCurrentTrack.call(this);
        }

        if (utils.is.track(currentTrack)) {
            if (!utils.is.empty(currentTrack.label)) {
                return currentTrack.label;
            }

            if (!utils.is.empty(currentTrack.language)) {
                return track.language.toUpperCase();
            }

            return i18n.get('enabled', this.config);
        }

        return i18n.get('disabled', this.config);
    },


    // Display active caption if it contains text
    setCue: function setCue(input) {
        // Get the track from the event if needed
        var track = utils.is.event(input) ? input.target : input;
        var activeCues = track.activeCues;

        var active = activeCues.length && activeCues[0];
        var currentTrack = captions.getCurrentTrack.call(this);

        // Only display current track
        if (track !== currentTrack) {
            return;
        }

        // Display a cue, if there is one
        if (utils.is.cue(active)) {
            captions.setText.call(this, active.getCueAsHTML());
        } else {
            captions.setText.call(this, null);
        }

        utils.dispatchEvent.call(this, this.media, 'cuechange');
    },


    // Set the current caption
    setText: function setText(input) {
        // Requires UI
        if (!this.supported.ui) {
            return;
        }

        if (utils.is.element(this.elements.captions)) {
            var content = utils.createElement('span');

            // Empty the container
            utils.emptyElement(this.elements.captions);

            // Default to empty
            var caption = !utils.is.nullOrUndefined(input) ? input : '';

            // Set the span content
            if (utils.is.string(caption)) {
                content.textContent = caption.trim();
            } else {
                content.appendChild(caption);
            }

            // Set new caption text
            this.elements.captions.appendChild(content);
        } else {
            this.debug.warn('No captions element to render to');
        }
    },


    // Display captions container and button (for initialization)
    show: function show() {
        // Try to load the value from storage
        var active = this.storage.get('captions');

        // Otherwise fall back to the default config
        if (!utils.is.boolean(active)) {
            active = this.config.captions.active;
        } else {
            this.captions.active = active;
        }

        if (active) {
            utils.toggleClass(this.elements.container, this.config.classNames.captions.active, true);
            utils.toggleState(this.elements.buttons.captions, true);
        }
    }
};

// ==========================================================================
// Console wrapper
// ==========================================================================

var noop = function noop() {};

var Console = function () {
    function Console() {
        var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        classCallCheck(this, Console);

        this.enabled = window.console && enabled;

        if (this.enabled) {
            this.log('Debugging enabled');
        }
    }

    createClass(Console, [{
        key: 'log',
        get: function get$$1() {
            // eslint-disable-next-line no-console
            return this.enabled ? Function.prototype.bind.call(console.log, console) : noop;
        }
    }, {
        key: 'warn',
        get: function get$$1() {
            // eslint-disable-next-line no-console
            return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop;
        }
    }, {
        key: 'error',
        get: function get$$1() {
            // eslint-disable-next-line no-console
            return this.enabled ? Function.prototype.bind.call(console.error, console) : noop;
        }
    }]);
    return Console;
}();

// ==========================================================================
// Plyr default config
// ==========================================================================

var defaults$1 = {
    // Disable
    enabled: true,

    // Custom media title
    title: '',

    // Logging to console
    debug: false,

    // Auto play (if supported)
    autoplay: false,

    // Only allow one media playing at once (vimeo only)
    autopause: true,

    // Default time to skip when rewind/fast forward
    seekTime: 10,

    // Default volume
    volume: 1,
    muted: false,

    // Pass a custom duration
    duration: null,

    // Display the media duration on load in the current time position
    // If you have opted to display both duration and currentTime, this is ignored
    displayDuration: true,

    // Invert the current time to be a countdown
    invertTime: true,

    // Clicking the currentTime inverts it's value to show time left rather than elapsed
    toggleInvert: true,

    // Aspect ratio (for embeds)
    ratio: '16:9',

    // Click video container to play/pause
    clickToPlay: true,

    // Auto hide the controls
    hideControls: true,

    // Reset to start when playback ended
    resetOnEnd: false,

    // Disable the standard context menu
    disableContextMenu: true,

    // Sprite (for icons)
    loadSprite: true,
    iconPrefix: 'plyr',
    iconUrl: 'https://cdn.plyr.io/3.3.7/plyr.svg',

    // Blank video (used to prevent errors on source change)
    blankVideo: 'https://cdn.plyr.io/static/blank.mp4',

    // Quality default
    quality: {
        default: 576,
        options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240, 'default']
    },

    // Set loops
    loop: {
        active: false
        // start: null,
        // end: null,
    },

    // Speed default and options to display
    speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    },

    // Keyboard shortcut settings
    keyboard: {
        focused: true,
        global: false
    },

    // Display tooltips
    tooltips: {
        controls: false,
        seek: true
    },

    // Captions settings
    captions: {
        active: false,
        language: (navigator.language || navigator.userLanguage).split('-')[0]
    },

    // Fullscreen settings
    fullscreen: {
        enabled: true, // Allow fullscreen?
        fallback: true, // Fallback for vintage browsers
        iosNative: false // Use the native fullscreen in iOS (disables custom controls)
    },

    // Local storage
    storage: {
        enabled: true,
        key: 'plyr'
    },

    // Default controls
    controls: ['play-large',
    // 'restart',
    // 'rewind',
    'play',
    // 'fast-forward',
    'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
    settings: ['captions', 'quality', 'speed'],

    // Localisation
    i18n: {
        restart: 'Restart',
        rewind: 'Rewind {seektime}s',
        play: 'Play',
        pause: 'Pause',
        fastForward: 'Forward {seektime}s',
        seek: 'Seek',
        played: 'Played',
        buffered: 'Buffered',
        currentTime: 'Current time',
        duration: 'Duration',
        volume: 'Volume',
        mute: 'Mute',
        unmute: 'Unmute',
        enableCaptions: 'Enable captions',
        disableCaptions: 'Disable captions',
        enterFullscreen: 'Enter fullscreen',
        exitFullscreen: 'Exit fullscreen',
        frameTitle: 'Player for {title}',
        captions: 'Captions',
        settings: 'Settings',
        speed: 'Speed',
        normal: 'Normal',
        quality: 'Quality',
        loop: 'Loop',
        start: 'Start',
        end: 'End',
        all: 'All',
        reset: 'Reset',
        disabled: 'Disabled',
        enabled: 'Enabled',
        advertisement: 'Ad'
    },

    // URLs
    urls: {
        vimeo: {
            sdk: 'https://player.vimeo.com/api/player.js',
            iframe: 'https://player.vimeo.com/video/{0}?{1}',
            api: 'https://vimeo.com/api/v2/video/{0}.json'
        },
        youtube: {
            sdk: 'https://www.youtube.com/iframe_api',
            api: 'https://www.googleapis.com/youtube/v3/videos?id={0}&key={1}&fields=items(snippet(title))&part=snippet',
            poster: 'https://img.youtube.com/vi/{0}/maxresdefault.jpg,https://img.youtube.com/vi/{0}/hqdefault.jpg'
        },
        googleIMA: {
            sdk: 'https://imasdk.googleapis.com/js/sdkloader/ima3.js'
        }
    },

    // Custom control listeners
    listeners: {
        seek: null,
        play: null,
        pause: null,
        restart: null,
        rewind: null,
        fastForward: null,
        mute: null,
        volume: null,
        captions: null,
        fullscreen: null,
        pip: null,
        airplay: null,
        speed: null,
        quality: null,
        loop: null,
        language: null
    },

    // Events to watch and bubble
    events: [
    // Events to watch on HTML5 media elements and bubble
    // https://developer.mozilla.org/en/docs/Web/Guide/Events/Media_events
    'ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'pause', 'error', 'seeking', 'seeked', 'emptied', 'ratechange', 'cuechange',

    // Custom events
    'enterfullscreen', 'exitfullscreen', 'captionsenabled', 'captionsdisabled', 'languagechange', 'controlshidden', 'controlsshown', 'ready',

    // YouTube
    'statechange', 'qualitychange', 'qualityrequested',

    // Ads
    'adsloaded', 'adscontentpause', 'adscontentresume', 'adstarted', 'adsmidpoint', 'adscomplete', 'adsallcomplete', 'adsimpression', 'adsclick'],

    // Selectors
    // Change these to match your template if using custom HTML
    selectors: {
        editable: 'input, textarea, select, [contenteditable]',
        container: '.plyr',
        controls: {
            container: null,
            wrapper: '.plyr__controls'
        },
        labels: '[data-plyr]',
        buttons: {
            play: '[data-plyr="play"]',
            pause: '[data-plyr="pause"]',
            restart: '[data-plyr="restart"]',
            rewind: '[data-plyr="rewind"]',
            fastForward: '[data-plyr="fast-forward"]',
            mute: '[data-plyr="mute"]',
            captions: '[data-plyr="captions"]',
            fullscreen: '[data-plyr="fullscreen"]',
            pip: '[data-plyr="pip"]',
            airplay: '[data-plyr="airplay"]',
            settings: '[data-plyr="settings"]',
            loop: '[data-plyr="loop"]'
        },
        inputs: {
            seek: '[data-plyr="seek"]',
            volume: '[data-plyr="volume"]',
            speed: '[data-plyr="speed"]',
            language: '[data-plyr="language"]',
            quality: '[data-plyr="quality"]'
        },
        display: {
            currentTime: '.plyr__time--current',
            duration: '.plyr__time--duration',
            buffer: '.plyr__progress--buffer',
            played: '.plyr__progress--played',
            loop: '.plyr__progress--loop',
            volume: '.plyr__volume--display'
        },
        progress: '.plyr__progress',
        captions: '.plyr__captions',
        menu: {
            quality: '.js-plyr__menu__list--quality'
        }
    },

    // Class hooks added to the player in different states
    classNames: {
        type: 'plyr--{0}',
        provider: 'plyr--{0}',
        video: 'plyr__video-wrapper',
        embed: 'plyr__video-embed',
        embedContainer: 'plyr__video-embed__container',
        poster: 'plyr__poster',
        ads: 'plyr__ads',
        control: 'plyr__control',
        playing: 'plyr--playing',
        paused: 'plyr--paused',
        stopped: 'plyr--stopped',
        loading: 'plyr--loading',
        error: 'plyr--has-error',
        hover: 'plyr--hover',
        tooltip: 'plyr__tooltip',
        cues: 'plyr__cues',
        hidden: 'plyr__sr-only',
        hideControls: 'plyr--hide-controls',
        isIos: 'plyr--is-ios',
        isTouch: 'plyr--is-touch',
        uiSupported: 'plyr--full-ui',
        noTransition: 'plyr--no-transition',
        menu: {
            value: 'plyr__menu__value',
            badge: 'plyr__badge',
            open: 'plyr--menu-open'
        },
        captions: {
            enabled: 'plyr--captions-enabled',
            active: 'plyr--captions-active'
        },
        fullscreen: {
            enabled: 'plyr--fullscreen-enabled',
            fallback: 'plyr--fullscreen-fallback'
        },
        pip: {
            supported: 'plyr--pip-supported',
            active: 'plyr--pip-active'
        },
        airplay: {
            supported: 'plyr--airplay-supported',
            active: 'plyr--airplay-active'
        },
        tabFocus: 'plyr__tab-focus'
    },

    // Embed attributes
    attributes: {
        embed: {
            provider: 'data-plyr-provider',
            id: 'data-plyr-embed-id'
        }
    },

    // API keys
    keys: {
        google: null
    },

    // Advertisements plugin
    // Register for an account here: http://vi.ai/publisher-video-monetization/?aid=plyrio
    ads: {
        enabled: false,
        publisherId: ''
    }
};

// ==========================================================================

var browser$2 = utils.getBrowser();

function onChange() {
    if (!this.enabled) {
        return;
    }

    // Update toggle button
    var button = this.player.elements.buttons.fullscreen;
    if (utils.is.element(button)) {
        utils.toggleState(button, this.active);
    }

    // Trigger an event
    utils.dispatchEvent.call(this.player, this.target, this.active ? 'enterfullscreen' : 'exitfullscreen', true);

    // Trap focus in container
    if (!browser$2.isIos) {
        utils.trapFocus.call(this.player, this.target, this.active);
    }
}

function toggleFallback() {
    var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    // Store or restore scroll position
    if (toggle) {
        this.scrollPosition = {
            x: window.scrollX || 0,
            y: window.scrollY || 0
        };
    } else {
        window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
    }

    // Toggle scroll
    document.body.style.overflow = toggle ? 'hidden' : '';

    // Toggle class hook
    utils.toggleClass(this.target, this.player.config.classNames.fullscreen.fallback, toggle);

    // Toggle button and fire events
    onChange.call(this);
}

var Fullscreen = function () {
    function Fullscreen(player) {
        var _this = this;

        classCallCheck(this, Fullscreen);

        // Keep reference to parent
        this.player = player;

        // Get prefix
        this.prefix = Fullscreen.prefix;
        this.property = Fullscreen.property;

        // Scroll position
        this.scrollPosition = { x: 0, y: 0 };

        // Register event listeners
        // Handle event (incase user presses escape etc)
        utils.on(document, this.prefix === 'ms' ? 'MSFullscreenChange' : this.prefix + 'fullscreenchange', function () {
            // TODO: Filter for target??
            onChange.call(_this);
        });

        // Fullscreen toggle on double click
        utils.on(this.player.elements.container, 'dblclick', function (event) {
            // Ignore double click in controls
            if (utils.is.element(_this.player.elements.controls) && _this.player.elements.controls.contains(event.target)) {
                return;
            }

            _this.toggle();
        });

        // Update the UI
        this.update();
    }

    // Determine if native supported


    createClass(Fullscreen, [{
        key: 'update',


        // Update UI
        value: function update() {
            if (this.enabled) {
                this.player.debug.log((Fullscreen.native ? 'Native' : 'Fallback') + ' fullscreen enabled');
            } else {
                this.player.debug.log('Fullscreen not supported and fallback disabled');
            }

            // Add styling hook to show button
            utils.toggleClass(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.enabled);
        }

        // Make an element fullscreen

    }, {
        key: 'enter',
        value: function enter() {
            if (!this.enabled) {
                return;
            }

            // iOS native fullscreen doesn't need the request step
            if (browser$2.isIos && this.player.config.fullscreen.iosNative) {
                if (this.player.playing) {
                    this.target.webkitEnterFullscreen();
                }
            } else if (!Fullscreen.native) {
                toggleFallback.call(this, true);
            } else if (!this.prefix) {
                this.target.requestFullscreen();
            } else if (!utils.is.empty(this.prefix)) {
                this.target[this.prefix + 'Request' + this.property]();
            }
        }

        // Bail from fullscreen

    }, {
        key: 'exit',
        value: function exit() {
            if (!this.enabled) {
                return;
            }

            // iOS native fullscreen
            if (browser$2.isIos && this.player.config.fullscreen.iosNative) {
                this.target.webkitExitFullscreen();
                this.player.play();
            } else if (!Fullscreen.native) {
                toggleFallback.call(this, false);
            } else if (!this.prefix) {
                (document.cancelFullScreen || document.exitFullscreen).call(document);
            } else if (!utils.is.empty(this.prefix)) {
                var action = this.prefix === 'moz' ? 'Cancel' : 'Exit';
                document['' + this.prefix + action + this.property]();
            }
        }

        // Toggle state

    }, {
        key: 'toggle',
        value: function toggle() {
            if (!this.active) {
                this.enter();
            } else {
                this.exit();
            }
        }
    }, {
        key: 'enabled',


        // Determine if fullscreen is enabled
        get: function get$$1() {
            return (Fullscreen.native || this.player.config.fullscreen.fallback) && this.player.config.fullscreen.enabled && this.player.supported.ui && this.player.isVideo;
        }

        // Get active state

    }, {
        key: 'active',
        get: function get$$1() {
            if (!this.enabled) {
                return false;
            }

            // Fallback using classname
            if (!Fullscreen.native) {
                return utils.hasClass(this.target, this.player.config.classNames.fullscreen.fallback);
            }

            var element = !this.prefix ? document.fullscreenElement : document['' + this.prefix + this.property + 'Element'];

            return element === this.target;
        }

        // Get target element

    }, {
        key: 'target',
        get: function get$$1() {
            return browser$2.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.container;
        }
    }], [{
        key: 'native',
        get: function get$$1() {
            return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
        }

        // Get the prefix for handlers

    }, {
        key: 'prefix',
        get: function get$$1() {
            // No prefix
            if (utils.is.function(document.exitFullscreen)) {
                return '';
            }

            // Check for fullscreen support by vendor prefix
            var value = '';
            var prefixes = ['webkit', 'moz', 'ms'];

            prefixes.some(function (pre) {
                if (utils.is.function(document[pre + 'ExitFullscreen']) || utils.is.function(document[pre + 'CancelFullScreen'])) {
                    value = pre;
                    return true;
                }

                return false;
            });

            return value;
        }
    }, {
        key: 'property',
        get: function get$$1() {
            return this.prefix === 'moz' ? 'FullScreen' : 'Fullscreen';
        }
    }]);
    return Fullscreen;
}();

// ==========================================================================

// Sniff out the browser
var browser$3 = utils.getBrowser();

var Listeners = function () {
    function Listeners(player) {
        classCallCheck(this, Listeners);

        this.player = player;
        this.lastKey = null;

        this.handleKey = this.handleKey.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.firstTouch = this.firstTouch.bind(this);
    }

    // Handle key presses


    createClass(Listeners, [{
        key: 'handleKey',
        value: function handleKey(event) {
            var _this = this;

            var code = event.keyCode ? event.keyCode : event.which;
            var pressed = event.type === 'keydown';
            var repeat = pressed && code === this.lastKey;

            // Bail if a modifier key is set
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
                return;
            }

            // If the event is bubbled from the media element
            // Firefox doesn't get the keycode for whatever reason
            if (!utils.is.number(code)) {
                return;
            }

            // Seek by the number keys
            var seekByKey = function seekByKey() {
                // Divide the max duration into 10th's and times by the number value
                _this.player.currentTime = _this.player.duration / 10 * (code - 48);
            };

            // Handle the key on keydown
            // Reset on keyup
            if (pressed) {
                // Which keycodes should we prevent default
                var preventDefault = [48, 49, 50, 51, 52, 53, 54, 56, 57, 32, 75, 38, 40, 77, 39, 37, 70, 67, 73, 76, 79];

                // Check focused element
                // and if the focused element is not editable (e.g. text input)
                // and any that accept key input http://webaim.org/techniques/keyboard/
                var focused = utils.getFocusElement();
                if (utils.is.element(focused) && utils.matches(focused, this.player.config.selectors.editable)) {
                    return;
                }

                // If the code is found prevent default (e.g. prevent scrolling for arrows)
                if (preventDefault.includes(code)) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                switch (code) {
                    case 48:
                    case 49:
                    case 50:
                    case 51:
                    case 52:
                    case 53:
                    case 54:
                    case 55:
                    case 56:
                    case 57:
                        // 0-9
                        if (!repeat) {
                            seekByKey();
                        }
                        break;

                    case 32:
                    case 75:
                        // Space and K key
                        if (!repeat) {
                            this.player.togglePlay();
                        }
                        break;

                    case 38:
                        // Arrow up
                        this.player.increaseVolume(0.1);
                        break;

                    case 40:
                        // Arrow down
                        this.player.decreaseVolume(0.1);
                        break;

                    case 77:
                        // M key
                        if (!repeat) {
                            this.player.muted = !this.player.muted;
                        }
                        break;

                    case 39:
                        // Arrow forward
                        this.player.forward();
                        break;

                    case 37:
                        // Arrow back
                        this.player.rewind();
                        break;

                    case 70:
                        // F key
                        this.player.fullscreen.toggle();
                        break;

                    case 67:
                        // C key
                        if (!repeat) {
                            this.player.toggleCaptions();
                        }
                        break;

                    case 76:
                        // L key
                        this.player.loop = !this.player.loop;
                        break;

                    /* case 73:
                        this.setLoop('start');
                        break;
                     case 76:
                        this.setLoop();
                        break;
                     case 79:
                        this.setLoop('end');
                        break; */

                    default:
                        break;
                }

                // Escape is handle natively when in full screen
                // So we only need to worry about non native
                if (!this.player.fullscreen.enabled && this.player.fullscreen.active && code === 27) {
                    this.player.fullscreen.toggle();
                }

                // Store last code for next cycle
                this.lastKey = code;
            } else {
                this.lastKey = null;
            }
        }

        // Toggle menu

    }, {
        key: 'toggleMenu',
        value: function toggleMenu(event) {
            controls.toggleMenu.call(this.player, event);
        }

        // Device is touch enabled

    }, {
        key: 'firstTouch',
        value: function firstTouch() {
            this.player.touch = true;

            // Add touch class
            utils.toggleClass(this.player.elements.container, this.player.config.classNames.isTouch, true);

            // Clean up
            utils.off(document.body, 'touchstart', this.firstTouch);
        }

        // Global window & document listeners

    }, {
        key: 'global',
        value: function global() {
            var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            // Keyboard shortcuts
            if (this.player.config.keyboard.global) {
                utils.toggleListener(window, 'keydown keyup', this.handleKey, toggle, false);
            }

            // Click anywhere closes menu
            utils.toggleListener(document.body, 'click', this.toggleMenu, toggle);

            // Detect touch by events
            utils.on(document.body, 'touchstart', this.firstTouch);
        }

        // Container listeners

    }, {
        key: 'container',
        value: function container() {
            var _this2 = this;

            // Keyboard shortcuts
            if (!this.player.config.keyboard.global && this.player.config.keyboard.focused) {
                utils.on(this.player.elements.container, 'keydown keyup', this.handleKey, false);
            }

            // Detect tab focus
            // Remove class on blur/focusout
            utils.on(this.player.elements.container, 'focusout', function (event) {
                utils.toggleClass(event.target, _this2.player.config.classNames.tabFocus, false);
            });

            // Add classname to tabbed elements
            utils.on(this.player.elements.container, 'keydown', function (event) {
                if (event.keyCode !== 9) {
                    return;
                }

                // Delay the adding of classname until the focus has changed
                // This event fires before the focusin event
                setTimeout(function () {
                    utils.toggleClass(utils.getFocusElement(), _this2.player.config.classNames.tabFocus, true);
                }, 0);
            });

            // Toggle controls visibility based on mouse movement
            if (this.player.config.hideControls) {
                // Toggle controls on mouse events and entering fullscreen
                utils.on(this.player.elements.container, 'mouseenter mouseleave mousemove touchstart touchend touchmove enterfullscreen exitfullscreen', function (event) {
                    _this2.player.toggleControls(event);
                });
            }
        }

        // Listen for media events

    }, {
        key: 'media',
        value: function media() {
            var _this3 = this;

            // Time change on media
            utils.on(this.player.media, 'timeupdate seeking', function (event) {
                return ui.timeUpdate.call(_this3.player, event);
            });

            // Display duration
            utils.on(this.player.media, 'durationchange loadeddata loadedmetadata', function (event) {
                return ui.durationUpdate.call(_this3.player, event);
            });

            // Check for audio tracks on load
            // We can't use `loadedmetadata` as it doesn't seem to have audio tracks at that point
            utils.on(this.player.media, 'loadeddata', function () {
                utils.toggleHidden(_this3.player.elements.volume, !_this3.player.hasAudio);
                utils.toggleHidden(_this3.player.elements.buttons.mute, !_this3.player.hasAudio);
            });

            // Handle the media finishing
            utils.on(this.player.media, 'ended', function () {
                // Show poster on end
                if (_this3.player.isHTML5 && _this3.player.isVideo && _this3.player.config.resetOnEnd) {
                    // Restart
                    _this3.player.restart();
                }
            });

            // Check for buffer progress
            utils.on(this.player.media, 'progress playing', function (event) {
                return ui.updateProgress.call(_this3.player, event);
            });

            // Handle volume changes
            utils.on(this.player.media, 'volumechange', function (event) {
                return ui.updateVolume.call(_this3.player, event);
            });

            // Handle play/pause
            utils.on(this.player.media, 'playing play pause ended emptied timeupdate', function (event) {
                return ui.checkPlaying.call(_this3.player, event);
            });

            // Loading state
            utils.on(this.player.media, 'waiting canplay seeked playing', function (event) {
                return ui.checkLoading.call(_this3.player, event);
            });

            // Check if media failed to load
            // utils.on(this.player.media, 'play', event => ui.checkFailed.call(this.player, event));

            // If autoplay, then load advertisement if required
            // TODO: Show some sort of loading state while the ad manager loads else there's a delay before ad shows
            utils.on(this.player.media, 'playing', function () {
                if (!_this3.player.ads) {
                    return;
                }

                // If ads are enabled, wait for them first
                if (_this3.player.ads.enabled && !_this3.player.ads.initialized) {
                    // Wait for manager response
                    _this3.player.ads.managerPromise.then(function () {
                        return _this3.player.ads.play();
                    }).catch(function () {
                        return _this3.player.play();
                    });
                }
            });

            // Click video
            if (this.player.supported.ui && this.player.config.clickToPlay && !this.player.isAudio) {
                // Re-fetch the wrapper
                var wrapper = utils.getElement.call(this.player, '.' + this.player.config.classNames.video);

                // Bail if there's no wrapper (this should never happen)
                if (!utils.is.element(wrapper)) {
                    return;
                }

                // On click play, pause ore restart
                utils.on(wrapper, 'click', function () {
                    // Touch devices will just show controls (if we're hiding controls)
                    if (_this3.player.config.hideControls && _this3.player.touch && !_this3.player.paused) {
                        return;
                    }

                    if (_this3.player.paused) {
                        _this3.player.play();
                    } else if (_this3.player.ended) {
                        _this3.player.restart();
                        _this3.player.play();
                    } else {
                        _this3.player.pause();
                    }
                });
            }

            // Disable right click
            if (this.player.supported.ui && this.player.config.disableContextMenu) {
                utils.on(this.player.elements.wrapper, 'contextmenu', function (event) {
                    event.preventDefault();
                }, false);
            }

            // Volume change
            utils.on(this.player.media, 'volumechange', function () {
                // Save to storage
                _this3.player.storage.set({ volume: _this3.player.volume, muted: _this3.player.muted });
            });

            // Speed change
            utils.on(this.player.media, 'ratechange', function () {
                // Update UI
                controls.updateSetting.call(_this3.player, 'speed');

                // Save to storage
                _this3.player.storage.set({ speed: _this3.player.speed });
            });

            // Quality request
            utils.on(this.player.media, 'qualityrequested', function (event) {
                // Save to storage
                _this3.player.storage.set({ quality: event.detail.quality });
            });

            // Quality change
            utils.on(this.player.media, 'qualitychange', function (event) {
                // Update UI
                controls.updateSetting.call(_this3.player, 'quality', null, event.detail.quality);
            });

            // Caption language change
            utils.on(this.player.media, 'languagechange', function () {
                // Update UI
                controls.updateSetting.call(_this3.player, 'captions');

                // Save to storage
                _this3.player.storage.set({ language: _this3.player.language });
            });

            // Captions toggle
            utils.on(this.player.media, 'captionsenabled captionsdisabled', function () {
                // Update UI
                controls.updateSetting.call(_this3.player, 'captions');

                // Save to storage
                _this3.player.storage.set({ captions: _this3.player.captions.active });
            });

            // Proxy events to container
            // Bubble up key events for Edge
            utils.on(this.player.media, this.player.config.events.concat(['keyup', 'keydown']).join(' '), function (event) {
                var detail = {};

                // Get error details from media
                if (event.type === 'error') {
                    detail = _this3.player.media.error;
                }

                utils.dispatchEvent.call(_this3.player, _this3.player.elements.container, event.type, true, detail);
            });
        }

        // Listen for control events

    }, {
        key: 'controls',
        value: function controls$$1() {
            var _this4 = this;

            // IE doesn't support input event, so we fallback to change
            var inputEvent = browser$3.isIE ? 'change' : 'input';

            // Run default and custom handlers
            var proxy = function proxy(event, defaultHandler, customHandlerKey) {
                var customHandler = _this4.player.config.listeners[customHandlerKey];
                var hasCustomHandler = utils.is.function(customHandler);
                var returned = true;

                // Execute custom handler
                if (hasCustomHandler) {
                    returned = customHandler.call(_this4.player, event);
                }

                // Only call default handler if not prevented in custom handler
                if (returned && utils.is.function(defaultHandler)) {
                    defaultHandler.call(_this4.player, event);
                }
            };

            // Trigger custom and default handlers
            var on = function on(element, type, defaultHandler, customHandlerKey) {
                var passive = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

                var customHandler = _this4.player.config.listeners[customHandlerKey];
                var hasCustomHandler = utils.is.function(customHandler);

                utils.on(element, type, function (event) {
                    return proxy(event, defaultHandler, customHandlerKey);
                }, passive && !hasCustomHandler);
            };

            // Play/pause toggle
            on(this.player.elements.buttons.play, 'click', this.player.togglePlay, 'play');

            // Pause
            on(this.player.elements.buttons.restart, 'click', this.player.restart, 'restart');

            // Rewind
            on(this.player.elements.buttons.rewind, 'click', this.player.rewind, 'rewind');

            // Rewind
            on(this.player.elements.buttons.fastForward, 'click', this.player.forward, 'fastForward');

            // Mute toggle
            on(this.player.elements.buttons.mute, 'click', function () {
                _this4.player.muted = !_this4.player.muted;
            }, 'mute');

            // Captions toggle
            on(this.player.elements.buttons.captions, 'click', this.player.toggleCaptions);

            // Fullscreen toggle
            on(this.player.elements.buttons.fullscreen, 'click', function () {
                _this4.player.fullscreen.toggle();
            }, 'fullscreen');

            // Picture-in-Picture
            on(this.player.elements.buttons.pip, 'click', function () {
                _this4.player.pip = 'toggle';
            }, 'pip');

            // Airplay
            on(this.player.elements.buttons.airplay, 'click', this.player.airplay, 'airplay');

            // Settings menu
            on(this.player.elements.buttons.settings, 'click', function (event) {
                controls.toggleMenu.call(_this4.player, event);
            });

            // Settings menu
            on(this.player.elements.settings.form, 'click', function (event) {
                event.stopPropagation();

                // Go back to home tab on click
                var showHomeTab = function showHomeTab() {
                    var id = 'plyr-settings-' + _this4.player.id + '-home';
                    controls.showTab.call(_this4.player, id);
                };

                // Settings menu items - use event delegation as items are added/removed
                if (utils.matches(event.target, _this4.player.config.selectors.inputs.language)) {
                    proxy(event, function () {
                        _this4.player.language = event.target.value;
                        showHomeTab();
                    }, 'language');
                } else if (utils.matches(event.target, _this4.player.config.selectors.inputs.quality)) {
                    proxy(event, function () {
                        _this4.player.quality = event.target.value;
                        showHomeTab();
                    }, 'quality');
                } else if (utils.matches(event.target, _this4.player.config.selectors.inputs.speed)) {
                    proxy(event, function () {
                        _this4.player.speed = parseFloat(event.target.value);
                        showHomeTab();
                    }, 'speed');
                } else {
                    var tab = event.target;
                    controls.showTab.call(_this4.player, tab.getAttribute('aria-controls'));
                }
            });

            // Seek
            on(this.player.elements.inputs.seek, inputEvent, function (event) {
                _this4.player.currentTime = event.target.value / event.target.max * _this4.player.duration;
            }, 'seek');

            // Current time invert
            // Only if one time element is used for both currentTime and duration
            if (this.player.config.toggleInvert && !utils.is.element(this.player.elements.display.duration)) {
                on(this.player.elements.display.currentTime, 'click', function () {
                    // Do nothing if we're at the start
                    if (_this4.player.currentTime === 0) {
                        return;
                    }

                    _this4.player.config.invertTime = !_this4.player.config.invertTime;
                    ui.timeUpdate.call(_this4.player);
                });
            }

            // Volume
            on(this.player.elements.inputs.volume, inputEvent, function (event) {
                _this4.player.volume = event.target.value;
            }, 'volume');

            // Polyfill for lower fill in <input type="range"> for webkit
            if (browser$3.isWebkit) {
                on(utils.getElements.call(this.player, 'input[type="range"]'), 'input', function (event) {
                    controls.updateRangeFill.call(_this4.player, event.target);
                });
            }

            // Seek tooltip
            on(this.player.elements.progress, 'mouseenter mouseleave mousemove', function (event) {
                return controls.updateSeekTooltip.call(_this4.player, event);
            });

            // Toggle controls visibility based on mouse movement
            if (this.player.config.hideControls) {
                // Watch for cursor over controls so they don't hide when trying to interact
                on(this.player.elements.controls, 'mouseenter mouseleave', function (event) {
                    _this4.player.elements.controls.hover = !_this4.player.touch && event.type === 'mouseenter';
                });

                // Watch for cursor over controls so they don't hide when trying to interact
                on(this.player.elements.controls, 'mousedown mouseup touchstart touchend touchcancel', function (event) {
                    _this4.player.elements.controls.pressed = ['mousedown', 'touchstart'].includes(event.type);
                });

                // Focus in/out on controls
                on(this.player.elements.controls, 'focusin focusout', function (event) {
                    _this4.player.toggleControls(event);
                });
            }

            // Mouse wheel for volume
            on(this.player.elements.inputs.volume, 'wheel', function (event) {
                // Detect "natural" scroll - suppored on OS X Safari only
                // Other browsers on OS X will be inverted until support improves
                var inverted = event.webkitDirectionInvertedFromDevice;
                var step = 1 / 50;
                var direction = 0;

                // Scroll down (or up on natural) to decrease
                if (event.deltaY < 0 || event.deltaX > 0) {
                    if (inverted) {
                        _this4.player.decreaseVolume(step);
                        direction = -1;
                    } else {
                        _this4.player.increaseVolume(step);
                        direction = 1;
                    }
                }

                // Scroll up (or down on natural) to increase
                if (event.deltaY > 0 || event.deltaX < 0) {
                    if (inverted) {
                        _this4.player.increaseVolume(step);
                        direction = 1;
                    } else {
                        _this4.player.decreaseVolume(step);
                        direction = -1;
                    }
                }

                // Don't break page scrolling at max and min
                if (direction === 1 && _this4.player.media.volume < 1 || direction === -1 && _this4.player.media.volume > 0) {
                    event.preventDefault();
                }
            }, 'volume', false);
        }

        // Reset on destroy

    }, {
        key: 'clear',
        value: function clear() {
            this.global(false);
        }
    }]);
    return Listeners;
}();

// ==========================================================================

var vimeo = {
    setup: function setup() {
        var _this = this;

        // Add embed class for responsive
        utils.toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set intial ratio
        vimeo.setAspectRatio.call(this);

        // Load the API if not already
        if (!utils.is.object(window.Vimeo)) {
            utils.loadScript(this.config.urls.vimeo.sdk).then(function () {
                vimeo.ready.call(_this);
            }).catch(function (error) {
                _this.debug.warn('Vimeo API failed to load', error);
            });
        } else {
            vimeo.ready.call(this);
        }
    },


    // Set aspect ratio
    // For Vimeo we have an extra 300% height <div> to hide the standard controls and UI
    setAspectRatio: function setAspectRatio(input) {
        var ratio = utils.is.string(input) ? input.split(':') : this.config.ratio.split(':');
        var padding = 100 / ratio[0] * ratio[1];
        this.elements.wrapper.style.paddingBottom = padding + '%';

        if (this.supported.ui) {
            var height = 240;
            var offset = (height - padding) / (height / 50);

            this.media.style.transform = 'translateY(-' + offset + '%)';
        }
    },


    // API Ready
    ready: function ready() {
        var _this2 = this;

        var player = this;

        // Get Vimeo params for the iframe
        var options = {
            loop: player.config.loop.active,
            autoplay: player.autoplay,
            // muted: player.muted,
            byline: false,
            portrait: false,
            title: false,
            speed: true,
            transparent: 0,
            gesture: 'media',
            playsinline: !this.config.fullscreen.iosNative
        };
        var params = utils.buildUrlParams(options);

        // Get the source URL or ID
        var source = player.media.getAttribute('src');

        // Get from <div> if needed
        if (utils.is.empty(source)) {
            source = player.media.getAttribute(player.config.attributes.embed.id);
        }

        var id = utils.parseVimeoId(source);

        // Build an iframe
        var iframe = utils.createElement('iframe');
        var src = utils.format(player.config.urls.vimeo.iframe, id, params);
        iframe.setAttribute('src', src);
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allowtransparency', '');
        iframe.setAttribute('allow', 'autoplay');

        // Inject the package
        var wrapper = utils.createElement('div', { class: player.config.classNames.embedContainer });
        wrapper.appendChild(iframe);
        player.media = utils.replaceElement(wrapper, player.media);

        // Get poster image
        utils.fetch(utils.format(player.config.urls.vimeo.api, id), 'json').then(function (response) {
            if (utils.is.empty(response)) {
                return;
            }

            // Get the URL for thumbnail
            var url = new URL(response[0].thumbnail_large);

            // Get original image
            url.pathname = url.pathname.split('_')[0] + '.jpg';

            // Set attribute
            player.media.setAttribute('poster', url.href);

            // Update
            ui.setPoster.call(player);
        });

        // Setup instance
        // https://github.com/vimeo/player.js
        player.embed = new window.Vimeo.Player(iframe, {
            autopause: player.config.autopause,
            muted: player.muted
        });

        player.media.paused = true;
        player.media.currentTime = 0;

        // Disable native text track rendering
        if (player.supported.ui) {
            player.embed.disableTextTrack();
        }

        // Create a faux HTML5 API using the Vimeo API
        player.media.play = function () {
            player.embed.play().then(function () {
                player.media.paused = false;
            });
        };

        player.media.pause = function () {
            player.embed.pause().then(function () {
                player.media.paused = true;
            });
        };

        player.media.stop = function () {
            player.pause();
            player.currentTime = 0;
        };

        // Seeking
        var currentTime = player.media.currentTime;

        Object.defineProperty(player.media, 'currentTime', {
            get: function get() {
                return currentTime;
            },
            set: function set(time) {
                // Get current paused state
                // Vimeo will automatically play on seek
                var paused = player.media.paused;

                // Set seeking flag

                player.media.seeking = true;

                // Trigger seeking
                utils.dispatchEvent.call(player, player.media, 'seeking');

                // Seek after events
                player.embed.setCurrentTime(time).catch(function () {
                    // Do nothing
                });

                // Restore pause state
                if (paused) {
                    player.pause();
                }
            }
        });

        // Playback speed
        var speed = player.config.speed.selected;
        Object.defineProperty(player.media, 'playbackRate', {
            get: function get() {
                return speed;
            },
            set: function set(input) {
                player.embed.setPlaybackRate(input).then(function () {
                    speed = input;
                    utils.dispatchEvent.call(player, player.media, 'ratechange');
                }).catch(function (error) {
                    // Hide menu item (and menu if empty)
                    if (error.name === 'Error') {
                        controls.setSpeedMenu.call(player, []);
                    }
                });
            }
        });

        // Volume
        var volume = player.config.volume;

        Object.defineProperty(player.media, 'volume', {
            get: function get() {
                return volume;
            },
            set: function set(input) {
                player.embed.setVolume(input).then(function () {
                    volume = input;
                    utils.dispatchEvent.call(player, player.media, 'volumechange');
                });
            }
        });

        // Muted
        var muted = player.config.muted;

        Object.defineProperty(player.media, 'muted', {
            get: function get() {
                return muted;
            },
            set: function set(input) {
                var toggle = utils.is.boolean(input) ? input : false;

                player.embed.setVolume(toggle ? 0 : player.config.volume).then(function () {
                    muted = toggle;
                    utils.dispatchEvent.call(player, player.media, 'volumechange');
                });
            }
        });

        // Loop
        var loop = player.config.loop;

        Object.defineProperty(player.media, 'loop', {
            get: function get() {
                return loop;
            },
            set: function set(input) {
                var toggle = utils.is.boolean(input) ? input : player.config.loop.active;

                player.embed.setLoop(toggle).then(function () {
                    loop = toggle;
                });
            }
        });

        // Source
        var currentSrc = void 0;
        player.embed.getVideoUrl().then(function (value) {
            currentSrc = value;
        }).catch(function (error) {
            _this2.debug.warn(error);
        });

        Object.defineProperty(player.media, 'currentSrc', {
            get: function get() {
                return currentSrc;
            }
        });

        // Ended
        Object.defineProperty(player.media, 'ended', {
            get: function get() {
                return player.currentTime === player.duration;
            }
        });

        // Set aspect ratio based on video size
        Promise.all([player.embed.getVideoWidth(), player.embed.getVideoHeight()]).then(function (dimensions) {
            var ratio = utils.getAspectRatio(dimensions[0], dimensions[1]);
            vimeo.setAspectRatio.call(_this2, ratio);
        });

        // Set autopause
        player.embed.setAutopause(player.config.autopause).then(function (state) {
            player.config.autopause = state;
        });

        // Get title
        player.embed.getVideoTitle().then(function (title) {
            player.config.title = title;
            ui.setTitle.call(_this2);
        });

        // Get current time
        player.embed.getCurrentTime().then(function (value) {
            currentTime = value;
            utils.dispatchEvent.call(player, player.media, 'timeupdate');
        });

        // Get duration
        player.embed.getDuration().then(function (value) {
            player.media.duration = value;
            utils.dispatchEvent.call(player, player.media, 'durationchange');
        });

        // Get captions
        player.embed.getTextTracks().then(function (tracks) {
            player.media.textTracks = tracks;
            captions.setup.call(player);
        });

        player.embed.on('cuechange', function (data) {
            var cue = null;

            if (data.cues.length) {
                cue = utils.stripHTML(data.cues[0].text);
            }

            captions.setText.call(player, cue);
        });

        player.embed.on('loaded', function () {
            if (utils.is.element(player.embed.element) && player.supported.ui) {
                var frame = player.embed.element;

                // Fix keyboard focus issues
                // https://github.com/sampotts/plyr/issues/317
                frame.setAttribute('tabindex', -1);
            }
        });

        player.embed.on('play', function () {
            // Only fire play if paused before
            if (player.media.paused) {
                utils.dispatchEvent.call(player, player.media, 'play');
            }
            player.media.paused = false;
            utils.dispatchEvent.call(player, player.media, 'playing');
        });

        player.embed.on('pause', function () {
            player.media.paused = true;
            utils.dispatchEvent.call(player, player.media, 'pause');
        });

        player.embed.on('timeupdate', function (data) {
            player.media.seeking = false;
            currentTime = data.seconds;
            utils.dispatchEvent.call(player, player.media, 'timeupdate');
        });

        player.embed.on('progress', function (data) {
            player.media.buffered = data.percent;
            utils.dispatchEvent.call(player, player.media, 'progress');

            // Check all loaded
            if (parseInt(data.percent, 10) === 1) {
                utils.dispatchEvent.call(player, player.media, 'canplaythrough');
            }

            // Get duration as if we do it before load, it gives an incorrect value
            // https://github.com/sampotts/plyr/issues/891
            player.embed.getDuration().then(function (value) {
                if (value !== player.media.duration) {
                    player.media.duration = value;
                    utils.dispatchEvent.call(player, player.media, 'durationchange');
                }
            });
        });

        player.embed.on('seeked', function () {
            player.media.seeking = false;
            utils.dispatchEvent.call(player, player.media, 'seeked');
            utils.dispatchEvent.call(player, player.media, 'play');
        });

        player.embed.on('ended', function () {
            player.media.paused = true;
            utils.dispatchEvent.call(player, player.media, 'ended');
        });

        player.embed.on('error', function (detail) {
            player.media.error = detail;
            utils.dispatchEvent.call(player, player.media, 'error');
        });

        // Rebuild UI
        setTimeout(function () {
            return ui.build.call(player);
        }, 0);
    }
};

// ==========================================================================

// Standardise YouTube quality unit
function mapQualityUnit(input) {
    switch (input) {
        case 'hd2160':
            return 2160;

        case 2160:
            return 'hd2160';

        case 'hd1440':
            return 1440;

        case 1440:
            return 'hd1440';

        case 'hd1080':
            return 1080;

        case 1080:
            return 'hd1080';

        case 'hd720':
            return 720;

        case 720:
            return 'hd720';

        case 'large':
            return 480;

        case 480:
            return 'large';

        case 'medium':
            return 360;

        case 360:
            return 'medium';

        case 'small':
            return 240;

        case 240:
            return 'small';

        default:
            return 'default';
    }
}

function mapQualityUnits(levels) {
    if (utils.is.empty(levels)) {
        return levels;
    }

    return utils.dedupe(levels.map(function (level) {
        return mapQualityUnit(level);
    }));
}

var youtube = {
    setup: function setup() {
        var _this = this;

        // Add embed class for responsive
        utils.toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set aspect ratio
        youtube.setAspectRatio.call(this);

        // Setup API
        if (utils.is.object(window.YT) && utils.is.function(window.YT.Player)) {
            youtube.ready.call(this);
        } else {
            // Load the API
            utils.loadScript(this.config.urls.youtube.sdk).catch(function (error) {
                _this.debug.warn('YouTube API failed to load', error);
            });

            // Setup callback for the API
            // YouTube has it's own system of course...
            window.onYouTubeReadyCallbacks = window.onYouTubeReadyCallbacks || [];

            // Add to queue
            window.onYouTubeReadyCallbacks.push(function () {
                youtube.ready.call(_this);
            });

            // Set callback to process queue
            window.onYouTubeIframeAPIReady = function () {
                window.onYouTubeReadyCallbacks.forEach(function (callback) {
                    callback();
                });
            };
        }
    },


    // Get the media title
    getTitle: function getTitle(videoId) {
        var _this2 = this;

        // Try via undocumented API method first
        // This method disappears now and then though...
        // https://github.com/sampotts/plyr/issues/709
        if (utils.is.function(this.embed.getVideoData)) {
            var _embed$getVideoData = this.embed.getVideoData(),
                title = _embed$getVideoData.title;

            if (utils.is.empty(title)) {
                this.config.title = title;
                ui.setTitle.call(this);
                return;
            }
        }

        // Or via Google API
        var key = this.config.keys.google;
        if (utils.is.string(key) && !utils.is.empty(key)) {
            var url = utils.format(this.config.urls.youtube.api, videoId, key);

            utils.fetch(url).then(function (result) {
                if (utils.is.object(result)) {
                    _this2.config.title = result.items[0].snippet.title;
                    ui.setTitle.call(_this2);
                }
            }).catch(function () {});
        }
    },


    // Set aspect ratio
    setAspectRatio: function setAspectRatio() {
        var ratio = this.config.ratio.split(':');
        this.elements.wrapper.style.paddingBottom = 100 / ratio[0] * ratio[1] + '%';
    },


    // API ready
    ready: function ready() {
        var player = this;

        // Ignore already setup (race condition)
        var currentId = player.media.getAttribute('id');
        if (!utils.is.empty(currentId) && currentId.startsWith('youtube-')) {
            return;
        }

        // Get the source URL or ID
        var source = player.media.getAttribute('src');

        // Get from <div> if needed
        if (utils.is.empty(source)) {
            source = player.media.getAttribute(this.config.attributes.embed.id);
        }

        // Replace the <iframe> with a <div> due to YouTube API issues
        var videoId = utils.parseYouTubeId(source);
        var id = utils.generateId(player.provider);
        var container = utils.createElement('div', { id: id });
        player.media = utils.replaceElement(container, player.media);

        // Set poster image
        player.media.setAttribute('poster', utils.format(player.config.urls.youtube.poster, videoId));

        // Setup instance
        // https://developers.google.com/youtube/iframe_api_reference
        player.embed = new window.YT.Player(id, {
            videoId: videoId,
            playerVars: {
                autoplay: player.config.autoplay ? 1 : 0, // Autoplay
                controls: player.supported.ui ? 0 : 1, // Only show controls if not fully supported
                rel: 0, // No related vids
                showinfo: 0, // Hide info
                iv_load_policy: 3, // Hide annotations
                modestbranding: 1, // Hide logos as much as possible (they still show one in the corner when paused)
                disablekb: 1, // Disable keyboard as we handle it
                playsinline: 1, // Allow iOS inline playback

                // Tracking for stats
                // origin: window ? `${window.location.protocol}//${window.location.host}` : null,
                widget_referrer: window ? window.location.href : null,

                // Captions are flaky on YouTube
                cc_load_policy: player.captions.active ? 1 : 0,
                cc_lang_pref: player.config.captions.language
            },
            events: {
                onError: function onError(event) {
                    // If we've already fired an error, don't do it again
                    // YouTube fires onError twice
                    if (utils.is.object(player.media.error)) {
                        return;
                    }

                    var detail = {
                        code: event.data
                    };

                    // Messages copied from https://developers.google.com/youtube/iframe_api_reference#onError
                    switch (event.data) {
                        case 2:
                            detail.message = 'The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.';
                            break;

                        case 5:
                            detail.message = 'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.';
                            break;

                        case 100:
                            detail.message = 'The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.';
                            break;

                        case 101:
                        case 150:
                            detail.message = 'The owner of the requested video does not allow it to be played in embedded players.';
                            break;

                        default:
                            detail.message = 'An unknown error occured';
                            break;
                    }

                    player.media.error = detail;

                    utils.dispatchEvent.call(player, player.media, 'error');
                },
                onPlaybackQualityChange: function onPlaybackQualityChange() {
                    utils.dispatchEvent.call(player, player.media, 'qualitychange', false, {
                        quality: player.media.quality
                    });
                },
                onPlaybackRateChange: function onPlaybackRateChange(event) {
                    // Get the instance
                    var instance = event.target;

                    // Get current speed
                    player.media.playbackRate = instance.getPlaybackRate();

                    utils.dispatchEvent.call(player, player.media, 'ratechange');
                },
                onReady: function onReady(event) {
                    // Get the instance
                    var instance = event.target;

                    // Get the title
                    youtube.getTitle.call(player, videoId);

                    // Create a faux HTML5 API using the YouTube API
                    player.media.play = function () {
                        instance.playVideo();
                    };

                    player.media.pause = function () {
                        instance.pauseVideo();
                    };

                    player.media.stop = function () {
                        instance.stopVideo();
                    };

                    player.media.duration = instance.getDuration();
                    player.media.paused = true;

                    // Seeking
                    player.media.currentTime = 0;
                    Object.defineProperty(player.media, 'currentTime', {
                        get: function get() {
                            return Number(instance.getCurrentTime());
                        },
                        set: function set(time) {
                            // Vimeo will automatically play on seek
                            var paused = player.media.paused;

                            // Set seeking flag

                            player.media.seeking = true;

                            // Trigger seeking
                            utils.dispatchEvent.call(player, player.media, 'seeking');

                            // Seek after events sent
                            instance.seekTo(time);

                            // Restore pause state
                            if (paused) {
                                player.pause();
                            }
                        }
                    });

                    // Playback speed
                    Object.defineProperty(player.media, 'playbackRate', {
                        get: function get() {
                            return instance.getPlaybackRate();
                        },
                        set: function set(input) {
                            instance.setPlaybackRate(input);
                        }
                    });

                    // Quality
                    Object.defineProperty(player.media, 'quality', {
                        get: function get() {
                            return mapQualityUnit(instance.getPlaybackQuality());
                        },
                        set: function set(input) {
                            var quality = input;

                            // Set via API
                            instance.setPlaybackQuality(mapQualityUnit(quality));

                            // Trigger request event
                            utils.dispatchEvent.call(player, player.media, 'qualityrequested', false, {
                                quality: quality
                            });
                        }
                    });

                    // Volume
                    var volume = player.config.volume;

                    Object.defineProperty(player.media, 'volume', {
                        get: function get() {
                            return volume;
                        },
                        set: function set(input) {
                            volume = input;
                            instance.setVolume(volume * 100);
                            utils.dispatchEvent.call(player, player.media, 'volumechange');
                        }
                    });

                    // Muted
                    var muted = player.config.muted;

                    Object.defineProperty(player.media, 'muted', {
                        get: function get() {
                            return muted;
                        },
                        set: function set(input) {
                            var toggle = utils.is.boolean(input) ? input : muted;
                            muted = toggle;
                            instance[toggle ? 'mute' : 'unMute']();
                            utils.dispatchEvent.call(player, player.media, 'volumechange');
                        }
                    });

                    // Source
                    Object.defineProperty(player.media, 'currentSrc', {
                        get: function get() {
                            return instance.getVideoUrl();
                        }
                    });

                    // Ended
                    Object.defineProperty(player.media, 'ended', {
                        get: function get() {
                            return player.currentTime === player.duration;
                        }
                    });

                    // Get available speeds
                    player.options.speed = instance.getAvailablePlaybackRates();

                    // Set the tabindex to avoid focus entering iframe
                    if (player.supported.ui) {
                        player.media.setAttribute('tabindex', -1);
                    }

                    utils.dispatchEvent.call(player, player.media, 'timeupdate');
                    utils.dispatchEvent.call(player, player.media, 'durationchange');

                    // Reset timer
                    clearInterval(player.timers.buffering);

                    // Setup buffering
                    player.timers.buffering = setInterval(function () {
                        // Get loaded % from YouTube
                        player.media.buffered = instance.getVideoLoadedFraction();

                        // Trigger progress only when we actually buffer something
                        if (player.media.lastBuffered === null || player.media.lastBuffered < player.media.buffered) {
                            utils.dispatchEvent.call(player, player.media, 'progress');
                        }

                        // Set last buffer point
                        player.media.lastBuffered = player.media.buffered;

                        // Bail if we're at 100%
                        if (player.media.buffered === 1) {
                            clearInterval(player.timers.buffering);

                            // Trigger event
                            utils.dispatchEvent.call(player, player.media, 'canplaythrough');
                        }
                    }, 200);

                    // Rebuild UI
                    setTimeout(function () {
                        return ui.build.call(player);
                    }, 50);
                },
                onStateChange: function onStateChange(event) {
                    // Get the instance
                    var instance = event.target;

                    // Reset timer
                    clearInterval(player.timers.playing);

                    // Handle events
                    // -1   Unstarted
                    // 0    Ended
                    // 1    Playing
                    // 2    Paused
                    // 3    Buffering
                    // 5    Video cued
                    switch (event.data) {
                        case -1:
                            // Update scrubber
                            utils.dispatchEvent.call(player, player.media, 'timeupdate');

                            // Get loaded % from YouTube
                            player.media.buffered = instance.getVideoLoadedFraction();
                            utils.dispatchEvent.call(player, player.media, 'progress');

                            break;

                        case 0:
                            player.media.paused = true;

                            // YouTube doesn't support loop for a single video, so mimick it.
                            if (player.media.loop) {
                                // YouTube needs a call to `stopVideo` before playing again
                                instance.stopVideo();
                                instance.playVideo();
                            } else {
                                utils.dispatchEvent.call(player, player.media, 'ended');
                            }

                            break;

                        case 1:
                            // If we were seeking, fire seeked event
                            if (player.media.seeking) {
                                utils.dispatchEvent.call(player, player.media, 'seeked');
                            }
                            player.media.seeking = false;

                            // Only fire play if paused before
                            if (player.media.paused) {
                                utils.dispatchEvent.call(player, player.media, 'play');
                            }
                            player.media.paused = false;

                            utils.dispatchEvent.call(player, player.media, 'playing');

                            // Poll to get playback progress
                            player.timers.playing = setInterval(function () {
                                utils.dispatchEvent.call(player, player.media, 'timeupdate');
                            }, 50);

                            // Check duration again due to YouTube bug
                            // https://github.com/sampotts/plyr/issues/374
                            // https://code.google.com/p/gdata-issues/issues/detail?id=8690
                            if (player.media.duration !== instance.getDuration()) {
                                player.media.duration = instance.getDuration();
                                utils.dispatchEvent.call(player, player.media, 'durationchange');
                            }

                            // Get quality
                            controls.setQualityMenu.call(player, mapQualityUnits(instance.getAvailableQualityLevels()));

                            break;

                        case 2:
                            player.media.paused = true;

                            utils.dispatchEvent.call(player, player.media, 'pause');

                            break;

                        default:
                            break;
                    }

                    utils.dispatchEvent.call(player, player.elements.container, 'statechange', false, {
                        code: event.data
                    });
                }
            }
        });
    }
};

// ==========================================================================

var media = {
    // Setup media
    setup: function setup() {
        // If there's no media, bail
        if (!this.media) {
            this.debug.warn('No media element found!');
            return;
        }

        // Add type class
        utils.toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', this.type), true);

        // Add provider class
        utils.toggleClass(this.elements.container, this.config.classNames.provider.replace('{0}', this.provider), true);

        // Add video class for embeds
        // This will require changes if audio embeds are added
        if (this.isEmbed) {
            utils.toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', 'video'), true);
        }

        // Inject the player wrapper
        if (this.isVideo) {
            // Create the wrapper div
            this.elements.wrapper = utils.createElement('div', {
                class: this.config.classNames.video
            });

            // Wrap the video in a container
            utils.wrap(this.media, this.elements.wrapper);

            // Faux poster container
            this.elements.poster = utils.createElement('div', {
                class: this.config.classNames.poster
            });

            this.elements.wrapper.appendChild(this.elements.poster);
        }

        if (this.isEmbed) {
            switch (this.provider) {
                case 'youtube':
                    youtube.setup.call(this);
                    break;

                case 'vimeo':
                    vimeo.setup.call(this);
                    break;

                default:
                    break;
            }
        } else if (this.isHTML5) {
            html5.extend.call(this);
        }
    }
};

// ==========================================================================

var Ads = function () {
    /**
     * Ads constructor.
     * @param {object} player
     * @return {Ads}
     */
    function Ads(player) {
        var _this = this;

        classCallCheck(this, Ads);

        this.player = player;
        this.publisherId = player.config.ads.publisherId;
        this.playing = false;
        this.initialized = false;
        this.elements = {
            container: null,
            displayContainer: null
        };
        this.manager = null;
        this.loader = null;
        this.cuePoints = null;
        this.events = {};
        this.safetyTimer = null;
        this.countdownTimer = null;

        // Setup a promise to resolve when the IMA manager is ready
        this.managerPromise = new Promise(function (resolve, reject) {
            // The ad is loaded and ready
            _this.on('loaded', resolve);

            // Ads failed
            _this.on('error', reject);
        });

        this.load();
    }

    createClass(Ads, [{
        key: 'load',


        /**
         * Load the IMA SDK
         */
        value: function load() {
            var _this2 = this;

            if (this.enabled) {
                // Check if the Google IMA3 SDK is loaded or load it ourselves
                if (!utils.is.object(window.google) || !utils.is.object(window.google.ima)) {
                    utils.loadScript(this.player.config.urls.googleIMA.sdk).then(function () {
                        _this2.ready();
                    }).catch(function () {
                        // Script failed to load or is blocked
                        _this2.trigger('error', new Error('Google IMA SDK failed to load'));
                    });
                } else {
                    this.ready();
                }
            }
        }

        /**
         * Get the ads instance ready
         */

    }, {
        key: 'ready',
        value: function ready() {
            var _this3 = this;

            // Start ticking our safety timer. If the whole advertisement
            // thing doesn't resolve within our set time; we bail
            this.startSafetyTimer(12000, 'ready()');

            // Clear the safety timer
            this.managerPromise.then(function () {
                _this3.clearSafetyTimer('onAdsManagerLoaded()');
            });

            // Set listeners on the Plyr instance
            this.listeners();

            // Setup the IMA SDK
            this.setupIMA();
        }

        // Build the default tag URL

    }, {
        key: 'setupIMA',


        /**
         * In order for the SDK to display ads for our video, we need to tell it where to put them,
         * so here we define our ad container. This div is set up to render on top of the video player.
         * Using the code below, we tell the SDK to render ads within that div. We also provide a
         * handle to the content video player - the SDK will poll the current time of our player to
         * properly place mid-rolls. After we create the ad display container, we initialize it. On
         * mobile devices, this initialization is done as the result of a user action.
         */
        value: function setupIMA() {
            // Create the container for our advertisements
            this.elements.container = utils.createElement('div', {
                class: this.player.config.classNames.ads
            });
            this.player.elements.container.appendChild(this.elements.container);

            // So we can run VPAID2
            google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

            // Set language
            google.ima.settings.setLocale(this.player.config.ads.language);

            // We assume the adContainer is the video container of the plyr element
            // that will house the ads
            this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container);

            // Request video ads to be pre-loaded
            this.requestAds();
        }

        /**
         * Request advertisements
         */

    }, {
        key: 'requestAds',
        value: function requestAds() {
            var _this4 = this;

            var container = this.player.elements.container;


            try {
                // Create ads loader
                this.loader = new google.ima.AdsLoader(this.elements.displayContainer);

                // Listen and respond to ads loaded and error events
                this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (event) {
                    return _this4.onAdsManagerLoaded(event);
                }, false);
                this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (error) {
                    return _this4.onAdError(error);
                }, false);

                // Request video ads
                var request = new google.ima.AdsRequest();
                request.adTagUrl = this.tagUrl;

                // Specify the linear and nonlinear slot sizes. This helps the SDK
                // to select the correct creative if multiple are returned
                request.linearAdSlotWidth = container.offsetWidth;
                request.linearAdSlotHeight = container.offsetHeight;
                request.nonLinearAdSlotWidth = container.offsetWidth;
                request.nonLinearAdSlotHeight = container.offsetHeight;

                // We only overlay ads as we only support video.
                request.forceNonLinearFullSlot = false;

                // Mute based on current state
                request.setAdWillPlayMuted(!this.player.muted);

                this.loader.requestAds(request);
            } catch (e) {
                this.onAdError(e);
            }
        }

        /**
         * Update the ad countdown
         * @param {boolean} start
         */

    }, {
        key: 'pollCountdown',
        value: function pollCountdown() {
            var _this5 = this;

            var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!start) {
                clearInterval(this.countdownTimer);
                this.elements.container.removeAttribute('data-badge-text');
                return;
            }

            var update = function update() {
                var time = utils.formatTime(Math.max(_this5.manager.getRemainingTime(), 0));
                var label = i18n.get('advertisement', _this5.player.config) + ' - ' + time;
                _this5.elements.container.setAttribute('data-badge-text', label);
            };

            this.countdownTimer = setInterval(update, 100);
        }

        /**
         * This method is called whenever the ads are ready inside the AdDisplayContainer
         * @param {Event} adsManagerLoadedEvent
         */

    }, {
        key: 'onAdsManagerLoaded',
        value: function onAdsManagerLoaded(event) {
            var _this6 = this;

            // Get the ads manager
            var settings = new google.ima.AdsRenderingSettings();

            // Tell the SDK to save and restore content video state on our behalf
            settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
            settings.enablePreloading = true;

            // The SDK is polling currentTime on the contentPlayback. And needs a duration
            // so it can determine when to start the mid- and post-roll
            this.manager = event.getAdsManager(this.player, settings);

            // Get the cue points for any mid-rolls by filtering out the pre- and post-roll
            this.cuePoints = this.manager.getCuePoints();

            // Add advertisement cue's within the time line if available
            if (!utils.is.empty(this.cuePoints)) {
                this.cuePoints.forEach(function (cuePoint) {
                    if (cuePoint !== 0 && cuePoint !== -1 && cuePoint < _this6.player.duration) {
                        var seekElement = _this6.player.elements.progress;

                        if (utils.is.element(seekElement)) {
                            var cuePercentage = 100 / _this6.player.duration * cuePoint;
                            var cue = utils.createElement('span', {
                                class: _this6.player.config.classNames.cues
                            });

                            cue.style.left = cuePercentage.toString() + '%';
                            seekElement.appendChild(cue);
                        }
                    }
                });
            }

            // Get skippable state
            // TODO: Skip button
            // this.player.debug.warn(this.manager.getAdSkippableState());

            // Set volume to match player
            this.manager.setVolume(this.player.volume);

            // Add listeners to the required events
            // Advertisement error events
            this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (error) {
                return _this6.onAdError(error);
            });

            // Advertisement regular events
            Object.keys(google.ima.AdEvent.Type).forEach(function (type) {
                _this6.manager.addEventListener(google.ima.AdEvent.Type[type], function (event) {
                    return _this6.onAdEvent(event);
                });
            });

            // Resolve our adsManager
            this.trigger('loaded');
        }

        /**
         * This is where all the event handling takes place. Retrieve the ad from the event. Some
         * events (e.g. ALL_ADS_COMPLETED) don't have the ad object associated
         * https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdEvent.Type
         * @param {Event} event
         */

    }, {
        key: 'onAdEvent',
        value: function onAdEvent(event) {
            var _this7 = this;

            var container = this.player.elements.container;

            // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
            // don't have ad object associated

            var ad = event.getAd();

            // Proxy event
            var dispatchEvent = function dispatchEvent(type) {
                var event = 'ads' + type.replace(/_/g, '').toLowerCase();
                utils.dispatchEvent.call(_this7.player, _this7.player.media, event);
            };

            switch (event.type) {
                case google.ima.AdEvent.Type.LOADED:
                    // This is the first event sent for an ad - it is possible to determine whether the
                    // ad is a video ad or an overlay
                    this.trigger('loaded');

                    // Bubble event
                    dispatchEvent(event.type);

                    // Start countdown
                    this.pollCountdown(true);

                    if (!ad.isLinear()) {
                        // Position AdDisplayContainer correctly for overlay
                        ad.width = container.offsetWidth;
                        ad.height = container.offsetHeight;
                    }

                    // console.info('Ad type: ' + event.getAd().getAdPodInfo().getPodIndex());
                    // console.info('Ad time: ' + event.getAd().getAdPodInfo().getTimeOffset());
                    break;

                case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                    // All ads for the current videos are done. We can now request new advertisements
                    // in case the video is re-played

                    // Fire event
                    dispatchEvent(event.type);

                    // TODO: Example for what happens when a next video in a playlist would be loaded.
                    // So here we load a new video when all ads are done.
                    // Then we load new ads within a new adsManager. When the video
                    // Is started - after - the ads are loaded, then we get ads.
                    // You can also easily test cancelling and reloading by running
                    // player.ads.cancel() and player.ads.play from the console I guess.
                    // this.player.source = {
                    //     type: 'video',
                    //     title: 'View From A Blue Moon',
                    //     sources: [{
                    //         src:
                    // 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4', type:
                    // 'video/mp4', }], poster:
                    // 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg', tracks:
                    // [ { kind: 'captions', label: 'English', srclang: 'en', src:
                    // 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
                    // default: true, }, { kind: 'captions', label: 'French', srclang: 'fr', src:
                    // 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt', }, ],
                    // };

                    // TODO: So there is still this thing where a video should only be allowed to start
                    // playing when the IMA SDK is ready or has failed

                    this.loadAds();
                    break;

                case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                    // This event indicates the ad has started - the video player can adjust the UI,
                    // for example display a pause button and remaining time. Fired when content should
                    // be paused. This usually happens right before an ad is about to cover the content

                    dispatchEvent(event.type);

                    this.pauseContent();

                    break;

                case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                    // This event indicates the ad has finished - the video player can perform
                    // appropriate UI actions, such as removing the timer for remaining time detection.
                    // Fired when content should be resumed. This usually happens when an ad finishes
                    // or collapses

                    dispatchEvent(event.type);

                    this.pollCountdown();

                    this.resumeContent();

                    break;

                case google.ima.AdEvent.Type.STARTED:
                case google.ima.AdEvent.Type.MIDPOINT:
                case google.ima.AdEvent.Type.COMPLETE:
                case google.ima.AdEvent.Type.IMPRESSION:
                case google.ima.AdEvent.Type.CLICK:
                    dispatchEvent(event.type);
                    break;

                default:
                    break;
            }
        }

        /**
         * Any ad error handling comes through here
         * @param {Event} event
         */

    }, {
        key: 'onAdError',
        value: function onAdError(event) {
            this.cancel();
            this.player.debug.warn('Ads error', event);
        }

        /**
         * Setup hooks for Plyr and window events. This ensures
         * the mid- and post-roll launch at the correct time. And
         * resize the advertisement when the player resizes
         */

    }, {
        key: 'listeners',
        value: function listeners() {
            var _this8 = this;

            var container = this.player.elements.container;

            var time = void 0;

            // Add listeners to the required events
            this.player.on('ended', function () {
                _this8.loader.contentComplete();
            });

            this.player.on('seeking', function () {
                time = _this8.player.currentTime;
                return time;
            });

            this.player.on('seeked', function () {
                var seekedTime = _this8.player.currentTime;

                if (utils.is.empty(_this8.cuePoints)) {
                    return;
                }

                _this8.cuePoints.forEach(function (cuePoint, index) {
                    if (time < cuePoint && cuePoint < seekedTime) {
                        _this8.manager.discardAdBreak();
                        _this8.cuePoints.splice(index, 1);
                    }
                });
            });

            // Listen to the resizing of the window. And resize ad accordingly
            // TODO: eventually implement ResizeObserver
            window.addEventListener('resize', function () {
                if (_this8.manager) {
                    _this8.manager.resize(container.offsetWidth, container.offsetHeight, google.ima.ViewMode.NORMAL);
                }
            });
        }

        /**
         * Initialize the adsManager and start playing advertisements
         */

    }, {
        key: 'play',
        value: function play() {
            var _this9 = this;

            var container = this.player.elements.container;


            if (!this.managerPromise) {
                this.resumeContent();
            }

            // Play the requested advertisement whenever the adsManager is ready
            this.managerPromise.then(function () {
                // Initialize the container. Must be done via a user action on mobile devices
                _this9.elements.displayContainer.initialize();

                try {
                    if (!_this9.initialized) {
                        // Initialize the ads manager. Ad rules playlist will start at this time
                        _this9.manager.init(container.offsetWidth, container.offsetHeight, google.ima.ViewMode.NORMAL);

                        // Call play to start showing the ad. Single video and overlay ads will
                        // start at this time; the call will be ignored for ad rules
                        _this9.manager.start();
                    }

                    _this9.initialized = true;
                } catch (adError) {
                    // An error may be thrown if there was a problem with the
                    // VAST response
                    _this9.onAdError(adError);
                }
            }).catch(function () {});
        }

        /**
         * Resume our video
         */

    }, {
        key: 'resumeContent',
        value: function resumeContent() {
            // Hide the advertisement container
            this.elements.container.style.zIndex = '';

            // Ad is stopped
            this.playing = false;

            // Play our video
            if (this.player.currentTime < this.player.duration) {
                this.player.play();
            }
        }

        /**
         * Pause our video
         */

    }, {
        key: 'pauseContent',
        value: function pauseContent() {
            // Show the advertisement container
            this.elements.container.style.zIndex = 3;

            // Ad is playing.
            this.playing = true;

            // Pause our video.
            this.player.pause();
        }

        /**
         * Destroy the adsManager so we can grab new ads after this. If we don't then we're not
         * allowed to call new ads based on google policies, as they interpret this as an accidental
         * video requests. https://developers.google.com/interactive-
         * media-ads/docs/sdks/android/faq#8
         */

    }, {
        key: 'cancel',
        value: function cancel() {
            // Pause our video
            if (this.initialized) {
                this.resumeContent();
            }

            // Tell our instance that we're done for now
            this.trigger('error');

            // Re-create our adsManager
            this.loadAds();
        }

        /**
         * Re-create our adsManager
         */

    }, {
        key: 'loadAds',
        value: function loadAds() {
            var _this10 = this;

            // Tell our adsManager to go bye bye
            this.managerPromise.then(function () {
                // Destroy our adsManager
                if (_this10.manager) {
                    _this10.manager.destroy();
                }

                // Re-set our adsManager promises
                _this10.managerPromise = new Promise(function (resolve) {
                    _this10.on('loaded', resolve);
                    _this10.player.debug.log(_this10.manager);
                });

                // Now request some new advertisements
                _this10.requestAds();
            }).catch(function () {});
        }

        /**
         * Handles callbacks after an ad event was invoked
         * @param {string} event - Event type
         */

    }, {
        key: 'trigger',
        value: function trigger(event) {
            var _this11 = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            var handlers = this.events[event];

            if (utils.is.array(handlers)) {
                handlers.forEach(function (handler) {
                    if (utils.is.function(handler)) {
                        handler.apply(_this11, args);
                    }
                });
            }
        }

        /**
         * Add event listeners
         * @param {string} event - Event type
         * @param {function} callback - Callback for when event occurs
         * @return {Ads}
         */

    }, {
        key: 'on',
        value: function on(event, callback) {
            if (!utils.is.array(this.events[event])) {
                this.events[event] = [];
            }

            this.events[event].push(callback);

            return this;
        }

        /**
         * Setup a safety timer for when the ad network doesn't respond for whatever reason.
         * The advertisement has 12 seconds to get its things together. We stop this timer when the
         * advertisement is playing, or when a user action is required to start, then we clear the
         * timer on ad ready
         * @param {number} time
         * @param {string} from
         */

    }, {
        key: 'startSafetyTimer',
        value: function startSafetyTimer(time, from) {
            var _this12 = this;

            this.player.debug.log('Safety timer invoked from: ' + from);

            this.safetyTimer = setTimeout(function () {
                _this12.cancel();
                _this12.clearSafetyTimer('startSafetyTimer()');
            }, time);
        }

        /**
         * Clear our safety timer(s)
         * @param {string} from
         */

    }, {
        key: 'clearSafetyTimer',
        value: function clearSafetyTimer(from) {
            if (!utils.is.nullOrUndefined(this.safetyTimer)) {
                this.player.debug.log('Safety timer cleared from: ' + from);

                clearTimeout(this.safetyTimer);
                this.safetyTimer = null;
            }
        }
    }, {
        key: 'enabled',
        get: function get$$1() {
            return this.player.isVideo && this.player.config.ads.enabled && !utils.is.empty(this.publisherId);
        }
    }, {
        key: 'tagUrl',
        get: function get$$1() {
            var params = {
                AV_PUBLISHERID: '58c25bb0073ef448b1087ad6',
                AV_CHANNELID: '5a0458dc28a06145e4519d21',
                AV_URL: location.hostname,
                cb: Date.now(),
                AV_WIDTH: 640,
                AV_HEIGHT: 480,
                AV_CDIM2: this.publisherId
            };

            var base = 'https://go.aniview.com/api/adserver6/vast/';

            return base + '?' + utils.buildUrlParams(params);
        }
    }]);
    return Ads;
}();

// ==========================================================================

var source = {
    // Add elements to HTML5 media (source, tracks, etc)
    insertElements: function insertElements(type, attributes) {
        var _this = this;

        if (utils.is.string(attributes)) {
            utils.insertElement(type, this.media, {
                src: attributes
            });
        } else if (utils.is.array(attributes)) {
            attributes.forEach(function (attribute) {
                utils.insertElement(type, _this.media, attribute);
            });
        }
    },


    // Update source
    // Sources are not checked for support so be careful
    change: function change(input) {
        var _this2 = this;

        if (!utils.is.object(input) || !('sources' in input) || !input.sources.length) {
            this.debug.warn('Invalid source format');
            return;
        }

        // Cancel current network requests
        html5.cancelRequests.call(this);

        // Destroy instance and re-setup
        this.destroy.call(this, function () {
            // Reset quality options
            _this2.options.quality = [];

            // Remove elements
            utils.removeElement(_this2.media);
            _this2.media = null;

            // Reset class name
            if (utils.is.element(_this2.elements.container)) {
                _this2.elements.container.removeAttribute('class');
            }

            // Set the type and provider
            _this2.type = input.type;
            _this2.provider = !utils.is.empty(input.sources[0].provider) ? input.sources[0].provider : providers.html5;

            // Check for support
            _this2.supported = support.check(_this2.type, _this2.provider, _this2.config.playsinline);

            // Create new markup
            switch (_this2.provider + ':' + _this2.type) {
                case 'html5:video':
                    _this2.media = utils.createElement('video');
                    break;

                case 'html5:audio':
                    _this2.media = utils.createElement('audio');
                    break;

                case 'youtube:video':
                case 'vimeo:video':
                    _this2.media = utils.createElement('div', {
                        src: input.sources[0].src
                    });
                    break;

                default:
                    break;
            }

            // Inject the new element
            _this2.elements.container.appendChild(_this2.media);

            // Autoplay the new source?
            if (utils.is.boolean(input.autoplay)) {
                _this2.config.autoplay = input.autoplay;
            }

            // Set attributes for audio and video
            if (_this2.isHTML5) {
                if (_this2.config.crossorigin) {
                    _this2.media.setAttribute('crossorigin', '');
                }
                if (_this2.config.autoplay) {
                    _this2.media.setAttribute('autoplay', '');
                }
                if (!utils.is.empty(input.poster)) {
                    _this2.poster = input.poster;
                }
                if (_this2.config.loop.active) {
                    _this2.media.setAttribute('loop', '');
                }
                if (_this2.config.muted) {
                    _this2.media.setAttribute('muted', '');
                }
                if (_this2.config.playsinline) {
                    _this2.media.setAttribute('playsinline', '');
                }
            }

            // Restore class hook
            ui.addStyleHook.call(_this2);

            // Set new sources for html5
            if (_this2.isHTML5) {
                source.insertElements.call(_this2, 'source', input.sources);
            }

            // Set video title
            _this2.config.title = input.title;

            // Set up from scratch
            media.setup.call(_this2);

            // HTML5 stuff
            if (_this2.isHTML5) {
                // Setup captions
                if ('tracks' in input) {
                    source.insertElements.call(_this2, 'track', input.tracks);
                }

                // Load HTML5 sources
                _this2.media.load();
            }

            // If HTML5 or embed but not fully supported, setupInterface and call ready now
            if (_this2.isHTML5 || _this2.isEmbed && !_this2.supported.ui) {
                // Setup interface
                ui.build.call(_this2);
            }

            // Update the fullscreen support
            _this2.fullscreen.update();
        }, true);
    }
};

// ==========================================================================

var Storage = function () {
    function Storage(player) {
        classCallCheck(this, Storage);

        this.enabled = player.config.storage.enabled;
        this.key = player.config.storage.key;
    }

    // Check for actual support (see if we can use it)


    createClass(Storage, [{
        key: 'get',
        value: function get$$1(key) {
            if (!Storage.supported) {
                return null;
            }

            var store = window.localStorage.getItem(this.key);

            if (utils.is.empty(store)) {
                return null;
            }

            var json = JSON.parse(store);

            return utils.is.string(key) && key.length ? json[key] : json;
        }
    }, {
        key: 'set',
        value: function set$$1(object) {
            // Bail if we don't have localStorage support or it's disabled
            if (!Storage.supported || !this.enabled) {
                return;
            }

            // Can only store objectst
            if (!utils.is.object(object)) {
                return;
            }

            // Get current storage
            var storage = this.get();

            // Default to empty object
            if (utils.is.empty(storage)) {
                storage = {};
            }

            // Update the working copy of the values
            utils.extend(storage, object);

            // Update storage
            window.localStorage.setItem(this.key, JSON.stringify(storage));
        }
    }], [{
        key: 'supported',
        get: function get$$1() {
            try {
                if (!('localStorage' in window)) {
                    return false;
                }

                var test = '___test';

                // Try to use it (it might be disabled, e.g. user is in private mode)
                // see: https://github.com/sampotts/plyr/issues/131
                window.localStorage.setItem(test, test);
                window.localStorage.removeItem(test);

                return true;
            } catch (e) {
                return false;
            }
        }
    }]);
    return Storage;
}();

// ==========================================================================

// Private properties
// TODO: Use a WeakMap for private globals
// const globals = new WeakMap();

// Plyr instance

var Plyr = function () {
    function Plyr(target, options) {
        var _this = this;

        classCallCheck(this, Plyr);

        this.timers = {};

        // State
        this.ready = false;
        this.loading = false;
        this.failed = false;

        // Touch device
        this.touch = support.touch;

        // Set the media element
        this.media = target;

        // String selector passed
        if (utils.is.string(this.media)) {
            this.media = document.querySelectorAll(this.media);
        }

        // jQuery, NodeList or Array passed, use first element
        if (window.jQuery && this.media instanceof jQuery || utils.is.nodeList(this.media) || utils.is.array(this.media)) {
            // eslint-disable-next-line
            this.media = this.media[0];
        }

        // Set config
        this.config = utils.extend({}, defaults$1, options || {}, function () {
            try {
                return JSON.parse(_this.media.getAttribute('data-plyr-config'));
            } catch (e) {
                return {};
            }
        }());

        // Elements cache
        this.elements = {
            container: null,
            buttons: {},
            display: {},
            progress: {},
            inputs: {},
            settings: {
                menu: null,
                panes: {},
                tabs: {}
            },
            captions: null
        };

        // Captions
        this.captions = {
            active: null,
            currentTrack: null
        };

        // Fullscreen
        this.fullscreen = {
            active: false
        };

        // Options
        this.options = {
            speed: [],
            quality: [],
            captions: []
        };

        // Debugging
        // TODO: move to globals
        this.debug = new Console(this.config.debug);

        // Log config options and support
        this.debug.log('Config', this.config);
        this.debug.log('Support', support);

        // We need an element to setup
        if (utils.is.nullOrUndefined(this.media) || !utils.is.element(this.media)) {
            this.debug.error('Setup failed: no suitable element passed');
            return;
        }

        // Bail if the element is initialized
        if (this.media.plyr) {
            this.debug.warn('Target already setup');
            return;
        }

        // Bail if not enabled
        if (!this.config.enabled) {
            this.debug.error('Setup failed: disabled by config');
            return;
        }

        // Bail if disabled or no basic support
        // You may want to disable certain UAs etc
        if (!support.check().api) {
            this.debug.error('Setup failed: no support');
            return;
        }

        // Cache original element state for .destroy()
        var clone = this.media.cloneNode(true);
        clone.autoplay = false;
        this.elements.original = clone;

        // Set media type based on tag or data attribute
        // Supported: video, audio, vimeo, youtube
        var type = this.media.tagName.toLowerCase();

        // Embed properties
        var iframe = null;
        var url = null;
        var params = null;

        // Different setup based on type
        switch (type) {
            case 'div':
                // Find the frame
                iframe = this.media.querySelector('iframe');

                // <iframe> type
                if (utils.is.element(iframe)) {
                    // Detect provider
                    url = iframe.getAttribute('src');
                    this.provider = utils.getProviderByUrl(url);

                    // Rework elements
                    this.elements.container = this.media;
                    this.media = iframe;

                    // Reset classname
                    this.elements.container.className = '';

                    // Get attributes from URL and set config
                    params = utils.getUrlParams(url);
                    if (!utils.is.empty(params)) {
                        var truthy = ['1', 'true'];

                        if (truthy.includes(params.autoplay)) {
                            this.config.autoplay = true;
                        }
                        if (truthy.includes(params.loop)) {
                            this.config.loop.active = true;
                        }

                        // TODO: replace fullscreen.iosNative with this playsinline config option
                        // YouTube requires the playsinline in the URL
                        if (this.isYouTube) {
                            this.config.playsinline = truthy.includes(params.playsinline);
                        } else {
                            this.config.playsinline = true;
                        }
                    }
                } else {
                    // <div> with attributes
                    this.provider = this.media.getAttribute(this.config.attributes.embed.provider);

                    // Remove attribute
                    this.media.removeAttribute(this.config.attributes.embed.provider);
                }

                // Unsupported or missing provider
                if (utils.is.empty(this.provider) || !Object.keys(providers).includes(this.provider)) {
                    this.debug.error('Setup failed: Invalid provider');
                    return;
                }

                // Audio will come later for external providers
                this.type = types.video;

                break;

            case 'video':
            case 'audio':
                this.type = type;
                this.provider = providers.html5;

                // Get config from attributes
                if (this.media.hasAttribute('crossorigin')) {
                    this.config.crossorigin = true;
                }
                if (this.media.hasAttribute('autoplay')) {
                    this.config.autoplay = true;
                }
                if (this.media.hasAttribute('playsinline')) {
                    this.config.playsinline = true;
                }
                if (this.media.hasAttribute('muted')) {
                    this.config.muted = true;
                }
                if (this.media.hasAttribute('loop')) {
                    this.config.loop.active = true;
                }

                break;

            default:
                this.debug.error('Setup failed: unsupported type');
                return;
        }

        // Check for support again but with type
        this.supported = support.check(this.type, this.provider, this.config.playsinline);

        // If no support for even API, bail
        if (!this.supported.api) {
            this.debug.error('Setup failed: no support');
            return;
        }

        // Create listeners
        this.listeners = new Listeners(this);

        // Setup local storage for user settings
        this.storage = new Storage(this);

        // Store reference
        this.media.plyr = this;

        // Wrap media
        if (!utils.is.element(this.elements.container)) {
            this.elements.container = utils.createElement('div');
            utils.wrap(this.media, this.elements.container);
        }

        // Allow focus to be captured
        this.elements.container.setAttribute('tabindex', 0);

        // Add style hook
        ui.addStyleHook.call(this);

        // Setup media
        media.setup.call(this);

        // Listen for events if debugging
        if (this.config.debug) {
            utils.on(this.elements.container, this.config.events.join(' '), function (event) {
                _this.debug.log('event: ' + event.type);
            });
        }

        // Setup interface
        // If embed but not fully supported, build interface now to avoid flash of controls
        if (this.isHTML5 || this.isEmbed && !this.supported.ui) {
            ui.build.call(this);
        }

        // Container listeners
        this.listeners.container();

        // Global listeners
        this.listeners.global();

        // Setup fullscreen
        this.fullscreen = new Fullscreen(this);

        // Setup ads if provided
        this.ads = new Ads(this);

        // Autoplay if required
        if (this.config.autoplay) {
            this.play();
        }
    }

    // ---------------------------------------
    // API
    // ---------------------------------------

    /**
     * Types and provider helpers
     */


    createClass(Plyr, [{
        key: 'play',


        /**
         * Play the media, or play the advertisement (if they are not blocked)
         */
        value: function play() {
            if (!utils.is.function(this.media.play)) {
                return null;
            }

            // Return the promise (for HTML5)
            return this.media.play();
        }

        /**
         * Pause the media
         */

    }, {
        key: 'pause',
        value: function pause() {
            if (!this.playing || !utils.is.function(this.media.pause)) {
                return;
            }

            this.media.pause();
        }

        /**
         * Get playing state
         */

    }, {
        key: 'togglePlay',


        /**
         * Toggle playback based on current status
         * @param {boolean} input
         */
        value: function togglePlay(input) {
            // Toggle based on current state if nothing passed
            var toggle = utils.is.boolean(input) ? input : !this.playing;

            if (toggle) {
                this.play();
            } else {
                this.pause();
            }
        }

        /**
         * Stop playback
         */

    }, {
        key: 'stop',
        value: function stop() {
            if (this.isHTML5) {
                this.pause();
                this.restart();
            } else if (utils.is.function(this.media.stop)) {
                this.media.stop();
            }
        }

        /**
         * Restart playback
         */

    }, {
        key: 'restart',
        value: function restart() {
            this.currentTime = 0;
        }

        /**
         * Rewind
         * @param {number} seekTime - how far to rewind in seconds. Defaults to the config.seekTime
         */

    }, {
        key: 'rewind',
        value: function rewind(seekTime) {
            this.currentTime = this.currentTime - (utils.is.number(seekTime) ? seekTime : this.config.seekTime);
        }

        /**
         * Fast forward
         * @param {number} seekTime - how far to fast forward in seconds. Defaults to the config.seekTime
         */

    }, {
        key: 'forward',
        value: function forward(seekTime) {
            this.currentTime = this.currentTime + (utils.is.number(seekTime) ? seekTime : this.config.seekTime);
        }

        /**
         * Seek to a time
         * @param {number} input - where to seek to in seconds. Defaults to 0 (the start)
         */

    }, {
        key: 'increaseVolume',


        /**
         * Increase volume
         * @param {boolean} step - How much to decrease by (between 0 and 1)
         */
        value: function increaseVolume(step) {
            var volume = this.media.muted ? 0 : this.volume;
            this.volume = volume + (utils.is.number(step) ? step : 1);
        }

        /**
         * Decrease volume
         * @param {boolean} step - How much to decrease by (between 0 and 1)
         */

    }, {
        key: 'decreaseVolume',
        value: function decreaseVolume(step) {
            var volume = this.media.muted ? 0 : this.volume;
            this.volume = volume - (utils.is.number(step) ? step : 1);
        }

        /**
         * Set muted state
         * @param {boolean} mute
         */

    }, {
        key: 'toggleCaptions',


        /**
         * Toggle captions
         * @param {boolean} input - Whether to enable captions
         */
        value: function toggleCaptions(input) {
            // If there's no full support
            if (!this.supported.ui) {
                return;
            }

            // If the method is called without parameter, toggle based on current value
            var show = utils.is.boolean(input) ? input : !this.elements.container.classList.contains(this.config.classNames.captions.active);

            // Nothing to change...
            if (this.captions.active === show) {
                return;
            }

            // Set global
            this.captions.active = show;

            // Toggle state
            utils.toggleState(this.elements.buttons.captions, this.captions.active);

            // Add class hook
            utils.toggleClass(this.elements.container, this.config.classNames.captions.active, this.captions.active);

            // Trigger an event
            utils.dispatchEvent.call(this, this.media, this.captions.active ? 'captionsenabled' : 'captionsdisabled');
        }

        /**
         * Set the captions language
         * @param {string} - Two character ISO language code (e.g. EN, FR, PT, etc)
         */

    }, {
        key: 'airplay',


        /**
         * Trigger the airplay dialog
         * TODO: update player with state, support, enabled
         */
        value: function airplay() {
            // Show dialog if supported
            if (support.airplay) {
                this.media.webkitShowPlaybackTargetPicker();
            }
        }

        /**
         * Toggle the player controls
         * @param {boolean} toggle - Whether to show the controls
         */

    }, {
        key: 'toggleControls',
        value: function toggleControls(toggle) {
            var _this2 = this;

            // We need controls of course...
            if (!utils.is.element(this.elements.controls)) {
                return;
            }

            // Don't hide if no UI support or it's audio
            if (!this.supported.ui || this.isAudio) {
                return;
            }

            var delay = 0;
            var show = toggle;
            var isEnterFullscreen = false;

            // Get toggle state if not set
            if (!utils.is.boolean(toggle)) {
                if (utils.is.event(toggle)) {
                    // Is the enter fullscreen event
                    isEnterFullscreen = toggle.type === 'enterfullscreen';

                    // Events that show the controls
                    var showEvents = ['touchstart', 'touchmove', 'mouseenter', 'mousemove', 'focusin'];

                    // Events that delay hiding
                    var delayEvents = ['touchmove', 'touchend', 'mousemove'];

                    // Whether to show controls
                    show = showEvents.includes(toggle.type);

                    // Delay hiding on move events
                    if (delayEvents.includes(toggle.type)) {
                        delay = 2000;
                    }

                    // Delay a little more for keyboard users
                    if (!this.touch && toggle.type === 'focusin') {
                        delay = 3000;
                        utils.toggleClass(this.elements.controls, this.config.classNames.noTransition, true);
                    }
                } else {
                    show = utils.hasClass(this.elements.container, this.config.classNames.hideControls);
                }
            }

            // Clear timer on every call
            clearTimeout(this.timers.controls);

            // If the mouse is not over the controls, set a timeout to hide them
            if (show || this.paused || this.loading) {
                // Check if controls toggled
                var toggled = utils.toggleClass(this.elements.container, this.config.classNames.hideControls, false);

                // Trigger event
                if (toggled) {
                    utils.dispatchEvent.call(this, this.media, 'controlsshown');
                }

                // Always show controls when paused or if touch
                if (this.paused || this.loading) {
                    return;
                }

                // Delay for hiding on touch
                if (this.touch) {
                    delay = 3000;
                }
            }

            // If toggle is false or if we're playing (regardless of toggle),
            // then set the timer to hide the controls
            if (!show || this.playing) {
                this.timers.controls = setTimeout(function () {
                    // We need controls of course...
                    if (!utils.is.element(_this2.elements.controls)) {
                        return;
                    }

                    // If the mouse is over the controls (and not entering fullscreen), bail
                    if ((_this2.elements.controls.pressed || _this2.elements.controls.hover) && !isEnterFullscreen) {
                        return;
                    }

                    // Restore transition behaviour
                    if (!utils.hasClass(_this2.elements.container, _this2.config.classNames.hideControls)) {
                        utils.toggleClass(_this2.elements.controls, _this2.config.classNames.noTransition, false);
                    }

                    // Set hideControls class
                    var toggled = utils.toggleClass(_this2.elements.container, _this2.config.classNames.hideControls, _this2.config.hideControls);

                    // Trigger event and close menu
                    if (toggled) {
                        utils.dispatchEvent.call(_this2, _this2.media, 'controlshidden');

                        if (_this2.config.controls.includes('settings') && !utils.is.empty(_this2.config.settings)) {
                            controls.toggleMenu.call(_this2, false);
                        }
                    }
                }, delay);
            }
        }

        /**
         * Add event listeners
         * @param {string} event - Event type
         * @param {function} callback - Callback for when event occurs
         */

    }, {
        key: 'on',
        value: function on(event, callback) {
            utils.on(this.elements.container, event, callback);
        }

        /**
         * Remove event listeners
         * @param {string} event - Event type
         * @param {function} callback - Callback for when event occurs
         */

    }, {
        key: 'off',
        value: function off(event, callback) {
            utils.off(this.elements.container, event, callback);
        }

        /**
         * Destroy an instance
         * Event listeners are removed when elements are removed
         * http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
         * @param {function} callback - Callback for when destroy is complete
         * @param {boolean} soft - Whether it's a soft destroy (for source changes etc)
         */

    }, {
        key: 'destroy',
        value: function destroy(callback) {
            var _this3 = this;

            var soft = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!this.ready) {
                return;
            }

            var done = function done() {
                // Reset overflow (incase destroyed while in fullscreen)
                document.body.style.overflow = '';

                // GC for embed
                _this3.embed = null;

                // If it's a soft destroy, make minimal changes
                if (soft) {
                    if (Object.keys(_this3.elements).length) {
                        // Remove elements
                        utils.removeElement(_this3.elements.buttons.play);
                        utils.removeElement(_this3.elements.captions);
                        utils.removeElement(_this3.elements.controls);
                        utils.removeElement(_this3.elements.wrapper);

                        // Clear for GC
                        _this3.elements.buttons.play = null;
                        _this3.elements.captions = null;
                        _this3.elements.controls = null;
                        _this3.elements.wrapper = null;
                    }

                    // Callback
                    if (utils.is.function(callback)) {
                        callback();
                    }
                } else {
                    // Unbind listeners
                    _this3.listeners.clear();

                    // Replace the container with the original element provided
                    utils.replaceElement(_this3.elements.original, _this3.elements.container);

                    // Event
                    utils.dispatchEvent.call(_this3, _this3.elements.original, 'destroyed', true);

                    // Callback
                    if (utils.is.function(callback)) {
                        callback.call(_this3.elements.original);
                    }

                    // Reset state
                    _this3.ready = false;

                    // Clear for garbage collection
                    setTimeout(function () {
                        _this3.elements = null;
                        _this3.media = null;
                    }, 200);
                }
            };

            // Stop playback
            this.stop();

            // Type specific stuff
            switch (this.provider + ':' + this.type) {
                case 'html5:video':
                case 'html5:audio':
                    // Clear timeout
                    clearTimeout(this.timers.loading);

                    // Restore native video controls
                    ui.toggleNativeControls.call(this, true);

                    // Clean up
                    done();

                    break;

                case 'youtube:video':
                    // Clear timers
                    clearInterval(this.timers.buffering);
                    clearInterval(this.timers.playing);

                    // Destroy YouTube API
                    if (this.embed !== null && utils.is.function(this.embed.destroy)) {
                        this.embed.destroy();
                    }

                    // Clean up
                    done();

                    break;

                case 'vimeo:video':
                    // Destroy Vimeo API
                    // then clean up (wait, to prevent postmessage errors)
                    if (this.embed !== null) {
                        this.embed.unload().then(done);
                    }

                    // Vimeo does not always return
                    setTimeout(done, 200);

                    break;

                default:
                    break;
            }
        }

        /**
         * Check for support for a mime type (HTML5 only)
         * @param {string} type - Mime type
         */

    }, {
        key: 'supports',
        value: function supports(type) {
            return support.mime.call(this, type);
        }

        /**
         * Check for support
         * @param {string} type - Player type (audio/video)
         * @param {string} provider - Provider (html5/youtube/vimeo)
         * @param {bool} inline - Where player has `playsinline` sttribute
         */

    }, {
        key: 'isHTML5',
        get: function get$$1() {
            return Boolean(this.provider === providers.html5);
        }
    }, {
        key: 'isEmbed',
        get: function get$$1() {
            return Boolean(this.isYouTube || this.isVimeo);
        }
    }, {
        key: 'isYouTube',
        get: function get$$1() {
            return Boolean(this.provider === providers.youtube);
        }
    }, {
        key: 'isVimeo',
        get: function get$$1() {
            return Boolean(this.provider === providers.vimeo);
        }
    }, {
        key: 'isVideo',
        get: function get$$1() {
            return Boolean(this.type === types.video);
        }
    }, {
        key: 'isAudio',
        get: function get$$1() {
            return Boolean(this.type === types.audio);
        }
    }, {
        key: 'playing',
        get: function get$$1() {
            return Boolean(this.ready && !this.paused && !this.ended);
        }

        /**
         * Get paused state
         */

    }, {
        key: 'paused',
        get: function get$$1() {
            return Boolean(this.media.paused);
        }

        /**
         * Get stopped state
         */

    }, {
        key: 'stopped',
        get: function get$$1() {
            return Boolean(this.paused && this.currentTime === 0);
        }

        /**
         * Get ended state
         */

    }, {
        key: 'ended',
        get: function get$$1() {
            return Boolean(this.media.ended);
        }
    }, {
        key: 'currentTime',
        set: function set$$1(input) {
            var targetTime = 0;

            if (utils.is.number(input)) {
                targetTime = input;
            }

            // Normalise targetTime
            if (targetTime < 0) {
                targetTime = 0;
            } else if (targetTime > this.duration) {
                targetTime = this.duration;
            }

            // Set
            this.media.currentTime = targetTime;

            // Logging
            this.debug.log('Seeking to ' + this.currentTime + ' seconds');
        }

        /**
         * Get current time
         */
        ,
        get: function get$$1() {
            return Number(this.media.currentTime);
        }

        /**
         * Get buffered
         */

    }, {
        key: 'buffered',
        get: function get$$1() {
            var buffered = this.media.buffered;

            // YouTube / Vimeo return a float between 0-1

            if (utils.is.number(buffered)) {
                return buffered;
            }

            // HTML5
            // TODO: Handle buffered chunks of the media
            // (i.e. seek to another section buffers only that section)
            if (buffered && buffered.length && this.duration > 0) {
                return buffered.end(0) / this.duration;
            }

            return 0;
        }

        /**
         * Get seeking status
         */

    }, {
        key: 'seeking',
        get: function get$$1() {
            return Boolean(this.media.seeking);
        }

        /**
         * Get the duration of the current media
         */

    }, {
        key: 'duration',
        get: function get$$1() {
            // Faux duration set via config
            var fauxDuration = parseFloat(this.config.duration);

            // True duration
            var realDuration = this.media ? Number(this.media.duration) : 0;

            // If custom duration is funky, use regular duration
            return !Number.isNaN(fauxDuration) ? fauxDuration : realDuration;
        }

        /**
         * Set the player volume
         * @param {number} value - must be between 0 and 1. Defaults to the value from local storage and config.volume if not set in storage
         */

    }, {
        key: 'volume',
        set: function set$$1(value) {
            var volume = value;
            var max = 1;
            var min = 0;

            if (utils.is.string(volume)) {
                volume = Number(volume);
            }

            // Load volume from storage if no value specified
            if (!utils.is.number(volume)) {
                volume = this.storage.get('volume');
            }

            // Use config if all else fails
            if (!utils.is.number(volume)) {
                volume = this.config.volume;
            }

            // Maximum is volumeMax
            if (volume > max) {
                volume = max;
            }
            // Minimum is volumeMin
            if (volume < min) {
                volume = min;
            }

            // Update config
            this.config.volume = volume;

            // Set the player volume
            this.media.volume = volume;

            // If muted, and we're increasing volume manually, reset muted state
            if (!utils.is.empty(value) && this.muted && volume > 0) {
                this.muted = false;
            }
        }

        /**
         * Get the current player volume
         */
        ,
        get: function get$$1() {
            return Number(this.media.volume);
        }
    }, {
        key: 'muted',
        set: function set$$1(mute) {
            var toggle = mute;

            // Load muted state from storage
            if (!utils.is.boolean(toggle)) {
                toggle = this.storage.get('muted');
            }

            // Use config if all else fails
            if (!utils.is.boolean(toggle)) {
                toggle = this.config.muted;
            }

            // Update config
            this.config.muted = toggle;

            // Set mute on the player
            this.media.muted = toggle;
        }

        /**
         * Get current muted state
         */
        ,
        get: function get$$1() {
            return Boolean(this.media.muted);
        }

        /**
         * Check if the media has audio
         */

    }, {
        key: 'hasAudio',
        get: function get$$1() {
            // Assume yes for all non HTML5 (as we can't tell...)
            if (!this.isHTML5) {
                return true;
            }

            if (this.isAudio) {
                return true;
            }

            // Get audio tracks
            return Boolean(this.media.mozHasAudio) || Boolean(this.media.webkitAudioDecodedByteCount) || Boolean(this.media.audioTracks && this.media.audioTracks.length);
        }

        /**
         * Set playback speed
         * @param {number} speed - the speed of playback (0.5-2.0)
         */

    }, {
        key: 'speed',
        set: function set$$1(input) {
            var speed = null;

            if (utils.is.number(input)) {
                speed = input;
            }

            if (!utils.is.number(speed)) {
                speed = this.storage.get('speed');
            }

            if (!utils.is.number(speed)) {
                speed = this.config.speed.selected;
            }

            // Set min/max
            if (speed < 0.1) {
                speed = 0.1;
            }
            if (speed > 2.0) {
                speed = 2.0;
            }

            if (!this.config.speed.options.includes(speed)) {
                this.debug.warn('Unsupported speed (' + speed + ')');
                return;
            }

            // Update config
            this.config.speed.selected = speed;

            // Set media speed
            this.media.playbackRate = speed;
        }

        /**
         * Get current playback speed
         */
        ,
        get: function get$$1() {
            return Number(this.media.playbackRate);
        }

        /**
         * Set playback quality
         * Currently HTML5 & YouTube only
         * @param {number} input - Quality level
         */

    }, {
        key: 'quality',
        set: function set$$1(input) {
            var quality = null;

            if (!utils.is.empty(input)) {
                quality = Number(input);
            }

            if (!utils.is.number(quality) || quality === 0) {
                quality = this.storage.get('quality');
            }

            if (!utils.is.number(quality)) {
                quality = this.config.quality.selected;
            }

            if (!utils.is.number(quality)) {
                quality = this.config.quality.default;
            }

            if (!this.options.quality.length) {
                return;
            }

            if (!this.options.quality.includes(quality)) {
                var closest = utils.closest(this.options.quality, quality);
                this.debug.warn('Unsupported quality option: ' + quality + ', using ' + closest + ' instead');
                quality = closest;
            }

            // Update config
            this.config.quality.selected = quality;

            // Set quality
            this.media.quality = quality;
        }

        /**
         * Get current quality level
         */
        ,
        get: function get$$1() {
            return this.media.quality;
        }

        /**
         * Toggle loop
         * TODO: Finish fancy new logic. Set the indicator on load as user may pass loop as config
         * @param {boolean} input - Whether to loop or not
         */

    }, {
        key: 'loop',
        set: function set$$1(input) {
            var toggle = utils.is.boolean(input) ? input : this.config.loop.active;
            this.config.loop.active = toggle;
            this.media.loop = toggle;

            // Set default to be a true toggle
            /* const type = ['start', 'end', 'all', 'none', 'toggle'].includes(input) ? input : 'toggle';
             switch (type) {
                case 'start':
                    if (this.config.loop.end && this.config.loop.end <= this.currentTime) {
                        this.config.loop.end = null;
                    }
                    this.config.loop.start = this.currentTime;
                    // this.config.loop.indicator.start = this.elements.display.played.value;
                    break;
                 case 'end':
                    if (this.config.loop.start >= this.currentTime) {
                        return this;
                    }
                    this.config.loop.end = this.currentTime;
                    // this.config.loop.indicator.end = this.elements.display.played.value;
                    break;
                 case 'all':
                    this.config.loop.start = 0;
                    this.config.loop.end = this.duration - 2;
                    this.config.loop.indicator.start = 0;
                    this.config.loop.indicator.end = 100;
                    break;
                 case 'toggle':
                    if (this.config.loop.active) {
                        this.config.loop.start = 0;
                        this.config.loop.end = null;
                    } else {
                        this.config.loop.start = 0;
                        this.config.loop.end = this.duration - 2;
                    }
                    break;
                 default:
                    this.config.loop.start = 0;
                    this.config.loop.end = null;
                    break;
            } */
        }

        /**
         * Get current loop state
         */
        ,
        get: function get$$1() {
            return Boolean(this.media.loop);
        }

        /**
         * Set new media source
         * @param {object} input - The new source object (see docs)
         */

    }, {
        key: 'source',
        set: function set$$1(input) {
            source.change.call(this, input);
        }

        /**
         * Get current source
         */
        ,
        get: function get$$1() {
            return this.media.currentSrc;
        }

        /**
         * Set the poster image for a video
         * @param {input} - the URL for the new poster image
         */

    }, {
        key: 'poster',
        set: function set$$1(input) {
            if (!this.isVideo) {
                this.debug.warn('Poster can only be set for video');
                return;
            }

            if (utils.is.string(input)) {
                this.media.setAttribute('poster', input);
                ui.setPoster.call(this);
            }
        }

        /**
         * Get the current poster image
         */
        ,
        get: function get$$1() {
            if (!this.isVideo) {
                return null;
            }

            return this.media.getAttribute('poster');
        }

        /**
         * Set the autoplay state
         * @param {boolean} input - Whether to autoplay or not
         */

    }, {
        key: 'autoplay',
        set: function set$$1(input) {
            var toggle = utils.is.boolean(input) ? input : this.config.autoplay;
            this.config.autoplay = toggle;
        }

        /**
         * Get the current autoplay state
         */
        ,
        get: function get$$1() {
            return Boolean(this.config.autoplay);
        }
    }, {
        key: 'language',
        set: function set$$1(input) {
            // Nothing specified
            if (!utils.is.string(input)) {
                return;
            }

            // If empty string is passed, assume disable captions
            if (utils.is.empty(input)) {
                this.toggleCaptions(false);
                return;
            }

            // Normalize
            var language = input.toLowerCase();

            // Check for support
            if (!this.options.captions.includes(language)) {
                this.debug.warn('Unsupported language option: ' + language);
                return;
            }

            // Ensure captions are enabled
            this.toggleCaptions(true);

            // Enabled only
            if (language === 'enabled') {
                return;
            }

            // If nothing to change, bail
            if (this.language === language) {
                return;
            }

            // Update config
            this.captions.language = language;

            // Clear caption
            captions.setText.call(this, null);

            // Update captions
            captions.setLanguage.call(this);

            // Trigger an event
            utils.dispatchEvent.call(this, this.media, 'languagechange');
        }

        /**
         * Get the current captions language
         */
        ,
        get: function get$$1() {
            return this.captions.language;
        }

        /**
         * Toggle picture-in-picture playback on WebKit/MacOS
         * TODO: update player with state, support, enabled
         * TODO: detect outside changes
         */

    }, {
        key: 'pip',
        set: function set$$1(input) {
            var states = {
                pip: 'picture-in-picture',
                inline: 'inline'
            };

            // Bail if no support
            if (!support.pip) {
                return;
            }

            // Toggle based on current state if not passed
            var toggle = utils.is.boolean(input) ? input : this.pip === states.inline;

            // Toggle based on current state
            this.media.webkitSetPresentationMode(toggle ? states.pip : states.inline);
        }

        /**
         * Get the current picture-in-picture state
         */
        ,
        get: function get$$1() {
            if (!support.pip) {
                return null;
            }

            return this.media.webkitPresentationMode;
        }
    }], [{
        key: 'supported',
        value: function supported(type, provider, inline) {
            return support.check(type, provider, inline);
        }

        /**
         * Load an SVG sprite into the page
         * @param {string} url - URL for the SVG sprite
         * @param {string} [id] - Unique ID
         */

    }, {
        key: 'loadSprite',
        value: function loadSprite(url, id) {
            return utils.loadSprite(url, id);
        }

        /**
         * Setup multiple instances
         * @param {*} selector
         * @param {object} options
         */

    }, {
        key: 'setup',
        value: function setup(selector) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var targets = null;

            if (utils.is.string(selector)) {
                targets = Array.from(document.querySelectorAll(selector));
            } else if (utils.is.nodeList(selector)) {
                targets = Array.from(selector);
            } else if (utils.is.array(selector)) {
                targets = selector.filter(function (i) {
                    return utils.is.element(i);
                });
            }

            if (utils.is.empty(targets)) {
                return null;
            }

            return targets.map(function (t) {
                return new Plyr(t, options);
            });
        }
    }]);
    return Plyr;
}();

return Plyr;

})));

//# sourceMappingURL=plyr.js.map
