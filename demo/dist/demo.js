typeof navigator === "object" && (function () {
  'use strict';

  // Setup tab focus
  const container = document.getElementById('container');
  const tabClassName = 'tab-focus'; // Remove class on blur

  document.addEventListener('focusout', event => {
    if (!event.target.classList || container.contains(event.target)) {
      return;
    }

    event.target.classList.remove(tabClassName);
  }); // Add classname to tabbed elements

  document.addEventListener('keydown', event => {
    if (event.keyCode !== 9) {
      return;
    } // Delay the adding of classname until the focus has changed
    // This event fires before the focusin event


    setTimeout(() => {
      const focused = document.activeElement;

      if (!focused || !focused.classList || container.contains(focused)) {
        return;
      }

      focused.classList.add(tabClassName);
    }, 10);
  });

  // Polyfill for creating CustomEvents on IE9/10/11
  // code pulled from:
  // https://github.com/d4tocchini/customevent-polyfill
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill
  (function () {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      var ce = new window.CustomEvent('test', {
        cancelable: true
      });
      ce.preventDefault();

      if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error('Could not prevent default');
      }
    } catch (e) {
      var CustomEvent = function (event, params) {
        var evt, origPrevent;
        params = params || {};
        params.bubbles = !!params.bubbles;
        params.cancelable = !!params.cancelable;
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        origPrevent = evt.preventDefault;

        evt.preventDefault = function () {
          origPrevent.call(this);

          try {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function () {
                return true;
              }
            });
          } catch (e) {
            this.defaultPrevented = true;
          }
        };

        return evt;
      };

      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent; // expose definition to window
    }
  })();

  var ceil$1 = Math.ceil;
  var floor$5 = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger$1 = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$5 : ceil$1)(argument);
  };

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$1 = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod$3 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible$1($this));
      var position = toInteger$1(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING ? S.charAt(position) : first
          : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte$1 = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$3(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$3(true)
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var check$1 = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1$1 =
    // eslint-disable-next-line no-undef
    check$1(typeof globalThis == 'object' && globalThis) ||
    check$1(typeof window == 'object' && window) ||
    check$1(typeof self == 'object' && self) ||
    check$1(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func
    Function('return this')();

  var fails$1 = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var descriptors$1 = !fails$1(function () {
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var isObject$3 = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var document$2 = global_1$1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject$3(document$2) && isObject$3(document$2.createElement);

  var documentCreateElement$1 = function (it) {
    return EXISTS$1 ? document$2.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine$1 = !descriptors$1 && !fails$1(function () {
    return Object.defineProperty(documentCreateElement$1('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var anObject$1 = function (it) {
    if (!isObject$3(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  // `ToPrimitive` abstract operation
  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive$1 = function (input, PREFERRED_STRING) {
    if (!isObject$3(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$3(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject$3(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$3(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var nativeDefineProperty$1 = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  var f$9 = descriptors$1 ? nativeDefineProperty$1 : function defineProperty(O, P, Attributes) {
    anObject$1(O);
    P = toPrimitive$1(P, true);
    anObject$1(Attributes);
    if (ie8DomDefine$1) try {
      return nativeDefineProperty$1(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty$1 = {
  	f: f$9
  };

  var createPropertyDescriptor$1 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var createNonEnumerableProperty$1 = descriptors$1 ? function (object, key, value) {
    return objectDefineProperty$1.f(object, key, createPropertyDescriptor$1(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal$1 = function (key, value) {
    try {
      createNonEnumerableProperty$1(global_1$1, key, value);
    } catch (error) {
      global_1$1[key] = value;
    } return value;
  };

  var SHARED$1 = '__core-js_shared__';
  var store$3 = global_1$1[SHARED$1] || setGlobal$1(SHARED$1, {});

  var sharedStore$1 = store$3;

  var functionToString$1 = Function.toString;

  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
  if (typeof sharedStore$1.inspectSource != 'function') {
    sharedStore$1.inspectSource = function (it) {
      return functionToString$1.call(it);
    };
  }

  var inspectSource$1 = sharedStore$1.inspectSource;

  var WeakMap$4 = global_1$1.WeakMap;

  var nativeWeakMap$1 = typeof WeakMap$4 === 'function' && /native code/.test(inspectSource$1(WeakMap$4));

  var hasOwnProperty$1 = {}.hasOwnProperty;

  var has$3 = function (it, key) {
    return hasOwnProperty$1.call(it, key);
  };

  var isPure$1 = false;

  var shared$1 = createCommonjsModule(function (module) {
  (module.exports = function (key, value) {
    return sharedStore$1[key] || (sharedStore$1[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.6.5',
    mode: 'global',
    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id$1 = 0;
  var postfix$1 = Math.random();

  var uid$1 = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id$1 + postfix$1).toString(36);
  };

  var keys$1 = shared$1('keys');

  var sharedKey$1 = function (key) {
    return keys$1[key] || (keys$1[key] = uid$1(key));
  };

  var hiddenKeys$3 = {};

  var WeakMap$3 = global_1$1.WeakMap;
  var set$1, get$1, has$2;

  var enforce$1 = function (it) {
    return has$2(it) ? get$1(it) : set$1(it, {});
  };

  var getterFor$1 = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject$3(it) || (state = get$1(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap$1) {
    var store$2 = new WeakMap$3();
    var wmget$1 = store$2.get;
    var wmhas$1 = store$2.has;
    var wmset$1 = store$2.set;
    set$1 = function (it, metadata) {
      wmset$1.call(store$2, it, metadata);
      return metadata;
    };
    get$1 = function (it) {
      return wmget$1.call(store$2, it) || {};
    };
    has$2 = function (it) {
      return wmhas$1.call(store$2, it);
    };
  } else {
    var STATE$1 = sharedKey$1('state');
    hiddenKeys$3[STATE$1] = true;
    set$1 = function (it, metadata) {
      createNonEnumerableProperty$1(it, STATE$1, metadata);
      return metadata;
    };
    get$1 = function (it) {
      return has$3(it, STATE$1) ? it[STATE$1] : {};
    };
    has$2 = function (it) {
      return has$3(it, STATE$1);
    };
  }

  var internalState$1 = {
    set: set$1,
    get: get$1,
    has: has$2,
    enforce: enforce$1,
    getterFor: getterFor$1
  };

  var nativePropertyIsEnumerable$1 = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG$1 = getOwnPropertyDescriptor$3 && !nativePropertyIsEnumerable$1.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
  var f$8 = NASHORN_BUG$1 ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$3(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable$1;

  var objectPropertyIsEnumerable$1 = {
  	f: f$8
  };

  var toString$1 = {}.toString;

  var classofRaw$1 = function (it) {
    return toString$1.call(it).slice(8, -1);
  };

  var split$1 = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject$1 = fails$1(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw$1(it) == 'String' ? split$1.call(it, '') : Object(it);
  } : Object;

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject$1 = function (it) {
    return indexedObject$1(requireObjectCoercible$1(it));
  };

  var nativeGetOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  var f$7 = descriptors$1 ? nativeGetOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$1(O);
    P = toPrimitive$1(P, true);
    if (ie8DomDefine$1) try {
      return nativeGetOwnPropertyDescriptor$1(O, P);
    } catch (error) { /* empty */ }
    if (has$3(O, P)) return createPropertyDescriptor$1(!objectPropertyIsEnumerable$1.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor$1 = {
  	f: f$7
  };

  var redefine$1 = createCommonjsModule(function (module) {
  var getInternalState = internalState$1.get;
  var enforceInternalState = internalState$1.enforce;
  var TEMPLATE = String(String).split('String');

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has$3(value, 'name')) createNonEnumerableProperty$1(value, 'name', key);
      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
    if (O === global_1$1) {
      if (simple) O[key] = value;
      else setGlobal$1(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty$1(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || inspectSource$1(this);
  });
  });

  var path$1 = global_1$1;

  var aFunction$3 = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn$1 = function (namespace, method) {
    return arguments.length < 2 ? aFunction$3(path$1[namespace]) || aFunction$3(global_1$1[namespace])
      : path$1[namespace] && path$1[namespace][method] || global_1$1[namespace] && global_1$1[namespace][method];
  };

  var min$3 = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength$1 = function (argument) {
    return argument > 0 ? min$3(toInteger$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max$1 = Math.max;
  var min$2 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$1 = function (index, length) {
    var integer = toInteger$1(index);
    return integer < 0 ? max$1(integer + length, 0) : min$2(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$2 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$1($this);
      var length = toLength$1(O.length);
      var index = toAbsoluteIndex$1(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes$1 = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod$2(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$2(false)
  };

  var indexOf$1 = arrayIncludes$1.indexOf;


  var objectKeysInternal$1 = function (object, names) {
    var O = toIndexedObject$1(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has$3(hiddenKeys$3, key) && has$3(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has$3(O, key = names[i++])) {
      ~indexOf$1(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$1 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var hiddenKeys$2 = enumBugKeys$1.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  var f$6 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal$1(O, hiddenKeys$2);
  };

  var objectGetOwnPropertyNames$1 = {
  	f: f$6
  };

  var f$5 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols$1 = {
  	f: f$5
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys$2 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames$1.f(anObject$1(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols$1.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties$1 = function (target, source) {
    var keys = ownKeys$2(source);
    var defineProperty = objectDefineProperty$1.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor$1.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has$3(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement$1 = /#|\.prototype\./;

  var isForced$1 = function (feature, detection) {
    var value = data$1[normalize$1(feature)];
    return value == POLYFILL$1 ? true
      : value == NATIVE$1 ? false
      : typeof detection == 'function' ? fails$1(detection)
      : !!detection;
  };

  var normalize$1 = isForced$1.normalize = function (string) {
    return String(string).replace(replacement$1, '.').toLowerCase();
  };

  var data$1 = isForced$1.data = {};
  var NATIVE$1 = isForced$1.NATIVE = 'N';
  var POLYFILL$1 = isForced$1.POLYFILL = 'P';

  var isForced_1$1 = isForced$1;

  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor$1.f;






  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export$1 = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1$1;
    } else if (STATIC) {
      target = global_1$1[TARGET] || setGlobal$1(TARGET, {});
    } else {
      target = (global_1$1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$2(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties$1(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty$1(sourceProperty, 'sham', true);
      }
      // extend global
      redefine$1(target, key, sourceProperty, options);
    }
  };

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject$1 = function (argument) {
    return Object(requireObjectCoercible$1(argument));
  };

  var correctPrototypeGetter$1 = !fails$1(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO$3 = sharedKey$1('IE_PROTO');
  var ObjectPrototype$1 = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf$1 = correctPrototypeGetter$1 ? Object.getPrototypeOf : function (O) {
    O = toObject$1(O);
    if (has$3(O, IE_PROTO$3)) return O[IE_PROTO$3];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype$1 : null;
  };

  var nativeSymbol$1 = !!Object.getOwnPropertySymbols && !fails$1(function () {
    // Chrome 38 Symbol has incorrect toString conversion
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  var useSymbolAsUid$1 = nativeSymbol$1
    // eslint-disable-next-line no-undef
    && !Symbol.sham
    // eslint-disable-next-line no-undef
    && typeof Symbol.iterator == 'symbol';

  var WellKnownSymbolsStore$1 = shared$1('wks');
  var Symbol$2 = global_1$1.Symbol;
  var createWellKnownSymbol$1 = useSymbolAsUid$1 ? Symbol$2 : Symbol$2 && Symbol$2.withoutSetter || uid$1;

  var wellKnownSymbol$1 = function (name) {
    if (!has$3(WellKnownSymbolsStore$1, name)) {
      if (nativeSymbol$1 && has$3(Symbol$2, name)) WellKnownSymbolsStore$1[name] = Symbol$2[name];
      else WellKnownSymbolsStore$1[name] = createWellKnownSymbol$1('Symbol.' + name);
    } return WellKnownSymbolsStore$1[name];
  };

  var ITERATOR$b = wellKnownSymbol$1('iterator');
  var BUGGY_SAFARI_ITERATORS$3 = false;

  var returnThis$5 = function () { return this; };

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$5, PrototypeOfArrayIteratorPrototype$1, arrayIterator$1;

  if ([].keys) {
    arrayIterator$1 = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator$1)) BUGGY_SAFARI_ITERATORS$3 = true;
    else {
      PrototypeOfArrayIteratorPrototype$1 = objectGetPrototypeOf$1(objectGetPrototypeOf$1(arrayIterator$1));
      if (PrototypeOfArrayIteratorPrototype$1 !== Object.prototype) IteratorPrototype$5 = PrototypeOfArrayIteratorPrototype$1;
    }
  }

  if (IteratorPrototype$5 == undefined) IteratorPrototype$5 = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if (!has$3(IteratorPrototype$5, ITERATOR$b)) {
    createNonEnumerableProperty$1(IteratorPrototype$5, ITERATOR$b, returnThis$5);
  }

  var iteratorsCore$1 = {
    IteratorPrototype: IteratorPrototype$5,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$3
  };

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  var objectKeys$1 = Object.keys || function keys(O) {
    return objectKeysInternal$1(O, enumBugKeys$1);
  };

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  var objectDefineProperties$1 = descriptors$1 ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$1(O);
    var keys = objectKeys$1(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) objectDefineProperty$1.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var html$1 = getBuiltIn$1('document', 'documentElement');

  var GT$1 = '>';
  var LT$1 = '<';
  var PROTOTYPE$1 = 'prototype';
  var SCRIPT$1 = 'script';
  var IE_PROTO$2 = sharedKey$1('IE_PROTO');

  var EmptyConstructor$1 = function () { /* empty */ };

  var scriptTag$1 = function (content) {
    return LT$1 + SCRIPT$1 + GT$1 + content + LT$1 + '/' + SCRIPT$1 + GT$1;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX$1 = function (activeXDocument) {
    activeXDocument.write(scriptTag$1(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame$1 = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement$1('iframe');
    var JS = 'java' + SCRIPT$1 + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html$1.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag$1('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument$1;
  var NullProtoObject$1 = function () {
    try {
      /* global ActiveXObject */
      activeXDocument$1 = document.domain && new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject$1 = activeXDocument$1 ? NullProtoObjectViaActiveX$1(activeXDocument$1) : NullProtoObjectViaIFrame$1();
    var length = enumBugKeys$1.length;
    while (length--) delete NullProtoObject$1[PROTOTYPE$1][enumBugKeys$1[length]];
    return NullProtoObject$1();
  };

  hiddenKeys$3[IE_PROTO$2] = true;

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  var objectCreate$1 = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor$1[PROTOTYPE$1] = anObject$1(O);
      result = new EmptyConstructor$1();
      EmptyConstructor$1[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$2] = O;
    } else result = NullProtoObject$1();
    return Properties === undefined ? result : objectDefineProperties$1(result, Properties);
  };

  var defineProperty$3 = objectDefineProperty$1.f;



  var TO_STRING_TAG$5 = wellKnownSymbol$1('toStringTag');

  var setToStringTag$1 = function (it, TAG, STATIC) {
    if (it && !has$3(it = STATIC ? it : it.prototype, TO_STRING_TAG$5)) {
      defineProperty$3(it, TO_STRING_TAG$5, { configurable: true, value: TAG });
    }
  };

  var iterators$1 = {};

  var IteratorPrototype$4 = iteratorsCore$1.IteratorPrototype;





  var returnThis$4 = function () { return this; };

  var createIteratorConstructor$1 = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate$1(IteratorPrototype$4, { next: createPropertyDescriptor$1(1, next) });
    setToStringTag$1(IteratorConstructor, TO_STRING_TAG, false);
    iterators$1[TO_STRING_TAG] = returnThis$4;
    return IteratorConstructor;
  };

  var aPossiblePrototype$1 = function (it) {
    if (!isObject$3(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    } return it;
  };

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */
  var objectSetPrototypeOf$1 = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject$1(O);
      aPossiblePrototype$1(proto);
      if (CORRECT_SETTER) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var IteratorPrototype$3 = iteratorsCore$1.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$2 = iteratorsCore$1.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$a = wellKnownSymbol$1('iterator');
  var KEYS$1 = 'keys';
  var VALUES$1 = 'values';
  var ENTRIES$1 = 'entries';

  var returnThis$3 = function () { return this; };

  var defineIterator$1 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor$1(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$2 && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS$1: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES$1: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES$1: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$a]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$2 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf$1(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype$3 !== Object.prototype && CurrentIteratorPrototype.next) {
        if (objectGetPrototypeOf$1(CurrentIteratorPrototype) !== IteratorPrototype$3) {
          if (objectSetPrototypeOf$1) {
            objectSetPrototypeOf$1(CurrentIteratorPrototype, IteratorPrototype$3);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$a] != 'function') {
            createNonEnumerableProperty$1(CurrentIteratorPrototype, ITERATOR$a, returnThis$3);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag$1(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES$1 && nativeIterator && nativeIterator.name !== VALUES$1) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if (IterablePrototype[ITERATOR$a] !== defaultIterator) {
      createNonEnumerableProperty$1(IterablePrototype, ITERATOR$a, defaultIterator);
    }
    iterators$1[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES$1),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS$1),
        entries: getIterationMethod(ENTRIES$1)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$2 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine$1(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export$1({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$2 || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var charAt$1 = stringMultibyte$1.charAt;



  var STRING_ITERATOR$1 = 'String Iterator';
  var setInternalState$7 = internalState$1.set;
  var getInternalState$3 = internalState$1.getterFor(STRING_ITERATOR$1);

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator$1(String, 'String', function (iterated) {
    setInternalState$7(this, {
      type: STRING_ITERATOR$1,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState$3(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt$1(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  var ITERATOR$9 = wellKnownSymbol$1('iterator');

  var nativeUrl$1 = !fails$1(function () {
    var url = new URL('b?a=1&b=2&c=3', 'http://a');
    var searchParams = url.searchParams;
    var result = '';
    url.pathname = 'c%20d';
    searchParams.forEach(function (value, key) {
      searchParams['delete']('b');
      result += key + value;
    });
    return (isPure$1 && !url.toJSON)
      || !searchParams.sort
      || url.href !== 'http://a/c%20d?a=1&c=3'
      || searchParams.get('c') !== '3'
      || String(new URLSearchParams('?a=1')) !== 'a=1'
      || !searchParams[ITERATOR$9]
      // throws in Edge
      || new URL('https://a@b').username !== 'a'
      || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
      // not punycoded in Edge
      || new URL('http://тест').host !== 'xn--e1aybc'
      // not escaped in Chrome 62-
      || new URL('http://a#б').hash !== '#%D0%B1'
      // fails in Chrome 66-
      || result !== 'a1c3'
      // throws in Safari
      || new URL('http://x', undefined).host !== 'x';
  });

  var anInstance$1 = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  var nativeAssign$1 = Object.assign;
  var defineProperty$2 = Object.defineProperty;

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  var objectAssign$1 = !nativeAssign$1 || fails$1(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors$1 && nativeAssign$1({ b: 1 }, nativeAssign$1(defineProperty$2({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$2(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return nativeAssign$1({}, A)[symbol] != 7 || objectKeys$1(nativeAssign$1({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
    var T = toObject$1(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols$1.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable$1.f;
    while (argumentsLength > index) {
      var S = indexedObject$1(arguments[index++]);
      var keys = getOwnPropertySymbols ? objectKeys$1(S).concat(getOwnPropertySymbols(S)) : objectKeys$1(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!descriptors$1 || propertyIsEnumerable.call(S, key)) T[key] = S[key];
      }
    } return T;
  } : nativeAssign$1;

  var aFunction$2 = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  // optional / simple context binding
  var functionBindContext$1 = function (fn, that, length) {
    aFunction$2(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing$1 = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject$1(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator['return'];
      if (returnMethod !== undefined) anObject$1(returnMethod.call(iterator));
      throw error;
    }
  };

  var ITERATOR$8 = wellKnownSymbol$1('iterator');
  var ArrayPrototype$3 = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod$1 = function (it) {
    return it !== undefined && (iterators$1.Array === it || ArrayPrototype$3[ITERATOR$8] === it);
  };

  var createProperty$1 = function (object, key, value) {
    var propertyKey = toPrimitive$1(key);
    if (propertyKey in object) objectDefineProperty$1.f(object, propertyKey, createPropertyDescriptor$1(0, value));
    else object[propertyKey] = value;
  };

  var TO_STRING_TAG$4 = wellKnownSymbol$1('toStringTag');
  var test$1 = {};

  test$1[TO_STRING_TAG$4] = 'z';

  var toStringTagSupport$1 = String(test$1) === '[object z]';

  var TO_STRING_TAG$3 = wellKnownSymbol$1('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS$1 = classofRaw$1(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet$1 = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof$1 = toStringTagSupport$1 ? classofRaw$1 : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet$1(O = Object(it), TO_STRING_TAG$3)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS$1 ? classofRaw$1(O)
      // ES3 arguments fallback
      : (result = classofRaw$1(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR$7 = wellKnownSymbol$1('iterator');

  var getIteratorMethod$1 = function (it) {
    if (it != undefined) return it[ITERATOR$7]
      || it['@@iterator']
      || iterators$1[classof$1(it)];
  };

  // `Array.from` method implementation
  // https://tc39.github.io/ecma262/#sec-array.from
  var arrayFrom$1 = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject$1(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod$1(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    if (mapping) mapfn = functionBindContext$1(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod$1(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      result = new C();
      for (;!(step = next.call(iterator)).done; index++) {
        value = mapping ? callWithSafeIterationClosing$1(iterator, mapfn, [step.value, index], true) : step.value;
        createProperty$1(result, index, value);
      }
    } else {
      length = toLength$1(O.length);
      result = new C(length);
      for (;length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty$1(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
  var maxInt$1 = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
  var base$1 = 36;
  var tMin$1 = 1;
  var tMax$1 = 26;
  var skew$1 = 38;
  var damp$1 = 700;
  var initialBias$1 = 72;
  var initialN$1 = 128; // 0x80
  var delimiter$1 = '-'; // '\x2D'
  var regexNonASCII$1 = /[^\0-\u007E]/; // non-ASCII chars
  var regexSeparators$1 = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
  var OVERFLOW_ERROR$1 = 'Overflow: input needs wider integers to process';
  var baseMinusTMin$1 = base$1 - tMin$1;
  var floor$4 = Math.floor;
  var stringFromCharCode$1 = String.fromCharCode;

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   */
  var ucs2decode$1 = function (string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var value = string.charCodeAt(counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // It's a high surrogate, and there is a next character.
        var extra = string.charCodeAt(counter++);
        if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  };

  /**
   * Converts a digit/integer into a basic code point.
   */
  var digitToBasic$1 = function (digit) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26);
  };

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   */
  var adapt$1 = function (delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor$4(delta / damp$1) : delta >> 1;
    delta += floor$4(delta / numPoints);
    for (; delta > baseMinusTMin$1 * tMax$1 >> 1; k += base$1) {
      delta = floor$4(delta / baseMinusTMin$1);
    }
    return floor$4(k + (baseMinusTMin$1 + 1) * delta / (delta + skew$1));
  };

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   */
  // eslint-disable-next-line  max-statements
  var encode$1 = function (input) {
    var output = [];

    // Convert the input in UCS-2 to an array of Unicode code points.
    input = ucs2decode$1(input);

    // Cache the length.
    var inputLength = input.length;

    // Initialize the state.
    var n = initialN$1;
    var delta = 0;
    var bias = initialBias$1;
    var i, currentValue;

    // Handle the basic code points.
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < 0x80) {
        output.push(stringFromCharCode$1(currentValue));
      }
    }

    var basicLength = output.length; // number of basic code points.
    var handledCPCount = basicLength; // number of code points that have been handled;

    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
      output.push(delimiter$1);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next larger one:
      var m = maxInt$1;
      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
      var handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor$4((maxInt$1 - delta) / handledCPCountPlusOne)) {
        throw RangeError(OVERFLOW_ERROR$1);
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue < n && ++delta > maxInt$1) {
          throw RangeError(OVERFLOW_ERROR$1);
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer.
          var q = delta;
          for (var k = base$1; /* no condition */; k += base$1) {
            var t = k <= bias ? tMin$1 : (k >= bias + tMax$1 ? tMax$1 : k - bias);
            if (q < t) break;
            var qMinusT = q - t;
            var baseMinusT = base$1 - t;
            output.push(stringFromCharCode$1(digitToBasic$1(t + qMinusT % baseMinusT)));
            q = floor$4(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode$1(digitToBasic$1(q)));
          bias = adapt$1(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }
    return output.join('');
  };

  var stringPunycodeToAscii$1 = function (input) {
    var encoded = [];
    var labels = input.toLowerCase().replace(regexSeparators$1, '\u002E').split('.');
    var i, label;
    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      encoded.push(regexNonASCII$1.test(label) ? 'xn--' + encode$1(label) : label);
    }
    return encoded.join('.');
  };

  var UNSCOPABLES$1 = wellKnownSymbol$1('unscopables');
  var ArrayPrototype$2 = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype$2[UNSCOPABLES$1] == undefined) {
    objectDefineProperty$1.f(ArrayPrototype$2, UNSCOPABLES$1, {
      configurable: true,
      value: objectCreate$1(null)
    });
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables$1 = function (key) {
    ArrayPrototype$2[UNSCOPABLES$1][key] = true;
  };

  var ARRAY_ITERATOR$1 = 'Array Iterator';
  var setInternalState$6 = internalState$1.set;
  var getInternalState$2 = internalState$1.getterFor(ARRAY_ITERATOR$1);

  // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator
  defineIterator$1(Array, 'Array', function (iterated, kind) {
    setInternalState$6(this, {
      type: ARRAY_ITERATOR$1,
      target: toIndexedObject$1(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$2(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
  iterators$1.Arguments = iterators$1.Array;

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables$1('keys');
  addToUnscopables$1('values');
  addToUnscopables$1('entries');

  var redefineAll$1 = function (target, src, options) {
    for (var key in src) redefine$1(target, key, src[key], options);
    return target;
  };

  var getIterator$1 = function (it) {
    var iteratorMethod = getIteratorMethod$1(it);
    if (typeof iteratorMethod != 'function') {
      throw TypeError(String(it) + ' is not iterable');
    } return anObject$1(iteratorMethod.call(it));
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















  var $fetch$1 = getBuiltIn$1('fetch');
  var Headers$1 = getBuiltIn$1('Headers');
  var ITERATOR$6 = wellKnownSymbol$1('iterator');
  var URL_SEARCH_PARAMS$1 = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR$1 = URL_SEARCH_PARAMS$1 + 'Iterator';
  var setInternalState$5 = internalState$1.set;
  var getInternalParamsState$1 = internalState$1.getterFor(URL_SEARCH_PARAMS$1);
  var getInternalIteratorState$1 = internalState$1.getterFor(URL_SEARCH_PARAMS_ITERATOR$1);

  var plus$1 = /\+/g;
  var sequences$1 = Array(4);

  var percentSequence$1 = function (bytes) {
    return sequences$1[bytes - 1] || (sequences$1[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
  };

  var percentDecode$1 = function (sequence) {
    try {
      return decodeURIComponent(sequence);
    } catch (error) {
      return sequence;
    }
  };

  var deserialize$1 = function (it) {
    var result = it.replace(plus$1, ' ');
    var bytes = 4;
    try {
      return decodeURIComponent(result);
    } catch (error) {
      while (bytes) {
        result = result.replace(percentSequence$1(bytes--), percentDecode$1);
      }
      return result;
    }
  };

  var find$1 = /[!'()~]|%20/g;

  var replace$1 = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+'
  };

  var replacer$1 = function (match) {
    return replace$1[match];
  };

  var serialize$1 = function (it) {
    return encodeURIComponent(it).replace(find$1, replacer$1);
  };

  var parseSearchParams$1 = function (result, query) {
    if (query) {
      var attributes = query.split('&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = attribute.split('=');
          result.push({
            key: deserialize$1(entry.shift()),
            value: deserialize$1(entry.join('='))
          });
        }
      }
    }
  };

  var updateSearchParams$1 = function (query) {
    this.entries.length = 0;
    parseSearchParams$1(this.entries, query);
  };

  var validateArgumentsLength$1 = function (passed, required) {
    if (passed < required) throw TypeError('Not enough arguments');
  };

  var URLSearchParamsIterator$1 = createIteratorConstructor$1(function Iterator(params, kind) {
    setInternalState$5(this, {
      type: URL_SEARCH_PARAMS_ITERATOR$1,
      iterator: getIterator$1(getInternalParamsState$1(params).entries),
      kind: kind
    });
  }, 'Iterator', function next() {
    var state = getInternalIteratorState$1(this);
    var kind = state.kind;
    var step = state.iterator.next();
    var entry = step.value;
    if (!step.done) {
      step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
    } return step;
  });

  // `URLSearchParams` constructor
  // https://url.spec.whatwg.org/#interface-urlsearchparams
  var URLSearchParamsConstructor$1 = function URLSearchParams(/* init */) {
    anInstance$1(this, URLSearchParamsConstructor$1, URL_SEARCH_PARAMS$1);
    var init = arguments.length > 0 ? arguments[0] : undefined;
    var that = this;
    var entries = [];
    var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

    setInternalState$5(that, {
      type: URL_SEARCH_PARAMS$1,
      entries: entries,
      updateURL: function () { /* empty */ },
      updateSearchParams: updateSearchParams$1
    });

    if (init !== undefined) {
      if (isObject$3(init)) {
        iteratorMethod = getIteratorMethod$1(init);
        if (typeof iteratorMethod === 'function') {
          iterator = iteratorMethod.call(init);
          next = iterator.next;
          while (!(step = next.call(iterator)).done) {
            entryIterator = getIterator$1(anObject$1(step.value));
            entryNext = entryIterator.next;
            if (
              (first = entryNext.call(entryIterator)).done ||
              (second = entryNext.call(entryIterator)).done ||
              !entryNext.call(entryIterator).done
            ) throw TypeError('Expected sequence with length 2');
            entries.push({ key: first.value + '', value: second.value + '' });
          }
        } else for (key in init) if (has$3(init, key)) entries.push({ key: key, value: init[key] + '' });
      } else {
        parseSearchParams$1(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
      }
    }
  };

  var URLSearchParamsPrototype$1 = URLSearchParamsConstructor$1.prototype;

  redefineAll$1(URLSearchParamsPrototype$1, {
    // `URLSearchParams.prototype.appent` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-append
    append: function append(name, value) {
      validateArgumentsLength$1(arguments.length, 2);
      var state = getInternalParamsState$1(this);
      state.entries.push({ key: name + '', value: value + '' });
      state.updateURL();
    },
    // `URLSearchParams.prototype.delete` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
    'delete': function (name) {
      validateArgumentsLength$1(arguments.length, 1);
      var state = getInternalParamsState$1(this);
      var entries = state.entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index].key === key) entries.splice(index, 1);
        else index++;
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.get` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-get
    get: function get(name) {
      validateArgumentsLength$1(arguments.length, 1);
      var entries = getInternalParamsState$1(this).entries;
      var key = name + '';
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) return entries[index].value;
      }
      return null;
    },
    // `URLSearchParams.prototype.getAll` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
    getAll: function getAll(name) {
      validateArgumentsLength$1(arguments.length, 1);
      var entries = getInternalParamsState$1(this).entries;
      var key = name + '';
      var result = [];
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) result.push(entries[index].value);
      }
      return result;
    },
    // `URLSearchParams.prototype.has` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-has
    has: function has(name) {
      validateArgumentsLength$1(arguments.length, 1);
      var entries = getInternalParamsState$1(this).entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index++].key === key) return true;
      }
      return false;
    },
    // `URLSearchParams.prototype.set` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-set
    set: function set(name, value) {
      validateArgumentsLength$1(arguments.length, 1);
      var state = getInternalParamsState$1(this);
      var entries = state.entries;
      var found = false;
      var key = name + '';
      var val = value + '';
      var index = 0;
      var entry;
      for (; index < entries.length; index++) {
        entry = entries[index];
        if (entry.key === key) {
          if (found) entries.splice(index--, 1);
          else {
            found = true;
            entry.value = val;
          }
        }
      }
      if (!found) entries.push({ key: key, value: val });
      state.updateURL();
    },
    // `URLSearchParams.prototype.sort` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
    sort: function sort() {
      var state = getInternalParamsState$1(this);
      var entries = state.entries;
      // Array#sort is not stable in some engines
      var slice = entries.slice();
      var entry, entriesIndex, sliceIndex;
      entries.length = 0;
      for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
        entry = slice[sliceIndex];
        for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
          if (entries[entriesIndex].key > entry.key) {
            entries.splice(entriesIndex, 0, entry);
            break;
          }
        }
        if (entriesIndex === sliceIndex) entries.push(entry);
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.forEach` method
    forEach: function forEach(callback /* , thisArg */) {
      var entries = getInternalParamsState$1(this).entries;
      var boundFunction = functionBindContext$1(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        boundFunction(entry.value, entry.key, this);
      }
    },
    // `URLSearchParams.prototype.keys` method
    keys: function keys() {
      return new URLSearchParamsIterator$1(this, 'keys');
    },
    // `URLSearchParams.prototype.values` method
    values: function values() {
      return new URLSearchParamsIterator$1(this, 'values');
    },
    // `URLSearchParams.prototype.entries` method
    entries: function entries() {
      return new URLSearchParamsIterator$1(this, 'entries');
    }
  }, { enumerable: true });

  // `URLSearchParams.prototype[@@iterator]` method
  redefine$1(URLSearchParamsPrototype$1, ITERATOR$6, URLSearchParamsPrototype$1.entries);

  // `URLSearchParams.prototype.toString` method
  // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
  redefine$1(URLSearchParamsPrototype$1, 'toString', function toString() {
    var entries = getInternalParamsState$1(this).entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      result.push(serialize$1(entry.key) + '=' + serialize$1(entry.value));
    } return result.join('&');
  }, { enumerable: true });

  setToStringTag$1(URLSearchParamsConstructor$1, URL_SEARCH_PARAMS$1);

  _export$1({ global: true, forced: !nativeUrl$1 }, {
    URLSearchParams: URLSearchParamsConstructor$1
  });

  // Wrap `fetch` for correct work with polyfilled `URLSearchParams`
  // https://github.com/zloirock/core-js/issues/674
  if (!nativeUrl$1 && typeof $fetch$1 == 'function' && typeof Headers$1 == 'function') {
    _export$1({ global: true, enumerable: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        var args = [input];
        var init, body, headers;
        if (arguments.length > 1) {
          init = arguments[1];
          if (isObject$3(init)) {
            body = init.body;
            if (classof$1(body) === URL_SEARCH_PARAMS$1) {
              headers = init.headers ? new Headers$1(init.headers) : new Headers$1();
              if (!headers.has('content-type')) {
                headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
              }
              init = objectCreate$1(init, {
                body: createPropertyDescriptor$1(0, String(body)),
                headers: createPropertyDescriptor$1(0, headers)
              });
            }
          }
          args.push(init);
        } return $fetch$1.apply(this, args);
      }
    });
  }

  var web_urlSearchParams$1 = {
    URLSearchParams: URLSearchParamsConstructor$1,
    getState: getInternalParamsState$1
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











  var codeAt$1 = stringMultibyte$1.codeAt;





  var NativeURL$1 = global_1$1.URL;
  var URLSearchParams$2 = web_urlSearchParams$1.URLSearchParams;
  var getInternalSearchParamsState$1 = web_urlSearchParams$1.getState;
  var setInternalState$4 = internalState$1.set;
  var getInternalURLState$1 = internalState$1.getterFor('URL');
  var floor$3 = Math.floor;
  var pow$1 = Math.pow;

  var INVALID_AUTHORITY$1 = 'Invalid authority';
  var INVALID_SCHEME$1 = 'Invalid scheme';
  var INVALID_HOST$1 = 'Invalid host';
  var INVALID_PORT$1 = 'Invalid port';

  var ALPHA$1 = /[A-Za-z]/;
  var ALPHANUMERIC$1 = /[\d+-.A-Za-z]/;
  var DIGIT$1 = /\d/;
  var HEX_START$1 = /^(0x|0X)/;
  var OCT$1 = /^[0-7]+$/;
  var DEC$1 = /^\d+$/;
  var HEX$1 = /^[\dA-Fa-f]+$/;
  // eslint-disable-next-line no-control-regex
  var FORBIDDEN_HOST_CODE_POINT$1 = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
  // eslint-disable-next-line no-control-regex
  var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT$1 = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
  // eslint-disable-next-line no-control-regex
  var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE$1 = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
  // eslint-disable-next-line no-control-regex
  var TAB_AND_NEW_LINE$1 = /[\u0009\u000A\u000D]/g;
  var EOF$1;

  var parseHost$1 = function (url, input) {
    var result, codePoints, index;
    if (input.charAt(0) == '[') {
      if (input.charAt(input.length - 1) != ']') return INVALID_HOST$1;
      result = parseIPv6$1(input.slice(1, -1));
      if (!result) return INVALID_HOST$1;
      url.host = result;
    // opaque host
    } else if (!isSpecial$1(url)) {
      if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT$1.test(input)) return INVALID_HOST$1;
      result = '';
      codePoints = arrayFrom$1(input);
      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode$1(codePoints[index], C0ControlPercentEncodeSet$1);
      }
      url.host = result;
    } else {
      input = stringPunycodeToAscii$1(input);
      if (FORBIDDEN_HOST_CODE_POINT$1.test(input)) return INVALID_HOST$1;
      result = parseIPv4$1(input);
      if (result === null) return INVALID_HOST$1;
      url.host = result;
    }
  };

  var parseIPv4$1 = function (input) {
    var parts = input.split('.');
    var partsLength, numbers, index, part, radix, number, ipv4;
    if (parts.length && parts[parts.length - 1] == '') {
      parts.pop();
    }
    partsLength = parts.length;
    if (partsLength > 4) return input;
    numbers = [];
    for (index = 0; index < partsLength; index++) {
      part = parts[index];
      if (part == '') return input;
      radix = 10;
      if (part.length > 1 && part.charAt(0) == '0') {
        radix = HEX_START$1.test(part) ? 16 : 8;
        part = part.slice(radix == 8 ? 1 : 2);
      }
      if (part === '') {
        number = 0;
      } else {
        if (!(radix == 10 ? DEC$1 : radix == 8 ? OCT$1 : HEX$1).test(part)) return input;
        number = parseInt(part, radix);
      }
      numbers.push(number);
    }
    for (index = 0; index < partsLength; index++) {
      number = numbers[index];
      if (index == partsLength - 1) {
        if (number >= pow$1(256, 5 - partsLength)) return null;
      } else if (number > 255) return null;
    }
    ipv4 = numbers.pop();
    for (index = 0; index < numbers.length; index++) {
      ipv4 += numbers[index] * pow$1(256, 3 - index);
    }
    return ipv4;
  };

  // eslint-disable-next-line max-statements
  var parseIPv6$1 = function (input) {
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var pointer = 0;
    var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

    var char = function () {
      return input.charAt(pointer);
    };

    if (char() == ':') {
      if (input.charAt(1) != ':') return;
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }
    while (char()) {
      if (pieceIndex == 8) return;
      if (char() == ':') {
        if (compress !== null) return;
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }
      value = length = 0;
      while (length < 4 && HEX$1.test(char())) {
        value = value * 16 + parseInt(char(), 16);
        pointer++;
        length++;
      }
      if (char() == '.') {
        if (length == 0) return;
        pointer -= length;
        if (pieceIndex > 6) return;
        numbersSeen = 0;
        while (char()) {
          ipv4Piece = null;
          if (numbersSeen > 0) {
            if (char() == '.' && numbersSeen < 4) pointer++;
            else return;
          }
          if (!DIGIT$1.test(char())) return;
          while (DIGIT$1.test(char())) {
            number = parseInt(char(), 10);
            if (ipv4Piece === null) ipv4Piece = number;
            else if (ipv4Piece == 0) return;
            else ipv4Piece = ipv4Piece * 10 + number;
            if (ipv4Piece > 255) return;
            pointer++;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
        }
        if (numbersSeen != 4) return;
        break;
      } else if (char() == ':') {
        pointer++;
        if (!char()) return;
      } else if (char()) return;
      address[pieceIndex++] = value;
    }
    if (compress !== null) {
      swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex != 0 && swaps > 0) {
        swap = address[pieceIndex];
        address[pieceIndex--] = address[compress + swaps - 1];
        address[compress + --swaps] = swap;
      }
    } else if (pieceIndex != 8) return;
    return address;
  };

  var findLongestZeroSequence$1 = function (ipv6) {
    var maxIndex = null;
    var maxLength = 1;
    var currStart = null;
    var currLength = 0;
    var index = 0;
    for (; index < 8; index++) {
      if (ipv6[index] !== 0) {
        if (currLength > maxLength) {
          maxIndex = currStart;
          maxLength = currLength;
        }
        currStart = null;
        currLength = 0;
      } else {
        if (currStart === null) currStart = index;
        ++currLength;
      }
    }
    if (currLength > maxLength) {
      maxIndex = currStart;
      maxLength = currLength;
    }
    return maxIndex;
  };

  var serializeHost$1 = function (host) {
    var result, index, compress, ignore0;
    // ipv4
    if (typeof host == 'number') {
      result = [];
      for (index = 0; index < 4; index++) {
        result.unshift(host % 256);
        host = floor$3(host / 256);
      } return result.join('.');
    // ipv6
    } else if (typeof host == 'object') {
      result = '';
      compress = findLongestZeroSequence$1(host);
      for (index = 0; index < 8; index++) {
        if (ignore0 && host[index] === 0) continue;
        if (ignore0) ignore0 = false;
        if (compress === index) {
          result += index ? ':' : '::';
          ignore0 = true;
        } else {
          result += host[index].toString(16);
          if (index < 7) result += ':';
        }
      }
      return '[' + result + ']';
    } return host;
  };

  var C0ControlPercentEncodeSet$1 = {};
  var fragmentPercentEncodeSet$1 = objectAssign$1({}, C0ControlPercentEncodeSet$1, {
    ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
  });
  var pathPercentEncodeSet$1 = objectAssign$1({}, fragmentPercentEncodeSet$1, {
    '#': 1, '?': 1, '{': 1, '}': 1
  });
  var userinfoPercentEncodeSet$1 = objectAssign$1({}, pathPercentEncodeSet$1, {
    '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
  });

  var percentEncode$1 = function (char, set) {
    var code = codeAt$1(char, 0);
    return code > 0x20 && code < 0x7F && !has$3(set, char) ? char : encodeURIComponent(char);
  };

  var specialSchemes$1 = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };

  var isSpecial$1 = function (url) {
    return has$3(specialSchemes$1, url.scheme);
  };

  var includesCredentials$1 = function (url) {
    return url.username != '' || url.password != '';
  };

  var cannotHaveUsernamePasswordPort$1 = function (url) {
    return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
  };

  var isWindowsDriveLetter$1 = function (string, normalized) {
    var second;
    return string.length == 2 && ALPHA$1.test(string.charAt(0))
      && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
  };

  var startsWithWindowsDriveLetter$1 = function (string) {
    var third;
    return string.length > 1 && isWindowsDriveLetter$1(string.slice(0, 2)) && (
      string.length == 2 ||
      ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
    );
  };

  var shortenURLsPath$1 = function (url) {
    var path = url.path;
    var pathSize = path.length;
    if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter$1(path[0], true))) {
      path.pop();
    }
  };

  var isSingleDot$1 = function (segment) {
    return segment === '.' || segment.toLowerCase() === '%2e';
  };

  var isDoubleDot$1 = function (segment) {
    segment = segment.toLowerCase();
    return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
  };

  // States:
  var SCHEME_START$1 = {};
  var SCHEME$1 = {};
  var NO_SCHEME$1 = {};
  var SPECIAL_RELATIVE_OR_AUTHORITY$1 = {};
  var PATH_OR_AUTHORITY$1 = {};
  var RELATIVE$1 = {};
  var RELATIVE_SLASH$1 = {};
  var SPECIAL_AUTHORITY_SLASHES$1 = {};
  var SPECIAL_AUTHORITY_IGNORE_SLASHES$1 = {};
  var AUTHORITY$1 = {};
  var HOST$1 = {};
  var HOSTNAME$1 = {};
  var PORT$1 = {};
  var FILE$1 = {};
  var FILE_SLASH$1 = {};
  var FILE_HOST$1 = {};
  var PATH_START$1 = {};
  var PATH$1 = {};
  var CANNOT_BE_A_BASE_URL_PATH$1 = {};
  var QUERY$1 = {};
  var FRAGMENT$1 = {};

  // eslint-disable-next-line max-statements
  var parseURL$1 = function (url, input, stateOverride, base) {
    var state = stateOverride || SCHEME_START$1;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, char, bufferCodePoints, failure;

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE$1, '');
    }

    input = input.replace(TAB_AND_NEW_LINE$1, '');

    codePoints = arrayFrom$1(input);

    while (pointer <= codePoints.length) {
      char = codePoints[pointer];
      switch (state) {
        case SCHEME_START$1:
          if (char && ALPHA$1.test(char)) {
            buffer += char.toLowerCase();
            state = SCHEME$1;
          } else if (!stateOverride) {
            state = NO_SCHEME$1;
            continue;
          } else return INVALID_SCHEME$1;
          break;

        case SCHEME$1:
          if (char && (ALPHANUMERIC$1.test(char) || char == '+' || char == '-' || char == '.')) {
            buffer += char.toLowerCase();
          } else if (char == ':') {
            if (stateOverride && (
              (isSpecial$1(url) != has$3(specialSchemes$1, buffer)) ||
              (buffer == 'file' && (includesCredentials$1(url) || url.port !== null)) ||
              (url.scheme == 'file' && !url.host)
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (isSpecial$1(url) && specialSchemes$1[url.scheme] == url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme == 'file') {
              state = FILE$1;
            } else if (isSpecial$1(url) && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY$1;
            } else if (isSpecial$1(url)) {
              state = SPECIAL_AUTHORITY_SLASHES$1;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY$1;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              url.path.push('');
              state = CANNOT_BE_A_BASE_URL_PATH$1;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME$1;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME$1;
          break;

        case NO_SCHEME$1:
          if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME$1;
          if (base.cannotBeABaseURL && char == '#') {
            url.scheme = base.scheme;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT$1;
            break;
          }
          state = base.scheme == 'file' ? FILE$1 : RELATIVE$1;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY$1:
          if (char == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES$1;
            pointer++;
          } else {
            state = RELATIVE$1;
            continue;
          } break;

        case PATH_OR_AUTHORITY$1:
          if (char == '/') {
            state = AUTHORITY$1;
            break;
          } else {
            state = PATH$1;
            continue;
          }

        case RELATIVE$1:
          url.scheme = base.scheme;
          if (char == EOF$1) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '/' || (char == '\\' && isSpecial$1(url))) {
            state = RELATIVE_SLASH$1;
          } else if (char == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY$1;
          } else if (char == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT$1;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.path.pop();
            state = PATH$1;
            continue;
          } break;

        case RELATIVE_SLASH$1:
          if (isSpecial$1(url) && (char == '/' || char == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES$1;
          } else if (char == '/') {
            state = AUTHORITY$1;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH$1;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES$1:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES$1;
          if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES$1:
          if (char != '/' && char != '\\') {
            state = AUTHORITY$1;
            continue;
          } break;

        case AUTHORITY$1:
          if (char == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom$1(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = percentEncode$1(codePoint, userinfoPercentEncodeSet$1);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            char == EOF$1 || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial$1(url))
          ) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY$1;
            pointer -= arrayFrom$1(buffer).length + 1;
            buffer = '';
            state = HOST$1;
          } else buffer += char;
          break;

        case HOST$1:
        case HOSTNAME$1:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST$1;
            continue;
          } else if (char == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST$1;
            failure = parseHost$1(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT$1;
            if (stateOverride == HOSTNAME$1) return;
          } else if (
            char == EOF$1 || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial$1(url))
          ) {
            if (isSpecial$1(url) && buffer == '') return INVALID_HOST$1;
            if (stateOverride && buffer == '' && (includesCredentials$1(url) || url.port !== null)) return;
            failure = parseHost$1(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START$1;
            if (stateOverride) return;
            continue;
          } else {
            if (char == '[') seenBracket = true;
            else if (char == ']') seenBracket = false;
            buffer += char;
          } break;

        case PORT$1:
          if (DIGIT$1.test(char)) {
            buffer += char;
          } else if (
            char == EOF$1 || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial$1(url)) ||
            stateOverride
          ) {
            if (buffer != '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT$1;
              url.port = (isSpecial$1(url) && port === specialSchemes$1[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START$1;
            continue;
          } else return INVALID_PORT$1;
          break;

        case FILE$1:
          url.scheme = 'file';
          if (char == '/' || char == '\\') state = FILE_SLASH$1;
          else if (base && base.scheme == 'file') {
            if (char == EOF$1) {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
            } else if (char == '?') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = '';
              state = QUERY$1;
            } else if (char == '#') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT$1;
            } else {
              if (!startsWithWindowsDriveLetter$1(codePoints.slice(pointer).join(''))) {
                url.host = base.host;
                url.path = base.path.slice();
                shortenURLsPath$1(url);
              }
              state = PATH$1;
              continue;
            }
          } else {
            state = PATH$1;
            continue;
          } break;

        case FILE_SLASH$1:
          if (char == '/' || char == '\\') {
            state = FILE_HOST$1;
            break;
          }
          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter$1(codePoints.slice(pointer).join(''))) {
            if (isWindowsDriveLetter$1(base.path[0], true)) url.path.push(base.path[0]);
            else url.host = base.host;
          }
          state = PATH$1;
          continue;

        case FILE_HOST$1:
          if (char == EOF$1 || char == '/' || char == '\\' || char == '?' || char == '#') {
            if (!stateOverride && isWindowsDriveLetter$1(buffer)) {
              state = PATH$1;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START$1;
            } else {
              failure = parseHost$1(url, buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START$1;
            } continue;
          } else buffer += char;
          break;

        case PATH_START$1:
          if (isSpecial$1(url)) {
            state = PATH$1;
            if (char != '/' && char != '\\') continue;
          } else if (!stateOverride && char == '?') {
            url.query = '';
            state = QUERY$1;
          } else if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT$1;
          } else if (char != EOF$1) {
            state = PATH$1;
            if (char != '/') continue;
          } break;

        case PATH$1:
          if (
            char == EOF$1 || char == '/' ||
            (char == '\\' && isSpecial$1(url)) ||
            (!stateOverride && (char == '?' || char == '#'))
          ) {
            if (isDoubleDot$1(buffer)) {
              shortenURLsPath$1(url);
              if (char != '/' && !(char == '\\' && isSpecial$1(url))) {
                url.path.push('');
              }
            } else if (isSingleDot$1(buffer)) {
              if (char != '/' && !(char == '\\' && isSpecial$1(url))) {
                url.path.push('');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter$1(buffer)) {
                if (url.host) url.host = '';
                buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
              }
              url.path.push(buffer);
            }
            buffer = '';
            if (url.scheme == 'file' && (char == EOF$1 || char == '?' || char == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                url.path.shift();
              }
            }
            if (char == '?') {
              url.query = '';
              state = QUERY$1;
            } else if (char == '#') {
              url.fragment = '';
              state = FRAGMENT$1;
            }
          } else {
            buffer += percentEncode$1(char, pathPercentEncodeSet$1);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH$1:
          if (char == '?') {
            url.query = '';
            state = QUERY$1;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT$1;
          } else if (char != EOF$1) {
            url.path[0] += percentEncode$1(char, C0ControlPercentEncodeSet$1);
          } break;

        case QUERY$1:
          if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT$1;
          } else if (char != EOF$1) {
            if (char == "'" && isSpecial$1(url)) url.query += '%27';
            else if (char == '#') url.query += '%23';
            else url.query += percentEncode$1(char, C0ControlPercentEncodeSet$1);
          } break;

        case FRAGMENT$1:
          if (char != EOF$1) url.fragment += percentEncode$1(char, fragmentPercentEncodeSet$1);
          break;
      }

      pointer++;
    }
  };

  // `URL` constructor
  // https://url.spec.whatwg.org/#url-class
  var URLConstructor$1 = function URL(url /* , base */) {
    var that = anInstance$1(this, URLConstructor$1, 'URL');
    var base = arguments.length > 1 ? arguments[1] : undefined;
    var urlString = String(url);
    var state = setInternalState$4(that, { type: 'URL' });
    var baseState, failure;
    if (base !== undefined) {
      if (base instanceof URLConstructor$1) baseState = getInternalURLState$1(base);
      else {
        failure = parseURL$1(baseState = {}, String(base));
        if (failure) throw TypeError(failure);
      }
    }
    failure = parseURL$1(state, urlString, null, baseState);
    if (failure) throw TypeError(failure);
    var searchParams = state.searchParams = new URLSearchParams$2();
    var searchParamsState = getInternalSearchParamsState$1(searchParams);
    searchParamsState.updateSearchParams(state.query);
    searchParamsState.updateURL = function () {
      state.query = String(searchParams) || null;
    };
    if (!descriptors$1) {
      that.href = serializeURL$1.call(that);
      that.origin = getOrigin$1.call(that);
      that.protocol = getProtocol$1.call(that);
      that.username = getUsername$1.call(that);
      that.password = getPassword$1.call(that);
      that.host = getHost$1.call(that);
      that.hostname = getHostname$1.call(that);
      that.port = getPort$1.call(that);
      that.pathname = getPathname$1.call(that);
      that.search = getSearch$1.call(that);
      that.searchParams = getSearchParams$1.call(that);
      that.hash = getHash$1.call(that);
    }
  };

  var URLPrototype$1 = URLConstructor$1.prototype;

  var serializeURL$1 = function () {
    var url = getInternalURLState$1(this);
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (includesCredentials$1(url)) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost$1(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  };

  var getOrigin$1 = function () {
    var url = getInternalURLState$1(this);
    var scheme = url.scheme;
    var port = url.port;
    if (scheme == 'blob') try {
      return new URL(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !isSpecial$1(url)) return 'null';
    return scheme + '://' + serializeHost$1(url.host) + (port !== null ? ':' + port : '');
  };

  var getProtocol$1 = function () {
    return getInternalURLState$1(this).scheme + ':';
  };

  var getUsername$1 = function () {
    return getInternalURLState$1(this).username;
  };

  var getPassword$1 = function () {
    return getInternalURLState$1(this).password;
  };

  var getHost$1 = function () {
    var url = getInternalURLState$1(this);
    var host = url.host;
    var port = url.port;
    return host === null ? ''
      : port === null ? serializeHost$1(host)
      : serializeHost$1(host) + ':' + port;
  };

  var getHostname$1 = function () {
    var host = getInternalURLState$1(this).host;
    return host === null ? '' : serializeHost$1(host);
  };

  var getPort$1 = function () {
    var port = getInternalURLState$1(this).port;
    return port === null ? '' : String(port);
  };

  var getPathname$1 = function () {
    var url = getInternalURLState$1(this);
    var path = url.path;
    return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  };

  var getSearch$1 = function () {
    var query = getInternalURLState$1(this).query;
    return query ? '?' + query : '';
  };

  var getSearchParams$1 = function () {
    return getInternalURLState$1(this).searchParams;
  };

  var getHash$1 = function () {
    var fragment = getInternalURLState$1(this).fragment;
    return fragment ? '#' + fragment : '';
  };

  var accessorDescriptor$1 = function (getter, setter) {
    return { get: getter, set: setter, configurable: true, enumerable: true };
  };

  if (descriptors$1) {
    objectDefineProperties$1(URLPrototype$1, {
      // `URL.prototype.href` accessors pair
      // https://url.spec.whatwg.org/#dom-url-href
      href: accessorDescriptor$1(serializeURL$1, function (href) {
        var url = getInternalURLState$1(this);
        var urlString = String(href);
        var failure = parseURL$1(url, urlString);
        if (failure) throw TypeError(failure);
        getInternalSearchParamsState$1(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.origin` getter
      // https://url.spec.whatwg.org/#dom-url-origin
      origin: accessorDescriptor$1(getOrigin$1),
      // `URL.prototype.protocol` accessors pair
      // https://url.spec.whatwg.org/#dom-url-protocol
      protocol: accessorDescriptor$1(getProtocol$1, function (protocol) {
        var url = getInternalURLState$1(this);
        parseURL$1(url, String(protocol) + ':', SCHEME_START$1);
      }),
      // `URL.prototype.username` accessors pair
      // https://url.spec.whatwg.org/#dom-url-username
      username: accessorDescriptor$1(getUsername$1, function (username) {
        var url = getInternalURLState$1(this);
        var codePoints = arrayFrom$1(String(username));
        if (cannotHaveUsernamePasswordPort$1(url)) return;
        url.username = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.username += percentEncode$1(codePoints[i], userinfoPercentEncodeSet$1);
        }
      }),
      // `URL.prototype.password` accessors pair
      // https://url.spec.whatwg.org/#dom-url-password
      password: accessorDescriptor$1(getPassword$1, function (password) {
        var url = getInternalURLState$1(this);
        var codePoints = arrayFrom$1(String(password));
        if (cannotHaveUsernamePasswordPort$1(url)) return;
        url.password = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.password += percentEncode$1(codePoints[i], userinfoPercentEncodeSet$1);
        }
      }),
      // `URL.prototype.host` accessors pair
      // https://url.spec.whatwg.org/#dom-url-host
      host: accessorDescriptor$1(getHost$1, function (host) {
        var url = getInternalURLState$1(this);
        if (url.cannotBeABaseURL) return;
        parseURL$1(url, String(host), HOST$1);
      }),
      // `URL.prototype.hostname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hostname
      hostname: accessorDescriptor$1(getHostname$1, function (hostname) {
        var url = getInternalURLState$1(this);
        if (url.cannotBeABaseURL) return;
        parseURL$1(url, String(hostname), HOSTNAME$1);
      }),
      // `URL.prototype.port` accessors pair
      // https://url.spec.whatwg.org/#dom-url-port
      port: accessorDescriptor$1(getPort$1, function (port) {
        var url = getInternalURLState$1(this);
        if (cannotHaveUsernamePasswordPort$1(url)) return;
        port = String(port);
        if (port == '') url.port = null;
        else parseURL$1(url, port, PORT$1);
      }),
      // `URL.prototype.pathname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-pathname
      pathname: accessorDescriptor$1(getPathname$1, function (pathname) {
        var url = getInternalURLState$1(this);
        if (url.cannotBeABaseURL) return;
        url.path = [];
        parseURL$1(url, pathname + '', PATH_START$1);
      }),
      // `URL.prototype.search` accessors pair
      // https://url.spec.whatwg.org/#dom-url-search
      search: accessorDescriptor$1(getSearch$1, function (search) {
        var url = getInternalURLState$1(this);
        search = String(search);
        if (search == '') {
          url.query = null;
        } else {
          if ('?' == search.charAt(0)) search = search.slice(1);
          url.query = '';
          parseURL$1(url, search, QUERY$1);
        }
        getInternalSearchParamsState$1(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.searchParams` getter
      // https://url.spec.whatwg.org/#dom-url-searchparams
      searchParams: accessorDescriptor$1(getSearchParams$1),
      // `URL.prototype.hash` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hash
      hash: accessorDescriptor$1(getHash$1, function (hash) {
        var url = getInternalURLState$1(this);
        hash = String(hash);
        if (hash == '') {
          url.fragment = null;
          return;
        }
        if ('#' == hash.charAt(0)) hash = hash.slice(1);
        url.fragment = '';
        parseURL$1(url, hash, FRAGMENT$1);
      })
    });
  }

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  redefine$1(URLPrototype$1, 'toJSON', function toJSON() {
    return serializeURL$1.call(this);
  }, { enumerable: true });

  // `URL.prototype.toString` method
  // https://url.spec.whatwg.org/#URL-stringification-behavior
  redefine$1(URLPrototype$1, 'toString', function toString() {
    return serializeURL$1.call(this);
  }, { enumerable: true });

  if (NativeURL$1) {
    var nativeCreateObjectURL$1 = NativeURL$1.createObjectURL;
    var nativeRevokeObjectURL$1 = NativeURL$1.revokeObjectURL;
    // `URL.createObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    // eslint-disable-next-line no-unused-vars
    if (nativeCreateObjectURL$1) redefine$1(URLConstructor$1, 'createObjectURL', function createObjectURL(blob) {
      return nativeCreateObjectURL$1.apply(NativeURL$1, arguments);
    });
    // `URL.revokeObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    // eslint-disable-next-line no-unused-vars
    if (nativeRevokeObjectURL$1) redefine$1(URLConstructor$1, 'revokeObjectURL', function revokeObjectURL(url) {
      return nativeRevokeObjectURL$1.apply(NativeURL$1, arguments);
    });
  }

  setToStringTag$1(URLConstructor$1, 'URL');

  _export$1({ global: true, forced: !nativeUrl$1, sham: !descriptors$1 }, {
    URL: URLConstructor$1
  });

  (function (global) {
    /**
     * Polyfill URLSearchParams
     *
     * Inspired from : https://github.com/WebReflection/url-search-params/blob/master/src/url-search-params.js
     */
    var checkIfIteratorIsSupported = function () {
      try {
        return !!Symbol.iterator;
      } catch (error) {
        return false;
      }
    };

    var iteratorSupported = checkIfIteratorIsSupported();

    var createIterator = function (items) {
      var iterator = {
        next: function () {
          var value = items.shift();
          return {
            done: value === void 0,
            value: value
          };
        }
      };

      if (iteratorSupported) {
        iterator[Symbol.iterator] = function () {
          return iterator;
        };
      }

      return iterator;
    };
    /**
     * Search param name and values should be encoded according to https://url.spec.whatwg.org/#urlencoded-serializing
     * encodeURIComponent() produces the same result except encoding spaces as `%20` instead of `+`.
     */


    var serializeParam = function (value) {
      return encodeURIComponent(value).replace(/%20/g, '+');
    };

    var deserializeParam = function (value) {
      return decodeURIComponent(String(value).replace(/\+/g, ' '));
    };

    var polyfillURLSearchParams = function () {
      var URLSearchParams = function (searchString) {
        Object.defineProperty(this, '_entries', {
          writable: true,
          value: {}
        });
        var typeofSearchString = typeof searchString;

        if (typeofSearchString === 'undefined') ; else if (typeofSearchString === 'string') {
          if (searchString !== '') {
            this._fromString(searchString);
          }
        } else if (searchString instanceof URLSearchParams) {
          var _this = this;

          searchString.forEach(function (value, name) {
            _this.append(name, value);
          });
        } else if (searchString !== null && typeofSearchString === 'object') {
          if (Object.prototype.toString.call(searchString) === '[object Array]') {
            for (var i = 0; i < searchString.length; i++) {
              var entry = searchString[i];

              if (Object.prototype.toString.call(entry) === '[object Array]' || entry.length !== 2) {
                this.append(entry[0], entry[1]);
              } else {
                throw new TypeError('Expected [string, any] as entry at index ' + i + ' of URLSearchParams\'s input');
              }
            }
          } else {
            for (var key in searchString) {
              if (searchString.hasOwnProperty(key)) {
                this.append(key, searchString[key]);
              }
            }
          }
        } else {
          throw new TypeError('Unsupported input\'s type for URLSearchParams');
        }
      };

      var proto = URLSearchParams.prototype;

      proto.append = function (name, value) {
        if (name in this._entries) {
          this._entries[name].push(String(value));
        } else {
          this._entries[name] = [String(value)];
        }
      };

      proto.delete = function (name) {
        delete this._entries[name];
      };

      proto.get = function (name) {
        return name in this._entries ? this._entries[name][0] : null;
      };

      proto.getAll = function (name) {
        return name in this._entries ? this._entries[name].slice(0) : [];
      };

      proto.has = function (name) {
        return name in this._entries;
      };

      proto.set = function (name, value) {
        this._entries[name] = [String(value)];
      };

      proto.forEach = function (callback, thisArg) {
        var entries;

        for (var name in this._entries) {
          if (this._entries.hasOwnProperty(name)) {
            entries = this._entries[name];

            for (var i = 0; i < entries.length; i++) {
              callback.call(thisArg, entries[i], name, this);
            }
          }
        }
      };

      proto.keys = function () {
        var items = [];
        this.forEach(function (value, name) {
          items.push(name);
        });
        return createIterator(items);
      };

      proto.values = function () {
        var items = [];
        this.forEach(function (value) {
          items.push(value);
        });
        return createIterator(items);
      };

      proto.entries = function () {
        var items = [];
        this.forEach(function (value, name) {
          items.push([name, value]);
        });
        return createIterator(items);
      };

      if (iteratorSupported) {
        proto[Symbol.iterator] = proto.entries;
      }

      proto.toString = function () {
        var searchArray = [];
        this.forEach(function (value, name) {
          searchArray.push(serializeParam(name) + '=' + serializeParam(value));
        });
        return searchArray.join('&');
      };

      global.URLSearchParams = URLSearchParams;
    };

    var checkIfURLSearchParamsSupported = function () {
      try {
        var URLSearchParams = global.URLSearchParams;
        return new URLSearchParams('?a=1').toString() === 'a=1' && typeof URLSearchParams.prototype.set === 'function' && typeof URLSearchParams.prototype.entries === 'function';
      } catch (e) {
        return false;
      }
    };

    if (!checkIfURLSearchParamsSupported()) {
      polyfillURLSearchParams();
    }

    var proto = global.URLSearchParams.prototype;

    if (typeof proto.sort !== 'function') {
      proto.sort = function () {
        var _this = this;

        var items = [];
        this.forEach(function (value, name) {
          items.push([name, value]);

          if (!_this._entries) {
            _this.delete(name);
          }
        });
        items.sort(function (a, b) {
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] > b[0]) {
            return +1;
          } else {
            return 0;
          }
        });

        if (_this._entries) {
          // force reset because IE keeps keys index
          _this._entries = {};
        }

        for (var i = 0; i < items.length; i++) {
          this.append(items[i][0], items[i][1]);
        }
      };
    }

    if (typeof proto._fromString !== 'function') {
      Object.defineProperty(proto, '_fromString', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString) {
          if (this._entries) {
            this._entries = {};
          } else {
            var keys = [];
            this.forEach(function (value, name) {
              keys.push(name);
            });

            for (var i = 0; i < keys.length; i++) {
              this.delete(keys[i]);
            }
          }

          searchString = searchString.replace(/^\?/, '');
          var attributes = searchString.split('&');
          var attribute;

          for (var i = 0; i < attributes.length; i++) {
            attribute = attributes[i].split('=');
            this.append(deserializeParam(attribute[0]), attribute.length > 1 ? deserializeParam(attribute[1]) : '');
          }
        }
      });
    } // HTMLAnchorElement

  })(typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : commonjsGlobal);

  (function (global) {
    /**
     * Polyfill URL
     *
     * Inspired from : https://github.com/arv/DOM-URL-Polyfill/blob/master/src/url.js
     */
    var checkIfURLIsSupported = function () {
      try {
        var u = new global.URL('b', 'http://a');
        u.pathname = 'c d';
        return u.href === 'http://a/c%20d' && u.searchParams;
      } catch (e) {
        return false;
      }
    };

    var polyfillURL = function () {
      var _URL = global.URL;

      var URL = function (url, base) {
        if (typeof url !== 'string') url = String(url); // Only create another document if the base is different from current location.

        var doc = document,
            baseElement;

        if (base && (global.location === void 0 || base !== global.location.href)) {
          doc = document.implementation.createHTMLDocument('');
          baseElement = doc.createElement('base');
          baseElement.href = base;
          doc.head.appendChild(baseElement);

          try {
            if (baseElement.href.indexOf(base) !== 0) throw new Error(baseElement.href);
          } catch (err) {
            throw new Error('URL unable to set base ' + base + ' due to ' + err);
          }
        }

        var anchorElement = doc.createElement('a');
        anchorElement.href = url;

        if (baseElement) {
          doc.body.appendChild(anchorElement);
          anchorElement.href = anchorElement.href; // force href to refresh
        }

        var inputElement = doc.createElement('input');
        inputElement.type = 'url';
        inputElement.value = url;

        if (anchorElement.protocol === ':' || !/:/.test(anchorElement.href) || !inputElement.checkValidity() && !base) {
          throw new TypeError('Invalid URL');
        }

        Object.defineProperty(this, '_anchorElement', {
          value: anchorElement
        }); // create a linked searchParams which reflect its changes on URL

        var searchParams = new global.URLSearchParams(this.search);
        var enableSearchUpdate = true;
        var enableSearchParamsUpdate = true;

        var _this = this;

        ['append', 'delete', 'set'].forEach(function (methodName) {
          var method = searchParams[methodName];

          searchParams[methodName] = function () {
            method.apply(searchParams, arguments);

            if (enableSearchUpdate) {
              enableSearchParamsUpdate = false;
              _this.search = searchParams.toString();
              enableSearchParamsUpdate = true;
            }
          };
        });
        Object.defineProperty(this, 'searchParams', {
          value: searchParams,
          enumerable: true
        });
        var search = void 0;
        Object.defineProperty(this, '_updateSearchParams', {
          enumerable: false,
          configurable: false,
          writable: false,
          value: function () {
            if (this.search !== search) {
              search = this.search;

              if (enableSearchParamsUpdate) {
                enableSearchUpdate = false;

                this.searchParams._fromString(this.search);

                enableSearchUpdate = true;
              }
            }
          }
        });
      };

      var proto = URL.prototype;

      var linkURLWithAnchorAttribute = function (attributeName) {
        Object.defineProperty(proto, attributeName, {
          get: function () {
            return this._anchorElement[attributeName];
          },
          set: function (value) {
            this._anchorElement[attributeName] = value;
          },
          enumerable: true
        });
      };

      ['hash', 'host', 'hostname', 'port', 'protocol'].forEach(function (attributeName) {
        linkURLWithAnchorAttribute(attributeName);
      });
      Object.defineProperty(proto, 'search', {
        get: function () {
          return this._anchorElement['search'];
        },
        set: function (value) {
          this._anchorElement['search'] = value;

          this._updateSearchParams();
        },
        enumerable: true
      });
      Object.defineProperties(proto, {
        'toString': {
          get: function () {
            var _this = this;

            return function () {
              return _this.href;
            };
          }
        },
        'href': {
          get: function () {
            return this._anchorElement.href.replace(/\?$/, '');
          },
          set: function (value) {
            this._anchorElement.href = value;

            this._updateSearchParams();
          },
          enumerable: true
        },
        'pathname': {
          get: function () {
            return this._anchorElement.pathname.replace(/(^\/?)/, '/');
          },
          set: function (value) {
            this._anchorElement.pathname = value;
          },
          enumerable: true
        },
        'origin': {
          get: function () {
            // get expected port from protocol
            var expectedPort = {
              'http:': 80,
              'https:': 443,
              'ftp:': 21
            }[this._anchorElement.protocol]; // add port to origin if, expected port is different than actual port
            // and it is not empty f.e http://foo:8080
            // 8080 != 80 && 8080 != ''

            var addPortToOrigin = this._anchorElement.port != expectedPort && this._anchorElement.port !== '';
            return this._anchorElement.protocol + '//' + this._anchorElement.hostname + (addPortToOrigin ? ':' + this._anchorElement.port : '');
          },
          enumerable: true
        },
        'password': {
          // TODO
          get: function () {
            return '';
          },
          set: function (value) {},
          enumerable: true
        },
        'username': {
          // TODO
          get: function () {
            return '';
          },
          set: function (value) {},
          enumerable: true
        }
      });

      URL.createObjectURL = function (blob) {
        return _URL.createObjectURL.apply(_URL, arguments);
      };

      URL.revokeObjectURL = function (url) {
        return _URL.revokeObjectURL.apply(_URL, arguments);
      };

      global.URL = URL;
    };

    if (!checkIfURLIsSupported()) {
      polyfillURL();
    }

    if (global.location !== void 0 && !('origin' in global.location)) {
      var getOrigin = function () {
        return global.location.protocol + '//' + global.location.hostname + (global.location.port ? ':' + global.location.port : '');
      };

      try {
        Object.defineProperty(global.location, 'origin', {
          get: getOrigin,
          enumerable: true
        });
      } catch (e) {
        setInterval(function () {
          global.location.origin = getOrigin();
        }, 100);
      }
    }
  })(typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : commonjsGlobal);

  function _defineProperty$1(obj, key, value) {
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

  var ceil = Math.ceil;
  var floor$2 = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.es/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$2 : ceil)(argument);
  };

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod$1 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible($this));
      var position = toInteger(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING ? S.charAt(position) : first
          : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$1(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$1(true)
  };

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1 =
    /* global globalThis -- safe */
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails(function () {
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var isObject$2 = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var document$1 = global_1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS = isObject$2(document$1) && isObject$2(document$1.createElement);

  var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var anObject = function (it) {
    if (!isObject$2(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject$2(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$2(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject$2(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$2(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var nativeDefineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  var f$4 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f$4
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function (key, value) {
    try {
      createNonEnumerableProperty(global_1, key, value);
    } catch (error) {
      global_1[key] = value;
    } return value;
  };

  var SHARED = '__core-js_shared__';
  var store$1 = global_1[SHARED] || setGlobal(SHARED, {});

  var sharedStore = store$1;

  var functionToString = Function.toString;

  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
  if (typeof sharedStore.inspectSource != 'function') {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap$2 = global_1.WeakMap;

  var nativeWeakMap = typeof WeakMap$2 === 'function' && /native code/.test(inspectSource(WeakMap$2));

  var hasOwnProperty = {}.hasOwnProperty;

  var has$1 = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var isPure = false;

  var shared = createCommonjsModule(function (module) {
  (module.exports = function (key, value) {
    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.9.1',
    mode: 'global',
    copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var keys = shared('keys');

  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys$1 = {};

  var WeakMap$1 = global_1.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject$2(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap) {
    var store = sharedStore.state || (sharedStore.state = new WeakMap$1());
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      metadata.facade = it;
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys$1[STATE] = true;
    set = function (it, metadata) {
      metadata.facade = it;
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has$1(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return has$1(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$1 && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  var f$3 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$1(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f$3
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (has$1(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$2
  };

  var redefine = createCommonjsModule(function (module) {
  var getInternalState = internalState.get;
  var enforceInternalState = internalState.enforce;
  var TEMPLATE = String(String).split('String');

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    var state;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has$1(value, 'name')) {
        createNonEnumerableProperty(value, 'name', key);
      }
      state = enforceInternalState(value);
      if (!state.source) {
        state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
      }
    }
    if (O === global_1) {
      if (simple) O[key] = value;
      else setGlobal(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
  });
  });

  var path = global_1;

  var aFunction$1 = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
      : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
  };

  var min$1 = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min$1(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var indexOf = arrayIncludes.indexOf;


  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has$1(hiddenKeys$1, key) && has$1(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has$1(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var hiddenKeys = enumBugKeys.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  var f$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys);
  };

  var objectGetOwnPropertyNames = {
  	f: f$1
  };

  var f = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys$1(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has$1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails(detection)
      : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';

  var isForced_1 = isForced;

  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty(sourceProperty, 'sham', true);
      }
      // extend global
      redefine(target, key, sourceProperty, options);
    }
  };

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var correctPrototypeGetter = !fails(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO$1 = sharedKey('IE_PROTO');
  var ObjectPrototype = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject(O);
    if (has$1(O, IE_PROTO$1)) return O[IE_PROTO$1];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype : null;
  };

  var engineIsNode = classofRaw(global_1.process) == 'process';

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var process = global_1.process;
  var versions = process && process.versions;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] + match[1];
  } else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  var engineV8Version = version && +version;

  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
    /* global Symbol -- required for testing */
    return !Symbol.sham &&
      // Chrome 38 Symbol has incorrect toString conversion
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      (engineIsNode ? engineV8Version === 38 : engineV8Version > 37 && engineV8Version < 41);
  });

  var useSymbolAsUid = nativeSymbol
    /* global Symbol -- safe */
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var WellKnownSymbolsStore = shared('wks');
  var Symbol$1 = global_1.Symbol;
  var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

  var wellKnownSymbol = function (name) {
    if (!has$1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
      if (nativeSymbol && has$1(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
      }
    } return WellKnownSymbolsStore[name];
  };

  var ITERATOR$5 = wellKnownSymbol('iterator');
  var BUGGY_SAFARI_ITERATORS$1 = false;

  var returnThis$2 = function () { return this; };

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
    }
  }

  var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
    var test = {};
    // FF44- legacy iterators case
    return IteratorPrototype$2[ITERATOR$5].call(test) !== test;
  });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if (!has$1(IteratorPrototype$2, ITERATOR$5)) {
    createNonEnumerableProperty(IteratorPrototype$2, ITERATOR$5, returnThis$2);
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype$2,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
  };

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var html = getBuiltIn('document', 'documentElement');

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO = sharedKey('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      /* global ActiveXObject -- old IE */
      activeXDocument = document.domain && new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys$1[IE_PROTO] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  var defineProperty$1 = objectDefineProperty.f;



  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has$1(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
      defineProperty$1(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
    }
  };

  var iterators = {};

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





  var returnThis$1 = function () { return this; };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var aPossiblePrototype = function (it) {
    if (!isObject$2(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    } return it;
  };

  /* eslint-disable no-proto -- safe */



  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var IteratorPrototype = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$4 = wellKnownSymbol('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis = function () { return this; };

  var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$4]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
        if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
            createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
      createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var charAt = stringMultibyte.charAt;



  var STRING_ITERATOR = 'String Iterator';
  var setInternalState$3 = internalState.set;
  var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState$3(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState$1(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  var ITERATOR$3 = wellKnownSymbol('iterator');

  var nativeUrl = !fails(function () {
    var url = new URL('b?a=1&b=2&c=3', 'http://a');
    var searchParams = url.searchParams;
    var result = '';
    url.pathname = 'c%20d';
    searchParams.forEach(function (value, key) {
      searchParams['delete']('b');
      result += key + value;
    });
    return (isPure && !url.toJSON)
      || !searchParams.sort
      || url.href !== 'http://a/c%20d?a=1&c=3'
      || searchParams.get('c') !== '3'
      || String(new URLSearchParams('?a=1')) !== 'a=1'
      || !searchParams[ITERATOR$3]
      // throws in Edge
      || new URL('https://a@b').username !== 'a'
      || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
      // not punycoded in Edge
      || new URL('http://тест').host !== 'xn--e1aybc'
      // not escaped in Chrome 62-
      || new URL('http://a#б').hash !== '#%D0%B1'
      // fails in Chrome 66-
      || result !== 'a1c3'
      // throws in Safari
      || new URL('http://x', undefined).host !== 'x';
  });

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  var nativeAssign = Object.assign;
  var defineProperty = Object.defineProperty;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  var objectAssign = !nativeAssign || fails(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    /* global Symbol -- required for testing */
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
    var T = toObject(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable.f;
    while (argumentsLength > index) {
      var S = indexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
      }
    } return T;
  } : nativeAssign;

  var aFunction = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var iteratorClose = function (iterator) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) {
      return anObject(returnMethod.call(iterator)).value;
    }
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      iteratorClose(iterator);
      throw error;
    }
  };

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var ArrayPrototype$1 = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
  };

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  var test = {};

  test[TO_STRING_TAG$1] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = toStringTagSupport ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR$1 = wellKnownSymbol('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$1]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  // `Array.from` method implementation
  // https://tc39.es/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      result = new C();
      for (;!(step = next.call(iterator)).done; index++) {
        value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
        createProperty(result, index, value);
      }
    } else {
      length = toLength(O.length);
      result = new C(length);
      for (;length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80
  var delimiter = '-'; // '\x2D'
  var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
  var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
  var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
  var baseMinusTMin = base - tMin;
  var floor$1 = Math.floor;
  var stringFromCharCode = String.fromCharCode;

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   */
  var ucs2decode = function (string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var value = string.charCodeAt(counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // It's a high surrogate, and there is a next character.
        var extra = string.charCodeAt(counter++);
        if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  };

  /**
   * Converts a digit/integer into a basic code point.
   */
  var digitToBasic = function (digit) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26);
  };

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   */
  var adapt = function (delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor$1(delta / damp) : delta >> 1;
    delta += floor$1(delta / numPoints);
    for (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor$1(delta / baseMinusTMin);
    }
    return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   */
  // eslint-disable-next-line max-statements -- TODO
  var encode = function (input) {
    var output = [];

    // Convert the input in UCS-2 to an array of Unicode code points.
    input = ucs2decode(input);

    // Cache the length.
    var inputLength = input.length;

    // Initialize the state.
    var n = initialN;
    var delta = 0;
    var bias = initialBias;
    var i, currentValue;

    // Handle the basic code points.
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }

    var basicLength = output.length; // number of basic code points.
    var handledCPCount = basicLength; // number of code points that have been handled;

    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
      output.push(delimiter);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next larger one:
      var m = maxInt;
      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
      var handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
        throw RangeError(OVERFLOW_ERROR);
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue < n && ++delta > maxInt) {
          throw RangeError(OVERFLOW_ERROR);
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer.
          var q = delta;
          for (var k = base; /* no condition */; k += base) {
            var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
            if (q < t) break;
            var qMinusT = q - t;
            var baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
            q = floor$1(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode(digitToBasic(q)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }
    return output.join('');
  };

  var stringPunycodeToAscii = function (input) {
    var encoded = [];
    var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
    var i, label;
    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
    }
    return encoded.join('.');
  };

  var UNSCOPABLES = wellKnownSymbol('unscopables');
  var ArrayPrototype = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype[UNSCOPABLES] == undefined) {
    objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null)
    });
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function (key) {
    ArrayPrototype[UNSCOPABLES][key] = true;
  };

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$2 = internalState.set;
  var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.es/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.es/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.es/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.es/ecma262/#sec-createarrayiterator
  defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState$2(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.es/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var getIterator = function (it) {
    var iteratorMethod = getIteratorMethod(it);
    if (typeof iteratorMethod != 'function') {
      throw TypeError(String(it) + ' is not iterable');
    } return anObject(iteratorMethod.call(it));
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















  var $fetch = getBuiltIn('fetch');
  var Headers = getBuiltIn('Headers');
  var ITERATOR = wellKnownSymbol('iterator');
  var URL_SEARCH_PARAMS = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
  var setInternalState$1 = internalState.set;
  var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
  var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

  var plus = /\+/g;
  var sequences = Array(4);

  var percentSequence = function (bytes) {
    return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
  };

  var percentDecode = function (sequence) {
    try {
      return decodeURIComponent(sequence);
    } catch (error) {
      return sequence;
    }
  };

  var deserialize = function (it) {
    var result = it.replace(plus, ' ');
    var bytes = 4;
    try {
      return decodeURIComponent(result);
    } catch (error) {
      while (bytes) {
        result = result.replace(percentSequence(bytes--), percentDecode);
      }
      return result;
    }
  };

  var find = /[!'()~]|%20/g;

  var replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+'
  };

  var replacer = function (match) {
    return replace[match];
  };

  var serialize = function (it) {
    return encodeURIComponent(it).replace(find, replacer);
  };

  var parseSearchParams = function (result, query) {
    if (query) {
      var attributes = query.split('&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = attribute.split('=');
          result.push({
            key: deserialize(entry.shift()),
            value: deserialize(entry.join('='))
          });
        }
      }
    }
  };

  var updateSearchParams = function (query) {
    this.entries.length = 0;
    parseSearchParams(this.entries, query);
  };

  var validateArgumentsLength = function (passed, required) {
    if (passed < required) throw TypeError('Not enough arguments');
  };

  var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
    setInternalState$1(this, {
      type: URL_SEARCH_PARAMS_ITERATOR,
      iterator: getIterator(getInternalParamsState(params).entries),
      kind: kind
    });
  }, 'Iterator', function next() {
    var state = getInternalIteratorState(this);
    var kind = state.kind;
    var step = state.iterator.next();
    var entry = step.value;
    if (!step.done) {
      step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
    } return step;
  });

  // `URLSearchParams` constructor
  // https://url.spec.whatwg.org/#interface-urlsearchparams
  var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
    anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
    var init = arguments.length > 0 ? arguments[0] : undefined;
    var that = this;
    var entries = [];
    var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

    setInternalState$1(that, {
      type: URL_SEARCH_PARAMS,
      entries: entries,
      updateURL: function () { /* empty */ },
      updateSearchParams: updateSearchParams
    });

    if (init !== undefined) {
      if (isObject$2(init)) {
        iteratorMethod = getIteratorMethod(init);
        if (typeof iteratorMethod === 'function') {
          iterator = iteratorMethod.call(init);
          next = iterator.next;
          while (!(step = next.call(iterator)).done) {
            entryIterator = getIterator(anObject(step.value));
            entryNext = entryIterator.next;
            if (
              (first = entryNext.call(entryIterator)).done ||
              (second = entryNext.call(entryIterator)).done ||
              !entryNext.call(entryIterator).done
            ) throw TypeError('Expected sequence with length 2');
            entries.push({ key: first.value + '', value: second.value + '' });
          }
        } else for (key in init) if (has$1(init, key)) entries.push({ key: key, value: init[key] + '' });
      } else {
        parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
      }
    }
  };

  var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

  redefineAll(URLSearchParamsPrototype, {
    // `URLSearchParams.prototype.append` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-append
    append: function append(name, value) {
      validateArgumentsLength(arguments.length, 2);
      var state = getInternalParamsState(this);
      state.entries.push({ key: name + '', value: value + '' });
      state.updateURL();
    },
    // `URLSearchParams.prototype.delete` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
    'delete': function (name) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index].key === key) entries.splice(index, 1);
        else index++;
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.get` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-get
    get: function get(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) return entries[index].value;
      }
      return null;
    },
    // `URLSearchParams.prototype.getAll` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
    getAll: function getAll(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var result = [];
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) result.push(entries[index].value);
      }
      return result;
    },
    // `URLSearchParams.prototype.has` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-has
    has: function has(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index++].key === key) return true;
      }
      return false;
    },
    // `URLSearchParams.prototype.set` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-set
    set: function set(name, value) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var found = false;
      var key = name + '';
      var val = value + '';
      var index = 0;
      var entry;
      for (; index < entries.length; index++) {
        entry = entries[index];
        if (entry.key === key) {
          if (found) entries.splice(index--, 1);
          else {
            found = true;
            entry.value = val;
          }
        }
      }
      if (!found) entries.push({ key: key, value: val });
      state.updateURL();
    },
    // `URLSearchParams.prototype.sort` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
    sort: function sort() {
      var state = getInternalParamsState(this);
      var entries = state.entries;
      // Array#sort is not stable in some engines
      var slice = entries.slice();
      var entry, entriesIndex, sliceIndex;
      entries.length = 0;
      for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
        entry = slice[sliceIndex];
        for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
          if (entries[entriesIndex].key > entry.key) {
            entries.splice(entriesIndex, 0, entry);
            break;
          }
        }
        if (entriesIndex === sliceIndex) entries.push(entry);
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.forEach` method
    forEach: function forEach(callback /* , thisArg */) {
      var entries = getInternalParamsState(this).entries;
      var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        boundFunction(entry.value, entry.key, this);
      }
    },
    // `URLSearchParams.prototype.keys` method
    keys: function keys() {
      return new URLSearchParamsIterator(this, 'keys');
    },
    // `URLSearchParams.prototype.values` method
    values: function values() {
      return new URLSearchParamsIterator(this, 'values');
    },
    // `URLSearchParams.prototype.entries` method
    entries: function entries() {
      return new URLSearchParamsIterator(this, 'entries');
    }
  }, { enumerable: true });

  // `URLSearchParams.prototype[@@iterator]` method
  redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

  // `URLSearchParams.prototype.toString` method
  // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
  redefine(URLSearchParamsPrototype, 'toString', function toString() {
    var entries = getInternalParamsState(this).entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      result.push(serialize(entry.key) + '=' + serialize(entry.value));
    } return result.join('&');
  }, { enumerable: true });

  setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

  _export({ global: true, forced: !nativeUrl }, {
    URLSearchParams: URLSearchParamsConstructor
  });

  // Wrap `fetch` for correct work with polyfilled `URLSearchParams`
  // https://github.com/zloirock/core-js/issues/674
  if (!nativeUrl && typeof $fetch == 'function' && typeof Headers == 'function') {
    _export({ global: true, enumerable: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        var args = [input];
        var init, body, headers;
        if (arguments.length > 1) {
          init = arguments[1];
          if (isObject$2(init)) {
            body = init.body;
            if (classof(body) === URL_SEARCH_PARAMS) {
              headers = init.headers ? new Headers(init.headers) : new Headers();
              if (!headers.has('content-type')) {
                headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
              }
              init = objectCreate(init, {
                body: createPropertyDescriptor(0, String(body)),
                headers: createPropertyDescriptor(0, headers)
              });
            }
          }
          args.push(init);
        } return $fetch.apply(this, args);
      }
    });
  }

  var web_urlSearchParams = {
    URLSearchParams: URLSearchParamsConstructor,
    getState: getInternalParamsState
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











  var codeAt = stringMultibyte.codeAt;





  var NativeURL = global_1.URL;
  var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
  var getInternalSearchParamsState = web_urlSearchParams.getState;
  var setInternalState = internalState.set;
  var getInternalURLState = internalState.getterFor('URL');
  var floor = Math.floor;
  var pow = Math.pow;

  var INVALID_AUTHORITY = 'Invalid authority';
  var INVALID_SCHEME = 'Invalid scheme';
  var INVALID_HOST = 'Invalid host';
  var INVALID_PORT = 'Invalid port';

  var ALPHA = /[A-Za-z]/;
  var ALPHANUMERIC = /[\d+-.A-Za-z]/;
  var DIGIT = /\d/;
  var HEX_START = /^(0x|0X)/;
  var OCT = /^[0-7]+$/;
  var DEC = /^\d+$/;
  var HEX = /^[\dA-Fa-f]+$/;
  /* eslint-disable no-control-regex -- safe */
  var FORBIDDEN_HOST_CODE_POINT = /[\u0000\t\u000A\u000D #%/:?@[\\]]/;
  var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\t\u000A\u000D #/:?@[\\]]/;
  var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
  var TAB_AND_NEW_LINE = /[\t\u000A\u000D]/g;
  /* eslint-enable no-control-regex -- safe */
  var EOF;

  var parseHost = function (url, input) {
    var result, codePoints, index;
    if (input.charAt(0) == '[') {
      if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
      result = parseIPv6(input.slice(1, -1));
      if (!result) return INVALID_HOST;
      url.host = result;
    // opaque host
    } else if (!isSpecial(url)) {
      if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      url.host = result;
    } else {
      input = stringPunycodeToAscii(input);
      if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
      result = parseIPv4(input);
      if (result === null) return INVALID_HOST;
      url.host = result;
    }
  };

  var parseIPv4 = function (input) {
    var parts = input.split('.');
    var partsLength, numbers, index, part, radix, number, ipv4;
    if (parts.length && parts[parts.length - 1] == '') {
      parts.pop();
    }
    partsLength = parts.length;
    if (partsLength > 4) return input;
    numbers = [];
    for (index = 0; index < partsLength; index++) {
      part = parts[index];
      if (part == '') return input;
      radix = 10;
      if (part.length > 1 && part.charAt(0) == '0') {
        radix = HEX_START.test(part) ? 16 : 8;
        part = part.slice(radix == 8 ? 1 : 2);
      }
      if (part === '') {
        number = 0;
      } else {
        if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
        number = parseInt(part, radix);
      }
      numbers.push(number);
    }
    for (index = 0; index < partsLength; index++) {
      number = numbers[index];
      if (index == partsLength - 1) {
        if (number >= pow(256, 5 - partsLength)) return null;
      } else if (number > 255) return null;
    }
    ipv4 = numbers.pop();
    for (index = 0; index < numbers.length; index++) {
      ipv4 += numbers[index] * pow(256, 3 - index);
    }
    return ipv4;
  };

  // eslint-disable-next-line max-statements -- TODO
  var parseIPv6 = function (input) {
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var pointer = 0;
    var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

    var char = function () {
      return input.charAt(pointer);
    };

    if (char() == ':') {
      if (input.charAt(1) != ':') return;
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }
    while (char()) {
      if (pieceIndex == 8) return;
      if (char() == ':') {
        if (compress !== null) return;
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }
      value = length = 0;
      while (length < 4 && HEX.test(char())) {
        value = value * 16 + parseInt(char(), 16);
        pointer++;
        length++;
      }
      if (char() == '.') {
        if (length == 0) return;
        pointer -= length;
        if (pieceIndex > 6) return;
        numbersSeen = 0;
        while (char()) {
          ipv4Piece = null;
          if (numbersSeen > 0) {
            if (char() == '.' && numbersSeen < 4) pointer++;
            else return;
          }
          if (!DIGIT.test(char())) return;
          while (DIGIT.test(char())) {
            number = parseInt(char(), 10);
            if (ipv4Piece === null) ipv4Piece = number;
            else if (ipv4Piece == 0) return;
            else ipv4Piece = ipv4Piece * 10 + number;
            if (ipv4Piece > 255) return;
            pointer++;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
        }
        if (numbersSeen != 4) return;
        break;
      } else if (char() == ':') {
        pointer++;
        if (!char()) return;
      } else if (char()) return;
      address[pieceIndex++] = value;
    }
    if (compress !== null) {
      swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex != 0 && swaps > 0) {
        swap = address[pieceIndex];
        address[pieceIndex--] = address[compress + swaps - 1];
        address[compress + --swaps] = swap;
      }
    } else if (pieceIndex != 8) return;
    return address;
  };

  var findLongestZeroSequence = function (ipv6) {
    var maxIndex = null;
    var maxLength = 1;
    var currStart = null;
    var currLength = 0;
    var index = 0;
    for (; index < 8; index++) {
      if (ipv6[index] !== 0) {
        if (currLength > maxLength) {
          maxIndex = currStart;
          maxLength = currLength;
        }
        currStart = null;
        currLength = 0;
      } else {
        if (currStart === null) currStart = index;
        ++currLength;
      }
    }
    if (currLength > maxLength) {
      maxIndex = currStart;
      maxLength = currLength;
    }
    return maxIndex;
  };

  var serializeHost = function (host) {
    var result, index, compress, ignore0;
    // ipv4
    if (typeof host == 'number') {
      result = [];
      for (index = 0; index < 4; index++) {
        result.unshift(host % 256);
        host = floor(host / 256);
      } return result.join('.');
    // ipv6
    } else if (typeof host == 'object') {
      result = '';
      compress = findLongestZeroSequence(host);
      for (index = 0; index < 8; index++) {
        if (ignore0 && host[index] === 0) continue;
        if (ignore0) ignore0 = false;
        if (compress === index) {
          result += index ? ':' : '::';
          ignore0 = true;
        } else {
          result += host[index].toString(16);
          if (index < 7) result += ':';
        }
      }
      return '[' + result + ']';
    } return host;
  };

  var C0ControlPercentEncodeSet = {};
  var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
    ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
  });
  var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
    '#': 1, '?': 1, '{': 1, '}': 1
  });
  var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
    '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
  });

  var percentEncode = function (char, set) {
    var code = codeAt(char, 0);
    return code > 0x20 && code < 0x7F && !has$1(set, char) ? char : encodeURIComponent(char);
  };

  var specialSchemes = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };

  var isSpecial = function (url) {
    return has$1(specialSchemes, url.scheme);
  };

  var includesCredentials = function (url) {
    return url.username != '' || url.password != '';
  };

  var cannotHaveUsernamePasswordPort = function (url) {
    return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
  };

  var isWindowsDriveLetter = function (string, normalized) {
    var second;
    return string.length == 2 && ALPHA.test(string.charAt(0))
      && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
  };

  var startsWithWindowsDriveLetter = function (string) {
    var third;
    return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
      string.length == 2 ||
      ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
    );
  };

  var shortenURLsPath = function (url) {
    var path = url.path;
    var pathSize = path.length;
    if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
      path.pop();
    }
  };

  var isSingleDot = function (segment) {
    return segment === '.' || segment.toLowerCase() === '%2e';
  };

  var isDoubleDot = function (segment) {
    segment = segment.toLowerCase();
    return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
  };

  // States:
  var SCHEME_START = {};
  var SCHEME = {};
  var NO_SCHEME = {};
  var SPECIAL_RELATIVE_OR_AUTHORITY = {};
  var PATH_OR_AUTHORITY = {};
  var RELATIVE = {};
  var RELATIVE_SLASH = {};
  var SPECIAL_AUTHORITY_SLASHES = {};
  var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
  var AUTHORITY = {};
  var HOST = {};
  var HOSTNAME = {};
  var PORT = {};
  var FILE = {};
  var FILE_SLASH = {};
  var FILE_HOST = {};
  var PATH_START = {};
  var PATH = {};
  var CANNOT_BE_A_BASE_URL_PATH = {};
  var QUERY = {};
  var FRAGMENT = {};

  // eslint-disable-next-line max-statements -- TODO
  var parseURL = function (url, input, stateOverride, base) {
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, char, bufferCodePoints, failure;

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
    }

    input = input.replace(TAB_AND_NEW_LINE, '');

    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      char = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (char && ALPHA.test(char)) {
            buffer += char.toLowerCase();
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;

        case SCHEME:
          if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
            buffer += char.toLowerCase();
          } else if (char == ':') {
            if (stateOverride && (
              (isSpecial(url) != has$1(specialSchemes, buffer)) ||
              (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
              (url.scheme == 'file' && !url.host)
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme == 'file') {
              state = FILE;
            } else if (isSpecial(url) && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (isSpecial(url)) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              url.path.push('');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;

        case NO_SCHEME:
          if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
          if (base.cannotBeABaseURL && char == '#') {
            url.scheme = base.scheme;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme == 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (char == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          } break;

        case PATH_OR_AUTHORITY:
          if (char == '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;
          if (char == EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '/' || (char == '\\' && isSpecial(url))) {
            state = RELATIVE_SLASH;
          } else if (char == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.path.pop();
            state = PATH;
            continue;
          } break;

        case RELATIVE_SLASH:
          if (isSpecial(url) && (char == '/' || char == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (char == '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (char != '/' && char != '\\') {
            state = AUTHORITY;
            continue;
          } break;

        case AUTHORITY:
          if (char == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url))
          ) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += char;
          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST;
            continue;
          } else if (char == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
            if (stateOverride == HOSTNAME) return;
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url))
          ) {
            if (isSpecial(url) && buffer == '') return INVALID_HOST;
            if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (char == '[') seenBracket = true;
            else if (char == ']') seenBracket = false;
            buffer += char;
          } break;

        case PORT:
          if (DIGIT.test(char)) {
            buffer += char;
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url)) ||
            stateOverride
          ) {
            if (buffer != '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;

        case FILE:
          url.scheme = 'file';
          if (char == '/' || char == '\\') state = FILE_SLASH;
          else if (base && base.scheme == 'file') {
            if (char == EOF) {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
            } else if (char == '?') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
                url.host = base.host;
                url.path = base.path.slice();
                shortenURLsPath(url);
              }
              state = PATH;
              continue;
            }
          } else {
            state = PATH;
            continue;
          } break;

        case FILE_SLASH:
          if (char == '/' || char == '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
            if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
            else url.host = base.host;
          }
          state = PATH;
          continue;

        case FILE_HOST:
          if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = parseHost(url, buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            } continue;
          } else buffer += char;
          break;

        case PATH_START:
          if (isSpecial(url)) {
            state = PATH;
            if (char != '/' && char != '\\') continue;
          } else if (!stateOverride && char == '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            state = PATH;
            if (char != '/') continue;
          } break;

        case PATH:
          if (
            char == EOF || char == '/' ||
            (char == '\\' && isSpecial(url)) ||
            (!stateOverride && (char == '?' || char == '#'))
          ) {
            if (isDoubleDot(buffer)) {
              shortenURLsPath(url);
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else if (isSingleDot(buffer)) {
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                if (url.host) url.host = '';
                buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
              }
              url.path.push(buffer);
            }
            buffer = '';
            if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                url.path.shift();
              }
            }
            if (char == '?') {
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += percentEncode(char, pathPercentEncodeSet);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
          } break;

        case QUERY:
          if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            if (char == "'" && isSpecial(url)) url.query += '%27';
            else if (char == '#') url.query += '%23';
            else url.query += percentEncode(char, C0ControlPercentEncodeSet);
          } break;

        case FRAGMENT:
          if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  };

  // `URL` constructor
  // https://url.spec.whatwg.org/#url-class
  var URLConstructor = function URL(url /* , base */) {
    var that = anInstance(this, URLConstructor, 'URL');
    var base = arguments.length > 1 ? arguments[1] : undefined;
    var urlString = String(url);
    var state = setInternalState(that, { type: 'URL' });
    var baseState, failure;
    if (base !== undefined) {
      if (base instanceof URLConstructor) baseState = getInternalURLState(base);
      else {
        failure = parseURL(baseState = {}, String(base));
        if (failure) throw TypeError(failure);
      }
    }
    failure = parseURL(state, urlString, null, baseState);
    if (failure) throw TypeError(failure);
    var searchParams = state.searchParams = new URLSearchParams$1();
    var searchParamsState = getInternalSearchParamsState(searchParams);
    searchParamsState.updateSearchParams(state.query);
    searchParamsState.updateURL = function () {
      state.query = String(searchParams) || null;
    };
    if (!descriptors) {
      that.href = serializeURL.call(that);
      that.origin = getOrigin.call(that);
      that.protocol = getProtocol.call(that);
      that.username = getUsername.call(that);
      that.password = getPassword.call(that);
      that.host = getHost.call(that);
      that.hostname = getHostname.call(that);
      that.port = getPort.call(that);
      that.pathname = getPathname.call(that);
      that.search = getSearch.call(that);
      that.searchParams = getSearchParams.call(that);
      that.hash = getHash.call(that);
    }
  };

  var URLPrototype = URLConstructor.prototype;

  var serializeURL = function () {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (includesCredentials(url)) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  };

  var getOrigin = function () {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var port = url.port;
    if (scheme == 'blob') try {
      return new URL(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !isSpecial(url)) return 'null';
    return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
  };

  var getProtocol = function () {
    return getInternalURLState(this).scheme + ':';
  };

  var getUsername = function () {
    return getInternalURLState(this).username;
  };

  var getPassword = function () {
    return getInternalURLState(this).password;
  };

  var getHost = function () {
    var url = getInternalURLState(this);
    var host = url.host;
    var port = url.port;
    return host === null ? ''
      : port === null ? serializeHost(host)
      : serializeHost(host) + ':' + port;
  };

  var getHostname = function () {
    var host = getInternalURLState(this).host;
    return host === null ? '' : serializeHost(host);
  };

  var getPort = function () {
    var port = getInternalURLState(this).port;
    return port === null ? '' : String(port);
  };

  var getPathname = function () {
    var url = getInternalURLState(this);
    var path = url.path;
    return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  };

  var getSearch = function () {
    var query = getInternalURLState(this).query;
    return query ? '?' + query : '';
  };

  var getSearchParams = function () {
    return getInternalURLState(this).searchParams;
  };

  var getHash = function () {
    var fragment = getInternalURLState(this).fragment;
    return fragment ? '#' + fragment : '';
  };

  var accessorDescriptor = function (getter, setter) {
    return { get: getter, set: setter, configurable: true, enumerable: true };
  };

  if (descriptors) {
    objectDefineProperties(URLPrototype, {
      // `URL.prototype.href` accessors pair
      // https://url.spec.whatwg.org/#dom-url-href
      href: accessorDescriptor(serializeURL, function (href) {
        var url = getInternalURLState(this);
        var urlString = String(href);
        var failure = parseURL(url, urlString);
        if (failure) throw TypeError(failure);
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.origin` getter
      // https://url.spec.whatwg.org/#dom-url-origin
      origin: accessorDescriptor(getOrigin),
      // `URL.prototype.protocol` accessors pair
      // https://url.spec.whatwg.org/#dom-url-protocol
      protocol: accessorDescriptor(getProtocol, function (protocol) {
        var url = getInternalURLState(this);
        parseURL(url, String(protocol) + ':', SCHEME_START);
      }),
      // `URL.prototype.username` accessors pair
      // https://url.spec.whatwg.org/#dom-url-username
      username: accessorDescriptor(getUsername, function (username) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(username));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.username = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.password` accessors pair
      // https://url.spec.whatwg.org/#dom-url-password
      password: accessorDescriptor(getPassword, function (password) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(password));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.password = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.host` accessors pair
      // https://url.spec.whatwg.org/#dom-url-host
      host: accessorDescriptor(getHost, function (host) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(host), HOST);
      }),
      // `URL.prototype.hostname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hostname
      hostname: accessorDescriptor(getHostname, function (hostname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(hostname), HOSTNAME);
      }),
      // `URL.prototype.port` accessors pair
      // https://url.spec.whatwg.org/#dom-url-port
      port: accessorDescriptor(getPort, function (port) {
        var url = getInternalURLState(this);
        if (cannotHaveUsernamePasswordPort(url)) return;
        port = String(port);
        if (port == '') url.port = null;
        else parseURL(url, port, PORT);
      }),
      // `URL.prototype.pathname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-pathname
      pathname: accessorDescriptor(getPathname, function (pathname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        url.path = [];
        parseURL(url, pathname + '', PATH_START);
      }),
      // `URL.prototype.search` accessors pair
      // https://url.spec.whatwg.org/#dom-url-search
      search: accessorDescriptor(getSearch, function (search) {
        var url = getInternalURLState(this);
        search = String(search);
        if (search == '') {
          url.query = null;
        } else {
          if ('?' == search.charAt(0)) search = search.slice(1);
          url.query = '';
          parseURL(url, search, QUERY);
        }
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.searchParams` getter
      // https://url.spec.whatwg.org/#dom-url-searchparams
      searchParams: accessorDescriptor(getSearchParams),
      // `URL.prototype.hash` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hash
      hash: accessorDescriptor(getHash, function (hash) {
        var url = getInternalURLState(this);
        hash = String(hash);
        if (hash == '') {
          url.fragment = null;
          return;
        }
        if ('#' == hash.charAt(0)) hash = hash.slice(1);
        url.fragment = '';
        parseURL(url, hash, FRAGMENT);
      })
    });
  }

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  redefine(URLPrototype, 'toJSON', function toJSON() {
    return serializeURL.call(this);
  }, { enumerable: true });

  // `URL.prototype.toString` method
  // https://url.spec.whatwg.org/#URL-stringification-behavior
  redefine(URLPrototype, 'toString', function toString() {
    return serializeURL.call(this);
  }, { enumerable: true });

  if (NativeURL) {
    var nativeCreateObjectURL = NativeURL.createObjectURL;
    var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
    // `URL.createObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
      return nativeCreateObjectURL.apply(NativeURL, arguments);
    });
    // `URL.revokeObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
      return nativeRevokeObjectURL.apply(NativeURL, arguments);
    });
  }

  setToStringTag(URLConstructor, 'URL');

  _export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
    URL: URLConstructor
  });

  // ==========================================================================
  // Type checking utils
  // ==========================================================================
  const getConstructor$1 = input => input !== null && typeof input !== 'undefined' ? input.constructor : null;

  const instanceOf$1 = (input, constructor) => Boolean(input && constructor && input instanceof constructor);

  const isNullOrUndefined$1 = input => input === null || typeof input === 'undefined';

  const isObject$1 = input => getConstructor$1(input) === Object;

  const isNumber$1 = input => getConstructor$1(input) === Number && !Number.isNaN(input);

  const isString$1 = input => getConstructor$1(input) === String;

  const isBoolean$1 = input => getConstructor$1(input) === Boolean;

  const isFunction$1 = input => getConstructor$1(input) === Function;

  const isArray$1 = input => Array.isArray(input);

  const isWeakMap = input => instanceOf$1(input, WeakMap);

  const isNodeList$1 = input => instanceOf$1(input, NodeList);

  const isTextNode = input => getConstructor$1(input) === Text;

  const isEvent$1 = input => instanceOf$1(input, Event);

  const isKeyboardEvent = input => instanceOf$1(input, KeyboardEvent);

  const isCue = input => instanceOf$1(input, window.TextTrackCue) || instanceOf$1(input, window.VTTCue);

  const isTrack = input => instanceOf$1(input, TextTrack) || !isNullOrUndefined$1(input) && isString$1(input.kind);

  const isPromise = input => instanceOf$1(input, Promise) && isFunction$1(input.then);

  const isElement$1 = input => input !== null && typeof input === 'object' && input.nodeType === 1 && typeof input.style === 'object' && typeof input.ownerDocument === 'object';

  const isEmpty$1 = input => isNullOrUndefined$1(input) || (isString$1(input) || isArray$1(input) || isNodeList$1(input)) && !input.length || isObject$1(input) && !Object.keys(input).length;

  const isUrl = input => {
    // Accept a URL object
    if (instanceOf$1(input, window.URL)) {
      return true;
    } // Must be string from here


    if (!isString$1(input)) {
      return false;
    } // Add the protocol if required


    let string = input;

    if (!input.startsWith('http://') || !input.startsWith('https://')) {
      string = `http://${input}`;
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

  function cloneDeep(object) {
    return JSON.parse(JSON.stringify(object));
  } // Get a nested value in an object

  function getDeep(object, path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], object);
  } // Deep extend destination object with N more objects

  function extend(target = {}, ...sources) {
    if (!sources.length) {
      return target;
    }

    const source = sources.shift();

    if (!is$1.object(source)) {
      return target;
    }

    Object.keys(source).forEach(key => {
      if (is$1.object(source[key])) {
        if (!Object.keys(target).includes(key)) {
          Object.assign(target, {
            [key]: {}
          });
        }

        extend(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    });
    return extend(target, ...sources);
  }

  // ==========================================================================

  function getPercentage(current, max) {
    if (current === 0 || max === 0 || Number.isNaN(current) || Number.isNaN(max)) {
      return 0;
    }

    return (current / max * 100).toFixed(2);
  } // Replace all occurances of a string in a string

  const replaceAll = (input = '', find = '', replace = '') => input.replace(new RegExp(find.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'g'), replace.toString()); // Convert to title case

  const toTitleCase = (input = '') => input.toString().replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()); // Convert string to pascalCase

  function toPascalCase(input = '') {
    let string = input.toString(); // Convert kebab case

    string = replaceAll(string, '-', ' '); // Convert snake case

    string = replaceAll(string, '_', ' '); // Convert to title case

    string = toTitleCase(string); // Convert to pascal case

    return replaceAll(string, ' ', '');
  } // Convert string to pascalCase

  function toCamelCase(input = '') {
    let string = input.toString(); // Convert to pascal case

    string = toPascalCase(string); // Convert first character to lowercase

    return string.charAt(0).toLowerCase() + string.slice(1);
  } // Remove HTML from a string

  // ==========================================================================

  const resources = {
    pip: 'PIP',
    airplay: 'AirPlay',
    html5: 'HTML5',
    vimeo: 'Vimeo',
    youtube: 'YouTube'
  };
  const i18n = {
    get(key = '', config = {}) {
      if (is$1.empty(key) || is$1.empty(config)) {
        return '';
      }

      let string = getDeep(config.i18n, key);

      if (is$1.empty(string)) {
        if (Object.keys(resources).includes(key)) {
          return resources[key];
        }

        return '';
      }

      const replace = {
        '{seektime}': config.seekTime,
        '{title}': config.title
      };
      Object.entries(replace).forEach(([k, v]) => {
        string = replaceAll(string, k, v);
      });
      return string;
    }

  };

  // ==========================================================================
  const captions = {
    setup() {
      return undefined;
    },

    update() {
      throw new Error('captions#update is removed!');
    },

    toggle() {
      throw new Error('captions#toggle is removed!');
    },

    set() {
      throw new Error('captions#set is removed!');
    },

    setLanguage() {
      throw new Error('captions#setLanguage is removed!');
    },

    getTracks() {
      throw new Error('captions#getTracks is removed!');
    },

    findTrack() {
      throw new Error('captions#findTrack is removed!');
    },

    getCurrentTrack() {
      throw new Error('captions#getCurrentTrack is removed!');
    },

    getLabel() {
      return i18n.get('disabled', this.config);
    },

    updateCues() {
      throw new Error('captions#updateCues is removed!');
    }

  };

  // ==========================================================================
  // Plyr default config
  // ==========================================================================
  const defaults$1 = {
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
    iconUrl: 'https://cdn.plyr.io/3.6.4/plyr.svg',
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
      iosNative: false,
      // Use the native fullscreen in iOS (disables custom controls)
      dblclick: true // Toggle fullscreen on double click
      // Selector for the fullscreen container so contextual / non-player content can remain visible in fullscreen mode
      // Non-ancestors of the player element will be ignored
      // container: null, // defaults to the player element

    },
    // Local storage
    storage: {
      enabled: true,
      key: 'ggs-plyr'
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
      container: '.ggs-plyr',
      controls: {
        container: null,
        wrapper: '.ggs-plyr__controls'
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
        currentTime: '.ggs-plyr__time--current',
        duration: '.ggs-plyr__time--duration',
        buffer: '.ggs-plyr__progress__buffer',
        loop: '.ggs-plyr__progress__loop',
        // Used later
        volume: '.ggs-plyr__volume--display'
      },
      progress: '.ggs-plyr__progress',
      captions: '.ggs-plyr__captions',
      caption: '.ggs-plyr__caption'
    },
    // Class hooks added to the player in different states
    classNames: {
      type: 'ggs-plyr--{0}',
      provider: 'ggs-plyr--{0}',
      video: 'ggs-plyr__video-wrapper',
      embed: 'ggs-plyr__video-embed',
      videoFixedRatio: 'ggs-plyr__video-wrapper--fixed-ratio',
      embedContainer: 'ggs-plyr__video-embed__container',
      poster: 'ggs-plyr__poster',
      posterEnabled: 'ggs-plyr__poster-enabled',
      ads: 'ggs-plyr__ads',
      control: 'ggs-plyr__control',
      controlPressed: 'ggs-plyr__control--pressed',
      playing: 'ggs-plyr--playing',
      paused: 'ggs-plyr--paused',
      stopped: 'ggs-plyr--stopped',
      loading: 'ggs-plyr--loading',
      hover: 'ggs-plyr--hover',
      tooltip: 'ggs-plyr__tooltip',
      cues: 'ggs-plyr__cues',
      hidden: 'ggs-plyr__sr-only',
      hideControls: 'ggs-plyr--hide-controls',
      isIos: 'ggs-plyr--is-ios',
      isTouch: 'ggs-plyr--is-touch',
      uiSupported: 'ggs-plyr--full-ui',
      noTransition: 'ggs-plyr--no-transition',
      display: {
        time: 'ggs-plyr__time'
      },
      menu: {
        value: 'ggs-plyr__menu__value',
        badge: 'ggs-plyr__badge',
        open: 'ggs-plyr--menu-open'
      },
      captions: {
        enabled: 'ggs-plyr--captions-enabled',
        active: 'ggs-plyr--captions-active'
      },
      fullscreen: {
        enabled: 'ggs-plyr--fullscreen-enabled',
        fallback: 'ggs-plyr--fullscreen-fallback'
      },
      pip: {
        supported: 'ggs-plyr--pip-supported',
        active: 'ggs-plyr--pip-active'
      },
      airplay: {
        supported: 'ggs-plyr--airplay-supported',
        active: 'ggs-plyr--airplay-active'
      },
      tabFocus: 'ggs-plyr__tab-focus',
      previewThumbnails: {
        // Tooltip thumbs
        thumbContainer: 'ggs-plyr__preview-thumb',
        thumbContainerShown: 'ggs-plyr__preview-thumb--is-shown',
        imageContainer: 'ggs-plyr__preview-thumb__image-container',
        timeContainer: 'ggs-plyr__preview-thumb__time-container',
        // Scrubbing
        scrubbingContainer: 'ggs-plyr__preview-scrubbing',
        scrubbingContainerShown: 'ggs-plyr__preview-scrubbing--is-shown'
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
  const pip = {
    active: 'picture-in-picture',
    inactive: 'inline'
  };

  // ==========================================================================
  // Plyr supported types and providers
  // ==========================================================================
  const providers = {
    html5: 'html5',
    youtube: 'youtube',
    vimeo: 'vimeo'
  };
  const types = {
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
  const noop = () => {};

  class Console {
    constructor(enabled = false) {
      this.enabled = window.console && enabled;

      if (this.enabled) {
        this.log('Debugging enabled');
      }
    }

    get log() {
      // eslint-disable-next-line no-console
      return this.enabled ? Function.prototype.bind.call(console.log, console) : noop;
    }

    get warn() {
      // eslint-disable-next-line no-console
      return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop;
    }

    get error() {
      // eslint-disable-next-line no-console
      return this.enabled ? Function.prototype.bind.call(console.error, console) : noop;
    }

  }

  function _classCallCheck(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
  }

  function _defineProperties(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
    }
  }

  function _createClass(e, t, n) {
    return t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e;
  }

  function _defineProperty(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e;
  }

  function ownKeys(e, t) {
    var n = Object.keys(e);

    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t && (r = r.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })), n.push.apply(n, r);
    }

    return n;
  }

  function _objectSpread2(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2 ? ownKeys(Object(n), !0).forEach(function (t) {
        _defineProperty(e, t, n[t]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ownKeys(Object(n)).forEach(function (t) {
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

  function matches$1(e, t) {
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

  var getConstructor = function (e) {
    return null != e ? e.constructor : null;
  },
      instanceOf = function (e, t) {
    return !!(e && t && e instanceof t);
  },
      isNullOrUndefined = function (e) {
    return null == e;
  },
      isObject = function (e) {
    return getConstructor(e) === Object;
  },
      isNumber = function (e) {
    return getConstructor(e) === Number && !Number.isNaN(e);
  },
      isString = function (e) {
    return getConstructor(e) === String;
  },
      isBoolean = function (e) {
    return getConstructor(e) === Boolean;
  },
      isFunction = function (e) {
    return getConstructor(e) === Function;
  },
      isArray = function (e) {
    return Array.isArray(e);
  },
      isNodeList = function (e) {
    return instanceOf(e, NodeList);
  },
      isElement = function (e) {
    return instanceOf(e, Element);
  },
      isEvent = function (e) {
    return instanceOf(e, Event);
  },
      isEmpty = function (e) {
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
      _classCallCheck(this, e), is.element(t) ? this.element = t : is.string(t) && (this.element = document.querySelector(t)), is.element(this.element) && is.empty(this.element.rangeTouch) && (this.config = _objectSpread2({}, defaults, {}, n), this.init());
    }

    return _createClass(e, [{
      key: "init",
      value: function () {
        e.enabled && (this.config.addCSS && (this.element.style.userSelect = "none", this.element.style.webKitUserSelect = "none", this.element.style.touchAction = "manipulation"), this.listeners(!0), this.element.rangeTouch = this);
      }
    }, {
      key: "destroy",
      value: function () {
        e.enabled && (this.config.addCSS && (this.element.style.userSelect = "", this.element.style.webKitUserSelect = "", this.element.style.touchAction = ""), this.listeners(!1), this.element.rangeTouch = null);
      }
    }, {
      key: "listeners",
      value: function (e) {
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
      value: function (t) {
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
      value: function (t) {
        e.enabled && is.event(t) && !t.target.disabled && (t.preventDefault(), t.target.value = this.get(t), trigger(t.target, "touchend" === t.type ? "change" : "input"));
      }
    }], [{
      key: "setup",
      value: function (t) {
        var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
            r = null;
        if (is.empty(t) || is.string(t) ? r = Array.from(document.querySelectorAll(is.string(t) ? t : 'input[type="range"]')) : is.element(t) ? r = [t] : is.nodeList(t) ? r = Array.from(t) : is.array(t) && (r = t.filter(is.element)), is.empty(r)) return null;

        var i = _objectSpread2({}, defaults, {}, n);

        if (is.string(t) && i.watch) {
          var o = new MutationObserver(function (n) {
            Array.from(n).forEach(function (n) {
              Array.from(n.addedNodes).forEach(function (n) {
                is.element(n) && matches$1(n, t) && new e(n, i);
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
      get: function () {
        return "ontouchstart" in document.documentElement;
      }
    }]), e;
  }();

  // ==========================================================================
  const transitionEndEvent = (() => {
    const element = document.createElement('span');
    const events = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };
    const type = Object.keys(events).find(event => element.style[event] !== undefined);
    return is$1.string(type) ? events[type] : false;
  })(); // Force repaint of element

  function repaint(element, delay) {
    setTimeout(() => {
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
  const browser = {
    isIE:
    /* @cc_on!@ */
    !!document.documentMode,
    isEdge: window.navigator.userAgent.includes('Edge'),
    isWebkit: 'WebkitAppearance' in document.documentElement.style && !/Edge/.test(navigator.userAgent),
    isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
    isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform)
  };

  // ==========================================================================

  function wrap(elements, wrapper) {
    // Convert `elements` to an array, if necessary.
    const targets = elements.length ? elements : [elements]; // Loops backwards to prevent having to clone the wrapper on the
    // first element (see `child` below).

    Array.from(targets).reverse().forEach((element, index) => {
      const child = index > 0 ? wrapper.cloneNode(true) : wrapper; // Cache the current parent and sibling.

      const parent = element.parentNode;
      const sibling = element.nextSibling; // Wrap the element (is automatically removed from its current
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


    Object.entries(attributes).filter(([, value]) => !is$1.nullOrUndefined(value)).forEach(([key, value]) => element.setAttribute(key, value));
  } // Create a DocumentFragment

  function createElement(type, attributes, text) {
    // Create a new <element>
    const element = document.createElement(type); // Set all passed attributes

    if (is$1.object(attributes)) {
      setAttributes(element, attributes);
    } // Add text node


    if (is$1.string(text)) {
      element.innerText = text;
    } // Return built element


    return element;
  } // Inaert an element after another

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

    let {
      length
    } = element.childNodes;

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

    const attributes = {};
    const existing = extend({}, existingAttributes);
    sel.split(',').forEach(s => {
      // Remove whitespace
      const selector = s.trim();
      const className = selector.replace('.', '');
      const stripped = selector.replace(/[[\]]/g, ''); // Get the parts and value

      const parts = stripped.split('=');
      const [key] = parts;
      const value = parts.length > 1 ? parts[1].replace(/["']/g, '') : ''; // Get the first character

      const start = selector.charAt(0);

      switch (start) {
        case '.':
          // Add to existing classname
          if (is$1.string(existing.class)) {
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
      }
    });
    return extend(existing, attributes);
  } // Toggle hidden

  function toggleHidden(element, hidden) {
    if (!is$1.element(element)) {
      return;
    }

    let hide = hidden;

    if (!is$1.boolean(hide)) {
      hide = !element.hidden;
    } // eslint-disable-next-line no-param-reassign


    element.hidden = hide;
  } // Mirror Element.classList.toggle, with IE compatibility for "force" argument

  function toggleClass$1(element, className, force) {
    if (is$1.nodeList(element)) {
      return Array.from(element).map(e => toggleClass$1(e, className, force));
    }

    if (is$1.element(element)) {
      let method = 'toggle';

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

  function matches(element, selector) {
    const {
      prototype
    } = Element;

    function match() {
      return Array.from(document.querySelectorAll(selector)).includes(this);
    }

    const method = prototype.matches || prototype.webkitMatchesSelector || prototype.mozMatchesSelector || prototype.msMatchesSelector || match;
    return method.call(element, selector);
  } // Closest ancestor element matching selector (also tests element itself)

  function closest$1(element, selector) {
    const {
      prototype
    } = Element; // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill

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
  } // Find all elements

  function getElements(selector) {
    return this.elements.container.querySelectorAll(selector);
  } // Find a single element

  function getElement(selector) {
    return this.elements.container.querySelector(selector);
  } // Set focus and tab focus class

  function setFocus(element = null, tabFocus = false) {
    if (!is$1.element(element)) {
      return;
    } // Set regular focus


    element.focus({
      preventScroll: true
    }); // If we want to mimic keyboard focus via tab

    if (tabFocus) {
      toggleClass$1(element, this.config.classNames.tabFocus);
    }
  }

  // ==========================================================================

  const defaultCodecs = {
    'audio/ogg': 'vorbis',
    'audio/wav': '1',
    'video/webm': 'vp8, vorbis',
    'video/mp4': 'avc1.42E01E, mp4a.40.2',
    'video/ogg': 'theora'
  }; // Check for feature support

  const support = {
    // Basic support
    audio: 'canPlayType' in document.createElement('audio'),
    video: 'canPlayType' in document.createElement('video'),

    // Check for support
    // Basic functionality vs full UI
    check(type, provider, playsinline) {
      const canPlayInline = browser.isIPhone && playsinline && support.playsinline;
      const api = support[type] || provider !== 'html5';
      const ui = api && support.rangeInput && (type !== 'video' || !browser.isIPhone || canPlayInline);
      return {
        api,
        ui
      };
    },

    // Picture-in-picture support
    // Safari & Chrome only currently
    pip: (() => {
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
    })(),
    // Airplay support
    // Safari only currently
    airplay: is$1.function(window.WebKitPlaybackTargetAvailabilityEvent),
    // Inline playback support
    // https://webkit.org/blog/6784/new-video-policies-for-ios/
    playsinline: 'playsInline' in document.createElement('video'),

    // Check for mime type support against a player instance
    // Credits: http://diveintohtml5.info/everything.html
    // Related: http://www.leanbackplayer.com/test/h5mt.html
    mime(input) {
      if (is$1.empty(input)) {
        return false;
      }

      const [mediaType] = input.split('/');
      let type = input; // Verify we're using HTML5 and there's no media type mismatch

      if (!this.isHTML5 || mediaType !== this.type) {
        return false;
      } // Add codec if required


      if (Object.keys(defaultCodecs).includes(type)) {
        type += `; codecs="${defaultCodecs[input]}"`;
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
    rangeInput: (() => {
      const range = document.createElement('input');
      range.type = 'range';
      return range.type === 'range';
    })(),
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
        }

      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (e) {// Do nothing
    }

    return supported;
  })(); // Toggle event listener


  function toggleListener(element, event, callback, toggle = false, passive = true, capture = false) {
    // Bail if no element, event, or callback
    if (!element || !('addEventListener' in element) || is$1.empty(event) || !is$1.function(callback)) {
      return;
    } // Allow multiple events


    const events = event.split(' '); // Build options
    // Default to just the capture boolean for browsers with no passive listener support

    let options = capture; // If passive events listeners are supported

    if (supportsPassiveListeners) {
      options = {
        // Whether the listener can be passive (i.e. default never prevented)
        passive,
        // Whether the listener is a capturing listener or not
        capture
      };
    } // If a single node is passed, bind the event listener


    events.forEach(type => {
      if (this && this.eventListeners && toggle) {
        // Cache event listener
        this.eventListeners.push({
          element,
          type,
          callback,
          options
        });
      }

      element[toggle ? 'addEventListener' : 'removeEventListener'](type, callback, options);
    });
  } // Bind event handler

  function on(element, events = '', callback, passive = true, capture = false) {
    toggleListener.call(this, element, events, callback, true, passive, capture);
  } // Unbind event handler

  function off(element, events = '', callback, passive = true, capture = false) {
    toggleListener.call(this, element, events, callback, false, passive, capture);
  } // Bind once-only event handler

  function once(element, events = '', callback, passive = true, capture = false) {
    const onceCallback = (...args) => {
      off(element, events, onceCallback, passive, capture);
      callback.apply(this, args);
    };

    toggleListener.call(this, element, events, onceCallback, true, passive, capture);
  } // Trigger event

  function triggerEvent(element, type = '', bubbles = false, detail = {}) {
    // Bail if no element
    if (!is$1.element(element) || is$1.empty(type)) {
      return;
    } // Create and dispatch the event


    const event = new CustomEvent(type, {
      bubbles,
      detail: { ...detail,
        plyr: this
      }
    }); // Dispatch the event

    element.dispatchEvent(event);
  } // Unbind all cached event listeners

  function unbindListeners() {
    if (this && this.eventListeners) {
      this.eventListeners.forEach(item => {
        const {
          element,
          type,
          callback,
          options
        } = item;
        element.removeEventListener(type, callback, options);
      });
      this.eventListeners = [];
    }
  } // Run method when / if player is ready

  function ready() {
    return new Promise(resolve => this.ready ? setTimeout(resolve, 0) : on.call(this, this.elements.container, 'ready', resolve)).then(() => {});
  }

  /**
   * Silence a Promise-like object.
   * This is useful for avoiding non-harmful, but potentially confusing "uncaught
   * play promise" rejection error messages.
   * @param  {Object} value An object that may or may not be `Promise`-like.
   */

  function silencePromise(value) {
    if (is$1.promise(value)) {
      value.then(null, () => {});
    }
  }

  // ==========================================================================
  function validateRatio(input) {
    if (!is$1.array(input) && (!is$1.string(input) || !input.includes(':'))) {
      return false;
    }

    const ratio = is$1.array(input) ? input : input.split(':');
    return ratio.map(Number).every(is$1.number);
  }
  function reduceAspectRatio(ratio) {
    if (!is$1.array(ratio) || !ratio.every(is$1.number)) {
      return null;
    }

    const [width, height] = ratio;

    const getDivider = (w, h) => h === 0 ? w : getDivider(h, w % h);

    const divider = getDivider(width, height);
    return [width / divider, height / divider];
  }
  function getAspectRatio(input) {
    const parse = ratio => validateRatio(ratio) ? ratio.split(':').map(Number) : null; // Try provided ratio


    let ratio = parse(input); // Get from config

    if (ratio === null) {
      ratio = parse(this.config.ratio);
    } // Get from embed


    if (ratio === null && !is$1.empty(this.embed) && is$1.array(this.embed.ratio)) {
      ({
        ratio
      } = this.embed);
    } // Get from HTML5 video


    if (ratio === null && this.isHTML5) {
      const {
        videoWidth,
        videoHeight
      } = this.media;
      ratio = reduceAspectRatio([videoWidth, videoHeight]);
    }

    return ratio;
  } // Set aspect ratio for responsive container

  function setAspectRatio(input) {
    if (!this.isVideo) {
      return {};
    }

    const {
      wrapper
    } = this.elements;
    const ratio = getAspectRatio.call(this, input);
    const [w, h] = is$1.array(ratio) ? ratio : [0, 0];
    const padding = 100 / w * h;
    wrapper.style.setProperty('padding-bottom', `${padding}%`, 'important'); // For Vimeo we have an extra <div> to hide the standard controls and UI

    if (this.isVimeo && !this.config.vimeo.premium && this.supported.ui) {
      const height = 100 / this.media.offsetWidth * parseInt(window.getComputedStyle(this.media).paddingBottom, 10);
      const offset = (height - padding) / (height / 50);

      if (this.fullscreen.active) {
        wrapper.style.removeProperty('padding-bottom');
      } else {
        this.media.style.setProperty('transform', `translateY(-${offset}%)`, 'important');
      }
    } else if (this.isHTML5) {
      wrapper.classList.toggle(this.config.classNames.videoFixedRatio, ratio !== null);
    }

    return {
      padding,
      ratio
    };
  }

  // ==========================================================================
  const html5 = {
    getSources() {
      if (!this.isHTML5) {
        return [];
      }

      const sources = Array.from(this.media.querySelectorAll('source')); // Filter out unsupported sources (if type is specified)

      return sources.filter(source => {
        const type = source.getAttribute('type');

        if (is$1.empty(type)) {
          return true;
        }

        return support.mime.call(this, type);
      });
    },

    // Get quality levels
    getQualityOptions() {
      // Whether we're forcing all options (e.g. for streaming)
      if (this.config.quality.forced) {
        return this.config.quality.options;
      } // Get sizes from <source> elements


      return html5.getSources.call(this).map(source => Number(source.getAttribute('size'))).filter(Boolean);
    },

    setup() {
      if (!this.isHTML5) {
        return;
      }

      const player = this; // Set speed options from config

      player.options.speed = player.config.speed.options; // Set aspect ratio if fixed

      if (!is$1.empty(this.config.ratio)) {
        setAspectRatio.call(player);
      } // Quality


      Object.defineProperty(player.media, 'quality', {
        get() {
          // Get sources
          const sources = html5.getSources.call(player);
          const source = sources.find(s => s.getAttribute('src') === player.source); // Return size, if match is found

          return source && Number(source.getAttribute('size'));
        },

        set(input) {
          if (player.quality === input) {
            return;
          } // If we're using an an external handler...


          if (player.config.quality.forced && is$1.function(player.config.quality.onChange)) {
            player.config.quality.onChange(input);
          } else {
            // Get sources
            const sources = html5.getSources.call(player); // Get first match for requested size

            const source = sources.find(s => Number(s.getAttribute('size')) === input); // No matching source found

            if (!source) {
              return;
            } // Get current state


            const {
              currentTime,
              paused,
              preload,
              readyState,
              playbackRate
            } = player.media; // Set new source

            player.media.src = source.getAttribute('src'); // Prevent loading if preload="none" and the current source isn't loaded (#1044)

            if (preload !== 'none' || readyState) {
              // Restore time
              player.once('loadedmetadata', () => {
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
    cancelRequests() {
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

    return array.filter((item, index) => array.indexOf(item) === index);
  } // Get the closest value in an array

  function closest(array, value) {
    if (!is$1.array(array) || !array.length) {
      return null;
    }

    return array.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
  }

  class Storage {
    constructor(player) {
      _defineProperty$1(this, "get", key => {
        if (!Storage.supported || !this.enabled) {
          return null;
        }

        const store = window.localStorage.getItem(this.key);

        if (is$1.empty(store)) {
          return null;
        }

        const json = JSON.parse(store);
        return is$1.string(key) && key.length ? json[key] : json;
      });

      _defineProperty$1(this, "set", object => {
        // Bail if we don't have localStorage support or it's disabled
        if (!Storage.supported || !this.enabled) {
          return;
        } // Can only store objectst


        if (!is$1.object(object)) {
          return;
        } // Get current storage


        let storage = this.get(); // Default to empty object

        if (is$1.empty(storage)) {
          storage = {};
        } // Update the working copy of the values


        extend(storage, object); // Update storage

        window.localStorage.setItem(this.key, JSON.stringify(storage));
      });

      this.enabled = player.config.storage.enabled;
      this.key = player.config.storage.key;
    } // Check for actual support (see if we can use it)


    static get supported() {
      try {
        if (!('localStorage' in window)) {
          return false;
        }

        const test = '___test'; // Try to use it (it might be disabled, e.g. user is in private mode)
        // see: https://github.com/sampotts/plyr/issues/131

        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    }

  }

  // ==========================================================================
  // Fetch wrapper
  // Using XHR to avoid issues with older browsers
  // ==========================================================================
  function fetch(url, responseType = 'text') {
    return new Promise((resolve, reject) => {
      try {
        const request = new XMLHttpRequest(); // Check for CORS support

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

    const prefix = 'cache';
    const hasId = is$1.string(id);
    let isCached = false;

    const exists = () => document.getElementById(id) !== null;

    const update = (container, data) => {
      // eslint-disable-next-line no-param-reassign
      container.innerHTML = data; // Check again incase of race condition

      if (hasId && exists()) {
        return;
      } // Inject the SVG to the body


      document.body.insertAdjacentElement('afterbegin', container);
    }; // Only load once if ID set


    if (!hasId || !exists()) {
      const useStorage = Storage.supported; // Create container

      const container = document.createElement('div');
      container.setAttribute('hidden', '');

      if (hasId) {
        container.setAttribute('id', id);
      } // Check in cache


      if (useStorage) {
        const cached = window.localStorage.getItem(`${prefix}-${id}`);
        isCached = cached !== null;

        if (isCached) {
          const data = JSON.parse(cached);
          update(container, data.content);
        }
      } // Get the sprite


      fetch(url).then(result => {
        if (is$1.empty(result)) {
          return;
        }

        if (useStorage) {
          window.localStorage.setItem(`${prefix}-${id}`, JSON.stringify({
            content: result
          }));
        }

        update(container, result);
      }).catch(() => {});
    }
  }

  // ==========================================================================

  const getHours = value => Math.trunc(value / 60 / 60 % 60, 10);
  const getMinutes = value => Math.trunc(value / 60 % 60, 10);
  const getSeconds = value => Math.trunc(value % 60, 10); // Format time to UI friendly string

  function formatTime(time = 0, displayHours = false, inverted = false) {
    // Bail if the value isn't a number
    if (!is$1.number(time)) {
      return formatTime(undefined, displayHours, inverted);
    } // Format time component to add leading zero


    const format = value => `0${value}`.slice(-2); // Breakdown to hours, mins, secs


    let hours = getHours(time);
    const mins = getMinutes(time);
    const secs = getSeconds(time); // Do we need to display hours?

    if (displayHours || hours > 0) {
      hours = `${hours}:`;
    } else {
      hours = '';
    } // Render


    return `${inverted && time > 0 ? '-' : ''}${hours}${format(mins)}:${format(secs)}`;
  }

  const controls = {
    // Get icon URL
    getIconUrl() {
      const url = new URL(this.config.iconUrl, window.location);
      const cors = url.host !== window.location.host || browser.isIE && !window.svg4everybody;
      return {
        url: this.config.iconUrl,
        cors
      };
    },

    // Find the UI controls
    findElements() {
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
          this.elements.display.seekTooltip = this.elements.progress.querySelector(`.${this.config.classNames.tooltip}`);
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
    createIcon(type, attributes) {
      const namespace = 'http://www.w3.org/2000/svg';
      const iconUrl = controls.getIconUrl.call(this);
      const iconPath = `${!iconUrl.cors ? iconUrl.url : ''}#${this.config.iconPrefix}`; // Create <svg>

      const icon = document.createElementNS(namespace, 'svg');
      setAttributes(icon, extend(attributes, {
        'aria-hidden': 'true',
        focusable: 'false'
      })); // Create the <use> to reference sprite

      const use = document.createElementNS(namespace, 'use');
      const path = `${iconPath}-${type}`; // Set `href` attributes
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
    createLabel(key, attr = {}) {
      const text = i18n.get(key, this.config);
      const attributes = { ...attr,
        class: [attr.class, this.config.classNames.hidden].filter(Boolean).join(' ')
      };
      return createElement('span', attributes, text);
    },

    // Create a badge
    createBadge(text) {
      if (is$1.empty(text)) {
        return null;
      }

      const badge = createElement('span', {
        class: this.config.classNames.menu.value
      });
      badge.appendChild(createElement('span', {
        class: this.config.classNames.menu.badge
      }, text));
      return badge;
    },

    // Create a <button>
    createButton(buttonType, attr) {
      const attributes = extend({}, attr);
      let type = toCamelCase(buttonType);
      const props = {
        element: 'button',
        toggle: false,
        label: null,
        icon: null,
        labelPressed: null,
        iconPressed: null
      };
      ['element', 'icon', 'label'].forEach(key => {
        if (Object.keys(attributes).includes(key)) {
          props[key] = attributes[key];
          delete attributes[key];
        }
      }); // Default to 'button' type to prevent form submission

      if (props.element === 'button' && !Object.keys(attributes).includes('type')) {
        attributes.type = 'button';
      } // Set class name


      if (Object.keys(attributes).includes('class')) {
        if (!attributes.class.split(' ').some(c => c === this.config.classNames.control)) {
          extend(attributes, {
            class: `${attributes.class} ${this.config.classNames.control}`
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
          attributes.class += ` ${this.config.classNames.control}--overlaid`;
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

      const button = createElement(props.element); // Setup toggle icon and labels

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
    createRange(type, attributes) {
      // Seek input
      const input = createElement('input', extend(getAttributesFromSelector(this.config.selectors.inputs[type]), {
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
    createProgress(type, attributes) {
      const progress = createElement('progress', extend(getAttributesFromSelector(this.config.selectors.display[type]), {
        min: 0,
        max: 100,
        value: 0,
        role: 'progressbar',
        'aria-hidden': true
      }, attributes)); // Create the label inside

      if (type !== 'volume') {
        progress.appendChild(createElement('span', null, '0'));
        const suffixKey = {
          played: 'played',
          buffer: 'buffered'
        }[type];
        const suffix = suffixKey ? i18n.get(suffixKey, this.config) : '';
        progress.innerText = `% ${suffix.toLowerCase()}`;
      }

      this.elements.display[type] = progress;
      return progress;
    },

    // Create time display
    createTime(type, attrs) {
      const attributes = getAttributesFromSelector(this.config.selectors.display[type], attrs);
      const container = createElement('div', extend(attributes, {
        class: `${attributes.class ? attributes.class : ''} ${this.config.classNames.display.time} `.trim(),
        'aria-label': i18n.get(type, this.config)
      }), '00:00'); // Reference for updates

      this.elements.display[type] = container;
      return container;
    },

    // Bind keyboard shortcuts for a menu item
    // We have to bind to keyup otherwise Firefox triggers a click when a keydown event handler shifts focus
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1220143
    bindMenuItemShortcuts(menuItem, type) {
      // Navigate through menus via arrow keys and space
      on.call(this, menuItem, 'keydown keyup', event => {
        // We only care about space and ⬆️ ⬇️️ ➡️
        if (![32, 38, 39, 40].includes(event.which)) {
          return;
        } // Prevent play / seek


        event.preventDefault();
        event.stopPropagation(); // We're just here to prevent the keydown bubbling

        if (event.type === 'keydown') {
          return;
        }

        const isRadioButton = matches(menuItem, '[role="menuitemradio"]'); // Show the respective menu

        if (!isRadioButton && [32, 39].includes(event.which)) {
          controls.showMenuPanel.call(this, type, true);
        } else {
          let target;

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

            setFocus.call(this, target, true);
          }
        }
      }, false); // Enter will fire a `click` event but we still need to manage focus
      // So we bind to keyup which fires after and set focus here

      on.call(this, menuItem, 'keyup', event => {
        if (event.which !== 13) {
          return;
        }

        controls.focusFirstMenuItem.call(this, null, true);
      });
    },

    // Create a settings menu item
    createMenuItem({
      value,
      list,
      type,
      title,
      badge = null,
      checked = false
    }) {
      const attributes = getAttributesFromSelector(this.config.selectors.inputs[type]);
      const menuItem = createElement('button', extend(attributes, {
        type: 'button',
        role: 'menuitemradio',
        class: `${this.config.classNames.control} ${attributes.class ? attributes.class : ''}`.trim(),
        'aria-checked': checked,
        value
      }));
      const flex = createElement('span'); // We have to set as HTML incase of special characters

      flex.innerHTML = title;

      if (is$1.element(badge)) {
        flex.appendChild(badge);
      }

      menuItem.appendChild(flex); // Replicate radio button behaviour

      Object.defineProperty(menuItem, 'checked', {
        enumerable: true,

        get() {
          return menuItem.getAttribute('aria-checked') === 'true';
        },

        set(check) {
          // Ensure exclusivity
          if (check) {
            Array.from(menuItem.parentNode.children).filter(node => matches(node, '[role="menuitemradio"]')).forEach(node => node.setAttribute('aria-checked', 'false'));
          }

          menuItem.setAttribute('aria-checked', check ? 'true' : 'false');
        }

      });
      this.listeners.bind(menuItem, 'click keyup', event => {
        if (is$1.keyboardEvent(event) && event.which !== 32) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        menuItem.checked = true;

        switch (type) {
          case 'language':
            this.currentTrack = Number(value);
            break;

          case 'quality':
            this.quality = value;
            break;

          case 'speed':
            this.speed = parseFloat(value);
            break;
        }

        controls.showMenuPanel.call(this, 'home', is$1.keyboardEvent(event));
      }, type, false);
      controls.bindMenuItemShortcuts.call(this, menuItem, type);
      list.appendChild(menuItem);
    },

    // Format a time for display
    formatTime(time = 0, inverted = false) {
      // Bail if the value isn't a number
      if (!is$1.number(time)) {
        return time;
      } // Always display hours if duration is over an hour


      const forceHours = getHours(this.duration) > 0;
      return formatTime(time, forceHours, inverted);
    },

    // Update the displayed time
    updateTimeDisplay(target = null, time = 0, inverted = false) {
      // Bail if there's no element to display or the value isn't a number
      if (!is$1.element(target) || !is$1.number(time)) {
        return;
      } // eslint-disable-next-line no-param-reassign


      target.innerText = controls.formatTime(time, inverted);
    },

    // Update volume UI and storage
    updateVolume() {
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
    setRange(target, value = 0) {
      if (!is$1.element(target)) {
        return;
      } // eslint-disable-next-line


      target.value = value; // Webkit range fill

      controls.updateRangeFill.call(this, target);
    },

    // Update <progress> elements
    updateProgress(event) {
      if (!this.supported.ui || !is$1.event(event)) {
        return;
      }

      let value = 0;

      const setProgress = (target, input) => {
        const val = is$1.number(input) ? input : 0;
        const progress = is$1.element(target) ? target : this.elements.display.buffer; // Update value and label

        if (is$1.element(progress)) {
          progress.value = val; // Update text label inside

          const label = progress.getElementsByTagName('span')[0];

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
    updateRangeFill(target) {
      // Get range from event if event passed
      const range = is$1.event(target) ? target.target : target; // Needs to be a valid <input type='range'>

      if (!is$1.element(range) || range.getAttribute('type') !== 'range') {
        return;
      } // Set aria values for https://github.com/sampotts/plyr/issues/905


      if (matches(range, this.config.selectors.inputs.seek)) {
        range.setAttribute('aria-valuenow', this.currentTime);
        const currentTime = controls.formatTime(this.currentTime);
        const duration = controls.formatTime(this.duration);
        const format = i18n.get('seekLabel', this.config);
        range.setAttribute('aria-valuetext', format.replace('{currentTime}', currentTime).replace('{duration}', duration));
      } else if (matches(range, this.config.selectors.inputs.volume)) {
        const percent = range.value * 100;
        range.setAttribute('aria-valuenow', percent);
        range.setAttribute('aria-valuetext', `${percent.toFixed(1)}%`);
      } else {
        range.setAttribute('aria-valuenow', range.value);
      } // WebKit only


      if (!browser.isWebkit) {
        return;
      } // Set CSS custom property


      range.style.setProperty('--value', `${range.value / range.max * 100}%`, 'important');
    },

    // Update hover tooltip for seeking
    updateSeekTooltip(event) {
      // Bail if setting not true
      if (!this.config.tooltips.seek || !is$1.element(this.elements.inputs.seek) || !is$1.element(this.elements.display.seekTooltip) || this.duration === 0) {
        return;
      }

      const visible = `${this.config.classNames.tooltip}--visible`;

      const toggle = show => toggleClass$1(this.elements.display.seekTooltip, visible, show); // Hide on touch


      if (this.touch) {
        toggle(false);
        return;
      } // Determine percentage, if already visible


      let percent = 0;
      const clientRect = this.elements.progress.getBoundingClientRect();

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

      this.elements.display.seekTooltip.style.setProperty('left', `${percent}%`, 'important'); // Show/hide the tooltip
      // If the event is a moues in/out and percentage is inside bounds

      if (is$1.event(event) && ['mouseenter', 'mouseleave'].includes(event.type)) {
        toggle(event.type === 'mouseenter');
      }
    },

    // Handle time change event
    timeUpdate(event) {
      // Only invert if only one time element is displayed and used for both duration and currentTime
      const invert = !is$1.element(this.elements.display.duration) && this.config.invertTime; // Duration

      controls.updateTimeDisplay.call(this, this.elements.display.currentTime, invert ? this.duration - this.currentTime : this.currentTime, invert); // Ignore updates while seeking

      if (event && event.type === 'timeupdate' && this.media.seeking) {
        return;
      } // Playing progress


      controls.updateProgress.call(this, event);
    },

    // Show the duration on metadataloaded or durationchange events
    durationUpdate() {
      // Bail if no UI or durationchange event triggered after playing/seek when invertTime is false
      if (!this.supported.ui || !this.config.invertTime && this.currentTime) {
        return;
      } // If duration is the 2**32 (shaka), Infinity (HLS), DASH-IF (Number.MAX_SAFE_INTEGER || Number.MAX_VALUE) indicating live we hide the currentTime and progressbar.
      // https://github.com/video-dev/hls.js/blob/5820d29d3c4c8a46e8b75f1e3afa3e68c1a9a2db/src/controller/buffer-controller.js#L415
      // https://github.com/google/shaka-player/blob/4d889054631f4e1cf0fbd80ddd2b71887c02e232/lib/media/streaming_engine.js#L1062
      // https://github.com/Dash-Industry-Forum/dash.js/blob/69859f51b969645b234666800d4cb596d89c602d/src/dash/models/DashManifestModel.js#L338


      if (this.duration >= 2 ** 32) {
        toggleHidden(this.elements.display.currentTime, true);
        toggleHidden(this.elements.progress, true);
        return;
      } // Update ARIA values


      if (is$1.element(this.elements.inputs.seek)) {
        this.elements.inputs.seek.setAttribute('aria-valuemax', this.duration);
      } // If there's a spot to display duration


      const hasDuration = is$1.element(this.elements.display.duration); // If there's only one time display, display duration there

      if (!hasDuration && this.config.displayDuration && this.paused) {
        controls.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration);
      } // If there's a duration element, update content


      if (hasDuration) {
        controls.updateTimeDisplay.call(this, this.elements.display.duration, this.duration);
      } // Update the tooltip (if visible)


      controls.updateSeekTooltip.call(this);
    },

    // Hide/show a tab
    toggleMenuButton(setting, toggle) {
      toggleHidden(this.elements.settings.buttons[setting], !toggle);
    },

    // Update the selected setting
    updateSetting(setting, container, input) {
      const pane = this.elements.settings.panels[setting];
      let value = null;
      let list = container;

      if (setting === 'captions') {
        value = this.currentTrack;
      } else {
        value = !is$1.empty(input) ? input : this[setting]; // Get default

        if (is$1.empty(value)) {
          value = this.config[setting].default;
        } // Unsupported value


        if (!is$1.empty(this.options[setting]) && !this.options[setting].includes(value)) {
          this.debug.warn(`Unsupported value of '${value}' for ${setting}`);
          return;
        } // Disabled value


        if (!this.config[setting].options.includes(value)) {
          this.debug.warn(`Disabled value of '${value}' for ${setting}`);
          return;
        }
      } // Get the list if we need to


      if (!is$1.element(list)) {
        list = pane && pane.querySelector('[role="menu"]');
      } // If there's no list it means it's not been rendered...


      if (!is$1.element(list)) {
        return;
      } // Update the label


      const label = this.elements.settings.buttons[setting].querySelector(`.${this.config.classNames.menu.value}`);
      label.innerHTML = controls.getLabel.call(this, setting, value); // Find the radio option and check it

      const target = list && list.querySelector(`[value="${value}"]`);

      if (is$1.element(target)) {
        target.checked = true;
      }
    },

    // Translate a value into a nice label
    getLabel(setting, value) {
      switch (setting) {
        case 'speed':
          return value === 1 ? i18n.get('normal', this.config) : `${value}&times;`;

        case 'quality':
          if (is$1.number(value)) {
            const label = i18n.get(`qualityLabel.${value}`, this.config);

            if (!label.length) {
              return `${value}p`;
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
    setQualityMenu(options) {
      // Menu required
      if (!is$1.element(this.elements.settings.panels.quality)) {
        return;
      }

      const type = 'quality';
      const list = this.elements.settings.panels.quality.querySelector('[role="menu"]'); // Set options if passed and filter based on uniqueness and config

      if (is$1.array(options)) {
        this.options.quality = dedupe(options).filter(quality => this.config.quality.options.includes(quality));
      } // Toggle the pane and tab


      const toggle = !is$1.empty(this.options.quality) && this.options.quality.length > 1;
      controls.toggleMenuButton.call(this, type, toggle); // Empty the menu

      emptyElement(list); // Check if we need to toggle the parent

      controls.checkMenu.call(this); // If we're hiding, nothing more to do

      if (!toggle) {
        return;
      } // Get the badge HTML for HD, 4K etc


      const getBadge = quality => {
        const label = i18n.get(`qualityBadge.${quality}`, this.config);

        if (!label.length) {
          return null;
        }

        return controls.createBadge.call(this, label);
      }; // Sort options by the config and then render options


      this.options.quality.sort((a, b) => {
        const sorting = this.config.quality.options;
        return sorting.indexOf(a) > sorting.indexOf(b) ? 1 : -1;
      }).forEach(quality => {
        controls.createMenuItem.call(this, {
          value: quality,
          list,
          type,
          title: controls.getLabel.call(this, 'quality', quality),
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
    setCaptionsMenu() {
      // Menu required
      if (!is$1.element(this.elements.settings.panels.captions)) {
        return;
      } // TODO: Captions or language? Currently it's mixed


      const type = 'captions';
      const list = this.elements.settings.panels.captions.querySelector('[role="menu"]');
      const tracks = captions.getTracks.call(this);
      const toggle = Boolean(tracks.length); // Toggle the pane and tab

      controls.toggleMenuButton.call(this, type, toggle); // Empty the menu

      emptyElement(list); // Check if we need to toggle the parent

      controls.checkMenu.call(this); // If there's no captions, bail

      if (!toggle) {
        return;
      } // Generate options data


      const options = tracks.map((track, value) => ({
        value,
        checked: this.captions.toggled && this.currentTrack === value,
        title: captions.getLabel.call(this, track),
        badge: track.language && controls.createBadge.call(this, track.language.toUpperCase()),
        list,
        type: 'language'
      })); // Add the "Disabled" option to turn off captions

      options.unshift({
        value: -1,
        checked: !this.captions.toggled,
        title: i18n.get('disabled', this.config),
        list,
        type: 'language'
      }); // Generate options

      options.forEach(controls.createMenuItem.bind(this));
      controls.updateSetting.call(this, type, list);
    },

    // Set a list of available captions languages
    setSpeedMenu() {
      // Menu required
      if (!is$1.element(this.elements.settings.panels.speed)) {
        return;
      }

      const type = 'speed';
      const list = this.elements.settings.panels.speed.querySelector('[role="menu"]'); // Filter out invalid speeds

      this.options.speed = this.options.speed.filter(o => o >= this.minimumSpeed && o <= this.maximumSpeed); // Toggle the pane and tab

      const toggle = !is$1.empty(this.options.speed) && this.options.speed.length > 1;
      controls.toggleMenuButton.call(this, type, toggle); // Empty the menu

      emptyElement(list); // Check if we need to toggle the parent

      controls.checkMenu.call(this); // If we're hiding, nothing more to do

      if (!toggle) {
        return;
      } // Create items


      this.options.speed.forEach(speed => {
        controls.createMenuItem.call(this, {
          value: speed,
          list,
          type,
          title: controls.getLabel.call(this, 'speed', speed)
        });
      });
      controls.updateSetting.call(this, type, list);
    },

    // Check if we need to hide/show the settings menu
    checkMenu() {
      const {
        buttons
      } = this.elements.settings;
      const visible = !is$1.empty(buttons) && Object.values(buttons).some(button => !button.hidden);
      toggleHidden(this.elements.settings.menu, !visible);
    },

    // Focus the first menu item in a given (or visible) menu
    focusFirstMenuItem(pane, tabFocus = false) {
      if (this.elements.settings.popup.hidden) {
        return;
      }

      let target = pane;

      if (!is$1.element(target)) {
        target = Object.values(this.elements.settings.panels).find(p => !p.hidden);
      }

      const firstItem = target.querySelector('[role^="menuitem"]');
      setFocus.call(this, firstItem, tabFocus);
    },

    // Show/hide menu
    toggleMenu(input) {
      const {
        popup
      } = this.elements.settings;
      const button = this.elements.buttons.settings; // Menu and button are required

      if (!is$1.element(popup) || !is$1.element(button)) {
        return;
      } // True toggle by default


      const {
        hidden
      } = popup;
      let show = hidden;

      if (is$1.boolean(input)) {
        show = input;
      } else if (is$1.keyboardEvent(input) && input.which === 27) {
        show = false;
      } else if (is$1.event(input)) {
        // If Plyr is in a shadowDOM, the event target is set to the component, instead of the
        // Element in the shadowDOM. The path, if available, is complete.
        const target = is$1.function(input.composedPath) ? input.composedPath()[0] : input.target;
        const isMenuItem = popup.contains(target); // If the click was inside the menu or if the click
        // wasn't the button or menu item and we're trying to
        // show the menu (a doc click shouldn't show the menu)

        if (isMenuItem || !isMenuItem && input.target !== button && show) {
          return;
        }
      } // Set button attributes


      button.setAttribute('aria-expanded', show); // Show the actual popup

      toggleHidden(popup, !show); // Add class hook

      toggleClass$1(this.elements.container, this.config.classNames.menu.open, show); // Focus the first item if key interaction

      if (show && is$1.keyboardEvent(input)) {
        controls.focusFirstMenuItem.call(this, null, true);
      } else if (!show && !hidden) {
        // If closing, re-focus the button
        setFocus.call(this, button, is$1.keyboardEvent(input));
      }
    },

    // Get the natural size of a menu panel
    getMenuSize(tab) {
      const clone = tab.cloneNode(true);
      clone.style.setProperty('position', 'absolute', 'important');
      clone.style.setProperty('opacity', '0', 'important');
      clone.removeAttribute('hidden'); // Append to parent so we get the "real" size

      tab.parentNode.appendChild(clone); // Get the sizes before we remove

      const width = clone.scrollWidth;
      const height = clone.scrollHeight; // Remove from the DOM

      removeElement(clone);
      return {
        width,
        height
      };
    },

    // Show a panel in the menu
    showMenuPanel(type = '', tabFocus = false) {
      const target = this.elements.container.querySelector(`#ggs-plyr-settings-${this.id}-${type}`); // Nothing to show, bail

      if (!is$1.element(target)) {
        return;
      } // Hide all other panels


      const container = target.parentNode;
      const current = Array.from(container.children).find(node => !node.hidden); // If we can do fancy animations, we'll animate the height/width

      if (support.transitions && !support.reducedMotion) {
        // Set the current width as a base
        container.style.setProperty('width', `${current.scrollWidth}px`, 'important');
        container.style.setProperty('height', `${current.scrollHeight}px`, 'important'); // Get potential sizes

        const size = controls.getMenuSize.call(this, target); // Restore auto height/width

        const restore = event => {
          // We're only bothered about height and width on the container
          if (event.target !== container || !['width', 'height'].includes(event.propertyName)) {
            return;
          } // Revert back to auto


          container.style.removeProperty('width');
          container.style.removeProperty('height'); // Only listen once

          off.call(this, container, transitionEndEvent, restore);
        }; // Listen for the transition finishing and restore auto height/width


        on.call(this, container, transitionEndEvent, restore); // Set dimensions to target

        container.style.setProperty('width', `${size.width}px`, 'important');
        container.style.setProperty('height', `${size.height}px`, 'important');
      } // Set attributes on current tab


      toggleHidden(current, true); // Set attributes on target

      toggleHidden(target, false); // Focus the first item

      controls.focusFirstMenuItem.call(this, target, tabFocus);
    },

    // Set the download URL
    setDownloadUrl() {
      const button = this.elements.buttons.download; // Bail if no button

      if (!is$1.element(button)) {
        return;
      } // Set attribute


      button.setAttribute('href', this.download);
    },

    // Build the default HTML
    create(data) {
      const {
        bindMenuItemShortcuts,
        createButton,
        createProgress,
        createRange,
        createTime,
        setQualityMenu,
        setSpeedMenu,
        showMenuPanel
      } = controls;
      this.elements.controls = null; // Larger overlaid play button

      if (is$1.array(this.config.controls) && this.config.controls.includes('play-large')) {
        this.elements.container.appendChild(createButton.call(this, 'play-large'));
      } // Create the container


      const container = createElement('div', getAttributesFromSelector(this.config.selectors.controls.wrapper));
      this.elements.controls = container; // Default item attributes

      const defaultAttributes = {
        class: 'ggs-plyr__controls__item'
      }; // Loop through controls in order

      dedupe(is$1.array(this.config.controls) ? this.config.controls : []).forEach(control => {
        // Restart button
        if (control === 'restart') {
          container.appendChild(createButton.call(this, 'restart', defaultAttributes));
        } // Rewind button


        if (control === 'rewind') {
          container.appendChild(createButton.call(this, 'rewind', defaultAttributes));
        } // Play/Pause button


        if (control === 'play') {
          container.appendChild(createButton.call(this, 'play', defaultAttributes));
        } // Fast forward button


        if (control === 'fast-forward') {
          container.appendChild(createButton.call(this, 'fast-forward', defaultAttributes));
        } // Progress


        if (control === 'progress') {
          const progressContainer = createElement('div', {
            class: `${defaultAttributes.class} ggs-plyr__progress__container`
          });
          const progress = createElement('div', getAttributesFromSelector(this.config.selectors.progress)); // Seek range slider

          progress.appendChild(createRange.call(this, 'seek', {
            id: `ggs-plyr-seek-${data.id}`
          })); // Buffer progress

          progress.appendChild(createProgress.call(this, 'buffer')); // TODO: Add loop display indicator
          // Seek tooltip

          if (this.config.tooltips.seek) {
            const tooltip = createElement('span', {
              class: this.config.classNames.tooltip
            }, '00:00');
            progress.appendChild(tooltip);
            this.elements.display.seekTooltip = tooltip;
          }

          this.elements.progress = progress;
          progressContainer.appendChild(this.elements.progress);
          container.appendChild(progressContainer);
        } // Media current time display


        if (control === 'current-time') {
          container.appendChild(createTime.call(this, 'currentTime', defaultAttributes));
        } // Media duration display


        if (control === 'duration') {
          container.appendChild(createTime.call(this, 'duration', defaultAttributes));
        } // Volume controls


        if (control === 'mute' || control === 'volume') {
          let {
            volume
          } = this.elements; // Create the volume container if needed

          if (!is$1.element(volume) || !container.contains(volume)) {
            volume = createElement('div', extend({}, defaultAttributes, {
              class: `${defaultAttributes.class} ggs-plyr__volume`.trim()
            }));
            this.elements.volume = volume;
            container.appendChild(volume);
          } // Toggle mute button


          if (control === 'mute') {
            volume.appendChild(createButton.call(this, 'mute'));
          } // Volume range control
          // Ignored on iOS as it's handled globally
          // https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html


          if (control === 'volume' && !browser.isIos) {
            // Set the attributes
            const attributes = {
              max: 1,
              step: 0.05,
              value: this.config.volume
            }; // Create the volume range slider

            volume.appendChild(createRange.call(this, 'volume', extend(attributes, {
              id: `ggs-plyr-volume-${data.id}`
            })));
          }
        } // Toggle captions button


        if (control === 'captions') {
          container.appendChild(createButton.call(this, 'captions', defaultAttributes));
        } // Settings button / menu


        if (control === 'settings' && !is$1.empty(this.config.settings)) {
          const wrapper = createElement('div', extend({}, defaultAttributes, {
            class: `${defaultAttributes.class} ggs-plyr__menu`.trim(),
            hidden: ''
          }));
          wrapper.appendChild(createButton.call(this, 'settings', {
            'aria-haspopup': true,
            'aria-controls': `ggs-plyr-settings-${data.id}`,
            'aria-expanded': false
          }));
          const popup = createElement('div', {
            class: 'ggs-plyr__menu__container',
            id: `ggs-plyr-settings-${data.id}`,
            hidden: ''
          });
          const inner = createElement('div');
          const home = createElement('div', {
            id: `ggs-plyr-settings-${data.id}-home`
          }); // Create the menu

          const menu = createElement('div', {
            role: 'menu'
          });
          home.appendChild(menu);
          inner.appendChild(home);
          this.elements.settings.panels.home = home; // Build the menu items

          this.config.settings.forEach(type => {
            // TODO: bundle this with the createMenuItem helper and bindings
            const menuItem = createElement('button', extend(getAttributesFromSelector(this.config.selectors.buttons.settings), {
              type: 'button',
              class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`,
              role: 'menuitem',
              'aria-haspopup': true,
              hidden: ''
            })); // Bind menu shortcuts for keyboard users

            bindMenuItemShortcuts.call(this, menuItem, type); // Show menu on click

            on.call(this, menuItem, 'click', () => {
              showMenuPanel.call(this, type, false);
            });
            const flex = createElement('span', null, i18n.get(type, this.config));
            const value = createElement('span', {
              class: this.config.classNames.menu.value
            }); // Speed contains HTML entities

            value.innerHTML = data[type];
            flex.appendChild(value);
            menuItem.appendChild(flex);
            menu.appendChild(menuItem); // Build the panes

            const pane = createElement('div', {
              id: `ggs-plyr-settings-${data.id}-${type}`,
              hidden: ''
            }); // Back button

            const backButton = createElement('button', {
              type: 'button',
              class: `${this.config.classNames.control} ${this.config.classNames.control}--back`
            }); // Visible label

            backButton.appendChild(createElement('span', {
              'aria-hidden': true
            }, i18n.get(type, this.config))); // Screen reader label

            backButton.appendChild(createElement('span', {
              class: this.config.classNames.hidden
            }, i18n.get('menuBack', this.config))); // Go back via keyboard

            on.call(this, pane, 'keydown', event => {
              // We only care about <-
              if (event.which !== 37) {
                return;
              } // Prevent seek


              event.preventDefault();
              event.stopPropagation(); // Show the respective menu

              showMenuPanel.call(this, 'home', true);
            }, false); // Go back via button click

            on.call(this, backButton, 'click', () => {
              showMenuPanel.call(this, 'home', false);
            }); // Add to pane

            pane.appendChild(backButton); // Menu

            pane.appendChild(createElement('div', {
              role: 'menu'
            }));
            inner.appendChild(pane);
            this.elements.settings.buttons[type] = menuItem;
            this.elements.settings.panels[type] = pane;
          });
          popup.appendChild(inner);
          wrapper.appendChild(popup);
          container.appendChild(wrapper);
          this.elements.settings.popup = popup;
          this.elements.settings.menu = wrapper;
        } // Picture in picture button


        if (control === 'pip' && support.pip) {
          container.appendChild(createButton.call(this, 'pip', defaultAttributes));
        } // Airplay button


        if (control === 'airplay' && support.airplay) {
          container.appendChild(createButton.call(this, 'airplay', defaultAttributes));
        } // Download button


        if (control === 'download') {
          const attributes = extend({}, defaultAttributes, {
            element: 'a',
            href: this.download,
            target: '_blank'
          }); // Set download attribute for HTML5 only

          if (this.isHTML5) {
            attributes.download = '';
          }

          const {
            download
          } = this.config.urls;

          if (!is$1.url(download) && this.isEmbed) {
            extend(attributes, {
              icon: `logo-${this.provider}`,
              label: this.provider
            });
          }

          container.appendChild(createButton.call(this, 'download', attributes));
        } // Toggle fullscreen button


        if (control === 'fullscreen') {
          container.appendChild(createButton.call(this, 'fullscreen', defaultAttributes));
        }
      }); // Set available quality levels

      if (this.isHTML5) {
        setQualityMenu.call(this, html5.getQualityOptions.call(this));
      }

      setSpeedMenu.call(this);
      return container;
    },

    // Insert controls
    inject() {
      // Sprite
      if (this.config.loadSprite) {
        const icon = controls.getIconUrl.call(this); // Only load external sprite using AJAX

        if (icon.cors) {
          loadSprite(icon.url, 'sprite-plyr');
        }
      } // Create a unique ID


      this.id = Math.floor(Math.random() * 10000); // Null by default

      let container = null;
      this.elements.controls = null; // Set template properties

      const props = {
        id: this.id,
        seektime: this.config.seekTime,
        title: this.config.title
      };
      let update = true; // If function, run it and use output

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


      const replace = input => {
        let result = input;
        Object.entries(props).forEach(([key, value]) => {
          result = replaceAll(result, `{${key}}`, value);
        });
        return result;
      }; // Update markup


      if (update) {
        if (is$1.string(this.config.controls)) {
          container = replace(container);
        }
      } // Controls container


      let target; // Inject to custom location

      if (is$1.string(this.config.selectors.controls.container)) {
        target = document.querySelector(this.config.selectors.controls.container);
      } // Inject into the container by default


      if (!is$1.element(target)) {
        target = this.elements.container;
      } // Inject controls HTML (needs to be before captions, hence "afterbegin")


      const insertMethod = is$1.element(container) ? 'insertAdjacentElement' : 'insertAdjacentHTML';
      target[insertMethod]('afterbegin', container); // Find the elements if need be

      if (!is$1.element(this.elements.controls)) {
        controls.findElements.call(this);
      } // Add pressed property to buttons


      if (!is$1.empty(this.elements.buttons)) {
        const addProperty = button => {
          const className = this.config.classNames.controlPressed;
          Object.defineProperty(button, 'pressed', {
            enumerable: true,

            get() {
              return hasClass(button, className);
            },

            set(pressed = false) {
              toggleClass$1(button, className, pressed);
            }

          });
        }; // Toggle classname when pressed property is set


        Object.values(this.elements.buttons).filter(Boolean).forEach(button => {
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
        const {
          classNames,
          selectors
        } = this.config;
        const selector = `${selectors.controls.wrapper} ${selectors.labels} .${classNames.hidden}`;
        const labels = getElements.call(this, selector);
        Array.from(labels).forEach(label => {
          toggleClass$1(label, this.config.classNames.hidden, false);
          toggleClass$1(label, this.config.classNames.tooltip, true);
        });
      }
    }

  };

  class Fullscreen {
    constructor(player) {
      _defineProperty$1(this, "onChange", () => {
        if (!this.enabled) {
          return;
        } // Update toggle button


        const button = this.player.elements.buttons.fullscreen;

        if (is$1.element(button)) {
          button.pressed = this.active;
        } // Always trigger events on the plyr / media element (not a fullscreen container) and let them bubble up


        const target = this.target === this.player.media ? this.target : this.player.elements.container; // Trigger an event

        triggerEvent.call(this.player, target, this.active ? 'enterfullscreen' : 'exitfullscreen', true);
      });

      _defineProperty$1(this, "toggleFallback", (toggle = false) => {
        // Store or restore scroll position
        if (toggle) {
          this.scrollPosition = {
            x: window.scrollX || 0,
            y: window.scrollY || 0
          };
        } else {
          window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
        } // Toggle scroll


        if (toggle) {
          document.body.style.setProperty('overflow', 'hidden', 'important');
        } else {
          document.body.style.removeProperty('overflow');
        } // Toggle class hook


        toggleClass$1(this.target, this.player.config.classNames.fullscreen.fallback, toggle); // Force full viewport on iPhone X+

        if (browser.isIos) {
          let viewport = document.head.querySelector('meta[name="viewport"]');
          const property = 'viewport-fit=cover'; // Inject the viewport meta if required

          if (!viewport) {
            viewport = document.createElement('meta');
            viewport.setAttribute('name', 'viewport');
          } // Check if the property already exists


          const hasProperty = is$1.string(viewport.content) && viewport.content.includes(property);

          if (toggle) {
            this.cleanupViewport = !hasProperty;

            if (!hasProperty) {
              viewport.content += `,${property}`;
            }
          } else if (this.cleanupViewport) {
            viewport.content = viewport.content.split(',').filter(part => part.trim() !== property).join(',');
          }
        } // Toggle button and fire events


        this.onChange();
      });

      _defineProperty$1(this, "trapFocus", event => {
        // Bail if iOS, not active, not the tab key
        if (browser.isIos || !this.active || event.key !== 'Tab' || event.keyCode !== 9) {
          return;
        } // Get the current focused element


        const focused = document.activeElement;
        const focusable = getElements.call(this.player, 'a[href], button:not(:disabled), input:not(:disabled), [tabindex]');
        const [first] = focusable;
        const last = focusable[focusable.length - 1];

        if (focused === last && !event.shiftKey) {
          // Move focus to first element that can be tabbed if Shift isn't used
          first.focus();
          event.preventDefault();
        } else if (focused === first && event.shiftKey) {
          // Move focus to last element that can be tabbed if Shift is used
          last.focus();
          event.preventDefault();
        }
      });

      _defineProperty$1(this, "update", () => {
        if (this.enabled) {
          let mode;

          if (this.forceFallback) {
            mode = 'Fallback (forced)';
          } else if (Fullscreen.native) {
            mode = 'Native';
          } else {
            mode = 'Fallback';
          }

          this.player.debug.log(`${mode} fullscreen enabled`);
        } else {
          this.player.debug.log('Fullscreen not supported and fallback disabled');
        } // Add styling hook to show button


        toggleClass$1(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.enabled);
      });

      _defineProperty$1(this, "enter", () => {
        if (!this.enabled) {
          return;
        } // iOS native fullscreen doesn't need the request step


        if (browser.isIos && this.player.config.fullscreen.iosNative) {
          if (this.player.isVimeo) {
            this.player.embed.requestFullscreen();
          } else {
            this.target.webkitEnterFullscreen();
          }
        } else if (!Fullscreen.native || this.forceFallback) {
          this.toggleFallback(true);
        } else if (!this.prefix) {
          this.target.requestFullscreen({
            navigationUI: 'hide'
          });
        } else if (!is$1.empty(this.prefix)) {
          this.target[`${this.prefix}Request${this.property}`]();
        }
      });

      _defineProperty$1(this, "exit", () => {
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
          const action = this.prefix === 'moz' ? 'Cancel' : 'Exit';
          document[`${this.prefix}${action}${this.property}`]();
        }
      });

      _defineProperty$1(this, "toggle", () => {
        if (!this.active) {
          this.enter();
        } else {
          this.exit();
        }
      });

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

      this.player.elements.fullscreen = player.config.fullscreen.container && closest$1(this.player.elements.container, player.config.fullscreen.container); // Register event listeners
      // Handle event (incase user presses escape etc)

      on.call(this.player, document, this.prefix === 'ms' ? 'MSFullscreenChange' : `${this.prefix}fullscreenchange`, () => {
        // TODO: Filter for target??
        this.onChange();
      }); // Fullscreen toggle on double click

      on.call(this.player, this.player.elements.container, 'dblclick', event => {
        if (!this.player.config.fullscreen.dblclick) {
          return;
        } // Ignore double click in controls


        if (is$1.element(this.player.elements.controls) && this.player.elements.controls.contains(event.target)) {
          return;
        }

        this.player.listeners.proxy(event, this.toggle, 'fullscreen');
      }); // Tap focus when in fullscreen

      on.call(this.player, this.player.elements.container, 'keydown', event => this.trapFocus(event)); // Update the UI

      this.update(); // this.toggle = this.toggle.bind(this);
    } // Determine if native supported


    static get native() {
      return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
    } // If we're actually using native


    get usingNative() {
      return Fullscreen.native && !this.forceFallback;
    } // Get the prefix for handlers


    static get prefix() {
      // No prefix
      if (is$1.function(document.exitFullscreen)) {
        return '';
      } // Check for fullscreen support by vendor prefix


      let value = '';
      const prefixes = ['webkit', 'moz', 'ms'];
      prefixes.some(pre => {
        if (is$1.function(document[`${pre}ExitFullscreen`]) || is$1.function(document[`${pre}CancelFullScreen`])) {
          value = pre;
          return true;
        }

        return false;
      });
      return value;
    }

    static get property() {
      return this.prefix === 'moz' ? 'FullScreen' : 'Fullscreen';
    } // Determine if fullscreen is enabled


    get enabled() {
      return (Fullscreen.native || this.player.config.fullscreen.fallback) && this.player.config.fullscreen.enabled && this.player.supported.ui && this.player.isVideo;
    } // Get active state


    get active() {
      if (!this.enabled) {
        return false;
      } // Fallback using classname


      if (!Fullscreen.native || this.forceFallback) {
        return hasClass(this.target, this.player.config.classNames.fullscreen.fallback);
      }

      const element = !this.prefix ? document.fullscreenElement : document[`${this.prefix}${this.property}Element`];
      return element && element.shadowRoot ? element === this.target.getRootNode().host : element === this.target;
    } // Get target element


    get target() {
      return browser.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.fullscreen || this.player.elements.container;
    }

  }

  // ==========================================================================
  // Load image avoiding xhr/fetch CORS issues
  // Server status can't be obtained this way unfortunately, so this uses "naturalWidth" to determine if the image has loaded
  // By default it checks if it is at least 1px, but you can add a second argument to change this
  // ==========================================================================
  function loadImage(src, minWidth = 1) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      const handler = () => {
        delete image.onload;
        delete image.onerror;
        (image.naturalWidth >= minWidth ? resolve : reject)(image);
      };

      Object.assign(image, {
        onload: handler,
        onerror: handler,
        src
      });
    });
  }

  // ==========================================================================
  const ui = {
    addStyleHook() {
      toggleClass$1(this.elements.container, this.config.selectors.container.replace('.', ''), true);
      toggleClass$1(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
    },

    // Toggle native HTML5 media controls
    toggleNativeControls(toggle = false) {
      if (toggle && this.isHTML5) {
        this.media.setAttribute('controls', '');
      } else {
        this.media.removeAttribute('controls');
      }
    },

    // Setup the UI
    build() {
      // Re-attach media element listeners
      // TODO: Use event bubbling?
      this.listeners.media(); // Don't setup interface if no support

      if (!this.supported.ui) {
        this.debug.warn(`Basic support only for ${this.provider} ${this.type}`); // Restore native controls

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

      toggleClass$1(this.elements.container, this.config.classNames.pip.supported, support.pip && this.isHTML5 && this.isVideo); // Check for airplay support

      toggleClass$1(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5); // Add iOS class

      toggleClass$1(this.elements.container, this.config.classNames.isIos, browser.isIos); // Add touch class

      toggleClass$1(this.elements.container, this.config.classNames.isTouch, this.touch); // Ready for API calls

      this.ready = true; // Ready event at end of execution stack

      setTimeout(() => {
        triggerEvent.call(this, this.media, 'ready');
      }, 0); // Set the title

      ui.setTitle.call(this); // Assure the poster image is set, if the property was added before the element was created

      if (this.poster) {
        ui.setPoster.call(this, this.poster, false).catch(() => {});
      } // Manually set the duration if user has overridden it.
      // The event listeners for it doesn't get called if preload is disabled (#701)


      if (this.config.duration) {
        controls.durationUpdate.call(this);
      }
    },

    // Setup aria attribute for play and iframe title
    setTitle() {
      // Find the current text
      let label = i18n.get('play', this.config); // If there's a media title set, use that for the label

      if (is$1.string(this.config.title) && !is$1.empty(this.config.title)) {
        label += `, ${this.config.title}`;
      } // If there's a play button, set label


      Array.from(this.elements.buttons.play || []).forEach(button => {
        button.setAttribute('aria-label', label);
      }); // Set iframe title
      // https://github.com/sampotts/plyr/issues/124

      if (this.isEmbed) {
        const iframe = getElement.call(this, 'iframe');

        if (!is$1.element(iframe)) {
          return;
        } // Default to media type


        const title = !is$1.empty(this.config.title) ? this.config.title : 'video';
        const format = i18n.get('frameTitle', this.config);
        iframe.setAttribute('title', format.replace('{title}', title));
      }
    },

    // Toggle poster
    togglePoster(enable) {
      toggleClass$1(this.elements.container, this.config.classNames.posterEnabled, enable);
    },

    // Set the poster image (async)
    // Used internally for the poster setter, with the passive option forced to false
    setPoster(poster, passive = true) {
      // Don't override if call is passive
      if (passive && this.poster) {
        return Promise.reject(new Error('Poster already set'));
      } // Set property synchronously to respect the call order


      this.media.setAttribute('data-poster', poster); // Show the poster

      this.elements.poster.removeAttribute('hidden'); // Wait until ui is ready

      return ready.call(this) // Load image
      .then(() => loadImage(poster)).catch(err => {
        // Hide poster on error unless it's been set by another call
        if (poster === this.poster) {
          ui.togglePoster.call(this, false);
        } // Rethrow


        throw err;
      }).then(() => {
        // Prevent race conditions
        if (poster !== this.poster) {
          throw new Error('setPoster cancelled by later call to setPoster');
        }
      }).then(() => {
        this.elements.poster.style.setProperty('background-image', `url('${poster}')`, 'important');
        this.elements.poster.style.removeProperty('background-size');
        ui.togglePoster.call(this, true);
        return poster;
      });
    },

    // Check playing state
    checkPlaying(event) {
      // Class hooks
      toggleClass$1(this.elements.container, this.config.classNames.playing, this.playing);
      toggleClass$1(this.elements.container, this.config.classNames.paused, this.paused);
      toggleClass$1(this.elements.container, this.config.classNames.stopped, this.stopped); // Set state

      Array.from(this.elements.buttons.play || []).forEach(target => {
        Object.assign(target, {
          pressed: this.playing
        });
        target.setAttribute('aria-label', i18n.get(this.playing ? 'pause' : 'play', this.config));
      }); // Only update controls on non timeupdate events

      if (is$1.event(event) && event.type === 'timeupdate') {
        return;
      } // Toggle controls


      ui.toggleControls.call(this);
    },

    // Check if media is loading
    checkLoading(event) {
      this.loading = ['stalled', 'waiting'].includes(event.type); // Clear timer

      clearTimeout(this.timers.loading); // Timer to prevent flicker when seeking

      this.timers.loading = setTimeout(() => {
        // Update progress bar loading class state
        toggleClass$1(this.elements.container, this.config.classNames.loading, this.loading); // Update controls visibility

        ui.toggleControls.call(this);
      }, this.loading ? 250 : 0);
    },

    // Toggle controls based on state and `force` argument
    toggleControls(force) {
      const {
        controls: controlsElement
      } = this.elements;

      if (controlsElement && this.config.hideControls) {
        // Don't hide controls if a touch-device user recently seeked. (Must be limited to touch devices, or it occasionally prevents desktop controls from hiding.)
        const recentTouchSeek = this.touch && this.lastSeekTime + 2000 > Date.now(); // Show controls if force, loading, paused, button interaction, or recent seek, otherwise hide

        this.toggleControls(Boolean(force || this.loading || this.paused || controlsElement.pressed || controlsElement.hover || recentTouchSeek));
      }
    },

    // Migrate any custom properties from the media to the parent
    migrateStyles() {
      // Loop through values (as they are the keys when the object is spread 🤔)
      Object.values({ ...this.media.style
      }) // We're only fussed about Plyr specific properties
      .filter(key => !is$1.empty(key) && is$1.string(key) && key.startsWith('--plyr')).forEach(key => {
        // Set on the container
        this.elements.container.style.setProperty(key, this.media.style.getPropertyValue(key), 'important'); // Clean up from media element

        this.media.style.removeProperty(key);
      }); // Remove attribute if empty

      if (is$1.empty(this.media.style)) {
        this.media.removeAttribute('style');
      }
    }

  };

  class Listeners {
    constructor(_player) {
      _defineProperty$1(this, "firstTouch", () => {
        const {
          player
        } = this;
        const {
          elements
        } = player;
        player.touch = true; // Add touch class

        toggleClass$1(elements.container, player.config.classNames.isTouch, true);
      });

      _defineProperty$1(this, "setTabFocus", event => {
        const {
          player
        } = this;
        const {
          elements
        } = player;
        clearTimeout(this.focusTimer); // Ignore any key other than tab

        if (event.type === 'keydown' && event.which !== 9) {
          return;
        } // Store reference to event timeStamp


        if (event.type === 'keydown') {
          this.lastKeyDown = event.timeStamp;
        } // Remove current classes


        const removeCurrent = () => {
          const className = player.config.classNames.tabFocus;
          const current = getElements.call(player, `.${className}`);
          toggleClass$1(current, className, false);
        }; // Determine if a key was pressed to trigger this event


        const wasKeyDown = event.timeStamp - this.lastKeyDown <= 20; // Ignore focus events if a key was pressed prior

        if (event.type === 'focus' && !wasKeyDown) {
          return;
        } // Remove all current


        removeCurrent(); // Delay the adding of classname until the focus has changed
        // This event fires before the focusin event

        if (event.type !== 'focusout') {
          this.focusTimer = setTimeout(() => {
            const focused = document.activeElement; // Ignore if current focus element isn't inside the player

            if (!elements.container.contains(focused)) {
              return;
            }

            toggleClass$1(document.activeElement, player.config.classNames.tabFocus, true);
          }, 10);
        }
      });

      _defineProperty$1(this, "global", (toggle = true) => {
        const {
          player
        } = this; // Keyboard shortcuts

        if (player.config.keyboard.global) {
          toggleListener.call(player, window, 'keydown keyup', this.handleKey, toggle, false);
        } // Click anywhere closes menu


        toggleListener.call(player, document.body, 'click', this.toggleMenu, toggle); // Detect touch by events

        once.call(player, document.body, 'touchstart', this.firstTouch); // Tab focus detection

        toggleListener.call(player, document.body, 'keydown focus blur focusout', this.setTabFocus, toggle, false, true);
      });

      _defineProperty$1(this, "container", () => {
        const {
          player
        } = this;
        const {
          config,
          elements,
          timers
        } = player; // Keyboard shortcuts

        if (!config.keyboard.global && config.keyboard.focused) {
          on.call(player, elements.container, 'keydown keyup', this.handleKey, false);
        } // Toggle controls on mouse events and entering fullscreen


        on.call(player, elements.container, 'mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen', event => {
          const {
            controls: controlsElement
          } = elements; // Remove button states for fullscreen

          if (controlsElement && event.type === 'enterfullscreen') {
            controlsElement.pressed = false;
            controlsElement.hover = false;
          } // Show, then hide after a timeout unless another control event occurs


          const show = ['touchstart', 'touchmove', 'mousemove'].includes(event.type);
          let delay = 0;

          if (show) {
            ui.toggleControls.call(player, true); // Use longer timeout for touch devices

            delay = player.touch ? 3000 : 2000;
          } // Clear timer


          clearTimeout(timers.controls); // Set new timer to prevent flicker when seeking

          timers.controls = setTimeout(() => ui.toggleControls.call(player, false), delay);
        }); // Set a gutter for Vimeo

        const setGutter = (ratio, padding, toggle) => {
          if (!player.isVimeo || player.config.vimeo.premium) {
            return;
          }

          const target = player.elements.wrapper.firstChild;
          const [, y] = ratio;
          const [videoX, videoY] = getAspectRatio.call(player);

          if (toggle) {
            target.style.setProperty('max-width', `${y / videoY * videoX}px`, 'important');
            target.style.setProperty('margin', '0 auto', 'important');
          } else {
            target.style.removeProperty('max-width');
            target.style.removeProperty('margin');
          }
        }; // Resize on fullscreen change


        const setPlayerSize = measure => {
          // If we don't need to measure the viewport
          if (!measure) {
            return setAspectRatio.call(player);
          }

          const rect = elements.container.getBoundingClientRect();
          const {
            width,
            height
          } = rect;
          return setAspectRatio.call(player, `${width}:${height}`);
        };

        const resized = () => {
          clearTimeout(timers.resized);
          timers.resized = setTimeout(setPlayerSize, 50);
        };

        on.call(player, elements.container, 'enterfullscreen exitfullscreen', event => {
          const {
            target,
            usingNative
          } = player.fullscreen; // Ignore events not from target

          if (target !== elements.container) {
            return;
          } // If it's not an embed and no ratio specified


          if (!player.isEmbed && is$1.empty(player.config.ratio)) {
            return;
          }

          const isEnter = event.type === 'enterfullscreen'; // Set the player size when entering fullscreen to viewport size

          const {
            padding,
            ratio
          } = setPlayerSize(isEnter); // Set Vimeo gutter

          setGutter(ratio, padding, isEnter); // Horrible hack for Safari 14 not repainting properly on entering fullscreen

          if (isEnter) {
            setTimeout(() => repaint(elements.container), 100);
          } // If not using native browser fullscreen API, we need to check for resizes of viewport


          if (!usingNative) {
            if (isEnter) {
              on.call(player, window, 'resize', resized);
            } else {
              off.call(player, window, 'resize', resized);
            }
          }
        });
      });

      _defineProperty$1(this, "media", () => {
        const {
          player
        } = this;
        const {
          elements
        } = player; // Time change on media

        on.call(player, player.media, 'timeupdate seeking seeked', event => controls.timeUpdate.call(player, event)); // Display duration

        on.call(player, player.media, 'durationchange loadeddata loadedmetadata', event => controls.durationUpdate.call(player, event)); // Handle the media finishing

        on.call(player, player.media, 'ended', () => {
          // Show poster on end
          if (player.isHTML5 && player.isVideo && player.config.resetOnEnd) {
            // Restart
            player.restart(); // Call pause otherwise IE11 will start playing the video again

            player.pause();
          }
        }); // Check for buffer progress

        on.call(player, player.media, 'progress playing seeking seeked', event => controls.updateProgress.call(player, event)); // Handle volume changes

        on.call(player, player.media, 'volumechange', event => controls.updateVolume.call(player, event)); // Handle play/pause

        on.call(player, player.media, 'playing play pause ended emptied timeupdate', event => ui.checkPlaying.call(player, event)); // Loading state

        on.call(player, player.media, 'waiting canplay seeked playing', event => ui.checkLoading.call(player, event)); // Click video

        if (player.supported.ui && player.config.clickToPlay && !player.isAudio) {
          // Re-fetch the wrapper
          const wrapper = getElement.call(player, `.${player.config.classNames.video}`); // Bail if there's no wrapper (this should never happen)

          if (!is$1.element(wrapper)) {
            return;
          } // On click play, pause or restart


          on.call(player, elements.container, 'click', event => {
            const targets = [elements.container, wrapper]; // Ignore if click if not container or in video wrapper

            if (!targets.includes(event.target) && !wrapper.contains(event.target)) {
              return;
            } // Touch devices will just show controls (if hidden)


            if (player.touch && player.config.hideControls && !player.paused) {
              return;
            }

            if (player.ended) {
              this.proxy(event, player.restart, 'restart');
              this.proxy(event, () => {
                silencePromise(player.play());
              }, 'play');
            } else {
              this.proxy(event, () => {
                silencePromise(player.togglePlay());
              }, 'play');
            }
          });
        } // Disable right click


        if (player.supported.ui && player.config.disableContextMenu) {
          on.call(player, elements.wrapper, 'contextmenu', event => {
            event.preventDefault();
          }, false);
        } // Volume change


        on.call(player, player.media, 'volumechange', () => {
          // Save to storage
          player.storage.set({
            volume: player.volume,
            muted: player.muted
          });
        }); // Speed change

        on.call(player, player.media, 'ratechange', () => {
          // Update UI
          controls.updateSetting.call(player, 'speed'); // Save to storage

          player.storage.set({
            speed: player.speed
          });
        }); // Quality change

        on.call(player, player.media, 'qualitychange', event => {
          // Update UI
          controls.updateSetting.call(player, 'quality', null, event.detail.quality);
        }); // Update download link when ready and if quality changes

        on.call(player, player.media, 'ready qualitychange', () => {
          controls.setDownloadUrl.call(player);
        }); // Proxy events to container
        // Bubble up key events for Edge

        const proxyEvents = player.config.events.concat(['keyup', 'keydown']).join(' ');
        on.call(player, player.media, proxyEvents, event => {
          let {
            detail = {}
          } = event; // Get error details from media

          if (event.type === 'error') {
            detail = player.media.error;
          }

          triggerEvent.call(player, elements.container, event.type, true, detail);
        });
      });

      _defineProperty$1(this, "proxy", (event, defaultHandler, customHandlerKey) => {
        const {
          player
        } = this;
        const customHandler = player.config.listeners[customHandlerKey];
        const hasCustomHandler = is$1.function(customHandler);
        let returned = true; // Execute custom handler

        if (hasCustomHandler) {
          returned = customHandler.call(player, event);
        } // Only call default handler if not prevented in custom handler


        if (returned !== false && is$1.function(defaultHandler)) {
          defaultHandler.call(player, event);
        }
      });

      _defineProperty$1(this, "bind", (element, type, defaultHandler, customHandlerKey, passive = true) => {
        const {
          player
        } = this;
        const customHandler = player.config.listeners[customHandlerKey];
        const hasCustomHandler = is$1.function(customHandler);
        on.call(player, element, type, event => this.proxy(event, defaultHandler, customHandlerKey), passive && !hasCustomHandler);
      });

      _defineProperty$1(this, "controls", () => {
        const {
          player
        } = this;
        const {
          elements
        } = player; // IE doesn't support input event, so we fallback to change

        const inputEvent = browser.isIE ? 'change' : 'input'; // Play/pause toggle

        if (elements.buttons.play) {
          Array.from(elements.buttons.play).forEach(button => {
            this.bind(button, 'click', () => {
              silencePromise(player.togglePlay());
            }, 'play');
          });
        } // Pause


        this.bind(elements.buttons.restart, 'click', player.restart, 'restart'); // Rewind

        this.bind(elements.buttons.rewind, 'click', () => {
          // Record seek time so we can prevent hiding controls for a few seconds after rewind
          player.lastSeekTime = Date.now();
          player.rewind();
        }, 'rewind'); // Rewind

        this.bind(elements.buttons.fastForward, 'click', () => {
          // Record seek time so we can prevent hiding controls for a few seconds after fast forward
          player.lastSeekTime = Date.now();
          player.forward();
        }, 'fastForward'); // Mute toggle

        this.bind(elements.buttons.mute, 'click', () => {
          player.muted = !player.muted;
        }, 'mute'); // Captions toggle

        this.bind(elements.buttons.captions, 'click', () => player.toggleCaptions()); // Download

        this.bind(elements.buttons.download, 'click', () => {
          triggerEvent.call(player, player.media, 'download');
        }, 'download'); // Fullscreen toggle

        this.bind(elements.buttons.fullscreen, 'click', () => {
          player.fullscreen.toggle();
        }, 'fullscreen'); // Picture-in-Picture

        this.bind(elements.buttons.pip, 'click', () => {
          player.pip = 'toggle';
        }, 'pip'); // Airplay

        this.bind(elements.buttons.airplay, 'click', player.airplay, 'airplay'); // Settings menu - click toggle

        this.bind(elements.buttons.settings, 'click', event => {
          // Prevent the document click listener closing the menu
          event.stopPropagation();
          event.preventDefault();
          controls.toggleMenu.call(player, event);
        }, null, false); // Can't be passive as we're preventing default
        // Settings menu - keyboard toggle
        // We have to bind to keyup otherwise Firefox triggers a click when a keydown event handler shifts focus
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1220143

        this.bind(elements.buttons.settings, 'keyup', event => {
          const code = event.which; // We only care about space and return

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

        this.bind(elements.settings.menu, 'keydown', event => {
          if (event.which === 27) {
            controls.toggleMenu.call(player, event);
          }
        }); // Set range input alternative "value", which matches the tooltip time (#954)

        this.bind(elements.inputs.seek, 'mousedown mousemove', event => {
          const rect = elements.progress.getBoundingClientRect();
          const percent = 100 / rect.width * (event.pageX - rect.left);
          event.currentTarget.setAttribute('seek-value', percent);
        }); // Pause while seeking

        this.bind(elements.inputs.seek, 'mousedown mouseup keydown keyup touchstart touchend', event => {
          const seek = event.currentTarget;
          const code = event.keyCode ? event.keyCode : event.which;
          const attribute = 'play-on-seeked';

          if (is$1.keyboardEvent(event) && code !== 39 && code !== 37) {
            return;
          } // Record seek time so we can prevent hiding controls for a few seconds after seek


          player.lastSeekTime = Date.now(); // Was playing before?

          const play = seek.hasAttribute(attribute); // Done seeking

          const done = ['mouseup', 'touchend', 'keyup'].includes(event.type); // If we're done seeking and it was playing, resume playback

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
          const inputs = getElements.call(player, 'input[type="range"]');
          Array.from(inputs).forEach(input => this.bind(input, inputEvent, event => repaint(event.target)));
        } // Seek


        this.bind(elements.inputs.seek, inputEvent, event => {
          const seek = event.currentTarget; // If it exists, use seek-value instead of "value" for consistency with tooltip time (#954)

          let seekTo = seek.getAttribute('seek-value');

          if (is$1.empty(seekTo)) {
            seekTo = seek.value;
          }

          seek.removeAttribute('seek-value');
          player.currentTime = seekTo / seek.max * player.duration;
        }, 'seek'); // Seek tooltip

        this.bind(elements.progress, 'mouseenter mouseleave mousemove', event => controls.updateSeekTooltip.call(player, event)); // Preview thumbnails plugin
        // TODO: Really need to work on some sort of plug-in wide event bus or pub-sub for this

        this.bind(elements.progress, 'mousemove touchmove', event => {
          const {
            previewThumbnails
          } = player;

          if (previewThumbnails && previewThumbnails.loaded) {
            previewThumbnails.startMove(event);
          }
        }); // Hide thumbnail preview - on mouse click, mouse leave, and video play/seek. All four are required, e.g., for buffering

        this.bind(elements.progress, 'mouseleave touchend click', () => {
          const {
            previewThumbnails
          } = player;

          if (previewThumbnails && previewThumbnails.loaded) {
            previewThumbnails.endMove(false, true);
          }
        }); // Show scrubbing preview

        this.bind(elements.progress, 'mousedown touchstart', event => {
          const {
            previewThumbnails
          } = player;

          if (previewThumbnails && previewThumbnails.loaded) {
            previewThumbnails.startScrubbing(event);
          }
        });
        this.bind(elements.progress, 'mouseup touchend', event => {
          const {
            previewThumbnails
          } = player;

          if (previewThumbnails && previewThumbnails.loaded) {
            previewThumbnails.endScrubbing(event);
          }
        }); // Polyfill for lower fill in <input type="range"> for webkit

        if (browser.isWebkit) {
          Array.from(getElements.call(player, 'input[type="range"]')).forEach(element => {
            this.bind(element, 'input', event => controls.updateRangeFill.call(player, event.target));
          });
        } // Current time invert
        // Only if one time element is used for both currentTime and duration


        if (player.config.toggleInvert && !is$1.element(elements.display.duration)) {
          this.bind(elements.display.currentTime, 'click', () => {
            // Do nothing if we're at the start
            if (player.currentTime === 0) {
              return;
            }

            player.config.invertTime = !player.config.invertTime;
            controls.timeUpdate.call(player);
          });
        } // Volume


        this.bind(elements.inputs.volume, inputEvent, event => {
          player.volume = event.target.value;
        }, 'volume'); // Update controls.hover state (used for ui.toggleControls to avoid hiding when interacting)

        this.bind(elements.controls, 'mouseenter mouseleave', event => {
          elements.controls.hover = !player.touch && event.type === 'mouseenter';
        }); // Also update controls.hover state for any non-player children of fullscreen element (as above)

        if (elements.fullscreen) {
          Array.from(elements.fullscreen.children).filter(c => !c.contains(elements.container)).forEach(child => {
            this.bind(child, 'mouseenter mouseleave', event => {
              elements.controls.hover = !player.touch && event.type === 'mouseenter';
            });
          });
        } // Update controls.pressed state (used for ui.toggleControls to avoid hiding when interacting)


        this.bind(elements.controls, 'mousedown mouseup touchstart touchend touchcancel', event => {
          elements.controls.pressed = ['mousedown', 'touchstart'].includes(event.type);
        }); // Show controls when they receive focus (e.g., when using keyboard tab key)

        this.bind(elements.controls, 'focusin', () => {
          const {
            config,
            timers
          } = player; // Skip transition to prevent focus from scrolling the parent element

          toggleClass$1(elements.controls, config.classNames.noTransition, true); // Toggle

          ui.toggleControls.call(player, true); // Restore transition

          setTimeout(() => {
            toggleClass$1(elements.controls, config.classNames.noTransition, false);
          }, 0); // Delay a little more for mouse users

          const delay = this.touch ? 3000 : 4000; // Clear timer

          clearTimeout(timers.controls); // Hide again after delay

          timers.controls = setTimeout(() => ui.toggleControls.call(player, false), delay);
        }); // Mouse wheel for volume

        this.bind(elements.inputs.volume, 'wheel', event => {
          // Detect "natural" scroll - suppored on OS X Safari only
          // Other browsers on OS X will be inverted until support improves
          const inverted = event.webkitDirectionInvertedFromDevice; // Get delta from event. Invert if `inverted` is true

          const [x, y] = [event.deltaX, -event.deltaY].map(value => inverted ? -value : value); // Using the biggest delta, normalize to 1 or -1 (or 0 if no delta)

          const direction = Math.sign(Math.abs(x) > Math.abs(y) ? x : y); // Change the volume by 2%

          player.increaseVolume(direction / 50); // Don't break page scrolling at max and min

          const {
            volume
          } = player.media;

          if (direction === 1 && volume < 1 || direction === -1 && volume > 0) {
            event.preventDefault();
          }
        }, 'volume', false);
      });

      this.player = _player;
      this.lastKey = null;
      this.focusTimer = null;
      this.lastKeyDown = null;
      this.handleKey = this.handleKey.bind(this);
      this.toggleMenu = this.toggleMenu.bind(this);
      this.setTabFocus = this.setTabFocus.bind(this);
      this.firstTouch = this.firstTouch.bind(this);
    } // Handle key presses


    handleKey(event) {
      const {
        player
      } = this;
      const {
        elements
      } = player;
      const code = event.keyCode ? event.keyCode : event.which;
      const pressed = event.type === 'keydown';
      const repeat = pressed && code === this.lastKey; // Bail if a modifier key is set

      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      } // If the event is bubbled from the media element
      // Firefox doesn't get the keycode for whatever reason


      if (!is$1.number(code)) {
        return;
      } // Seek by the number keys


      const seekByKey = () => {
        // Divide the max duration into 10th's and times by the number value
        player.currentTime = player.duration / 10 * (code - 48);
      }; // Handle the key on keydown
      // Reset on keyup


      if (pressed) {
        // Check focused element
        // and if the focused element is not editable (e.g. text input)
        // and any that accept key input http://webaim.org/techniques/keyboard/
        const focused = document.activeElement;

        if (is$1.element(focused)) {
          const {
            editable
          } = player.config.selectors;
          const {
            seek
          } = elements.inputs;

          if (focused !== seek && matches(focused, editable)) {
            return;
          }

          if (event.which === 32 && matches(focused, 'button, [role^="menuitem"]')) {
            return;
          }
        } // Which keycodes should we prevent default


        const preventDefault = [32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 56, 57, 67, 70, 73, 75, 76, 77, 79]; // If the code is found prevent default (e.g. prevent scrolling for arrows)

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


    toggleMenu(event) {
      controls.toggleMenu.call(this.player, event);
    } // Device is touch enabled


  }

  // ==========================================================================
  // Vimeo plugin
  // ==========================================================================
  const vimeo = {
    setup() {
      throw new Error('vimeo#setup is removed!');
    },

    ready() {
      throw new Error('vimeo#ready is removed!');
    }

  };

  // ==========================================================================
  // YouTube plugin
  // ==========================================================================
  const youtube = {
    setup() {
      throw new Error('youtube#setup is removed!');
    },

    getTitle() {
      throw new Error('youtube#getTitle is removed!');
    },

    ready() {
      throw new Error('youtube#ready is removed!');
    }

  };

  // ==========================================================================
  const media = {
    // Setup media
    setup() {
      // If there's no media, bail
      if (!this.media) {
        this.debug.warn('No media element found!');
        return;
      } // Add type class


      toggleClass$1(this.elements.container, this.config.classNames.type.replace('{0}', this.type), true); // Add provider class

      toggleClass$1(this.elements.container, this.config.classNames.provider.replace('{0}', this.provider), true); // Add video class for embeds
      // This will require changes if audio embeds are added

      if (this.isEmbed) {
        toggleClass$1(this.elements.container, this.config.classNames.type.replace('{0}', 'video'), true);
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

  // ==========================================================================
  // Advertisement plugin using Google IMA HTML5 SDK
  // Create an account with our ad partner, vi here:
  // https://www.vi.ai/publisher-video-monetization/
  // ==========================================================================
  class Ads {
    constructor() {
      throw new Error('Ads class is removed!');
    }

  }

  class PreviewThumbnails {
    constructor() {
      throw new Error('PreviewThumbnails class is removed!');
    }

  }

  // ==========================================================================
  const source = {
    // Add elements to HTML5 media (source, tracks, etc)
    insertElements(type, attributes) {
      if (is$1.string(attributes)) {
        insertElement(type, this.media, {
          src: attributes
        });
      } else if (is$1.array(attributes)) {
        attributes.forEach(attribute => {
          insertElement(type, this.media, attribute);
        });
      }
    },

    // Update source
    // Sources are not checked for support so be careful
    change(input) {
      if (!getDeep(input, 'sources.length')) {
        this.debug.warn('Invalid source format');
        return;
      } // Cancel current network requests


      html5.cancelRequests.call(this); // Destroy instance and re-setup

      this.destroy.call(this, () => {
        // Reset quality options
        this.options.quality = []; // Remove elements

        removeElement(this.media);
        this.media = null; // Reset class name

        if (is$1.element(this.elements.container)) {
          this.elements.container.removeAttribute('class');
        } // Set the type and provider


        const {
          sources,
          type
        } = input;
        const [{
          provider = providers.html5,
          src
        }] = sources;
        const tagName = provider === 'html5' ? type : 'div';
        const attributes = provider === 'html5' ? {} : {
          src
        };
        Object.assign(this, {
          provider,
          type,
          // Check for support
          supported: support.check(type, provider, this.config.playsinline),
          // Create new element
          media: createElement(tagName, attributes)
        }); // Inject the new element

        this.elements.container.appendChild(this.media); // Autoplay the new source?

        if (is$1.boolean(input.autoplay)) {
          this.config.autoplay = input.autoplay;
        } // Set attributes for audio and video


        if (this.isHTML5) {
          if (this.config.crossorigin) {
            this.media.setAttribute('crossorigin', '');
          }

          if (this.config.autoplay) {
            this.media.setAttribute('autoplay', '');
          }

          if (!is$1.empty(input.poster)) {
            this.poster = input.poster;
          }

          if (this.config.loop.active) {
            this.media.setAttribute('loop', '');
          }

          if (this.config.muted) {
            this.media.setAttribute('muted', '');
          }

          if (this.config.playsinline) {
            this.media.setAttribute('playsinline', '');
          }
        } // Restore class hook


        ui.addStyleHook.call(this); // Set new sources for html5

        if (this.isHTML5) {
          source.insertElements.call(this, 'source', sources);
        } // Set video title


        this.config.title = input.title; // Set up from scratch

        media.setup.call(this); // HTML5 stuff

        if (this.isHTML5) {
          // Setup captions
          if (Object.keys(input).includes('tracks')) {
            source.insertElements.call(this, 'track', input.tracks);
          }
        } // If HTML5 or embed but not fully supported, setupInterface and call ready now


        if (this.isHTML5 || this.isEmbed && !this.supported.ui) {
          // Setup interface
          ui.build.call(this);
        } // Load HTML5 sources


        if (this.isHTML5) {
          this.media.load();
        } // Update previewThumbnails config & reload plugin


        if (!is$1.empty(input.previewThumbnails)) {
          Object.assign(this.config.previewThumbnails, input.previewThumbnails); // Cleanup previewThumbnails plugin if it was loaded

          if (this.previewThumbnails && this.previewThumbnails.loaded) {
            this.previewThumbnails.destroy();
            this.previewThumbnails = null;
          } // Create new instance if it is still enabled


          if (this.config.previewThumbnails.enabled) {
            this.previewThumbnails = new PreviewThumbnails(this);
          }
        } // Update the fullscreen support


        this.fullscreen.update();
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
  function clamp(input = 0, min = 0, max = 255) {
    return Math.min(Math.max(input, min), max);
  }

  /**
   * Parse a string to a URL object
   * @param {String} input - the URL to be parsed
   * @param {Boolean} safe - failsafe parsing
   */

  function parseUrl(input, safe = true) {
    let url = input;

    if (safe) {
      const parser = document.createElement('a');
      parser.href = url;
      url = parser.href;
    }

    try {
      return new URL(url);
    } catch (e) {
      return null;
    }
  } // Convert object to URLSearchParams

  // TODO: Use a WeakMap for private globals
  // const globals = new WeakMap();

  const myDumpDiv = document.createElement('div');
  const myDumpVideo = document.createElement('video');
  const myDumpAudio = document.createElement('audio');
  const myDumpInput = document.createElement('input');
  const myDumpProgress = document.createElement('progress');

  const myIsElm = v => is$1.element(v);

  const myIsVideo = v => myIsElm(v) && v.nodeName === 'VIDEO';

  const myIsAudio = v => myIsElm(v) && v.nodeName === 'AUDIO';

  const myIsInput = v => myIsElm(v) && v.nodeName === 'INPUT';

  const myIsProgress = v => myIsElm(v) && v.nodeName === 'PROGRESS';

  const myIsObject = v => v !== null && typeof v === 'object';

  const myMock = obj => {
    const keys = is$1.array(obj) ? Object.keys(obj) : Object.getOwnPropertyNames(obj);
    const dumb = is$1.array(obj) ? [] : {};

    for (let index = 0, length = keys.length; index !== length; index += 1) {
      const key = keys[index];
      const val = obj[key];
      if (myIsVideo(val)) dumb[key] = myDumpVideo;else if (myIsAudio(val)) dumb[key] = myDumpAudio;else if (myIsInput(val)) dumb[key] = myDumpInput;else if (myIsProgress(val)) dumb[key] = myDumpProgress;else if (myIsElm(val)) dumb[key] = myDumpDiv;else if (myIsObject(val)) dumb[key] = myMock(val);else dumb[key] = val;
    }

    return dumb;
  }; // Plyr instance


  class Plyr {
    constructor(target, options) {
      _defineProperty$1(this, "play", () => {
        if (!is$1.function(this.media.play)) {
          return null;
        } // Intecept play with ads


        if (this.ads && this.ads.enabled) {
          this.ads.managerPromise.then(() => this.ads.play()).catch(() => silencePromise(this.media.play()));
        } // Return the promise (for HTML5)


        return this.media.play();
      });

      _defineProperty$1(this, "pause", () => {
        if (!this.playing || !is$1.function(this.media.pause)) {
          return null;
        }

        return this.media.pause();
      });

      _defineProperty$1(this, "togglePlay", input => {
        // Toggle based on current state if nothing passed
        const toggle = is$1.boolean(input) ? input : !this.playing;

        if (toggle) {
          return this.play();
        }

        return this.pause();
      });

      _defineProperty$1(this, "stop", () => {
        if (this.isHTML5) {
          this.pause();
          this.restart();
        } else if (is$1.function(this.media.stop)) {
          this.media.stop();
        }
      });

      _defineProperty$1(this, "restart", () => {
        this.currentTime = 0;
      });

      _defineProperty$1(this, "rewind", seekTime => {
        this.currentTime -= is$1.number(seekTime) ? seekTime : this.config.seekTime;
      });

      _defineProperty$1(this, "forward", seekTime => {
        this.currentTime += is$1.number(seekTime) ? seekTime : this.config.seekTime;
      });

      _defineProperty$1(this, "increaseVolume", step => {
        const volume = this.media.muted ? 0 : this.volume;
        this.volume = volume + (is$1.number(step) ? step : 0);
      });

      _defineProperty$1(this, "decreaseVolume", step => {
        this.increaseVolume(-step);
      });

      _defineProperty$1(this, "airplay", () => {
        // Show dialog if supported
        if (support.airplay) {
          this.media.webkitShowPlaybackTargetPicker();
        }
      });

      _defineProperty$1(this, "toggleControls", toggle => {
        // Don't toggle if missing UI support or if it's audio
        if (this.supported.ui && !this.isAudio) {
          // Get state before change
          const isHidden = hasClass(this.elements.container, this.config.classNames.hideControls); // Negate the argument if not undefined since adding the class to hides the controls

          const force = typeof toggle === 'undefined' ? undefined : !toggle; // Apply and get updated state

          const hiding = toggleClass$1(this.elements.container, this.config.classNames.hideControls, force); // Close menu

          if (hiding && is$1.array(this.config.controls) && this.config.controls.includes('settings') && !is$1.empty(this.config.settings)) {
            controls.toggleMenu.call(this, false);
          } // Trigger event on change


          if (hiding !== isHidden) {
            const eventName = hiding ? 'controlshidden' : 'controlsshown';
            triggerEvent.call(this, this.media, eventName);
          }

          return !hiding;
        }

        return false;
      });

      _defineProperty$1(this, "on", (event, callback) => {
        on.call(this, this.elements.container, event, callback);
      });

      _defineProperty$1(this, "once", (event, callback) => {
        once.call(this, this.elements.container, event, callback);
      });

      _defineProperty$1(this, "off", (event, callback) => {
        off(this.elements.container, event, callback);
      });

      _defineProperty$1(this, "destroy", (callback, soft = false) => {
        if (!this.ready) {
          return;
        }

        const done = () => {
          // Reset overflow (incase destroyed while in fullscreen)
          document.body.style.removeProperty('overflow'); // GC for embed

          this.embed = null; // If it's a soft destroy, make minimal changes

          if (soft) {
            if (Object.keys(this.elements).length) {
              // Remove elements
              removeElement(this.elements.buttons.play);
              removeElement(this.elements.captions);
              removeElement(this.elements.controls);
              removeElement(this.elements.wrapper); // Clear for GC

              this.elements.buttons.play = null;
              this.elements.captions = null;
              this.elements.controls = null;
              this.elements.wrapper = null;
            } // Callback


            if (is$1.function(callback)) {
              callback();
            }
          } else {
            // Unbind listeners
            unbindListeners.call(this); // Cancel current network requests

            html5.cancelRequests.call(this); // Replace the container with the original element provided

            replaceElement(this.elements.original, this.elements.container); // Event

            triggerEvent.call(this, this.elements.original, 'destroyed', true); // Callback

            if (is$1.function(callback)) {
              callback.call(this.elements.original);
            } // Reset state


            this.ready = false; // Clear for garbage collection

            this.elements = myMock(this.elements);
            this.media = myIsAudio(this.media) ? myDumpAudio : myDumpVideo;
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
      });

      _defineProperty$1(this, "supports", type => support.mime.call(this, type));

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


      this.config = extend({}, defaults$1, Plyr.defaults, options || {}, (() => {
        try {
          return JSON.parse(this.media.getAttribute('data-plyr-config'));
        } catch (e) {
          return {};
        }
      })()); // Elements cache

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


      const clone = this.media.cloneNode(true);
      clone.autoplay = false;
      this.elements.original = clone; // Set media type based on tag or data attribute
      // Supported: video, audio, vimeo, youtube

      const _type = this.media.tagName.toLowerCase(); // Embed properties


      let iframe = null;
      let url = null; // Different setup based on type

      switch (_type) {
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
              const truthy = ['1', 'true'];

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


          if (is$1.empty(this.provider) || !Object.values(providers).includes(this.provider)) {
            this.debug.error('Setup failed: Invalid provider');
            return;
          } // Audio will come later for external providers


          this.type = types.video;
          break;

        case 'video':
        case 'audio':
          this.type = _type;
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
        on.call(this, this.elements.container, this.config.events.join(' '), event => {
          this.debug.log(`event: ${event.type}`);
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
        this.once('canplay', () => silencePromise(this.play()));
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


    get isHTML5() {
      return this.provider === providers.html5;
    }

    get isEmbed() {
      return this.isYouTube || this.isVimeo;
    }

    get isYouTube() {
      return this.provider === providers.youtube;
    }

    get isVimeo() {
      return this.provider === providers.vimeo;
    }

    get isVideo() {
      return this.type === types.video;
    }

    get isAudio() {
      return this.type === types.audio;
    }
    /**
     * Play the media, or play the advertisement (if they are not blocked)
     */


    /**
     * Get playing state
     */
    get playing() {
      return Boolean(this.ready && !this.paused && !this.ended);
    }
    /**
     * Get paused state
     */


    get paused() {
      return Boolean(this.media.paused);
    }
    /**
     * Get stopped state
     */


    get stopped() {
      return Boolean(this.paused && this.currentTime === 0);
    }
    /**
     * Get ended state
     */


    get ended() {
      return Boolean(this.media.ended);
    }
    /**
     * Toggle playback based on current status
     * @param {Boolean} input
     */


    /**
     * Seek to a time
     * @param {Number} input - where to seek to in seconds. Defaults to 0 (the start)
     */
    set currentTime(input) {
      // Bail if media duration isn't available yet
      if (!this.duration) {
        return;
      } // Validate input


      const inputIsValid = is$1.number(input) && input > 0; // Set

      this.media.currentTime = inputIsValid ? Math.min(input, this.duration) : 0; // Logging

      this.debug.log(`Seeking to ${this.currentTime} seconds`);
    }
    /**
     * Get current time
     */


    get currentTime() {
      return Number(this.media.currentTime);
    }
    /**
     * Get buffered
     */


    get buffered() {
      const {
        buffered
      } = this.media; // YouTube / Vimeo return a float between 0-1

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


    get seeking() {
      return Boolean(this.media.seeking);
    }
    /**
     * Get the duration of the current media
     */


    get duration() {
      // Faux duration set via config
      const fauxDuration = parseFloat(this.config.duration); // Media duration can be NaN or Infinity before the media has loaded

      const realDuration = (this.media || {}).duration;
      const duration = !is$1.number(realDuration) || realDuration === Infinity ? 0 : realDuration; // If config duration is funky, use regular duration

      return fauxDuration || duration;
    }
    /**
     * Set the player volume
     * @param {Number} value - must be between 0 and 1. Defaults to the value from local storage and config.volume if not set in storage
     */


    set volume(value) {
      let volume = value;
      const max = 1;
      const min = 0;

      if (is$1.string(volume)) {
        volume = Number(volume);
      } // Load volume from storage if no value specified


      if (!is$1.number(volume)) {
        volume = this.storage.get('volume');
      } // Use config if all else fails


      if (!is$1.number(volume)) {
        ({
          volume
        } = this.config);
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


    get volume() {
      return Number(this.media.volume);
    }
    /**
     * Increase volume
     * @param {Boolean} step - How much to decrease by (between 0 and 1)
     */


    /**
     * Set muted state
     * @param {Boolean} mute
     */
    set muted(mute) {
      let toggle = mute; // Load muted state from storage

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


    get muted() {
      return Boolean(this.media.muted);
    }
    /**
     * Check if the media has audio
     */


    get hasAudio() {
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


    set speed(input) {
      let speed = null;

      if (is$1.number(input)) {
        speed = input;
      }

      if (!is$1.number(speed)) {
        speed = this.storage.get('speed');
      }

      if (!is$1.number(speed)) {
        speed = this.config.speed.selected;
      } // Clamp to min/max


      const {
        minimumSpeed: min,
        maximumSpeed: max
      } = this;
      speed = clamp(speed, min, max); // Update config

      this.config.speed.selected = speed; // Set media speed

      setTimeout(() => {
        this.media.playbackRate = speed;
      }, 0);
    }
    /**
     * Get current playback speed
     */


    get speed() {
      return Number(this.media.playbackRate);
    }
    /**
     * Get the minimum allowed speed
     */


    get minimumSpeed() {
      if (this.isYouTube) {
        // https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
        return Math.min(...this.options.speed);
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


    get maximumSpeed() {
      if (this.isYouTube) {
        // https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
        return Math.max(...this.options.speed);
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


    set quality(input) {
      const config = this.config.quality;
      const options = this.options.quality;

      if (!options.length) {
        return;
      }

      let quality = [!is$1.empty(input) && Number(input), this.storage.get('quality'), config.selected, config.default].find(is$1.number);
      let updateStorage = true;

      if (!options.includes(quality)) {
        const value = closest(options, quality);
        this.debug.warn(`Unsupported quality option: ${quality}, using ${value} instead`);
        quality = value; // Don't update storage if quality is not supported

        updateStorage = false;
      } // Update config


      config.selected = quality; // Set quality

      this.media.quality = quality; // Save to storage

      if (updateStorage) {
        this.storage.set({
          quality
        });
      }
    }
    /**
     * Get current quality level
     */


    get quality() {
      return this.media.quality;
    }
    /**
     * Toggle loop
     * TODO: Finish fancy new logic. Set the indicator on load as user may pass loop as config
     * @param {Boolean} input - Whether to loop or not
     */


    set loop(input) {
      const toggle = is$1.boolean(input) ? input : this.config.loop.active;
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


    get loop() {
      return Boolean(this.media.loop);
    }
    /**
     * Set new media source
     * @param {Object} input - The new source object (see docs)
     */


    set source(input) {
      source.change.call(this, input);
    }
    /**
     * Get current source
     */


    get source() {
      return this.media.currentSrc;
    }
    /**
     * Get a download URL (either source or custom)
     */


    get download() {
      const {
        download
      } = this.config.urls;
      return is$1.url(download) ? download : this.source;
    }
    /**
     * Set the download URL
     */


    set download(input) {
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


    set poster(input) {
      if (!this.isVideo) {
        this.debug.warn('Poster can only be set for video');
        return;
      }

      ui.setPoster.call(this, input, false).catch(() => {});
    }
    /**
     * Get the current poster image
     */


    get poster() {
      if (!this.isVideo) {
        return null;
      }

      return this.media.getAttribute('poster') || this.media.getAttribute('data-poster');
    }
    /**
     * Get the current aspect ratio in use
     */


    get ratio() {
      if (!this.isVideo) {
        return null;
      }

      const ratio = reduceAspectRatio(getAspectRatio.call(this));
      return is$1.array(ratio) ? ratio.join(':') : ratio;
    }
    /**
     * Set video aspect ratio
     */


    set ratio(input) {
      if (!this.isVideo) {
        this.debug.warn('Aspect ratio can only be set for video');
        return;
      }

      if (!is$1.string(input) || !validateRatio(input)) {
        this.debug.error(`Invalid aspect ratio specified (${input})`);
        return;
      }

      this.config.ratio = input;
      setAspectRatio.call(this);
    }
    /**
     * Set the autoplay state
     * @param {Boolean} input - Whether to autoplay or not
     */


    set autoplay(input) {
      const toggle = is$1.boolean(input) ? input : this.config.autoplay;
      this.config.autoplay = toggle;
    }
    /**
     * Get the current autoplay state
     */


    get autoplay() {
      return Boolean(this.config.autoplay);
    }
    /**
     * Toggle captions
     * @param {Boolean} input - Whether to enable captions
     */


    toggleCaptions(input) {
      captions.toggle.call(this, input, false);
    }
    /**
     * Set the caption track by index
     * @param {Number} - Caption index
     */


    set currentTrack(input) {
      captions.set.call(this, input, false);
    }
    /**
     * Get the current caption track index (-1 if disabled)
     */


    get currentTrack() {
      const {
        toggled,
        currentTrack
      } = this.captions;
      return toggled ? currentTrack : -1;
    }
    /**
     * Set the wanted language for captions
     * Since tracks can be added later it won't update the actual caption track until there is a matching track
     * @param {String} - Two character ISO language code (e.g. EN, FR, PT, etc)
     */


    set language(input) {
      captions.setLanguage.call(this, input, false);
    }
    /**
     * Get the current track's language
     */


    get language() {
      return (captions.getCurrentTrack.call(this) || {}).language;
    }
    /**
     * Toggle picture-in-picture playback on WebKit/MacOS
     * TODO: update player with state, support, enabled
     * TODO: detect outside changes
     */


    set pip(input) {
      // Bail if no support
      if (!support.pip) {
        return;
      } // Toggle based on current state if not passed


      const toggle = is$1.boolean(input) ? input : !this.pip; // Toggle based on current state
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


    get pip() {
      if (!support.pip) {
        return null;
      } // Safari


      if (!is$1.empty(this.media.webkitPresentationMode)) {
        return this.media.webkitPresentationMode === pip.active;
      } // Chrome


      return this.media === document.pictureInPictureElement;
    }
    /**
     * Trigger the airplay dialog
     * TODO: update player with state, support, enabled
     */


    /**
     * Check for support
     * @param {String} type - Player type (audio/video)
     * @param {String} provider - Provider (html5/youtube/vimeo)
     * @param {Boolean} inline - Where player has `playsinline` sttribute
     */
    static supported(type, provider, inline) {
      return support.check(type, provider, inline);
    }
    /**
     * Load an SVG sprite into the page
     * @param {String} url - URL for the SVG sprite
     * @param {String} [id] - Unique ID
     */


    static loadSprite(url, id) {
      return loadSprite(url, id);
    }
    /**
     * Setup multiple instances
     * @param {*} selector
     * @param {Object} options
     */


    static setup(selector, options = {}) {
      let targets = null;

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

      return targets.map(t => new Plyr(t, options));
    }

  }

  Plyr.defaults = cloneDeep(defaults$1);

  const sources = {
    video: {
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
      previewThumbnails: {
        src: ['https://cdn.plyr.io/static/demo/thumbs/100p.vtt', 'https://cdn.plyr.io/static/demo/thumbs/240p.vtt']
      }
    },
    audio: {
      type: 'audio',
      title: 'Kishi Bashi &ndash; &ldquo;It All Began With A Burst&rdquo;',
      sources: [{
        src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3',
        type: 'audio/mp3'
      }, {
        src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg',
        type: 'audio/ogg'
      }]
    },
    youtube: {
      type: 'video',
      sources: [{
        src: 'https://youtube.com/watch?v=bTqVqk7FSmY',
        provider: 'youtube'
      }]
    },
    vimeo: {
      type: 'video',
      sources: [{
        src: 'https://vimeo.com/40648169',
        provider: 'vimeo'
      }]
    }
  };

  // Toggle class on an element
  const toggleClass = (element, className = '', toggle = false) => element && element.classList[toggle ? 'add' : 'remove'](className);

  // ==========================================================================

  (() => {
    document.addEventListener('DOMContentLoaded', () => {
      const selector = '#player'; // Setup the player

      const player = new Plyr(selector, {
        debug: true,
        title: 'View From A Blue Moon',
        iconUrl: 'dist/demo.svg',
        keyboard: {
          global: true
        },
        tooltips: {
          controls: true
        },
        vimeo: {
          // Prevent Vimeo blocking plyr.io demo site
          referrerPolicy: 'no-referrer'
        }
      }); // Expose for tinkering in the console

      window.player = player; // Setup type toggle

      const buttons = document.querySelectorAll('[data-source]');
      const types = Object.keys(sources);
      const historySupport = Boolean(window.history && window.history.pushState);
      let currentType = window.location.hash.substring(1);
      const hasInitialType = currentType.length;

      function render(type) {
        // Remove active classes
        Array.from(buttons).forEach(button => toggleClass(button.parentElement, 'active', false)); // Set active on parent

        toggleClass(document.querySelector(`[data-source="${type}"]`), 'active', true); // Show cite

        Array.from(document.querySelectorAll('.ggs-plyr__cite')).forEach(cite => {
          // eslint-disable-next-line no-param-reassign
          cite.hidden = true;
        });
        document.querySelector(`.ggs-plyr__cite--${type}`).hidden = false;
      } // Set a new source


      function setSource(type, init) {
        // Bail if new type isn't known, it's the current type, or current type is empty (video is default) and new type is video
        if (!types.includes(type) || !init && type === currentType || !currentType.length && type === 'video') {
          return;
        } // Set the new source


        player.source = sources[type]; // Set the current type for next time

        currentType = type;
        render(type);
      } // Bind to each button


      Array.from(buttons).forEach(button => {
        button.addEventListener('click', () => {
          const type = button.getAttribute('data-source');
          setSource(type);

          if (historySupport) {
            window.history.pushState({
              type
            }, '', `#${type}`);
          }
        });
      }); // List for backwards/forwards

      window.addEventListener('popstate', event => {
        if (event.state && Object.keys(event.state).includes('type')) {
          setSource(event.state.type);
        }
      }); // If there's no current type set, assume video

      if (!hasInitialType) {
        currentType = 'video';
      } // Replace current history state


      if (historySupport && types.includes(currentType)) {
        window.history.replaceState({
          type: currentType
        }, '', hasInitialType ? `#${currentType}` : '');
      } // If it's not video, load the source


      if (currentType !== 'video') {
        setSource(currentType, true);
      }

      render(currentType);
    });
  })();

}());
