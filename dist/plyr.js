typeof navigator === "object" && (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('Plyr', factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Plyr = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
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
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _classCallCheck$1(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
  }

  function _defineProperties$1(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
    }
  }

  function _createClass$1(e, t, n) {
    return t && _defineProperties$1(e.prototype, t), n && _defineProperties$1(e, n), e;
  }

  function _defineProperty$1(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e;
  }

  function ownKeys$1(e, t) {
    var n = Object.keys(e);

    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t && (r = r.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })), n.push.apply(n, r);
    }

    return n;
  }

  function _objectSpread2$1(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2 ? ownKeys$1(Object(n), !0).forEach(function (t) {
        _defineProperty$1(e, t, n[t]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ownKeys$1(Object(n)).forEach(function (t) {
        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
      });
    }

    return e;
  }

  var defaults = {
    addCSS: !0,
    thumbWidth: 15,
    watch: !0
  };

  function matches(e, t) {
    return function () {
      return Array.from(document.querySelectorAll(t)).includes(this);
    }.call(e, t);
  }

  function trigger(e, t) {
    if (e && t) {
      var n = new Event(t, {
        bubbles: !0
      });
      e.dispatchEvent(n);
    }
  }

  var getConstructor = function getConstructor(e) {
    return null != e ? e.constructor : null;
  },
      instanceOf = function instanceOf(e, t) {
    return !!(e && t && e instanceof t);
  },
      isNullOrUndefined = function isNullOrUndefined(e) {
    return null == e;
  },
      isObject = function isObject(e) {
    return getConstructor(e) === Object;
  },
      isNumber = function isNumber(e) {
    return getConstructor(e) === Number && !Number.isNaN(e);
  },
      isString = function isString(e) {
    return getConstructor(e) === String;
  },
      isBoolean = function isBoolean(e) {
    return getConstructor(e) === Boolean;
  },
      isFunction = function isFunction(e) {
    return getConstructor(e) === Function;
  },
      isArray = function isArray(e) {
    return Array.isArray(e);
  },
      isNodeList = function isNodeList(e) {
    return instanceOf(e, NodeList);
  },
      isElement = function isElement(e) {
    return instanceOf(e, Element);
  },
      isEvent = function isEvent(e) {
    return instanceOf(e, Event);
  },
      isEmpty = function isEmpty(e) {
    return isNullOrUndefined(e) || (isString(e) || isArray(e) || isNodeList(e)) && !e.length || isObject(e) && !Object.keys(e).length;
  },
      is = {
    nullOrUndefined: isNullOrUndefined,
    object: isObject,
    number: isNumber,
    string: isString,
    boolean: isBoolean,
    function: isFunction,
    array: isArray,
    nodeList: isNodeList,
    element: isElement,
    event: isEvent,
    empty: isEmpty
  };

  function getDecimalPlaces(e) {
    var t = "".concat(e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    return t ? Math.max(0, (t[1] ? t[1].length : 0) - (t[2] ? +t[2] : 0)) : 0;
  }

  function round(e, t) {
    if (1 > t) {
      var n = getDecimalPlaces(t);
      return parseFloat(e.toFixed(n));
    }

    return Math.round(e / t) * t;
  }

  var RangeTouch = function () {
    function e(t, n) {
      _classCallCheck$1(this, e), is.element(t) ? this.element = t : is.string(t) && (this.element = document.querySelector(t)), is.element(this.element) && is.empty(this.element.rangeTouch) && (this.config = _objectSpread2$1({}, defaults, {}, n), this.init());
    }

    return _createClass$1(e, [{
      key: "init",
      value: function value() {
        e.enabled && (this.config.addCSS && (this.element.style.userSelect = "none", this.element.style.webKitUserSelect = "none", this.element.style.touchAction = "manipulation"), this.listeners(!0), this.element.rangeTouch = this);
      }
    }, {
      key: "destroy",
      value: function value() {
        e.enabled && (this.config.addCSS && (this.element.style.userSelect = "", this.element.style.webKitUserSelect = "", this.element.style.touchAction = ""), this.listeners(!1), this.element.rangeTouch = null);
      }
    }, {
      key: "listeners",
      value: function value(e) {
        var t = this,
            n = e ? "addEventListener" : "removeEventListener";
        ["touchstart", "touchmove", "touchend"].forEach(function (e) {
          t.element[n](e, function (e) {
            return t.set(e);
          }, !1);
        });
      }
    }, {
      key: "get",
      value: function value(t) {
        if (!e.enabled || !is.event(t)) return null;
        var n,
            r = t.target,
            i = t.changedTouches[0],
            o = parseFloat(r.getAttribute("min")) || 0,
            s = parseFloat(r.getAttribute("max")) || 100,
            u = parseFloat(r.getAttribute("step")) || 1,
            c = r.getBoundingClientRect(),
            a = 100 / c.width * (this.config.thumbWidth / 2) / 100;
        return 0 > (n = 100 / c.width * (i.clientX - c.left)) ? n = 0 : 100 < n && (n = 100), 50 > n ? n -= (100 - 2 * n) * a : 50 < n && (n += 2 * (n - 50) * a), o + round(n / 100 * (s - o), u);
      }
    }, {
      key: "set",
      value: function value(t) {
        e.enabled && is.event(t) && !t.target.disabled && (t.preventDefault(), t.target.value = this.get(t), trigger(t.target, "touchend" === t.type ? "change" : "input"));
      }
    }], [{
      key: "setup",
      value: function value(t) {
        var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
            r = null;
        if (is.empty(t) || is.string(t) ? r = Array.from(document.querySelectorAll(is.string(t) ? t : 'input[type="range"]')) : is.element(t) ? r = [t] : is.nodeList(t) ? r = Array.from(t) : is.array(t) && (r = t.filter(is.element)), is.empty(r)) return null;

        var i = _objectSpread2$1({}, defaults, {}, n);

        if (is.string(t) && i.watch) {
          var o = new MutationObserver(function (n) {
            Array.from(n).forEach(function (n) {
              Array.from(n.addedNodes).forEach(function (n) {
                is.element(n) && matches(n, t) && new e(n, i);
              });
            });
          });
          o.observe(document.body, {
            childList: !0,
            subtree: !0
          });
        }

        return r.map(function (t) {
          return new e(t, n);
        });
      }
    }, {
      key: "enabled",
      get: function get() {
        return "ontouchstart" in document.documentElement;
      }
    }]), e;
  }();

  // ==========================================================================
  // Type checking utils
  // ==========================================================================
  var getConstructor$1 = function getConstructor(input) {
    return input !== null && typeof input !== 'undefined' ? input.constructor : null;
  };

  var instanceOf$1 = function instanceOf(input, constructor) {
    return Boolean(input && constructor && input instanceof constructor);
  };

  var isNullOrUndefined$1 = function isNullOrUndefined(input) {
    return input === null || typeof input === 'undefined';
  };

  var isObject$1 = function isObject(input) {
    return getConstructor$1(input) === Object;
  };

  var isNumber$1 = function isNumber(input) {
    return getConstructor$1(input) === Number && !Number.isNaN(input);
  };

  var isString$1 = function isString(input) {
    return getConstructor$1(input) === String;
  };

  var isBoolean$1 = function isBoolean(input) {
    return getConstructor$1(input) === Boolean;
  };

  var isFunction$1 = function isFunction(input) {
    return getConstructor$1(input) === Function;
  };

  var isArray$1 = function isArray(input) {
    return Array.isArray(input);
  };

  var isWeakMap = function isWeakMap(input) {
    return instanceOf$1(input, WeakMap);
  };

  var isNodeList$1 = function isNodeList(input) {
    return instanceOf$1(input, NodeList);
  };

  var isElement$1 = function isElement(input) {
    return instanceOf$1(input, Element);
  };

  var isTextNode = function isTextNode(input) {
    return getConstructor$1(input) === Text;
  };

  var isEvent$1 = function isEvent(input) {
    return instanceOf$1(input, Event);
  };

  var isKeyboardEvent = function isKeyboardEvent(input) {
    return instanceOf$1(input, KeyboardEvent);
  };

  var isCue = function isCue(input) {
    return instanceOf$1(input, window.TextTrackCue) || instanceOf$1(input, window.VTTCue);
  };

  var isTrack = function isTrack(input) {
    return instanceOf$1(input, TextTrack) || !isNullOrUndefined$1(input) && isString$1(input.kind);
  };

  var isPromise = function isPromise(input) {
    return instanceOf$1(input, Promise) && isFunction$1(input.then);
  };

  var isEmpty$1 = function isEmpty(input) {
    return isNullOrUndefined$1(input) || (isString$1(input) || isArray$1(input) || isNodeList$1(input)) && !input.length || isObject$1(input) && !Object.keys(input).length;
  };

  var isUrl = function isUrl(input) {
    // Accept a URL object
    if (instanceOf$1(input, window.URL)) {
      return true;
    } // Must be string from here


    if (!isString$1(input)) {
      return false;
    } // Add the protocol if required


    var string = input;

    if (!input.startsWith('http://') || !input.startsWith('https://')) {
      string = "http://".concat(input);
    }

    try {
      return !isEmpty$1(new URL(string).hostname);
    } catch (e) {
      return false;
    }
  };

  var is$1 = {
    nullOrUndefined: isNullOrUndefined$1,
    object: isObject$1,
    number: isNumber$1,
    string: isString$1,
    boolean: isBoolean$1,
    function: isFunction$1,
    array: isArray$1,
    weakMap: isWeakMap,
    nodeList: isNodeList$1,
    element: isElement$1,
    textNode: isTextNode,
    event: isEvent$1,
    keyboardEvent: isKeyboardEvent,
    cue: isCue,
    track: isTrack,
    promise: isPromise,
    url: isUrl,
    empty: isEmpty$1
  };

  // ==========================================================================
  var transitionEndEvent = function () {
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
    return is$1.string(type) ? events[type] : false;
  }(); // Force repaint of element

  function repaint(element, delay) {
    setTimeout(function () {
      try {
        // eslint-disable-next-line no-param-reassign
        element.hidden = true; // eslint-disable-next-line no-unused-expressions

        element.offsetHeight; // eslint-disable-next-line no-param-reassign

        element.hidden = false;
      } catch (e) {// Do nothing
      }
    }, delay);
  }

  // ==========================================================================
  // Browser sniffing
  // Unfortunately, due to mixed support, UA sniffing is required
  // ==========================================================================
  var browser = {
    isIE:
    /* @cc_on!@ */
     !!document.documentMode,
    isEdge: window.navigator.userAgent.includes('Edge'),
    isWebkit: 'WebkitAppearance' in document.documentElement.style && !/Edge/.test(navigator.userAgent),
    isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
    isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform)
  };

  function cloneDeep(object) {
    return JSON.parse(JSON.stringify(object));
  } // Get a nested value in an object

  function getDeep(object, path) {
    return path.split('.').reduce(function (obj, key) {
      return obj && obj[key];
    }, object);
  } // Deep extend destination object with N more objects

  function extend() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    if (!sources.length) {
      return target;
    }

    var source = sources.shift();

    if (!is$1.object(source)) {
      return target;
    }

    Object.keys(source).forEach(function (key) {
      if (is$1.object(source[key])) {
        if (!Object.keys(target).includes(key)) {
          Object.assign(target, _defineProperty({}, key, {}));
        }

        extend(target[key], source[key]);
      } else {
        Object.assign(target, _defineProperty({}, key, source[key]));
      }
    });
    return extend.apply(void 0, [target].concat(sources));
  }

  function wrap(elements, wrapper) {
    // Convert `elements` to an array, if necessary.
    var targets = elements.length ? elements : [elements]; // Loops backwards to prevent having to clone the wrapper on the
    // first element (see `child` below).

    Array.from(targets).reverse().forEach(function (element, index) {
      var child = index > 0 ? wrapper.cloneNode(true) : wrapper; // Cache the current parent and sibling.

      var parent = element.parentNode;
      var sibling = element.nextSibling; // Wrap the element (is automatically removed from its current
      // parent).

      child.appendChild(element); // If the element had a sibling, insert the wrapper before
      // the sibling to maintain the HTML structure; otherwise, just
      // append it to the parent.

      if (sibling) {
        parent.insertBefore(child, sibling);
      } else {
        parent.appendChild(child);
      }
    });
  } // Set attributes

  function setAttributes(element, attributes) {
    if (!is$1.element(element) || is$1.empty(attributes)) {
      return;
    } // Assume null and undefined attributes should be left out,
    // Setting them would otherwise convert them to "null" and "undefined"


    Object.entries(attributes).filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          value = _ref2[1];

      return !is$1.nullOrUndefined(value);
    }).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      return element.setAttribute(key, value);
    });
  } // Create a DocumentFragment

  function createElement(type, attributes, text) {
    // Create a new <element>
    var element = document.createElement(type); // Set all passed attributes

    if (is$1.object(attributes)) {
      setAttributes(element, attributes);
    } // Add text node


    if (is$1.string(text)) {
      element.innerText = text;
    } // Return built element


    return element;
  } // Inaert an element after another

  function insertAfter(element, target) {
    if (!is$1.element(element) || !is$1.element(target)) {
      return;
    }

    target.parentNode.insertBefore(element, target.nextSibling);
  } // Insert a DocumentFragment

  function insertElement(type, parent, attributes, text) {
    if (!is$1.element(parent)) {
      return;
    }

    parent.appendChild(createElement(type, attributes, text));
  } // Remove element(s)

  function removeElement(element) {
    if (is$1.nodeList(element) || is$1.array(element)) {
      Array.from(element).forEach(removeElement);
      return;
    }

    if (!is$1.element(element) || !is$1.element(element.parentNode)) {
      return;
    }

    element.parentNode.removeChild(element);
  } // Remove all child elements

  function emptyElement(element) {
    if (!is$1.element(element)) {
      return;
    }

    var length = element.childNodes.length;

    while (length > 0) {
      element.removeChild(element.lastChild);
      length -= 1;
    }
  } // Replace element

  function replaceElement(newChild, oldChild) {
    if (!is$1.element(oldChild) || !is$1.element(oldChild.parentNode) || !is$1.element(newChild)) {
      return null;
    }

    oldChild.parentNode.replaceChild(newChild, oldChild);
    return newChild;
  } // Get an attribute object from a string selector

  function getAttributesFromSelector(sel, existingAttributes) {
    // For example:
    // '.test' to { class: 'test' }
    // '#test' to { id: 'test' }
    // '[data-test="test"]' to { 'data-test': 'test' }
    if (!is$1.string(sel) || is$1.empty(sel)) {
      return {};
    }

    var attributes = {};
    var existing = extend({}, existingAttributes);
    sel.split(',').forEach(function (s) {
      // Remove whitespace
      var selector = s.trim();
      var className = selector.replace('.', '');
      var stripped = selector.replace(/[[\]]/g, ''); // Get the parts and value

      var parts = stripped.split('=');

      var _parts = _slicedToArray(parts, 1),
          key = _parts[0];

      var value = parts.length > 1 ? parts[1].replace(/["']/g, '') : ''; // Get the first character

      var start = selector.charAt(0);

      switch (start) {
        case '.':
          // Add to existing classname
          if (is$1.string(existing.class)) {
            attributes.class = "".concat(existing.class, " ").concat(className);
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
      }
    });
    return extend(existing, attributes);
  } // Toggle hidden

  function toggleHidden(element, hidden) {
    if (!is$1.element(element)) {
      return;
    }

    var hide = hidden;

    if (!is$1.boolean(hide)) {
      hide = !element.hidden;
    } // eslint-disable-next-line no-param-reassign


    element.hidden = hide;
  } // Mirror Element.classList.toggle, with IE compatibility for "force" argument

  function toggleClass(element, className, force) {
    if (is$1.nodeList(element)) {
      return Array.from(element).map(function (e) {
        return toggleClass(e, className, force);
      });
    }

    if (is$1.element(element)) {
      var method = 'toggle';

      if (typeof force !== 'undefined') {
        method = force ? 'add' : 'remove';
      }

      element.classList[method](className);
      return element.classList.contains(className);
    }

    return false;
  } // Has class name

  function hasClass(element, className) {
    return is$1.element(element) && element.classList.contains(className);
  } // Element matches selector

  function matches$1(element, selector) {
    var _Element = Element,
        prototype = _Element.prototype;

    function match() {
      return Array.from(document.querySelectorAll(selector)).includes(this);
    }

    var method = prototype.matches || prototype.webkitMatchesSelector || prototype.mozMatchesSelector || prototype.msMatchesSelector || match;
    return method.call(element, selector);
  } // Closest ancestor element matching selector (also tests element itself)

  function closest(element, selector) {
    var _Element2 = Element,
        prototype = _Element2.prototype; // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill

    function closestElement() {
      var el = this;

      do {
        if (matches$1.matches(el, selector)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);

      return null;
    }

    var method = prototype.closest || closestElement;
    return method.call(element, selector);
  } // Find all elements

  function getElements(selector) {
    return this.elements.container.querySelectorAll(selector);
  } // Find a single element

  function getElement(selector) {
    return this.elements.container.querySelector(selector);
  } // Set focus and tab focus class

  function setFocus() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var tabFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!is$1.element(element)) {
      return;
    } // Set regular focus


    element.focus({
      preventScroll: true
    }); // If we want to mimic keyboard focus via tab

    if (tabFocus) {
      toggleClass(element, this.config.classNames.tabFocus);
    }
  }

  var defaultCodecs = {
    'audio/ogg': 'vorbis',
    'audio/wav': '1',
    'video/webm': 'vp8, vorbis',
    'video/mp4': 'avc1.42E01E, mp4a.40.2',
    'video/ogg': 'theora'
  }; // Check for feature support

  var support = {
    // Basic support
    audio: 'canPlayType' in document.createElement('audio'),
    video: 'canPlayType' in document.createElement('video'),
    // Check for support
    // Basic functionality vs full UI
    check: function check(type, provider, playsinline) {
      var canPlayInline = browser.isIPhone && playsinline && support.playsinline;
      var api = support[type] || provider !== 'html5';
      var ui = api && support.rangeInput && (type !== 'video' || !browser.isIPhone || canPlayInline);
      return {
        api: api,
        ui: ui
      };
    },
    // Picture-in-picture support
    // Safari & Chrome only currently
    pip: function () {
      if (browser.isIPhone) {
        return false;
      } // Safari
      // https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls


      if (is$1.function(createElement('video').webkitSetPresentationMode)) {
        return true;
      } // Chrome
      // https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture


      if (document.pictureInPictureEnabled && !createElement('video').disablePictureInPicture) {
        return true;
      }

      return false;
    }(),
    // Airplay support
    // Safari only currently
    airplay: is$1.function(window.WebKitPlaybackTargetAvailabilityEvent),
    // Inline playback support
    // https://webkit.org/blog/6784/new-video-policies-for-ios/
    playsinline: 'playsInline' in document.createElement('video'),
    // Check for mime type support against a player instance
    // Credits: http://diveintohtml5.info/everything.html
    // Related: http://www.leanbackplayer.com/test/h5mt.html
    mime: function mime(input) {
      if (is$1.empty(input)) {
        return false;
      }

      var _input$split = input.split('/'),
          _input$split2 = _slicedToArray(_input$split, 1),
          mediaType = _input$split2[0];

      var type = input; // Verify we're using HTML5 and there's no media type mismatch

      if (!this.isHTML5 || mediaType !== this.type) {
        return false;
      } // Add codec if required


      if (Object.keys(defaultCodecs).includes(type)) {
        type += "; codecs=\"".concat(defaultCodecs[input], "\"");
      }

      try {
        return Boolean(type && this.media.canPlayType(type).replace(/no/, ''));
      } catch (e) {
        return false;
      }
    },
    // Check for textTracks support
    textTracks: 'textTracks' in document.createElement('video'),
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
    transitions: transitionEndEvent !== false,
    // Reduced motion iOS & MacOS setting
    // https://webkit.org/blog/7551/responsive-design-for-motion/
    reducedMotion: 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion)').matches
  };

  // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
  // https://www.youtube.com/watch?v=NPM6172J22g

  var supportsPassiveListeners = function () {
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
      window.removeEventListener('test', null, options);
    } catch (e) {// Do nothing
    }

    return supported;
  }(); // Toggle event listener


  function toggleListener(element, event, callback) {
    var _this = this;

    var toggle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var passive = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var capture = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

    // Bail if no element, event, or callback
    if (!element || !('addEventListener' in element) || is$1.empty(event) || !is$1.function(callback)) {
      return;
    } // Allow multiple events


    var events = event.split(' '); // Build options
    // Default to just the capture boolean for browsers with no passive listener support

    var options = capture; // If passive events listeners are supported

    if (supportsPassiveListeners) {
      options = {
        // Whether the listener can be passive (i.e. default never prevented)
        passive: passive,
        // Whether the listener is a capturing listener or not
        capture: capture
      };
    } // If a single node is passed, bind the event listener


    events.forEach(function (type) {
      if (_this && _this.eventListeners && toggle) {
        // Cache event listener
        _this.eventListeners.push({
          element: element,
          type: type,
          callback: callback,
          options: options
        });
      }

      element[toggle ? 'addEventListener' : 'removeEventListener'](type, callback, options);
    });
  } // Bind event handler

  function on(element) {
    var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var callback = arguments.length > 2 ? arguments[2] : undefined;
    var passive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    toggleListener.call(this, element, events, callback, true, passive, capture);
  } // Unbind event handler

  function off(element) {
    var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var callback = arguments.length > 2 ? arguments[2] : undefined;
    var passive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    toggleListener.call(this, element, events, callback, false, passive, capture);
  } // Bind once-only event handler

  function once(element) {
    var _this2 = this;

    var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var callback = arguments.length > 2 ? arguments[2] : undefined;
    var passive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    var onceCallback = function onceCallback() {
      off(element, events, onceCallback, passive, capture);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      callback.apply(_this2, args);
    };

    toggleListener.call(this, element, events, onceCallback, true, passive, capture);
  } // Trigger event

  function triggerEvent(element) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var detail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    // Bail if no element
    if (!is$1.element(element) || is$1.empty(type)) {
      return;
    } // Create and dispatch the event


    var event = new CustomEvent(type, {
      bubbles: bubbles,
      detail: _objectSpread2(_objectSpread2({}, detail), {}, {
        plyr: this
      })
    }); // Dispatch the event

    element.dispatchEvent(event);
  } // Unbind all cached event listeners

  function unbindListeners() {
    if (this && this.eventListeners) {
      this.eventListeners.forEach(function (item) {
        var element = item.element,
            type = item.type,
            callback = item.callback,
            options = item.options;
        element.removeEventListener(type, callback, options);
      });
      this.eventListeners = [];
    }
  } // Run method when / if player is ready

  function ready() {
    var _this3 = this;

    return new Promise(function (resolve) {
      return _this3.ready ? setTimeout(resolve, 0) : on.call(_this3, _this3.elements.container, 'ready', resolve);
    }).then(function () {});
  }

  /**
   * Silence a Promise-like object.
   * This is useful for avoiding non-harmful, but potentially confusing "uncaught
   * play promise" rejection error messages.
   * @param  {Object} value An object that may or may not be `Promise`-like.
   */

  function silencePromise(value) {
    if (is$1.promise(value)) {
      value.then(null, function () {});
    }
  }

  function validateRatio(input) {
    if (!is$1.array(input) && (!is$1.string(input) || !input.includes(':'))) {
      return false;
    }

    var ratio = is$1.array(input) ? input : input.split(':');
    return ratio.map(Number).every(is$1.number);
  }
  function reduceAspectRatio(ratio) {
    if (!is$1.array(ratio) || !ratio.every(is$1.number)) {
      return null;
    }

    var _ratio = _slicedToArray(ratio, 2),
        width = _ratio[0],
        height = _ratio[1];

    var getDivider = function getDivider(w, h) {
      return h === 0 ? w : getDivider(h, w % h);
    };

    var divider = getDivider(width, height);
    return [width / divider, height / divider];
  }
  function getAspectRatio(input) {
    var parse = function parse(ratio) {
      return validateRatio(ratio) ? ratio.split(':').map(Number) : null;
    }; // Try provided ratio


    var ratio = parse(input); // Get from config

    if (ratio === null) {
      ratio = parse(this.config.ratio);
    } // Get from embed


    if (ratio === null && !is$1.empty(this.embed) && is$1.array(this.embed.ratio)) {
      ratio = this.embed.ratio;
    } // Get from HTML5 video


    if (ratio === null && this.isHTML5) {
      var _this$media = this.media,
          videoWidth = _this$media.videoWidth,
          videoHeight = _this$media.videoHeight;
      ratio = reduceAspectRatio([videoWidth, videoHeight]);
    }

    return ratio;
  } // Set aspect ratio for responsive container

  function setAspectRatio(input) {
    if (!this.isVideo) {
      return {};
    }

    var wrapper = this.elements.wrapper;
    var ratio = getAspectRatio.call(this, input);

    var _ref = is$1.array(ratio) ? ratio : [0, 0],
        _ref2 = _slicedToArray(_ref, 2),
        w = _ref2[0],
        h = _ref2[1];

    var padding = 100 / w * h;
    wrapper.style.paddingBottom = "".concat(padding, "%"); // For Vimeo we have an extra <div> to hide the standard controls and UI

    if (this.isVimeo && !this.config.vimeo.premium && this.supported.ui) {
      var height = 100 / this.media.offsetWidth * parseInt(window.getComputedStyle(this.media).paddingBottom, 10);
      var offset = (height - padding) / (height / 50);

      if (this.fullscreen.active) {
        wrapper.style.paddingBottom = null;
      } else {
        this.media.style.transform = "translateY(-".concat(offset, "%)");
      }
    } else if (this.isHTML5) {
      wrapper.classList.toggle(this.config.classNames.videoFixedRatio, ratio !== null);
    }

    return {
      padding: padding,
      ratio: ratio
    };
  }

  // ==========================================================================
  var html5 = {
    getSources: function getSources() {
      var _this = this;

      if (!this.isHTML5) {
        return [];
      }

      var sources = Array.from(this.media.querySelectorAll('source')); // Filter out unsupported sources (if type is specified)

      return sources.filter(function (source) {
        var type = source.getAttribute('type');

        if (is$1.empty(type)) {
          return true;
        }

        return support.mime.call(_this, type);
      });
    },
    // Get quality levels
    getQualityOptions: function getQualityOptions() {
      // Whether we're forcing all options (e.g. for streaming)
      if (this.config.quality.forced) {
        return this.config.quality.options;
      } // Get sizes from <source> elements


      return html5.getSources.call(this).map(function (source) {
        return Number(source.getAttribute('size'));
      }).filter(Boolean);
    },
    setup: function setup() {
      if (!this.isHTML5) {
        return;
      }

      var player = this; // Set speed options from config

      player.options.speed = player.config.speed.options; // Set aspect ratio if fixed

      if (!is$1.empty(this.config.ratio)) {
        setAspectRatio.call(player);
      } // Quality


      Object.defineProperty(player.media, 'quality', {
        get: function get() {
          // Get sources
          var sources = html5.getSources.call(player);
          var source = sources.find(function (s) {
            return s.getAttribute('src') === player.source;
          }); // Return size, if match is found

          return source && Number(source.getAttribute('size'));
        },
        set: function set(input) {
          if (player.quality === input) {
            return;
          } // If we're using an an external handler...


          if (player.config.quality.forced && is$1.function(player.config.quality.onChange)) {
            player.config.quality.onChange(input);
          } else {
            // Get sources
            var sources = html5.getSources.call(player); // Get first match for requested size

            var source = sources.find(function (s) {
              return Number(s.getAttribute('size')) === input;
            }); // No matching source found

            if (!source) {
              return;
            } // Get current state


            var _player$media = player.media,
                currentTime = _player$media.currentTime,
                paused = _player$media.paused,
                preload = _player$media.preload,
                readyState = _player$media.readyState,
                playbackRate = _player$media.playbackRate; // Set new source

            player.media.src = source.getAttribute('src'); // Prevent loading if preload="none" and the current source isn't loaded (#1044)

            if (preload !== 'none' || readyState) {
              // Restore time
              player.once('loadedmetadata', function () {
                player.speed = playbackRate;
                player.currentTime = currentTime; // Resume playing

                if (!paused) {
                  silencePromise(player.play());
                }
              }); // Load new source

              player.media.load();
            }
          } // Trigger change event


          triggerEvent.call(player, player.media, 'qualitychange', false, {
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
      } // Remove child sources


      removeElement(html5.getSources.call(this)); // Set blank video src attribute
      // This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
      // Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection

      this.media.setAttribute('src', this.config.blankVideo); // Load the new empty source
      // This will cancel existing requests
      // See https://github.com/sampotts/plyr/issues/174

      this.media.load(); // Debugging

      this.debug.log('Cancelled network requests');
    }
  };

  // ==========================================================================

  function dedupe(array) {
    if (!is$1.array(array)) {
      return array;
    }

    return array.filter(function (item, index) {
      return array.indexOf(item) === index;
    });
  } // Get the closest value in an array

  function closest$1(array, value) {
    if (!is$1.array(array) || !array.length) {
      return null;
    }

    return array.reduce(function (prev, curr) {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
  }

  // ==========================================================================

  function generateId(prefix) {
    return "".concat(prefix, "-").concat(Math.floor(Math.random() * 10000));
  } // Format string

  function format(input) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (is$1.empty(input)) {
      return input;
    }

    return input.toString().replace(/{(\d+)}/g, function (match, i) {
      return args[i].toString();
    });
  } // Get percentage

  function getPercentage(current, max) {
    if (current === 0 || max === 0 || Number.isNaN(current) || Number.isNaN(max)) {
      return 0;
    }

    return (current / max * 100).toFixed(2);
  } // Replace all occurances of a string in a string

  var replaceAll = function replaceAll() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var find = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    return input.replace(new RegExp(find.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'g'), replace.toString());
  }; // Convert to title case

  var toTitleCase = function toTitleCase() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return input.toString().replace(/\w\S*/g, function (text) {
      return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
  }; // Convert string to pascalCase

  function toPascalCase() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var string = input.toString(); // Convert kebab case

    string = replaceAll(string, '-', ' '); // Convert snake case

    string = replaceAll(string, '_', ' '); // Convert to title case

    string = toTitleCase(string); // Convert to pascal case

    return replaceAll(string, ' ', '');
  } // Convert string to pascalCase

  function toCamelCase() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var string = input.toString(); // Convert to pascal case

    string = toPascalCase(string); // Convert first character to lowercase

    return string.charAt(0).toLowerCase() + string.slice(1);
  } // Remove HTML from a string

  function stripHTML(source) {
    var fragment = document.createDocumentFragment();
    var element = document.createElement('div');
    fragment.appendChild(element);
    element.innerHTML = source;
    return fragment.firstChild.innerText;
  } // Like outerHTML, but also works for DocumentFragment

  function getHTML(element) {
    var wrapper = document.createElement('div');
    wrapper.appendChild(element);
    return wrapper.innerHTML;
  }

  var resources = {
    pip: 'PIP',
    airplay: 'AirPlay',
    html5: 'HTML5',
    vimeo: 'Vimeo',
    youtube: 'YouTube'
  };
  var i18n = {
    get: function get() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (is$1.empty(key) || is$1.empty(config)) {
        return '';
      }

      var string = getDeep(config.i18n, key);

      if (is$1.empty(string)) {
        if (Object.keys(resources).includes(key)) {
          return resources[key];
        }

        return '';
      }

      var replace = {
        '{seektime}': config.seekTime,
        '{title}': config.title
      };
      Object.entries(replace).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            k = _ref2[0],
            v = _ref2[1];

        string = replaceAll(string, k, v);
      });
      return string;
    }
  };

  var Storage = /*#__PURE__*/function () {
    function Storage(player) {
      _classCallCheck(this, Storage);

      this.enabled = player.config.storage.enabled;
      this.key = player.config.storage.key;
    } // Check for actual support (see if we can use it)


    _createClass(Storage, [{
      key: "get",
      value: function get(key) {
        if (!Storage.supported || !this.enabled) {
          return null;
        }

        var store = window.localStorage.getItem(this.key);

        if (is$1.empty(store)) {
          return null;
        }

        var json = JSON.parse(store);
        return is$1.string(key) && key.length ? json[key] : json;
      }
    }, {
      key: "set",
      value: function set(object) {
        // Bail if we don't have localStorage support or it's disabled
        if (!Storage.supported || !this.enabled) {
          return;
        } // Can only store objectst


        if (!is$1.object(object)) {
          return;
        } // Get current storage


        var storage = this.get(); // Default to empty object

        if (is$1.empty(storage)) {
          storage = {};
        } // Update the working copy of the values


        extend(storage, object); // Update storage

        window.localStorage.setItem(this.key, JSON.stringify(storage));
      }
    }], [{
      key: "supported",
      get: function get() {
        try {
          if (!('localStorage' in window)) {
            return false;
          }

          var test = '___test'; // Try to use it (it might be disabled, e.g. user is in private mode)
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
  // Fetch wrapper
  // Using XHR to avoid issues with older browsers
  // ==========================================================================
  function fetch(url) {
    var responseType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text';
    return new Promise(function (resolve, reject) {
      try {
        var request = new XMLHttpRequest(); // Check for CORS support

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
          throw new Error(request.status);
        });
        request.open('GET', url, true); // Set the required response type

        request.responseType = responseType;
        request.send();
      } catch (e) {
        reject(e);
      }
    });
  }

  // ==========================================================================

  function loadSprite(url, id) {
    if (!is$1.string(url)) {
      return;
    }

    var prefix = 'cache';
    var hasId = is$1.string(id);
    var isCached = false;

    var exists = function exists() {
      return document.getElementById(id) !== null;
    };

    var update = function update(container, data) {
      // eslint-disable-next-line no-param-reassign
      container.innerHTML = data; // Check again incase of race condition

      if (hasId && exists()) {
        return;
      } // Inject the SVG to the body


      document.body.insertAdjacentElement('afterbegin', container);
    }; // Only load once if ID set


    if (!hasId || !exists()) {
      var useStorage = Storage.supported; // Create container

      var container = document.createElement('div');
      container.setAttribute('hidden', '');

      if (hasId) {
        container.setAttribute('id', id);
      } // Check in cache


      if (useStorage) {
        var cached = window.localStorage.getItem("".concat(prefix, "-").concat(id));
        isCached = cached !== null;

        if (isCached) {
          var data = JSON.parse(cached);
          update(container, data.content);
        }
      } // Get the sprite


      fetch(url).then(function (result) {
        if (is$1.empty(result)) {
          return;
        }

        if (useStorage) {
          window.localStorage.setItem("".concat(prefix, "-").concat(id), JSON.stringify({
            content: result
          }));
        }

        update(container, result);
      }).catch(function () {});
    }
  }

  // ==========================================================================

  var getHours = function getHours(value) {
    return Math.trunc(value / 60 / 60 % 60, 10);
  };
  var getMinutes = function getMinutes(value) {
    return Math.trunc(value / 60 % 60, 10);
  };
  var getSeconds = function getSeconds(value) {
    return Math.trunc(value % 60, 10);
  }; // Format time to UI friendly string

  function formatTime() {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var displayHours = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var inverted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    // Bail if the value isn't a number
    if (!is$1.number(time)) {
      return formatTime(undefined, displayHours, inverted);
    } // Format time component to add leading zero


    var format = function format(value) {
      return "0".concat(value).slice(-2);
    }; // Breakdown to hours, mins, secs


    var hours = getHours(time);
    var mins = getMinutes(time);
    var secs = getSeconds(time); // Do we need to display hours?

    if (displayHours || hours > 0) {
      hours = "".concat(hours, ":");
    } else {
      hours = '';
    } // Render


    return "".concat(inverted && time > 0 ? '-' : '').concat(hours).concat(format(mins), ":").concat(format(secs));
  }

  var controls = {
    // Get icon URL
    getIconUrl: function getIconUrl() {
      var url = new URL(this.config.iconUrl, window.location);
      var cors = url.host !== window.location.host || browser.isIE && !window.svg4everybody;
      return {
        url: this.config.iconUrl,
        cors: cors
      };
    },
    // Find the UI controls
    findElements: function findElements() {
      try {
        this.elements.controls = getElement.call(this, this.config.selectors.controls.wrapper); // Buttons

        this.elements.buttons = {
          play: getElements.call(this, this.config.selectors.buttons.play),
          pause: getElement.call(this, this.config.selectors.buttons.pause),
          restart: getElement.call(this, this.config.selectors.buttons.restart),
          rewind: getElement.call(this, this.config.selectors.buttons.rewind),
          fastForward: getElement.call(this, this.config.selectors.buttons.fastForward),
          mute: getElement.call(this, this.config.selectors.buttons.mute),
          pip: getElement.call(this, this.config.selectors.buttons.pip),
          airplay: getElement.call(this, this.config.selectors.buttons.airplay),
          settings: getElement.call(this, this.config.selectors.buttons.settings),
          captions: getElement.call(this, this.config.selectors.buttons.captions),
          fullscreen: getElement.call(this, this.config.selectors.buttons.fullscreen)
        }; // Progress

        this.elements.progress = getElement.call(this, this.config.selectors.progress); // Inputs

        this.elements.inputs = {
          seek: getElement.call(this, this.config.selectors.inputs.seek),
          volume: getElement.call(this, this.config.selectors.inputs.volume)
        }; // Display

        this.elements.display = {
          buffer: getElement.call(this, this.config.selectors.display.buffer),
          currentTime: getElement.call(this, this.config.selectors.display.currentTime),
          duration: getElement.call(this, this.config.selectors.display.duration)
        }; // Seek tooltip

        if (is$1.element(this.elements.progress)) {
          this.elements.display.seekTooltip = this.elements.progress.querySelector(".".concat(this.config.classNames.tooltip));
        }

        return true;
      } catch (error) {
        // Log it
        this.debug.warn('It looks like there is a problem with your custom controls HTML', error); // Restore native video controls

        this.toggleNativeControls(true);
        return false;
      }
    },
    // Create <svg> icon
    createIcon: function createIcon(type, attributes) {
      var namespace = 'http://www.w3.org/2000/svg';
      var iconUrl = controls.getIconUrl.call(this);
      var iconPath = "".concat(!iconUrl.cors ? iconUrl.url : '', "#").concat(this.config.iconPrefix); // Create <svg>

      var icon = document.createElementNS(namespace, 'svg');
      setAttributes(icon, extend(attributes, {
        'aria-hidden': 'true',
        focusable: 'false'
      })); // Create the <use> to reference sprite

      var use = document.createElementNS(namespace, 'use');
      var path = "".concat(iconPath, "-").concat(type); // Set `href` attributes
      // https://github.com/sampotts/plyr/issues/460
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:href

      if ('href' in use) {
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', path);
      } // Always set the older attribute even though it's "deprecated" (it'll be around for ages)


      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path); // Add <use> to <svg>

      icon.appendChild(use);
      return icon;
    },
    // Create hidden text label
    createLabel: function createLabel(key) {
      var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var text = i18n.get(key, this.config);

      var attributes = _objectSpread2(_objectSpread2({}, attr), {}, {
        class: [attr.class, this.config.classNames.hidden].filter(Boolean).join(' ')
      });

      return createElement('span', attributes, text);
    },
    // Create a badge
    createBadge: function createBadge(text) {
      if (is$1.empty(text)) {
        return null;
      }

      var badge = createElement('span', {
        class: this.config.classNames.menu.value
      });
      badge.appendChild(createElement('span', {
        class: this.config.classNames.menu.badge
      }, text));
      return badge;
    },
    // Create a <button>
    createButton: function createButton(buttonType, attr) {
      var _this = this;

      var attributes = extend({}, attr);
      var type = toCamelCase(buttonType);
      var props = {
        element: 'button',
        toggle: false,
        label: null,
        icon: null,
        labelPressed: null,
        iconPressed: null
      };
      ['element', 'icon', 'label'].forEach(function (key) {
        if (Object.keys(attributes).includes(key)) {
          props[key] = attributes[key];
          delete attributes[key];
        }
      }); // Default to 'button' type to prevent form submission

      if (props.element === 'button' && !Object.keys(attributes).includes('type')) {
        attributes.type = 'button';
      } // Set class name


      if (Object.keys(attributes).includes('class')) {
        if (!attributes.class.split(' ').some(function (c) {
          return c === _this.config.classNames.control;
        })) {
          extend(attributes, {
            class: "".concat(attributes.class, " ").concat(this.config.classNames.control)
          });
        }
      } else {
        attributes.class = this.config.classNames.control;
      } // Large play button


      switch (buttonType) {
        case 'play':
          props.toggle = true;
          props.label = 'play';
          props.labelPressed = 'pause';
          props.icon = 'play';
          props.iconPressed = 'pause';
          break;

        case 'mute':
          props.toggle = true;
          props.label = 'mute';
          props.labelPressed = 'unmute';
          props.icon = 'volume';
          props.iconPressed = 'muted';
          break;

        case 'captions':
          props.toggle = true;
          props.label = 'enableCaptions';
          props.labelPressed = 'disableCaptions';
          props.icon = 'captions-off';
          props.iconPressed = 'captions-on';
          break;

        case 'fullscreen':
          props.toggle = true;
          props.label = 'enterFullscreen';
          props.labelPressed = 'exitFullscreen';
          props.icon = 'enter-fullscreen';
          props.iconPressed = 'exit-fullscreen';
          break;

        case 'play-large':
          attributes.class += " ".concat(this.config.classNames.control, "--overlaid");
          type = 'play';
          props.label = 'play';
          props.icon = 'play';
          break;

        default:
          if (is$1.empty(props.label)) {
            props.label = type;
          }

          if (is$1.empty(props.icon)) {
            props.icon = buttonType;
          }

      }

      var button = createElement(props.element); // Setup toggle icon and labels

      if (props.toggle) {
        // Icon
        button.appendChild(controls.createIcon.call(this, props.iconPressed, {
          class: 'icon--pressed'
        }));
        button.appendChild(controls.createIcon.call(this, props.icon, {
          class: 'icon--not-pressed'
        })); // Label/Tooltip

        button.appendChild(controls.createLabel.call(this, props.labelPressed, {
          class: 'label--pressed'
        }));
        button.appendChild(controls.createLabel.call(this, props.label, {
          class: 'label--not-pressed'
        }));
      } else {
        button.appendChild(controls.createIcon.call(this, props.icon));
        button.appendChild(controls.createLabel.call(this, props.label));
      } // Merge and set attributes


      extend(attributes, getAttributesFromSelector(this.config.selectors.buttons[type], attributes));
      setAttributes(button, attributes); // We have multiple play buttons

      if (type === 'play') {
        if (!is$1.array(this.elements.buttons[type])) {
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
      // Seek input
      var input = createElement('input', extend(getAttributesFromSelector(this.config.selectors.inputs[type]), {
        type: 'range',
        min: 0,
        max: 100,
        step: 0.01,
        value: 0,
        autocomplete: 'off',
        // A11y fixes for https://github.com/sampotts/plyr/issues/905
        role: 'slider',
        'aria-label': i18n.get(type, this.config),
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': 0
      }, attributes));
      this.elements.inputs[type] = input; // Set the fill for webkit now

      controls.updateRangeFill.call(this, input); // Improve support on touch devices

      RangeTouch.setup(input);
      return input;
    },
    // Create a <progress>
    createProgress: function createProgress(type, attributes) {
      var progress = createElement('progress', extend(getAttributesFromSelector(this.config.selectors.display[type]), {
        min: 0,
        max: 100,
        value: 0,
        role: 'progressbar',
        'aria-hidden': true
      }, attributes)); // Create the label inside

      if (type !== 'volume') {
        progress.appendChild(createElement('span', null, '0'));
        var suffixKey = {
          played: 'played',
          buffer: 'buffered'
        }[type];
        var suffix = suffixKey ? i18n.get(suffixKey, this.config) : '';
        progress.innerText = "% ".concat(suffix.toLowerCase());
      }

      this.elements.display[type] = progress;
      return progress;
    },
    // Create time display
    createTime: function createTime(type, attrs) {
      var attributes = getAttributesFromSelector(this.config.selectors.display[type], attrs);
      var container = createElement('div', extend(attributes, {
        class: "".concat(attributes.class ? attributes.class : '', " ").concat(this.config.classNames.display.time, " ").trim(),
        'aria-label': i18n.get(type, this.config)
      }), '00:00'); // Reference for updates

      this.elements.display[type] = container;
      return container;
    },
    // Bind keyboard shortcuts for a menu item
    // We have to bind to keyup otherwise Firefox triggers a click when a keydown event handler shifts focus
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1220143
    bindMenuItemShortcuts: function bindMenuItemShortcuts(menuItem, type) {
      var _this2 = this;

      // Navigate through menus via arrow keys and space
      on.call(this, menuItem, 'keydown keyup', function (event) {
        // We only care about space and ⬆️ ⬇️️ ➡️
        if (![32, 38, 39, 40].includes(event.which)) {
          return;
        } // Prevent play / seek


        event.preventDefault();
        event.stopPropagation(); // We're just here to prevent the keydown bubbling

        if (event.type === 'keydown') {
          return;
        }

        var isRadioButton = matches$1(menuItem, '[role="menuitemradio"]'); // Show the respective menu

        if (!isRadioButton && [32, 39].includes(event.which)) {
          controls.showMenuPanel.call(_this2, type, true);
        } else {
          var target;

          if (event.which !== 32) {
            if (event.which === 40 || isRadioButton && event.which === 39) {
              target = menuItem.nextElementSibling;

              if (!is$1.element(target)) {
                target = menuItem.parentNode.firstElementChild;
              }
            } else {
              target = menuItem.previousElementSibling;

              if (!is$1.element(target)) {
                target = menuItem.parentNode.lastElementChild;
              }
            }

            setFocus.call(_this2, target, true);
          }
        }
      }, false); // Enter will fire a `click` event but we still need to manage focus
      // So we bind to keyup which fires after and set focus here

      on.call(this, menuItem, 'keyup', function (event) {
        if (event.which !== 13) {
          return;
        }

        controls.focusFirstMenuItem.call(_this2, null, true);
      });
    },
    // Create a settings menu item
    createMenuItem: function createMenuItem(_ref) {
      var _this3 = this;

      var value = _ref.value,
          list = _ref.list,
          type = _ref.type,
          title = _ref.title,
          _ref$badge = _ref.badge,
          badge = _ref$badge === void 0 ? null : _ref$badge,
          _ref$checked = _ref.checked,
          checked = _ref$checked === void 0 ? false : _ref$checked;
      var attributes = getAttributesFromSelector(this.config.selectors.inputs[type]);
      var menuItem = createElement('button', extend(attributes, {
        type: 'button',
        role: 'menuitemradio',
        class: "".concat(this.config.classNames.control, " ").concat(attributes.class ? attributes.class : '').trim(),
        'aria-checked': checked,
        value: value
      }));
      var flex = createElement('span'); // We have to set as HTML incase of special characters

      flex.innerHTML = title;

      if (is$1.element(badge)) {
        flex.appendChild(badge);
      }

      menuItem.appendChild(flex); // Replicate radio button behaviour

      Object.defineProperty(menuItem, 'checked', {
        enumerable: true,
        get: function get() {
          return menuItem.getAttribute('aria-checked') === 'true';
        },
        set: function set(check) {
          // Ensure exclusivity
          if (check) {
            Array.from(menuItem.parentNode.children).filter(function (node) {
              return matches$1(node, '[role="menuitemradio"]');
            }).forEach(function (node) {
              return node.setAttribute('aria-checked', 'false');
            });
          }

          menuItem.setAttribute('aria-checked', check ? 'true' : 'false');
        }
      });
      this.listeners.bind(menuItem, 'click keyup', function (event) {
        if (is$1.keyboardEvent(event) && event.which !== 32) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        menuItem.checked = true;

        switch (type) {
          case 'language':
            _this3.currentTrack = Number(value);
            break;

          case 'quality':
            _this3.quality = value;
            break;

          case 'speed':
            _this3.speed = parseFloat(value);
            break;
        }

        controls.showMenuPanel.call(_this3, 'home', is$1.keyboardEvent(event));
      }, type, false);
      controls.bindMenuItemShortcuts.call(this, menuItem, type);
      list.appendChild(menuItem);
    },
    // Format a time for display
    formatTime: function formatTime$1() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var inverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // Bail if the value isn't a number
      if (!is$1.number(time)) {
        return time;
      } // Always display hours if duration is over an hour


      var forceHours = getHours(this.duration) > 0;
      return formatTime(time, forceHours, inverted);
    },
    // Update the displayed time
    updateTimeDisplay: function updateTimeDisplay() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var inverted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      // Bail if there's no element to display or the value isn't a number
      if (!is$1.element(target) || !is$1.number(time)) {
        return;
      } // eslint-disable-next-line no-param-reassign


      target.innerText = controls.formatTime(time, inverted);
    },
    // Update volume UI and storage
    updateVolume: function updateVolume() {
      if (!this.supported.ui) {
        return;
      } // Update range


      if (is$1.element(this.elements.inputs.volume)) {
        controls.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume);
      } // Update mute state


      if (is$1.element(this.elements.buttons.mute)) {
        this.elements.buttons.mute.pressed = this.muted || this.volume === 0;
      }
    },
    // Update seek value and lower fill
    setRange: function setRange(target) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (!is$1.element(target)) {
        return;
      } // eslint-disable-next-line


      target.value = value; // Webkit range fill

      controls.updateRangeFill.call(this, target);
    },
    // Update <progress> elements
    updateProgress: function updateProgress(event) {
      var _this4 = this;

      if (!this.supported.ui || !is$1.event(event)) {
        return;
      }

      var value = 0;

      var setProgress = function setProgress(target, input) {
        var val = is$1.number(input) ? input : 0;
        var progress = is$1.element(target) ? target : _this4.elements.display.buffer; // Update value and label

        if (is$1.element(progress)) {
          progress.value = val; // Update text label inside

          var label = progress.getElementsByTagName('span')[0];

          if (is$1.element(label)) {
            label.childNodes[0].nodeValue = val;
          }
        }
      };

      if (event) {
        switch (event.type) {
          // Video playing
          case 'timeupdate':
          case 'seeking':
          case 'seeked':
            value = getPercentage(this.currentTime, this.duration); // Set seek range value only if it's a 'natural' time event

            if (event.type === 'timeupdate') {
              controls.setRange.call(this, this.elements.inputs.seek, value);
            }

            break;
          // Check buffer status

          case 'playing':
          case 'progress':
            setProgress(this.elements.display.buffer, this.buffered * 100);
            break;
        }
      }
    },
    // Webkit polyfill for lower fill range
    updateRangeFill: function updateRangeFill(target) {
      // Get range from event if event passed
      var range = is$1.event(target) ? target.target : target; // Needs to be a valid <input type='range'>

      if (!is$1.element(range) || range.getAttribute('type') !== 'range') {
        return;
      } // Set aria values for https://github.com/sampotts/plyr/issues/905


      if (matches$1(range, this.config.selectors.inputs.seek)) {
        range.setAttribute('aria-valuenow', this.currentTime);
        var currentTime = controls.formatTime(this.currentTime);
        var duration = controls.formatTime(this.duration);
        var format = i18n.get('seekLabel', this.config);
        range.setAttribute('aria-valuetext', format.replace('{currentTime}', currentTime).replace('{duration}', duration));
      } else if (matches$1(range, this.config.selectors.inputs.volume)) {
        var percent = range.value * 100;
        range.setAttribute('aria-valuenow', percent);
        range.setAttribute('aria-valuetext', "".concat(percent.toFixed(1), "%"));
      } else {
        range.setAttribute('aria-valuenow', range.value);
      } // WebKit only


      if (!browser.isWebkit) {
        return;
      } // Set CSS custom property


      range.style.setProperty('--value', "".concat(range.value / range.max * 100, "%"));
    },
    // Update hover tooltip for seeking
    updateSeekTooltip: function updateSeekTooltip(event) {
      var _this5 = this;

      // Bail if setting not true
      if (!this.config.tooltips.seek || !is$1.element(this.elements.inputs.seek) || !is$1.element(this.elements.display.seekTooltip) || this.duration === 0) {
        return;
      }

      var visible = "".concat(this.config.classNames.tooltip, "--visible");

      var toggle = function toggle(show) {
        return toggleClass(_this5.elements.display.seekTooltip, visible, show);
      }; // Hide on touch


      if (this.touch) {
        toggle(false);
        return;
      } // Determine percentage, if already visible


      var percent = 0;
      var clientRect = this.elements.progress.getBoundingClientRect();

      if (is$1.event(event)) {
        percent = 100 / clientRect.width * (event.pageX - clientRect.left);
      } else if (hasClass(this.elements.display.seekTooltip, visible)) {
        percent = parseFloat(this.elements.display.seekTooltip.style.left, 10);
      } else {
        return;
      } // Set bounds


      if (percent < 0) {
        percent = 0;
      } else if (percent > 100) {
        percent = 100;
      } // Display the time a click would seek to


      controls.updateTimeDisplay.call(this, this.elements.display.seekTooltip, this.duration / 100 * percent); // Set position

      this.elements.display.seekTooltip.style.left = "".concat(percent, "%"); // Show/hide the tooltip
      // If the event is a moues in/out and percentage is inside bounds

      if (is$1.event(event) && ['mouseenter', 'mouseleave'].includes(event.type)) {
        toggle(event.type === 'mouseenter');
      }
    },
    // Handle time change event
    timeUpdate: function timeUpdate(event) {
      // Only invert if only one time element is displayed and used for both duration and currentTime
      var invert = !is$1.element(this.elements.display.duration) && this.config.invertTime; // Duration

      controls.updateTimeDisplay.call(this, this.elements.display.currentTime, invert ? this.duration - this.currentTime : this.currentTime, invert); // Ignore updates while seeking

      if (event && event.type === 'timeupdate' && this.media.seeking) {
        return;
      } // Playing progress


      controls.updateProgress.call(this, event);
    },
    // Show the duration on metadataloaded or durationchange events
    durationUpdate: function durationUpdate() {
      // Bail if no UI or durationchange event triggered after playing/seek when invertTime is false
      if (!this.supported.ui || !this.config.invertTime && this.currentTime) {
        return;
      } // If duration is the 2**32 (shaka), Infinity (HLS), DASH-IF (Number.MAX_SAFE_INTEGER || Number.MAX_VALUE) indicating live we hide the currentTime and progressbar.
      // https://github.com/video-dev/hls.js/blob/5820d29d3c4c8a46e8b75f1e3afa3e68c1a9a2db/src/controller/buffer-controller.js#L415
      // https://github.com/google/shaka-player/blob/4d889054631f4e1cf0fbd80ddd2b71887c02e232/lib/media/streaming_engine.js#L1062
      // https://github.com/Dash-Industry-Forum/dash.js/blob/69859f51b969645b234666800d4cb596d89c602d/src/dash/models/DashManifestModel.js#L338


      if (this.duration >= Math.pow(2, 32)) {
        toggleHidden(this.elements.display.currentTime, true);
        toggleHidden(this.elements.progress, true);
        return;
      } // Update ARIA values


      if (is$1.element(this.elements.inputs.seek)) {
        this.elements.inputs.seek.setAttribute('aria-valuemax', this.duration);
      } // If there's a spot to display duration


      var hasDuration = is$1.element(this.elements.display.duration); // If there's only one time display, display duration there

      if (!hasDuration && this.config.displayDuration && this.paused) {
        controls.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration);
      } // If there's a duration element, update content


      if (hasDuration) {
        controls.updateTimeDisplay.call(this, this.elements.display.duration, this.duration);
      } // Update the tooltip (if visible)


      controls.updateSeekTooltip.call(this);
    },
    // Hide/show a tab
    toggleMenuButton: function toggleMenuButton(setting, toggle) {
      toggleHidden(this.elements.settings.buttons[setting], !toggle);
    },
    // Update the selected setting
    updateSetting: function updateSetting(setting, container, input) {
      var pane = this.elements.settings.panels[setting];
      var value = null;
      var list = container;

      if (setting === 'captions') {
        value = this.currentTrack;
      } else {
        value = !is$1.empty(input) ? input : this[setting]; // Get default

        if (is$1.empty(value)) {
          value = this.config[setting].default;
        } // Unsupported value


        if (!is$1.empty(this.options[setting]) && !this.options[setting].includes(value)) {
          this.debug.warn("Unsupported value of '".concat(value, "' for ").concat(setting));
          return;
        } // Disabled value


        if (!this.config[setting].options.includes(value)) {
          this.debug.warn("Disabled value of '".concat(value, "' for ").concat(setting));
          return;
        }
      } // Get the list if we need to


      if (!is$1.element(list)) {
        list = pane && pane.querySelector('[role="menu"]');
      } // If there's no list it means it's not been rendered...


      if (!is$1.element(list)) {
        return;
      } // Update the label


      var label = this.elements.settings.buttons[setting].querySelector(".".concat(this.config.classNames.menu.value));
      label.innerHTML = controls.getLabel.call(this, setting, value); // Find the radio option and check it

      var target = list && list.querySelector("[value=\"".concat(value, "\"]"));

      if (is$1.element(target)) {
        target.checked = true;
      }
    },
    // Translate a value into a nice label
    getLabel: function getLabel(setting, value) {
      switch (setting) {
        case 'speed':
          return value === 1 ? i18n.get('normal', this.config) : "".concat(value, "&times;");

        case 'quality':
          if (is$1.number(value)) {
            var label = i18n.get("qualityLabel.".concat(value), this.config);

            if (!label.length) {
              return "".concat(value, "p");
            }

            return label;
          }

          return toTitleCase(value);

        case 'captions':
          return captions.getLabel.call(this);

        default:
          return null;
      }
    },
    // Set the quality menu
    setQualityMenu: function setQualityMenu(options) {
      var _this6 = this;

      // Menu required
      if (!is$1.element(this.elements.settings.panels.quality)) {
        return;
      }

      var type = 'quality';
      var list = this.elements.settings.panels.quality.querySelector('[role="menu"]'); // Set options if passed and filter based on uniqueness and config

      if (is$1.array(options)) {
        this.options.quality = dedupe(options).filter(function (quality) {
          return _this6.config.quality.options.includes(quality);
        });
      } // Toggle the pane and tab


      var toggle = !is$1.empty(this.options.quality) && this.options.quality.length > 1;
      controls.toggleMenuButton.call(this, type, toggle); // Empty the menu

      emptyElement(list); // Check if we need to toggle the parent

      controls.checkMenu.call(this); // If we're hiding, nothing more to do

      if (!toggle) {
        return;
      } // Get the badge HTML for HD, 4K etc


      var getBadge = function getBadge(quality) {
        var label = i18n.get("qualityBadge.".concat(quality), _this6.config);

        if (!label.length) {
          return null;
        }

        return controls.createBadge.call(_this6, label);
      }; // Sort options by the config and then render options


      this.options.quality.sort(function (a, b) {
        var sorting = _this6.config.quality.options;
        return sorting.indexOf(a) > sorting.indexOf(b) ? 1 : -1;
      }).forEach(function (quality) {
        controls.createMenuItem.call(_this6, {
          value: quality,
          list: list,
          type: type,
          title: controls.getLabel.call(_this6, 'quality', quality),
          badge: getBadge(quality)
        });
      });
      controls.updateSetting.call(this, type, list);
    },
    // Set the looping options

    /* setLoopMenu() {
          // Menu required
          if (!is.element(this.elements.settings.panels.loop)) {
              return;
          }
           const options = ['start', 'end', 'all', 'reset'];
          const list = this.elements.settings.panels.loop.querySelector('[role="menu"]');
           // Show the pane and tab
          toggleHidden(this.elements.settings.buttons.loop, false);
          toggleHidden(this.elements.settings.panels.loop, false);
           // Toggle the pane and tab
          const toggle = !is.empty(this.loop.options);
          controls.toggleMenuButton.call(this, 'loop', toggle);
           // Empty the menu
          emptyElement(list);
           options.forEach(option => {
              const item = createElement('li');
               const button = createElement(
                  'button',
                  extend(getAttributesFromSelector(this.config.selectors.buttons.loop), {
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
      var _this7 = this;

      // Menu required
      if (!is$1.element(this.elements.settings.panels.captions)) {
        return;
      } // TODO: Captions or language? Currently it's mixed


      var type = 'captions';
      var list = this.elements.settings.panels.captions.querySelector('[role="menu"]');
      var tracks = captions.getTracks.call(this);
      var toggle = Boolean(tracks.length); // Toggle the pane and tab

      controls.toggleMenuButton.call(this, type, toggle); // Empty the menu

      emptyElement(list); // Check if we need to toggle the parent

      controls.checkMenu.call(this); // If there's no captions, bail

      if (!toggle) {
        return;
      } // Generate options data


      var options = tracks.map(function (track, value) {
        return {
          value: value,
          checked: _this7.captions.toggled && _this7.currentTrack === value,
          title: captions.getLabel.call(_this7, track),
          badge: track.language && controls.createBadge.call(_this7, track.language.toUpperCase()),
          list: list,
          type: 'language'
        };
      }); // Add the "Disabled" option to turn off captions

      options.unshift({
        value: -1,
        checked: !this.captions.toggled,
        title: i18n.get('disabled', this.config),
        list: list,
        type: 'language'
      }); // Generate options

      options.forEach(controls.createMenuItem.bind(this));
      controls.updateSetting.call(this, type, list);
    },
    // Set a list of available captions languages
    setSpeedMenu: function setSpeedMenu() {
      var _this8 = this;

      // Menu required
      if (!is$1.element(this.elements.settings.panels.speed)) {
        return;
      }

      var type = 'speed';
      var list = this.elements.settings.panels.speed.querySelector('[role="menu"]'); // Filter out invalid speeds

      this.options.speed = this.options.speed.filter(function (o) {
        return o >= _this8.minimumSpeed && o <= _this8.maximumSpeed;
      }); // Toggle the pane and tab

      var toggle = !is$1.empty(this.options.speed) && this.options.speed.length > 1;
      controls.toggleMenuButton.call(this, type, toggle); // Empty the menu

      emptyElement(list); // Check if we need to toggle the parent

      controls.checkMenu.call(this); // If we're hiding, nothing more to do

      if (!toggle) {
        return;
      } // Create items


      this.options.speed.forEach(function (speed) {
        controls.createMenuItem.call(_this8, {
          value: speed,
          list: list,
          type: type,
          title: controls.getLabel.call(_this8, 'speed', speed)
        });
      });
      controls.updateSetting.call(this, type, list);
    },
    // Check if we need to hide/show the settings menu
    checkMenu: function checkMenu() {
      var buttons = this.elements.settings.buttons;
      var visible = !is$1.empty(buttons) && Object.values(buttons).some(function (button) {
        return !button.hidden;
      });
      toggleHidden(this.elements.settings.menu, !visible);
    },
    // Focus the first menu item in a given (or visible) menu
    focusFirstMenuItem: function focusFirstMenuItem(pane) {
      var tabFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.elements.settings.popup.hidden) {
        return;
      }

      var target = pane;

      if (!is$1.element(target)) {
        target = Object.values(this.elements.settings.panels).find(function (p) {
          return !p.hidden;
        });
      }

      var firstItem = target.querySelector('[role^="menuitem"]');
      setFocus.call(this, firstItem, tabFocus);
    },
    // Show/hide menu
    toggleMenu: function toggleMenu(input) {
      var popup = this.elements.settings.popup;
      var button = this.elements.buttons.settings; // Menu and button are required

      if (!is$1.element(popup) || !is$1.element(button)) {
        return;
      } // True toggle by default


      var hidden = popup.hidden;
      var show = hidden;

      if (is$1.boolean(input)) {
        show = input;
      } else if (is$1.keyboardEvent(input) && input.which === 27) {
        show = false;
      } else if (is$1.event(input)) {
        // If Plyr is in a shadowDOM, the event target is set to the component, instead of the
        // Element in the shadowDOM. The path, if available, is complete.
        var target = is$1.function(input.composedPath) ? input.composedPath()[0] : input.target;
        var isMenuItem = popup.contains(target); // If the click was inside the menu or if the click
        // wasn't the button or menu item and we're trying to
        // show the menu (a doc click shouldn't show the menu)

        if (isMenuItem || !isMenuItem && input.target !== button && show) {
          return;
        }
      } // Set button attributes


      button.setAttribute('aria-expanded', show); // Show the actual popup

      toggleHidden(popup, !show); // Add class hook

      toggleClass(this.elements.container, this.config.classNames.menu.open, show); // Focus the first item if key interaction

      if (show && is$1.keyboardEvent(input)) {
        controls.focusFirstMenuItem.call(this, null, true);
      } else if (!show && !hidden) {
        // If closing, re-focus the button
        setFocus.call(this, button, is$1.keyboardEvent(input));
      }
    },
    // Get the natural size of a menu panel
    getMenuSize: function getMenuSize(tab) {
      var clone = tab.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.opacity = 0;
      clone.removeAttribute('hidden'); // Append to parent so we get the "real" size

      tab.parentNode.appendChild(clone); // Get the sizes before we remove

      var width = clone.scrollWidth;
      var height = clone.scrollHeight; // Remove from the DOM

      removeElement(clone);
      return {
        width: width,
        height: height
      };
    },
    // Show a panel in the menu
    showMenuPanel: function showMenuPanel() {
      var _this9 = this;

      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var tabFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var target = this.elements.container.querySelector("#plyr-settings-".concat(this.id, "-").concat(type)); // Nothing to show, bail

      if (!is$1.element(target)) {
        return;
      } // Hide all other panels


      var container = target.parentNode;
      var current = Array.from(container.children).find(function (node) {
        return !node.hidden;
      }); // If we can do fancy animations, we'll animate the height/width

      if (support.transitions && !support.reducedMotion) {
        // Set the current width as a base
        container.style.width = "".concat(current.scrollWidth, "px");
        container.style.height = "".concat(current.scrollHeight, "px"); // Get potential sizes

        var size = controls.getMenuSize.call(this, target); // Restore auto height/width

        var restore = function restore(event) {
          // We're only bothered about height and width on the container
          if (event.target !== container || !['width', 'height'].includes(event.propertyName)) {
            return;
          } // Revert back to auto


          container.style.width = '';
          container.style.height = ''; // Only listen once

          off.call(_this9, container, transitionEndEvent, restore);
        }; // Listen for the transition finishing and restore auto height/width


        on.call(this, container, transitionEndEvent, restore); // Set dimensions to target

        container.style.width = "".concat(size.width, "px");
        container.style.height = "".concat(size.height, "px");
      } // Set attributes on current tab


      toggleHidden(current, true); // Set attributes on target

      toggleHidden(target, false); // Focus the first item

      controls.focusFirstMenuItem.call(this, target, tabFocus);
    },
    // Set the download URL
    setDownloadUrl: function setDownloadUrl() {
      var button = this.elements.buttons.download; // Bail if no button

      if (!is$1.element(button)) {
        return;
      } // Set attribute


      button.setAttribute('href', this.download);
    },
    // Build the default HTML
    create: function create(data) {
      var _this10 = this;

      var bindMenuItemShortcuts = controls.bindMenuItemShortcuts,
          createButton = controls.createButton,
          createProgress = controls.createProgress,
          createRange = controls.createRange,
          createTime = controls.createTime,
          setQualityMenu = controls.setQualityMenu,
          setSpeedMenu = controls.setSpeedMenu,
          showMenuPanel = controls.showMenuPanel;
      this.elements.controls = null; // Larger overlaid play button

      if (is$1.array(this.config.controls) && this.config.controls.includes('play-large')) {
        this.elements.container.appendChild(createButton.call(this, 'play-large'));
      } // Create the container


      var container = createElement('div', getAttributesFromSelector(this.config.selectors.controls.wrapper));
      this.elements.controls = container; // Default item attributes

      var defaultAttributes = {
        class: 'plyr__controls__item'
      }; // Loop through controls in order

      dedupe(is$1.array(this.config.controls) ? this.config.controls : []).forEach(function (control) {
        // Restart button
        if (control === 'restart') {
          container.appendChild(createButton.call(_this10, 'restart', defaultAttributes));
        } // Rewind button


        if (control === 'rewind') {
          container.appendChild(createButton.call(_this10, 'rewind', defaultAttributes));
        } // Play/Pause button


        if (control === 'play') {
          container.appendChild(createButton.call(_this10, 'play', defaultAttributes));
        } // Fast forward button


        if (control === 'fast-forward') {
          container.appendChild(createButton.call(_this10, 'fast-forward', defaultAttributes));
        } // Progress


        if (control === 'progress') {
          var progressContainer = createElement('div', {
            class: "".concat(defaultAttributes.class, " plyr__progress__container")
          });
          var progress = createElement('div', getAttributesFromSelector(_this10.config.selectors.progress)); // Seek range slider

          progress.appendChild(createRange.call(_this10, 'seek', {
            id: "plyr-seek-".concat(data.id)
          })); // Buffer progress

          progress.appendChild(createProgress.call(_this10, 'buffer')); // TODO: Add loop display indicator
          // Seek tooltip

          if (_this10.config.tooltips.seek) {
            var tooltip = createElement('span', {
              class: _this10.config.classNames.tooltip
            }, '00:00');
            progress.appendChild(tooltip);
            _this10.elements.display.seekTooltip = tooltip;
          }

          _this10.elements.progress = progress;
          progressContainer.appendChild(_this10.elements.progress);
          container.appendChild(progressContainer);
        } // Media current time display


        if (control === 'current-time') {
          container.appendChild(createTime.call(_this10, 'currentTime', defaultAttributes));
        } // Media duration display


        if (control === 'duration') {
          container.appendChild(createTime.call(_this10, 'duration', defaultAttributes));
        } // Volume controls


        if (control === 'mute' || control === 'volume') {
          var volume = _this10.elements.volume; // Create the volume container if needed

          if (!is$1.element(volume) || !container.contains(volume)) {
            volume = createElement('div', extend({}, defaultAttributes, {
              class: "".concat(defaultAttributes.class, " plyr__volume").trim()
            }));
            _this10.elements.volume = volume;
            container.appendChild(volume);
          } // Toggle mute button


          if (control === 'mute') {
            volume.appendChild(createButton.call(_this10, 'mute'));
          } // Volume range control
          // Ignored on iOS as it's handled globally
          // https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html


          if (control === 'volume' && !browser.isIos) {
            // Set the attributes
            var attributes = {
              max: 1,
              step: 0.05,
              value: _this10.config.volume
            }; // Create the volume range slider

            volume.appendChild(createRange.call(_this10, 'volume', extend(attributes, {
              id: "plyr-volume-".concat(data.id)
            })));
          }
        } // Toggle captions button


        if (control === 'captions') {
          container.appendChild(createButton.call(_this10, 'captions', defaultAttributes));
        } // Settings button / menu


        if (control === 'settings' && !is$1.empty(_this10.config.settings)) {
          var wrapper = createElement('div', extend({}, defaultAttributes, {
            class: "".concat(defaultAttributes.class, " plyr__menu").trim(),
            hidden: ''
          }));
          wrapper.appendChild(createButton.call(_this10, 'settings', {
            'aria-haspopup': true,
            'aria-controls': "plyr-settings-".concat(data.id),
            'aria-expanded': false
          }));
          var popup = createElement('div', {
            class: 'plyr__menu__container',
            id: "plyr-settings-".concat(data.id),
            hidden: ''
          });
          var inner = createElement('div');
          var home = createElement('div', {
            id: "plyr-settings-".concat(data.id, "-home")
          }); // Create the menu

          var menu = createElement('div', {
            role: 'menu'
          });
          home.appendChild(menu);
          inner.appendChild(home);
          _this10.elements.settings.panels.home = home; // Build the menu items

          _this10.config.settings.forEach(function (type) {
            // TODO: bundle this with the createMenuItem helper and bindings
            var menuItem = createElement('button', extend(getAttributesFromSelector(_this10.config.selectors.buttons.settings), {
              type: 'button',
              class: "".concat(_this10.config.classNames.control, " ").concat(_this10.config.classNames.control, "--forward"),
              role: 'menuitem',
              'aria-haspopup': true,
              hidden: ''
            })); // Bind menu shortcuts for keyboard users

            bindMenuItemShortcuts.call(_this10, menuItem, type); // Show menu on click

            on.call(_this10, menuItem, 'click', function () {
              showMenuPanel.call(_this10, type, false);
            });
            var flex = createElement('span', null, i18n.get(type, _this10.config));
            var value = createElement('span', {
              class: _this10.config.classNames.menu.value
            }); // Speed contains HTML entities

            value.innerHTML = data[type];
            flex.appendChild(value);
            menuItem.appendChild(flex);
            menu.appendChild(menuItem); // Build the panes

            var pane = createElement('div', {
              id: "plyr-settings-".concat(data.id, "-").concat(type),
              hidden: ''
            }); // Back button

            var backButton = createElement('button', {
              type: 'button',
              class: "".concat(_this10.config.classNames.control, " ").concat(_this10.config.classNames.control, "--back")
            }); // Visible label

            backButton.appendChild(createElement('span', {
              'aria-hidden': true
            }, i18n.get(type, _this10.config))); // Screen reader label

            backButton.appendChild(createElement('span', {
              class: _this10.config.classNames.hidden
            }, i18n.get('menuBack', _this10.config))); // Go back via keyboard

            on.call(_this10, pane, 'keydown', function (event) {
              // We only care about <-
              if (event.which !== 37) {
                return;
              } // Prevent seek


              event.preventDefault();
              event.stopPropagation(); // Show the respective menu

              showMenuPanel.call(_this10, 'home', true);
            }, false); // Go back via button click

            on.call(_this10, backButton, 'click', function () {
              showMenuPanel.call(_this10, 'home', false);
            }); // Add to pane

            pane.appendChild(backButton); // Menu

            pane.appendChild(createElement('div', {
              role: 'menu'
            }));
            inner.appendChild(pane);
            _this10.elements.settings.buttons[type] = menuItem;
            _this10.elements.settings.panels[type] = pane;
          });

          popup.appendChild(inner);
          wrapper.appendChild(popup);
          container.appendChild(wrapper);
          _this10.elements.settings.popup = popup;
          _this10.elements.settings.menu = wrapper;
        } // Picture in picture button


        if (control === 'pip' && support.pip) {
          container.appendChild(createButton.call(_this10, 'pip', defaultAttributes));
        } // Airplay button


        if (control === 'airplay' && support.airplay) {
          container.appendChild(createButton.call(_this10, 'airplay', defaultAttributes));
        } // Download button


        if (control === 'download') {
          var _attributes = extend({}, defaultAttributes, {
            element: 'a',
            href: _this10.download,
            target: '_blank'
          }); // Set download attribute for HTML5 only


          if (_this10.isHTML5) {
            _attributes.download = '';
          }

          var download = _this10.config.urls.download;

          if (!is$1.url(download) && _this10.isEmbed) {
            extend(_attributes, {
              icon: "logo-".concat(_this10.provider),
              label: _this10.provider
            });
          }

          container.appendChild(createButton.call(_this10, 'download', _attributes));
        } // Toggle fullscreen button


        if (control === 'fullscreen') {
          container.appendChild(createButton.call(_this10, 'fullscreen', defaultAttributes));
        }
      }); // Set available quality levels

      if (this.isHTML5) {
        setQualityMenu.call(this, html5.getQualityOptions.call(this));
      }

      setSpeedMenu.call(this);
      return container;
    },
    // Insert controls
    inject: function inject() {
      var _this11 = this;

      // Sprite
      if (this.config.loadSprite) {
        var icon = controls.getIconUrl.call(this); // Only load external sprite using AJAX

        if (icon.cors) {
          loadSprite(icon.url, 'sprite-plyr');
        }
      } // Create a unique ID


      this.id = Math.floor(Math.random() * 10000); // Null by default

      var container = null;
      this.elements.controls = null; // Set template properties

      var props = {
        id: this.id,
        seektime: this.config.seekTime,
        title: this.config.title
      };
      var update = true; // If function, run it and use output

      if (is$1.function(this.config.controls)) {
        this.config.controls = this.config.controls.call(this, props);
      } // Convert falsy controls to empty array (primarily for empty strings)


      if (!this.config.controls) {
        this.config.controls = [];
      }

      if (is$1.element(this.config.controls) || is$1.string(this.config.controls)) {
        // HTMLElement or Non-empty string passed as the option
        container = this.config.controls;
      } else {
        // Create controls
        container = controls.create.call(this, {
          id: this.id,
          seektime: this.config.seekTime,
          speed: this.speed,
          quality: this.quality,
          captions: captions.getLabel.call(this) // TODO: Looping
          // loop: 'None',

        });
        update = false;
      } // Replace props with their value


      var replace = function replace(input) {
        var result = input;
        Object.entries(props).forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              key = _ref3[0],
              value = _ref3[1];

          result = replaceAll(result, "{".concat(key, "}"), value);
        });
        return result;
      }; // Update markup


      if (update) {
        if (is$1.string(this.config.controls)) {
          container = replace(container);
        }
      } // Controls container


      var target; // Inject to custom location

      if (is$1.string(this.config.selectors.controls.container)) {
        target = document.querySelector(this.config.selectors.controls.container);
      } // Inject into the container by default


      if (!is$1.element(target)) {
        target = this.elements.container;
      } // Inject controls HTML (needs to be before captions, hence "afterbegin")


      var insertMethod = is$1.element(container) ? 'insertAdjacentElement' : 'insertAdjacentHTML';
      target[insertMethod]('afterbegin', container); // Find the elements if need be

      if (!is$1.element(this.elements.controls)) {
        controls.findElements.call(this);
      } // Add pressed property to buttons


      if (!is$1.empty(this.elements.buttons)) {
        var addProperty = function addProperty(button) {
          var className = _this11.config.classNames.controlPressed;
          Object.defineProperty(button, 'pressed', {
            enumerable: true,
            get: function get() {
              return hasClass(button, className);
            },
            set: function set() {
              var pressed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
              toggleClass(button, className, pressed);
            }
          });
        }; // Toggle classname when pressed property is set


        Object.values(this.elements.buttons).filter(Boolean).forEach(function (button) {
          if (is$1.array(button) || is$1.nodeList(button)) {
            Array.from(button).filter(Boolean).forEach(addProperty);
          } else {
            addProperty(button);
          }
        });
      } // Edge sometimes doesn't finish the paint so force a repaint


      if (browser.isEdge) {
        repaint(target);
      } // Setup tooltips


      if (this.config.tooltips.controls) {
        var _this$config = this.config,
            classNames = _this$config.classNames,
            selectors = _this$config.selectors;
        var selector = "".concat(selectors.controls.wrapper, " ").concat(selectors.labels, " .").concat(classNames.hidden);
        var labels = getElements.call(this, selector);
        Array.from(labels).forEach(function (label) {
          toggleClass(label, _this11.config.classNames.hidden, false);
          toggleClass(label, _this11.config.classNames.tooltip, true);
        });
      }
    }
  };

  /**
   * Parse a string to a URL object
   * @param {String} input - the URL to be parsed
   * @param {Boolean} safe - failsafe parsing
   */

  function parseUrl(input) {
    var safe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var url = input;

    if (safe) {
      var parser = document.createElement('a');
      parser.href = url;
      url = parser.href;
    }

    try {
      return new URL(url);
    } catch (e) {
      return null;
    }
  } // Convert object to URLSearchParams

  function buildUrlParams(input) {
    var params = new URLSearchParams();

    if (is$1.object(input)) {
      Object.entries(input).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        params.set(key, value);
      });
    }

    return params;
  }

  var captions = {
    // Setup captions
    setup: function setup() {
      // Requires UI support
      if (!this.supported.ui) {
        return;
      } // Only Vimeo and HTML5 video supported at this point


      if (!this.isVideo || this.isYouTube || this.isHTML5 && !support.textTracks) {
        // Clear menu and hide
        if (is$1.array(this.config.controls) && this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
          controls.setCaptionsMenu.call(this);
        }

        return;
      } // Inject the container


      if (!is$1.element(this.elements.captions)) {
        this.elements.captions = createElement('div', getAttributesFromSelector(this.config.selectors.captions));
        insertAfter(this.elements.captions, this.elements.wrapper);
      } // Fix IE captions if CORS is used
      // Fetch captions and inject as blobs instead (data URIs not supported!)


      if (browser.isIE && window.URL) {
        var elements = this.media.querySelectorAll('track');
        Array.from(elements).forEach(function (track) {
          var src = track.getAttribute('src');
          var url = parseUrl(src);

          if (url !== null && url.hostname !== window.location.href.hostname && ['http:', 'https:'].includes(url.protocol)) {
            fetch(src, 'blob').then(function (blob) {
              track.setAttribute('src', window.URL.createObjectURL(blob));
            }).catch(function () {
              removeElement(track);
            });
          }
        });
      } // Get and set initial data
      // The "preferred" options are not realized unless / until the wanted language has a match
      // * languages: Array of user's browser languages.
      // * language:  The language preferred by user settings or config
      // * active:    The state preferred by user settings or config
      // * toggled:   The real captions state


      var browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];
      var languages = dedupe(browserLanguages.map(function (language) {
        return language.split('-')[0];
      }));
      var language = (this.storage.get('language') || this.config.captions.language || 'auto').toLowerCase(); // Use first browser language when language is 'auto'

      if (language === 'auto') {
        var _languages = _slicedToArray(languages, 1);

        language = _languages[0];
      }

      var active = this.storage.get('captions');

      if (!is$1.boolean(active)) {
        active = this.config.captions.active;
      }

      Object.assign(this.captions, {
        toggled: false,
        active: active,
        language: language,
        languages: languages
      }); // Watch changes to textTracks and update captions menu

      if (this.isHTML5) {
        var trackEvents = this.config.captions.update ? 'addtrack removetrack' : 'removetrack';
        on.call(this, this.media.textTracks, trackEvents, captions.update.bind(this));
      } // Update available languages in list next tick (the event must not be triggered before the listeners)


      setTimeout(captions.update.bind(this), 0);
    },
    // Update available language options in settings based on tracks
    update: function update() {
      var _this = this;

      var tracks = captions.getTracks.call(this, true); // Get the wanted language

      var _this$captions = this.captions,
          active = _this$captions.active,
          language = _this$captions.language,
          meta = _this$captions.meta,
          currentTrackNode = _this$captions.currentTrackNode;
      var languageExists = Boolean(tracks.find(function (track) {
        return track.language === language;
      })); // Handle tracks (add event listener and "pseudo"-default)

      if (this.isHTML5 && this.isVideo) {
        tracks.filter(function (track) {
          return !meta.get(track);
        }).forEach(function (track) {
          _this.debug.log('Track added', track); // Attempt to store if the original dom element was "default"


          meta.set(track, {
            default: track.mode === 'showing'
          }); // Turn off native caption rendering to avoid double captions
          // Note: mode='hidden' forces a track to download. To ensure every track
          // isn't downloaded at once, only 'showing' tracks should be reassigned
          // eslint-disable-next-line no-param-reassign

          if (track.mode === 'showing') {
            // eslint-disable-next-line no-param-reassign
            track.mode = 'hidden';
          } // Add event listener for cue changes


          on.call(_this, track, 'cuechange', function () {
            return captions.updateCues.call(_this);
          });
        });
      } // Update language first time it matches, or if the previous matching track was removed


      if (languageExists && this.language !== language || !tracks.includes(currentTrackNode)) {
        captions.setLanguage.call(this, language);
        captions.toggle.call(this, active && languageExists);
      } // Enable or disable captions based on track length


      toggleClass(this.elements.container, this.config.classNames.captions.enabled, !is$1.empty(tracks)); // Update available languages in list

      if (is$1.array(this.config.controls) && this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
        controls.setCaptionsMenu.call(this);
      }
    },
    // Toggle captions display
    // Used internally for the toggleCaptions method, with the passive option forced to false
    toggle: function toggle(input) {
      var _this2 = this;

      var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // If there's no full support
      if (!this.supported.ui) {
        return;
      }

      var toggled = this.captions.toggled; // Current state

      var activeClass = this.config.classNames.captions.active; // Get the next state
      // If the method is called without parameter, toggle based on current value

      var active = is$1.nullOrUndefined(input) ? !toggled : input; // Update state and trigger event

      if (active !== toggled) {
        // When passive, don't override user preferences
        if (!passive) {
          this.captions.active = active;
          this.storage.set({
            captions: active
          });
        } // Force language if the call isn't passive and there is no matching language to toggle to


        if (!this.language && active && !passive) {
          var tracks = captions.getTracks.call(this);
          var track = captions.findTrack.call(this, [this.captions.language].concat(_toConsumableArray(this.captions.languages)), true); // Override user preferences to avoid switching languages if a matching track is added

          this.captions.language = track.language; // Set caption, but don't store in localStorage as user preference

          captions.set.call(this, tracks.indexOf(track));
          return;
        } // Toggle button if it's enabled


        if (this.elements.buttons.captions) {
          this.elements.buttons.captions.pressed = active;
        } // Add class hook


        toggleClass(this.elements.container, activeClass, active);
        this.captions.toggled = active; // Update settings menu

        controls.updateSetting.call(this, 'captions'); // Trigger event (not used internally)

        triggerEvent.call(this, this.media, active ? 'captionsenabled' : 'captionsdisabled');
      } // Wait for the call stack to clear before setting mode='hidden'
      // on the active track - forcing the browser to download it


      setTimeout(function () {
        if (active && _this2.captions.toggled) {
          _this2.captions.currentTrackNode.mode = 'hidden';
        }
      });
    },
    // Set captions by track index
    // Used internally for the currentTrack setter with the passive option forced to false
    set: function set(index) {
      var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var tracks = captions.getTracks.call(this); // Disable captions if setting to -1

      if (index === -1) {
        captions.toggle.call(this, false, passive);
        return;
      }

      if (!is$1.number(index)) {
        this.debug.warn('Invalid caption argument', index);
        return;
      }

      if (!(index in tracks)) {
        this.debug.warn('Track not found', index);
        return;
      }

      if (this.captions.currentTrack !== index) {
        this.captions.currentTrack = index;
        var track = tracks[index];

        var _ref = track || {},
            language = _ref.language; // Store reference to node for invalidation on remove


        this.captions.currentTrackNode = track; // Update settings menu

        controls.updateSetting.call(this, 'captions'); // When passive, don't override user preferences

        if (!passive) {
          this.captions.language = language;
          this.storage.set({
            language: language
          });
        } // Handle Vimeo captions


        if (this.isVimeo) {
          this.embed.enableTextTrack(language);
        } // Trigger event


        triggerEvent.call(this, this.media, 'languagechange');
      } // Show captions


      captions.toggle.call(this, true, passive);

      if (this.isHTML5 && this.isVideo) {
        // If we change the active track while a cue is already displayed we need to update it
        captions.updateCues.call(this);
      }
    },
    // Set captions by language
    // Used internally for the language setter with the passive option forced to false
    setLanguage: function setLanguage(input) {
      var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!is$1.string(input)) {
        this.debug.warn('Invalid language argument', input);
        return;
      } // Normalize


      var language = input.toLowerCase();
      this.captions.language = language; // Set currentTrack

      var tracks = captions.getTracks.call(this);
      var track = captions.findTrack.call(this, [language]);
      captions.set.call(this, tracks.indexOf(track), passive);
    },
    // Get current valid caption tracks
    // If update is false it will also ignore tracks without metadata
    // This is used to "freeze" the language options when captions.update is false
    getTracks: function getTracks() {
      var _this3 = this;

      var update = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      // Handle media or textTracks missing or null
      var tracks = Array.from((this.media || {}).textTracks || []); // For HTML5, use cache instead of current tracks when it exists (if captions.update is false)
      // Filter out removed tracks and tracks that aren't captions/subtitles (for example metadata)

      return tracks.filter(function (track) {
        return !_this3.isHTML5 || update || _this3.captions.meta.has(track);
      }).filter(function (track) {
        return ['captions', 'subtitles'].includes(track.kind);
      });
    },
    // Match tracks based on languages and get the first
    findTrack: function findTrack(languages) {
      var _this4 = this;

      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var tracks = captions.getTracks.call(this);

      var sortIsDefault = function sortIsDefault(track) {
        return Number((_this4.captions.meta.get(track) || {}).default);
      };

      var sorted = Array.from(tracks).sort(function (a, b) {
        return sortIsDefault(b) - sortIsDefault(a);
      });
      var track;
      languages.every(function (language) {
        track = sorted.find(function (t) {
          return t.language === language;
        });
        return !track; // Break iteration if there is a match
      }); // If no match is found but is required, get first

      return track || (force ? sorted[0] : undefined);
    },
    // Get the current track
    getCurrentTrack: function getCurrentTrack() {
      return captions.getTracks.call(this)[this.currentTrack];
    },
    // Get UI label for track
    getLabel: function getLabel(track) {
      var currentTrack = track;

      if (!is$1.track(currentTrack) && support.textTracks && this.captions.toggled) {
        currentTrack = captions.getCurrentTrack.call(this);
      }

      if (is$1.track(currentTrack)) {
        if (!is$1.empty(currentTrack.label)) {
          return currentTrack.label;
        }

        if (!is$1.empty(currentTrack.language)) {
          return track.language.toUpperCase();
        }

        return i18n.get('enabled', this.config);
      }

      return i18n.get('disabled', this.config);
    },
    // Update captions using current track's active cues
    // Also optional array argument in case there isn't any track (ex: vimeo)
    updateCues: function updateCues(input) {
      // Requires UI
      if (!this.supported.ui) {
        return;
      }

      if (!is$1.element(this.elements.captions)) {
        this.debug.warn('No captions element to render to');
        return;
      } // Only accept array or empty input


      if (!is$1.nullOrUndefined(input) && !Array.isArray(input)) {
        this.debug.warn('updateCues: Invalid input', input);
        return;
      }

      var cues = input; // Get cues from track

      if (!cues) {
        var track = captions.getCurrentTrack.call(this);
        cues = Array.from((track || {}).activeCues || []).map(function (cue) {
          return cue.getCueAsHTML();
        }).map(getHTML);
      } // Set new caption text


      var content = cues.map(function (cueText) {
        return cueText.trim();
      }).join('\n');
      var changed = content !== this.elements.captions.innerHTML;

      if (changed) {
        // Empty the container and create a new child element
        emptyElement(this.elements.captions);
        var caption = createElement('span', getAttributesFromSelector(this.config.selectors.caption));
        caption.innerHTML = content;
        this.elements.captions.appendChild(caption); // Trigger event

        triggerEvent.call(this, this.media, 'cuechange');
      }
    }
  };

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
    // Allow inline playback on iOS (this effects YouTube/Vimeo - HTML5 requires the attribute present)
    // TODO: Remove iosNative fullscreen option in favour of this (logic needs work)
    playsinline: true,
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
    // Force an aspect ratio
    // The format must be `'w:h'` (e.g. `'16:9'`)
    ratio: null,
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
    iconUrl: 'https://cdn.plyr.io/3.6.3/plyr.svg',
    // Blank video (used to prevent errors on source change)
    blankVideo: 'https://cdn.plyr.io/static/blank.mp4',
    // Quality default
    quality: {
      default: 576,
      // The options to display in the UI, if available for the source media
      options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
      forced: false,
      onChange: null
    },
    // Set loops
    loop: {
      active: false // start: null,
      // end: null,

    },
    // Speed default and options to display
    speed: {
      selected: 1,
      // The options to display in the UI, if available for the source media (e.g. Vimeo and YouTube only support 0.5x-4x)
      options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4]
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
      language: 'auto',
      // Listen to new tracks added after Plyr is initialized.
      // This is needed for streaming captions, but may result in unselectable options
      update: false
    },
    // Fullscreen settings
    fullscreen: {
      enabled: true,
      // Allow fullscreen?
      fallback: true,
      // Fallback using full viewport/window
      iosNative: false // Use the native fullscreen in iOS (disables custom controls)
      // Selector for the fullscreen container so contextual / non-player content can remain visible in fullscreen mode
      // Non-ancestors of the player element will be ignored
      // container: null, // defaults to the player element

    },
    // Local storage
    storage: {
      enabled: true,
      key: 'plyr'
    },
    // Default controls
    controls: ['play-large', // 'restart',
    // 'rewind',
    'play', // 'fast-forward',
    'progress', 'current-time', // 'duration',
    'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', // 'download',
    'fullscreen'],
    settings: ['captions', 'quality', 'speed'],
    // Localisation
    i18n: {
      restart: 'Restart',
      rewind: 'Rewind {seektime}s',
      play: 'Play',
      pause: 'Pause',
      fastForward: 'Forward {seektime}s',
      seek: 'Seek',
      seekLabel: '{currentTime} of {duration}',
      played: 'Played',
      buffered: 'Buffered',
      currentTime: 'Current time',
      duration: 'Duration',
      volume: 'Volume',
      mute: 'Mute',
      unmute: 'Unmute',
      enableCaptions: 'Enable captions',
      disableCaptions: 'Disable captions',
      download: 'Download',
      enterFullscreen: 'Enter fullscreen',
      exitFullscreen: 'Exit fullscreen',
      frameTitle: 'Player for {title}',
      captions: 'Captions',
      settings: 'Settings',
      pip: 'PIP',
      menuBack: 'Go back to previous menu',
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
      advertisement: 'Ad',
      qualityBadge: {
        2160: '4K',
        1440: 'HD',
        1080: 'HD',
        720: 'HD',
        576: 'SD',
        480: 'SD'
      }
    },
    // URLs
    urls: {
      download: null,
      vimeo: {
        sdk: 'https://player.vimeo.com/api/player.js',
        iframe: 'https://player.vimeo.com/video/{0}?{1}',
        api: 'https://vimeo.com/api/oembed.json?url={0}'
      },
      youtube: {
        sdk: 'https://www.youtube.com/iframe_api',
        api: 'https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}'
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
      download: null,
      fullscreen: null,
      pip: null,
      airplay: null,
      speed: null,
      quality: null,
      loop: null,
      language: null
    },
    // Events to watch and bubble
    events: [// Events to watch on HTML5 media elements and bubble
    // https://developer.mozilla.org/en/docs/Web/Guide/Events/Media_events
    'ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'pause', 'error', 'seeking', 'seeked', 'emptied', 'ratechange', 'cuechange', // Custom events
    'download', 'enterfullscreen', 'exitfullscreen', 'captionsenabled', 'captionsdisabled', 'languagechange', 'controlshidden', 'controlsshown', 'ready', // YouTube
    'statechange', // Quality
    'qualitychange', // Ads
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
        download: '[data-plyr="download"]',
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
        buffer: '.plyr__progress__buffer',
        loop: '.plyr__progress__loop',
        // Used later
        volume: '.plyr__volume--display'
      },
      progress: '.plyr__progress',
      captions: '.plyr__captions',
      caption: '.plyr__caption'
    },
    // Class hooks added to the player in different states
    classNames: {
      type: 'plyr--{0}',
      provider: 'plyr--{0}',
      video: 'plyr__video-wrapper',
      embed: 'plyr__video-embed',
      videoFixedRatio: 'plyr__video-wrapper--fixed-ratio',
      embedContainer: 'plyr__video-embed__container',
      poster: 'plyr__poster',
      posterEnabled: 'plyr__poster-enabled',
      ads: 'plyr__ads',
      control: 'plyr__control',
      controlPressed: 'plyr__control--pressed',
      playing: 'plyr--playing',
      paused: 'plyr--paused',
      stopped: 'plyr--stopped',
      loading: 'plyr--loading',
      hover: 'plyr--hover',
      tooltip: 'plyr__tooltip',
      cues: 'plyr__cues',
      hidden: 'plyr__sr-only',
      hideControls: 'plyr--hide-controls',
      isIos: 'plyr--is-ios',
      isTouch: 'plyr--is-touch',
      uiSupported: 'plyr--full-ui',
      noTransition: 'plyr--no-transition',
      display: {
        time: 'plyr__time'
      },
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
      tabFocus: 'plyr__tab-focus',
      previewThumbnails: {
        // Tooltip thumbs
        thumbContainer: 'plyr__preview-thumb',
        thumbContainerShown: 'plyr__preview-thumb--is-shown',
        imageContainer: 'plyr__preview-thumb__image-container',
        timeContainer: 'plyr__preview-thumb__time-container',
        // Scrubbing
        scrubbingContainer: 'plyr__preview-scrubbing',
        scrubbingContainerShown: 'plyr__preview-scrubbing--is-shown'
      }
    },
    // Embed attributes
    attributes: {
      embed: {
        provider: 'data-plyr-provider',
        id: 'data-plyr-embed-id'
      }
    },
    // Advertisements plugin
    // Register for an account here: http://vi.ai/publisher-video-monetization/?aid=plyrio
    ads: {
      enabled: false,
      publisherId: '',
      tagUrl: ''
    },
    // Preview Thumbnails plugin
    previewThumbnails: {
      enabled: false,
      src: ''
    },
    // Vimeo plugin
    vimeo: {
      byline: false,
      portrait: false,
      title: false,
      speed: true,
      transparent: false,
      // Custom settings from Plyr
      customControls: true,
      referrerPolicy: null,
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/referrerPolicy
      // Whether the owner of the video has a Pro or Business account
      // (which allows us to properly hide controls without CSS hacks, etc)
      premium: false
    },
    // YouTube plugin
    youtube: {
      rel: 0,
      // No related vids
      showinfo: 0,
      // Hide info
      iv_load_policy: 3,
      // Hide annotations
      modestbranding: 1,
      // Hide logos as much as possible (they still show one in the corner when paused)
      // Custom settings from Plyr
      customControls: true,
      noCookie: false // Whether to use an alternative version of YouTube without cookies

    }
  };

  // ==========================================================================
  // Plyr states
  // ==========================================================================
  var pip = {
    active: 'picture-in-picture',
    inactive: 'inline'
  };

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
  /**
   * Get provider by URL
   * @param {String} url
   */

  function getProviderByUrl(url) {
    // YouTube
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(url)) {
      return providers.youtube;
    } // Vimeo


    if (/^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(url)) {
      return providers.vimeo;
    }

    return null;
  }

  // ==========================================================================
  // Console wrapper
  // ==========================================================================
  var noop = function noop() {};

  var Console = /*#__PURE__*/function () {
    function Console() {
      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      _classCallCheck(this, Console);

      this.enabled = window.console && enabled;

      if (this.enabled) {
        this.log('Debugging enabled');
      }
    }

    _createClass(Console, [{
      key: "log",
      get: function get() {
        // eslint-disable-next-line no-console
        return this.enabled ? Function.prototype.bind.call(console.log, console) : noop;
      }
    }, {
      key: "warn",
      get: function get() {
        // eslint-disable-next-line no-console
        return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop;
      }
    }, {
      key: "error",
      get: function get() {
        // eslint-disable-next-line no-console
        return this.enabled ? Function.prototype.bind.call(console.error, console) : noop;
      }
    }]);

    return Console;
  }();

  var Fullscreen = /*#__PURE__*/function () {
    function Fullscreen(player) {
      var _this = this;

      _classCallCheck(this, Fullscreen);

      // Keep reference to parent
      this.player = player; // Get prefix

      this.prefix = Fullscreen.prefix;
      this.property = Fullscreen.property; // Scroll position

      this.scrollPosition = {
        x: 0,
        y: 0
      }; // Force the use of 'full window/browser' rather than fullscreen

      this.forceFallback = player.config.fullscreen.fallback === 'force'; // Get the fullscreen element
      // Checks container is an ancestor, defaults to null

      this.player.elements.fullscreen = player.config.fullscreen.container && closest(this.player.elements.container, player.config.fullscreen.container); // Register event listeners
      // Handle event (incase user presses escape etc)

      on.call(this.player, document, this.prefix === 'ms' ? 'MSFullscreenChange' : "".concat(this.prefix, "fullscreenchange"), function () {
        // TODO: Filter for target??
        _this.onChange();
      }); // Fullscreen toggle on double click

      on.call(this.player, this.player.elements.container, 'dblclick', function (event) {
        // Ignore double click in controls
        if (is$1.element(_this.player.elements.controls) && _this.player.elements.controls.contains(event.target)) {
          return;
        }

        _this.player.listeners.proxy(event, _this.toggle, 'fullscreen');
      }); // Tap focus when in fullscreen

      on.call(this, this.player.elements.container, 'keydown', function (event) {
        return _this.trapFocus(event);
      }); // Update the UI

      this.update();
    } // Determine if native supported


    _createClass(Fullscreen, [{
      key: "onChange",
      value: function onChange() {
        if (!this.enabled) {
          return;
        } // Update toggle button


        var button = this.player.elements.buttons.fullscreen;

        if (is$1.element(button)) {
          button.pressed = this.active;
        } // Always trigger events on the plyr / media element (not a fullscreen container) and let them bubble up


        var target = this.target === this.player.media ? this.target : this.player.elements.container; // Trigger an event

        triggerEvent.call(this.player, target, this.active ? 'enterfullscreen' : 'exitfullscreen', true);
      }
    }, {
      key: "toggleFallback",
      value: function toggleFallback() {
        var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        // Store or restore scroll position
        if (toggle) {
          this.scrollPosition = {
            x: window.scrollX || 0,
            y: window.scrollY || 0
          };
        } else {
          window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
        } // Toggle scroll


        document.body.style.overflow = toggle ? 'hidden' : ''; // Toggle class hook

        toggleClass(this.target, this.player.config.classNames.fullscreen.fallback, toggle); // Force full viewport on iPhone X+

        if (browser.isIos) {
          var viewport = document.head.querySelector('meta[name="viewport"]');
          var property = 'viewport-fit=cover'; // Inject the viewport meta if required

          if (!viewport) {
            viewport = document.createElement('meta');
            viewport.setAttribute('name', 'viewport');
          } // Check if the property already exists


          var hasProperty = is$1.string(viewport.content) && viewport.content.includes(property);

          if (toggle) {
            this.cleanupViewport = !hasProperty;

            if (!hasProperty) {
              viewport.content += ",".concat(property);
            }
          } else if (this.cleanupViewport) {
            viewport.content = viewport.content.split(',').filter(function (part) {
              return part.trim() !== property;
            }).join(',');
          }
        } // Toggle button and fire events


        this.onChange();
      } // Trap focus inside container

    }, {
      key: "trapFocus",
      value: function trapFocus(event) {
        // Bail if iOS, not active, not the tab key
        if (browser.isIos || !this.active || event.key !== 'Tab' || event.keyCode !== 9) {
          return;
        } // Get the current focused element


        var focused = document.activeElement;
        var focusable = getElements.call(this.player, 'a[href], button:not(:disabled), input:not(:disabled), [tabindex]');

        var _focusable = _slicedToArray(focusable, 1),
            first = _focusable[0];

        var last = focusable[focusable.length - 1];

        if (focused === last && !event.shiftKey) {
          // Move focus to first element that can be tabbed if Shift isn't used
          first.focus();
          event.preventDefault();
        } else if (focused === first && event.shiftKey) {
          // Move focus to last element that can be tabbed if Shift is used
          last.focus();
          event.preventDefault();
        }
      } // Update UI

    }, {
      key: "update",
      value: function update() {
        if (this.enabled) {
          var mode;

          if (this.forceFallback) {
            mode = 'Fallback (forced)';
          } else if (Fullscreen.native) {
            mode = 'Native';
          } else {
            mode = 'Fallback';
          }

          this.player.debug.log("".concat(mode, " fullscreen enabled"));
        } else {
          this.player.debug.log('Fullscreen not supported and fallback disabled');
        } // Add styling hook to show button


        toggleClass(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.enabled);
      } // Make an element fullscreen

    }, {
      key: "enter",
      value: function enter() {
        if (!this.enabled) {
          return;
        } // iOS native fullscreen doesn't need the request step


        if (browser.isIos && this.player.config.fullscreen.iosNative) {
          this.target.webkitEnterFullscreen();
        } else if (!Fullscreen.native || this.forceFallback) {
          this.toggleFallback(true);
        } else if (!this.prefix) {
          this.target.requestFullscreen({
            navigationUI: 'hide'
          });
        } else if (!is$1.empty(this.prefix)) {
          this.target["".concat(this.prefix, "Request").concat(this.property)]();
        }
      } // Bail from fullscreen

    }, {
      key: "exit",
      value: function exit() {
        if (!this.enabled) {
          return;
        } // iOS native fullscreen


        if (browser.isIos && this.player.config.fullscreen.iosNative) {
          this.target.webkitExitFullscreen();
          silencePromise(this.player.play());
        } else if (!Fullscreen.native || this.forceFallback) {
          this.toggleFallback(false);
        } else if (!this.prefix) {
          (document.cancelFullScreen || document.exitFullscreen).call(document);
        } else if (!is$1.empty(this.prefix)) {
          var action = this.prefix === 'moz' ? 'Cancel' : 'Exit';
          document["".concat(this.prefix).concat(action).concat(this.property)]();
        }
      } // Toggle state

    }, {
      key: "toggle",
      value: function toggle() {
        if (!this.active) {
          this.enter();
        } else {
          this.exit();
        }
      }
    }, {
      key: "usingNative",
      // If we're actually using native
      get: function get() {
        return Fullscreen.native && !this.forceFallback;
      } // Get the prefix for handlers

    }, {
      key: "enabled",
      // Determine if fullscreen is enabled
      get: function get() {
        return (Fullscreen.native || this.player.config.fullscreen.fallback) && this.player.config.fullscreen.enabled && this.player.supported.ui && this.player.isVideo;
      } // Get active state

    }, {
      key: "active",
      get: function get() {
        if (!this.enabled) {
          return false;
        } // Fallback using classname


        if (!Fullscreen.native || this.forceFallback) {
          return hasClass(this.target, this.player.config.classNames.fullscreen.fallback);
        }

        var element = !this.prefix ? document.fullscreenElement : document["".concat(this.prefix).concat(this.property, "Element")];
        return element && element.shadowRoot ? element === this.target.getRootNode().host : element === this.target;
      } // Get target element

    }, {
      key: "target",
      get: function get() {
        return browser.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.fullscreen || this.player.elements.container;
      }
    }], [{
      key: "native",
      get: function get() {
        return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
      }
    }, {
      key: "prefix",
      get: function get() {
        // No prefix
        if (is$1.function(document.exitFullscreen)) {
          return '';
        } // Check for fullscreen support by vendor prefix


        var value = '';
        var prefixes = ['webkit', 'moz', 'ms'];
        prefixes.some(function (pre) {
          if (is$1.function(document["".concat(pre, "ExitFullscreen")]) || is$1.function(document["".concat(pre, "CancelFullScreen")])) {
            value = pre;
            return true;
          }

          return false;
        });
        return value;
      }
    }, {
      key: "property",
      get: function get() {
        return this.prefix === 'moz' ? 'FullScreen' : 'Fullscreen';
      }
    }]);

    return Fullscreen;
  }();

  // ==========================================================================
  // Load image avoiding xhr/fetch CORS issues
  // Server status can't be obtained this way unfortunately, so this uses "naturalWidth" to determine if the image has loaded
  // By default it checks if it is at least 1px, but you can add a second argument to change this
  // ==========================================================================
  function loadImage(src) {
    var minWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return new Promise(function (resolve, reject) {
      var image = new Image();

      var handler = function handler() {
        delete image.onload;
        delete image.onerror;
        (image.naturalWidth >= minWidth ? resolve : reject)(image);
      };

      Object.assign(image, {
        onload: handler,
        onerror: handler,
        src: src
      });
    });
  }

  var ui = {
    addStyleHook: function addStyleHook() {
      toggleClass(this.elements.container, this.config.selectors.container.replace('.', ''), true);
      toggleClass(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
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
      this.listeners.media(); // Don't setup interface if no support

      if (!this.supported.ui) {
        this.debug.warn("Basic support only for ".concat(this.provider, " ").concat(this.type)); // Restore native controls

        ui.toggleNativeControls.call(this, true); // Bail

        return;
      } // Inject custom controls if not present


      if (!is$1.element(this.elements.controls)) {
        // Inject custom controls
        controls.inject.call(this); // Re-attach control listeners

        this.listeners.controls();
      } // Remove native controls


      ui.toggleNativeControls.call(this); // Setup captions for HTML5

      if (this.isHTML5) {
        captions.setup.call(this);
      } // Reset volume


      this.volume = null; // Reset mute state

      this.muted = null; // Reset loop state

      this.loop = null; // Reset quality setting

      this.quality = null; // Reset speed

      this.speed = null; // Reset volume display

      controls.updateVolume.call(this); // Reset time display

      controls.timeUpdate.call(this); // Update the UI

      ui.checkPlaying.call(this); // Check for picture-in-picture support

      toggleClass(this.elements.container, this.config.classNames.pip.supported, support.pip && this.isHTML5 && this.isVideo); // Check for airplay support

      toggleClass(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5); // Add iOS class

      toggleClass(this.elements.container, this.config.classNames.isIos, browser.isIos); // Add touch class

      toggleClass(this.elements.container, this.config.classNames.isTouch, this.touch); // Ready for API calls

      this.ready = true; // Ready event at end of execution stack

      setTimeout(function () {
        triggerEvent.call(_this, _this.media, 'ready');
      }, 0); // Set the title

      ui.setTitle.call(this); // Assure the poster image is set, if the property was added before the element was created

      if (this.poster) {
        ui.setPoster.call(this, this.poster, false).catch(function () {});
      } // Manually set the duration if user has overridden it.
      // The event listeners for it doesn't get called if preload is disabled (#701)


      if (this.config.duration) {
        controls.durationUpdate.call(this);
      }
    },
    // Setup aria attribute for play and iframe title
    setTitle: function setTitle() {
      // Find the current text
      var label = i18n.get('play', this.config); // If there's a media title set, use that for the label

      if (is$1.string(this.config.title) && !is$1.empty(this.config.title)) {
        label += ", ".concat(this.config.title);
      } // If there's a play button, set label


      Array.from(this.elements.buttons.play || []).forEach(function (button) {
        button.setAttribute('aria-label', label);
      }); // Set iframe title
      // https://github.com/sampotts/plyr/issues/124

      if (this.isEmbed) {
        var iframe = getElement.call(this, 'iframe');

        if (!is$1.element(iframe)) {
          return;
        } // Default to media type


        var title = !is$1.empty(this.config.title) ? this.config.title : 'video';
        var format = i18n.get('frameTitle', this.config);
        iframe.setAttribute('title', format.replace('{title}', title));
      }
    },
    // Toggle poster
    togglePoster: function togglePoster(enable) {
      toggleClass(this.elements.container, this.config.classNames.posterEnabled, enable);
    },
    // Set the poster image (async)
    // Used internally for the poster setter, with the passive option forced to false
    setPoster: function setPoster(poster) {
      var _this2 = this;

      var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // Don't override if call is passive
      if (passive && this.poster) {
        return Promise.reject(new Error('Poster already set'));
      } // Set property synchronously to respect the call order


      this.media.setAttribute('data-poster', poster); // Show the poster

      this.elements.poster.removeAttribute('hidden'); // Wait until ui is ready

      return ready.call(this) // Load image
      .then(function () {
        return loadImage(poster);
      }).catch(function (err) {
        // Hide poster on error unless it's been set by another call
        if (poster === _this2.poster) {
          ui.togglePoster.call(_this2, false);
        } // Rethrow


        throw err;
      }).then(function () {
        // Prevent race conditions
        if (poster !== _this2.poster) {
          throw new Error('setPoster cancelled by later call to setPoster');
        }
      }).then(function () {
        Object.assign(_this2.elements.poster.style, {
          backgroundImage: "url('".concat(poster, "')"),
          // Reset backgroundSize as well (since it can be set to "cover" for padded thumbnails for youtube)
          backgroundSize: ''
        });
        ui.togglePoster.call(_this2, true);
        return poster;
      });
    },
    // Check playing state
    checkPlaying: function checkPlaying(event) {
      var _this3 = this;

      // Class hooks
      toggleClass(this.elements.container, this.config.classNames.playing, this.playing);
      toggleClass(this.elements.container, this.config.classNames.paused, this.paused);
      toggleClass(this.elements.container, this.config.classNames.stopped, this.stopped); // Set state

      Array.from(this.elements.buttons.play || []).forEach(function (target) {
        Object.assign(target, {
          pressed: _this3.playing
        });
        target.setAttribute('aria-label', i18n.get(_this3.playing ? 'pause' : 'play', _this3.config));
      }); // Only update controls on non timeupdate events

      if (is$1.event(event) && event.type === 'timeupdate') {
        return;
      } // Toggle controls


      ui.toggleControls.call(this);
    },
    // Check if media is loading
    checkLoading: function checkLoading(event) {
      var _this4 = this;

      this.loading = ['stalled', 'waiting'].includes(event.type); // Clear timer

      clearTimeout(this.timers.loading); // Timer to prevent flicker when seeking

      this.timers.loading = setTimeout(function () {
        // Update progress bar loading class state
        toggleClass(_this4.elements.container, _this4.config.classNames.loading, _this4.loading); // Update controls visibility

        ui.toggleControls.call(_this4);
      }, this.loading ? 250 : 0);
    },
    // Toggle controls based on state and `force` argument
    toggleControls: function toggleControls(force) {
      var controlsElement = this.elements.controls;

      if (controlsElement && this.config.hideControls) {
        // Don't hide controls if a touch-device user recently seeked. (Must be limited to touch devices, or it occasionally prevents desktop controls from hiding.)
        var recentTouchSeek = this.touch && this.lastSeekTime + 2000 > Date.now(); // Show controls if force, loading, paused, button interaction, or recent seek, otherwise hide

        this.toggleControls(Boolean(force || this.loading || this.paused || controlsElement.pressed || controlsElement.hover || recentTouchSeek));
      }
    },
    // Migrate any custom properties from the media to the parent
    migrateStyles: function migrateStyles() {
      var _this5 = this;

      // Loop through values (as they are the keys when the object is spread 🤔)
      Object.values(_objectSpread2({}, this.media.style)) // We're only fussed about Plyr specific properties
      .filter(function (key) {
        return !is$1.empty(key) && is$1.string(key) && key.startsWith('--plyr');
      }).forEach(function (key) {
        // Set on the container
        _this5.elements.container.style.setProperty(key, _this5.media.style.getPropertyValue(key)); // Clean up from media element


        _this5.media.style.removeProperty(key);
      }); // Remove attribute if empty

      if (is$1.empty(this.media.style)) {
        this.media.removeAttribute('style');
      }
    }
  };

  var Listeners = /*#__PURE__*/function () {
    function Listeners(player) {
      _classCallCheck(this, Listeners);

      this.player = player;
      this.lastKey = null;
      this.focusTimer = null;
      this.lastKeyDown = null;
      this.handleKey = this.handleKey.bind(this);
      this.toggleMenu = this.toggleMenu.bind(this);
      this.setTabFocus = this.setTabFocus.bind(this);
      this.firstTouch = this.firstTouch.bind(this);
    } // Handle key presses


    _createClass(Listeners, [{
      key: "handleKey",
      value: function handleKey(event) {
        var player = this.player;
        var elements = player.elements;
        var code = event.keyCode ? event.keyCode : event.which;
        var pressed = event.type === 'keydown';
        var repeat = pressed && code === this.lastKey; // Bail if a modifier key is set

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
          return;
        } // If the event is bubbled from the media element
        // Firefox doesn't get the keycode for whatever reason


        if (!is$1.number(code)) {
          return;
        } // Seek by the number keys


        var seekByKey = function seekByKey() {
          // Divide the max duration into 10th's and times by the number value
          player.currentTime = player.duration / 10 * (code - 48);
        }; // Handle the key on keydown
        // Reset on keyup


        if (pressed) {
          // Check focused element
          // and if the focused element is not editable (e.g. text input)
          // and any that accept key input http://webaim.org/techniques/keyboard/
          var focused = document.activeElement;

          if (is$1.element(focused)) {
            var editable = player.config.selectors.editable;
            var seek = elements.inputs.seek;

            if (focused !== seek && matches$1(focused, editable)) {
              return;
            }

            if (event.which === 32 && matches$1(focused, 'button, [role^="menuitem"]')) {
              return;
            }
          } // Which keycodes should we prevent default


          var preventDefault = [32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 56, 57, 67, 70, 73, 75, 76, 77, 79]; // If the code is found prevent default (e.g. prevent scrolling for arrows)

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
                silencePromise(player.togglePlay());
              }

              break;

            case 38:
              // Arrow up
              player.increaseVolume(0.1);
              break;

            case 40:
              // Arrow down
              player.decreaseVolume(0.1);
              break;

            case 77:
              // M key
              if (!repeat) {
                player.muted = !player.muted;
              }

              break;

            case 39:
              // Arrow forward
              player.forward();
              break;

            case 37:
              // Arrow back
              player.rewind();
              break;

            case 70:
              // F key
              player.fullscreen.toggle();
              break;

            case 67:
              // C key
              if (!repeat) {
                player.toggleCaptions();
              }

              break;

            case 76:
              // L key
              player.loop = !player.loop;
              break;
          } // Escape is handle natively when in full screen
          // So we only need to worry about non native


          if (code === 27 && !player.fullscreen.usingNative && player.fullscreen.active) {
            player.fullscreen.toggle();
          } // Store last code for next cycle


          this.lastKey = code;
        } else {
          this.lastKey = null;
        }
      } // Toggle menu

    }, {
      key: "toggleMenu",
      value: function toggleMenu(event) {
        controls.toggleMenu.call(this.player, event);
      } // Device is touch enabled

    }, {
      key: "firstTouch",
      value: function firstTouch() {
        var player = this.player;
        var elements = player.elements;
        player.touch = true; // Add touch class

        toggleClass(elements.container, player.config.classNames.isTouch, true);
      }
    }, {
      key: "setTabFocus",
      value: function setTabFocus(event) {
        var player = this.player;
        var elements = player.elements;
        clearTimeout(this.focusTimer); // Ignore any key other than tab

        if (event.type === 'keydown' && event.which !== 9) {
          return;
        } // Store reference to event timeStamp


        if (event.type === 'keydown') {
          this.lastKeyDown = event.timeStamp;
        } // Remove current classes


        var removeCurrent = function removeCurrent() {
          var className = player.config.classNames.tabFocus;
          var current = getElements.call(player, ".".concat(className));
          toggleClass(current, className, false);
        }; // Determine if a key was pressed to trigger this event


        var wasKeyDown = event.timeStamp - this.lastKeyDown <= 20; // Ignore focus events if a key was pressed prior

        if (event.type === 'focus' && !wasKeyDown) {
          return;
        } // Remove all current


        removeCurrent(); // Delay the adding of classname until the focus has changed
        // This event fires before the focusin event

        if (event.type !== 'focusout') {
          this.focusTimer = setTimeout(function () {
            var focused = document.activeElement; // Ignore if current focus element isn't inside the player

            if (!elements.container.contains(focused)) {
              return;
            }

            toggleClass(document.activeElement, player.config.classNames.tabFocus, true);
          }, 10);
        }
      } // Global window & document listeners

    }, {
      key: "global",
      value: function global() {
        var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var player = this.player; // Keyboard shortcuts

        if (player.config.keyboard.global) {
          toggleListener.call(player, window, 'keydown keyup', this.handleKey, toggle, false);
        } // Click anywhere closes menu


        toggleListener.call(player, document.body, 'click', this.toggleMenu, toggle); // Detect touch by events

        once.call(player, document.body, 'touchstart', this.firstTouch); // Tab focus detection

        toggleListener.call(player, document.body, 'keydown focus blur focusout', this.setTabFocus, toggle, false, true);
      } // Container listeners

    }, {
      key: "container",
      value: function container() {
        var player = this.player;
        var config = player.config,
            elements = player.elements,
            timers = player.timers; // Keyboard shortcuts

        if (!config.keyboard.global && config.keyboard.focused) {
          on.call(player, elements.container, 'keydown keyup', this.handleKey, false);
        } // Toggle controls on mouse events and entering fullscreen


        on.call(player, elements.container, 'mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen', function (event) {
          var controlsElement = elements.controls; // Remove button states for fullscreen

          if (controlsElement && event.type === 'enterfullscreen') {
            controlsElement.pressed = false;
            controlsElement.hover = false;
          } // Show, then hide after a timeout unless another control event occurs


          var show = ['touchstart', 'touchmove', 'mousemove'].includes(event.type);
          var delay = 0;

          if (show) {
            ui.toggleControls.call(player, true); // Use longer timeout for touch devices

            delay = player.touch ? 3000 : 2000;
          } // Clear timer


          clearTimeout(timers.controls); // Set new timer to prevent flicker when seeking

          timers.controls = setTimeout(function () {
            return ui.toggleControls.call(player, false);
          }, delay);
        }); // Set a gutter for Vimeo

        var setGutter = function setGutter(ratio, padding, toggle) {
          if (!player.isVimeo || player.config.vimeo.premium) {
            return;
          }

          var target = player.elements.wrapper.firstChild;

          var _ratio = _slicedToArray(ratio, 2),
              y = _ratio[1];

          var _getAspectRatio$call = getAspectRatio.call(player),
              _getAspectRatio$call2 = _slicedToArray(_getAspectRatio$call, 2),
              videoX = _getAspectRatio$call2[0],
              videoY = _getAspectRatio$call2[1];

          target.style.maxWidth = toggle ? "".concat(y / videoY * videoX, "px") : null;
          target.style.margin = toggle ? '0 auto' : null;
        }; // Resize on fullscreen change


        var setPlayerSize = function setPlayerSize(measure) {
          // If we don't need to measure the viewport
          if (!measure) {
            return setAspectRatio.call(player);
          }

          var rect = elements.container.getBoundingClientRect();
          var width = rect.width,
              height = rect.height;
          return setAspectRatio.call(player, "".concat(width, ":").concat(height));
        };

        var resized = function resized() {
          clearTimeout(timers.resized);
          timers.resized = setTimeout(setPlayerSize, 50);
        };

        on.call(player, elements.container, 'enterfullscreen exitfullscreen', function (event) {
          var _player$fullscreen = player.fullscreen,
              target = _player$fullscreen.target,
              usingNative = _player$fullscreen.usingNative; // Ignore events not from target

          if (target !== elements.container) {
            return;
          } // If it's not an embed and no ratio specified


          if (!player.isEmbed && is$1.empty(player.config.ratio)) {
            return;
          }

          var isEnter = event.type === 'enterfullscreen'; // Set the player size when entering fullscreen to viewport size

          var _setPlayerSize = setPlayerSize(isEnter),
              padding = _setPlayerSize.padding,
              ratio = _setPlayerSize.ratio; // Set Vimeo gutter


          setGutter(ratio, padding, isEnter); // Horrible hack for Safari 14 not repainting properly on entering fullscreen

          if (isEnter) {
            setTimeout(function () {
              return repaint(elements.container);
            }, 100);
          } // If not using native browser fullscreen API, we need to check for resizes of viewport


          if (!usingNative) {
            if (isEnter) {
              on.call(player, window, 'resize', resized);
            } else {
              off.call(player, window, 'resize', resized);
            }
          }
        });
      } // Listen for media events

    }, {
      key: "media",
      value: function media() {
        var _this = this;

        var player = this.player;
        var elements = player.elements; // Time change on media

        on.call(player, player.media, 'timeupdate seeking seeked', function (event) {
          return controls.timeUpdate.call(player, event);
        }); // Display duration

        on.call(player, player.media, 'durationchange loadeddata loadedmetadata', function (event) {
          return controls.durationUpdate.call(player, event);
        }); // Handle the media finishing

        on.call(player, player.media, 'ended', function () {
          // Show poster on end
          if (player.isHTML5 && player.isVideo && player.config.resetOnEnd) {
            // Restart
            player.restart(); // Call pause otherwise IE11 will start playing the video again

            player.pause();
          }
        }); // Check for buffer progress

        on.call(player, player.media, 'progress playing seeking seeked', function (event) {
          return controls.updateProgress.call(player, event);
        }); // Handle volume changes

        on.call(player, player.media, 'volumechange', function (event) {
          return controls.updateVolume.call(player, event);
        }); // Handle play/pause

        on.call(player, player.media, 'playing play pause ended emptied timeupdate', function (event) {
          return ui.checkPlaying.call(player, event);
        }); // Loading state

        on.call(player, player.media, 'waiting canplay seeked playing', function (event) {
          return ui.checkLoading.call(player, event);
        }); // Click video

        if (player.supported.ui && player.config.clickToPlay && !player.isAudio) {
          // Re-fetch the wrapper
          var wrapper = getElement.call(player, ".".concat(player.config.classNames.video)); // Bail if there's no wrapper (this should never happen)

          if (!is$1.element(wrapper)) {
            return;
          } // On click play, pause or restart


          on.call(player, elements.container, 'click', function (event) {
            var targets = [elements.container, wrapper]; // Ignore if click if not container or in video wrapper

            if (!targets.includes(event.target) && !wrapper.contains(event.target)) {
              return;
            } // Touch devices will just show controls (if hidden)


            if (player.touch && player.config.hideControls) {
              return;
            }

            if (player.ended) {
              _this.proxy(event, player.restart, 'restart');

              _this.proxy(event, function () {
                silencePromise(player.play());
              }, 'play');
            } else {
              _this.proxy(event, function () {
                silencePromise(player.togglePlay());
              }, 'play');
            }
          });
        } // Disable right click


        if (player.supported.ui && player.config.disableContextMenu) {
          on.call(player, elements.wrapper, 'contextmenu', function (event) {
            event.preventDefault();
          }, false);
        } // Volume change


        on.call(player, player.media, 'volumechange', function () {
          // Save to storage
          player.storage.set({
            volume: player.volume,
            muted: player.muted
          });
        }); // Speed change

        on.call(player, player.media, 'ratechange', function () {
          // Update UI
          controls.updateSetting.call(player, 'speed'); // Save to storage


          player.storage.set({
            speed: player.speed
          });
        }); // Quality change

        on.call(player, player.media, 'qualitychange', function (event) {
          // Update UI
          controls.updateSetting.call(player, 'quality', null, event.detail.quality);
        }); // Update download link when ready and if quality changes

        on.call(player, player.media, 'ready qualitychange', function () {
          controls.setDownloadUrl.call(player);
        }); // Proxy events to container
        // Bubble up key events for Edge

        var proxyEvents = player.config.events.concat(['keyup', 'keydown']).join(' ');
        on.call(player, player.media, proxyEvents, function (event) {
          var _event$detail = event.detail,
              detail = _event$detail === void 0 ? {} : _event$detail; // Get error details from media

          if (event.type === 'error') {
            detail = player.media.error;
          }

          triggerEvent.call(player, elements.container, event.type, true, detail);
        });
      } // Run default and custom handlers

    }, {
      key: "proxy",
      value: function proxy(event, defaultHandler, customHandlerKey) {
        var player = this.player;
        var customHandler = player.config.listeners[customHandlerKey];
        var hasCustomHandler = is$1.function(customHandler);
        var returned = true; // Execute custom handler

        if (hasCustomHandler) {
          returned = customHandler.call(player, event);
        } // Only call default handler if not prevented in custom handler


        if (returned !== false && is$1.function(defaultHandler)) {
          defaultHandler.call(player, event);
        }
      } // Trigger custom and default handlers

    }, {
      key: "bind",
      value: function bind(element, type, defaultHandler, customHandlerKey) {
        var _this2 = this;

        var passive = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
        var player = this.player;
        var customHandler = player.config.listeners[customHandlerKey];
        var hasCustomHandler = is$1.function(customHandler);
        on.call(player, element, type, function (event) {
          return _this2.proxy(event, defaultHandler, customHandlerKey);
        }, passive && !hasCustomHandler);
      } // Listen for control events

    }, {
      key: "controls",
      value: function controls$1() {
        var _this3 = this;

        var player = this.player;
        var elements = player.elements; // IE doesn't support input event, so we fallback to change

        var inputEvent = browser.isIE ? 'change' : 'input'; // Play/pause toggle

        if (elements.buttons.play) {
          Array.from(elements.buttons.play).forEach(function (button) {
            _this3.bind(button, 'click', function () {
              silencePromise(player.togglePlay());
            }, 'play');
          });
        } // Pause


        this.bind(elements.buttons.restart, 'click', player.restart, 'restart'); // Rewind

        this.bind(elements.buttons.rewind, 'click', function () {
          // Record seek time so we can prevent hiding controls for a few seconds after rewind
          player.lastSeekTime = Date.now();
          player.rewind();
        }, 'rewind'); // Rewind

        this.bind(elements.buttons.fastForward, 'click', function () {
          // Record seek time so we can prevent hiding controls for a few seconds after fast forward
          player.lastSeekTime = Date.now();
          player.forward();
        }, 'fastForward'); // Mute toggle

        this.bind(elements.buttons.mute, 'click', function () {
          player.muted = !player.muted;
        }, 'mute'); // Captions toggle

        this.bind(elements.buttons.captions, 'click', function () {
          return player.toggleCaptions();
        }); // Download

        this.bind(elements.buttons.download, 'click', function () {
          triggerEvent.call(player, player.media, 'download');
        }, 'download'); // Fullscreen toggle

        this.bind(elements.buttons.fullscreen, 'click', function () {
          player.fullscreen.toggle();
        }, 'fullscreen'); // Picture-in-Picture

        this.bind(elements.buttons.pip, 'click', function () {
          player.pip = 'toggle';
        }, 'pip'); // Airplay

        this.bind(elements.buttons.airplay, 'click', player.airplay, 'airplay'); // Settings menu - click toggle

        this.bind(elements.buttons.settings, 'click', function (event) {
          // Prevent the document click listener closing the menu
          event.stopPropagation();
          event.preventDefault();

          controls.toggleMenu.call(player, event);
        }, null, false); // Can't be passive as we're preventing default
        // Settings menu - keyboard toggle
        // We have to bind to keyup otherwise Firefox triggers a click when a keydown event handler shifts focus
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1220143

        this.bind(elements.buttons.settings, 'keyup', function (event) {
          var code = event.which; // We only care about space and return

          if (![13, 32].includes(code)) {
            return;
          } // Because return triggers a click anyway, all we need to do is set focus


          if (code === 13) {
            controls.focusFirstMenuItem.call(player, null, true);

            return;
          } // Prevent scroll


          event.preventDefault(); // Prevent playing video (Firefox)

          event.stopPropagation(); // Toggle menu

          controls.toggleMenu.call(player, event);
        }, null, false // Can't be passive as we're preventing default
        ); // Escape closes menu

        this.bind(elements.settings.menu, 'keydown', function (event) {
          if (event.which === 27) {
            controls.toggleMenu.call(player, event);
          }
        }); // Set range input alternative "value", which matches the tooltip time (#954)

        this.bind(elements.inputs.seek, 'mousedown mousemove', function (event) {
          var rect = elements.progress.getBoundingClientRect();
          var percent = 100 / rect.width * (event.pageX - rect.left);
          event.currentTarget.setAttribute('seek-value', percent);
        }); // Pause while seeking

        this.bind(elements.inputs.seek, 'mousedown mouseup keydown keyup touchstart touchend', function (event) {
          var seek = event.currentTarget;
          var code = event.keyCode ? event.keyCode : event.which;
          var attribute = 'play-on-seeked';

          if (is$1.keyboardEvent(event) && code !== 39 && code !== 37) {
            return;
          } // Record seek time so we can prevent hiding controls for a few seconds after seek


          player.lastSeekTime = Date.now(); // Was playing before?

          var play = seek.hasAttribute(attribute); // Done seeking

          var done = ['mouseup', 'touchend', 'keyup'].includes(event.type); // If we're done seeking and it was playing, resume playback

          if (play && done) {
            seek.removeAttribute(attribute);
            silencePromise(player.play());
          } else if (!done && player.playing) {
            seek.setAttribute(attribute, '');
            player.pause();
          }
        }); // Fix range inputs on iOS
        // Super weird iOS bug where after you interact with an <input type="range">,
        // it takes over further interactions on the page. This is a hack

        if (browser.isIos) {
          var inputs = getElements.call(player, 'input[type="range"]');
          Array.from(inputs).forEach(function (input) {
            return _this3.bind(input, inputEvent, function (event) {
              return repaint(event.target);
            });
          });
        } // Seek


        this.bind(elements.inputs.seek, inputEvent, function (event) {
          var seek = event.currentTarget; // If it exists, use seek-value instead of "value" for consistency with tooltip time (#954)

          var seekTo = seek.getAttribute('seek-value');

          if (is$1.empty(seekTo)) {
            seekTo = seek.value;
          }

          seek.removeAttribute('seek-value');
          player.currentTime = seekTo / seek.max * player.duration;
        }, 'seek'); // Seek tooltip

        this.bind(elements.progress, 'mouseenter mouseleave mousemove', function (event) {
          return controls.updateSeekTooltip.call(player, event);
        }); // Preview thumbnails plugin
        // TODO: Really need to work on some sort of plug-in wide event bus or pub-sub for this

        this.bind(elements.progress, 'mousemove touchmove', function (event) {
          var previewThumbnails = player.previewThumbnails;

          if (previewThumbnails && previewThumbnails.loaded) {
            previewThumbnails.startMove(event);
          }
        }); // Hide thumbnail preview - on mouse click, mouse leave, and video play/seek. All four are required, e.g., for buffering

        this.bind(elements.progress, 'mouseleave touchend click', function () {
          var previewThumbnails = player.previewThumbnails;

          if (previewThumbnails && previewThumbnails.loaded) {
            previewThumbnails.endMove(false, true);
          }
        }); // Show scrubbing preview

        this.bind(elements.progress, 'mousedown touchstart', function (event) {
          var previewThumbnails = player.previewThumbnails;

          if (previewThumbnails && previewThumbnails.loaded) {
            previewThumbnails.startScrubbing(event);
          }
        });
        this.bind(elements.progress, 'mouseup touchend', function (event) {
          var previewThumbnails = player.previewThumbnails;

          if (previewThumbnails && previewThumbnails.loaded) {
            previewThumbnails.endScrubbing(event);
          }
        }); // Polyfill for lower fill in <input type="range"> for webkit

        if (browser.isWebkit) {
          Array.from(getElements.call(player, 'input[type="range"]')).forEach(function (element) {
            _this3.bind(element, 'input', function (event) {
              return controls.updateRangeFill.call(player, event.target);
            });
          });
        } // Current time invert
        // Only if one time element is used for both currentTime and duration


        if (player.config.toggleInvert && !is$1.element(elements.display.duration)) {
          this.bind(elements.display.currentTime, 'click', function () {
            // Do nothing if we're at the start
            if (player.currentTime === 0) {
              return;
            }

            player.config.invertTime = !player.config.invertTime;

            controls.timeUpdate.call(player);
          });
        } // Volume


        this.bind(elements.inputs.volume, inputEvent, function (event) {
          player.volume = event.target.value;
        }, 'volume'); // Update controls.hover state (used for ui.toggleControls to avoid hiding when interacting)

        this.bind(elements.controls, 'mouseenter mouseleave', function (event) {
          elements.controls.hover = !player.touch && event.type === 'mouseenter';
        }); // Also update controls.hover state for any non-player children of fullscreen element (as above)

        if (elements.fullscreen) {
          Array.from(elements.fullscreen.children).filter(function (c) {
            return !c.contains(elements.container);
          }).forEach(function (child) {
            _this3.bind(child, 'mouseenter mouseleave', function (event) {
              elements.controls.hover = !player.touch && event.type === 'mouseenter';
            });
          });
        } // Update controls.pressed state (used for ui.toggleControls to avoid hiding when interacting)


        this.bind(elements.controls, 'mousedown mouseup touchstart touchend touchcancel', function (event) {
          elements.controls.pressed = ['mousedown', 'touchstart'].includes(event.type);
        }); // Show controls when they receive focus (e.g., when using keyboard tab key)

        this.bind(elements.controls, 'focusin', function () {
          var config = player.config,
              timers = player.timers; // Skip transition to prevent focus from scrolling the parent element

          toggleClass(elements.controls, config.classNames.noTransition, true); // Toggle

          ui.toggleControls.call(player, true); // Restore transition

          setTimeout(function () {
            toggleClass(elements.controls, config.classNames.noTransition, false);
          }, 0); // Delay a little more for mouse users

          var delay = _this3.touch ? 3000 : 4000; // Clear timer

          clearTimeout(timers.controls); // Hide again after delay

          timers.controls = setTimeout(function () {
            return ui.toggleControls.call(player, false);
          }, delay);
        }); // Mouse wheel for volume

        this.bind(elements.inputs.volume, 'wheel', function (event) {
          // Detect "natural" scroll - suppored on OS X Safari only
          // Other browsers on OS X will be inverted until support improves
          var inverted = event.webkitDirectionInvertedFromDevice; // Get delta from event. Invert if `inverted` is true

          var _map = [event.deltaX, -event.deltaY].map(function (value) {
            return inverted ? -value : value;
          }),
              _map2 = _slicedToArray(_map, 2),
              x = _map2[0],
              y = _map2[1]; // Using the biggest delta, normalize to 1 or -1 (or 0 if no delta)


          var direction = Math.sign(Math.abs(x) > Math.abs(y) ? x : y); // Change the volume by 2%

          player.increaseVolume(direction / 50); // Don't break page scrolling at max and min

          var volume = player.media.volume;

          if (direction === 1 && volume < 1 || direction === -1 && volume > 0) {
            event.preventDefault();
          }
        }, 'volume', false);
      }
    }]);

    return Listeners;
  }();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var loadjs_umd = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
      {
        module.exports = factory();
      }
    })(commonjsGlobal, function () {
      /**
       * Global dependencies.
       * @global {Object} document - DOM
       */
      var devnull = function devnull() {},
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
            q; // define callback function

        fn = function fn(bundleId, pathsNotFound) {
          if (pathsNotFound.length) depsNotFound.push(bundleId);
          numWaiting--;
          if (!numWaiting) callbackFn(depsNotFound);
        }; // register callback


        while (i--) {
          bundleId = bundleIds[i]; // execute callback if in result cache

          r = bundleResultCache[bundleId];

          if (r) {
            fn(bundleId, r);
            continue;
          } // add to callback queue


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
        var q = bundleCallbackQueue[bundleId]; // cache result

        bundleResultCache[bundleId] = pathsNotFound; // exit if queue is empty

        if (!q) return; // empty callback queue

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
        if (args.call) args = {
          success: args
        }; // success and error callbacks

        if (depsNotFound.length) (args.error || devnull)(depsNotFound);else (args.success || devnull)(args);
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
            pathname = path.replace(/[\?|#].*$/, ''),
            pathStripped = path.replace(/^(css|img)!/, ''),
            isLegacyIECss,
            e;
        numTries = numTries || 0;

        if (/(^css!|\.css$)/.test(pathname)) {
          // css
          e = doc.createElement('link');
          e.rel = 'stylesheet';
          e.href = pathStripped; // tag IE9+

          isLegacyIECss = 'hideFocus' in e; // use preload in IE Edge (to detect load errors)

          if (isLegacyIECss && e.relList) {
            isLegacyIECss = 0;
            e.rel = 'preload';
            e.as = 'style';
          }
        } else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(pathname)) {
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
          var result = ev.type[0]; // treat empty stylesheets as failures to get around lack of onerror
          // support in IE9-11

          if (isLegacyIECss) {
            try {
              if (!e.sheet.cssText.length) result = 'e';
            } catch (x) {
              // sheets objects created from load errors don't allow access to
              // `cssText` (unless error is Code:18 SecurityError)
              if (x.code != 18) result = 'e';
            }
          } // handle retries in case of load failure


          if (result == 'e') {
            // increment counter
            numTries += 1; // exit function and try again

            if (numTries < maxTries) {
              return loadFile(path, callbackFn, args, numTries);
            }
          } else if (e.rel == 'preload' && e.as == 'style') {
            // activate preloaded stylesheets
            return e.rel = 'stylesheet'; // jshint ignore:line
          } // execute callback


          callbackFn(path, result, ev.defaultPrevented);
        }; // add to document (unless callback returns `false`)


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
            i; // define callback function

        fn = function fn(path, result, defaultPrevented) {
          // handle error
          if (result == 'e') pathsNotFound.push(path); // handle beforeload event. If defaultPrevented then that means the load
          // will be blocked (ex. Ghostery/ABP on Safari)

          if (result == 'b') {
            if (defaultPrevented) pathsNotFound.push(path);else return;
          }

          numWaiting--;
          if (!numWaiting) callbackFn(pathsNotFound);
        }; // load scripts


        for (i = 0; i < x; i++) {
          loadFile(paths[i], fn, args);
        }
      }
      /**
       * Initiate script load and register bundle.
       * @param {(string|string[])} paths - The file paths
       * @param {(string|Function|Object)} [arg1] - The (1) bundleId or (2) success
       *   callback or (3) object literal with success/error arguments, numRetries,
       *   etc.
       * @param {(Function|Object)} [arg2] - The (1) success callback or (2) object
       *   literal with success/error arguments, numRetries, etc.
       */


      function loadjs(paths, arg1, arg2) {
        var bundleId, args; // bundleId (if string)

        if (arg1 && arg1.trim) bundleId = arg1; // args (default is {})

        args = (bundleId ? arg2 : arg1) || {}; // throw error if bundle is already defined

        if (bundleId) {
          if (bundleId in bundleIdCache) {
            throw "LoadJS";
          } else {
            bundleIdCache[bundleId] = true;
          }
        }

        function loadFn(resolve, reject) {
          loadFiles(paths, function (pathsNotFound) {
            // execute callbacks
            executeCallbacks(args, pathsNotFound); // resolve Promise

            if (resolve) {
              executeCallbacks({
                success: resolve,
                error: reject
              }, pathsNotFound);
            } // publish bundle load event


            publish(bundleId, pathsNotFound);
          }, args);
        }

        if (args.returnPromise) return new Promise(loadFn);else loadFn();
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
      }; // export


      return loadjs;
    });
  });

  // ==========================================================================
  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      loadjs_umd(url, {
        success: resolve,
        error: reject
      });
    });
  }

  function parseId(url) {
    if (is$1.empty(url)) {
      return null;
    }

    if (is$1.number(Number(url))) {
      return url;
    }

    var regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
    return url.match(regex) ? RegExp.$2 : url;
  } // Set playback state and trigger change (only on actual change)


  function assurePlaybackState(play) {
    if (play && !this.embed.hasPlayed) {
      this.embed.hasPlayed = true;
    }

    if (this.media.paused === play) {
      this.media.paused = !play;
      triggerEvent.call(this, this.media, play ? 'play' : 'pause');
    }
  }

  var vimeo = {
    setup: function setup() {
      var player = this; // Add embed class for responsive

      toggleClass(player.elements.wrapper, player.config.classNames.embed, true); // Set speed options from config

      player.options.speed = player.config.speed.options; // Set intial ratio

      setAspectRatio.call(player); // Load the SDK if not already

      if (!is$1.object(window.Vimeo)) {
        loadScript(player.config.urls.vimeo.sdk).then(function () {
          vimeo.ready.call(player);
        }).catch(function (error) {
          player.debug.warn('Vimeo SDK (player.js) failed to load', error);
        });
      } else {
        vimeo.ready.call(player);
      }
    },
    // API Ready
    ready: function ready() {
      var _this = this;

      var player = this;
      var config = player.config.vimeo;

      var premium = config.premium,
          referrerPolicy = config.referrerPolicy,
          frameParams = _objectWithoutProperties(config, ["premium", "referrerPolicy"]); // If the owner has a pro or premium account then we can hide controls etc


      if (premium) {
        Object.assign(frameParams, {
          controls: false,
          sidedock: false
        });
      } // Get Vimeo params for the iframe


      var params = buildUrlParams(_objectSpread2({
        loop: player.config.loop.active,
        autoplay: player.autoplay,
        muted: player.muted,
        gesture: 'media',
        playsinline: !this.config.fullscreen.iosNative
      }, frameParams)); // Get the source URL or ID

      var source = player.media.getAttribute('src'); // Get from <div> if needed

      if (is$1.empty(source)) {
        source = player.media.getAttribute(player.config.attributes.embed.id);
      }

      var id = parseId(source); // Build an iframe

      var iframe = createElement('iframe');
      var src = format(player.config.urls.vimeo.iframe, id, params);
      iframe.setAttribute('src', src);
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'autoplay,fullscreen,picture-in-picture'); // Set the referrer policy if required

      if (!is$1.empty(referrerPolicy)) {
        iframe.setAttribute('referrerPolicy', referrerPolicy);
      } // Inject the package


      if (premium || !config.customControls) {
        iframe.setAttribute('data-poster', player.poster);
        player.media = replaceElement(iframe, player.media);
      } else {
        var wrapper = createElement('div', {
          class: player.config.classNames.embedContainer,
          'data-poster': player.poster
        });
        wrapper.appendChild(iframe);
        player.media = replaceElement(wrapper, player.media);
      } // Get poster image


      if (!config.customControls) {
        fetch(format(player.config.urls.vimeo.api, src)).then(function (response) {
          if (is$1.empty(response) || !response.thumbnail_url) {
            return;
          } // Set and show poster


          ui.setPoster.call(player, response.thumbnail_url).catch(function () {});
        });
      } // Setup instance
      // https://github.com/vimeo/player.js


      player.embed = new window.Vimeo.Player(iframe, {
        autopause: player.config.autopause,
        muted: player.muted
      });
      player.media.paused = true;
      player.media.currentTime = 0; // Disable native text track rendering

      if (player.supported.ui) {
        player.embed.disableTextTrack();
      } // Create a faux HTML5 API using the Vimeo API


      player.media.play = function () {
        assurePlaybackState.call(player, true);
        return player.embed.play();
      };

      player.media.pause = function () {
        assurePlaybackState.call(player, false);
        return player.embed.pause();
      };

      player.media.stop = function () {
        player.pause();
        player.currentTime = 0;
      }; // Seeking


      var currentTime = player.media.currentTime;
      Object.defineProperty(player.media, 'currentTime', {
        get: function get() {
          return currentTime;
        },
        set: function set(time) {
          // Vimeo will automatically play on seek if the video hasn't been played before
          // Get current paused state and volume etc
          var embed = player.embed,
              media = player.media,
              paused = player.paused,
              volume = player.volume;
          var restorePause = paused && !embed.hasPlayed; // Set seeking state and trigger event

          media.seeking = true;
          triggerEvent.call(player, media, 'seeking'); // If paused, mute until seek is complete

          Promise.resolve(restorePause && embed.setVolume(0)) // Seek
          .then(function () {
            return embed.setCurrentTime(time);
          }) // Restore paused
          .then(function () {
            return restorePause && embed.pause();
          }) // Restore volume
          .then(function () {
            return restorePause && embed.setVolume(volume);
          }).catch(function () {// Do nothing
          });
        }
      }); // Playback speed

      var speed = player.config.speed.selected;
      Object.defineProperty(player.media, 'playbackRate', {
        get: function get() {
          return speed;
        },
        set: function set(input) {
          player.embed.setPlaybackRate(input).then(function () {
            speed = input;
            triggerEvent.call(player, player.media, 'ratechange');
          }).catch(function () {
            // Cannot set Playback Rate, Video is probably not on Pro account
            player.options.speed = [1];
          });
        }
      }); // Volume

      var volume = player.config.volume;
      Object.defineProperty(player.media, 'volume', {
        get: function get() {
          return volume;
        },
        set: function set(input) {
          player.embed.setVolume(input).then(function () {
            volume = input;
            triggerEvent.call(player, player.media, 'volumechange');
          });
        }
      }); // Muted

      var muted = player.config.muted;
      Object.defineProperty(player.media, 'muted', {
        get: function get() {
          return muted;
        },
        set: function set(input) {
          var toggle = is$1.boolean(input) ? input : false;
          player.embed.setVolume(toggle ? 0 : player.config.volume).then(function () {
            muted = toggle;
            triggerEvent.call(player, player.media, 'volumechange');
          });
        }
      }); // Loop

      var loop = player.config.loop;
      Object.defineProperty(player.media, 'loop', {
        get: function get() {
          return loop;
        },
        set: function set(input) {
          var toggle = is$1.boolean(input) ? input : player.config.loop.active;
          player.embed.setLoop(toggle).then(function () {
            loop = toggle;
          });
        }
      }); // Source

      var currentSrc;
      player.embed.getVideoUrl().then(function (value) {
        currentSrc = value;
        controls.setDownloadUrl.call(player);
      }).catch(function (error) {
        _this.debug.warn(error);
      });
      Object.defineProperty(player.media, 'currentSrc', {
        get: function get() {
          return currentSrc;
        }
      }); // Ended

      Object.defineProperty(player.media, 'ended', {
        get: function get() {
          return player.currentTime === player.duration;
        }
      }); // Set aspect ratio based on video size

      Promise.all([player.embed.getVideoWidth(), player.embed.getVideoHeight()]).then(function (dimensions) {
        var _dimensions = _slicedToArray(dimensions, 2),
            width = _dimensions[0],
            height = _dimensions[1];

        player.embed.ratio = [width, height];
        setAspectRatio.call(_this);
      }); // Set autopause

      player.embed.setAutopause(player.config.autopause).then(function (state) {
        player.config.autopause = state;
      }); // Get title

      player.embed.getVideoTitle().then(function (title) {
        player.config.title = title;
        ui.setTitle.call(_this);
      }); // Get current time

      player.embed.getCurrentTime().then(function (value) {
        currentTime = value;
        triggerEvent.call(player, player.media, 'timeupdate');
      }); // Get duration

      player.embed.getDuration().then(function (value) {
        player.media.duration = value;
        triggerEvent.call(player, player.media, 'durationchange');
      }); // Get captions

      player.embed.getTextTracks().then(function (tracks) {
        player.media.textTracks = tracks;
        captions.setup.call(player);
      });
      player.embed.on('cuechange', function (_ref) {
        var _ref$cues = _ref.cues,
            cues = _ref$cues === void 0 ? [] : _ref$cues;
        var strippedCues = cues.map(function (cue) {
          return stripHTML(cue.text);
        });
        captions.updateCues.call(player, strippedCues);
      });
      player.embed.on('loaded', function () {
        // Assure state and events are updated on autoplay
        player.embed.getPaused().then(function (paused) {
          assurePlaybackState.call(player, !paused);

          if (!paused) {
            triggerEvent.call(player, player.media, 'playing');
          }
        });

        if (is$1.element(player.embed.element) && player.supported.ui) {
          var frame = player.embed.element; // Fix keyboard focus issues
          // https://github.com/sampotts/plyr/issues/317

          frame.setAttribute('tabindex', -1);
        }
      });
      player.embed.on('bufferstart', function () {
        triggerEvent.call(player, player.media, 'waiting');
      });
      player.embed.on('bufferend', function () {
        triggerEvent.call(player, player.media, 'playing');
      });
      player.embed.on('play', function () {
        assurePlaybackState.call(player, true);
        triggerEvent.call(player, player.media, 'playing');
      });
      player.embed.on('pause', function () {
        assurePlaybackState.call(player, false);
      });
      player.embed.on('timeupdate', function (data) {
        player.media.seeking = false;
        currentTime = data.seconds;
        triggerEvent.call(player, player.media, 'timeupdate');
      });
      player.embed.on('progress', function (data) {
        player.media.buffered = data.percent;
        triggerEvent.call(player, player.media, 'progress'); // Check all loaded

        if (parseInt(data.percent, 10) === 1) {
          triggerEvent.call(player, player.media, 'canplaythrough');
        } // Get duration as if we do it before load, it gives an incorrect value
        // https://github.com/sampotts/plyr/issues/891


        player.embed.getDuration().then(function (value) {
          if (value !== player.media.duration) {
            player.media.duration = value;
            triggerEvent.call(player, player.media, 'durationchange');
          }
        });
      });
      player.embed.on('seeked', function () {
        player.media.seeking = false;
        triggerEvent.call(player, player.media, 'seeked');
      });
      player.embed.on('ended', function () {
        player.media.paused = true;
        triggerEvent.call(player, player.media, 'ended');
      });
      player.embed.on('error', function (detail) {
        player.media.error = detail;
        triggerEvent.call(player, player.media, 'error');
      }); // Rebuild UI

      if (config.customControls) {
        setTimeout(function () {
          return ui.build.call(player);
        }, 0);
      }
    }
  };

  // ==========================================================================

  function parseId$1(url) {
    if (is$1.empty(url)) {
      return null;
    }

    var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    return url.match(regex) ? RegExp.$2 : url;
  } // Set playback state and trigger change (only on actual change)


  function assurePlaybackState$1(play) {
    if (play && !this.embed.hasPlayed) {
      this.embed.hasPlayed = true;
    }

    if (this.media.paused === play) {
      this.media.paused = !play;
      triggerEvent.call(this, this.media, play ? 'play' : 'pause');
    }
  }

  function getHost(config) {
    if (config.noCookie) {
      return 'https://www.youtube-nocookie.com';
    }

    if (window.location.protocol === 'http:') {
      return 'http://www.youtube.com';
    } // Use YouTube's default


    return undefined;
  }

  var youtube = {
    setup: function setup() {
      var _this = this;

      // Add embed class for responsive
      toggleClass(this.elements.wrapper, this.config.classNames.embed, true); // Setup API

      if (is$1.object(window.YT) && is$1.function(window.YT.Player)) {
        youtube.ready.call(this);
      } else {
        // Reference current global callback
        var callback = window.onYouTubeIframeAPIReady; // Set callback to process queue

        window.onYouTubeIframeAPIReady = function () {
          // Call global callback if set
          if (is$1.function(callback)) {
            callback();
          }

          youtube.ready.call(_this);
        }; // Load the SDK


        loadScript(this.config.urls.youtube.sdk).catch(function (error) {
          _this.debug.warn('YouTube API failed to load', error);
        });
      }
    },
    // Get the media title
    getTitle: function getTitle(videoId) {
      var _this2 = this;

      var url = format(this.config.urls.youtube.api, videoId);
      fetch(url).then(function (data) {
        if (is$1.object(data)) {
          var title = data.title,
              height = data.height,
              width = data.width; // Set title

          _this2.config.title = title;
          ui.setTitle.call(_this2); // Set aspect ratio

          _this2.embed.ratio = [width, height];
        }

        setAspectRatio.call(_this2);
      }).catch(function () {
        // Set aspect ratio
        setAspectRatio.call(_this2);
      });
    },
    // API ready
    ready: function ready() {
      var player = this;
      var config = player.config.youtube; // Ignore already setup (race condition)

      var currentId = player.media && player.media.getAttribute('id');

      if (!is$1.empty(currentId) && currentId.startsWith('youtube-')) {
        return;
      } // Get the source URL or ID


      var source = player.media.getAttribute('src'); // Get from <div> if needed

      if (is$1.empty(source)) {
        source = player.media.getAttribute(this.config.attributes.embed.id);
      } // Replace the <iframe> with a <div> due to YouTube API issues


      var videoId = parseId$1(source);
      var id = generateId(player.provider); // Replace media element

      var container = createElement('div', {
        id: id,
        'data-poster': config.customControls ? player.poster : undefined
      });
      player.media = replaceElement(container, player.media); // Only load the poster when using custom controls

      if (config.customControls) {
        var posterSrc = function posterSrc(s) {
          return "https://i.ytimg.com/vi/".concat(videoId, "/").concat(s, "default.jpg");
        }; // Check thumbnail images in order of quality, but reject fallback thumbnails (120px wide)


        loadImage(posterSrc('maxres'), 121) // Higest quality and unpadded
        .catch(function () {
          return loadImage(posterSrc('sd'), 121);
        }) // 480p padded 4:3
        .catch(function () {
          return loadImage(posterSrc('hq'));
        }) // 360p padded 4:3. Always exists
        .then(function (image) {
          return ui.setPoster.call(player, image.src);
        }).then(function (src) {
          // If the image is padded, use background-size "cover" instead (like youtube does too with their posters)
          if (!src.includes('maxres')) {
            player.elements.poster.style.backgroundSize = 'cover';
          }
        }).catch(function () {});
      } // Setup instance
      // https://developers.google.com/youtube/iframe_api_reference


      player.embed = new window.YT.Player(player.media, {
        videoId: videoId,
        host: getHost(config),
        playerVars: extend({}, {
          // Autoplay
          autoplay: player.config.autoplay ? 1 : 0,
          // iframe interface language
          hl: player.config.hl,
          // Only show controls if not fully supported or opted out
          controls: player.supported.ui && config.customControls ? 0 : 1,
          // Disable keyboard as we handle it
          disablekb: 1,
          // Allow iOS inline playback
          playsinline: !player.config.fullscreen.iosNative ? 1 : 0,
          // Captions are flaky on YouTube
          cc_load_policy: player.captions.active ? 1 : 0,
          cc_lang_pref: player.config.captions.language,
          // Tracking for stats
          widget_referrer: window ? window.location.href : null
        }, config),
        events: {
          onError: function onError(event) {
            // YouTube may fire onError twice, so only handle it once
            if (!player.media.error) {
              var code = event.data; // Messages copied from https://developers.google.com/youtube/iframe_api_reference#onError

              var message = {
                2: 'The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.',
                5: 'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.',
                100: 'The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.',
                101: 'The owner of the requested video does not allow it to be played in embedded players.',
                150: 'The owner of the requested video does not allow it to be played in embedded players.'
              }[code] || 'An unknown error occured';
              player.media.error = {
                code: code,
                message: message
              };
              triggerEvent.call(player, player.media, 'error');
            }
          },
          onPlaybackRateChange: function onPlaybackRateChange(event) {
            // Get the instance
            var instance = event.target; // Get current speed

            player.media.playbackRate = instance.getPlaybackRate();
            triggerEvent.call(player, player.media, 'ratechange');
          },
          onReady: function onReady(event) {
            // Bail if onReady has already been called. See issue #1108
            if (is$1.function(player.media.play)) {
              return;
            } // Get the instance


            var instance = event.target; // Get the title

            youtube.getTitle.call(player, videoId); // Create a faux HTML5 API using the YouTube API

            player.media.play = function () {
              assurePlaybackState$1.call(player, true);
              instance.playVideo();
            };

            player.media.pause = function () {
              assurePlaybackState$1.call(player, false);
              instance.pauseVideo();
            };

            player.media.stop = function () {
              instance.stopVideo();
            };

            player.media.duration = instance.getDuration();
            player.media.paused = true; // Seeking

            player.media.currentTime = 0;
            Object.defineProperty(player.media, 'currentTime', {
              get: function get() {
                return Number(instance.getCurrentTime());
              },
              set: function set(time) {
                // If paused and never played, mute audio preventively (YouTube starts playing on seek if the video hasn't been played yet).
                if (player.paused && !player.embed.hasPlayed) {
                  player.embed.mute();
                } // Set seeking state and trigger event


                player.media.seeking = true;
                triggerEvent.call(player, player.media, 'seeking'); // Seek after events sent

                instance.seekTo(time);
              }
            }); // Playback speed

            Object.defineProperty(player.media, 'playbackRate', {
              get: function get() {
                return instance.getPlaybackRate();
              },
              set: function set(input) {
                instance.setPlaybackRate(input);
              }
            }); // Volume

            var volume = player.config.volume;
            Object.defineProperty(player.media, 'volume', {
              get: function get() {
                return volume;
              },
              set: function set(input) {
                volume = input;
                instance.setVolume(volume * 100);
                triggerEvent.call(player, player.media, 'volumechange');
              }
            }); // Muted

            var muted = player.config.muted;
            Object.defineProperty(player.media, 'muted', {
              get: function get() {
                return muted;
              },
              set: function set(input) {
                var toggle = is$1.boolean(input) ? input : muted;
                muted = toggle;
                instance[toggle ? 'mute' : 'unMute']();
                instance.setVolume(volume * 100);
                triggerEvent.call(player, player.media, 'volumechange');
              }
            }); // Source

            Object.defineProperty(player.media, 'currentSrc', {
              get: function get() {
                return instance.getVideoUrl();
              }
            }); // Ended

            Object.defineProperty(player.media, 'ended', {
              get: function get() {
                return player.currentTime === player.duration;
              }
            }); // Get available speeds

            var speeds = instance.getAvailablePlaybackRates(); // Filter based on config

            player.options.speed = speeds.filter(function (s) {
              return player.config.speed.options.includes(s);
            }); // Set the tabindex to avoid focus entering iframe

            if (player.supported.ui && config.customControls) {
              player.media.setAttribute('tabindex', -1);
            }

            triggerEvent.call(player, player.media, 'timeupdate');
            triggerEvent.call(player, player.media, 'durationchange'); // Reset timer

            clearInterval(player.timers.buffering); // Setup buffering

            player.timers.buffering = setInterval(function () {
              // Get loaded % from YouTube
              player.media.buffered = instance.getVideoLoadedFraction(); // Trigger progress only when we actually buffer something

              if (player.media.lastBuffered === null || player.media.lastBuffered < player.media.buffered) {
                triggerEvent.call(player, player.media, 'progress');
              } // Set last buffer point


              player.media.lastBuffered = player.media.buffered; // Bail if we're at 100%

              if (player.media.buffered === 1) {
                clearInterval(player.timers.buffering); // Trigger event

                triggerEvent.call(player, player.media, 'canplaythrough');
              }
            }, 200); // Rebuild UI

            if (config.customControls) {
              setTimeout(function () {
                return ui.build.call(player);
              }, 50);
            }
          },
          onStateChange: function onStateChange(event) {
            // Get the instance
            var instance = event.target; // Reset timer

            clearInterval(player.timers.playing);
            var seeked = player.media.seeking && [1, 2].includes(event.data);

            if (seeked) {
              // Unset seeking and fire seeked event
              player.media.seeking = false;
              triggerEvent.call(player, player.media, 'seeked');
            } // Handle events
            // -1   Unstarted
            // 0    Ended
            // 1    Playing
            // 2    Paused
            // 3    Buffering
            // 5    Video cued


            switch (event.data) {
              case -1:
                // Update scrubber
                triggerEvent.call(player, player.media, 'timeupdate'); // Get loaded % from YouTube

                player.media.buffered = instance.getVideoLoadedFraction();
                triggerEvent.call(player, player.media, 'progress');
                break;

              case 0:
                assurePlaybackState$1.call(player, false); // YouTube doesn't support loop for a single video, so mimick it.

                if (player.media.loop) {
                  // YouTube needs a call to `stopVideo` before playing again
                  instance.stopVideo();
                  instance.playVideo();
                } else {
                  triggerEvent.call(player, player.media, 'ended');
                }

                break;

              case 1:
                // Restore paused state (YouTube starts playing on seek if the video hasn't been played yet)
                if (config.customControls && !player.config.autoplay && player.media.paused && !player.embed.hasPlayed) {
                  player.media.pause();
                } else {
                  assurePlaybackState$1.call(player, true);
                  triggerEvent.call(player, player.media, 'playing'); // Poll to get playback progress

                  player.timers.playing = setInterval(function () {
                    triggerEvent.call(player, player.media, 'timeupdate');
                  }, 50); // Check duration again due to YouTube bug
                  // https://github.com/sampotts/plyr/issues/374
                  // https://code.google.com/p/gdata-issues/issues/detail?id=8690

                  if (player.media.duration !== instance.getDuration()) {
                    player.media.duration = instance.getDuration();
                    triggerEvent.call(player, player.media, 'durationchange');
                  }
                }

                break;

              case 2:
                // Restore audio (YouTube starts playing on seek if the video hasn't been played yet)
                if (!player.muted) {
                  player.embed.unMute();
                }

                assurePlaybackState$1.call(player, false);
                break;

              case 3:
                // Trigger waiting event to add loading classes to container as the video buffers.
                triggerEvent.call(player, player.media, 'waiting');
                break;
            }

            triggerEvent.call(player, player.elements.container, 'statechange', false, {
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
      } // Add type class


      toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', this.type), true); // Add provider class

      toggleClass(this.elements.container, this.config.classNames.provider.replace('{0}', this.provider), true); // Add video class for embeds
      // This will require changes if audio embeds are added

      if (this.isEmbed) {
        toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', 'video'), true);
      } // Inject the player wrapper


      if (this.isVideo) {
        // Create the wrapper div
        this.elements.wrapper = createElement('div', {
          class: this.config.classNames.video
        }); // Wrap the video in a container

        wrap(this.media, this.elements.wrapper); // Poster image container

        this.elements.poster = createElement('div', {
          class: this.config.classNames.poster,
          hidden: ''
        });
        this.elements.wrapper.appendChild(this.elements.poster);
      }

      if (this.isHTML5) {
        html5.setup.call(this);
      } else if (this.isYouTube) {
        youtube.setup.call(this);
      } else if (this.isVimeo) {
        vimeo.setup.call(this);
      }
    }
  };

  var destroy = function destroy(instance) {
    // Destroy our adsManager
    if (instance.manager) {
      instance.manager.destroy();
    } // Destroy our adsManager


    if (instance.elements.displayContainer) {
      instance.elements.displayContainer.destroy();
    }

    instance.elements.container.remove();
  };

  var Ads = /*#__PURE__*/function () {
    /**
     * Ads constructor.
     * @param {Object} player
     * @return {Ads}
     */
    function Ads(player) {
      var _this = this;

      _classCallCheck(this, Ads);

      this.player = player;
      this.config = player.config.ads;
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
      this.countdownTimer = null; // Setup a promise to resolve when the IMA manager is ready

      this.managerPromise = new Promise(function (resolve, reject) {
        // The ad is loaded and ready
        _this.on('loaded', resolve); // Ads failed


        _this.on('error', reject);
      });
      this.load();
    }

    _createClass(Ads, [{
      key: "load",

      /**
       * Load the IMA SDK
       */
      value: function load() {
        var _this2 = this;

        if (!this.enabled) {
          return;
        } // Check if the Google IMA3 SDK is loaded or load it ourselves


        if (!is$1.object(window.google) || !is$1.object(window.google.ima)) {
          loadScript(this.player.config.urls.googleIMA.sdk).then(function () {
            _this2.ready();
          }).catch(function () {
            // Script failed to load or is blocked
            _this2.trigger('error', new Error('Google IMA SDK failed to load'));
          });
        } else {
          this.ready();
        }
      }
      /**
       * Get the ads instance ready
       */

    }, {
      key: "ready",
      value: function ready() {
        var _this3 = this;

        // Double check we're enabled
        if (!this.enabled) {
          destroy(this);
        } // Start ticking our safety timer. If the whole advertisement
        // thing doesn't resolve within our set time; we bail


        this.startSafetyTimer(12000, 'ready()'); // Clear the safety timer

        this.managerPromise.then(function () {
          _this3.clearSafetyTimer('onAdsManagerLoaded()');
        }); // Set listeners on the Plyr instance

        this.listeners(); // Setup the IMA SDK

        this.setupIMA();
      } // Build the tag URL

    }, {
      key: "setupIMA",

      /**
       * In order for the SDK to display ads for our video, we need to tell it where to put them,
       * so here we define our ad container. This div is set up to render on top of the video player.
       * Using the code below, we tell the SDK to render ads within that div. We also provide a
       * handle to the content video player - the SDK will poll the current time of our player to
       * properly place mid-rolls. After we create the ad display container, we initialize it. On
       * mobile devices, this initialization is done as the result of a user action.
       */
      value: function setupIMA() {
        var _this4 = this;

        // Create the container for our advertisements
        this.elements.container = createElement('div', {
          class: this.player.config.classNames.ads
        });
        this.player.elements.container.appendChild(this.elements.container); // So we can run VPAID2

        google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED); // Set language

        google.ima.settings.setLocale(this.player.config.ads.language); // Set playback for iOS10+

        google.ima.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playsinline); // We assume the adContainer is the video container of the plyr element that will house the ads

        this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container, this.player.media); // Create ads loader

        this.loader = new google.ima.AdsLoader(this.elements.displayContainer); // Listen and respond to ads loaded and error events

        this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (event) {
          return _this4.onAdsManagerLoaded(event);
        }, false);
        this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (error) {
          return _this4.onAdError(error);
        }, false); // Request video ads to be pre-loaded

        this.requestAds();
      }
      /**
       * Request advertisements
       */

    }, {
      key: "requestAds",
      value: function requestAds() {
        var container = this.player.elements.container;

        try {
          // Request video ads
          var request = new google.ima.AdsRequest();
          request.adTagUrl = this.tagUrl; // Specify the linear and nonlinear slot sizes. This helps the SDK
          // to select the correct creative if multiple are returned

          request.linearAdSlotWidth = container.offsetWidth;
          request.linearAdSlotHeight = container.offsetHeight;
          request.nonLinearAdSlotWidth = container.offsetWidth;
          request.nonLinearAdSlotHeight = container.offsetHeight; // We only overlay ads as we only support video.

          request.forceNonLinearFullSlot = false; // Mute based on current state

          request.setAdWillPlayMuted(!this.player.muted);
          this.loader.requestAds(request);
        } catch (e) {
          this.onAdError(e);
        }
      }
      /**
       * Update the ad countdown
       * @param {Boolean} start
       */

    }, {
      key: "pollCountdown",
      value: function pollCountdown() {
        var _this5 = this;

        var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!start) {
          clearInterval(this.countdownTimer);
          this.elements.container.removeAttribute('data-badge-text');
          return;
        }

        var update = function update() {
          var time = formatTime(Math.max(_this5.manager.getRemainingTime(), 0));
          var label = "".concat(i18n.get('advertisement', _this5.player.config), " - ").concat(time);

          _this5.elements.container.setAttribute('data-badge-text', label);
        };

        this.countdownTimer = setInterval(update, 100);
      }
      /**
       * This method is called whenever the ads are ready inside the AdDisplayContainer
       * @param {Event} adsManagerLoadedEvent
       */

    }, {
      key: "onAdsManagerLoaded",
      value: function onAdsManagerLoaded(event) {
        var _this6 = this;

        // Load could occur after a source change (race condition)
        if (!this.enabled) {
          return;
        } // Get the ads manager


        var settings = new google.ima.AdsRenderingSettings(); // Tell the SDK to save and restore content video state on our behalf

        settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        settings.enablePreloading = true; // The SDK is polling currentTime on the contentPlayback. And needs a duration
        // so it can determine when to start the mid- and post-roll

        this.manager = event.getAdsManager(this.player, settings); // Get the cue points for any mid-rolls by filtering out the pre- and post-roll

        this.cuePoints = this.manager.getCuePoints(); // Add listeners to the required events
        // Advertisement error events

        this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (error) {
          return _this6.onAdError(error);
        }); // Advertisement regular events

        Object.keys(google.ima.AdEvent.Type).forEach(function (type) {
          _this6.manager.addEventListener(google.ima.AdEvent.Type[type], function (e) {
            return _this6.onAdEvent(e);
          });
        }); // Resolve our adsManager

        this.trigger('loaded');
      }
    }, {
      key: "addCuePoints",
      value: function addCuePoints() {
        var _this7 = this;

        // Add advertisement cue's within the time line if available
        if (!is$1.empty(this.cuePoints)) {
          this.cuePoints.forEach(function (cuePoint) {
            if (cuePoint !== 0 && cuePoint !== -1 && cuePoint < _this7.player.duration) {
              var seekElement = _this7.player.elements.progress;

              if (is$1.element(seekElement)) {
                var cuePercentage = 100 / _this7.player.duration * cuePoint;
                var cue = createElement('span', {
                  class: _this7.player.config.classNames.cues
                });
                cue.style.left = "".concat(cuePercentage.toString(), "%");
                seekElement.appendChild(cue);
              }
            }
          });
        }
      }
      /**
       * This is where all the event handling takes place. Retrieve the ad from the event. Some
       * events (e.g. ALL_ADS_COMPLETED) don't have the ad object associated
       * https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdEvent.Type
       * @param {Event} event
       */

    }, {
      key: "onAdEvent",
      value: function onAdEvent(event) {
        var _this8 = this;

        var container = this.player.elements.container; // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
        // don't have ad object associated

        var ad = event.getAd();
        var adData = event.getAdData(); // Proxy event

        var dispatchEvent = function dispatchEvent(type) {
          triggerEvent.call(_this8.player, _this8.player.media, "ads".concat(type.replace(/_/g, '').toLowerCase()));
        }; // Bubble the event


        dispatchEvent(event.type);

        switch (event.type) {
          case google.ima.AdEvent.Type.LOADED:
            // This is the first event sent for an ad - it is possible to determine whether the
            // ad is a video ad or an overlay
            this.trigger('loaded'); // Start countdown

            this.pollCountdown(true);

            if (!ad.isLinear()) {
              // Position AdDisplayContainer correctly for overlay
              ad.width = container.offsetWidth;
              ad.height = container.offsetHeight;
            } // console.info('Ad type: ' + event.getAd().getAdPodInfo().getPodIndex());
            // console.info('Ad time: ' + event.getAd().getAdPodInfo().getTimeOffset());


            break;

          case google.ima.AdEvent.Type.STARTED:
            // Set volume to match player
            this.manager.setVolume(this.player.volume);
            break;

          case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
            // All ads for the current videos are done. We can now request new advertisements
            // in case the video is re-played
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
            if (this.player.ended) {
              this.loadAds();
            } else {
              // The SDK won't allow new ads to be called without receiving a contentComplete()
              this.loader.contentComplete();
            }

            break;

          case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
            // This event indicates the ad has started - the video player can adjust the UI,
            // for example display a pause button and remaining time. Fired when content should
            // be paused. This usually happens right before an ad is about to cover the content
            this.pauseContent();
            break;

          case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
            // This event indicates the ad has finished - the video player can perform
            // appropriate UI actions, such as removing the timer for remaining time detection.
            // Fired when content should be resumed. This usually happens when an ad finishes
            // or collapses
            this.pollCountdown();
            this.resumeContent();
            break;

          case google.ima.AdEvent.Type.LOG:
            if (adData.adError) {
              this.player.debug.warn("Non-fatal ad error: ".concat(adData.adError.getMessage()));
            }

            break;
        }
      }
      /**
       * Any ad error handling comes through here
       * @param {Event} event
       */

    }, {
      key: "onAdError",
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
      key: "listeners",
      value: function listeners() {
        var _this9 = this;

        var container = this.player.elements.container;
        var time;
        this.player.on('canplay', function () {
          _this9.addCuePoints();
        });
        this.player.on('ended', function () {
          _this9.loader.contentComplete();
        });
        this.player.on('timeupdate', function () {
          time = _this9.player.currentTime;
        });
        this.player.on('seeked', function () {
          var seekedTime = _this9.player.currentTime;

          if (is$1.empty(_this9.cuePoints)) {
            return;
          }

          _this9.cuePoints.forEach(function (cuePoint, index) {
            if (time < cuePoint && cuePoint < seekedTime) {
              _this9.manager.discardAdBreak();

              _this9.cuePoints.splice(index, 1);
            }
          });
        }); // Listen to the resizing of the window. And resize ad accordingly
        // TODO: eventually implement ResizeObserver

        window.addEventListener('resize', function () {
          if (_this9.manager) {
            _this9.manager.resize(container.offsetWidth, container.offsetHeight, google.ima.ViewMode.NORMAL);
          }
        });
      }
      /**
       * Initialize the adsManager and start playing advertisements
       */

    }, {
      key: "play",
      value: function play() {
        var _this10 = this;

        var container = this.player.elements.container;

        if (!this.managerPromise) {
          this.resumeContent();
        } // Play the requested advertisement whenever the adsManager is ready


        this.managerPromise.then(function () {
          // Set volume to match player
          _this10.manager.setVolume(_this10.player.volume); // Initialize the container. Must be done via a user action on mobile devices


          _this10.elements.displayContainer.initialize();

          try {
            if (!_this10.initialized) {
              // Initialize the ads manager. Ad rules playlist will start at this time
              _this10.manager.init(container.offsetWidth, container.offsetHeight, google.ima.ViewMode.NORMAL); // Call play to start showing the ad. Single video and overlay ads will
              // start at this time; the call will be ignored for ad rules


              _this10.manager.start();
            }

            _this10.initialized = true;
          } catch (adError) {
            // An error may be thrown if there was a problem with the
            // VAST response
            _this10.onAdError(adError);
          }
        }).catch(function () {});
      }
      /**
       * Resume our video
       */

    }, {
      key: "resumeContent",
      value: function resumeContent() {
        // Hide the advertisement container
        this.elements.container.style.zIndex = ''; // Ad is stopped

        this.playing = false; // Play video

        silencePromise(this.player.media.play());
      }
      /**
       * Pause our video
       */

    }, {
      key: "pauseContent",
      value: function pauseContent() {
        // Show the advertisement container
        this.elements.container.style.zIndex = 3; // Ad is playing

        this.playing = true; // Pause our video.

        this.player.media.pause();
      }
      /**
       * Destroy the adsManager so we can grab new ads after this. If we don't then we're not
       * allowed to call new ads based on google policies, as they interpret this as an accidental
       * video requests. https://developers.google.com/interactive-
       * media-ads/docs/sdks/android/faq#8
       */

    }, {
      key: "cancel",
      value: function cancel() {
        // Pause our video
        if (this.initialized) {
          this.resumeContent();
        } // Tell our instance that we're done for now


        this.trigger('error'); // Re-create our adsManager

        this.loadAds();
      }
      /**
       * Re-create our adsManager
       */

    }, {
      key: "loadAds",
      value: function loadAds() {
        var _this11 = this;

        // Tell our adsManager to go bye bye
        this.managerPromise.then(function () {
          // Destroy our adsManager
          if (_this11.manager) {
            _this11.manager.destroy();
          } // Re-set our adsManager promises


          _this11.managerPromise = new Promise(function (resolve) {
            _this11.on('loaded', resolve);

            _this11.player.debug.log(_this11.manager);
          }); // Now that the manager has been destroyed set it to also be un-initialized

          _this11.initialized = false; // Now request some new advertisements

          _this11.requestAds();
        }).catch(function () {});
      }
      /**
       * Handles callbacks after an ad event was invoked
       * @param {String} event - Event type
       */

    }, {
      key: "trigger",
      value: function trigger(event) {
        var _this12 = this;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var handlers = this.events[event];

        if (is$1.array(handlers)) {
          handlers.forEach(function (handler) {
            if (is$1.function(handler)) {
              handler.apply(_this12, args);
            }
          });
        }
      }
      /**
       * Add event listeners
       * @param {String} event - Event type
       * @param {Function} callback - Callback for when event occurs
       * @return {Ads}
       */

    }, {
      key: "on",
      value: function on(event, callback) {
        if (!is$1.array(this.events[event])) {
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
       * @param {Number} time
       * @param {String} from
       */

    }, {
      key: "startSafetyTimer",
      value: function startSafetyTimer(time, from) {
        var _this13 = this;

        this.player.debug.log("Safety timer invoked from: ".concat(from));
        this.safetyTimer = setTimeout(function () {
          _this13.cancel();

          _this13.clearSafetyTimer('startSafetyTimer()');
        }, time);
      }
      /**
       * Clear our safety timer(s)
       * @param {String} from
       */

    }, {
      key: "clearSafetyTimer",
      value: function clearSafetyTimer(from) {
        if (!is$1.nullOrUndefined(this.safetyTimer)) {
          this.player.debug.log("Safety timer cleared from: ".concat(from));
          clearTimeout(this.safetyTimer);
          this.safetyTimer = null;
        }
      }
    }, {
      key: "enabled",
      get: function get() {
        var config = this.config;
        return this.player.isHTML5 && this.player.isVideo && config.enabled && (!is$1.empty(config.publisherId) || is$1.url(config.tagUrl));
      }
    }, {
      key: "tagUrl",
      get: function get() {
        var config = this.config;

        if (is$1.url(config.tagUrl)) {
          return config.tagUrl;
        }

        var params = {
          AV_PUBLISHERID: '58c25bb0073ef448b1087ad6',
          AV_CHANNELID: '5a0458dc28a06145e4519d21',
          AV_URL: window.location.hostname,
          cb: Date.now(),
          AV_WIDTH: 640,
          AV_HEIGHT: 480,
          AV_CDIM2: config.publisherId
        };
        var base = 'https://go.aniview.com/api/adserver6/vast/';
        return "".concat(base, "?").concat(buildUrlParams(params));
      }
    }]);

    return Ads;
  }();

  var parseVtt = function parseVtt(vttDataString) {
    var processedList = [];
    var frames = vttDataString.split(/\r\n\r\n|\n\n|\r\r/);
    frames.forEach(function (frame) {
      var result = {};
      var lines = frame.split(/\r\n|\n|\r/);
      lines.forEach(function (line) {
        if (!is$1.number(result.startTime)) {
          // The line with start and end times on it is the first line of interest
          var matchTimes = line.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/); // Note that this currently ignores caption formatting directives that are optionally on the end of this line - fine for non-captions VTT

          if (matchTimes) {
            result.startTime = Number(matchTimes[1] || 0) * 60 * 60 + Number(matchTimes[2]) * 60 + Number(matchTimes[3]) + Number("0.".concat(matchTimes[4]));
            result.endTime = Number(matchTimes[6] || 0) * 60 * 60 + Number(matchTimes[7]) * 60 + Number(matchTimes[8]) + Number("0.".concat(matchTimes[9]));
          }
        } else if (!is$1.empty(line.trim()) && is$1.empty(result.text)) {
          // If we already have the startTime, then we're definitely up to the text line(s)
          var lineSplit = line.trim().split('#xywh=');

          var _lineSplit = _slicedToArray(lineSplit, 1);

          result.text = _lineSplit[0];

          // If there's content in lineSplit[1], then we have sprites. If not, then it's just one frame per image
          if (lineSplit[1]) {
            var _lineSplit$1$split = lineSplit[1].split(',');

            var _lineSplit$1$split2 = _slicedToArray(_lineSplit$1$split, 4);

            result.x = _lineSplit$1$split2[0];
            result.y = _lineSplit$1$split2[1];
            result.w = _lineSplit$1$split2[2];
            result.h = _lineSplit$1$split2[3];
          }
        }
      });

      if (result.text) {
        processedList.push(result);
      }
    });
    return processedList;
  };
  /**
   * Preview thumbnails for seek hover and scrubbing
   * Seeking: Hover over the seek bar (desktop only): shows a small preview container above the seek bar
   * Scrubbing: Click and drag the seek bar (desktop and mobile): shows the preview image over the entire video, as if the video is scrubbing at very high speed
   *
   * Notes:
   * - Thumbs are set via JS settings on Plyr init, not HTML5 'track' property. Using the track property would be a bit gross, because it doesn't support custom 'kinds'. kind=metadata might be used for something else, and we want to allow multiple thumbnails tracks. Tracks must have a unique combination of 'kind' and 'label'. We would have to do something like kind=metadata,label=thumbnails1 / kind=metadata,label=thumbnails2. Square peg, round hole
   * - VTT info: the image URL is relative to the VTT, not the current document. But if the url starts with a slash, it will naturally be relative to the current domain. https://support.jwplayer.com/articles/how-to-add-preview-thumbnails
   * - This implementation uses multiple separate img elements. Other implementations use background-image on one element. This would be nice and simple, but Firefox and Safari have flickering issues with replacing backgrounds of larger images. It seems that YouTube perhaps only avoids this because they don't have the option for high-res previews (even the fullscreen ones, when mousedown/seeking). Images appear over the top of each other, and previous ones are discarded once the new ones have been rendered
   */


  var fitRatio = function fitRatio(ratio, outer) {
    var targetRatio = outer.width / outer.height;
    var result = {};

    if (ratio > targetRatio) {
      result.width = outer.width;
      result.height = 1 / ratio * outer.width;
    } else {
      result.height = outer.height;
      result.width = ratio * outer.height;
    }

    return result;
  };

  var PreviewThumbnails = /*#__PURE__*/function () {
    /**
     * PreviewThumbnails constructor.
     * @param {Plyr} player
     * @return {PreviewThumbnails}
     */
    function PreviewThumbnails(player) {
      _classCallCheck(this, PreviewThumbnails);

      this.player = player;
      this.thumbnails = [];
      this.loaded = false;
      this.lastMouseMoveTime = Date.now();
      this.mouseDown = false;
      this.loadedImages = [];
      this.elements = {
        thumb: {},
        scrubbing: {}
      };
      this.load();
    }

    _createClass(PreviewThumbnails, [{
      key: "load",
      value: function load() {
        var _this = this;

        // Toggle the regular seek tooltip
        if (this.player.elements.display.seekTooltip) {
          this.player.elements.display.seekTooltip.hidden = this.enabled;
        }

        if (!this.enabled) {
          return;
        }

        this.getThumbnails().then(function () {
          if (!_this.enabled) {
            return;
          } // Render DOM elements


          _this.render(); // Check to see if thumb container size was specified manually in CSS


          _this.determineContainerAutoSizing();

          _this.loaded = true;
        });
      } // Download VTT files and parse them

    }, {
      key: "getThumbnails",
      value: function getThumbnails() {
        var _this2 = this;

        return new Promise(function (resolve) {
          var src = _this2.player.config.previewThumbnails.src;

          if (is$1.empty(src)) {
            throw new Error('Missing previewThumbnails.src config attribute');
          } // Resolve promise


          var sortAndResolve = function sortAndResolve() {
            // Sort smallest to biggest (e.g., [120p, 480p, 1080p])
            _this2.thumbnails.sort(function (x, y) {
              return x.height - y.height;
            });

            _this2.player.debug.log('Preview thumbnails', _this2.thumbnails);

            resolve();
          }; // Via callback()


          if (is$1.function(src)) {
            src(function (thumbnails) {
              _this2.thumbnails = thumbnails;
              sortAndResolve();
            });
          } // VTT urls
          else {
              // If string, convert into single-element list
              var urls = is$1.string(src) ? [src] : src; // Loop through each src URL. Download and process the VTT file, storing the resulting data in this.thumbnails

              var promises = urls.map(function (u) {
                return _this2.getThumbnail(u);
              }); // Resolve

              Promise.all(promises).then(sortAndResolve);
            }
        });
      } // Process individual VTT file

    }, {
      key: "getThumbnail",
      value: function getThumbnail(url) {
        var _this3 = this;

        return new Promise(function (resolve) {
          fetch(url).then(function (response) {
            var thumbnail = {
              frames: parseVtt(response),
              height: null,
              urlPrefix: ''
            }; // If the URLs don't start with '/', then we need to set their relative path to be the location of the VTT file
            // If the URLs do start with '/', then they obviously don't need a prefix, so it will remain blank
            // If the thumbnail URLs start with with none of '/', 'http://' or 'https://', then we need to set their relative path to be the location of the VTT file

            if (!thumbnail.frames[0].text.startsWith('/') && !thumbnail.frames[0].text.startsWith('http://') && !thumbnail.frames[0].text.startsWith('https://')) {
              thumbnail.urlPrefix = url.substring(0, url.lastIndexOf('/') + 1);
            } // Download the first frame, so that we can determine/set the height of this thumbnailsDef


            var tempImage = new Image();

            tempImage.onload = function () {
              thumbnail.height = tempImage.naturalHeight;
              thumbnail.width = tempImage.naturalWidth;

              _this3.thumbnails.push(thumbnail);

              resolve();
            };

            tempImage.src = thumbnail.urlPrefix + thumbnail.frames[0].text;
          });
        });
      }
    }, {
      key: "startMove",
      value: function startMove(event) {
        if (!this.loaded) {
          return;
        }

        if (!is$1.event(event) || !['touchmove', 'mousemove'].includes(event.type)) {
          return;
        } // Wait until media has a duration


        if (!this.player.media.duration) {
          return;
        }

        if (event.type === 'touchmove') {
          // Calculate seek hover position as approx video seconds
          this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
        } else {
          // Calculate seek hover position as approx video seconds
          var clientRect = this.player.elements.progress.getBoundingClientRect();
          var percentage = 100 / clientRect.width * (event.pageX - clientRect.left);
          this.seekTime = this.player.media.duration * (percentage / 100);

          if (this.seekTime < 0) {
            // The mousemove fires for 10+px out to the left
            this.seekTime = 0;
          }

          if (this.seekTime > this.player.media.duration - 1) {
            // Took 1 second off the duration for safety, because different players can disagree on the real duration of a video
            this.seekTime = this.player.media.duration - 1;
          }

          this.mousePosX = event.pageX; // Set time text inside image container

          this.elements.thumb.time.innerText = formatTime(this.seekTime);
        } // Download and show image


        this.showImageAtCurrentTime();
      }
    }, {
      key: "endMove",
      value: function endMove() {
        this.toggleThumbContainer(false, true);
      }
    }, {
      key: "startScrubbing",
      value: function startScrubbing(event) {
        // Only act on left mouse button (0), or touch device (event.button does not exist or is false)
        if (is$1.nullOrUndefined(event.button) || event.button === false || event.button === 0) {
          this.mouseDown = true; // Wait until media has a duration

          if (this.player.media.duration) {
            this.toggleScrubbingContainer(true);
            this.toggleThumbContainer(false, true); // Download and show image

            this.showImageAtCurrentTime();
          }
        }
      }
    }, {
      key: "endScrubbing",
      value: function endScrubbing() {
        var _this4 = this;

        this.mouseDown = false; // Hide scrubbing preview. But wait until the video has successfully seeked before hiding the scrubbing preview

        if (Math.ceil(this.lastTime) === Math.ceil(this.player.media.currentTime)) {
          // The video was already seeked/loaded at the chosen time - hide immediately
          this.toggleScrubbingContainer(false);
        } else {
          // The video hasn't seeked yet. Wait for that
          once.call(this.player, this.player.media, 'timeupdate', function () {
            // Re-check mousedown - we might have already started scrubbing again
            if (!_this4.mouseDown) {
              _this4.toggleScrubbingContainer(false);
            }
          });
        }
      }
      /**
       * Setup hooks for Plyr and window events
       */

    }, {
      key: "listeners",
      value: function listeners() {
        var _this5 = this;

        // Hide thumbnail preview - on mouse click, mouse leave (in listeners.js for now), and video play/seek. All four are required, e.g., for buffering
        this.player.on('play', function () {
          _this5.toggleThumbContainer(false, true);
        });
        this.player.on('seeked', function () {
          _this5.toggleThumbContainer(false);
        });
        this.player.on('timeupdate', function () {
          _this5.lastTime = _this5.player.media.currentTime;
        });
      }
      /**
       * Create HTML elements for image containers
       */

    }, {
      key: "render",
      value: function render() {
        // Create HTML element: plyr__preview-thumbnail-container
        this.elements.thumb.container = createElement('div', {
          class: this.player.config.classNames.previewThumbnails.thumbContainer
        }); // Wrapper for the image for styling

        this.elements.thumb.imageContainer = createElement('div', {
          class: this.player.config.classNames.previewThumbnails.imageContainer
        });
        this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer); // Create HTML element, parent+span: time text (e.g., 01:32:00)

        var timeContainer = createElement('div', {
          class: this.player.config.classNames.previewThumbnails.timeContainer
        });
        this.elements.thumb.time = createElement('span', {}, '00:00');
        timeContainer.appendChild(this.elements.thumb.time);
        this.elements.thumb.container.appendChild(timeContainer); // Inject the whole thumb

        if (is$1.element(this.player.elements.progress)) {
          this.player.elements.progress.appendChild(this.elements.thumb.container);
        } // Create HTML element: plyr__preview-scrubbing-container


        this.elements.scrubbing.container = createElement('div', {
          class: this.player.config.classNames.previewThumbnails.scrubbingContainer
        });
        this.player.elements.wrapper.appendChild(this.elements.scrubbing.container);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this.elements.thumb.container) {
          this.elements.thumb.container.remove();
        }

        if (this.elements.scrubbing.container) {
          this.elements.scrubbing.container.remove();
        }
      }
    }, {
      key: "showImageAtCurrentTime",
      value: function showImageAtCurrentTime() {
        var _this6 = this;

        if (this.mouseDown) {
          this.setScrubbingContainerSize();
        } else {
          this.setThumbContainerSizeAndPos();
        } // Find the desired thumbnail index
        // TODO: Handle a video longer than the thumbs where thumbNum is null


        var thumbNum = this.thumbnails[0].frames.findIndex(function (frame) {
          return _this6.seekTime >= frame.startTime && _this6.seekTime <= frame.endTime;
        });
        var hasThumb = thumbNum >= 0;
        var qualityIndex = 0; // Show the thumb container if we're not scrubbing

        if (!this.mouseDown) {
          this.toggleThumbContainer(hasThumb);
        } // No matching thumb found


        if (!hasThumb) {
          return;
        } // Check to see if we've already downloaded higher quality versions of this image


        this.thumbnails.forEach(function (thumbnail, index) {
          if (_this6.loadedImages.includes(thumbnail.frames[thumbNum].text)) {
            qualityIndex = index;
          }
        }); // Only proceed if either thumbnum or thumbfilename has changed

        if (thumbNum !== this.showingThumb) {
          this.showingThumb = thumbNum;
          this.loadImage(qualityIndex);
        }
      } // Show the image that's currently specified in this.showingThumb

    }, {
      key: "loadImage",
      value: function loadImage() {
        var _this7 = this;

        var qualityIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var thumbNum = this.showingThumb;
        var thumbnail = this.thumbnails[qualityIndex];
        var urlPrefix = thumbnail.urlPrefix;
        var frame = thumbnail.frames[thumbNum];
        var thumbFilename = thumbnail.frames[thumbNum].text;
        var thumbUrl = urlPrefix + thumbFilename;

        if (!this.currentImageElement || this.currentImageElement.dataset.filename !== thumbFilename) {
          // If we're already loading a previous image, remove its onload handler - we don't want it to load after this one
          // Only do this if not using sprites. Without sprites we really want to show as many images as possible, as a best-effort
          if (this.loadingImage && this.usingSprites) {
            this.loadingImage.onload = null;
          } // We're building and adding a new image. In other implementations of similar functionality (YouTube), background image
          // is instead used. But this causes issues with larger images in Firefox and Safari - switching between background
          // images causes a flicker. Putting a new image over the top does not


          var previewImage = new Image();
          previewImage.src = thumbUrl;
          previewImage.dataset.index = thumbNum;
          previewImage.dataset.filename = thumbFilename;
          this.showingThumbFilename = thumbFilename;
          this.player.debug.log("Loading image: ".concat(thumbUrl)); // For some reason, passing the named function directly causes it to execute immediately. So I've wrapped it in an anonymous function...

          previewImage.onload = function () {
            return _this7.showImage(previewImage, frame, qualityIndex, thumbNum, thumbFilename, true);
          };

          this.loadingImage = previewImage;
          this.removeOldImages(previewImage);
        } else {
          // Update the existing image
          this.showImage(this.currentImageElement, frame, qualityIndex, thumbNum, thumbFilename, false);
          this.currentImageElement.dataset.index = thumbNum;
          this.removeOldImages(this.currentImageElement);
        }
      }
    }, {
      key: "showImage",
      value: function showImage(previewImage, frame, qualityIndex, thumbNum, thumbFilename) {
        var newImage = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
        this.player.debug.log("Showing thumb: ".concat(thumbFilename, ". num: ").concat(thumbNum, ". qual: ").concat(qualityIndex, ". newimg: ").concat(newImage));
        this.setImageSizeAndOffset(previewImage, frame);

        if (newImage) {
          this.currentImageContainer.appendChild(previewImage);
          this.currentImageElement = previewImage;

          if (!this.loadedImages.includes(thumbFilename)) {
            this.loadedImages.push(thumbFilename);
          }
        } // Preload images before and after the current one
        // Show higher quality of the same frame
        // Each step here has a short time delay, and only continues if still hovering/seeking the same spot. This is to protect slow connections from overloading


        this.preloadNearby(thumbNum, true).then(this.preloadNearby(thumbNum, false)).then(this.getHigherQuality(qualityIndex, previewImage, frame, thumbFilename));
      } // Remove all preview images that aren't the designated current image

    }, {
      key: "removeOldImages",
      value: function removeOldImages(currentImage) {
        var _this8 = this;

        // Get a list of all images, convert it from a DOM list to an array
        Array.from(this.currentImageContainer.children).forEach(function (image) {
          if (image.tagName.toLowerCase() !== 'img') {
            return;
          }

          var removeDelay = _this8.usingSprites ? 500 : 1000;

          if (image.dataset.index !== currentImage.dataset.index && !image.dataset.deleting) {
            // Wait 200ms, as the new image can take some time to show on certain browsers (even though it was downloaded before showing). This will prevent flicker, and show some generosity towards slower clients
            // First set attribute 'deleting' to prevent multi-handling of this on repeat firing of this function
            // eslint-disable-next-line no-param-reassign
            image.dataset.deleting = true; // This has to be set before the timeout - to prevent issues switching between hover and scrub

            var currentImageContainer = _this8.currentImageContainer;
            setTimeout(function () {
              currentImageContainer.removeChild(image);

              _this8.player.debug.log("Removing thumb: ".concat(image.dataset.filename));
            }, removeDelay);
          }
        });
      } // Preload images before and after the current one. Only if the user is still hovering/seeking the same frame
      // This will only preload the lowest quality

    }, {
      key: "preloadNearby",
      value: function preloadNearby(thumbNum) {
        var _this9 = this;

        var forward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        return new Promise(function (resolve) {
          setTimeout(function () {
            var oldThumbFilename = _this9.thumbnails[0].frames[thumbNum].text;

            if (_this9.showingThumbFilename === oldThumbFilename) {
              // Find the nearest thumbs with different filenames. Sometimes it'll be the next index, but in the case of sprites, it might be 100+ away
              var thumbnailsClone;

              if (forward) {
                thumbnailsClone = _this9.thumbnails[0].frames.slice(thumbNum);
              } else {
                thumbnailsClone = _this9.thumbnails[0].frames.slice(0, thumbNum).reverse();
              }

              var foundOne = false;
              thumbnailsClone.forEach(function (frame) {
                var newThumbFilename = frame.text;

                if (newThumbFilename !== oldThumbFilename) {
                  // Found one with a different filename. Make sure it hasn't already been loaded on this page visit
                  if (!_this9.loadedImages.includes(newThumbFilename)) {
                    foundOne = true;

                    _this9.player.debug.log("Preloading thumb filename: ".concat(newThumbFilename));

                    var urlPrefix = _this9.thumbnails[0].urlPrefix;
                    var thumbURL = urlPrefix + newThumbFilename;
                    var previewImage = new Image();
                    previewImage.src = thumbURL;

                    previewImage.onload = function () {
                      _this9.player.debug.log("Preloaded thumb filename: ".concat(newThumbFilename));

                      if (!_this9.loadedImages.includes(newThumbFilename)) _this9.loadedImages.push(newThumbFilename); // We don't resolve until the thumb is loaded

                      resolve();
                    };
                  }
                }
              }); // If there are none to preload then we want to resolve immediately

              if (!foundOne) {
                resolve();
              }
            }
          }, 300);
        });
      } // If user has been hovering current image for half a second, look for a higher quality one

    }, {
      key: "getHigherQuality",
      value: function getHigherQuality(currentQualityIndex, previewImage, frame, thumbFilename) {
        var _this10 = this;

        if (currentQualityIndex < this.thumbnails.length - 1) {
          // Only use the higher quality version if it's going to look any better - if the current thumb is of a lower pixel density than the thumbnail container
          var previewImageHeight = previewImage.naturalHeight;

          if (this.usingSprites) {
            previewImageHeight = frame.h;
          }

          if (previewImageHeight < this.thumbContainerHeight) {
            // Recurse back to the loadImage function - show a higher quality one, but only if the viewer is on this frame for a while
            setTimeout(function () {
              // Make sure the mouse hasn't already moved on and started hovering at another image
              if (_this10.showingThumbFilename === thumbFilename) {
                _this10.player.debug.log("Showing higher quality thumb for: ".concat(thumbFilename));

                _this10.loadImage(currentQualityIndex + 1);
              }
            }, 300);
          }
        }
      }
    }, {
      key: "toggleThumbContainer",
      value: function toggleThumbContainer() {
        var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var clearShowing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var className = this.player.config.classNames.previewThumbnails.thumbContainerShown;
        this.elements.thumb.container.classList.toggle(className, toggle);

        if (!toggle && clearShowing) {
          this.showingThumb = null;
          this.showingThumbFilename = null;
        }
      }
    }, {
      key: "toggleScrubbingContainer",
      value: function toggleScrubbingContainer() {
        var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var className = this.player.config.classNames.previewThumbnails.scrubbingContainerShown;
        this.elements.scrubbing.container.classList.toggle(className, toggle);

        if (!toggle) {
          this.showingThumb = null;
          this.showingThumbFilename = null;
        }
      }
    }, {
      key: "determineContainerAutoSizing",
      value: function determineContainerAutoSizing() {
        if (this.elements.thumb.imageContainer.clientHeight > 20 || this.elements.thumb.imageContainer.clientWidth > 20) {
          // This will prevent auto sizing in this.setThumbContainerSizeAndPos()
          this.sizeSpecifiedInCSS = true;
        }
      } // Set the size to be about a quarter of the size of video. Unless option dynamicSize === false, in which case it needs to be set in CSS

    }, {
      key: "setThumbContainerSizeAndPos",
      value: function setThumbContainerSizeAndPos() {
        if (!this.sizeSpecifiedInCSS) {
          var thumbWidth = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
          this.elements.thumb.imageContainer.style.height = "".concat(this.thumbContainerHeight, "px");
          this.elements.thumb.imageContainer.style.width = "".concat(thumbWidth, "px");
        } else if (this.elements.thumb.imageContainer.clientHeight > 20 && this.elements.thumb.imageContainer.clientWidth < 20) {
          var _thumbWidth = Math.floor(this.elements.thumb.imageContainer.clientHeight * this.thumbAspectRatio);

          this.elements.thumb.imageContainer.style.width = "".concat(_thumbWidth, "px");
        } else if (this.elements.thumb.imageContainer.clientHeight < 20 && this.elements.thumb.imageContainer.clientWidth > 20) {
          var thumbHeight = Math.floor(this.elements.thumb.imageContainer.clientWidth / this.thumbAspectRatio);
          this.elements.thumb.imageContainer.style.height = "".concat(thumbHeight, "px");
        }

        this.setThumbContainerPos();
      }
    }, {
      key: "setThumbContainerPos",
      value: function setThumbContainerPos() {
        var seekbarRect = this.player.elements.progress.getBoundingClientRect();
        var plyrRect = this.player.elements.container.getBoundingClientRect();
        var container = this.elements.thumb.container; // Find the lowest and highest desired left-position, so we don't slide out the side of the video container

        var minVal = plyrRect.left - seekbarRect.left + 10;
        var maxVal = plyrRect.right - seekbarRect.left - container.clientWidth - 10; // Set preview container position to: mousepos, minus seekbar.left, minus half of previewContainer.clientWidth

        var previewPos = this.mousePosX - seekbarRect.left - container.clientWidth / 2;

        if (previewPos < minVal) {
          previewPos = minVal;
        }

        if (previewPos > maxVal) {
          previewPos = maxVal;
        }

        container.style.left = "".concat(previewPos, "px");
      } // Can't use 100% width, in case the video is a different aspect ratio to the video container

    }, {
      key: "setScrubbingContainerSize",
      value: function setScrubbingContainerSize() {
        var _fitRatio = fitRatio(this.thumbAspectRatio, {
          width: this.player.media.clientWidth,
          height: this.player.media.clientHeight
        }),
            width = _fitRatio.width,
            height = _fitRatio.height;

        this.elements.scrubbing.container.style.width = "".concat(width, "px");
        this.elements.scrubbing.container.style.height = "".concat(height, "px");
      } // Sprites need to be offset to the correct location

    }, {
      key: "setImageSizeAndOffset",
      value: function setImageSizeAndOffset(previewImage, frame) {
        if (!this.usingSprites) {
          return;
        } // Find difference between height and preview container height


        var multiplier = this.thumbContainerHeight / frame.h; // eslint-disable-next-line no-param-reassign

        previewImage.style.height = "".concat(previewImage.naturalHeight * multiplier, "px"); // eslint-disable-next-line no-param-reassign

        previewImage.style.width = "".concat(previewImage.naturalWidth * multiplier, "px"); // eslint-disable-next-line no-param-reassign

        previewImage.style.left = "-".concat(frame.x * multiplier, "px"); // eslint-disable-next-line no-param-reassign

        previewImage.style.top = "-".concat(frame.y * multiplier, "px");
      }
    }, {
      key: "enabled",
      get: function get() {
        return this.player.isHTML5 && this.player.isVideo && this.player.config.previewThumbnails.enabled;
      }
    }, {
      key: "currentImageContainer",
      get: function get() {
        if (this.mouseDown) {
          return this.elements.scrubbing.container;
        }

        return this.elements.thumb.imageContainer;
      }
    }, {
      key: "usingSprites",
      get: function get() {
        return Object.keys(this.thumbnails[0].frames[0]).includes('w');
      }
    }, {
      key: "thumbAspectRatio",
      get: function get() {
        if (this.usingSprites) {
          return this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h;
        }

        return this.thumbnails[0].width / this.thumbnails[0].height;
      }
    }, {
      key: "thumbContainerHeight",
      get: function get() {
        if (this.mouseDown) {
          var _fitRatio2 = fitRatio(this.thumbAspectRatio, {
            width: this.player.media.clientWidth,
            height: this.player.media.clientHeight
          }),
              height = _fitRatio2.height;

          return height;
        } // If css is used this needs to return the css height for sprites to work (see setImageSizeAndOffset)


        if (this.sizeSpecifiedInCSS) {
          return this.elements.thumb.imageContainer.clientHeight;
        }

        return Math.floor(this.player.media.clientWidth / this.thumbAspectRatio / 4);
      }
    }, {
      key: "currentImageElement",
      get: function get() {
        if (this.mouseDown) {
          return this.currentScrubbingImageElement;
        }

        return this.currentThumbnailImageElement;
      },
      set: function set(element) {
        if (this.mouseDown) {
          this.currentScrubbingImageElement = element;
        } else {
          this.currentThumbnailImageElement = element;
        }
      }
    }]);

    return PreviewThumbnails;
  }();

  var source = {
    // Add elements to HTML5 media (source, tracks, etc)
    insertElements: function insertElements(type, attributes) {
      var _this = this;

      if (is$1.string(attributes)) {
        insertElement(type, this.media, {
          src: attributes
        });
      } else if (is$1.array(attributes)) {
        attributes.forEach(function (attribute) {
          insertElement(type, _this.media, attribute);
        });
      }
    },
    // Update source
    // Sources are not checked for support so be careful
    change: function change(input) {
      var _this2 = this;

      if (!getDeep(input, 'sources.length')) {
        this.debug.warn('Invalid source format');
        return;
      } // Cancel current network requests


      html5.cancelRequests.call(this); // Destroy instance and re-setup

      this.destroy.call(this, function () {
        // Reset quality options
        _this2.options.quality = []; // Remove elements

        removeElement(_this2.media);
        _this2.media = null; // Reset class name

        if (is$1.element(_this2.elements.container)) {
          _this2.elements.container.removeAttribute('class');
        } // Set the type and provider


        var sources = input.sources,
            type = input.type;

        var _sources = _slicedToArray(sources, 1),
            _sources$ = _sources[0],
            _sources$$provider = _sources$.provider,
            provider = _sources$$provider === void 0 ? providers.html5 : _sources$$provider,
            src = _sources$.src;

        var tagName = provider === 'html5' ? type : 'div';
        var attributes = provider === 'html5' ? {} : {
          src: src
        };
        Object.assign(_this2, {
          provider: provider,
          type: type,
          // Check for support
          supported: support.check(type, provider, _this2.config.playsinline),
          // Create new element
          media: createElement(tagName, attributes)
        }); // Inject the new element

        _this2.elements.container.appendChild(_this2.media); // Autoplay the new source?


        if (is$1.boolean(input.autoplay)) {
          _this2.config.autoplay = input.autoplay;
        } // Set attributes for audio and video


        if (_this2.isHTML5) {
          if (_this2.config.crossorigin) {
            _this2.media.setAttribute('crossorigin', '');
          }

          if (_this2.config.autoplay) {
            _this2.media.setAttribute('autoplay', '');
          }

          if (!is$1.empty(input.poster)) {
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
        } // Restore class hook


        ui.addStyleHook.call(_this2); // Set new sources for html5

        if (_this2.isHTML5) {
          source.insertElements.call(_this2, 'source', sources);
        } // Set video title


        _this2.config.title = input.title; // Set up from scratch

        media.setup.call(_this2); // HTML5 stuff

        if (_this2.isHTML5) {
          // Setup captions
          if (Object.keys(input).includes('tracks')) {
            source.insertElements.call(_this2, 'track', input.tracks);
          }
        } // If HTML5 or embed but not fully supported, setupInterface and call ready now


        if (_this2.isHTML5 || _this2.isEmbed && !_this2.supported.ui) {
          // Setup interface
          ui.build.call(_this2);
        } // Load HTML5 sources


        if (_this2.isHTML5) {
          _this2.media.load();
        } // Update previewThumbnails config & reload plugin


        if (!is$1.empty(input.previewThumbnails)) {
          Object.assign(_this2.config.previewThumbnails, input.previewThumbnails); // Cleanup previewThumbnails plugin if it was loaded

          if (_this2.previewThumbnails && _this2.previewThumbnails.loaded) {
            _this2.previewThumbnails.destroy();

            _this2.previewThumbnails = null;
          } // Create new instance if it is still enabled


          if (_this2.config.previewThumbnails.enabled) {
            _this2.previewThumbnails = new PreviewThumbnails(_this2);
          }
        } // Update the fullscreen support


        _this2.fullscreen.update();
      }, true);
    }
  };

  /**
   * Returns a number whose value is limited to the given range.
   *
   * Example: limit the output of this computation to between 0 and 255
   * (x * 255).clamp(0, 255)
   *
   * @param {Number} input
   * @param {Number} min The lower boundary of the output range
   * @param {Number} max The upper boundary of the output range
   * @returns A number in the range [min, max]
   * @type Number
   */
  function clamp() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 255;
    return Math.min(Math.max(input, min), max);
  }

  // TODO: Use a WeakMap for private globals
  // const globals = new WeakMap();
  // Plyr instance

  var Plyr = /*#__PURE__*/function () {
    function Plyr(target, options) {
      var _this = this;

      _classCallCheck(this, Plyr);

      this.timers = {}; // State

      this.ready = false;
      this.loading = false;
      this.failed = false; // Touch device

      this.touch = support.touch; // Set the media element

      this.media = target; // String selector passed

      if (is$1.string(this.media)) {
        this.media = document.querySelectorAll(this.media);
      } // jQuery, NodeList or Array passed, use first element


      if (window.jQuery && this.media instanceof jQuery || is$1.nodeList(this.media) || is$1.array(this.media)) {
        // eslint-disable-next-line
        this.media = this.media[0];
      } // Set config


      this.config = extend({}, defaults$1, Plyr.defaults, options || {}, function () {
        try {
          return JSON.parse(_this.media.getAttribute('data-plyr-config'));
        } catch (e) {
          return {};
        }
      }()); // Elements cache

      this.elements = {
        container: null,
        fullscreen: null,
        captions: null,
        buttons: {},
        display: {},
        progress: {},
        inputs: {},
        settings: {
          popup: null,
          menu: null,
          panels: {},
          buttons: {}
        }
      }; // Captions

      this.captions = {
        active: null,
        currentTrack: -1,
        meta: new WeakMap()
      }; // Fullscreen

      this.fullscreen = {
        active: false
      }; // Options

      this.options = {
        speed: [],
        quality: []
      }; // Debugging
      // TODO: move to globals

      this.debug = new Console(this.config.debug); // Log config options and support

      this.debug.log('Config', this.config);
      this.debug.log('Support', support); // We need an element to setup

      if (is$1.nullOrUndefined(this.media) || !is$1.element(this.media)) {
        this.debug.error('Setup failed: no suitable element passed');
        return;
      } // Bail if the element is initialized


      if (this.media.plyr) {
        this.debug.warn('Target already setup');
        return;
      } // Bail if not enabled


      if (!this.config.enabled) {
        this.debug.error('Setup failed: disabled by config');
        return;
      } // Bail if disabled or no basic support
      // You may want to disable certain UAs etc


      if (!support.check().api) {
        this.debug.error('Setup failed: no support');
        return;
      } // Cache original element state for .destroy()


      var clone = this.media.cloneNode(true);
      clone.autoplay = false;
      this.elements.original = clone; // Set media type based on tag or data attribute
      // Supported: video, audio, vimeo, youtube

      var type = this.media.tagName.toLowerCase(); // Embed properties

      var iframe = null;
      var url = null; // Different setup based on type

      switch (type) {
        case 'div':
          // Find the frame
          iframe = this.media.querySelector('iframe'); // <iframe> type

          if (is$1.element(iframe)) {
            // Detect provider
            url = parseUrl(iframe.getAttribute('src'));
            this.provider = getProviderByUrl(url.toString()); // Rework elements

            this.elements.container = this.media;
            this.media = iframe; // Reset classname

            this.elements.container.className = ''; // Get attributes from URL and set config

            if (url.search.length) {
              var truthy = ['1', 'true'];

              if (truthy.includes(url.searchParams.get('autoplay'))) {
                this.config.autoplay = true;
              }

              if (truthy.includes(url.searchParams.get('loop'))) {
                this.config.loop.active = true;
              } // TODO: replace fullscreen.iosNative with this playsinline config option
              // YouTube requires the playsinline in the URL


              if (this.isYouTube) {
                this.config.playsinline = truthy.includes(url.searchParams.get('playsinline'));
                this.config.youtube.hl = url.searchParams.get('hl'); // TODO: Should this be setting language?
              } else {
                this.config.playsinline = true;
              }
            }
          } else {
            // <div> with attributes
            this.provider = this.media.getAttribute(this.config.attributes.embed.provider); // Remove attribute

            this.media.removeAttribute(this.config.attributes.embed.provider);
          } // Unsupported or missing provider


          if (is$1.empty(this.provider) || !Object.keys(providers).includes(this.provider)) {
            this.debug.error('Setup failed: Invalid provider');
            return;
          } // Audio will come later for external providers


          this.type = types.video;
          break;

        case 'video':
        case 'audio':
          this.type = type;
          this.provider = providers.html5; // Get config from attributes

          if (this.media.hasAttribute('crossorigin')) {
            this.config.crossorigin = true;
          }

          if (this.media.hasAttribute('autoplay')) {
            this.config.autoplay = true;
          }

          if (this.media.hasAttribute('playsinline') || this.media.hasAttribute('webkit-playsinline')) {
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
      } // Check for support again but with type


      this.supported = support.check(this.type, this.provider, this.config.playsinline); // If no support for even API, bail

      if (!this.supported.api) {
        this.debug.error('Setup failed: no support');
        return;
      }

      this.eventListeners = []; // Create listeners

      this.listeners = new Listeners(this); // Setup local storage for user settings

      this.storage = new Storage(this); // Store reference

      this.media.plyr = this; // Wrap media

      if (!is$1.element(this.elements.container)) {
        this.elements.container = createElement('div', {
          tabindex: 0
        });
        wrap(this.media, this.elements.container);
      } // Migrate custom properties from media to container (so they work 😉)


      ui.migrateStyles.call(this); // Add style hook

      ui.addStyleHook.call(this); // Setup media

      media.setup.call(this); // Listen for events if debugging

      if (this.config.debug) {
        on.call(this, this.elements.container, this.config.events.join(' '), function (event) {
          _this.debug.log("event: ".concat(event.type));
        });
      } // Setup fullscreen


      this.fullscreen = new Fullscreen(this); // Setup interface
      // If embed but not fully supported, build interface now to avoid flash of controls

      if (this.isHTML5 || this.isEmbed && !this.supported.ui) {
        ui.build.call(this);
      } // Container listeners


      this.listeners.container(); // Global listeners

      this.listeners.global(); // Setup ads if provided

      if (this.config.ads.enabled) {
        this.ads = new Ads(this);
      } // Autoplay if required


      if (this.isHTML5 && this.config.autoplay) {
        this.once('canplay', function () {
          return silencePromise(_this.play());
        });
      } // Seek time will be recorded (in listeners.js) so we can prevent hiding controls for a few seconds after seek


      this.lastSeekTime = 0; // Setup preview thumbnails if enabled

      if (this.config.previewThumbnails.enabled) {
        this.previewThumbnails = new PreviewThumbnails(this);
      }
    } // ---------------------------------------
    // API
    // ---------------------------------------

    /**
     * Types and provider helpers
     */


    _createClass(Plyr, [{
      key: "play",

      /**
       * Play the media, or play the advertisement (if they are not blocked)
       */
      value: function play() {
        var _this2 = this;

        if (!is$1.function(this.media.play)) {
          return null;
        } // Intecept play with ads


        if (this.ads && this.ads.enabled) {
          this.ads.managerPromise.then(function () {
            return _this2.ads.play();
          }).catch(function () {
            return silencePromise(_this2.media.play());
          });
        } // Return the promise (for HTML5)


        return this.media.play();
      }
      /**
       * Pause the media
       */

    }, {
      key: "pause",
      value: function pause() {
        if (!this.playing || !is$1.function(this.media.pause)) {
          return null;
        }

        return this.media.pause();
      }
      /**
       * Get playing state
       */

    }, {
      key: "togglePlay",

      /**
       * Toggle playback based on current status
       * @param {Boolean} input
       */
      value: function togglePlay(input) {
        // Toggle based on current state if nothing passed
        var toggle = is$1.boolean(input) ? input : !this.playing;

        if (toggle) {
          return this.play();
        }

        return this.pause();
      }
      /**
       * Stop playback
       */

    }, {
      key: "stop",
      value: function stop() {
        if (this.isHTML5) {
          this.pause();
          this.restart();
        } else if (is$1.function(this.media.stop)) {
          this.media.stop();
        }
      }
      /**
       * Restart playback
       */

    }, {
      key: "restart",
      value: function restart() {
        this.currentTime = 0;
      }
      /**
       * Rewind
       * @param {Number} seekTime - how far to rewind in seconds. Defaults to the config.seekTime
       */

    }, {
      key: "rewind",
      value: function rewind(seekTime) {
        this.currentTime -= is$1.number(seekTime) ? seekTime : this.config.seekTime;
      }
      /**
       * Fast forward
       * @param {Number} seekTime - how far to fast forward in seconds. Defaults to the config.seekTime
       */

    }, {
      key: "forward",
      value: function forward(seekTime) {
        this.currentTime += is$1.number(seekTime) ? seekTime : this.config.seekTime;
      }
      /**
       * Seek to a time
       * @param {Number} input - where to seek to in seconds. Defaults to 0 (the start)
       */

    }, {
      key: "increaseVolume",

      /**
       * Increase volume
       * @param {Boolean} step - How much to decrease by (between 0 and 1)
       */
      value: function increaseVolume(step) {
        var volume = this.media.muted ? 0 : this.volume;
        this.volume = volume + (is$1.number(step) ? step : 0);
      }
      /**
       * Decrease volume
       * @param {Boolean} step - How much to decrease by (between 0 and 1)
       */

    }, {
      key: "decreaseVolume",
      value: function decreaseVolume(step) {
        this.increaseVolume(-step);
      }
      /**
       * Set muted state
       * @param {Boolean} mute
       */

    }, {
      key: "toggleCaptions",

      /**
       * Toggle captions
       * @param {Boolean} input - Whether to enable captions
       */
      value: function toggleCaptions(input) {
        captions.toggle.call(this, input, false);
      }
      /**
       * Set the caption track by index
       * @param {Number} - Caption index
       */

    }, {
      key: "airplay",

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
       * @param {Boolean} [toggle] - Whether to show the controls
       */

    }, {
      key: "toggleControls",
      value: function toggleControls(toggle) {
        // Don't toggle if missing UI support or if it's audio
        if (this.supported.ui && !this.isAudio) {
          // Get state before change
          var isHidden = hasClass(this.elements.container, this.config.classNames.hideControls); // Negate the argument if not undefined since adding the class to hides the controls

          var force = typeof toggle === 'undefined' ? undefined : !toggle; // Apply and get updated state

          var hiding = toggleClass(this.elements.container, this.config.classNames.hideControls, force); // Close menu

          if (hiding && is$1.array(this.config.controls) && this.config.controls.includes('settings') && !is$1.empty(this.config.settings)) {
            controls.toggleMenu.call(this, false);
          } // Trigger event on change


          if (hiding !== isHidden) {
            var eventName = hiding ? 'controlshidden' : 'controlsshown';
            triggerEvent.call(this, this.media, eventName);
          }

          return !hiding;
        }

        return false;
      }
      /**
       * Add event listeners
       * @param {String} event - Event type
       * @param {Function} callback - Callback for when event occurs
       */

    }, {
      key: "on",
      value: function on$1(event, callback) {
        on.call(this, this.elements.container, event, callback);
      }
      /**
       * Add event listeners once
       * @param {String} event - Event type
       * @param {Function} callback - Callback for when event occurs
       */

    }, {
      key: "once",
      value: function once$1(event, callback) {
        once.call(this, this.elements.container, event, callback);
      }
      /**
       * Remove event listeners
       * @param {String} event - Event type
       * @param {Function} callback - Callback for when event occurs
       */

    }, {
      key: "off",
      value: function off$1(event, callback) {
        off(this.elements.container, event, callback);
      }
      /**
       * Destroy an instance
       * Event listeners are removed when elements are removed
       * http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
       * @param {Function} callback - Callback for when destroy is complete
       * @param {Boolean} soft - Whether it's a soft destroy (for source changes etc)
       */

    }, {
      key: "destroy",
      value: function destroy(callback) {
        var _this3 = this;

        var soft = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!this.ready) {
          return;
        }

        var done = function done() {
          // Reset overflow (incase destroyed while in fullscreen)
          document.body.style.overflow = ''; // GC for embed

          _this3.embed = null; // If it's a soft destroy, make minimal changes

          if (soft) {
            if (Object.keys(_this3.elements).length) {
              // Remove elements
              removeElement(_this3.elements.buttons.play);
              removeElement(_this3.elements.captions);
              removeElement(_this3.elements.controls);
              removeElement(_this3.elements.wrapper); // Clear for GC

              _this3.elements.buttons.play = null;
              _this3.elements.captions = null;
              _this3.elements.controls = null;
              _this3.elements.wrapper = null;
            } // Callback


            if (is$1.function(callback)) {
              callback();
            }
          } else {
            // Unbind listeners
            unbindListeners.call(_this3); // Cancel current network requests

            html5.cancelRequests.call(_this3); // Replace the container with the original element provided

            replaceElement(_this3.elements.original, _this3.elements.container); // Event

            triggerEvent.call(_this3, _this3.elements.original, 'destroyed', true); // Callback

            if (is$1.function(callback)) {
              callback.call(_this3.elements.original);
            } // Reset state


            _this3.ready = false; // Clear for garbage collection

            setTimeout(function () {
              _this3.elements = null;
              _this3.media = null;
            }, 200);
          }
        }; // Stop playback


        this.stop(); // Clear timeouts

        clearTimeout(this.timers.loading);
        clearTimeout(this.timers.controls);
        clearTimeout(this.timers.resized); // Provider specific stuff

        if (this.isHTML5) {
          // Restore native video controls
          ui.toggleNativeControls.call(this, true); // Clean up

          done();
        } else if (this.isYouTube) {
          // Clear timers
          clearInterval(this.timers.buffering);
          clearInterval(this.timers.playing); // Destroy YouTube API

          if (this.embed !== null && is$1.function(this.embed.destroy)) {
            this.embed.destroy();
          } // Clean up


          done();
        } else if (this.isVimeo) {
          // Destroy Vimeo API
          // then clean up (wait, to prevent postmessage errors)
          if (this.embed !== null) {
            this.embed.unload().then(done);
          } // Vimeo does not always return


          setTimeout(done, 200);
        }
      }
      /**
       * Check for support for a mime type (HTML5 only)
       * @param {String} type - Mime type
       */

    }, {
      key: "supports",
      value: function supports(type) {
        return support.mime.call(this, type);
      }
      /**
       * Check for support
       * @param {String} type - Player type (audio/video)
       * @param {String} provider - Provider (html5/youtube/vimeo)
       * @param {Boolean} inline - Where player has `playsinline` sttribute
       */

    }, {
      key: "isHTML5",
      get: function get() {
        return this.provider === providers.html5;
      }
    }, {
      key: "isEmbed",
      get: function get() {
        return this.isYouTube || this.isVimeo;
      }
    }, {
      key: "isYouTube",
      get: function get() {
        return this.provider === providers.youtube;
      }
    }, {
      key: "isVimeo",
      get: function get() {
        return this.provider === providers.vimeo;
      }
    }, {
      key: "isVideo",
      get: function get() {
        return this.type === types.video;
      }
    }, {
      key: "isAudio",
      get: function get() {
        return this.type === types.audio;
      }
    }, {
      key: "playing",
      get: function get() {
        return Boolean(this.ready && !this.paused && !this.ended);
      }
      /**
       * Get paused state
       */

    }, {
      key: "paused",
      get: function get() {
        return Boolean(this.media.paused);
      }
      /**
       * Get stopped state
       */

    }, {
      key: "stopped",
      get: function get() {
        return Boolean(this.paused && this.currentTime === 0);
      }
      /**
       * Get ended state
       */

    }, {
      key: "ended",
      get: function get() {
        return Boolean(this.media.ended);
      }
    }, {
      key: "currentTime",
      set: function set(input) {
        // Bail if media duration isn't available yet
        if (!this.duration) {
          return;
        } // Validate input


        var inputIsValid = is$1.number(input) && input > 0; // Set

        this.media.currentTime = inputIsValid ? Math.min(input, this.duration) : 0; // Logging

        this.debug.log("Seeking to ".concat(this.currentTime, " seconds"));
      }
      /**
       * Get current time
       */
      ,
      get: function get() {
        return Number(this.media.currentTime);
      }
      /**
       * Get buffered
       */

    }, {
      key: "buffered",
      get: function get() {
        var buffered = this.media.buffered; // YouTube / Vimeo return a float between 0-1

        if (is$1.number(buffered)) {
          return buffered;
        } // HTML5
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
      key: "seeking",
      get: function get() {
        return Boolean(this.media.seeking);
      }
      /**
       * Get the duration of the current media
       */

    }, {
      key: "duration",
      get: function get() {
        // Faux duration set via config
        var fauxDuration = parseFloat(this.config.duration); // Media duration can be NaN or Infinity before the media has loaded

        var realDuration = (this.media || {}).duration;
        var duration = !is$1.number(realDuration) || realDuration === Infinity ? 0 : realDuration; // If config duration is funky, use regular duration

        return fauxDuration || duration;
      }
      /**
       * Set the player volume
       * @param {Number} value - must be between 0 and 1. Defaults to the value from local storage and config.volume if not set in storage
       */

    }, {
      key: "volume",
      set: function set(value) {
        var volume = value;
        var max = 1;
        var min = 0;

        if (is$1.string(volume)) {
          volume = Number(volume);
        } // Load volume from storage if no value specified


        if (!is$1.number(volume)) {
          volume = this.storage.get('volume');
        } // Use config if all else fails


        if (!is$1.number(volume)) {
          volume = this.config.volume;
        } // Maximum is volumeMax


        if (volume > max) {
          volume = max;
        } // Minimum is volumeMin


        if (volume < min) {
          volume = min;
        } // Update config


        this.config.volume = volume; // Set the player volume

        this.media.volume = volume; // If muted, and we're increasing volume manually, reset muted state

        if (!is$1.empty(value) && this.muted && volume > 0) {
          this.muted = false;
        }
      }
      /**
       * Get the current player volume
       */
      ,
      get: function get() {
        return Number(this.media.volume);
      }
    }, {
      key: "muted",
      set: function set(mute) {
        var toggle = mute; // Load muted state from storage

        if (!is$1.boolean(toggle)) {
          toggle = this.storage.get('muted');
        } // Use config if all else fails


        if (!is$1.boolean(toggle)) {
          toggle = this.config.muted;
        } // Update config


        this.config.muted = toggle; // Set mute on the player

        this.media.muted = toggle;
      }
      /**
       * Get current muted state
       */
      ,
      get: function get() {
        return Boolean(this.media.muted);
      }
      /**
       * Check if the media has audio
       */

    }, {
      key: "hasAudio",
      get: function get() {
        // Assume yes for all non HTML5 (as we can't tell...)
        if (!this.isHTML5) {
          return true;
        }

        if (this.isAudio) {
          return true;
        } // Get audio tracks


        return Boolean(this.media.mozHasAudio) || Boolean(this.media.webkitAudioDecodedByteCount) || Boolean(this.media.audioTracks && this.media.audioTracks.length);
      }
      /**
       * Set playback speed
       * @param {Number} speed - the speed of playback (0.5-2.0)
       */

    }, {
      key: "speed",
      set: function set(input) {
        var _this4 = this;

        var speed = null;

        if (is$1.number(input)) {
          speed = input;
        }

        if (!is$1.number(speed)) {
          speed = this.storage.get('speed');
        }

        if (!is$1.number(speed)) {
          speed = this.config.speed.selected;
        } // Clamp to min/max


        var min = this.minimumSpeed,
            max = this.maximumSpeed;
        speed = clamp(speed, min, max); // Update config

        this.config.speed.selected = speed; // Set media speed

        setTimeout(function () {
          _this4.media.playbackRate = speed;
        }, 0);
      }
      /**
       * Get current playback speed
       */
      ,
      get: function get() {
        return Number(this.media.playbackRate);
      }
      /**
       * Get the minimum allowed speed
       */

    }, {
      key: "minimumSpeed",
      get: function get() {
        if (this.isYouTube) {
          // https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
          return Math.min.apply(Math, _toConsumableArray(this.options.speed));
        }

        if (this.isVimeo) {
          // https://github.com/vimeo/player.js/#setplaybackrateplaybackrate-number-promisenumber-rangeerrorerror
          return 0.5;
        } // https://stackoverflow.com/a/32320020/1191319


        return 0.0625;
      }
      /**
       * Get the maximum allowed speed
       */

    }, {
      key: "maximumSpeed",
      get: function get() {
        if (this.isYouTube) {
          // https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
          return Math.max.apply(Math, _toConsumableArray(this.options.speed));
        }

        if (this.isVimeo) {
          // https://github.com/vimeo/player.js/#setplaybackrateplaybackrate-number-promisenumber-rangeerrorerror
          return 2;
        } // https://stackoverflow.com/a/32320020/1191319


        return 16;
      }
      /**
       * Set playback quality
       * Currently HTML5 & YouTube only
       * @param {Number} input - Quality level
       */

    }, {
      key: "quality",
      set: function set(input) {
        var config = this.config.quality;
        var options = this.options.quality;

        if (!options.length) {
          return;
        }

        var quality = [!is$1.empty(input) && Number(input), this.storage.get('quality'), config.selected, config.default].find(is$1.number);
        var updateStorage = true;

        if (!options.includes(quality)) {
          var value = closest$1(options, quality);
          this.debug.warn("Unsupported quality option: ".concat(quality, ", using ").concat(value, " instead"));
          quality = value; // Don't update storage if quality is not supported

          updateStorage = false;
        } // Update config


        config.selected = quality; // Set quality

        this.media.quality = quality; // Save to storage

        if (updateStorage) {
          this.storage.set({
            quality: quality
          });
        }
      }
      /**
       * Get current quality level
       */
      ,
      get: function get() {
        return this.media.quality;
      }
      /**
       * Toggle loop
       * TODO: Finish fancy new logic. Set the indicator on load as user may pass loop as config
       * @param {Boolean} input - Whether to loop or not
       */

    }, {
      key: "loop",
      set: function set(input) {
        var toggle = is$1.boolean(input) ? input : this.config.loop.active;
        this.config.loop.active = toggle;
        this.media.loop = toggle; // Set default to be a true toggle

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
      get: function get() {
        return Boolean(this.media.loop);
      }
      /**
       * Set new media source
       * @param {Object} input - The new source object (see docs)
       */

    }, {
      key: "source",
      set: function set(input) {
        source.change.call(this, input);
      }
      /**
       * Get current source
       */
      ,
      get: function get() {
        return this.media.currentSrc;
      }
      /**
       * Get a download URL (either source or custom)
       */

    }, {
      key: "download",
      get: function get() {
        var download = this.config.urls.download;
        return is$1.url(download) ? download : this.source;
      }
      /**
       * Set the download URL
       */
      ,
      set: function set(input) {
        if (!is$1.url(input)) {
          return;
        }

        this.config.urls.download = input;
        controls.setDownloadUrl.call(this);
      }
      /**
       * Set the poster image for a video
       * @param {String} input - the URL for the new poster image
       */

    }, {
      key: "poster",
      set: function set(input) {
        if (!this.isVideo) {
          this.debug.warn('Poster can only be set for video');
          return;
        }

        ui.setPoster.call(this, input, false).catch(function () {});
      }
      /**
       * Get the current poster image
       */
      ,
      get: function get() {
        if (!this.isVideo) {
          return null;
        }

        return this.media.getAttribute('poster') || this.media.getAttribute('data-poster');
      }
      /**
       * Get the current aspect ratio in use
       */

    }, {
      key: "ratio",
      get: function get() {
        if (!this.isVideo) {
          return null;
        }

        var ratio = reduceAspectRatio(getAspectRatio.call(this));
        return is$1.array(ratio) ? ratio.join(':') : ratio;
      }
      /**
       * Set video aspect ratio
       */
      ,
      set: function set(input) {
        if (!this.isVideo) {
          this.debug.warn('Aspect ratio can only be set for video');
          return;
        }

        if (!is$1.string(input) || !validateRatio(input)) {
          this.debug.error("Invalid aspect ratio specified (".concat(input, ")"));
          return;
        }

        this.config.ratio = input;
        setAspectRatio.call(this);
      }
      /**
       * Set the autoplay state
       * @param {Boolean} input - Whether to autoplay or not
       */

    }, {
      key: "autoplay",
      set: function set(input) {
        var toggle = is$1.boolean(input) ? input : this.config.autoplay;
        this.config.autoplay = toggle;
      }
      /**
       * Get the current autoplay state
       */
      ,
      get: function get() {
        return Boolean(this.config.autoplay);
      }
    }, {
      key: "currentTrack",
      set: function set(input) {
        captions.set.call(this, input, false);
      }
      /**
       * Get the current caption track index (-1 if disabled)
       */
      ,
      get: function get() {
        var _this$captions = this.captions,
            toggled = _this$captions.toggled,
            currentTrack = _this$captions.currentTrack;
        return toggled ? currentTrack : -1;
      }
      /**
       * Set the wanted language for captions
       * Since tracks can be added later it won't update the actual caption track until there is a matching track
       * @param {String} - Two character ISO language code (e.g. EN, FR, PT, etc)
       */

    }, {
      key: "language",
      set: function set(input) {
        captions.setLanguage.call(this, input, false);
      }
      /**
       * Get the current track's language
       */
      ,
      get: function get() {
        return (captions.getCurrentTrack.call(this) || {}).language;
      }
      /**
       * Toggle picture-in-picture playback on WebKit/MacOS
       * TODO: update player with state, support, enabled
       * TODO: detect outside changes
       */

    }, {
      key: "pip",
      set: function set(input) {
        // Bail if no support
        if (!support.pip) {
          return;
        } // Toggle based on current state if not passed


        var toggle = is$1.boolean(input) ? input : !this.pip; // Toggle based on current state
        // Safari

        if (is$1.function(this.media.webkitSetPresentationMode)) {
          this.media.webkitSetPresentationMode(toggle ? pip.active : pip.inactive);
        } // Chrome


        if (is$1.function(this.media.requestPictureInPicture)) {
          if (!this.pip && toggle) {
            this.media.requestPictureInPicture();
          } else if (this.pip && !toggle) {
            document.exitPictureInPicture();
          }
        }
      }
      /**
       * Get the current picture-in-picture state
       */
      ,
      get: function get() {
        if (!support.pip) {
          return null;
        } // Safari


        if (!is$1.empty(this.media.webkitPresentationMode)) {
          return this.media.webkitPresentationMode === pip.active;
        } // Chrome


        return this.media === document.pictureInPictureElement;
      }
    }], [{
      key: "supported",
      value: function supported(type, provider, inline) {
        return support.check(type, provider, inline);
      }
      /**
       * Load an SVG sprite into the page
       * @param {String} url - URL for the SVG sprite
       * @param {String} [id] - Unique ID
       */

    }, {
      key: "loadSprite",
      value: function loadSprite$1(url, id) {
        return loadSprite(url, id);
      }
      /**
       * Setup multiple instances
       * @param {*} selector
       * @param {Object} options
       */

    }, {
      key: "setup",
      value: function setup(selector) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var targets = null;

        if (is$1.string(selector)) {
          targets = Array.from(document.querySelectorAll(selector));
        } else if (is$1.nodeList(selector)) {
          targets = Array.from(selector);
        } else if (is$1.array(selector)) {
          targets = selector.filter(is$1.element);
        }

        if (is$1.empty(targets)) {
          return null;
        }

        return targets.map(function (t) {
          return new Plyr(t, options);
        });
      }
    }]);

    return Plyr;
  }();

  Plyr.defaults = cloneDeep(defaults$1);

  return Plyr;

})));
