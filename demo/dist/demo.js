typeof navigator === "object" && (function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var stringify_1 = createCommonjsModule(function (module, exports) {
	/*
	 json-stringify-safe
	 Like JSON.stringify, but doesn't throw on circular references.

	 Originally forked from https://github.com/isaacs/json-stringify-safe
	 version 5.0.1 on 3/8/2017 and modified to handle Errors serialization
	 and IE8 compatibility. Tests for this are in test/vendor.

	 ISC license: https://github.com/isaacs/json-stringify-safe/blob/master/LICENSE
	*/

	exports = module.exports = stringify;
	exports.getSerialize = serializer;

	function indexOf(haystack, needle) {
	  for (var i = 0; i < haystack.length; ++i) {
	    if (haystack[i] === needle) return i;
	  }
	  return -1;
	}

	function stringify(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
	}

	// https://github.com/ftlabs/js-abbreviate/blob/fa709e5f139e7770a71827b1893f22418097fbda/index.js#L95-L106
	function stringifyError(value) {
	  var err = {
	    // These properties are implemented as magical getters and don't show up in for in
	    stack: value.stack,
	    message: value.message,
	    name: value.name
	  };

	  for (var i in value) {
	    if (Object.prototype.hasOwnProperty.call(value, i)) {
	      err[i] = value[i];
	    }
	  }

	  return err;
	}

	function serializer(replacer, cycleReplacer) {
	  var stack = [];
	  var keys = [];

	  if (cycleReplacer == null) {
	    cycleReplacer = function(key, value) {
	      if (stack[0] === value) {
	        return '[Circular ~]';
	      }
	      return '[Circular ~.' + keys.slice(0, indexOf(stack, value)).join('.') + ']';
	    };
	  }

	  return function(key, value) {
	    if (stack.length > 0) {
	      var thisPos = indexOf(stack, this);
	      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
	      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);

	      if (~indexOf(stack, value)) {
	        value = cycleReplacer.call(this, key, value);
	      }
	    } else {
	      stack.push(value);
	    }

	    return replacer == null
	      ? value instanceof Error ? stringifyError(value) : value
	      : replacer.call(this, key, value);
	  };
	}
	});
	var stringify_2 = stringify_1.getSerialize;

	var _window =
	  typeof window !== 'undefined'
	    ? window
	    : typeof commonjsGlobal !== 'undefined'
	      ? commonjsGlobal
	      : typeof self !== 'undefined'
	        ? self
	        : {};

	function isObject(what) {
	  return typeof what === 'object' && what !== null;
	}

	// Yanked from https://git.io/vS8DV re-used under CC0
	// with some tiny modifications
	function isError(value) {
	  switch (Object.prototype.toString.call(value)) {
	    case '[object Error]':
	      return true;
	    case '[object Exception]':
	      return true;
	    case '[object DOMException]':
	      return true;
	    default:
	      return value instanceof Error;
	  }
	}

	function isErrorEvent(value) {
	  return Object.prototype.toString.call(value) === '[object ErrorEvent]';
	}

	function isDOMError(value) {
	  return Object.prototype.toString.call(value) === '[object DOMError]';
	}

	function isDOMException(value) {
	  return Object.prototype.toString.call(value) === '[object DOMException]';
	}

	function isUndefined(what) {
	  return what === void 0;
	}

	function isFunction(what) {
	  return typeof what === 'function';
	}

	function isPlainObject(what) {
	  return Object.prototype.toString.call(what) === '[object Object]';
	}

	function isString(what) {
	  return Object.prototype.toString.call(what) === '[object String]';
	}

	function isArray(what) {
	  return Object.prototype.toString.call(what) === '[object Array]';
	}

	function isEmptyObject(what) {
	  if (!isPlainObject(what)) return false;

	  for (var _ in what) {
	    if (what.hasOwnProperty(_)) {
	      return false;
	    }
	  }
	  return true;
	}

	function supportsErrorEvent() {
	  try {
	    new ErrorEvent(''); // eslint-disable-line no-new
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function supportsDOMError() {
	  try {
	    new DOMError(''); // eslint-disable-line no-new
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function supportsDOMException() {
	  try {
	    new DOMException(''); // eslint-disable-line no-new
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function supportsFetch() {
	  if (!('fetch' in _window)) return false;

	  try {
	    new Headers(); // eslint-disable-line no-new
	    new Request(''); // eslint-disable-line no-new
	    new Response(); // eslint-disable-line no-new
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	// Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default
	// https://caniuse.com/#feat=referrer-policy
	// It doesn't. And it throw exception instead of ignoring this parameter...
	// REF: https://github.com/getsentry/raven-js/issues/1233
	function supportsReferrerPolicy() {
	  if (!supportsFetch()) return false;

	  try {
	    // eslint-disable-next-line no-new
	    new Request('pickleRick', {
	      referrerPolicy: 'origin'
	    });
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function supportsPromiseRejectionEvent() {
	  return typeof PromiseRejectionEvent === 'function';
	}

	function wrappedCallback(callback) {
	  function dataCallback(data, original) {
	    var normalizedData = callback(data) || data;
	    if (original) {
	      return original(normalizedData) || normalizedData;
	    }
	    return normalizedData;
	  }

	  return dataCallback;
	}

	function each(obj, callback) {
	  var i, j;

	  if (isUndefined(obj.length)) {
	    for (i in obj) {
	      if (hasKey(obj, i)) {
	        callback.call(null, i, obj[i]);
	      }
	    }
	  } else {
	    j = obj.length;
	    if (j) {
	      for (i = 0; i < j; i++) {
	        callback.call(null, i, obj[i]);
	      }
	    }
	  }
	}

	function objectMerge(obj1, obj2) {
	  if (!obj2) {
	    return obj1;
	  }
	  each(obj2, function(key, value) {
	    obj1[key] = value;
	  });
	  return obj1;
	}

	/**
	 * This function is only used for react-native.
	 * react-native freezes object that have already been sent over the
	 * js bridge. We need this function in order to check if the object is frozen.
	 * So it's ok that objectFrozen returns false if Object.isFrozen is not
	 * supported because it's not relevant for other "platforms". See related issue:
	 * https://github.com/getsentry/react-native-sentry/issues/57
	 */
	function objectFrozen(obj) {
	  if (!Object.isFrozen) {
	    return false;
	  }
	  return Object.isFrozen(obj);
	}

	function truncate(str, max) {
	  if (typeof max !== 'number') {
	    throw new Error('2nd argument to `truncate` function should be a number');
	  }
	  if (typeof str !== 'string' || max === 0) {
	    return str;
	  }
	  return str.length <= max ? str : str.substr(0, max) + '\u2026';
	}

	/**
	 * hasKey, a better form of hasOwnProperty
	 * Example: hasKey(MainHostObject, property) === true/false
	 *
	 * @param {Object} host object to check property
	 * @param {string} key to check
	 */
	function hasKey(object, key) {
	  return Object.prototype.hasOwnProperty.call(object, key);
	}

	function joinRegExp(patterns) {
	  // Combine an array of regular expressions and strings into one large regexp
	  // Be mad.
	  var sources = [],
	    i = 0,
	    len = patterns.length,
	    pattern;

	  for (; i < len; i++) {
	    pattern = patterns[i];
	    if (isString(pattern)) {
	      // If it's a string, we need to escape it
	      // Taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
	      sources.push(pattern.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'));
	    } else if (pattern && pattern.source) {
	      // If it's a regexp already, we want to extract the source
	      sources.push(pattern.source);
	    }
	    // Intentionally skip other cases
	  }
	  return new RegExp(sources.join('|'), 'i');
	}

	function urlencode(o) {
	  var pairs = [];
	  each(o, function(key, value) {
	    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	  });
	  return pairs.join('&');
	}

	// borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
	// intentionally using regex and not <a/> href parsing trick because React Native and other
	// environments where DOM might not be available
	function parseUrl(url) {
	  if (typeof url !== 'string') return {};
	  var match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);

	  // coerce to undefined values to empty string so we don't get 'undefined'
	  var query = match[6] || '';
	  var fragment = match[8] || '';
	  return {
	    protocol: match[2],
	    host: match[4],
	    path: match[5],
	    relative: match[5] + query + fragment // everything minus origin
	  };
	}
	function uuid4() {
	  var crypto = _window.crypto || _window.msCrypto;

	  if (!isUndefined(crypto) && crypto.getRandomValues) {
	    // Use window.crypto API if available
	    // eslint-disable-next-line no-undef
	    var arr = new Uint16Array(8);
	    crypto.getRandomValues(arr);

	    // set 4 in byte 7
	    arr[3] = (arr[3] & 0xfff) | 0x4000;
	    // set 2 most significant bits of byte 9 to '10'
	    arr[4] = (arr[4] & 0x3fff) | 0x8000;

	    var pad = function(num) {
	      var v = num.toString(16);
	      while (v.length < 4) {
	        v = '0' + v;
	      }
	      return v;
	    };

	    return (
	      pad(arr[0]) +
	      pad(arr[1]) +
	      pad(arr[2]) +
	      pad(arr[3]) +
	      pad(arr[4]) +
	      pad(arr[5]) +
	      pad(arr[6]) +
	      pad(arr[7])
	    );
	  } else {
	    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
	    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	      var r = (Math.random() * 16) | 0,
	        v = c === 'x' ? r : (r & 0x3) | 0x8;
	      return v.toString(16);
	    });
	  }
	}

	/**
	 * Given a child DOM element, returns a query-selector statement describing that
	 * and its ancestors
	 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
	 * @param elem
	 * @returns {string}
	 */
	function htmlTreeAsString(elem) {
	  /* eslint no-extra-parens:0*/
	  var MAX_TRAVERSE_HEIGHT = 5,
	    MAX_OUTPUT_LEN = 80,
	    out = [],
	    height = 0,
	    len = 0,
	    separator = ' > ',
	    sepLength = separator.length,
	    nextStr;

	  while (elem && height++ < MAX_TRAVERSE_HEIGHT) {
	    nextStr = htmlElementAsString(elem);
	    // bail out if
	    // - nextStr is the 'html' element
	    // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
	    //   (ignore this limit if we are on the first iteration)
	    if (
	      nextStr === 'html' ||
	      (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)
	    ) {
	      break;
	    }

	    out.push(nextStr);

	    len += nextStr.length;
	    elem = elem.parentNode;
	  }

	  return out.reverse().join(separator);
	}

	/**
	 * Returns a simple, query-selector representation of a DOM element
	 * e.g. [HTMLElement] => input#foo.btn[name=baz]
	 * @param HTMLElement
	 * @returns {string}
	 */
	function htmlElementAsString(elem) {
	  var out = [],
	    className,
	    classes,
	    key,
	    attr,
	    i;

	  if (!elem || !elem.tagName) {
	    return '';
	  }

	  out.push(elem.tagName.toLowerCase());
	  if (elem.id) {
	    out.push('#' + elem.id);
	  }

	  className = elem.className;
	  if (className && isString(className)) {
	    classes = className.split(/\s+/);
	    for (i = 0; i < classes.length; i++) {
	      out.push('.' + classes[i]);
	    }
	  }
	  var attrWhitelist = ['type', 'name', 'title', 'alt'];
	  for (i = 0; i < attrWhitelist.length; i++) {
	    key = attrWhitelist[i];
	    attr = elem.getAttribute(key);
	    if (attr) {
	      out.push('[' + key + '="' + attr + '"]');
	    }
	  }
	  return out.join('');
	}

	/**
	 * Returns true if either a OR b is truthy, but not both
	 */
	function isOnlyOneTruthy(a, b) {
	  return !!(!!a ^ !!b);
	}

	/**
	 * Returns true if both parameters are undefined
	 */
	function isBothUndefined(a, b) {
	  return isUndefined(a) && isUndefined(b);
	}

	/**
	 * Returns true if the two input exception interfaces have the same content
	 */
	function isSameException(ex1, ex2) {
	  if (isOnlyOneTruthy(ex1, ex2)) return false;

	  ex1 = ex1.values[0];
	  ex2 = ex2.values[0];

	  if (ex1.type !== ex2.type || ex1.value !== ex2.value) return false;

	  // in case both stacktraces are undefined, we can't decide so default to false
	  if (isBothUndefined(ex1.stacktrace, ex2.stacktrace)) return false;

	  return isSameStacktrace(ex1.stacktrace, ex2.stacktrace);
	}

	/**
	 * Returns true if the two input stack trace interfaces have the same content
	 */
	function isSameStacktrace(stack1, stack2) {
	  if (isOnlyOneTruthy(stack1, stack2)) return false;

	  var frames1 = stack1.frames;
	  var frames2 = stack2.frames;

	  // Exit early if stacktrace is malformed
	  if (frames1 === undefined || frames2 === undefined) return false;

	  // Exit early if frame count differs
	  if (frames1.length !== frames2.length) return false;

	  // Iterate through every frame; bail out if anything differs
	  var a, b;
	  for (var i = 0; i < frames1.length; i++) {
	    a = frames1[i];
	    b = frames2[i];
	    if (
	      a.filename !== b.filename ||
	      a.lineno !== b.lineno ||
	      a.colno !== b.colno ||
	      a['function'] !== b['function']
	    )
	      return false;
	  }
	  return true;
	}

	/**
	 * Polyfill a method
	 * @param obj object e.g. `document`
	 * @param name method name present on object e.g. `addEventListener`
	 * @param replacement replacement function
	 * @param track {optional} record instrumentation to an array
	 */
	function fill(obj, name, replacement, track) {
	  if (obj == null) return;
	  var orig = obj[name];
	  obj[name] = replacement(orig);
	  obj[name].__raven__ = true;
	  obj[name].__orig__ = orig;
	  if (track) {
	    track.push([obj, name, orig]);
	  }
	}

	/**
	 * Join values in array
	 * @param input array of values to be joined together
	 * @param delimiter string to be placed in-between values
	 * @returns {string}
	 */
	function safeJoin(input, delimiter) {
	  if (!isArray(input)) return '';

	  var output = [];

	  for (var i = 0; i < input.length; i++) {
	    try {
	      output.push(String(input[i]));
	    } catch (e) {
	      output.push('[value cannot be serialized]');
	    }
	  }

	  return output.join(delimiter);
	}

	// Default Node.js REPL depth
	var MAX_SERIALIZE_EXCEPTION_DEPTH = 3;
	// 50kB, as 100kB is max payload size, so half sounds reasonable
	var MAX_SERIALIZE_EXCEPTION_SIZE = 50 * 1024;
	var MAX_SERIALIZE_KEYS_LENGTH = 40;

	function utf8Length(value) {
	  return ~-encodeURI(value).split(/%..|./).length;
	}

	function jsonSize(value) {
	  return utf8Length(JSON.stringify(value));
	}

	function serializeValue(value) {
	  if (typeof value === 'string') {
	    var maxLength = 40;
	    return truncate(value, maxLength);
	  } else if (
	    typeof value === 'number' ||
	    typeof value === 'boolean' ||
	    typeof value === 'undefined'
	  ) {
	    return value;
	  }

	  var type = Object.prototype.toString.call(value);

	  // Node.js REPL notation
	  if (type === '[object Object]') return '[Object]';
	  if (type === '[object Array]') return '[Array]';
	  if (type === '[object Function]')
	    return value.name ? '[Function: ' + value.name + ']' : '[Function]';

	  return value;
	}

	function serializeObject(value, depth) {
	  if (depth === 0) return serializeValue(value);

	  if (isPlainObject(value)) {
	    return Object.keys(value).reduce(function(acc, key) {
	      acc[key] = serializeObject(value[key], depth - 1);
	      return acc;
	    }, {});
	  } else if (Array.isArray(value)) {
	    return value.map(function(val) {
	      return serializeObject(val, depth - 1);
	    });
	  }

	  return serializeValue(value);
	}

	function serializeException(ex, depth, maxSize) {
	  if (!isPlainObject(ex)) return ex;

	  depth = typeof depth !== 'number' ? MAX_SERIALIZE_EXCEPTION_DEPTH : depth;
	  maxSize = typeof depth !== 'number' ? MAX_SERIALIZE_EXCEPTION_SIZE : maxSize;

	  var serialized = serializeObject(ex, depth);

	  if (jsonSize(stringify_1(serialized)) > maxSize) {
	    return serializeException(ex, depth - 1);
	  }

	  return serialized;
	}

	function serializeKeysForMessage(keys, maxLength) {
	  if (typeof keys === 'number' || typeof keys === 'string') return keys.toString();
	  if (!Array.isArray(keys)) return '';

	  keys = keys.filter(function(key) {
	    return typeof key === 'string';
	  });
	  if (keys.length === 0) return '[object has no keys]';

	  maxLength = typeof maxLength !== 'number' ? MAX_SERIALIZE_KEYS_LENGTH : maxLength;
	  if (keys[0].length >= maxLength) return keys[0];

	  for (var usedKeys = keys.length; usedKeys > 0; usedKeys--) {
	    var serialized = keys.slice(0, usedKeys).join(', ');
	    if (serialized.length > maxLength) continue;
	    if (usedKeys === keys.length) return serialized;
	    return serialized + '\u2026';
	  }

	  return '';
	}

	function sanitize(input, sanitizeKeys) {
	  if (!isArray(sanitizeKeys) || (isArray(sanitizeKeys) && sanitizeKeys.length === 0))
	    return input;

	  var sanitizeRegExp = joinRegExp(sanitizeKeys);
	  var sanitizeMask = '********';
	  var safeInput;

	  try {
	    safeInput = JSON.parse(stringify_1(input));
	  } catch (o_O) {
	    return input;
	  }

	  function sanitizeWorker(workerInput) {
	    if (isArray(workerInput)) {
	      return workerInput.map(function(val) {
	        return sanitizeWorker(val);
	      });
	    }

	    if (isPlainObject(workerInput)) {
	      return Object.keys(workerInput).reduce(function(acc, k) {
	        if (sanitizeRegExp.test(k)) {
	          acc[k] = sanitizeMask;
	        } else {
	          acc[k] = sanitizeWorker(workerInput[k]);
	        }
	        return acc;
	      }, {});
	    }

	    return workerInput;
	  }

	  return sanitizeWorker(safeInput);
	}

	var utils = {
	  isObject: isObject,
	  isError: isError,
	  isErrorEvent: isErrorEvent,
	  isDOMError: isDOMError,
	  isDOMException: isDOMException,
	  isUndefined: isUndefined,
	  isFunction: isFunction,
	  isPlainObject: isPlainObject,
	  isString: isString,
	  isArray: isArray,
	  isEmptyObject: isEmptyObject,
	  supportsErrorEvent: supportsErrorEvent,
	  supportsDOMError: supportsDOMError,
	  supportsDOMException: supportsDOMException,
	  supportsFetch: supportsFetch,
	  supportsReferrerPolicy: supportsReferrerPolicy,
	  supportsPromiseRejectionEvent: supportsPromiseRejectionEvent,
	  wrappedCallback: wrappedCallback,
	  each: each,
	  objectMerge: objectMerge,
	  truncate: truncate,
	  objectFrozen: objectFrozen,
	  hasKey: hasKey,
	  joinRegExp: joinRegExp,
	  urlencode: urlencode,
	  uuid4: uuid4,
	  htmlTreeAsString: htmlTreeAsString,
	  htmlElementAsString: htmlElementAsString,
	  isSameException: isSameException,
	  isSameStacktrace: isSameStacktrace,
	  parseUrl: parseUrl,
	  fill: fill,
	  safeJoin: safeJoin,
	  serializeException: serializeException,
	  serializeKeysForMessage: serializeKeysForMessage,
	  sanitize: sanitize
	};

	/*
	 TraceKit - Cross brower stack traces

	 This was originally forked from github.com/occ/TraceKit, but has since been
	 largely re-written and is now maintained as part of raven-js.  Tests for
	 this are in test/vendor.

	 MIT license
	*/

	var TraceKit = {
	  collectWindowErrors: true,
	  debug: false
	};

	// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
	var _window$1 =
	  typeof window !== 'undefined'
	    ? window
	    : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	// global reference to slice
	var _slice = [].slice;
	var UNKNOWN_FUNCTION = '?';

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types
	var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;

	function getLocationHref() {
	  if (typeof document === 'undefined' || document.location == null) return '';
	  return document.location.href;
	}

	function getLocationOrigin() {
	  if (typeof document === 'undefined' || document.location == null) return '';

	  // Oh dear IE10...
	  if (!document.location.origin) {
	    return (
	      document.location.protocol +
	      '//' +
	      document.location.hostname +
	      (document.location.port ? ':' + document.location.port : '')
	    );
	  }

	  return document.location.origin;
	}

	/**
	 * TraceKit.report: cross-browser processing of unhandled exceptions
	 *
	 * Syntax:
	 *   TraceKit.report.subscribe(function(stackInfo) { ... })
	 *   TraceKit.report.unsubscribe(function(stackInfo) { ... })
	 *   TraceKit.report(exception)
	 *   try { ...code... } catch(ex) { TraceKit.report(ex); }
	 *
	 * Supports:
	 *   - Firefox: full stack trace with line numbers, plus column number
	 *              on top frame; column number is not guaranteed
	 *   - Opera:   full stack trace with line and column numbers
	 *   - Chrome:  full stack trace with line and column numbers
	 *   - Safari:  line and column number for the top frame only; some frames
	 *              may be missing, and column number is not guaranteed
	 *   - IE:      line and column number for the top frame only; some frames
	 *              may be missing, and column number is not guaranteed
	 *
	 * In theory, TraceKit should work on all of the following versions:
	 *   - IE5.5+ (only 8.0 tested)
	 *   - Firefox 0.9+ (only 3.5+ tested)
	 *   - Opera 7+ (only 10.50 tested; versions 9 and earlier may require
	 *     Exceptions Have Stacktrace to be enabled in opera:config)
	 *   - Safari 3+ (only 4+ tested)
	 *   - Chrome 1+ (only 5+ tested)
	 *   - Konqueror 3.5+ (untested)
	 *
	 * Requires TraceKit.computeStackTrace.
	 *
	 * Tries to catch all unhandled exceptions and report them to the
	 * subscribed handlers. Please note that TraceKit.report will rethrow the
	 * exception. This is REQUIRED in order to get a useful stack trace in IE.
	 * If the exception does not reach the top of the browser, you will only
	 * get a stack trace from the point where TraceKit.report was called.
	 *
	 * Handlers receive a stackInfo object as described in the
	 * TraceKit.computeStackTrace docs.
	 */
	TraceKit.report = (function reportModuleWrapper() {
	  var handlers = [],
	    lastArgs = null,
	    lastException = null,
	    lastExceptionStack = null;

	  /**
	   * Add a crash handler.
	   * @param {Function} handler
	   */
	  function subscribe(handler) {
	    installGlobalHandler();
	    handlers.push(handler);
	  }

	  /**
	   * Remove a crash handler.
	   * @param {Function} handler
	   */
	  function unsubscribe(handler) {
	    for (var i = handlers.length - 1; i >= 0; --i) {
	      if (handlers[i] === handler) {
	        handlers.splice(i, 1);
	      }
	    }
	  }

	  /**
	   * Remove all crash handlers.
	   */
	  function unsubscribeAll() {
	    uninstallGlobalHandler();
	    handlers = [];
	  }

	  /**
	   * Dispatch stack information to all handlers.
	   * @param {Object.<string, *>} stack
	   */
	  function notifyHandlers(stack, isWindowError) {
	    var exception = null;
	    if (isWindowError && !TraceKit.collectWindowErrors) {
	      return;
	    }
	    for (var i in handlers) {
	      if (handlers.hasOwnProperty(i)) {
	        try {
	          handlers[i].apply(null, [stack].concat(_slice.call(arguments, 2)));
	        } catch (inner) {
	          exception = inner;
	        }
	      }
	    }

	    if (exception) {
	      throw exception;
	    }
	  }

	  var _oldOnerrorHandler, _onErrorHandlerInstalled;

	  /**
	   * Ensures all global unhandled exceptions are recorded.
	   * Supported by Gecko and IE.
	   * @param {string} msg Error message.
	   * @param {string} url URL of script that generated the exception.
	   * @param {(number|string)} lineNo The line number at which the error
	   * occurred.
	   * @param {?(number|string)} colNo The column number at which the error
	   * occurred.
	   * @param {?Error} ex The actual Error object.
	   */
	  function traceKitWindowOnError(msg, url, lineNo, colNo, ex) {
	    var stack = null;
	    // If 'ex' is ErrorEvent, get real Error from inside
	    var exception = utils.isErrorEvent(ex) ? ex.error : ex;
	    // If 'msg' is ErrorEvent, get real message from inside
	    var message = utils.isErrorEvent(msg) ? msg.message : msg;

	    if (lastExceptionStack) {
	      TraceKit.computeStackTrace.augmentStackTraceWithInitialElement(
	        lastExceptionStack,
	        url,
	        lineNo,
	        message
	      );
	      processLastException();
	    } else if (exception && utils.isError(exception)) {
	      // non-string `exception` arg; attempt to extract stack trace

	      // New chrome and blink send along a real error object
	      // Let's just report that like a normal error.
	      // See: https://mikewest.org/2013/08/debugging-runtime-errors-with-window-onerror
	      stack = TraceKit.computeStackTrace(exception);
	      notifyHandlers(stack, true);
	    } else {
	      var location = {
	        url: url,
	        line: lineNo,
	        column: colNo
	      };

	      var name = undefined;
	      var groups;

	      if ({}.toString.call(message) === '[object String]') {
	        var groups = message.match(ERROR_TYPES_RE);
	        if (groups) {
	          name = groups[1];
	          message = groups[2];
	        }
	      }

	      location.func = UNKNOWN_FUNCTION;

	      stack = {
	        name: name,
	        message: message,
	        url: getLocationHref(),
	        stack: [location]
	      };
	      notifyHandlers(stack, true);
	    }

	    if (_oldOnerrorHandler) {
	      return _oldOnerrorHandler.apply(this, arguments);
	    }

	    return false;
	  }

	  function installGlobalHandler() {
	    if (_onErrorHandlerInstalled) {
	      return;
	    }
	    _oldOnerrorHandler = _window$1.onerror;
	    _window$1.onerror = traceKitWindowOnError;
	    _onErrorHandlerInstalled = true;
	  }

	  function uninstallGlobalHandler() {
	    if (!_onErrorHandlerInstalled) {
	      return;
	    }
	    _window$1.onerror = _oldOnerrorHandler;
	    _onErrorHandlerInstalled = false;
	    _oldOnerrorHandler = undefined;
	  }

	  function processLastException() {
	    var _lastExceptionStack = lastExceptionStack,
	      _lastArgs = lastArgs;
	    lastArgs = null;
	    lastExceptionStack = null;
	    lastException = null;
	    notifyHandlers.apply(null, [_lastExceptionStack, false].concat(_lastArgs));
	  }

	  /**
	   * Reports an unhandled Error to TraceKit.
	   * @param {Error} ex
	   * @param {?boolean} rethrow If false, do not re-throw the exception.
	   * Only used for window.onerror to not cause an infinite loop of
	   * rethrowing.
	   */
	  function report(ex, rethrow) {
	    var args = _slice.call(arguments, 1);
	    if (lastExceptionStack) {
	      if (lastException === ex) {
	        return; // already caught by an inner catch block, ignore
	      } else {
	        processLastException();
	      }
	    }

	    var stack = TraceKit.computeStackTrace(ex);
	    lastExceptionStack = stack;
	    lastException = ex;
	    lastArgs = args;

	    // If the stack trace is incomplete, wait for 2 seconds for
	    // slow slow IE to see if onerror occurs or not before reporting
	    // this exception; otherwise, we will end up with an incomplete
	    // stack trace
	    setTimeout(function() {
	      if (lastException === ex) {
	        processLastException();
	      }
	    }, stack.incomplete ? 2000 : 0);

	    if (rethrow !== false) {
	      throw ex; // re-throw to propagate to the top level (and cause window.onerror)
	    }
	  }

	  report.subscribe = subscribe;
	  report.unsubscribe = unsubscribe;
	  report.uninstall = unsubscribeAll;
	  return report;
	})();

	/**
	 * TraceKit.computeStackTrace: cross-browser stack traces in JavaScript
	 *
	 * Syntax:
	 *   s = TraceKit.computeStackTrace(exception) // consider using TraceKit.report instead (see below)
	 * Returns:
	 *   s.name              - exception name
	 *   s.message           - exception message
	 *   s.stack[i].url      - JavaScript or HTML file URL
	 *   s.stack[i].func     - function name, or empty for anonymous functions (if guessing did not work)
	 *   s.stack[i].args     - arguments passed to the function, if known
	 *   s.stack[i].line     - line number, if known
	 *   s.stack[i].column   - column number, if known
	 *
	 * Supports:
	 *   - Firefox:  full stack trace with line numbers and unreliable column
	 *               number on top frame
	 *   - Opera 10: full stack trace with line and column numbers
	 *   - Opera 9-: full stack trace with line numbers
	 *   - Chrome:   full stack trace with line and column numbers
	 *   - Safari:   line and column number for the topmost stacktrace element
	 *               only
	 *   - IE:       no line numbers whatsoever
	 *
	 * Tries to guess names of anonymous functions by looking for assignments
	 * in the source code. In IE and Safari, we have to guess source file names
	 * by searching for function bodies inside all page scripts. This will not
	 * work for scripts that are loaded cross-domain.
	 * Here be dragons: some function names may be guessed incorrectly, and
	 * duplicate functions may be mismatched.
	 *
	 * TraceKit.computeStackTrace should only be used for tracing purposes.
	 * Logging of unhandled exceptions should be done with TraceKit.report,
	 * which builds on top of TraceKit.computeStackTrace and provides better
	 * IE support by utilizing the window.onerror event to retrieve information
	 * about the top of the stack.
	 *
	 * Note: In IE and Safari, no stack trace is recorded on the Error object,
	 * so computeStackTrace instead walks its *own* chain of callers.
	 * This means that:
	 *  * in Safari, some methods may be missing from the stack trace;
	 *  * in IE, the topmost function in the stack trace will always be the
	 *    caller of computeStackTrace.
	 *
	 * This is okay for tracing (because you are likely to be calling
	 * computeStackTrace from the function you want to be the topmost element
	 * of the stack trace anyway), but not okay for logging unhandled
	 * exceptions (because your catch block will likely be far away from the
	 * inner function that actually caused the exception).
	 *
	 */
	TraceKit.computeStackTrace = (function computeStackTraceWrapper() {
	  // Contents of Exception in various browsers.
	  //
	  // SAFARI:
	  // ex.message = Can't find variable: qq
	  // ex.line = 59
	  // ex.sourceId = 580238192
	  // ex.sourceURL = http://...
	  // ex.expressionBeginOffset = 96
	  // ex.expressionCaretOffset = 98
	  // ex.expressionEndOffset = 98
	  // ex.name = ReferenceError
	  //
	  // FIREFOX:
	  // ex.message = qq is not defined
	  // ex.fileName = http://...
	  // ex.lineNumber = 59
	  // ex.columnNumber = 69
	  // ex.stack = ...stack trace... (see the example below)
	  // ex.name = ReferenceError
	  //
	  // CHROME:
	  // ex.message = qq is not defined
	  // ex.name = ReferenceError
	  // ex.type = not_defined
	  // ex.arguments = ['aa']
	  // ex.stack = ...stack trace...
	  //
	  // INTERNET EXPLORER:
	  // ex.message = ...
	  // ex.name = ReferenceError
	  //
	  // OPERA:
	  // ex.message = ...message... (see the example below)
	  // ex.name = ReferenceError
	  // ex.opera#sourceloc = 11  (pretty much useless, duplicates the info in ex.message)
	  // ex.stacktrace = n/a; see 'opera:config#UserPrefs|Exceptions Have Stacktrace'

	  /**
	   * Computes stack trace information from the stack property.
	   * Chrome and Gecko use this property.
	   * @param {Error} ex
	   * @return {?Object.<string, *>} Stack trace information.
	   */
	  function computeStackTraceFromStackProp(ex) {
	    if (typeof ex.stack === 'undefined' || !ex.stack) return;

	    var chrome = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
	    var winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
	    // NOTE: blob urls are now supposed to always have an origin, therefore it's format
	    // which is `blob:http://url/path/with-some-uuid`, is matched by `blob.*?:\/` as well
	    var gecko = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
	    // Used to additionally parse URL/line/column from eval frames
	    var geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
	    var chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/;
	    var lines = ex.stack.split('\n');
	    var stack = [];
	    var submatch;
	    var parts;
	    var element;
	    var reference = /^(.*) is undefined$/.exec(ex.message);

	    for (var i = 0, j = lines.length; i < j; ++i) {
	      if ((parts = chrome.exec(lines[i]))) {
	        var isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line
	        var isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
	        if (isEval && (submatch = chromeEval.exec(parts[2]))) {
	          // throw out eval line/column and use top-most line/column number
	          parts[2] = submatch[1]; // url
	          parts[3] = submatch[2]; // line
	          parts[4] = submatch[3]; // column
	        }
	        element = {
	          url: !isNative ? parts[2] : null,
	          func: parts[1] || UNKNOWN_FUNCTION,
	          args: isNative ? [parts[2]] : [],
	          line: parts[3] ? +parts[3] : null,
	          column: parts[4] ? +parts[4] : null
	        };
	      } else if ((parts = winjs.exec(lines[i]))) {
	        element = {
	          url: parts[2],
	          func: parts[1] || UNKNOWN_FUNCTION,
	          args: [],
	          line: +parts[3],
	          column: parts[4] ? +parts[4] : null
	        };
	      } else if ((parts = gecko.exec(lines[i]))) {
	        var isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
	        if (isEval && (submatch = geckoEval.exec(parts[3]))) {
	          // throw out eval line/column and use top-most line number
	          parts[3] = submatch[1];
	          parts[4] = submatch[2];
	          parts[5] = null; // no column when eval
	        } else if (i === 0 && !parts[5] && typeof ex.columnNumber !== 'undefined') {
	          // FireFox uses this awesome columnNumber property for its top frame
	          // Also note, Firefox's column number is 0-based and everything else expects 1-based,
	          // so adding 1
	          // NOTE: this hack doesn't work if top-most frame is eval
	          stack[0].column = ex.columnNumber + 1;
	        }
	        element = {
	          url: parts[3],
	          func: parts[1] || UNKNOWN_FUNCTION,
	          args: parts[2] ? parts[2].split(',') : [],
	          line: parts[4] ? +parts[4] : null,
	          column: parts[5] ? +parts[5] : null
	        };
	      } else {
	        continue;
	      }

	      if (!element.func && element.line) {
	        element.func = UNKNOWN_FUNCTION;
	      }

	      if (element.url && element.url.substr(0, 5) === 'blob:') {
	        // Special case for handling JavaScript loaded into a blob.
	        // We use a synchronous AJAX request here as a blob is already in
	        // memory - it's not making a network request.  This will generate a warning
	        // in the browser console, but there has already been an error so that's not
	        // that much of an issue.
	        var xhr = new XMLHttpRequest();
	        xhr.open('GET', element.url, false);
	        xhr.send(null);

	        // If we failed to download the source, skip this patch
	        if (xhr.status === 200) {
	          var source = xhr.responseText || '';

	          // We trim the source down to the last 300 characters as sourceMappingURL is always at the end of the file.
	          // Why 300? To be in line with: https://github.com/getsentry/sentry/blob/4af29e8f2350e20c28a6933354e4f42437b4ba42/src/sentry/lang/javascript/processor.py#L164-L175
	          source = source.slice(-300);

	          // Now we dig out the source map URL
	          var sourceMaps = source.match(/\/\/# sourceMappingURL=(.*)$/);

	          // If we don't find a source map comment or we find more than one, continue on to the next element.
	          if (sourceMaps) {
	            var sourceMapAddress = sourceMaps[1];

	            // Now we check to see if it's a relative URL.
	            // If it is, convert it to an absolute one.
	            if (sourceMapAddress.charAt(0) === '~') {
	              sourceMapAddress = getLocationOrigin() + sourceMapAddress.slice(1);
	            }

	            // Now we strip the '.map' off of the end of the URL and update the
	            // element so that Sentry can match the map to the blob.
	            element.url = sourceMapAddress.slice(0, -4);
	          }
	        }
	      }

	      stack.push(element);
	    }

	    if (!stack.length) {
	      return null;
	    }

	    return {
	      name: ex.name,
	      message: ex.message,
	      url: getLocationHref(),
	      stack: stack
	    };
	  }

	  /**
	   * Adds information about the first frame to incomplete stack traces.
	   * Safari and IE require this to get complete data on the first frame.
	   * @param {Object.<string, *>} stackInfo Stack trace information from
	   * one of the compute* methods.
	   * @param {string} url The URL of the script that caused an error.
	   * @param {(number|string)} lineNo The line number of the script that
	   * caused an error.
	   * @param {string=} message The error generated by the browser, which
	   * hopefully contains the name of the object that caused the error.
	   * @return {boolean} Whether or not the stack information was
	   * augmented.
	   */
	  function augmentStackTraceWithInitialElement(stackInfo, url, lineNo, message) {
	    var initial = {
	      url: url,
	      line: lineNo
	    };

	    if (initial.url && initial.line) {
	      stackInfo.incomplete = false;

	      if (!initial.func) {
	        initial.func = UNKNOWN_FUNCTION;
	      }

	      if (stackInfo.stack.length > 0) {
	        if (stackInfo.stack[0].url === initial.url) {
	          if (stackInfo.stack[0].line === initial.line) {
	            return false; // already in stack trace
	          } else if (
	            !stackInfo.stack[0].line &&
	            stackInfo.stack[0].func === initial.func
	          ) {
	            stackInfo.stack[0].line = initial.line;
	            return false;
	          }
	        }
	      }

	      stackInfo.stack.unshift(initial);
	      stackInfo.partial = true;
	      return true;
	    } else {
	      stackInfo.incomplete = true;
	    }

	    return false;
	  }

	  /**
	   * Computes stack trace information by walking the arguments.caller
	   * chain at the time the exception occurred. This will cause earlier
	   * frames to be missed but is the only way to get any stack trace in
	   * Safari and IE. The top frame is restored by
	   * {@link augmentStackTraceWithInitialElement}.
	   * @param {Error} ex
	   * @return {?Object.<string, *>} Stack trace information.
	   */
	  function computeStackTraceByWalkingCallerChain(ex, depth) {
	    var functionName = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
	      stack = [],
	      funcs = {},
	      recursion = false,
	      parts,
	      item;

	    for (
	      var curr = computeStackTraceByWalkingCallerChain.caller;
	      curr && !recursion;
	      curr = curr.caller
	    ) {
	      if (curr === computeStackTrace || curr === TraceKit.report) {
	        // console.log('skipping internal function');
	        continue;
	      }

	      item = {
	        url: null,
	        func: UNKNOWN_FUNCTION,
	        line: null,
	        column: null
	      };

	      if (curr.name) {
	        item.func = curr.name;
	      } else if ((parts = functionName.exec(curr.toString()))) {
	        item.func = parts[1];
	      }

	      if (typeof item.func === 'undefined') {
	        try {
	          item.func = parts.input.substring(0, parts.input.indexOf('{'));
	        } catch (e) {}
	      }

	      if (funcs['' + curr]) {
	        recursion = true;
	      } else {
	        funcs['' + curr] = true;
	      }

	      stack.push(item);
	    }

	    if (depth) {
	      // console.log('depth is ' + depth);
	      // console.log('stack is ' + stack.length);
	      stack.splice(0, depth);
	    }

	    var result = {
	      name: ex.name,
	      message: ex.message,
	      url: getLocationHref(),
	      stack: stack
	    };
	    augmentStackTraceWithInitialElement(
	      result,
	      ex.sourceURL || ex.fileName,
	      ex.line || ex.lineNumber,
	      ex.message || ex.description
	    );
	    return result;
	  }

	  /**
	   * Computes a stack trace for an exception.
	   * @param {Error} ex
	   * @param {(string|number)=} depth
	   */
	  function computeStackTrace(ex, depth) {
	    var stack = null;
	    depth = depth == null ? 0 : +depth;

	    try {
	      stack = computeStackTraceFromStackProp(ex);
	      if (stack) {
	        return stack;
	      }
	    } catch (e) {
	      if (TraceKit.debug) {
	        throw e;
	      }
	    }

	    try {
	      stack = computeStackTraceByWalkingCallerChain(ex, depth + 1);
	      if (stack) {
	        return stack;
	      }
	    } catch (e) {
	      if (TraceKit.debug) {
	        throw e;
	      }
	    }
	    return {
	      name: ex.name,
	      message: ex.message,
	      url: getLocationHref()
	    };
	  }

	  computeStackTrace.augmentStackTraceWithInitialElement = augmentStackTraceWithInitialElement;
	  computeStackTrace.computeStackTraceFromStackProp = computeStackTraceFromStackProp;

	  return computeStackTrace;
	})();

	var tracekit = TraceKit;

	/*
	 * JavaScript MD5
	 * https://github.com/blueimp/JavaScript-MD5
	 *
	 * Copyright 2011, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * https://opensource.org/licenses/MIT
	 *
	 * Based on
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	/*
	* Add integers, wrapping at 2^32. This uses 16-bit operations internally
	* to work around bugs in some JS interpreters.
	*/
	function safeAdd(x, y) {
	  var lsw = (x & 0xffff) + (y & 0xffff);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xffff);
	}

	/*
	* Bitwise rotate a 32-bit number to the left.
	*/
	function bitRotateLeft(num, cnt) {
	  return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	* These functions implement the four basic operations the algorithm uses.
	*/
	function md5cmn(q, a, b, x, s, t) {
	  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
	}
	function md5ff(a, b, c, d, x, s, t) {
	  return md5cmn((b & c) | (~b & d), a, b, x, s, t);
	}
	function md5gg(a, b, c, d, x, s, t) {
	  return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
	}
	function md5hh(a, b, c, d, x, s, t) {
	  return md5cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5ii(a, b, c, d, x, s, t) {
	  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
	}

	/*
	* Calculate the MD5 of an array of little-endian words, and a bit length.
	*/
	function binlMD5(x, len) {
	  /* append padding */
	  x[len >> 5] |= 0x80 << (len % 32);
	  x[(((len + 64) >>> 9) << 4) + 14] = len;

	  var i;
	  var olda;
	  var oldb;
	  var oldc;
	  var oldd;
	  var a = 1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d = 271733878;

	  for (i = 0; i < x.length; i += 16) {
	    olda = a;
	    oldb = b;
	    oldc = c;
	    oldd = d;

	    a = md5ff(a, b, c, d, x[i], 7, -680876936);
	    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
	    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
	    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
	    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
	    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
	    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
	    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
	    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
	    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
	    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
	    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
	    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
	    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
	    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
	    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

	    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
	    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
	    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
	    b = md5gg(b, c, d, a, x[i], 20, -373897302);
	    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
	    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
	    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
	    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
	    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
	    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
	    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
	    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
	    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
	    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
	    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
	    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

	    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
	    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
	    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
	    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
	    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
	    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
	    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
	    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
	    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
	    d = md5hh(d, a, b, c, x[i], 11, -358537222);
	    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
	    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
	    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
	    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
	    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
	    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

	    a = md5ii(a, b, c, d, x[i], 6, -198630844);
	    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
	    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
	    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
	    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
	    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
	    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
	    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
	    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
	    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
	    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
	    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
	    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
	    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
	    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
	    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

	    a = safeAdd(a, olda);
	    b = safeAdd(b, oldb);
	    c = safeAdd(c, oldc);
	    d = safeAdd(d, oldd);
	  }
	  return [a, b, c, d];
	}

	/*
	* Convert an array of little-endian words to a string
	*/
	function binl2rstr(input) {
	  var i;
	  var output = '';
	  var length32 = input.length * 32;
	  for (i = 0; i < length32; i += 8) {
	    output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
	  }
	  return output;
	}

	/*
	* Convert a raw string to an array of little-endian words
	* Characters >255 have their high-byte silently ignored.
	*/
	function rstr2binl(input) {
	  var i;
	  var output = [];
	  output[(input.length >> 2) - 1] = undefined;
	  for (i = 0; i < output.length; i += 1) {
	    output[i] = 0;
	  }
	  var length8 = input.length * 8;
	  for (i = 0; i < length8; i += 8) {
	    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32);
	  }
	  return output;
	}

	/*
	* Calculate the MD5 of a raw string
	*/
	function rstrMD5(s) {
	  return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
	}

	/*
	* Calculate the HMAC-MD5, of a key and some data (raw strings)
	*/
	function rstrHMACMD5(key, data) {
	  var i;
	  var bkey = rstr2binl(key);
	  var ipad = [];
	  var opad = [];
	  var hash;
	  ipad[15] = opad[15] = undefined;
	  if (bkey.length > 16) {
	    bkey = binlMD5(bkey, key.length * 8);
	  }
	  for (i = 0; i < 16; i += 1) {
	    ipad[i] = bkey[i] ^ 0x36363636;
	    opad[i] = bkey[i] ^ 0x5c5c5c5c;
	  }
	  hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
	  return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
	}

	/*
	* Convert a raw string to a hex string
	*/
	function rstr2hex(input) {
	  var hexTab = '0123456789abcdef';
	  var output = '';
	  var x;
	  var i;
	  for (i = 0; i < input.length; i += 1) {
	    x = input.charCodeAt(i);
	    output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
	  }
	  return output;
	}

	/*
	* Encode a string as utf-8
	*/
	function str2rstrUTF8(input) {
	  return unescape(encodeURIComponent(input));
	}

	/*
	* Take string arguments and return either raw or hex encoded strings
	*/
	function rawMD5(s) {
	  return rstrMD5(str2rstrUTF8(s));
	}
	function hexMD5(s) {
	  return rstr2hex(rawMD5(s));
	}
	function rawHMACMD5(k, d) {
	  return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
	}
	function hexHMACMD5(k, d) {
	  return rstr2hex(rawHMACMD5(k, d));
	}

	function md5(string, key, raw) {
	  if (!key) {
	    if (!raw) {
	      return hexMD5(string);
	    }
	    return rawMD5(string);
	  }
	  if (!raw) {
	    return hexHMACMD5(key, string);
	  }
	  return rawHMACMD5(key, string);
	}

	var md5_1 = md5;

	function RavenConfigError(message) {
	  this.name = 'RavenConfigError';
	  this.message = message;
	}
	RavenConfigError.prototype = new Error();
	RavenConfigError.prototype.constructor = RavenConfigError;

	var configError = RavenConfigError;

	var wrapMethod = function(console, level, callback) {
	  var originalConsoleLevel = console[level];
	  var originalConsole = console;

	  if (!(level in console)) {
	    return;
	  }

	  var sentryLevel = level === 'warn' ? 'warning' : level;

	  console[level] = function() {
	    var args = [].slice.call(arguments);

	    var msg = utils.safeJoin(args, ' ');
	    var data = {level: sentryLevel, logger: 'console', extra: {arguments: args}};

	    if (level === 'assert') {
	      if (args[0] === false) {
	        // Default browsers message
	        msg =
	          'Assertion failed: ' + (utils.safeJoin(args.slice(1), ' ') || 'console.assert');
	        data.extra.arguments = args.slice(1);
	        callback && callback(msg, data);
	      }
	    } else {
	      callback && callback(msg, data);
	    }

	    // this fails for some browsers. :(
	    if (originalConsoleLevel) {
	      // IE9 doesn't allow calling apply on console functions directly
	      // See: https://stackoverflow.com/questions/5472938/does-ie9-support-console-log-and-is-it-a-real-function#answer-5473193
	      Function.prototype.apply.call(originalConsoleLevel, originalConsole, args);
	    }
	  };
	};

	var console$1 = {
	  wrapMethod: wrapMethod
	};

	/*global XDomainRequest:false */







	var isErrorEvent$1 = utils.isErrorEvent;
	var isDOMError$1 = utils.isDOMError;
	var isDOMException$1 = utils.isDOMException;
	var isError$1 = utils.isError;
	var isObject$1 = utils.isObject;
	var isPlainObject$1 = utils.isPlainObject;
	var isUndefined$1 = utils.isUndefined;
	var isFunction$1 = utils.isFunction;
	var isString$1 = utils.isString;
	var isArray$1 = utils.isArray;
	var isEmptyObject$1 = utils.isEmptyObject;
	var each$1 = utils.each;
	var objectMerge$1 = utils.objectMerge;
	var truncate$1 = utils.truncate;
	var objectFrozen$1 = utils.objectFrozen;
	var hasKey$1 = utils.hasKey;
	var joinRegExp$1 = utils.joinRegExp;
	var urlencode$1 = utils.urlencode;
	var uuid4$1 = utils.uuid4;
	var htmlTreeAsString$1 = utils.htmlTreeAsString;
	var isSameException$1 = utils.isSameException;
	var isSameStacktrace$1 = utils.isSameStacktrace;
	var parseUrl$1 = utils.parseUrl;
	var fill$1 = utils.fill;
	var supportsFetch$1 = utils.supportsFetch;
	var supportsReferrerPolicy$1 = utils.supportsReferrerPolicy;
	var serializeKeysForMessage$1 = utils.serializeKeysForMessage;
	var serializeException$1 = utils.serializeException;
	var sanitize$1 = utils.sanitize;

	var wrapConsoleMethod = console$1.wrapMethod;

	var dsnKeys = 'source protocol user pass host port path'.split(' '),
	  dsnPattern = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;

	function now() {
	  return +new Date();
	}

	// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
	var _window$2 =
	  typeof window !== 'undefined'
	    ? window
	    : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};
	var _document = _window$2.document;
	var _navigator = _window$2.navigator;

	function keepOriginalCallback(original, callback) {
	  return isFunction$1(callback)
	    ? function(data) {
	        return callback(data, original);
	      }
	    : callback;
	}

	// First, check for JSON support
	// If there is no JSON, we no-op the core features of Raven
	// since JSON is required to encode the payload
	function Raven() {
	  this._hasJSON = !!(typeof JSON === 'object' && JSON.stringify);
	  // Raven can run in contexts where there's no document (react-native)
	  this._hasDocument = !isUndefined$1(_document);
	  this._hasNavigator = !isUndefined$1(_navigator);
	  this._lastCapturedException = null;
	  this._lastData = null;
	  this._lastEventId = null;
	  this._globalServer = null;
	  this._globalKey = null;
	  this._globalProject = null;
	  this._globalContext = {};
	  this._globalOptions = {
	    // SENTRY_RELEASE can be injected by https://github.com/getsentry/sentry-webpack-plugin
	    release: _window$2.SENTRY_RELEASE && _window$2.SENTRY_RELEASE.id,
	    logger: 'javascript',
	    ignoreErrors: [],
	    ignoreUrls: [],
	    whitelistUrls: [],
	    includePaths: [],
	    headers: null,
	    collectWindowErrors: true,
	    captureUnhandledRejections: true,
	    maxMessageLength: 0,
	    // By default, truncates URL values to 250 chars
	    maxUrlLength: 250,
	    stackTraceLimit: 50,
	    autoBreadcrumbs: true,
	    instrument: true,
	    sampleRate: 1,
	    sanitizeKeys: []
	  };
	  this._fetchDefaults = {
	    method: 'POST',
	    // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default
	    // https://caniuse.com/#feat=referrer-policy
	    // It doesn't. And it throw exception instead of ignoring this parameter...
	    // REF: https://github.com/getsentry/raven-js/issues/1233
	    referrerPolicy: supportsReferrerPolicy$1() ? 'origin' : ''
	  };
	  this._ignoreOnError = 0;
	  this._isRavenInstalled = false;
	  this._originalErrorStackTraceLimit = Error.stackTraceLimit;
	  // capture references to window.console *and* all its methods first
	  // before the console plugin has a chance to monkey patch
	  this._originalConsole = _window$2.console || {};
	  this._originalConsoleMethods = {};
	  this._plugins = [];
	  this._startTime = now();
	  this._wrappedBuiltIns = [];
	  this._breadcrumbs = [];
	  this._lastCapturedEvent = null;
	  this._keypressTimeout;
	  this._location = _window$2.location;
	  this._lastHref = this._location && this._location.href;
	  this._resetBackoff();

	  // eslint-disable-next-line guard-for-in
	  for (var method in this._originalConsole) {
	    this._originalConsoleMethods[method] = this._originalConsole[method];
	  }
	}

	/*
	 * The core Raven singleton
	 *
	 * @this {Raven}
	 */

	Raven.prototype = {
	  // Hardcode version string so that raven source can be loaded directly via
	  // webpack (using a build step causes webpack #1617). Grunt verifies that
	  // this value matches package.json during build.
	  //   See: https://github.com/getsentry/raven-js/issues/465
	  VERSION: '3.27.0',

	  debug: false,

	  TraceKit: tracekit, // alias to TraceKit

	  /*
	     * Configure Raven with a DSN and extra options
	     *
	     * @param {string} dsn The public Sentry DSN
	     * @param {object} options Set of global options [optional]
	     * @return {Raven}
	     */
	  config: function(dsn, options) {
	    var self = this;

	    if (self._globalServer) {
	      this._logDebug('error', 'Error: Raven has already been configured');
	      return self;
	    }
	    if (!dsn) return self;

	    var globalOptions = self._globalOptions;

	    // merge in options
	    if (options) {
	      each$1(options, function(key, value) {
	        // tags and extra are special and need to be put into context
	        if (key === 'tags' || key === 'extra' || key === 'user') {
	          self._globalContext[key] = value;
	        } else {
	          globalOptions[key] = value;
	        }
	      });
	    }

	    self.setDSN(dsn);

	    // "Script error." is hard coded into browsers for errors that it can't read.
	    // this is the result of a script being pulled in from an external domain and CORS.
	    globalOptions.ignoreErrors.push(/^Script error\.?$/);
	    globalOptions.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/);

	    // join regexp rules into one big rule
	    globalOptions.ignoreErrors = joinRegExp$1(globalOptions.ignoreErrors);
	    globalOptions.ignoreUrls = globalOptions.ignoreUrls.length
	      ? joinRegExp$1(globalOptions.ignoreUrls)
	      : false;
	    globalOptions.whitelistUrls = globalOptions.whitelistUrls.length
	      ? joinRegExp$1(globalOptions.whitelistUrls)
	      : false;
	    globalOptions.includePaths = joinRegExp$1(globalOptions.includePaths);
	    globalOptions.maxBreadcrumbs = Math.max(
	      0,
	      Math.min(globalOptions.maxBreadcrumbs || 100, 100)
	    ); // default and hard limit is 100

	    var autoBreadcrumbDefaults = {
	      xhr: true,
	      console: true,
	      dom: true,
	      location: true,
	      sentry: true
	    };

	    var autoBreadcrumbs = globalOptions.autoBreadcrumbs;
	    if ({}.toString.call(autoBreadcrumbs) === '[object Object]') {
	      autoBreadcrumbs = objectMerge$1(autoBreadcrumbDefaults, autoBreadcrumbs);
	    } else if (autoBreadcrumbs !== false) {
	      autoBreadcrumbs = autoBreadcrumbDefaults;
	    }
	    globalOptions.autoBreadcrumbs = autoBreadcrumbs;

	    var instrumentDefaults = {
	      tryCatch: true
	    };

	    var instrument = globalOptions.instrument;
	    if ({}.toString.call(instrument) === '[object Object]') {
	      instrument = objectMerge$1(instrumentDefaults, instrument);
	    } else if (instrument !== false) {
	      instrument = instrumentDefaults;
	    }
	    globalOptions.instrument = instrument;

	    tracekit.collectWindowErrors = !!globalOptions.collectWindowErrors;

	    // return for chaining
	    return self;
	  },

	  /*
	     * Installs a global window.onerror error handler
	     * to capture and report uncaught exceptions.
	     * At this point, install() is required to be called due
	     * to the way TraceKit is set up.
	     *
	     * @return {Raven}
	     */
	  install: function() {
	    var self = this;
	    if (self.isSetup() && !self._isRavenInstalled) {
	      tracekit.report.subscribe(function() {
	        self._handleOnErrorStackInfo.apply(self, arguments);
	      });

	      if (self._globalOptions.captureUnhandledRejections) {
	        self._attachPromiseRejectionHandler();
	      }

	      self._patchFunctionToString();

	      if (self._globalOptions.instrument && self._globalOptions.instrument.tryCatch) {
	        self._instrumentTryCatch();
	      }

	      if (self._globalOptions.autoBreadcrumbs) self._instrumentBreadcrumbs();

	      // Install all of the plugins
	      self._drainPlugins();

	      self._isRavenInstalled = true;
	    }

	    Error.stackTraceLimit = self._globalOptions.stackTraceLimit;
	    return this;
	  },

	  /*
	     * Set the DSN (can be called multiple time unlike config)
	     *
	     * @param {string} dsn The public Sentry DSN
	     */
	  setDSN: function(dsn) {
	    var self = this,
	      uri = self._parseDSN(dsn),
	      lastSlash = uri.path.lastIndexOf('/'),
	      path = uri.path.substr(1, lastSlash);

	    self._dsn = dsn;
	    self._globalKey = uri.user;
	    self._globalSecret = uri.pass && uri.pass.substr(1);
	    self._globalProject = uri.path.substr(lastSlash + 1);

	    self._globalServer = self._getGlobalServer(uri);

	    self._globalEndpoint =
	      self._globalServer + '/' + path + 'api/' + self._globalProject + '/store/';

	    // Reset backoff state since we may be pointing at a
	    // new project/server
	    this._resetBackoff();
	  },

	  /*
	     * Wrap code within a context so Raven can capture errors
	     * reliably across domains that is executed immediately.
	     *
	     * @param {object} options A specific set of options for this context [optional]
	     * @param {function} func The callback to be immediately executed within the context
	     * @param {array} args An array of arguments to be called with the callback [optional]
	     */
	  context: function(options, func, args) {
	    if (isFunction$1(options)) {
	      args = func || [];
	      func = options;
	      options = {};
	    }

	    return this.wrap(options, func).apply(this, args);
	  },

	  /*
	     * Wrap code within a context and returns back a new function to be executed
	     *
	     * @param {object} options A specific set of options for this context [optional]
	     * @param {function} func The function to be wrapped in a new context
	     * @param {function} _before A function to call before the try/catch wrapper [optional, private]
	     * @return {function} The newly wrapped functions with a context
	     */
	  wrap: function(options, func, _before) {
	    var self = this;
	    // 1 argument has been passed, and it's not a function
	    // so just return it
	    if (isUndefined$1(func) && !isFunction$1(options)) {
	      return options;
	    }

	    // options is optional
	    if (isFunction$1(options)) {
	      func = options;
	      options = undefined;
	    }

	    // At this point, we've passed along 2 arguments, and the second one
	    // is not a function either, so we'll just return the second argument.
	    if (!isFunction$1(func)) {
	      return func;
	    }

	    // We don't wanna wrap it twice!
	    try {
	      if (func.__raven__) {
	        return func;
	      }

	      // If this has already been wrapped in the past, return that
	      if (func.__raven_wrapper__) {
	        return func.__raven_wrapper__;
	      }
	    } catch (e) {
	      // Just accessing custom props in some Selenium environments
	      // can cause a "Permission denied" exception (see raven-js#495).
	      // Bail on wrapping and return the function as-is (defers to window.onerror).
	      return func;
	    }

	    function wrapped() {
	      var args = [],
	        i = arguments.length,
	        deep = !options || (options && options.deep !== false);

	      if (_before && isFunction$1(_before)) {
	        _before.apply(this, arguments);
	      }

	      // Recursively wrap all of a function's arguments that are
	      // functions themselves.
	      while (i--) args[i] = deep ? self.wrap(options, arguments[i]) : arguments[i];

	      try {
	        // Attempt to invoke user-land function
	        // NOTE: If you are a Sentry user, and you are seeing this stack frame, it
	        //       means Raven caught an error invoking your application code. This is
	        //       expected behavior and NOT indicative of a bug with Raven.js.
	        return func.apply(this, args);
	      } catch (e) {
	        self._ignoreNextOnError();
	        self.captureException(e, options);
	        throw e;
	      }
	    }

	    // copy over properties of the old function
	    for (var property in func) {
	      if (hasKey$1(func, property)) {
	        wrapped[property] = func[property];
	      }
	    }
	    wrapped.prototype = func.prototype;

	    func.__raven_wrapper__ = wrapped;
	    // Signal that this function has been wrapped/filled already
	    // for both debugging and to prevent it to being wrapped/filled twice
	    wrapped.__raven__ = true;
	    wrapped.__orig__ = func;

	    return wrapped;
	  },

	  /**
	   * Uninstalls the global error handler.
	   *
	   * @return {Raven}
	   */
	  uninstall: function() {
	    tracekit.report.uninstall();

	    this._detachPromiseRejectionHandler();
	    this._unpatchFunctionToString();
	    this._restoreBuiltIns();
	    this._restoreConsole();

	    Error.stackTraceLimit = this._originalErrorStackTraceLimit;
	    this._isRavenInstalled = false;

	    return this;
	  },

	  /**
	   * Callback used for `unhandledrejection` event
	   *
	   * @param {PromiseRejectionEvent} event An object containing
	   *   promise: the Promise that was rejected
	   *   reason: the value with which the Promise was rejected
	   * @return void
	   */
	  _promiseRejectionHandler: function(event) {
	    this._logDebug('debug', 'Raven caught unhandled promise rejection:', event);
	    this.captureException(event.reason, {
	      mechanism: {
	        type: 'onunhandledrejection',
	        handled: false
	      }
	    });
	  },

	  /**
	   * Installs the global promise rejection handler.
	   *
	   * @return {raven}
	   */
	  _attachPromiseRejectionHandler: function() {
	    this._promiseRejectionHandler = this._promiseRejectionHandler.bind(this);
	    _window$2.addEventListener &&
	      _window$2.addEventListener('unhandledrejection', this._promiseRejectionHandler);
	    return this;
	  },

	  /**
	   * Uninstalls the global promise rejection handler.
	   *
	   * @return {raven}
	   */
	  _detachPromiseRejectionHandler: function() {
	    _window$2.removeEventListener &&
	      _window$2.removeEventListener('unhandledrejection', this._promiseRejectionHandler);
	    return this;
	  },

	  /**
	   * Manually capture an exception and send it over to Sentry
	   *
	   * @param {error} ex An exception to be logged
	   * @param {object} options A specific set of options for this error [optional]
	   * @return {Raven}
	   */
	  captureException: function(ex, options) {
	    options = objectMerge$1({trimHeadFrames: 0}, options ? options : {});

	    if (isErrorEvent$1(ex) && ex.error) {
	      // If it is an ErrorEvent with `error` property, extract it to get actual Error
	      ex = ex.error;
	    } else if (isDOMError$1(ex) || isDOMException$1(ex)) {
	      // If it is a DOMError or DOMException (which are legacy APIs, but still supported in some browsers)
	      // then we just extract the name and message, as they don't provide anything else
	      // https://developer.mozilla.org/en-US/docs/Web/API/DOMError
	      // https://developer.mozilla.org/en-US/docs/Web/API/DOMException
	      var name = ex.name || (isDOMError$1(ex) ? 'DOMError' : 'DOMException');
	      var message = ex.message ? name + ': ' + ex.message : name;

	      return this.captureMessage(
	        message,
	        objectMerge$1(options, {
	          // neither DOMError or DOMException provide stack trace and we most likely wont get it this way as well
	          // but it's barely any overhead so we may at least try
	          stacktrace: true,
	          trimHeadFrames: options.trimHeadFrames + 1
	        })
	      );
	    } else if (isError$1(ex)) {
	      // we have a real Error object
	      ex = ex;
	    } else if (isPlainObject$1(ex)) {
	      // If it is plain Object, serialize it manually and extract options
	      // This will allow us to group events based on top-level keys
	      // which is much better than creating new group when any key/value change
	      options = this._getCaptureExceptionOptionsFromPlainObject(options, ex);
	      ex = new Error(options.message);
	    } else {
	      // If none of previous checks were valid, then it means that
	      // it's not a DOMError/DOMException
	      // it's not a plain Object
	      // it's not a valid ErrorEvent (one with an error property)
	      // it's not an Error
	      // So bail out and capture it as a simple message:
	      return this.captureMessage(
	        ex,
	        objectMerge$1(options, {
	          stacktrace: true, // if we fall back to captureMessage, default to attempting a new trace
	          trimHeadFrames: options.trimHeadFrames + 1
	        })
	      );
	    }

	    // Store the raw exception object for potential debugging and introspection
	    this._lastCapturedException = ex;

	    // TraceKit.report will re-raise any exception passed to it,
	    // which means you have to wrap it in try/catch. Instead, we
	    // can wrap it here and only re-raise if TraceKit.report
	    // raises an exception different from the one we asked to
	    // report on.
	    try {
	      var stack = tracekit.computeStackTrace(ex);
	      this._handleStackInfo(stack, options);
	    } catch (ex1) {
	      if (ex !== ex1) {
	        throw ex1;
	      }
	    }

	    return this;
	  },

	  _getCaptureExceptionOptionsFromPlainObject: function(currentOptions, ex) {
	    var exKeys = Object.keys(ex).sort();
	    var options = objectMerge$1(currentOptions, {
	      message:
	        'Non-Error exception captured with keys: ' + serializeKeysForMessage$1(exKeys),
	      fingerprint: [md5_1(exKeys)],
	      extra: currentOptions.extra || {}
	    });
	    options.extra.__serialized__ = serializeException$1(ex);

	    return options;
	  },

	  /*
	     * Manually send a message to Sentry
	     *
	     * @param {string} msg A plain message to be captured in Sentry
	     * @param {object} options A specific set of options for this message [optional]
	     * @return {Raven}
	     */
	  captureMessage: function(msg, options) {
	    // config() automagically converts ignoreErrors from a list to a RegExp so we need to test for an
	    // early call; we'll error on the side of logging anything called before configuration since it's
	    // probably something you should see:
	    if (
	      !!this._globalOptions.ignoreErrors.test &&
	      this._globalOptions.ignoreErrors.test(msg)
	    ) {
	      return;
	    }

	    options = options || {};
	    msg = msg + ''; // Make sure it's actually a string

	    var data = objectMerge$1(
	      {
	        message: msg
	      },
	      options
	    );

	    var ex;
	    // Generate a "synthetic" stack trace from this point.
	    // NOTE: If you are a Sentry user, and you are seeing this stack frame, it is NOT indicative
	    //       of a bug with Raven.js. Sentry generates synthetic traces either by configuration,
	    //       or if it catches a thrown object without a "stack" property.
	    try {
	      throw new Error(msg);
	    } catch (ex1) {
	      ex = ex1;
	    }

	    // null exception name so `Error` isn't prefixed to msg
	    ex.name = null;
	    var stack = tracekit.computeStackTrace(ex);

	    // stack[0] is `throw new Error(msg)` call itself, we are interested in the frame that was just before that, stack[1]
	    var initialCall = isArray$1(stack.stack) && stack.stack[1];

	    // if stack[1] is `Raven.captureException`, it means that someone passed a string to it and we redirected that call
	    // to be handled by `captureMessage`, thus `initialCall` is the 3rd one, not 2nd
	    // initialCall => captureException(string) => captureMessage(string)
	    if (initialCall && initialCall.func === 'Raven.captureException') {
	      initialCall = stack.stack[2];
	    }

	    var fileurl = (initialCall && initialCall.url) || '';

	    if (
	      !!this._globalOptions.ignoreUrls.test &&
	      this._globalOptions.ignoreUrls.test(fileurl)
	    ) {
	      return;
	    }

	    if (
	      !!this._globalOptions.whitelistUrls.test &&
	      !this._globalOptions.whitelistUrls.test(fileurl)
	    ) {
	      return;
	    }

	    // Always attempt to get stacktrace if message is empty.
	    // It's the only way to provide any helpful information to the user.
	    if (this._globalOptions.stacktrace || options.stacktrace || data.message === '') {
	      // fingerprint on msg, not stack trace (legacy behavior, could be revisited)
	      data.fingerprint = data.fingerprint == null ? msg : data.fingerprint;

	      options = objectMerge$1(
	        {
	          trimHeadFrames: 0
	        },
	        options
	      );
	      // Since we know this is a synthetic trace, the top frame (this function call)
	      // MUST be from Raven.js, so mark it for trimming
	      // We add to the trim counter so that callers can choose to trim extra frames, such
	      // as utility functions.
	      options.trimHeadFrames += 1;

	      var frames = this._prepareFrames(stack, options);
	      data.stacktrace = {
	        // Sentry expects frames oldest to newest
	        frames: frames.reverse()
	      };
	    }

	    // Make sure that fingerprint is always wrapped in an array
	    if (data.fingerprint) {
	      data.fingerprint = isArray$1(data.fingerprint)
	        ? data.fingerprint
	        : [data.fingerprint];
	    }

	    // Fire away!
	    this._send(data);

	    return this;
	  },

	  captureBreadcrumb: function(obj) {
	    var crumb = objectMerge$1(
	      {
	        timestamp: now() / 1000
	      },
	      obj
	    );

	    if (isFunction$1(this._globalOptions.breadcrumbCallback)) {
	      var result = this._globalOptions.breadcrumbCallback(crumb);

	      if (isObject$1(result) && !isEmptyObject$1(result)) {
	        crumb = result;
	      } else if (result === false) {
	        return this;
	      }
	    }

	    this._breadcrumbs.push(crumb);
	    if (this._breadcrumbs.length > this._globalOptions.maxBreadcrumbs) {
	      this._breadcrumbs.shift();
	    }
	    return this;
	  },

	  addPlugin: function(plugin /*arg1, arg2, ... argN*/) {
	    var pluginArgs = [].slice.call(arguments, 1);

	    this._plugins.push([plugin, pluginArgs]);
	    if (this._isRavenInstalled) {
	      this._drainPlugins();
	    }

	    return this;
	  },

	  /*
	     * Set/clear a user to be sent along with the payload.
	     *
	     * @param {object} user An object representing user data [optional]
	     * @return {Raven}
	     */
	  setUserContext: function(user) {
	    // Intentionally do not merge here since that's an unexpected behavior.
	    this._globalContext.user = user;

	    return this;
	  },

	  /*
	     * Merge extra attributes to be sent along with the payload.
	     *
	     * @param {object} extra An object representing extra data [optional]
	     * @return {Raven}
	     */
	  setExtraContext: function(extra) {
	    this._mergeContext('extra', extra);

	    return this;
	  },

	  /*
	     * Merge tags to be sent along with the payload.
	     *
	     * @param {object} tags An object representing tags [optional]
	     * @return {Raven}
	     */
	  setTagsContext: function(tags) {
	    this._mergeContext('tags', tags);

	    return this;
	  },

	  /*
	     * Clear all of the context.
	     *
	     * @return {Raven}
	     */
	  clearContext: function() {
	    this._globalContext = {};

	    return this;
	  },

	  /*
	     * Get a copy of the current context. This cannot be mutated.
	     *
	     * @return {object} copy of context
	     */
	  getContext: function() {
	    // lol javascript
	    return JSON.parse(stringify_1(this._globalContext));
	  },

	  /*
	     * Set environment of application
	     *
	     * @param {string} environment Typically something like 'production'.
	     * @return {Raven}
	     */
	  setEnvironment: function(environment) {
	    this._globalOptions.environment = environment;

	    return this;
	  },

	  /*
	     * Set release version of application
	     *
	     * @param {string} release Typically something like a git SHA to identify version
	     * @return {Raven}
	     */
	  setRelease: function(release) {
	    this._globalOptions.release = release;

	    return this;
	  },

	  /*
	     * Set the dataCallback option
	     *
	     * @param {function} callback The callback to run which allows the
	     *                            data blob to be mutated before sending
	     * @return {Raven}
	     */
	  setDataCallback: function(callback) {
	    var original = this._globalOptions.dataCallback;
	    this._globalOptions.dataCallback = keepOriginalCallback(original, callback);
	    return this;
	  },

	  /*
	     * Set the breadcrumbCallback option
	     *
	     * @param {function} callback The callback to run which allows filtering
	     *                            or mutating breadcrumbs
	     * @return {Raven}
	     */
	  setBreadcrumbCallback: function(callback) {
	    var original = this._globalOptions.breadcrumbCallback;
	    this._globalOptions.breadcrumbCallback = keepOriginalCallback(original, callback);
	    return this;
	  },

	  /*
	     * Set the shouldSendCallback option
	     *
	     * @param {function} callback The callback to run which allows
	     *                            introspecting the blob before sending
	     * @return {Raven}
	     */
	  setShouldSendCallback: function(callback) {
	    var original = this._globalOptions.shouldSendCallback;
	    this._globalOptions.shouldSendCallback = keepOriginalCallback(original, callback);
	    return this;
	  },

	  /**
	   * Override the default HTTP transport mechanism that transmits data
	   * to the Sentry server.
	   *
	   * @param {function} transport Function invoked instead of the default
	   *                             `makeRequest` handler.
	   *
	   * @return {Raven}
	   */
	  setTransport: function(transport) {
	    this._globalOptions.transport = transport;

	    return this;
	  },

	  /*
	     * Get the latest raw exception that was captured by Raven.
	     *
	     * @return {error}
	     */
	  lastException: function() {
	    return this._lastCapturedException;
	  },

	  /*
	     * Get the last event id
	     *
	     * @return {string}
	     */
	  lastEventId: function() {
	    return this._lastEventId;
	  },

	  /*
	     * Determine if Raven is setup and ready to go.
	     *
	     * @return {boolean}
	     */
	  isSetup: function() {
	    if (!this._hasJSON) return false; // needs JSON support
	    if (!this._globalServer) {
	      if (!this.ravenNotConfiguredError) {
	        this.ravenNotConfiguredError = true;
	        this._logDebug('error', 'Error: Raven has not been configured.');
	      }
	      return false;
	    }
	    return true;
	  },

	  afterLoad: function() {
	    // TODO: remove window dependence?

	    // Attempt to initialize Raven on load
	    var RavenConfig = _window$2.RavenConfig;
	    if (RavenConfig) {
	      this.config(RavenConfig.dsn, RavenConfig.config).install();
	    }
	  },

	  showReportDialog: function(options) {
	    if (
	      !_document // doesn't work without a document (React native)
	    )
	      return;

	    options = objectMerge$1(
	      {
	        eventId: this.lastEventId(),
	        dsn: this._dsn,
	        user: this._globalContext.user || {}
	      },
	      options
	    );

	    if (!options.eventId) {
	      throw new configError('Missing eventId');
	    }

	    if (!options.dsn) {
	      throw new configError('Missing DSN');
	    }

	    var encode = encodeURIComponent;
	    var encodedOptions = [];

	    for (var key in options) {
	      if (key === 'user') {
	        var user = options.user;
	        if (user.name) encodedOptions.push('name=' + encode(user.name));
	        if (user.email) encodedOptions.push('email=' + encode(user.email));
	      } else {
	        encodedOptions.push(encode(key) + '=' + encode(options[key]));
	      }
	    }
	    var globalServer = this._getGlobalServer(this._parseDSN(options.dsn));

	    var script = _document.createElement('script');
	    script.async = true;
	    script.src = globalServer + '/api/embed/error-page/?' + encodedOptions.join('&');
	    (_document.head || _document.body).appendChild(script);
	  },

	  /**** Private functions ****/
	  _ignoreNextOnError: function() {
	    var self = this;
	    this._ignoreOnError += 1;
	    setTimeout(function() {
	      // onerror should trigger before setTimeout
	      self._ignoreOnError -= 1;
	    });
	  },

	  _triggerEvent: function(eventType, options) {
	    // NOTE: `event` is a native browser thing, so let's avoid conflicting wiht it
	    var evt, key;

	    if (!this._hasDocument) return;

	    options = options || {};

	    eventType = 'raven' + eventType.substr(0, 1).toUpperCase() + eventType.substr(1);

	    if (_document.createEvent) {
	      evt = _document.createEvent('HTMLEvents');
	      evt.initEvent(eventType, true, true);
	    } else {
	      evt = _document.createEventObject();
	      evt.eventType = eventType;
	    }

	    for (key in options)
	      if (hasKey$1(options, key)) {
	        evt[key] = options[key];
	      }

	    if (_document.createEvent) {
	      // IE9 if standards
	      _document.dispatchEvent(evt);
	    } else {
	      // IE8 regardless of Quirks or Standards
	      // IE9 if quirks
	      try {
	        _document.fireEvent('on' + evt.eventType.toLowerCase(), evt);
	      } catch (e) {
	        // Do nothing
	      }
	    }
	  },

	  /**
	   * Wraps addEventListener to capture UI breadcrumbs
	   * @param evtName the event name (e.g. "click")
	   * @returns {Function}
	   * @private
	   */
	  _breadcrumbEventHandler: function(evtName) {
	    var self = this;
	    return function(evt) {
	      // reset keypress timeout; e.g. triggering a 'click' after
	      // a 'keypress' will reset the keypress debounce so that a new
	      // set of keypresses can be recorded
	      self._keypressTimeout = null;

	      // It's possible this handler might trigger multiple times for the same
	      // event (e.g. event propagation through node ancestors). Ignore if we've
	      // already captured the event.
	      if (self._lastCapturedEvent === evt) return;

	      self._lastCapturedEvent = evt;

	      // try/catch both:
	      // - accessing evt.target (see getsentry/raven-js#838, #768)
	      // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
	      //   can throw an exception in some circumstances.
	      var target;
	      try {
	        target = htmlTreeAsString$1(evt.target);
	      } catch (e) {
	        target = '<unknown>';
	      }

	      self.captureBreadcrumb({
	        category: 'ui.' + evtName, // e.g. ui.click, ui.input
	        message: target
	      });
	    };
	  },

	  /**
	   * Wraps addEventListener to capture keypress UI events
	   * @returns {Function}
	   * @private
	   */
	  _keypressEventHandler: function() {
	    var self = this,
	      debounceDuration = 1000; // milliseconds

	    // TODO: if somehow user switches keypress target before
	    //       debounce timeout is triggered, we will only capture
	    //       a single breadcrumb from the FIRST target (acceptable?)
	    return function(evt) {
	      var target;
	      try {
	        target = evt.target;
	      } catch (e) {
	        // just accessing event properties can throw an exception in some rare circumstances
	        // see: https://github.com/getsentry/raven-js/issues/838
	        return;
	      }
	      var tagName = target && target.tagName;

	      // only consider keypress events on actual input elements
	      // this will disregard keypresses targeting body (e.g. tabbing
	      // through elements, hotkeys, etc)
	      if (
	        !tagName ||
	        (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && !target.isContentEditable)
	      )
	        return;

	      // record first keypress in a series, but ignore subsequent
	      // keypresses until debounce clears
	      var timeout = self._keypressTimeout;
	      if (!timeout) {
	        self._breadcrumbEventHandler('input')(evt);
	      }
	      clearTimeout(timeout);
	      self._keypressTimeout = setTimeout(function() {
	        self._keypressTimeout = null;
	      }, debounceDuration);
	    };
	  },

	  /**
	   * Captures a breadcrumb of type "navigation", normalizing input URLs
	   * @param to the originating URL
	   * @param from the target URL
	   * @private
	   */
	  _captureUrlChange: function(from, to) {
	    var parsedLoc = parseUrl$1(this._location.href);
	    var parsedTo = parseUrl$1(to);
	    var parsedFrom = parseUrl$1(from);

	    // because onpopstate only tells you the "new" (to) value of location.href, and
	    // not the previous (from) value, we need to track the value of the current URL
	    // state ourselves
	    this._lastHref = to;

	    // Use only the path component of the URL if the URL matches the current
	    // document (almost all the time when using pushState)
	    if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host)
	      to = parsedTo.relative;
	    if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host)
	      from = parsedFrom.relative;

	    this.captureBreadcrumb({
	      category: 'navigation',
	      data: {
	        to: to,
	        from: from
	      }
	    });
	  },

	  _patchFunctionToString: function() {
	    var self = this;
	    self._originalFunctionToString = Function.prototype.toString;
	    // eslint-disable-next-line no-extend-native
	    Function.prototype.toString = function() {
	      if (typeof this === 'function' && this.__raven__) {
	        return self._originalFunctionToString.apply(this.__orig__, arguments);
	      }
	      return self._originalFunctionToString.apply(this, arguments);
	    };
	  },

	  _unpatchFunctionToString: function() {
	    if (this._originalFunctionToString) {
	      // eslint-disable-next-line no-extend-native
	      Function.prototype.toString = this._originalFunctionToString;
	    }
	  },

	  /**
	   * Wrap timer functions and event targets to catch errors and provide
	   * better metadata.
	   */
	  _instrumentTryCatch: function() {
	    var self = this;

	    var wrappedBuiltIns = self._wrappedBuiltIns;

	    function wrapTimeFn(orig) {
	      return function(fn, t) {
	        // preserve arity
	        // Make a copy of the arguments to prevent deoptimization
	        // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	        var args = new Array(arguments.length);
	        for (var i = 0; i < args.length; ++i) {
	          args[i] = arguments[i];
	        }
	        var originalCallback = args[0];
	        if (isFunction$1(originalCallback)) {
	          args[0] = self.wrap(
	            {
	              mechanism: {
	                type: 'instrument',
	                data: {function: orig.name || '<anonymous>'}
	              }
	            },
	            originalCallback
	          );
	        }

	        // IE < 9 doesn't support .call/.apply on setInterval/setTimeout, but it
	        // also supports only two arguments and doesn't care what this is, so we
	        // can just call the original function directly.
	        if (orig.apply) {
	          return orig.apply(this, args);
	        } else {
	          return orig(args[0], args[1]);
	        }
	      };
	    }

	    var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;

	    function wrapEventTarget(global) {
	      var proto = _window$2[global] && _window$2[global].prototype;
	      if (proto && proto.hasOwnProperty && proto.hasOwnProperty('addEventListener')) {
	        fill$1(
	          proto,
	          'addEventListener',
	          function(orig) {
	            return function(evtName, fn, capture, secure) {
	              // preserve arity
	              try {
	                if (fn && fn.handleEvent) {
	                  fn.handleEvent = self.wrap(
	                    {
	                      mechanism: {
	                        type: 'instrument',
	                        data: {
	                          target: global,
	                          function: 'handleEvent',
	                          handler: (fn && fn.name) || '<anonymous>'
	                        }
	                      }
	                    },
	                    fn.handleEvent
	                  );
	                }
	              } catch (err) {
	                // can sometimes get 'Permission denied to access property "handle Event'
	              }

	              // More breadcrumb DOM capture ... done here and not in `_instrumentBreadcrumbs`
	              // so that we don't have more than one wrapper function
	              var before, clickHandler, keypressHandler;

	              if (
	                autoBreadcrumbs &&
	                autoBreadcrumbs.dom &&
	                (global === 'EventTarget' || global === 'Node')
	              ) {
	                // NOTE: generating multiple handlers per addEventListener invocation, should
	                //       revisit and verify we can just use one (almost certainly)
	                clickHandler = self._breadcrumbEventHandler('click');
	                keypressHandler = self._keypressEventHandler();
	                before = function(evt) {
	                  // need to intercept every DOM event in `before` argument, in case that
	                  // same wrapped method is re-used for different events (e.g. mousemove THEN click)
	                  // see #724
	                  if (!evt) return;

	                  var eventType;
	                  try {
	                    eventType = evt.type;
	                  } catch (e) {
	                    // just accessing event properties can throw an exception in some rare circumstances
	                    // see: https://github.com/getsentry/raven-js/issues/838
	                    return;
	                  }
	                  if (eventType === 'click') return clickHandler(evt);
	                  else if (eventType === 'keypress') return keypressHandler(evt);
	                };
	              }
	              return orig.call(
	                this,
	                evtName,
	                self.wrap(
	                  {
	                    mechanism: {
	                      type: 'instrument',
	                      data: {
	                        target: global,
	                        function: 'addEventListener',
	                        handler: (fn && fn.name) || '<anonymous>'
	                      }
	                    }
	                  },
	                  fn,
	                  before
	                ),
	                capture,
	                secure
	              );
	            };
	          },
	          wrappedBuiltIns
	        );
	        fill$1(
	          proto,
	          'removeEventListener',
	          function(orig) {
	            return function(evt, fn, capture, secure) {
	              try {
	                fn = fn && (fn.__raven_wrapper__ ? fn.__raven_wrapper__ : fn);
	              } catch (e) {
	                // ignore, accessing __raven_wrapper__ will throw in some Selenium environments
	              }
	              return orig.call(this, evt, fn, capture, secure);
	            };
	          },
	          wrappedBuiltIns
	        );
	      }
	    }

	    fill$1(_window$2, 'setTimeout', wrapTimeFn, wrappedBuiltIns);
	    fill$1(_window$2, 'setInterval', wrapTimeFn, wrappedBuiltIns);
	    if (_window$2.requestAnimationFrame) {
	      fill$1(
	        _window$2,
	        'requestAnimationFrame',
	        function(orig) {
	          return function(cb) {
	            return orig(
	              self.wrap(
	                {
	                  mechanism: {
	                    type: 'instrument',
	                    data: {
	                      function: 'requestAnimationFrame',
	                      handler: (orig && orig.name) || '<anonymous>'
	                    }
	                  }
	                },
	                cb
	              )
	            );
	          };
	        },
	        wrappedBuiltIns
	      );
	    }

	    // event targets borrowed from bugsnag-js:
	    // https://github.com/bugsnag/bugsnag-js/blob/master/src/bugsnag.js#L666
	    var eventTargets = [
	      'EventTarget',
	      'Window',
	      'Node',
	      'ApplicationCache',
	      'AudioTrackList',
	      'ChannelMergerNode',
	      'CryptoOperation',
	      'EventSource',
	      'FileReader',
	      'HTMLUnknownElement',
	      'IDBDatabase',
	      'IDBRequest',
	      'IDBTransaction',
	      'KeyOperation',
	      'MediaController',
	      'MessagePort',
	      'ModalWindow',
	      'Notification',
	      'SVGElementInstance',
	      'Screen',
	      'TextTrack',
	      'TextTrackCue',
	      'TextTrackList',
	      'WebSocket',
	      'WebSocketWorker',
	      'Worker',
	      'XMLHttpRequest',
	      'XMLHttpRequestEventTarget',
	      'XMLHttpRequestUpload'
	    ];
	    for (var i = 0; i < eventTargets.length; i++) {
	      wrapEventTarget(eventTargets[i]);
	    }
	  },

	  /**
	   * Instrument browser built-ins w/ breadcrumb capturing
	   *  - XMLHttpRequests
	   *  - DOM interactions (click/typing)
	   *  - window.location changes
	   *  - console
	   *
	   * Can be disabled or individually configured via the `autoBreadcrumbs` config option
	   */
	  _instrumentBreadcrumbs: function() {
	    var self = this;
	    var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;

	    var wrappedBuiltIns = self._wrappedBuiltIns;

	    function wrapProp(prop, xhr) {
	      if (prop in xhr && isFunction$1(xhr[prop])) {
	        fill$1(xhr, prop, function(orig) {
	          return self.wrap(
	            {
	              mechanism: {
	                type: 'instrument',
	                data: {function: prop, handler: (orig && orig.name) || '<anonymous>'}
	              }
	            },
	            orig
	          );
	        }); // intentionally don't track filled methods on XHR instances
	      }
	    }

	    if (autoBreadcrumbs.xhr && 'XMLHttpRequest' in _window$2) {
	      var xhrproto = _window$2.XMLHttpRequest && _window$2.XMLHttpRequest.prototype;
	      fill$1(
	        xhrproto,
	        'open',
	        function(origOpen) {
	          return function(method, url) {
	            // preserve arity

	            // if Sentry key appears in URL, don't capture
	            if (isString$1(url) && url.indexOf(self._globalKey) === -1) {
	              this.__raven_xhr = {
	                method: method,
	                url: url,
	                status_code: null
	              };
	            }

	            return origOpen.apply(this, arguments);
	          };
	        },
	        wrappedBuiltIns
	      );

	      fill$1(
	        xhrproto,
	        'send',
	        function(origSend) {
	          return function() {
	            // preserve arity
	            var xhr = this;

	            function onreadystatechangeHandler() {
	              if (xhr.__raven_xhr && xhr.readyState === 4) {
	                try {
	                  // touching statusCode in some platforms throws
	                  // an exception
	                  xhr.__raven_xhr.status_code = xhr.status;
	                } catch (e) {
	                  /* do nothing */
	                }

	                self.captureBreadcrumb({
	                  type: 'http',
	                  category: 'xhr',
	                  data: xhr.__raven_xhr
	                });
	              }
	            }

	            var props = ['onload', 'onerror', 'onprogress'];
	            for (var j = 0; j < props.length; j++) {
	              wrapProp(props[j], xhr);
	            }

	            if ('onreadystatechange' in xhr && isFunction$1(xhr.onreadystatechange)) {
	              fill$1(
	                xhr,
	                'onreadystatechange',
	                function(orig) {
	                  return self.wrap(
	                    {
	                      mechanism: {
	                        type: 'instrument',
	                        data: {
	                          function: 'onreadystatechange',
	                          handler: (orig && orig.name) || '<anonymous>'
	                        }
	                      }
	                    },
	                    orig,
	                    onreadystatechangeHandler
	                  );
	                } /* intentionally don't track this instrumentation */
	              );
	            } else {
	              // if onreadystatechange wasn't actually set by the page on this xhr, we
	              // are free to set our own and capture the breadcrumb
	              xhr.onreadystatechange = onreadystatechangeHandler;
	            }

	            return origSend.apply(this, arguments);
	          };
	        },
	        wrappedBuiltIns
	      );
	    }

	    if (autoBreadcrumbs.xhr && supportsFetch$1()) {
	      fill$1(
	        _window$2,
	        'fetch',
	        function(origFetch) {
	          return function() {
	            // preserve arity
	            // Make a copy of the arguments to prevent deoptimization
	            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	            var args = new Array(arguments.length);
	            for (var i = 0; i < args.length; ++i) {
	              args[i] = arguments[i];
	            }

	            var fetchInput = args[0];
	            var method = 'GET';
	            var url;

	            if (typeof fetchInput === 'string') {
	              url = fetchInput;
	            } else if ('Request' in _window$2 && fetchInput instanceof _window$2.Request) {
	              url = fetchInput.url;
	              if (fetchInput.method) {
	                method = fetchInput.method;
	              }
	            } else {
	              url = '' + fetchInput;
	            }

	            // if Sentry key appears in URL, don't capture, as it's our own request
	            if (url.indexOf(self._globalKey) !== -1) {
	              return origFetch.apply(this, args);
	            }

	            if (args[1] && args[1].method) {
	              method = args[1].method;
	            }

	            var fetchData = {
	              method: method,
	              url: url,
	              status_code: null
	            };

	            return origFetch
	              .apply(this, args)
	              .then(function(response) {
	                fetchData.status_code = response.status;

	                self.captureBreadcrumb({
	                  type: 'http',
	                  category: 'fetch',
	                  data: fetchData
	                });

	                return response;
	              })
	              ['catch'](function(err) {
	                // if there is an error performing the request
	                self.captureBreadcrumb({
	                  type: 'http',
	                  category: 'fetch',
	                  data: fetchData,
	                  level: 'error'
	                });

	                throw err;
	              });
	          };
	        },
	        wrappedBuiltIns
	      );
	    }

	    // Capture breadcrumbs from any click that is unhandled / bubbled up all the way
	    // to the document. Do this before we instrument addEventListener.
	    if (autoBreadcrumbs.dom && this._hasDocument) {
	      if (_document.addEventListener) {
	        _document.addEventListener('click', self._breadcrumbEventHandler('click'), false);
	        _document.addEventListener('keypress', self._keypressEventHandler(), false);
	      } else if (_document.attachEvent) {
	        // IE8 Compatibility
	        _document.attachEvent('onclick', self._breadcrumbEventHandler('click'));
	        _document.attachEvent('onkeypress', self._keypressEventHandler());
	      }
	    }

	    // record navigation (URL) changes
	    // NOTE: in Chrome App environment, touching history.pushState, *even inside
	    //       a try/catch block*, will cause Chrome to output an error to console.error
	    // borrowed from: https://github.com/angular/angular.js/pull/13945/files
	    var chrome = _window$2.chrome;
	    var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
	    var hasPushAndReplaceState =
	      !isChromePackagedApp &&
	      _window$2.history &&
	      _window$2.history.pushState &&
	      _window$2.history.replaceState;
	    if (autoBreadcrumbs.location && hasPushAndReplaceState) {
	      // TODO: remove onpopstate handler on uninstall()
	      var oldOnPopState = _window$2.onpopstate;
	      _window$2.onpopstate = function() {
	        var currentHref = self._location.href;
	        self._captureUrlChange(self._lastHref, currentHref);

	        if (oldOnPopState) {
	          return oldOnPopState.apply(this, arguments);
	        }
	      };

	      var historyReplacementFunction = function(origHistFunction) {
	        // note history.pushState.length is 0; intentionally not declaring
	        // params to preserve 0 arity
	        return function(/* state, title, url */) {
	          var url = arguments.length > 2 ? arguments[2] : undefined;

	          // url argument is optional
	          if (url) {
	            // coerce to string (this is what pushState does)
	            self._captureUrlChange(self._lastHref, url + '');
	          }

	          return origHistFunction.apply(this, arguments);
	        };
	      };

	      fill$1(_window$2.history, 'pushState', historyReplacementFunction, wrappedBuiltIns);
	      fill$1(_window$2.history, 'replaceState', historyReplacementFunction, wrappedBuiltIns);
	    }

	    if (autoBreadcrumbs.console && 'console' in _window$2 && console.log) {
	      // console
	      var consoleMethodCallback = function(msg, data) {
	        self.captureBreadcrumb({
	          message: msg,
	          level: data.level,
	          category: 'console'
	        });
	      };

	      each$1(['debug', 'info', 'warn', 'error', 'log'], function(_, level) {
	        wrapConsoleMethod(console, level, consoleMethodCallback);
	      });
	    }
	  },

	  _restoreBuiltIns: function() {
	    // restore any wrapped builtins
	    var builtin;
	    while (this._wrappedBuiltIns.length) {
	      builtin = this._wrappedBuiltIns.shift();

	      var obj = builtin[0],
	        name = builtin[1],
	        orig = builtin[2];

	      obj[name] = orig;
	    }
	  },

	  _restoreConsole: function() {
	    // eslint-disable-next-line guard-for-in
	    for (var method in this._originalConsoleMethods) {
	      this._originalConsole[method] = this._originalConsoleMethods[method];
	    }
	  },

	  _drainPlugins: function() {
	    var self = this;

	    // FIX ME TODO
	    each$1(this._plugins, function(_, plugin) {
	      var installer = plugin[0];
	      var args = plugin[1];
	      installer.apply(self, [self].concat(args));
	    });
	  },

	  _parseDSN: function(str) {
	    var m = dsnPattern.exec(str),
	      dsn = {},
	      i = 7;

	    try {
	      while (i--) dsn[dsnKeys[i]] = m[i] || '';
	    } catch (e) {
	      throw new configError('Invalid DSN: ' + str);
	    }

	    if (dsn.pass && !this._globalOptions.allowSecretKey) {
	      throw new configError(
	        'Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key'
	      );
	    }

	    return dsn;
	  },

	  _getGlobalServer: function(uri) {
	    // assemble the endpoint from the uri pieces
	    var globalServer = '//' + uri.host + (uri.port ? ':' + uri.port : '');

	    if (uri.protocol) {
	      globalServer = uri.protocol + ':' + globalServer;
	    }
	    return globalServer;
	  },

	  _handleOnErrorStackInfo: function(stackInfo, options) {
	    options = options || {};
	    options.mechanism = options.mechanism || {
	      type: 'onerror',
	      handled: false
	    };

	    // if we are intentionally ignoring errors via onerror, bail out
	    if (!this._ignoreOnError) {
	      this._handleStackInfo(stackInfo, options);
	    }
	  },

	  _handleStackInfo: function(stackInfo, options) {
	    var frames = this._prepareFrames(stackInfo, options);

	    this._triggerEvent('handle', {
	      stackInfo: stackInfo,
	      options: options
	    });

	    this._processException(
	      stackInfo.name,
	      stackInfo.message,
	      stackInfo.url,
	      stackInfo.lineno,
	      frames,
	      options
	    );
	  },

	  _prepareFrames: function(stackInfo, options) {
	    var self = this;
	    var frames = [];
	    if (stackInfo.stack && stackInfo.stack.length) {
	      each$1(stackInfo.stack, function(i, stack) {
	        var frame = self._normalizeFrame(stack, stackInfo.url);
	        if (frame) {
	          frames.push(frame);
	        }
	      });

	      // e.g. frames captured via captureMessage throw
	      if (options && options.trimHeadFrames) {
	        for (var j = 0; j < options.trimHeadFrames && j < frames.length; j++) {
	          frames[j].in_app = false;
	        }
	      }
	    }
	    frames = frames.slice(0, this._globalOptions.stackTraceLimit);
	    return frames;
	  },

	  _normalizeFrame: function(frame, stackInfoUrl) {
	    // normalize the frames data
	    var normalized = {
	      filename: frame.url,
	      lineno: frame.line,
	      colno: frame.column,
	      function: frame.func || '?'
	    };

	    // Case when we don't have any information about the error
	    // E.g. throwing a string or raw object, instead of an `Error` in Firefox
	    // Generating synthetic error doesn't add any value here
	    //
	    // We should probably somehow let a user know that they should fix their code
	    if (!frame.url) {
	      normalized.filename = stackInfoUrl; // fallback to whole stacks url from onerror handler
	    }

	    normalized.in_app = !// determine if an exception came from outside of our app
	    // first we check the global includePaths list.
	    (
	      (!!this._globalOptions.includePaths.test &&
	        !this._globalOptions.includePaths.test(normalized.filename)) ||
	      // Now we check for fun, if the function name is Raven or TraceKit
	      /(Raven|TraceKit)\./.test(normalized['function']) ||
	      // finally, we do a last ditch effort and check for raven.min.js
	      /raven\.(min\.)?js$/.test(normalized.filename)
	    );

	    return normalized;
	  },

	  _processException: function(type, message, fileurl, lineno, frames, options) {
	    var prefixedMessage = (type ? type + ': ' : '') + (message || '');
	    if (
	      !!this._globalOptions.ignoreErrors.test &&
	      (this._globalOptions.ignoreErrors.test(message) ||
	        this._globalOptions.ignoreErrors.test(prefixedMessage))
	    ) {
	      return;
	    }

	    var stacktrace;

	    if (frames && frames.length) {
	      fileurl = frames[0].filename || fileurl;
	      // Sentry expects frames oldest to newest
	      // and JS sends them as newest to oldest
	      frames.reverse();
	      stacktrace = {frames: frames};
	    } else if (fileurl) {
	      stacktrace = {
	        frames: [
	          {
	            filename: fileurl,
	            lineno: lineno,
	            in_app: true
	          }
	        ]
	      };
	    }

	    if (
	      !!this._globalOptions.ignoreUrls.test &&
	      this._globalOptions.ignoreUrls.test(fileurl)
	    ) {
	      return;
	    }

	    if (
	      !!this._globalOptions.whitelistUrls.test &&
	      !this._globalOptions.whitelistUrls.test(fileurl)
	    ) {
	      return;
	    }

	    var data = objectMerge$1(
	      {
	        // sentry.interfaces.Exception
	        exception: {
	          values: [
	            {
	              type: type,
	              value: message,
	              stacktrace: stacktrace
	            }
	          ]
	        },
	        transaction: fileurl
	      },
	      options
	    );

	    var ex = data.exception.values[0];
	    if (ex.type == null && ex.value === '') {
	      ex.value = 'Unrecoverable error caught';
	    }

	    // Move mechanism from options to exception interface
	    // We do this, as requiring user to pass `{exception:{mechanism:{ ... }}}` would be
	    // too much
	    if (!data.exception.mechanism && data.mechanism) {
	      data.exception.mechanism = data.mechanism;
	      delete data.mechanism;
	    }

	    data.exception.mechanism = objectMerge$1(
	      {
	        type: 'generic',
	        handled: true
	      },
	      data.exception.mechanism || {}
	    );

	    // Fire away!
	    this._send(data);
	  },

	  _trimPacket: function(data) {
	    // For now, we only want to truncate the two different messages
	    // but this could/should be expanded to just trim everything
	    var max = this._globalOptions.maxMessageLength;
	    if (data.message) {
	      data.message = truncate$1(data.message, max);
	    }
	    if (data.exception) {
	      var exception = data.exception.values[0];
	      exception.value = truncate$1(exception.value, max);
	    }

	    var request = data.request;
	    if (request) {
	      if (request.url) {
	        request.url = truncate$1(request.url, this._globalOptions.maxUrlLength);
	      }
	      if (request.Referer) {
	        request.Referer = truncate$1(request.Referer, this._globalOptions.maxUrlLength);
	      }
	    }

	    if (data.breadcrumbs && data.breadcrumbs.values)
	      this._trimBreadcrumbs(data.breadcrumbs);

	    return data;
	  },

	  /**
	   * Truncate breadcrumb values (right now just URLs)
	   */
	  _trimBreadcrumbs: function(breadcrumbs) {
	    // known breadcrumb properties with urls
	    // TODO: also consider arbitrary prop values that start with (https?)?://
	    var urlProps = ['to', 'from', 'url'],
	      urlProp,
	      crumb,
	      data;

	    for (var i = 0; i < breadcrumbs.values.length; ++i) {
	      crumb = breadcrumbs.values[i];
	      if (
	        !crumb.hasOwnProperty('data') ||
	        !isObject$1(crumb.data) ||
	        objectFrozen$1(crumb.data)
	      )
	        continue;

	      data = objectMerge$1({}, crumb.data);
	      for (var j = 0; j < urlProps.length; ++j) {
	        urlProp = urlProps[j];
	        if (data.hasOwnProperty(urlProp) && data[urlProp]) {
	          data[urlProp] = truncate$1(data[urlProp], this._globalOptions.maxUrlLength);
	        }
	      }
	      breadcrumbs.values[i].data = data;
	    }
	  },

	  _getHttpData: function() {
	    if (!this._hasNavigator && !this._hasDocument) return;
	    var httpData = {};

	    if (this._hasNavigator && _navigator.userAgent) {
	      httpData.headers = {
	        'User-Agent': _navigator.userAgent
	      };
	    }

	    // Check in `window` instead of `document`, as we may be in ServiceWorker environment
	    if (_window$2.location && _window$2.location.href) {
	      httpData.url = _window$2.location.href;
	    }

	    if (this._hasDocument && _document.referrer) {
	      if (!httpData.headers) httpData.headers = {};
	      httpData.headers.Referer = _document.referrer;
	    }

	    return httpData;
	  },

	  _resetBackoff: function() {
	    this._backoffDuration = 0;
	    this._backoffStart = null;
	  },

	  _shouldBackoff: function() {
	    return this._backoffDuration && now() - this._backoffStart < this._backoffDuration;
	  },

	  /**
	   * Returns true if the in-process data payload matches the signature
	   * of the previously-sent data
	   *
	   * NOTE: This has to be done at this level because TraceKit can generate
	   *       data from window.onerror WITHOUT an exception object (IE8, IE9,
	   *       other old browsers). This can take the form of an "exception"
	   *       data object with a single frame (derived from the onerror args).
	   */
	  _isRepeatData: function(current) {
	    var last = this._lastData;

	    if (
	      !last ||
	      current.message !== last.message || // defined for captureMessage
	      current.transaction !== last.transaction // defined for captureException/onerror
	    )
	      return false;

	    // Stacktrace interface (i.e. from captureMessage)
	    if (current.stacktrace || last.stacktrace) {
	      return isSameStacktrace$1(current.stacktrace, last.stacktrace);
	    } else if (current.exception || last.exception) {
	      // Exception interface (i.e. from captureException/onerror)
	      return isSameException$1(current.exception, last.exception);
	    }

	    return true;
	  },

	  _setBackoffState: function(request) {
	    // If we are already in a backoff state, don't change anything
	    if (this._shouldBackoff()) {
	      return;
	    }

	    var status = request.status;

	    // 400 - project_id doesn't exist or some other fatal
	    // 401 - invalid/revoked dsn
	    // 429 - too many requests
	    if (!(status === 400 || status === 401 || status === 429)) return;

	    var retry;
	    try {
	      // If Retry-After is not in Access-Control-Expose-Headers, most
	      // browsers will throw an exception trying to access it
	      if (supportsFetch$1()) {
	        retry = request.headers.get('Retry-After');
	      } else {
	        retry = request.getResponseHeader('Retry-After');
	      }

	      // Retry-After is returned in seconds
	      retry = parseInt(retry, 10) * 1000;
	    } catch (e) {
	      /* eslint no-empty:0 */
	    }

	    this._backoffDuration = retry
	      ? // If Sentry server returned a Retry-After value, use it
	        retry
	      : // Otherwise, double the last backoff duration (starts at 1 sec)
	        this._backoffDuration * 2 || 1000;

	    this._backoffStart = now();
	  },

	  _send: function(data) {
	    var globalOptions = this._globalOptions;

	    var baseData = {
	        project: this._globalProject,
	        logger: globalOptions.logger,
	        platform: 'javascript'
	      },
	      httpData = this._getHttpData();

	    if (httpData) {
	      baseData.request = httpData;
	    }

	    // HACK: delete `trimHeadFrames` to prevent from appearing in outbound payload
	    if (data.trimHeadFrames) delete data.trimHeadFrames;

	    data = objectMerge$1(baseData, data);

	    // Merge in the tags and extra separately since objectMerge doesn't handle a deep merge
	    data.tags = objectMerge$1(objectMerge$1({}, this._globalContext.tags), data.tags);
	    data.extra = objectMerge$1(objectMerge$1({}, this._globalContext.extra), data.extra);

	    // Send along our own collected metadata with extra
	    data.extra['session:duration'] = now() - this._startTime;

	    if (this._breadcrumbs && this._breadcrumbs.length > 0) {
	      // intentionally make shallow copy so that additions
	      // to breadcrumbs aren't accidentally sent in this request
	      data.breadcrumbs = {
	        values: [].slice.call(this._breadcrumbs, 0)
	      };
	    }

	    if (this._globalContext.user) {
	      // sentry.interfaces.User
	      data.user = this._globalContext.user;
	    }

	    // Include the environment if it's defined in globalOptions
	    if (globalOptions.environment) data.environment = globalOptions.environment;

	    // Include the release if it's defined in globalOptions
	    if (globalOptions.release) data.release = globalOptions.release;

	    // Include server_name if it's defined in globalOptions
	    if (globalOptions.serverName) data.server_name = globalOptions.serverName;

	    data = this._sanitizeData(data);

	    // Cleanup empty properties before sending them to the server
	    Object.keys(data).forEach(function(key) {
	      if (data[key] == null || data[key] === '' || isEmptyObject$1(data[key])) {
	        delete data[key];
	      }
	    });

	    if (isFunction$1(globalOptions.dataCallback)) {
	      data = globalOptions.dataCallback(data) || data;
	    }

	    // Why??????????
	    if (!data || isEmptyObject$1(data)) {
	      return;
	    }

	    // Check if the request should be filtered or not
	    if (
	      isFunction$1(globalOptions.shouldSendCallback) &&
	      !globalOptions.shouldSendCallback(data)
	    ) {
	      return;
	    }

	    // Backoff state: Sentry server previously responded w/ an error (e.g. 429 - too many requests),
	    // so drop requests until "cool-off" period has elapsed.
	    if (this._shouldBackoff()) {
	      this._logDebug('warn', 'Raven dropped error due to backoff: ', data);
	      return;
	    }

	    if (typeof globalOptions.sampleRate === 'number') {
	      if (Math.random() < globalOptions.sampleRate) {
	        this._sendProcessedPayload(data);
	      }
	    } else {
	      this._sendProcessedPayload(data);
	    }
	  },

	  _sanitizeData: function(data) {
	    return sanitize$1(data, this._globalOptions.sanitizeKeys);
	  },

	  _getUuid: function() {
	    return uuid4$1();
	  },

	  _sendProcessedPayload: function(data, callback) {
	    var self = this;
	    var globalOptions = this._globalOptions;

	    if (!this.isSetup()) return;

	    // Try and clean up the packet before sending by truncating long values
	    data = this._trimPacket(data);

	    // ideally duplicate error testing should occur *before* dataCallback/shouldSendCallback,
	    // but this would require copying an un-truncated copy of the data packet, which can be
	    // arbitrarily deep (extra_data) -- could be worthwhile? will revisit
	    if (!this._globalOptions.allowDuplicates && this._isRepeatData(data)) {
	      this._logDebug('warn', 'Raven dropped repeat event: ', data);
	      return;
	    }

	    // Send along an event_id if not explicitly passed.
	    // This event_id can be used to reference the error within Sentry itself.
	    // Set lastEventId after we know the error should actually be sent
	    this._lastEventId = data.event_id || (data.event_id = this._getUuid());

	    // Store outbound payload after trim
	    this._lastData = data;

	    this._logDebug('debug', 'Raven about to send:', data);

	    var auth = {
	      sentry_version: '7',
	      sentry_client: 'raven-js/' + this.VERSION,
	      sentry_key: this._globalKey
	    };

	    if (this._globalSecret) {
	      auth.sentry_secret = this._globalSecret;
	    }

	    var exception = data.exception && data.exception.values[0];

	    // only capture 'sentry' breadcrumb is autoBreadcrumbs is truthy
	    if (
	      this._globalOptions.autoBreadcrumbs &&
	      this._globalOptions.autoBreadcrumbs.sentry
	    ) {
	      this.captureBreadcrumb({
	        category: 'sentry',
	        message: exception
	          ? (exception.type ? exception.type + ': ' : '') + exception.value
	          : data.message,
	        event_id: data.event_id,
	        level: data.level || 'error' // presume error unless specified
	      });
	    }

	    var url = this._globalEndpoint;
	    (globalOptions.transport || this._makeRequest).call(this, {
	      url: url,
	      auth: auth,
	      data: data,
	      options: globalOptions,
	      onSuccess: function success() {
	        self._resetBackoff();

	        self._triggerEvent('success', {
	          data: data,
	          src: url
	        });
	        callback && callback();
	      },
	      onError: function failure(error) {
	        self._logDebug('error', 'Raven transport failed to send: ', error);

	        if (error.request) {
	          self._setBackoffState(error.request);
	        }

	        self._triggerEvent('failure', {
	          data: data,
	          src: url
	        });
	        error = error || new Error('Raven send failed (no additional details provided)');
	        callback && callback(error);
	      }
	    });
	  },

	  _makeRequest: function(opts) {
	    // Auth is intentionally sent as part of query string (NOT as custom HTTP header) to avoid preflight CORS requests
	    var url = opts.url + '?' + urlencode$1(opts.auth);

	    var evaluatedHeaders = null;
	    var evaluatedFetchParameters = {};

	    if (opts.options.headers) {
	      evaluatedHeaders = this._evaluateHash(opts.options.headers);
	    }

	    if (opts.options.fetchParameters) {
	      evaluatedFetchParameters = this._evaluateHash(opts.options.fetchParameters);
	    }

	    if (supportsFetch$1()) {
	      evaluatedFetchParameters.body = stringify_1(opts.data);

	      var defaultFetchOptions = objectMerge$1({}, this._fetchDefaults);
	      var fetchOptions = objectMerge$1(defaultFetchOptions, evaluatedFetchParameters);

	      if (evaluatedHeaders) {
	        fetchOptions.headers = evaluatedHeaders;
	      }

	      return _window$2
	        .fetch(url, fetchOptions)
	        .then(function(response) {
	          if (response.ok) {
	            opts.onSuccess && opts.onSuccess();
	          } else {
	            var error = new Error('Sentry error code: ' + response.status);
	            // It's called request only to keep compatibility with XHR interface
	            // and not add more redundant checks in setBackoffState method
	            error.request = response;
	            opts.onError && opts.onError(error);
	          }
	        })
	        ['catch'](function() {
	          opts.onError &&
	            opts.onError(new Error('Sentry error code: network unavailable'));
	        });
	    }

	    var request = _window$2.XMLHttpRequest && new _window$2.XMLHttpRequest();
	    if (!request) return;

	    // if browser doesn't support CORS (e.g. IE7), we are out of luck
	    var hasCORS = 'withCredentials' in request || typeof XDomainRequest !== 'undefined';

	    if (!hasCORS) return;

	    if ('withCredentials' in request) {
	      request.onreadystatechange = function() {
	        if (request.readyState !== 4) {
	          return;
	        } else if (request.status === 200) {
	          opts.onSuccess && opts.onSuccess();
	        } else if (opts.onError) {
	          var err = new Error('Sentry error code: ' + request.status);
	          err.request = request;
	          opts.onError(err);
	        }
	      };
	    } else {
	      request = new XDomainRequest();
	      // xdomainrequest cannot go http -> https (or vice versa),
	      // so always use protocol relative
	      url = url.replace(/^https?:/, '');

	      // onreadystatechange not supported by XDomainRequest
	      if (opts.onSuccess) {
	        request.onload = opts.onSuccess;
	      }
	      if (opts.onError) {
	        request.onerror = function() {
	          var err = new Error('Sentry error code: XDomainRequest');
	          err.request = request;
	          opts.onError(err);
	        };
	      }
	    }

	    request.open('POST', url);

	    if (evaluatedHeaders) {
	      each$1(evaluatedHeaders, function(key, value) {
	        request.setRequestHeader(key, value);
	      });
	    }

	    request.send(stringify_1(opts.data));
	  },

	  _evaluateHash: function(hash) {
	    var evaluated = {};

	    for (var key in hash) {
	      if (hash.hasOwnProperty(key)) {
	        var value = hash[key];
	        evaluated[key] = typeof value === 'function' ? value() : value;
	      }
	    }

	    return evaluated;
	  },

	  _logDebug: function(level) {
	    // We allow `Raven.debug` and `Raven.config(DSN, { debug: true })` to not make backward incompatible API change
	    if (
	      this._originalConsoleMethods[level] &&
	      (this.debug || this._globalOptions.debug)
	    ) {
	      // In IE<10 console methods do not have their own 'apply' method
	      Function.prototype.apply.call(
	        this._originalConsoleMethods[level],
	        this._originalConsole,
	        [].slice.call(arguments, 1)
	      );
	    }
	  },

	  _mergeContext: function(key, context) {
	    if (isUndefined$1(context)) {
	      delete this._globalContext[key];
	    } else {
	      this._globalContext[key] = objectMerge$1(this._globalContext[key] || {}, context);
	    }
	  }
	};

	// Deprecations
	Raven.prototype.setUser = Raven.prototype.setUserContext;
	Raven.prototype.setReleaseContext = Raven.prototype.setRelease;

	var raven = Raven;

	/**
	 * Enforces a single instance of the Raven client, and the
	 * main entry point for Raven. If you are a consumer of the
	 * Raven library, you SHOULD load this file (vs raven.js).
	 **/



	// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
	var _window$3 =
	  typeof window !== 'undefined'
	    ? window
	    : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};
	var _Raven = _window$3.Raven;

	var Raven$1 = new raven();

	/*
	 * Allow multiple versions of Raven to be installed.
	 * Strip Raven from the global context and returns the instance.
	 *
	 * @return {Raven}
	 */
	Raven$1.noConflict = function() {
	  _window$3.Raven = _Raven;
	  return Raven$1;
	};

	Raven$1.afterLoad();

	var singleton = Raven$1;

	/**
	 * DISCLAIMER:
	 *
	 * Expose `Client` constructor for cases where user want to track multiple "sub-applications" in one larger app.
	 * It's not meant to be used by a wide audience, so pleaaase make sure that you know what you're doing before using it.
	 * Accidentally calling `install` multiple times, may result in an unexpected behavior that's very hard to debug.
	 *
	 * It's called `Client' to be in-line with Raven Node implementation.
	 *
	 * HOWTO:
	 *
	 * import Raven from 'raven-js';
	 *
	 * const someAppReporter = new Raven.Client();
	 * const someOtherAppReporter = new Raven.Client();
	 *
	 * someAppReporter.config('__DSN__', {
	 *   ...config goes here
	 * });
	 *
	 * someOtherAppReporter.config('__OTHER_DSN__', {
	 *   ...config goes here
	 * });
	 *
	 * someAppReporter.captureMessage(...);
	 * someAppReporter.captureException(...);
	 * someAppReporter.captureBreadcrumb(...);
	 *
	 * someOtherAppReporter.captureMessage(...);
	 * someOtherAppReporter.captureException(...);
	 * someOtherAppReporter.captureBreadcrumb(...);
	 *
	 * It should "just work".
	 */
	var Client = raven;
	singleton.Client = Client;

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

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  }
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	function _iterableToArrayLimit(arr, i) {
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

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	// ==========================================================================
	// Type checking utils
	// ==========================================================================
	var getConstructor = function getConstructor(input) {
	  return input !== null && typeof input !== 'undefined' ? input.constructor : null;
	};

	var instanceOf = function instanceOf(input, constructor) {
	  return Boolean(input && constructor && input instanceof constructor);
	};

	var isNullOrUndefined = function isNullOrUndefined(input) {
	  return input === null || typeof input === 'undefined';
	};

	var isObject$2 = function isObject(input) {
	  return getConstructor(input) === Object;
	};

	var isNumber = function isNumber(input) {
	  return getConstructor(input) === Number && !Number.isNaN(input);
	};

	var isString$2 = function isString(input) {
	  return getConstructor(input) === String;
	};

	var isBoolean = function isBoolean(input) {
	  return getConstructor(input) === Boolean;
	};

	var isFunction$2 = function isFunction(input) {
	  return getConstructor(input) === Function;
	};

	var isArray$2 = function isArray(input) {
	  return Array.isArray(input);
	};

	var isWeakMap = function isWeakMap(input) {
	  return instanceOf(input, WeakMap);
	};

	var isNodeList = function isNodeList(input) {
	  return instanceOf(input, NodeList);
	};

	var isElement = function isElement(input) {
	  return instanceOf(input, Element);
	};

	var isTextNode = function isTextNode(input) {
	  return getConstructor(input) === Text;
	};

	var isEvent = function isEvent(input) {
	  return instanceOf(input, Event);
	};

	var isKeyboardEvent = function isKeyboardEvent(input) {
	  return instanceOf(input, KeyboardEvent);
	};

	var isCue = function isCue(input) {
	  return instanceOf(input, window.TextTrackCue) || instanceOf(input, window.VTTCue);
	};

	var isTrack = function isTrack(input) {
	  return instanceOf(input, TextTrack) || !isNullOrUndefined(input) && isString$2(input.kind);
	};

	var isPromise = function isPromise(input) {
	  return instanceOf(input, Promise);
	};

	var isEmpty = function isEmpty(input) {
	  return isNullOrUndefined(input) || (isString$2(input) || isArray$2(input) || isNodeList(input)) && !input.length || isObject$2(input) && !Object.keys(input).length;
	};

	var isUrl = function isUrl(input) {
	  // Accept a URL object
	  if (instanceOf(input, window.URL)) {
	    return true;
	  } // Must be string from here


	  if (!isString$2(input)) {
	    return false;
	  } // Add the protocol if required


	  var string = input;

	  if (!input.startsWith('http://') || !input.startsWith('https://')) {
	    string = "http://".concat(input);
	  }

	  try {
	    return !isEmpty(new URL(string).hostname);
	  } catch (e) {
	    return false;
	  }
	};

	var is = {
	  nullOrUndefined: isNullOrUndefined,
	  object: isObject$2,
	  number: isNumber,
	  string: isString$2,
	  boolean: isBoolean,
	  function: isFunction$2,
	  array: isArray$2,
	  weakMap: isWeakMap,
	  nodeList: isNodeList,
	  element: isElement,
	  textNode: isTextNode,
	  event: isEvent,
	  keyboardEvent: isKeyboardEvent,
	  cue: isCue,
	  track: isTrack,
	  promise: isPromise,
	  url: isUrl,
	  empty: isEmpty
	};

	// ==========================================================================
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
	  if (!element || !('addEventListener' in element) || is.empty(event) || !is.function(callback)) {
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
	  if (!is.element(element) || is.empty(type)) {
	    return;
	  } // Create and dispatch the event


	  var event = new CustomEvent(type, {
	    bubbles: bubbles,
	    detail: Object.assign({}, detail, {
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
	  if (!is.element(element) || is.empty(attributes)) {
	    return;
	  } // Assume null and undefined attributes should be left out,
	  // Setting them would otherwise convert them to "null" and "undefined"


	  Object.entries(attributes).filter(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        value = _ref2[1];

	    return !is.nullOrUndefined(value);
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

	  if (is.object(attributes)) {
	    setAttributes(element, attributes);
	  } // Add text node


	  if (is.string(text)) {
	    element.innerText = text;
	  } // Return built element


	  return element;
	} // Inaert an element after another

	function insertAfter(element, target) {
	  if (!is.element(element) || !is.element(target)) {
	    return;
	  }

	  target.parentNode.insertBefore(element, target.nextSibling);
	} // Insert a DocumentFragment

	function insertElement(type, parent, attributes, text) {
	  if (!is.element(parent)) {
	    return;
	  }

	  parent.appendChild(createElement(type, attributes, text));
	} // Remove element(s)

	function removeElement(element) {
	  if (is.nodeList(element) || is.array(element)) {
	    Array.from(element).forEach(removeElement);
	    return;
	  }

	  if (!is.element(element) || !is.element(element.parentNode)) {
	    return;
	  }

	  element.parentNode.removeChild(element);
	} // Remove all child elements

	function emptyElement(element) {
	  if (!is.element(element)) {
	    return;
	  }

	  var length = element.childNodes.length;

	  while (length > 0) {
	    element.removeChild(element.lastChild);
	    length -= 1;
	  }
	} // Replace element

	function replaceElement(newChild, oldChild) {
	  if (!is.element(oldChild) || !is.element(oldChild.parentNode) || !is.element(newChild)) {
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
	  if (!is.string(sel) || is.empty(sel)) {
	    return {};
	  }

	  var attributes = {};
	  var existing = existingAttributes;
	  sel.split(',').forEach(function (s) {
	    // Remove whitespace
	    var selector = s.trim();
	    var className = selector.replace('.', '');
	    var stripped = selector.replace(/[[\]]/g, ''); // Get the parts and value

	    var parts = stripped.split('=');
	    var key = parts[0];
	    var value = parts.length > 1 ? parts[1].replace(/["']/g, '') : ''; // Get the first character

	    var start = selector.charAt(0);

	    switch (start) {
	      case '.':
	        // Add to existing classname
	        if (is.object(existing) && is.string(existing.class)) {
	          existing.class += " ".concat(className);
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
	} // Toggle hidden

	function toggleHidden(element, hidden) {
	  if (!is.element(element)) {
	    return;
	  }

	  var hide = hidden;

	  if (!is.boolean(hide)) {
	    hide = !element.hidden;
	  }

	  if (hide) {
	    element.setAttribute('hidden', '');
	  } else {
	    element.removeAttribute('hidden');
	  }
	} // Mirror Element.classList.toggle, with IE compatibility for "force" argument

	function toggleClass(element, className, force) {
	  if (is.nodeList(element)) {
	    return Array.from(element).map(function (e) {
	      return toggleClass(e, className, force);
	    });
	  }

	  if (is.element(element)) {
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
	  return is.element(element) && element.classList.contains(className);
	} // Element matches selector

	function matches(element, selector) {

	  function match() {
	    return Array.from(document.querySelectorAll(selector)).includes(this);
	  }

	  var matches = match;
	  return matches.call(element, selector);
	} // Find all elements

	function getElements(selector) {
	  return this.elements.container.querySelectorAll(selector);
	} // Find a single element

	function getElement(selector) {
	  return this.elements.container.querySelector(selector);
	} // Trap focus inside container

	function trapFocus() {
	  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	  var toggle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  if (!is.element(element)) {
	    return;
	  }

	  var focusable = getElements.call(this, 'button:not(:disabled), input:not(:disabled), [tabindex]');
	  var first = focusable[0];
	  var last = focusable[focusable.length - 1];

	  var trap = function trap(event) {
	    // Bail if not tab key or not fullscreen
	    if (event.key !== 'Tab' || event.keyCode !== 9) {
	      return;
	    } // Get the current focused element


	    var focused = document.activeElement;

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
	} // Set focus and tab focus class

	function setFocus() {
	  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	  var tabFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  if (!is.element(element)) {
	    return;
	  } // Set regular focus


	  element.focus({
	    preventScroll: true
	  }); // If we want to mimic keyboard focus via tab

	  if (tabFocus) {
	    toggleClass(element, this.config.classNames.tabFocus);
	  }
	}

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
	  return is.string(type) ? events[type] : false;
	}(); // Force repaint of element

	function repaint(element) {
	  setTimeout(function () {
	    try {
	      toggleHidden(element, true);
	      element.offsetHeight; // eslint-disable-line

	      toggleHidden(element, false);
	    } catch (e) {// Do nothing
	    }
	  }, 0);
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


	    if (is.function(createElement('video').webkitSetPresentationMode)) {
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
	  airplay: is.function(window.WebKitPlaybackTargetAvailabilityEvent),
	  // Inline playback support
	  // https://webkit.org/blog/6784/new-video-policies-for-ios/
	  playsinline: 'playsInline' in document.createElement('video'),
	  // Check for mime type support against a player instance
	  // Credits: http://diveintohtml5.info/everything.html
	  // Related: http://www.leanbackplayer.com/test/h5mt.html
	  mime: function mime(input) {
	    if (is.empty(input)) {
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

	      if (is.empty(type)) {
	        return true;
	      }

	      return support.mime.call(_this, type);
	    });
	  },
	  // Get quality levels
	  getQualityOptions: function getQualityOptions() {
	    // Get sizes from <source> elements
	    return html5.getSources.call(this).map(function (source) {
	      return Number(source.getAttribute('size'));
	    }).filter(Boolean);
	  },
	  extend: function extend() {
	    if (!this.isHTML5) {
	      return;
	    }

	    var player = this; // Quality

	    Object.defineProperty(player.media, 'quality', {
	      get: function get() {
	        // Get sources
	        var sources = html5.getSources.call(player);
	        var source = sources.find(function (source) {
	          return source.getAttribute('src') === player.source;
	        }); // Return size, if match is found

	        return source && Number(source.getAttribute('size'));
	      },
	      set: function set(input) {
	        // Get sources
	        var sources = html5.getSources.call(player); // Get first match for requested size

	        var source = sources.find(function (source) {
	          return Number(source.getAttribute('size')) === input;
	        }); // No matching source found

	        if (!source) {
	          return;
	        } // Get current state


	        var _player$media = player.media,
	            currentTime = _player$media.currentTime,
	            paused = _player$media.paused,
	            preload = _player$media.preload,
	            readyState = _player$media.readyState; // Set new source

	        player.media.src = source.getAttribute('src'); // Prevent loading if preload="none" and the current source isn't loaded (#1044)

	        if (preload !== 'none' || readyState) {
	          // Restore time
	          player.once('loadedmetadata', function () {
	            player.currentTime = currentTime; // Resume playing

	            if (!paused) {
	              player.play();
	            }
	          }); // Load new source

	          player.media.load();
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
	  if (!is.array(array)) {
	    return array;
	  }

	  return array.filter(function (item, index) {
	    return array.indexOf(item) === index;
	  });
	} // Get the closest value in an array

	function closest(array, value) {
	  if (!is.array(array) || !array.length) {
	    return null;
	  }

	  return array.reduce(function (prev, curr) {
	    return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
	  });
	}

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

	  if (!is.object(source)) {
	    return target;
	  }

	  Object.keys(source).forEach(function (key) {
	    if (is.object(source[key])) {
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

	// ==========================================================================

	function generateId(prefix) {
	  return "".concat(prefix, "-").concat(Math.floor(Math.random() * 10000));
	} // Format string

	function format(input) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (is.empty(input)) {
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

	function replaceAll() {
	  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	  var find = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	  var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	  return input.replace(new RegExp(find.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'g'), replace.toString());
	} // Convert to title case

	function toTitleCase() {
	  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	  return input.toString().replace(/\w\S*/g, function (text) {
	    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
	  });
	} // Convert string to pascalCase

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

	    if (is.empty(key) || is.empty(config)) {
	      return '';
	    }

	    var string = getDeep(config.i18n, key);

	    if (is.empty(string)) {
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
	          key = _ref2[0],
	          value = _ref2[1];

	      string = replaceAll(string, key, value);
	    });
	    return string;
	  }
	};

	var Storage =
	/*#__PURE__*/
	function () {
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

	      if (is.empty(store)) {
	        return null;
	      }

	      var json = JSON.parse(store);
	      return is.string(key) && key.length ? json[key] : json;
	    }
	  }, {
	    key: "set",
	    value: function set(object) {
	      // Bail if we don't have localStorage support or it's disabled
	      if (!Storage.supported || !this.enabled) {
	        return;
	      } // Can only store objectst


	      if (!is.object(object)) {
	        return;
	      } // Get current storage


	      var storage = this.get(); // Default to empty object

	      if (is.empty(storage)) {
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
	  if (!is.string(url)) {
	    return;
	  }

	  var prefix = 'cache';
	  var hasId = is.string(id);
	  var isCached = false;

	  var exists = function exists() {
	    return document.getElementById(id) !== null;
	  };

	  var update = function update(container, data) {
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
	      if (is.empty(result)) {
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
	  if (!is.number(time)) {
	    return formatTime(null, displayHours, inverted);
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

	      if (is.element(this.elements.progress)) {
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
	      role: 'presentation',
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
	    var attributes = Object.assign({}, attr, {
	      class: [attr.class, this.config.classNames.hidden].filter(Boolean).join(' ')
	    });
	    return createElement('span', attributes, text);
	  },
	  // Create a badge
	  createBadge: function createBadge(text) {
	    if (is.empty(text)) {
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
	    var attributes = Object.assign({}, attr);
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
	      if (!attributes.class.includes(this.config.classNames.control)) {
	        attributes.class += " ".concat(this.config.classNames.control);
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
	        if (is.empty(props.label)) {
	          props.label = type;
	        }

	        if (is.empty(props.icon)) {
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
	      if (!is.array(this.elements.buttons[type])) {
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

	    controls.updateRangeFill.call(this, input);
	    return input;
	  },
	  // Create a <progress>
	  createProgress: function createProgress(type, attributes) {
	    var progress = createElement('progress', extend(getAttributesFromSelector(this.config.selectors.display[type]), {
	      min: 0,
	      max: 100,
	      value: 0,
	      role: 'presentation',
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
	  createTime: function createTime(type) {
	    var attributes = getAttributesFromSelector(this.config.selectors.display[type]);
	    var container = createElement('div', extend(attributes, {
	      class: "".concat(this.config.classNames.display.time, " ").concat(attributes.class ? attributes.class : '').trim(),
	      'aria-label': i18n.get(type, this.config)
	    }), '00:00'); // Reference for updates

	    this.elements.display[type] = container;
	    return container;
	  },
	  // Bind keyboard shortcuts for a menu item
	  // We have to bind to keyup otherwise Firefox triggers a click when a keydown event handler shifts focus
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=1220143
	  bindMenuItemShortcuts: function bindMenuItemShortcuts(menuItem, type) {
	    var _this = this;

	    // Navigate through menus via arrow keys and space
	    on(menuItem, 'keydown keyup', function (event) {
	      // We only care about space and ⬆️ ⬇️️ ➡️
	      if (![32, 38, 39, 40].includes(event.which)) {
	        return;
	      } // Prevent play / seek


	      event.preventDefault();
	      event.stopPropagation(); // We're just here to prevent the keydown bubbling

	      if (event.type === 'keydown') {
	        return;
	      }

	      var isRadioButton = matches(menuItem, '[role="menuitemradio"]'); // Show the respective menu

	      if (!isRadioButton && [32, 39].includes(event.which)) {
	        controls.showMenuPanel.call(_this, type, true);
	      } else {
	        var target;

	        if (event.which !== 32) {
	          if (event.which === 40 || isRadioButton && event.which === 39) {
	            target = menuItem.nextElementSibling;

	            if (!is.element(target)) {
	              target = menuItem.parentNode.firstElementChild;
	            }
	          } else {
	            target = menuItem.previousElementSibling;

	            if (!is.element(target)) {
	              target = menuItem.parentNode.lastElementChild;
	            }
	          }

	          setFocus.call(_this, target, true);
	        }
	      }
	    }, false); // Enter will fire a `click` event but we still need to manage focus
	    // So we bind to keyup which fires after and set focus here

	    on(menuItem, 'keyup', function (event) {
	      if (event.which !== 13) {
	        return;
	      }

	      controls.focusFirstMenuItem.call(_this, null, true);
	    });
	  },
	  // Create a settings menu item
	  createMenuItem: function createMenuItem(_ref) {
	    var _this2 = this;

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

	    if (is.element(badge)) {
	      flex.appendChild(badge);
	    }

	    menuItem.appendChild(flex); // Replicate radio button behaviour

	    Object.defineProperty(menuItem, 'checked', {
	      enumerable: true,
	      get: function get() {
	        return menuItem.getAttribute('aria-checked') === 'true';
	      },
	      set: function set(checked) {
	        // Ensure exclusivity
	        if (checked) {
	          Array.from(menuItem.parentNode.children).filter(function (node) {
	            return matches(node, '[role="menuitemradio"]');
	          }).forEach(function (node) {
	            return node.setAttribute('aria-checked', 'false');
	          });
	        }

	        menuItem.setAttribute('aria-checked', checked ? 'true' : 'false');
	      }
	    });
	    this.listeners.bind(menuItem, 'click keyup', function (event) {
	      if (is.keyboardEvent(event) && event.which !== 32) {
	        return;
	      }

	      event.preventDefault();
	      event.stopPropagation();
	      menuItem.checked = true;

	      switch (type) {
	        case 'language':
	          _this2.currentTrack = Number(value);
	          break;

	        case 'quality':
	          _this2.quality = value;
	          break;

	        case 'speed':
	          _this2.speed = parseFloat(value);
	          break;

	        default:
	          break;
	      }

	      controls.showMenuPanel.call(_this2, 'home', is.keyboardEvent(event));
	    }, type, false);
	    controls.bindMenuItemShortcuts.call(this, menuItem, type);
	    list.appendChild(menuItem);
	  },
	  // Format a time for display
	  formatTime: function formatTime$$1() {
	    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    var inverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	    // Bail if the value isn't a number
	    if (!is.number(time)) {
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
	    if (!is.element(target) || !is.number(time)) {
	      return;
	    } // eslint-disable-next-line no-param-reassign


	    target.innerText = controls.formatTime(time, inverted);
	  },
	  // Update volume UI and storage
	  updateVolume: function updateVolume() {
	    if (!this.supported.ui) {
	      return;
	    } // Update range


	    if (is.element(this.elements.inputs.volume)) {
	      controls.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume);
	    } // Update mute state


	    if (is.element(this.elements.buttons.mute)) {
	      this.elements.buttons.mute.pressed = this.muted || this.volume === 0;
	    }
	  },
	  // Update seek value and lower fill
	  setRange: function setRange(target) {
	    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	    if (!is.element(target)) {
	      return;
	    } // eslint-disable-next-line


	    target.value = value; // Webkit range fill

	    controls.updateRangeFill.call(this, target);
	  },
	  // Update <progress> elements
	  updateProgress: function updateProgress(event) {
	    var _this3 = this;

	    if (!this.supported.ui || !is.event(event)) {
	      return;
	    }

	    var value = 0;

	    var setProgress = function setProgress(target, input) {
	      var value = is.number(input) ? input : 0;
	      var progress = is.element(target) ? target : _this3.elements.display.buffer; // Update value and label

	      if (is.element(progress)) {
	        progress.value = value; // Update text label inside

	        var label = progress.getElementsByTagName('span')[0];

	        if (is.element(label)) {
	          label.childNodes[0].nodeValue = value;
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

	        default:
	          break;
	      }
	    }
	  },
	  // Webkit polyfill for lower fill range
	  updateRangeFill: function updateRangeFill(target) {
	    // Get range from event if event passed
	    var range = is.event(target) ? target.target : target; // Needs to be a valid <input type='range'>

	    if (!is.element(range) || range.getAttribute('type') !== 'range') {
	      return;
	    } // Set aria values for https://github.com/sampotts/plyr/issues/905


	    if (matches(range, this.config.selectors.inputs.seek)) {
	      range.setAttribute('aria-valuenow', this.currentTime);
	      var currentTime = controls.formatTime(this.currentTime);
	      var duration = controls.formatTime(this.duration);
	      var format$$1 = i18n.get('seekLabel', this.config);
	      range.setAttribute('aria-valuetext', format$$1.replace('{currentTime}', currentTime).replace('{duration}', duration));
	    } else if (matches(range, this.config.selectors.inputs.volume)) {
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
	    var _this4 = this;

	    // Bail if setting not true
	    if (!this.config.tooltips.seek || !is.element(this.elements.inputs.seek) || !is.element(this.elements.display.seekTooltip) || this.duration === 0) {
	      return;
	    } // Calculate percentage


	    var percent = 0;
	    var clientRect = this.elements.progress.getBoundingClientRect();
	    var visible = "".concat(this.config.classNames.tooltip, "--visible");

	    var toggle = function toggle(_toggle) {
	      toggleClass(_this4.elements.display.seekTooltip, visible, _toggle);
	    }; // Hide on touch


	    if (this.touch) {
	      toggle(false);
	      return;
	    } // Determine percentage, if already visible


	    if (is.event(event)) {
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

	    if (is.event(event) && ['mouseenter', 'mouseleave'].includes(event.type)) {
	      toggle(event.type === 'mouseenter');
	    }
	  },
	  // Handle time change event
	  timeUpdate: function timeUpdate(event) {
	    // Only invert if only one time element is displayed and used for both duration and currentTime
	    var invert = !is.element(this.elements.display.duration) && this.config.invertTime; // Duration

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


	    if (is.element(this.elements.inputs.seek)) {
	      this.elements.inputs.seek.setAttribute('aria-valuemax', this.duration);
	    } // If there's a spot to display duration


	    var hasDuration = is.element(this.elements.display.duration); // If there's only one time display, display duration there

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
	      value = !is.empty(input) ? input : this[setting]; // Get default

	      if (is.empty(value)) {
	        value = this.config[setting].default;
	      } // Unsupported value


	      if (!is.empty(this.options[setting]) && !this.options[setting].includes(value)) {
	        this.debug.warn("Unsupported value of '".concat(value, "' for ").concat(setting));
	        return;
	      } // Disabled value


	      if (!this.config[setting].options.includes(value)) {
	        this.debug.warn("Disabled value of '".concat(value, "' for ").concat(setting));
	        return;
	      }
	    } // Get the list if we need to


	    if (!is.element(list)) {
	      list = pane && pane.querySelector('[role="menu"]');
	    } // If there's no list it means it's not been rendered...


	    if (!is.element(list)) {
	      return;
	    } // Update the label


	    var label = this.elements.settings.buttons[setting].querySelector(".".concat(this.config.classNames.menu.value));
	    label.innerHTML = controls.getLabel.call(this, setting, value); // Find the radio option and check it

	    var target = list && list.querySelector("[value=\"".concat(value, "\"]"));

	    if (is.element(target)) {
	      target.checked = true;
	    }
	  },
	  // Translate a value into a nice label
	  getLabel: function getLabel(setting, value) {
	    switch (setting) {
	      case 'speed':
	        return value === 1 ? i18n.get('normal', this.config) : "".concat(value, "&times;");

	      case 'quality':
	        if (is.number(value)) {
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
	    var _this5 = this;

	    // Menu required
	    if (!is.element(this.elements.settings.panels.quality)) {
	      return;
	    }

	    var type = 'quality';
	    var list = this.elements.settings.panels.quality.querySelector('[role="menu"]'); // Set options if passed and filter based on uniqueness and config

	    if (is.array(options)) {
	      this.options.quality = dedupe(options).filter(function (quality) {
	        return _this5.config.quality.options.includes(quality);
	      });
	    } // Toggle the pane and tab


	    var toggle = !is.empty(this.options.quality) && this.options.quality.length > 1;
	    controls.toggleMenuButton.call(this, type, toggle); // Empty the menu

	    emptyElement(list); // Check if we need to toggle the parent

	    controls.checkMenu.call(this); // If we're hiding, nothing more to do

	    if (!toggle) {
	      return;
	    } // Get the badge HTML for HD, 4K etc


	    var getBadge = function getBadge(quality) {
	      var label = i18n.get("qualityBadge.".concat(quality), _this5.config);

	      if (!label.length) {
	        return null;
	      }

	      return controls.createBadge.call(_this5, label);
	    }; // Sort options by the config and then render options


	    this.options.quality.sort(function (a, b) {
	      var sorting = _this5.config.quality.options;
	      return sorting.indexOf(a) > sorting.indexOf(b) ? 1 : -1;
	    }).forEach(function (quality) {
	      controls.createMenuItem.call(_this5, {
	        value: quality,
	        list: list,
	        type: type,
	        title: controls.getLabel.call(_this5, 'quality', quality),
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
	    var _this6 = this;

	    // Menu required
	    if (!is.element(this.elements.settings.panels.captions)) {
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
	        checked: _this6.captions.toggled && _this6.currentTrack === value,
	        title: captions.getLabel.call(_this6, track),
	        badge: track.language && controls.createBadge.call(_this6, track.language.toUpperCase()),
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
	  setSpeedMenu: function setSpeedMenu(options) {
	    var _this7 = this;

	    // Menu required
	    if (!is.element(this.elements.settings.panels.speed)) {
	      return;
	    }

	    var type = 'speed';
	    var list = this.elements.settings.panels.speed.querySelector('[role="menu"]'); // Set the speed options

	    if (is.array(options)) {
	      this.options.speed = options;
	    } else if (this.isHTML5 || this.isVimeo) {
	      this.options.speed = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
	    } // Set options if passed and filter based on config


	    this.options.speed = this.options.speed.filter(function (speed) {
	      return _this7.config.speed.options.includes(speed);
	    }); // Toggle the pane and tab

	    var toggle = !is.empty(this.options.speed) && this.options.speed.length > 1;
	    controls.toggleMenuButton.call(this, type, toggle); // Empty the menu

	    emptyElement(list); // Check if we need to toggle the parent

	    controls.checkMenu.call(this); // If we're hiding, nothing more to do

	    if (!toggle) {
	      return;
	    } // Create items


	    this.options.speed.forEach(function (speed) {
	      controls.createMenuItem.call(_this7, {
	        value: speed,
	        list: list,
	        type: type,
	        title: controls.getLabel.call(_this7, 'speed', speed)
	      });
	    });
	    controls.updateSetting.call(this, type, list);
	  },
	  // Check if we need to hide/show the settings menu
	  checkMenu: function checkMenu() {
	    var buttons = this.elements.settings.buttons;
	    var visible = !is.empty(buttons) && Object.values(buttons).some(function (button) {
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

	    if (!is.element(target)) {
	      target = Object.values(this.elements.settings.panels).find(function (pane) {
	        return !pane.hidden;
	      });
	    }

	    var firstItem = target.querySelector('[role^="menuitem"]');
	    setFocus.call(this, firstItem, tabFocus);
	  },
	  // Show/hide menu
	  toggleMenu: function toggleMenu(input) {
	    var popup = this.elements.settings.popup;
	    var button = this.elements.buttons.settings; // Menu and button are required

	    if (!is.element(popup) || !is.element(button)) {
	      return;
	    } // True toggle by default


	    var hidden = popup.hidden;
	    var show = hidden;

	    if (is.boolean(input)) {
	      show = input;
	    } else if (is.keyboardEvent(input) && input.which === 27) {
	      show = false;
	    } else if (is.event(input)) {
	      var isMenuItem = popup.contains(input.target); // If the click was inside the menu or if the click
	      // wasn't the button or menu item and we're trying to
	      // show the menu (a doc click shouldn't show the menu)

	      if (isMenuItem || !isMenuItem && input.target !== button && show) {
	        return;
	      }
	    } // Set button attributes


	    button.setAttribute('aria-expanded', show); // Show the actual popup

	    toggleHidden(popup, !show); // Add class hook

	    toggleClass(this.elements.container, this.config.classNames.menu.open, show); // Focus the first item if key interaction

	    if (show && is.keyboardEvent(input)) {
	      controls.focusFirstMenuItem.call(this, null, true);
	    } else if (!show && !hidden) {
	      // If closing, re-focus the button
	      setFocus.call(this, button, is.keyboardEvent(input));
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
	    var _this8 = this;

	    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var tabFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	    var target = document.getElementById("plyr-settings-".concat(this.id, "-").concat(type)); // Nothing to show, bail

	    if (!is.element(target)) {
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

	        off.call(_this8, container, transitionEndEvent, restore);
	      }; // Listen for the transition finishing and restore auto height/width


	      on.call(this, container, transitionEndEvent, restore); // Set dimensions to target

	      container.style.width = "".concat(size.width, "px");
	      container.style.height = "".concat(size.height, "px");
	    } // Set attributes on current tab


	    toggleHidden(current, true); // Set attributes on target

	    toggleHidden(target, false); // Focus the first item

	    controls.focusFirstMenuItem.call(this, target, tabFocus);
	  },
	  // Set the download link
	  setDownloadLink: function setDownloadLink() {
	    var button = this.elements.buttons.download; // Bail if no button

	    if (!is.element(button)) {
	      return;
	    } // Set download link


	    button.setAttribute('href', this.download);
	  },
	  // Build the default HTML
	  // TODO: Set order based on order in the config.controls array?
	  create: function create(data) {
	    var _this9 = this;

	    // Create the container
	    var container = createElement('div', getAttributesFromSelector(this.config.selectors.controls.wrapper)); // Restart button

	    if (this.config.controls.includes('restart')) {
	      container.appendChild(controls.createButton.call(this, 'restart'));
	    } // Rewind button


	    if (this.config.controls.includes('rewind')) {
	      container.appendChild(controls.createButton.call(this, 'rewind'));
	    } // Play/Pause button


	    if (this.config.controls.includes('play')) {
	      container.appendChild(controls.createButton.call(this, 'play'));
	    } // Fast forward button


	    if (this.config.controls.includes('fast-forward')) {
	      container.appendChild(controls.createButton.call(this, 'fast-forward'));
	    } // Progress


	    if (this.config.controls.includes('progress')) {
	      var progress = createElement('div', getAttributesFromSelector(this.config.selectors.progress)); // Seek range slider

	      progress.appendChild(controls.createRange.call(this, 'seek', {
	        id: "plyr-seek-".concat(data.id)
	      })); // Buffer progress

	      progress.appendChild(controls.createProgress.call(this, 'buffer')); // TODO: Add loop display indicator
	      // Seek tooltip

	      if (this.config.tooltips.seek) {
	        var tooltip = createElement('span', {
	          class: this.config.classNames.tooltip
	        }, '00:00');
	        progress.appendChild(tooltip);
	        this.elements.display.seekTooltip = tooltip;
	      }

	      this.elements.progress = progress;
	      container.appendChild(this.elements.progress);
	    } // Media current time display


	    if (this.config.controls.includes('current-time')) {
	      container.appendChild(controls.createTime.call(this, 'currentTime'));
	    } // Media duration display


	    if (this.config.controls.includes('duration')) {
	      container.appendChild(controls.createTime.call(this, 'duration'));
	    } // Volume controls


	    if (this.config.controls.includes('mute') || this.config.controls.includes('volume')) {
	      var volume = createElement('div', {
	        class: 'plyr__volume'
	      }); // Toggle mute button

	      if (this.config.controls.includes('mute')) {
	        volume.appendChild(controls.createButton.call(this, 'mute'));
	      } // Volume range control


	      if (this.config.controls.includes('volume')) {
	        // Set the attributes
	        var attributes = {
	          max: 1,
	          step: 0.05,
	          value: this.config.volume
	        }; // Create the volume range slider

	        volume.appendChild(controls.createRange.call(this, 'volume', extend(attributes, {
	          id: "plyr-volume-".concat(data.id)
	        })));
	        this.elements.volume = volume;
	      }

	      container.appendChild(volume);
	    } // Toggle captions button


	    if (this.config.controls.includes('captions')) {
	      container.appendChild(controls.createButton.call(this, 'captions'));
	    } // Settings button / menu


	    if (this.config.controls.includes('settings') && !is.empty(this.config.settings)) {
	      var control = createElement('div', {
	        class: 'plyr__menu',
	        hidden: ''
	      });
	      control.appendChild(controls.createButton.call(this, 'settings', {
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
	      this.elements.settings.panels.home = home; // Build the menu items

	      this.config.settings.forEach(function (type) {
	        // TODO: bundle this with the createMenuItem helper and bindings
	        var menuItem = createElement('button', extend(getAttributesFromSelector(_this9.config.selectors.buttons.settings), {
	          type: 'button',
	          class: "".concat(_this9.config.classNames.control, " ").concat(_this9.config.classNames.control, "--forward"),
	          role: 'menuitem',
	          'aria-haspopup': true,
	          hidden: ''
	        })); // Bind menu shortcuts for keyboard users

	        controls.bindMenuItemShortcuts.call(_this9, menuItem, type); // Show menu on click

	        on(menuItem, 'click', function () {
	          controls.showMenuPanel.call(_this9, type, false);
	        });
	        var flex = createElement('span', null, i18n.get(type, _this9.config));
	        var value = createElement('span', {
	          class: _this9.config.classNames.menu.value
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
	          class: "".concat(_this9.config.classNames.control, " ").concat(_this9.config.classNames.control, "--back")
	        }); // Visible label

	        backButton.appendChild(createElement('span', {
	          'aria-hidden': true
	        }, i18n.get(type, _this9.config))); // Screen reader label

	        backButton.appendChild(createElement('span', {
	          class: _this9.config.classNames.hidden
	        }, i18n.get('menuBack', _this9.config))); // Go back via keyboard

	        on(pane, 'keydown', function (event) {
	          // We only care about <-
	          if (event.which !== 37) {
	            return;
	          } // Prevent seek


	          event.preventDefault();
	          event.stopPropagation(); // Show the respective menu

	          controls.showMenuPanel.call(_this9, 'home', true);
	        }, false); // Go back via button click

	        on(backButton, 'click', function () {
	          controls.showMenuPanel.call(_this9, 'home', false);
	        }); // Add to pane

	        pane.appendChild(backButton); // Menu

	        pane.appendChild(createElement('div', {
	          role: 'menu'
	        }));
	        inner.appendChild(pane);
	        _this9.elements.settings.buttons[type] = menuItem;
	        _this9.elements.settings.panels[type] = pane;
	      });
	      popup.appendChild(inner);
	      control.appendChild(popup);
	      container.appendChild(control);
	      this.elements.settings.popup = popup;
	      this.elements.settings.menu = control;
	    } // Picture in picture button


	    if (this.config.controls.includes('pip') && support.pip) {
	      container.appendChild(controls.createButton.call(this, 'pip'));
	    } // Airplay button


	    if (this.config.controls.includes('airplay') && support.airplay) {
	      container.appendChild(controls.createButton.call(this, 'airplay'));
	    } // Download button


	    if (this.config.controls.includes('download')) {
	      var _attributes = {
	        element: 'a',
	        href: this.download,
	        target: '_blank'
	      };
	      var download = this.config.urls.download;

	      if (!is.url(download) && this.isEmbed) {
	        extend(_attributes, {
	          icon: "logo-".concat(this.provider),
	          label: this.provider
	        });
	      }

	      container.appendChild(controls.createButton.call(this, 'download', _attributes));
	    } // Toggle fullscreen button


	    if (this.config.controls.includes('fullscreen')) {
	      container.appendChild(controls.createButton.call(this, 'fullscreen'));
	    } // Larger overlaid play button


	    if (this.config.controls.includes('play-large')) {
	      this.elements.container.appendChild(controls.createButton.call(this, 'play-large'));
	    }

	    this.elements.controls = container; // Set available quality levels

	    if (this.isHTML5) {
	      controls.setQualityMenu.call(this, html5.getQualityOptions.call(this));
	    }

	    controls.setSpeedMenu.call(this);
	    return container;
	  },
	  // Insert controls
	  inject: function inject() {
	    var _this10 = this;

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

	    if (is.function(this.config.controls)) {
	      this.config.controls = this.config.controls.call(this, props);
	    } // Convert falsy controls to empty array (primarily for empty strings)


	    if (!this.config.controls) {
	      this.config.controls = [];
	    }

	    if (is.element(this.config.controls) || is.string(this.config.controls)) {
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
	      if (is.string(this.config.controls)) {
	        container = replace(container);
	      } else if (is.element(container)) {
	        container.innerHTML = replace(container.innerHTML);
	      }
	    } // Controls container


	    var target; // Inject to custom location

	    if (is.string(this.config.selectors.controls.container)) {
	      target = document.querySelector(this.config.selectors.controls.container);
	    } // Inject into the container by default


	    if (!is.element(target)) {
	      target = this.elements.container;
	    } // Inject controls HTML (needs to be before captions, hence "afterbegin")


	    var insertMethod = is.element(container) ? 'insertAdjacentElement' : 'insertAdjacentHTML';
	    target[insertMethod]('afterbegin', container); // Find the elements if need be

	    if (!is.element(this.elements.controls)) {
	      controls.findElements.call(this);
	    } // Add pressed property to buttons


	    if (!is.empty(this.elements.buttons)) {
	      var addProperty = function addProperty(button) {
	        var className = _this10.config.classNames.controlPressed;
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
	        if (is.array(button) || is.nodeList(button)) {
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
	        toggleClass(label, _this10.config.classNames.hidden, false);
	        toggleClass(label, _this10.config.classNames.tooltip, true);
	      });
	    }
	  }
	};

	/**
	 * Parse a string to a URL object
	 * @param {string} input - the URL to be parsed
	 * @param {boolean} safe - failsafe parsing
	 */

	function parseUrl$2(input) {
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

	  if (is.object(input)) {
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
	      if (is.array(this.config.controls) && this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
	        controls.setCaptionsMenu.call(this);
	      }

	      return;
	    } // Inject the container


	    if (!is.element(this.elements.captions)) {
	      this.elements.captions = createElement('div', getAttributesFromSelector(this.config.selectors.captions));
	      insertAfter(this.elements.captions, this.elements.wrapper);
	    } // Fix IE captions if CORS is used
	    // Fetch captions and inject as blobs instead (data URIs not supported!)


	    if (browser.isIE && window.URL) {
	      var elements = this.media.querySelectorAll('track');
	      Array.from(elements).forEach(function (track) {
	        var src = track.getAttribute('src');
	        var url = parseUrl$2(src);

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

	    if (!is.boolean(active)) {
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

	        track.mode = 'hidden'; // Add event listener for cue changes

	        on.call(_this, track, 'cuechange', function () {
	          return captions.updateCues.call(_this);
	        });
	      });
	    } // Update language first time it matches, or if the previous matching track was removed


	    if (languageExists && this.language !== language || !tracks.includes(currentTrackNode)) {
	      captions.setLanguage.call(this, language);
	      captions.toggle.call(this, active && languageExists);
	    } // Enable or disable captions based on track length


	    toggleClass(this.elements.container, this.config.classNames.captions.enabled, !is.empty(tracks)); // Update available languages in list

	    if ((this.config.controls || []).includes('settings') && this.config.settings.includes('captions')) {
	      controls.setCaptionsMenu.call(this);
	    }
	  },
	  // Toggle captions display
	  // Used internally for the toggleCaptions method, with the passive option forced to false
	  toggle: function toggle(input) {
	    var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	    // If there's no full support
	    if (!this.supported.ui) {
	      return;
	    }

	    var toggled = this.captions.toggled; // Current state

	    var activeClass = this.config.classNames.captions.active; // Get the next state
	    // If the method is called without parameter, toggle based on current value

	    var active = is.nullOrUndefined(input) ? !toggled : input; // Update state and trigger event

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
	    }
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

	    if (!is.number(index)) {
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

	    if (!is.string(input)) {
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
	    var _this2 = this;

	    var update = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	    // Handle media or textTracks missing or null
	    var tracks = Array.from((this.media || {}).textTracks || []); // For HTML5, use cache instead of current tracks when it exists (if captions.update is false)
	    // Filter out removed tracks and tracks that aren't captions/subtitles (for example metadata)

	    return tracks.filter(function (track) {
	      return !_this2.isHTML5 || update || _this2.captions.meta.has(track);
	    }).filter(function (track) {
	      return ['captions', 'subtitles'].includes(track.kind);
	    });
	  },
	  // Match tracks based on languages and get the first
	  findTrack: function findTrack(languages) {
	    var _this3 = this;

	    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	    var tracks = captions.getTracks.call(this);

	    var sortIsDefault = function sortIsDefault(track) {
	      return Number((_this3.captions.meta.get(track) || {}).default);
	    };

	    var sorted = Array.from(tracks).sort(function (a, b) {
	      return sortIsDefault(b) - sortIsDefault(a);
	    });
	    var track;
	    languages.every(function (language) {
	      track = sorted.find(function (track) {
	        return track.language === language;
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

	    if (!is.track(currentTrack) && support.textTracks && this.captions.toggled) {
	      currentTrack = captions.getCurrentTrack.call(this);
	    }

	    if (is.track(currentTrack)) {
	      if (!is.empty(currentTrack.label)) {
	        return currentTrack.label;
	      }

	      if (!is.empty(currentTrack.language)) {
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

	    if (!is.element(this.elements.captions)) {
	      this.debug.warn('No captions element to render to');
	      return;
	    } // Only accept array or empty input


	    if (!is.nullOrUndefined(input) && !Array.isArray(input)) {
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
	var defaults = {
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
	  iconUrl: 'https://cdn.plyr.io/3.5.0-beta.4/plyr.svg',
	  // Blank video (used to prevent errors on source change)
	  blankVideo: 'https://cdn.plyr.io/static/blank.mp4',
	  // Quality default
	  quality: {
	    default: 576,
	    options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
	  },
	  // Set loops
	  loop: {
	    active: false // start: null,
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
	  'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', // 'download',
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
	      api: 'https://vimeo.com/api/v2/video/{0}.json'
	    },
	    youtube: {
	      sdk: 'https://www.youtube.com/iframe_api',
	      api: 'https://www.googleapis.com/youtube/v3/videos?id={0}&key={1}&fields=items(snippet(title))&part=snippet'
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
	    caption: '.plyr__caption',
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
	  // API keys
	  keys: {
	    google: null
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
	    transparent: false
	  },
	  // YouTube plugin
	  youtube: {
	    noCookie: false,
	    // Whether to use an alternative version of YouTube without cookies
	    rel: 0,
	    // No related vids
	    showinfo: 0,
	    // Hide info
	    iv_load_policy: 3,
	    // Hide annotations
	    modestbranding: 1 // Hide logos as much as possible (they still show one in the corner when paused)

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

	var Console =
	/*#__PURE__*/
	function () {
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

	function onChange() {
	  if (!this.enabled) {
	    return;
	  } // Update toggle button


	  var button = this.player.elements.buttons.fullscreen;

	  if (is.element(button)) {
	    button.pressed = this.active;
	  } // Trigger an event


	  triggerEvent.call(this.player, this.target, this.active ? 'enterfullscreen' : 'exitfullscreen', true); // Trap focus in container

	  if (!browser.isIos) {
	    trapFocus.call(this.player, this.target, this.active);
	  }
	}

	function toggleFallback() {
	  var _this = this;

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


	    var hasProperty = is.string(viewport.content) && viewport.content.includes(property);

	    if (toggle) {
	      this.cleanupViewport = !hasProperty;

	      if (!hasProperty) {
	        viewport.content += ",".concat(property);
	      }
	    } else if (this.cleanupViewport) {
	      viewport.content = viewport.content.split(',').filter(function (part) {
	        return part.trim() !== property;
	      }).join(',');
	    } // Force a repaint as sometimes Safari doesn't want to fill the screen


	    setTimeout(function () {
	      return repaint(_this.target);
	    }, 100);
	  } // Toggle button and fire events


	  onChange.call(this);
	}

	var Fullscreen =
	/*#__PURE__*/
	function () {
	  function Fullscreen(player) {
	    var _this2 = this;

	    _classCallCheck(this, Fullscreen);

	    // Keep reference to parent
	    this.player = player; // Get prefix

	    this.prefix = Fullscreen.prefix;
	    this.property = Fullscreen.property; // Scroll position

	    this.scrollPosition = {
	      x: 0,
	      y: 0
	    }; // Force the use of 'full window/browser' rather than fullscreen

	    this.forceFallback = player.config.fullscreen.fallback === 'force'; // Register event listeners
	    // Handle event (incase user presses escape etc)

	    on.call(this.player, document, this.prefix === 'ms' ? 'MSFullscreenChange' : "".concat(this.prefix, "fullscreenchange"), function () {
	      // TODO: Filter for target??
	      onChange.call(_this2);
	    }); // Fullscreen toggle on double click

	    on.call(this.player, this.player.elements.container, 'dblclick', function (event) {
	      // Ignore double click in controls
	      if (is.element(_this2.player.elements.controls) && _this2.player.elements.controls.contains(event.target)) {
	        return;
	      }

	      _this2.toggle();
	    }); // Update the UI

	    this.update();
	  } // Determine if native supported


	  _createClass(Fullscreen, [{
	    key: "update",
	    // Update UI
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
	        toggleFallback.call(this, true);
	      } else if (!this.prefix) {
	        this.target.requestFullscreen();
	      } else if (!is.empty(this.prefix)) {
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
	        this.player.play();
	      } else if (!Fullscreen.native || this.forceFallback) {
	        toggleFallback.call(this, false);
	      } else if (!this.prefix) {
	        (document.cancelFullScreen || document.exitFullscreen).call(document);
	      } else if (!is.empty(this.prefix)) {
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
	      return element === this.target;
	    } // Get target element

	  }, {
	    key: "target",
	    get: function get() {
	      return browser.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.container;
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
	      if (is.function(document.exitFullscreen)) {
	        return '';
	      } // Check for fullscreen support by vendor prefix


	      var value = '';
	      var prefixes = ['webkit', 'moz', 'ms'];
	      prefixes.some(function (pre) {
	        if (is.function(document["".concat(pre, "ExitFullscreen")]) || is.function(document["".concat(pre, "CancelFullScreen")])) {
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

	// ==========================================================================
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


	    if (!is.element(this.elements.controls)) {
	      // Inject custom controls
	      controls.inject.call(this); // Re-attach control listeners

	      this.listeners.controls();
	    } // Remove native controls


	    ui.toggleNativeControls.call(this); // Setup captions for HTML5

	    if (this.isHTML5) {
	      captions.setup.call(this);
	    } // Reset volume


	    this.volume = null; // Reset mute state

	    this.muted = null; // Reset speed

	    this.speed = null; // Reset loop state

	    this.loop = null; // Reset quality setting

	    this.quality = null; // Reset volume display

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

	    if (is.string(this.config.title) && !is.empty(this.config.title)) {
	      label += ", ".concat(this.config.title);
	    } // If there's a play button, set label


	    Array.from(this.elements.buttons.play || []).forEach(function (button) {
	      button.setAttribute('aria-label', label);
	    }); // Set iframe title
	    // https://github.com/sampotts/plyr/issues/124

	    if (this.isEmbed) {
	      var iframe = getElement.call(this, 'iframe');

	      if (!is.element(iframe)) {
	        return;
	      } // Default to media type


	      var title = !is.empty(this.config.title) ? this.config.title : 'video';
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


	    this.media.setAttribute('poster', poster); // Wait until ui is ready

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
	      target.pressed = _this3.playing;
	    }); // Only update controls on non timeupdate events

	    if (is.event(event) && event.type === 'timeupdate') {
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
	    var controls$$1 = this.elements.controls;

	    if (controls$$1 && this.config.hideControls) {
	      // Don't hide controls if a touch-device user recently seeked. (Must be limited to touch devices, or it occasionally prevents desktop controls from hiding.)
	      var recentTouchSeek = this.touch && this.lastSeekTime + 2000 > Date.now(); // Show controls if force, loading, paused, button interaction, or recent seek, otherwise hide

	      this.toggleControls(Boolean(force || this.loading || this.paused || controls$$1.pressed || controls$$1.hover || recentTouchSeek));
	    }
	  }
	};

	/* function reduceAspectRatio(width, height) {
	    const getRatio = (w, h) => (h === 0 ? w : getRatio(h, w % h));
	    const ratio = getRatio(width, height);
	    return `${width / ratio}:${height / ratio}`;
	} */
	// Set aspect ratio for responsive container

	function setAspectRatio(input) {
	  var ratio = input;

	  if (!is.string(ratio) && !is.nullOrUndefined(this.embed)) {
	    ratio = this.embed.ratio;
	  }

	  if (!is.string(ratio)) {
	    ratio = this.config.ratio;
	  }

	  var _ratio$split$map = ratio.split(':').map(Number),
	      _ratio$split$map2 = _slicedToArray(_ratio$split$map, 2),
	      x = _ratio$split$map2[0],
	      y = _ratio$split$map2[1];

	  var padding = 100 / x * y;
	  this.elements.wrapper.style.paddingBottom = "".concat(padding, "%"); // For Vimeo we have an extra <div> to hide the standard controls and UI

	  if (this.isVimeo && this.supported.ui) {
	    var height = 240;
	    var offset = (height - padding) / (height / 50);
	    this.media.style.transform = "translateY(-".concat(offset, "%)");
	  }

	  return {
	    padding: padding,
	    ratio: ratio
	  };
	}

	var Listeners =
	/*#__PURE__*/
	function () {
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


	      if (!is.number(code)) {
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

	        if (is.element(focused)) {
	          var editable = player.config.selectors.editable;
	          var seek = elements.inputs.seek;

	          if (focused !== seek && matches(focused, editable)) {
	            return;
	          }

	          if (event.which === 32 && matches(focused, 'button, [role^="menuitem"]')) {
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
	              player.togglePlay();
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

	      this.focusTimer = setTimeout(function () {
	        var focused = document.activeElement; // Ignore if current focus element isn't inside the player

	        if (!elements.container.contains(focused)) {
	          return;
	        }

	        toggleClass(document.activeElement, player.config.classNames.tabFocus, true);
	      }, 10);
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

	      toggleListener.call(player, document.body, 'keydown focus blur', this.setTabFocus, toggle, false, true);
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
	        var controls$$1 = elements.controls; // Remove button states for fullscreen

	        if (controls$$1 && event.type === 'enterfullscreen') {
	          controls$$1.pressed = false;
	          controls$$1.hover = false;
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
	      }); // Force edge to repaint on exit fullscreen
	      // TODO: Fix weird bug where Edge doesn't re-draw when exiting fullscreen

	      /* if (browser.isEdge) {
	          on.call(player, elements.container, 'exitfullscreen', () => {
	              setTimeout(() => repaint(elements.container), 100);
	          });
	      } */
	      // Set a gutter for Vimeo

	      var setGutter = function setGutter(ratio, padding, toggle) {
	        if (!player.isVimeo) {
	          return;
	        }

	        var target = player.elements.wrapper.firstChild;

	        var _ratio$split$map = ratio.split(':').map(Number),
	            _ratio$split$map2 = _slicedToArray(_ratio$split$map, 2),
	            height = _ratio$split$map2[1];

	        var _player$embed$ratio$s = player.embed.ratio.split(':').map(Number),
	            _player$embed$ratio$s2 = _slicedToArray(_player$embed$ratio$s, 2),
	            videoWidth = _player$embed$ratio$s2[0],
	            videoHeight = _player$embed$ratio$s2[1];

	        target.style.maxWidth = toggle ? "".concat(height / videoHeight * videoWidth, "px") : null;
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
	        window.clearTimeout(timers.resized);
	        timers.resized = window.setTimeout(setPlayerSize, 50);
	      };

	      on.call(player, elements.container, 'enterfullscreen exitfullscreen', function (event) {
	        var _player$fullscreen = player.fullscreen,
	            target = _player$fullscreen.target,
	            usingNative = _player$fullscreen.usingNative; // Ignore for iOS native

	        if (!player.isEmbed || target !== elements.container) {
	          return;
	        }

	        var isEnter = event.type === 'enterfullscreen'; // Set the player size when entering fullscreen to viewport size

	        var _setPlayerSize = setPlayerSize(isEnter),
	            padding = _setPlayerSize.padding,
	            ratio = _setPlayerSize.ratio; // Set Vimeo gutter


	        setGutter(ratio, padding, isEnter); // If not using native fullscreen, we need to check for resizes of viewport

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
	      }); // Check for audio tracks on load
	      // We can't use `loadedmetadata` as it doesn't seem to have audio tracks at that point

	      on.call(player, player.media, 'canplay loadeddata', function () {
	        toggleHidden(elements.volume, !player.hasAudio);
	        toggleHidden(elements.buttons.mute, !player.hasAudio);
	      }); // Handle the media finishing

	      on.call(player, player.media, 'ended', function () {
	        // Show poster on end
	        if (player.isHTML5 && player.isVideo && player.config.resetOnEnd) {
	          // Restart
	          player.restart();
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

	        if (!is.element(wrapper)) {
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

	            _this.proxy(event, player.play, 'play');
	          } else {
	            _this.proxy(event, player.togglePlay, 'play');
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
	        controls.setDownloadLink.call(player);
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
	      var hasCustomHandler = is.function(customHandler);
	      var returned = true; // Execute custom handler

	      if (hasCustomHandler) {
	        returned = customHandler.call(player, event);
	      } // Only call default handler if not prevented in custom handler


	      if (returned && is.function(defaultHandler)) {
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
	      var hasCustomHandler = is.function(customHandler);
	      on.call(player, element, type, function (event) {
	        return _this2.proxy(event, defaultHandler, customHandlerKey);
	      }, passive && !hasCustomHandler);
	    } // Listen for control events

	  }, {
	    key: "controls",
	    value: function controls$$1() {
	      var _this3 = this;

	      var player = this.player;
	      var elements = player.elements; // IE doesn't support input event, so we fallback to change

	      var inputEvent = browser.isIE ? 'change' : 'input'; // Play/pause toggle

	      if (elements.buttons.play) {
	        Array.from(elements.buttons.play).forEach(function (button) {
	          _this3.bind(button, 'click', player.togglePlay, 'play');
	        });
	      } // Pause


	      this.bind(elements.buttons.restart, 'click', player.restart, 'restart'); // Rewind

	      this.bind(elements.buttons.rewind, 'click', player.rewind, 'rewind'); // Rewind

	      this.bind(elements.buttons.fastForward, 'click', player.forward, 'fastForward'); // Mute toggle

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

	        controls.toggleMenu.call(player, event);
	      }); // Settings menu - keyboard toggle
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

	        if (is.keyboardEvent(event) && code !== 39 && code !== 37) {
	          return;
	        } // Record seek time so we can prevent hiding controls for a few seconds after seek


	        player.lastSeekTime = Date.now(); // Was playing before?

	        var play = seek.hasAttribute(attribute); // Done seeking

	        var done = ['mouseup', 'touchend', 'keyup'].includes(event.type); // If we're done seeking and it was playing, resume playback

	        if (play && done) {
	          seek.removeAttribute(attribute);
	          player.play();
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

	        if (is.empty(seekTo)) {
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

	      this.bind(elements.progress, 'mouseleave click', function () {
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


	      if (player.config.toggleInvert && !is.element(elements.display.duration)) {
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
	      }); // Update controls.pressed state (used for ui.toggleControls to avoid hiding when interacting)

	      this.bind(elements.controls, 'mousedown mouseup touchstart touchend touchcancel', function (event) {
	        elements.controls.pressed = ['mousedown', 'touchstart'].includes(event.type);
	      }); // Show controls when they receive focus (e.g., when using keyboard tab key)

	      this.bind(elements.controls, 'focusin', function () {
	        var config = player.config,
	            elements = player.elements,
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

	var loadjs_umd = createCommonjsModule(function (module, exports) {
	(function(root, factory) {
	  {
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
	        // `cssText` (unless error is Code:18 SecurityError)
	        if (x.code != 18) result = 'e';
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
	function loadScript(url) {
	  return new Promise(function (resolve, reject) {
	    loadjs_umd(url, {
	      success: resolve,
	      error: reject
	    });
	  });
	}

	function parseId(url) {
	  if (is.empty(url)) {
	    return null;
	  }

	  if (is.number(Number(url))) {
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
	    var _this = this;

	    // Add embed class for responsive
	    toggleClass(this.elements.wrapper, this.config.classNames.embed, true); // Set intial ratio

	    setAspectRatio.call(this); // Load the API if not already

	    if (!is.object(window.Vimeo)) {
	      loadScript(this.config.urls.vimeo.sdk).then(function () {
	        vimeo.ready.call(_this);
	      }).catch(function (error) {
	        _this.debug.warn('Vimeo API failed to load', error);
	      });
	    } else {
	      vimeo.ready.call(this);
	    }
	  },
	  // API Ready
	  ready: function ready$$1() {
	    var _this2 = this;

	    var player = this;
	    var config = player.config.vimeo; // Get Vimeo params for the iframe

	    var params = buildUrlParams(extend({}, {
	      loop: player.config.loop.active,
	      autoplay: player.autoplay,
	      muted: player.muted,
	      gesture: 'media',
	      playsinline: !this.config.fullscreen.iosNative
	    }, config)); // Get the source URL or ID

	    var source = player.media.getAttribute('src'); // Get from <div> if needed

	    if (is.empty(source)) {
	      source = player.media.getAttribute(player.config.attributes.embed.id);
	    }

	    var id = parseId(source); // Build an iframe

	    var iframe = createElement('iframe');
	    var src = format(player.config.urls.vimeo.iframe, id, params);
	    iframe.setAttribute('src', src);
	    iframe.setAttribute('allowfullscreen', '');
	    iframe.setAttribute('allowtransparency', '');
	    iframe.setAttribute('allow', 'autoplay'); // Get poster, if already set

	    var poster = player.poster; // Inject the package

	    var wrapper = createElement('div', {
	      poster: poster,
	      class: player.config.classNames.embedContainer
	    });
	    wrapper.appendChild(iframe);
	    player.media = replaceElement(wrapper, player.media); // Get poster image

	    fetch(format(player.config.urls.vimeo.api, id), 'json').then(function (response) {
	      if (is.empty(response)) {
	        return;
	      } // Get the URL for thumbnail


	      var url = new URL(response[0].thumbnail_large); // Get original image

	      url.pathname = "".concat(url.pathname.split('_')[0], ".jpg"); // Set and show poster

	      ui.setPoster.call(player, url.href).catch(function () {});
	    }); // Setup instance
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
	        }).catch(function (error) {
	          // Hide menu item (and menu if empty)
	          if (error.name === 'Error') {
	            controls.setSpeedMenu.call(player, []);
	          }
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
	        var toggle = is.boolean(input) ? input : false;
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
	        var toggle = is.boolean(input) ? input : player.config.loop.active;
	        player.embed.setLoop(toggle).then(function () {
	          loop = toggle;
	        });
	      }
	    }); // Source

	    var currentSrc;
	    player.embed.getVideoUrl().then(function (value) {
	      currentSrc = value;
	      controls.setDownloadLink.call(player);
	    }).catch(function (error) {
	      _this2.debug.warn(error);
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

	      player.embed.ratio = "".concat(width, ":").concat(height);
	      setAspectRatio.call(_this2, player.embed.ratio);
	    }); // Set autopause

	    player.embed.setAutopause(player.config.autopause).then(function (state) {
	      player.config.autopause = state;
	    }); // Get title

	    player.embed.getVideoTitle().then(function (title) {
	      player.config.title = title;
	      ui.setTitle.call(_this2);
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

	      if (is.element(player.embed.element) && player.supported.ui) {
	        var frame = player.embed.element; // Fix keyboard focus issues
	        // https://github.com/sampotts/plyr/issues/317

	        frame.setAttribute('tabindex', -1);
	      }
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

	    setTimeout(function () {
	      return ui.build.call(player);
	    }, 0);
	  }
	};

	// ==========================================================================

	function parseId$1(url) {
	  if (is.empty(url)) {
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

	var youtube = {
	  setup: function setup() {
	    var _this = this;

	    // Add embed class for responsive
	    toggleClass(this.elements.wrapper, this.config.classNames.embed, true); // Set aspect ratio

	    setAspectRatio.call(this); // Setup API

	    if (is.object(window.YT) && is.function(window.YT.Player)) {
	      youtube.ready.call(this);
	    } else {
	      // Load the API
	      loadScript(this.config.urls.youtube.sdk).catch(function (error) {
	        _this.debug.warn('YouTube API failed to load', error);
	      }); // Setup callback for the API
	      // YouTube has it's own system of course...

	      window.onYouTubeReadyCallbacks = window.onYouTubeReadyCallbacks || []; // Add to queue

	      window.onYouTubeReadyCallbacks.push(function () {
	        youtube.ready.call(_this);
	      }); // Set callback to process queue

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
	    if (is.function(this.embed.getVideoData)) {
	      var _this$embed$getVideoD = this.embed.getVideoData(),
	          title = _this$embed$getVideoD.title;

	      if (is.empty(title)) {
	        this.config.title = title;
	        ui.setTitle.call(this);
	        return;
	      }
	    } // Or via Google API


	    var key = this.config.keys.google;

	    if (is.string(key) && !is.empty(key)) {
	      var url = format(this.config.urls.youtube.api, videoId, key);
	      fetch(url).then(function (result) {
	        if (is.object(result)) {
	          _this2.config.title = result.items[0].snippet.title;
	          ui.setTitle.call(_this2);
	        }
	      }).catch(function () {});
	    }
	  },
	  // API ready
	  ready: function ready$$1() {
	    var player = this; // Ignore already setup (race condition)

	    var currentId = player.media.getAttribute('id');

	    if (!is.empty(currentId) && currentId.startsWith('youtube-')) {
	      return;
	    } // Get the source URL or ID


	    var source = player.media.getAttribute('src'); // Get from <div> if needed

	    if (is.empty(source)) {
	      source = player.media.getAttribute(this.config.attributes.embed.id);
	    } // Replace the <iframe> with a <div> due to YouTube API issues


	    var videoId = parseId$1(source);
	    var id = generateId(player.provider); // Get poster, if already set

	    var poster = player.poster; // Replace media element

	    var container = createElement('div', {
	      id: id,
	      poster: poster
	    });
	    player.media = replaceElement(container, player.media); // Id to poster wrapper

	    var posterSrc = function posterSrc(format$$1) {
	      return "https://img.youtube.com/vi/".concat(videoId, "/").concat(format$$1, "default.jpg");
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
	    }).then(function (posterSrc) {
	      // If the image is padded, use background-size "cover" instead (like youtube does too with their posters)
	      if (!posterSrc.includes('maxres')) {
	        player.elements.poster.style.backgroundSize = 'cover';
	      }
	    }).catch(function () {});
	    var config = player.config.youtube; // Setup instance
	    // https://developers.google.com/youtube/iframe_api_reference

	    player.embed = new window.YT.Player(id, {
	      videoId: videoId,
	      host: config.noCookie ? 'https://www.youtube-nocookie.com' : undefined,
	      playerVars: extend({}, {
	        autoplay: player.config.autoplay ? 1 : 0,
	        // Autoplay
	        hl: player.config.hl,
	        // iframe interface language
	        controls: player.supported.ui ? 0 : 1,
	        // Only show controls if not fully supported
	        disablekb: 1,
	        // Disable keyboard as we handle it
	        playsinline: !player.config.fullscreen.iosNative ? 1 : 0,
	        // Allow iOS inline playback
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
	          if (is.function(player.media.play)) {
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
	              var toggle = is.boolean(input) ? input : muted;
	              muted = toggle;
	              instance[toggle ? 'mute' : 'unMute']();
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

	          player.options.speed = instance.getAvailablePlaybackRates(); // Set the tabindex to avoid focus entering iframe

	          if (player.supported.ui) {
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

	          setTimeout(function () {
	            return ui.build.call(player);
	          }, 50);
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
	              if (player.media.paused && !player.embed.hasPlayed) {
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

	            default:
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

	      wrap(this.media, this.elements.wrapper); // Faux poster container

	      this.elements.poster = createElement('div', {
	        class: this.config.classNames.poster
	      });
	      this.elements.wrapper.appendChild(this.elements.poster);
	    }

	    if (this.isHTML5) {
	      html5.extend.call(this);
	    } else if (this.isYouTube) {
	      youtube.setup.call(this);
	    } else if (this.isVimeo) {
	      vimeo.setup.call(this);
	    }
	  }
	};

	var Ads =
	/*#__PURE__*/
	function () {
	  /**
	   * Ads constructor.
	   * @param {object} player
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

	      if (this.enabled) {
	        // Check if the Google IMA3 SDK is loaded or load it ourselves
	        if (!is.object(window.google) || !is.object(window.google.ima)) {
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
	    }
	    /**
	     * Get the ads instance ready
	     */

	  }, {
	    key: "ready",
	    value: function ready$$1() {
	      var _this3 = this;

	      // Start ticking our safety timer. If the whole advertisement
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
	      // Create the container for our advertisements
	      this.elements.container = createElement('div', {
	        class: this.player.config.classNames.ads
	      });
	      this.player.elements.container.appendChild(this.elements.container); // So we can run VPAID2

	      google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED); // Set language

	      google.ima.settings.setLocale(this.player.config.ads.language); // Set playback for iOS10+

	      google.ima.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playsinline); // We assume the adContainer is the video container of the plyr element that will house the ads

	      this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container, this.player.media); // Request video ads to be pre-loaded

	      this.requestAds();
	    }
	    /**
	     * Request advertisements
	     */

	  }, {
	    key: "requestAds",
	    value: function requestAds() {
	      var _this4 = this;

	      var container = this.player.elements.container;

	      try {
	        // Create ads loader
	        this.loader = new google.ima.AdsLoader(this.elements.displayContainer); // Listen and respond to ads loaded and error events

	        this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (event) {
	          return _this4.onAdsManagerLoaded(event);
	        }, false);
	        this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (error) {
	          return _this4.onAdError(error);
	        }, false); // Request video ads

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
	     * @param {boolean} start
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

	      this.cuePoints = this.manager.getCuePoints(); // Set volume to match player

	      this.manager.setVolume(this.player.volume); // Add listeners to the required events
	      // Advertisement error events

	      this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (error) {
	        return _this6.onAdError(error);
	      }); // Advertisement regular events

	      Object.keys(google.ima.AdEvent.Type).forEach(function (type) {
	        _this6.manager.addEventListener(google.ima.AdEvent.Type[type], function (event) {
	          return _this6.onAdEvent(event);
	        });
	      }); // Resolve our adsManager

	      this.trigger('loaded');
	    }
	  }, {
	    key: "addCuePoints",
	    value: function addCuePoints() {
	      var _this7 = this;

	      // Add advertisement cue's within the time line if available
	      if (!is.empty(this.cuePoints)) {
	        this.cuePoints.forEach(function (cuePoint) {
	          if (cuePoint !== 0 && cuePoint !== -1 && cuePoint < _this7.player.duration) {
	            var seekElement = _this7.player.elements.progress;

	            if (is.element(seekElement)) {
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
	        var event = "ads".concat(type.replace(/_/g, '').toLowerCase());
	        triggerEvent.call(_this8.player, _this8.player.media, event);
	      };

	      switch (event.type) {
	        case google.ima.AdEvent.Type.LOADED:
	          // This is the first event sent for an ad - it is possible to determine whether the
	          // ad is a video ad or an overlay
	          this.trigger('loaded'); // Bubble event

	          dispatchEvent(event.type); // Start countdown

	          this.pollCountdown(true);

	          if (!ad.isLinear()) {
	            // Position AdDisplayContainer correctly for overlay
	            ad.width = container.offsetWidth;
	            ad.height = container.offsetHeight;
	          } // console.info('Ad type: ' + event.getAd().getAdPodInfo().getPodIndex());
	          // console.info('Ad time: ' + event.getAd().getAdPodInfo().getTimeOffset());


	          break;

	        case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
	          // All ads for the current videos are done. We can now request new advertisements
	          // in case the video is re-played
	          // Fire event
	          dispatchEvent(event.type); // TODO: Example for what happens when a next video in a playlist would be loaded.
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

	        case google.ima.AdEvent.Type.LOG:
	          if (adData.adError) {
	            this.player.debug.warn("Non-fatal ad error: ".concat(adData.adError.getMessage()));
	          }

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

	        if (is.empty(_this9.cuePoints)) {
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
	        // Initialize the container. Must be done via a user action on mobile devices
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

	      this.player.media.play();
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
	        }); // Now request some new advertisements

	        _this11.requestAds();
	      }).catch(function () {});
	    }
	    /**
	     * Handles callbacks after an ad event was invoked
	     * @param {string} event - Event type
	     */

	  }, {
	    key: "trigger",
	    value: function trigger(event) {
	      var _this12 = this;

	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var handlers = this.events[event];

	      if (is.array(handlers)) {
	        handlers.forEach(function (handler) {
	          if (is.function(handler)) {
	            handler.apply(_this12, args);
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
	    key: "on",
	    value: function on$$1(event, callback) {
	      if (!is.array(this.events[event])) {
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
	     * @param {string} from
	     */

	  }, {
	    key: "clearSafetyTimer",
	    value: function clearSafetyTimer(from) {
	      if (!is.nullOrUndefined(this.safetyTimer)) {
	        this.player.debug.log("Safety timer cleared from: ".concat(from));
	        clearTimeout(this.safetyTimer);
	        this.safetyTimer = null;
	      }
	    }
	  }, {
	    key: "enabled",
	    get: function get() {
	      var config = this.config;
	      return this.player.isHTML5 && this.player.isVideo && config.enabled && (!is.empty(config.publisherId) || is.url(config.tagUrl));
	    }
	  }, {
	    key: "tagUrl",
	    get: function get() {
	      var config = this.config;

	      if (is.url(config.tagUrl)) {
	        return config.tagUrl;
	      }

	      var params = {
	        AV_PUBLISHERID: '58c25bb0073ef448b1087ad6',
	        AV_CHANNELID: '5a0458dc28a06145e4519d21',
	        AV_URL: window.location.hostname,
	        cb: Date.now(),
	        AV_WIDTH: 640,
	        AV_HEIGHT: 480,
	        AV_CDIM2: this.publisherId
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
	      if (!is.number(result.startTime)) {
	        // The line with start and end times on it is the first line of interest
	        var matchTimes = line.match(/([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{2,3})/); // Note that this currently ignores caption formatting directives that are optionally on the end of this line - fine for non-captions VTT

	        if (matchTimes) {
	          result.startTime = Number(matchTimes[1]) * 60 * 60 + Number(matchTimes[2]) * 60 + Number(matchTimes[3]) + Number("0.".concat(matchTimes[4]));
	          result.endTime = Number(matchTimes[6]) * 60 * 60 + Number(matchTimes[7]) * 60 + Number(matchTimes[8]) + Number("0.".concat(matchTimes[9]));
	        }
	      } else if (!is.empty(line.trim()) && is.empty(result.text)) {
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


	var PreviewThumbnails =
	/*#__PURE__*/
	function () {
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

	      // Togglethe regular seek tooltip
	      if (this.player.elements.display.seekTooltip) {
	        this.player.elements.display.seekTooltip.hidden = this.enabled;
	      }

	      if (!this.enabled) {
	        return;
	      }

	      this.getThumbnails().then(function () {
	        // Render DOM elements
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

	        if (is.empty(src)) {
	          throw new Error('Missing previewThumbnails.src config attribute');
	        } // If string, convert into single-element list


	        var urls = is.string(src) ? [src] : src; // Loop through each src URL. Download and process the VTT file, storing the resulting data in this.thumbnails

	        var promises = urls.map(function (u) {
	          return _this2.getThumbnail(u);
	        });
	        Promise.all(promises).then(function () {
	          // Sort smallest to biggest (e.g., [120p, 480p, 1080p])
	          _this2.thumbnails.sort(function (x, y) {
	            return x.height - y.height;
	          });

	          _this2.player.debug.log('Preview thumbnails', _this2.thumbnails);

	          resolve();
	        });
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

	          if (!thumbnail.frames[0].text.startsWith('/')) {
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

	      if (!is.event(event) || !['touchmove', 'mousemove'].includes(event.type)) {
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
	      // Only act on left mouse button (0), or touch device (event.button is false)
	      if (event.button === false || event.button === 0) {
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

	      this.player.elements.progress.appendChild(this.elements.thumb.container); // Create HTML element: plyr__preview-scrubbing-container

	      this.elements.scrubbing.container = createElement('div', {
	        class: this.player.config.classNames.previewThumbnails.scrubbingContainer
	      });
	      this.player.elements.wrapper.appendChild(this.elements.scrubbing.container);
	    }
	  }, {
	    key: "showImageAtCurrentTime",
	    value: function showImageAtCurrentTime() {
	      var _this6 = this;

	      if (this.mouseDown) {
	        this.setScrubbingContainerSize();
	      } else {
	        this.toggleThumbContainer(true);
	        this.setThumbContainerSizeAndPos();
	      } // Find the desired thumbnail index
	      // TODO: Handle a video longer than the thumbs where thumbNum is null


	      var thumbNum = this.thumbnails[0].frames.findIndex(function (frame) {
	        return _this6.seekTime >= frame.startTime && _this6.seekTime <= frame.endTime;
	      });
	      var hasThumb = thumbNum >= 0;
	      var qualityIndex = 0;
	      this.toggleThumbContainer(hasThumb); // No matching thumb found

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
	      if (this.elements.thumb.imageContainer.clientHeight > 20) {
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
	      this.elements.scrubbing.container.style.width = "".concat(this.player.media.clientWidth, "px"); // Can't use media.clientHeight - html5 video goes big and does black bars above and below

	      this.elements.scrubbing.container.style.height = "".concat(this.player.media.clientWidth / this.thumbAspectRatio, "px");
	    } // Sprites need to be offset to the correct location

	  }, {
	    key: "setImageSizeAndOffset",
	    value: function setImageSizeAndOffset(previewImage, frame) {
	      if (!this.usingSprites) {
	        return;
	      } // Find difference between height and preview container height


	      var multiplier = this.thumbContainerHeight / frame.h;
	      previewImage.style.height = "".concat(Math.floor(previewImage.naturalHeight * multiplier), "px");
	      previewImage.style.width = "".concat(Math.floor(previewImage.naturalWidth * multiplier), "px");
	      previewImage.style.left = "-".concat(frame.x * multiplier, "px");
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
	        // Can't use media.clientHeight - HTML5 video goes big and does black bars above and below
	        return Math.floor(this.player.media.clientWidth / this.thumbAspectRatio);
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

	    if (is.string(attributes)) {
	      insertElement(type, this.media, {
	        src: attributes
	      });
	    } else if (is.array(attributes)) {
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

	      if (is.element(_this2.elements.container)) {
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


	      if (is.boolean(input.autoplay)) {
	        _this2.config.autoplay = input.autoplay;
	      } // Set attributes for audio and video


	      if (_this2.isHTML5) {
	        if (_this2.config.crossorigin) {
	          _this2.media.setAttribute('crossorigin', '');
	        }

	        if (_this2.config.autoplay) {
	          _this2.media.setAttribute('autoplay', '');
	        }

	        if (!is.empty(input.poster)) {
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
	      } // Reload thumbnails


	      if (_this2.previewThumbnails) {
	        _this2.previewThumbnails.load();
	      } // Update the fullscreen support


	      _this2.fullscreen.update();
	    }, true);
	  }
	};

	// TODO: Use a WeakMap for private globals
	// const globals = new WeakMap();
	// Plyr instance

	var Plyr =
	/*#__PURE__*/
	function () {
	  function Plyr(target, options) {
	    var _this = this;

	    _classCallCheck(this, Plyr);

	    this.timers = {}; // State

	    this.ready = false;
	    this.loading = false;
	    this.failed = false; // Touch device

	    this.touch = support.touch; // Set the media element

	    this.media = target; // String selector passed

	    if (is.string(this.media)) {
	      this.media = document.querySelectorAll(this.media);
	    } // jQuery, NodeList or Array passed, use first element


	    if (window.jQuery && this.media instanceof jQuery || is.nodeList(this.media) || is.array(this.media)) {
	      // eslint-disable-next-line
	      this.media = this.media[0];
	    } // Set config


	    this.config = extend({}, defaults, Plyr.defaults, options || {}, function () {
	      try {
	        return JSON.parse(_this.media.getAttribute('data-plyr-config'));
	      } catch (e) {
	        return {};
	      }
	    }()); // Elements cache

	    this.elements = {
	      container: null,
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

	    if (is.nullOrUndefined(this.media) || !is.element(this.media)) {
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

	        if (is.element(iframe)) {
	          // Detect provider
	          url = parseUrl$2(iframe.getAttribute('src'));
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


	        if (is.empty(this.provider) || !Object.keys(providers).includes(this.provider)) {
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

	    if (!is.element(this.elements.container)) {
	      this.elements.container = createElement('div', {
	        tabindex: 0
	      });
	      wrap(this.media, this.elements.container);
	    } // Add style hook


	    ui.addStyleHook.call(this); // Setup media

	    media.setup.call(this); // Listen for events if debugging

	    if (this.config.debug) {
	      on.call(this, this.elements.container, this.config.events.join(' '), function (event) {
	        _this.debug.log("event: ".concat(event.type));
	      });
	    } // Setup interface
	    // If embed but not fully supported, build interface now to avoid flash of controls


	    if (this.isHTML5 || this.isEmbed && !this.supported.ui) {
	      ui.build.call(this);
	    } // Container listeners


	    this.listeners.container(); // Global listeners

	    this.listeners.global(); // Setup fullscreen

	    this.fullscreen = new Fullscreen(this); // Setup ads if provided

	    if (this.config.ads.enabled) {
	      this.ads = new Ads(this);
	    } // Autoplay if required


	    if (this.config.autoplay) {
	      this.play();
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

	      if (!is.function(this.media.play)) {
	        return null;
	      } // Intecept play with ads


	      if (this.ads && this.ads.enabled) {
	        this.ads.managerPromise.then(function () {
	          return _this2.ads.play();
	        }).catch(function () {
	          return _this2.media.play();
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
	      if (!this.playing || !is.function(this.media.pause)) {
	        return;
	      }

	      this.media.pause();
	    }
	    /**
	     * Get playing state
	     */

	  }, {
	    key: "togglePlay",

	    /**
	     * Toggle playback based on current status
	     * @param {boolean} input
	     */
	    value: function togglePlay(input) {
	      // Toggle based on current state if nothing passed
	      var toggle = is.boolean(input) ? input : !this.playing;

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
	    key: "stop",
	    value: function stop() {
	      if (this.isHTML5) {
	        this.pause();
	        this.restart();
	      } else if (is.function(this.media.stop)) {
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
	     * @param {number} seekTime - how far to rewind in seconds. Defaults to the config.seekTime
	     */

	  }, {
	    key: "rewind",
	    value: function rewind(seekTime) {
	      this.currentTime = this.currentTime - (is.number(seekTime) ? seekTime : this.config.seekTime);
	    }
	    /**
	     * Fast forward
	     * @param {number} seekTime - how far to fast forward in seconds. Defaults to the config.seekTime
	     */

	  }, {
	    key: "forward",
	    value: function forward(seekTime) {
	      this.currentTime = this.currentTime + (is.number(seekTime) ? seekTime : this.config.seekTime);
	    }
	    /**
	     * Seek to a time
	     * @param {number} input - where to seek to in seconds. Defaults to 0 (the start)
	     */

	  }, {
	    key: "increaseVolume",

	    /**
	     * Increase volume
	     * @param {boolean} step - How much to decrease by (between 0 and 1)
	     */
	    value: function increaseVolume(step) {
	      var volume = this.media.muted ? 0 : this.volume;
	      this.volume = volume + (is.number(step) ? step : 0);
	    }
	    /**
	     * Decrease volume
	     * @param {boolean} step - How much to decrease by (between 0 and 1)
	     */

	  }, {
	    key: "decreaseVolume",
	    value: function decreaseVolume(step) {
	      this.increaseVolume(-step);
	    }
	    /**
	     * Set muted state
	     * @param {boolean} mute
	     */

	  }, {
	    key: "toggleCaptions",

	    /**
	     * Toggle captions
	     * @param {boolean} input - Whether to enable captions
	     */
	    value: function toggleCaptions(input) {
	      captions.toggle.call(this, input, false);
	    }
	    /**
	     * Set the caption track by index
	     * @param {number} - Caption index
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
	     * @param {boolean} [toggle] - Whether to show the controls
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

	        if (hiding && this.config.controls.includes('settings') && !is.empty(this.config.settings)) {
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
	     * @param {string} event - Event type
	     * @param {function} callback - Callback for when event occurs
	     */

	  }, {
	    key: "on",
	    value: function on$$1(event, callback) {
	      on.call(this, this.elements.container, event, callback);
	    }
	    /**
	     * Add event listeners once
	     * @param {string} event - Event type
	     * @param {function} callback - Callback for when event occurs
	     */

	  }, {
	    key: "once",
	    value: function once$$1(event, callback) {
	      once.call(this, this.elements.container, event, callback);
	    }
	    /**
	     * Remove event listeners
	     * @param {string} event - Event type
	     * @param {function} callback - Callback for when event occurs
	     */

	  }, {
	    key: "off",
	    value: function off$$1(event, callback) {
	      off(this.elements.container, event, callback);
	    }
	    /**
	     * Destroy an instance
	     * Event listeners are removed when elements are removed
	     * http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
	     * @param {function} callback - Callback for when destroy is complete
	     * @param {boolean} soft - Whether it's a soft destroy (for source changes etc)
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


	          if (is.function(callback)) {
	            callback();
	          }
	        } else {
	          // Unbind listeners
	          unbindListeners.call(_this3); // Replace the container with the original element provided

	          replaceElement(_this3.elements.original, _this3.elements.container); // Event

	          triggerEvent.call(_this3, _this3.elements.original, 'destroyed', true); // Callback

	          if (is.function(callback)) {
	            callback.call(_this3.elements.original);
	          } // Reset state


	          _this3.ready = false; // Clear for garbage collection

	          setTimeout(function () {
	            _this3.elements = null;
	            _this3.media = null;
	          }, 200);
	        }
	      }; // Stop playback


	      this.stop(); // Provider specific stuff

	      if (this.isHTML5) {
	        // Clear timeout
	        clearTimeout(this.timers.loading); // Restore native video controls

	        ui.toggleNativeControls.call(this, true); // Clean up

	        done();
	      } else if (this.isYouTube) {
	        // Clear timers
	        clearInterval(this.timers.buffering);
	        clearInterval(this.timers.playing); // Destroy YouTube API

	        if (this.embed !== null && is.function(this.embed.destroy)) {
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
	     * @param {string} type - Mime type
	     */

	  }, {
	    key: "supports",
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
	    key: "isHTML5",
	    get: function get() {
	      return Boolean(this.provider === providers.html5);
	    }
	  }, {
	    key: "isEmbed",
	    get: function get() {
	      return Boolean(this.isYouTube || this.isVimeo);
	    }
	  }, {
	    key: "isYouTube",
	    get: function get() {
	      return Boolean(this.provider === providers.youtube);
	    }
	  }, {
	    key: "isVimeo",
	    get: function get() {
	      return Boolean(this.provider === providers.vimeo);
	    }
	  }, {
	    key: "isVideo",
	    get: function get() {
	      return Boolean(this.type === types.video);
	    }
	  }, {
	    key: "isAudio",
	    get: function get() {
	      return Boolean(this.type === types.audio);
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


	      var inputIsValid = is.number(input) && input > 0; // Set

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

	      if (is.number(buffered)) {
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
	      var duration = !is.number(realDuration) || realDuration === Infinity ? 0 : realDuration; // If config duration is funky, use regular duration

	      return fauxDuration || duration;
	    }
	    /**
	     * Set the player volume
	     * @param {number} value - must be between 0 and 1. Defaults to the value from local storage and config.volume if not set in storage
	     */

	  }, {
	    key: "volume",
	    set: function set(value) {
	      var volume = value;
	      var max = 1;
	      var min = 0;

	      if (is.string(volume)) {
	        volume = Number(volume);
	      } // Load volume from storage if no value specified


	      if (!is.number(volume)) {
	        volume = this.storage.get('volume');
	      } // Use config if all else fails


	      if (!is.number(volume)) {
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

	      if (!is.empty(value) && this.muted && volume > 0) {
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

	      if (!is.boolean(toggle)) {
	        toggle = this.storage.get('muted');
	      } // Use config if all else fails


	      if (!is.boolean(toggle)) {
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
	     * @param {number} speed - the speed of playback (0.5-2.0)
	     */

	  }, {
	    key: "speed",
	    set: function set(input) {
	      var speed = null;

	      if (is.number(input)) {
	        speed = input;
	      }

	      if (!is.number(speed)) {
	        speed = this.storage.get('speed');
	      }

	      if (!is.number(speed)) {
	        speed = this.config.speed.selected;
	      } // Set min/max


	      if (speed < 0.1) {
	        speed = 0.1;
	      }

	      if (speed > 2.0) {
	        speed = 2.0;
	      }

	      if (!this.config.speed.options.includes(speed)) {
	        this.debug.warn("Unsupported speed (".concat(speed, ")"));
	        return;
	      } // Update config


	      this.config.speed.selected = speed; // Set media speed

	      this.media.playbackRate = speed;
	    }
	    /**
	     * Get current playback speed
	     */
	    ,
	    get: function get() {
	      return Number(this.media.playbackRate);
	    }
	    /**
	     * Set playback quality
	     * Currently HTML5 & YouTube only
	     * @param {number} input - Quality level
	     */

	  }, {
	    key: "quality",
	    set: function set(input) {
	      var config = this.config.quality;
	      var options = this.options.quality;

	      if (!options.length) {
	        return;
	      }

	      var quality = [!is.empty(input) && Number(input), this.storage.get('quality'), config.selected, config.default].find(is.number);
	      var updateStorage = true;

	      if (!options.includes(quality)) {
	        var value = closest(options, quality);
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
	     * @param {boolean} input - Whether to loop or not
	     */

	  }, {
	    key: "loop",
	    set: function set(input) {
	      var toggle = is.boolean(input) ? input : this.config.loop.active;
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
	     * @param {object} input - The new source object (see docs)
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
	      return is.url(download) ? download : this.source;
	    }
	    /**
	     * Set the poster image for a video
	     * @param {input} - the URL for the new poster image
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

	      return this.media.getAttribute('poster');
	    }
	    /**
	     * Set the autoplay state
	     * @param {boolean} input - Whether to autoplay or not
	     */

	  }, {
	    key: "autoplay",
	    set: function set(input) {
	      var toggle = is.boolean(input) ? input : this.config.autoplay;
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
	     * @param {string} - Two character ISO language code (e.g. EN, FR, PT, etc)
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


	      var toggle = is.boolean(input) ? input : !this.pip; // Toggle based on current state
	      // Safari

	      if (is.function(this.media.webkitSetPresentationMode)) {
	        this.media.webkitSetPresentationMode(toggle ? pip.active : pip.inactive);
	      } // Chrome


	      if (is.function(this.media.requestPictureInPicture)) {
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


	      if (!is.empty(this.media.webkitPresentationMode)) {
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
	     * @param {string} url - URL for the SVG sprite
	     * @param {string} [id] - Unique ID
	     */

	  }, {
	    key: "loadSprite",
	    value: function loadSprite$$1(url, id) {
	      return loadSprite(url, id);
	    }
	    /**
	     * Setup multiple instances
	     * @param {*} selector
	     * @param {object} options
	     */

	  }, {
	    key: "setup",
	    value: function setup(selector) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var targets = null;

	      if (is.string(selector)) {
	        targets = Array.from(document.querySelectorAll(selector));
	      } else if (is.nodeList(selector)) {
	        targets = Array.from(selector);
	      } else if (is.array(selector)) {
	        targets = selector.filter(is.element);
	      }

	      if (is.empty(targets)) {
	        return null;
	      }

	      return targets.map(function (t) {
	        return new Plyr(t, options);
	      });
	    }
	  }]);

	  return Plyr;
	}();

	Plyr.defaults = cloneDeep(defaults);

	// ==========================================================================

	(function () {
	  var host = window.location.host;
	  var env = {
	    prod: host === 'plyr.io',
	    dev: host === 'dev.plyr.io'
	  };
	  document.addEventListener('DOMContentLoaded', function () {
	    singleton.context(function () {
	      var selector = '#player';
	      var container = document.getElementById('container');

	      if (window.shr) {
	        window.shr.setup({
	          count: {
	            classname: 'button__count'
	          }
	        });
	      } // Setup tab focus


	      var tabClassName = 'tab-focus'; // Remove class on blur

	      document.addEventListener('focusout', function (event) {
	        if (!event.target.classList || container.contains(event.target)) {
	          return;
	        }

	        event.target.classList.remove(tabClassName);
	      }); // Add classname to tabbed elements

	      document.addEventListener('keydown', function (event) {
	        if (event.keyCode !== 9) {
	          return;
	        } // Delay the adding of classname until the focus has changed
	        // This event fires before the focusin event


	        setTimeout(function () {
	          var focused = document.activeElement;

	          if (!focused || !focused.classList || container.contains(focused)) {
	            return;
	          }

	          focused.classList.add(tabClassName);
	        }, 10);
	      });
	      var userType = 'annon';
	      var contentType = 'on-demand';
	      var cmsid = 2490180;
	      var vid = 3788;
	      var tagUrl = "https://pubads.g.doubleclick.net/gampad/live/ads?sz=640x360&iu=/21736521837/ovo/web&impl=s&gdfp_req=1&env=vp&output=vast&cust_params=usergroup%3D".concat(userType, "%26content-type%3D").concat(contentType, "&cmsid=").concat(cmsid, "&vid=").concat(vid); // Setup the player

	      var player = new Plyr(selector, {
	        debug: true,
	        title: 'View From A Blue Moon',
	        iconUrl: 'dist/plyr.svg',
	        keyboard: {
	          global: true
	        },
	        tooltips: {
	          controls: true
	        },
	        captions: {
	          active: true
	        },
	        keys: {
	          google: 'AIzaSyDrNwtN3nLH_8rjCmu5Wq3ZCm4MNAVdc0c'
	        },
	        ads: {
	          enabled: true,
	          // env.prod || env.dev,
	          tagUrl: tagUrl
	        },
	        previewThumbnails: {
	          enabled: true,
	          src: ['https://cdn.plyr.io/static/demo/thumbs/100p.vtt', 'https://cdn.plyr.io/static/demo/thumbs/240p.vtt']
	        }
	      }); // Expose for tinkering in the console

	      window.player = player; // Setup type toggle

	      var buttons = document.querySelectorAll('[data-source]');
	      var types = {
	        video: 'video',
	        audio: 'audio',
	        youtube: 'youtube',
	        vimeo: 'vimeo'
	      };
	      var currentType = window.location.hash.replace('#', '');
	      var historySupport = window.history && window.history.pushState; // Toggle class on an element

	      function toggleClass(element, className, state) {
	        if (element) {
	          element.classList[state ? 'add' : 'remove'](className);
	        }
	      } // Set a new source


	      function newSource(type, init) {
	        // Bail if new type isn't known, it's the current type, or current type is empty (video is default) and new type is video
	        if (!(type in types) || !init && type === currentType || !currentType.length && type === types.video) {
	          return;
	        }

	        switch (type) {
	          case types.video:
	            player.source = {
	              type: 'video',
	              title: 'View From A Blue Moon',
	              sources: [{
	                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
	                type: 'video/mp4',
	                size: 576
	              }, {
	                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
	                type: 'video/mp4',
	                size: 720
	              }, {
	                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
	                type: 'video/mp4',
	                size: 1080
	              }, {
	                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1440p.mp4',
	                type: 'video/mp4',
	                size: 1440
	              }],
	              poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
	              tracks: [{
	                kind: 'captions',
	                label: 'English',
	                srclang: 'en',
	                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
	                default: true
	              }, {
	                kind: 'captions',
	                label: 'French',
	                srclang: 'fr',
	                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt'
	              }]
	            };
	            break;

	          case types.audio:
	            player.source = {
	              type: 'audio',
	              title: 'Kishi Bashi &ndash; &ldquo;It All Began With A Burst&rdquo;',
	              sources: [{
	                src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3',
	                type: 'audio/mp3'
	              }, {
	                src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg',
	                type: 'audio/ogg'
	              }]
	            };
	            break;

	          case types.youtube:
	            player.source = {
	              type: 'video',
	              sources: [{
	                src: 'https://youtube.com/watch?v=bTqVqk7FSmY',
	                provider: 'youtube'
	              }]
	            };
	            break;

	          case types.vimeo:
	            player.source = {
	              type: 'video',
	              sources: [{
	                src: 'https://vimeo.com/76979871',
	                provider: 'vimeo'
	              }]
	            };
	            break;

	          default:
	            break;
	        } // Set the current type for next time


	        currentType = type; // Remove active classes

	        Array.from(buttons).forEach(function (button) {
	          return toggleClass(button.parentElement, 'active', false);
	        }); // Set active on parent

	        toggleClass(document.querySelector("[data-source=\"".concat(type, "\"]")), 'active', true); // Show cite

	        Array.from(document.querySelectorAll('.plyr__cite')).forEach(function (cite) {
	          cite.setAttribute('hidden', '');
	        });
	        document.querySelector(".plyr__cite--".concat(type)).removeAttribute('hidden');
	      } // Bind to each button


	      Array.from(buttons).forEach(function (button) {
	        button.addEventListener('click', function () {
	          var type = button.getAttribute('data-source');
	          newSource(type);

	          if (historySupport) {
	            window.history.pushState({
	              type: type
	            }, '', "#".concat(type));
	          }
	        });
	      }); // List for backwards/forwards

	      window.addEventListener('popstate', function (event) {
	        if (event.state && 'type' in event.state) {
	          newSource(event.state.type);
	        }
	      }); // On load

	      if (historySupport) {
	        var video = !currentType.length; // If there's no current type set, assume video

	        if (video) {
	          currentType = types.video;
	        } // Replace current history state


	        if (currentType in types) {
	          window.history.replaceState({
	            type: currentType
	          }, '', video ? '' : "#".concat(currentType));
	        } // If it's not video, load the source


	        if (currentType !== types.video) {
	          newSource(currentType, true);
	        }
	      }
	    });
	  }); // Raven / Sentry
	  // For demo site (https://plyr.io) only

	  if (env.prod) {
	    singleton.config('https://d4ad9866ad834437a4754e23937071e4@sentry.io/305555').install();
	  }
	})();

}());
