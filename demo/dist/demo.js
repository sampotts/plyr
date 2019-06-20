typeof navigator === "object" && (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var O = 'object';
	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == O && globalThis) ||
	  check(typeof window == O && window) ||
	  check(typeof self == O && self) ||
	  check(typeof commonjsGlobal == O && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings



	var split = ''.split;

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// 7.1.1 ToPrimitive(input [, PreferredType])
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var exist = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return exist ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
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
		f: f$2
	};

	var hide = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    hide(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var isPure = false;

	var shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.1.3',
	  mode: 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var functionToString = shared('native-function-to-string', Function.toString);

	var WeakMap$1 = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(functionToString.call(WeakMap$1));

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + postfix).toString(36));
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$2 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store = new WeakMap$2();
	  var wmget = store.get;
	  var wmhas = store.has;
	  var wmset = store.set;
	  set = function (it, metadata) {
	    wmset.call(store, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    hide(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(functionToString).split('toString');

	shared('inspectSource', function (it) {
	  return functionToString.call(it);
	});

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
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
	  else hide(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
	});
	});

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	// false -> Array#indexOf
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	// true  -> Array#includes
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	var arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIndexOf = arrayIncludes(false);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
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

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)



	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	var Reflect = global_1.Reflect;

	// all object keys, includes non-enumerable and symbols
	var ownKeys = Reflect && Reflect.ownKeys || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
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

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






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
	      descriptor = getOwnPropertyDescriptor$1(target, key);
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
	      hide(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var aFunction = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var bindContext = function (fn, that, length) {
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

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var Symbol$1 = global_1.Symbol;
	var store$1 = shared('wks');

	var wellKnownSymbol = function (name) {
	  return store$1[name] || (store$1[name] = nativeSymbol && Symbol$1[name]
	    || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
	};

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

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
	var classof = function (it) {
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

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var index = 0;
	  var iteratorMethod = getIteratorMethod(O);
	  var length, result, step, iterator;
	  if (mapping) mapfn = bindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    result = new C();
	    for (;!(step = iterator.next()).done; index++) {
	      createProperty(result, index, mapping
	        ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
	        : step.value
	      );
	    }
	  } else {
	    length = toLength(O.length);
	    result = new C(length);
	    for (;length > index; index++) {
	      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$2] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var key;
	  while (length > i) objectDefineProperty.f(O, key = keys[i++], Properties[key]);
	  return O;
	};

	var document$2 = global_1.document;

	var html = document$2 && document$2.documentElement;

	var IE_PROTO = sharedKey('IE_PROTO');

	var PROTOTYPE = 'prototype';
	var Empty = function () { /* empty */ };

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var length = enumBugKeys.length;
	  var lt = '<';
	  var script = 'script';
	  var gt = '>';
	  var js = 'java' + script + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  iframe.src = String(js);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
	  return createDict();
	};

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	hiddenKeys[IE_PROTO] = true;

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype$1 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
	  hide(ArrayPrototype$1, UNSCOPABLES, objectCreate(null));
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var internalIncludes = arrayIncludes(true);

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return internalIncludes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	// helper for String#{startsWith, endsWith, includes}



	var validateStringMethodArguments = function (that, searchString, NAME) {
	  if (isRegexp(searchString)) {
	    throw TypeError('String.prototype.' + NAME + " doesn't accept regex");
	  } return String(requireObjectCoercible(that));
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~validateStringMethodArguments(this, searchString, 'includes')
	      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// CONVERT_TO_STRING: true  -> String#at
	// CONVERT_TO_STRING: false -> String#codePointAt
	var stringAt = function (that, pos, CONVERT_TO_STRING) {
	  var S = String(requireObjectCoercible(that));
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

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype : null;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if (!has(IteratorPrototype, ITERATOR$3)) hide(IteratorPrototype, ITERATOR$3, returnThis);

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var defineProperty = objectDefineProperty.f;



	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$1)) {
	    defineProperty(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var validateSetPrototypeOfArguments = function (O, proto) {
	  anObject(O);
	  if (!isObject(proto) && proto !== null) {
	    throw TypeError("Can't set " + String(proto) + ' as a prototype');
	  }
	};

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var correctSetter = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    correctSetter = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    validateSetPrototypeOfArguments(O, proto);
	    if (correctSetter) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
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
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          hide(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
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
	    hide(IterablePrototype, ITERATOR$4, defaultIterator);
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
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var STRING_ITERATOR = 'String Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = stringAt(string, index, true);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	// 0 -> Array#forEach
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	// 1 -> Array#map
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// 2 -> Array#filter
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// 3 -> Array#some
	// https://tc39.github.io/ecma262/#sec-array.prototype.some
	// 4 -> Array#every
	// https://tc39.github.io/ecma262/#sec-array.prototype.every
	// 5 -> Array#find
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	// 6 -> Array#findIndex
	// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	var arrayMethods = function (TYPE, specificCreate) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = specificCreate || arraySpeciesCreate;
	  return function ($this, callbackfn, that) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = bindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: target.push(value);       // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var sloppyArrayMethod = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !method || !fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var internalForEach = arrayMethods(0);
	var SLOPPY_METHOD = sloppyArrayMethod('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = SLOPPY_METHOD ? function forEach(callbackfn /* , thisArg */) {
	  return internalForEach(this, callbackfn, arguments[1]);
	} : [].forEach;

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    hide(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	// Setup tab focus
	var container = document.getElementById('container');
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
	    var CustomEvent = function CustomEvent(event, params) {
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
	            get: function get() {
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

	var f$5 = wellKnownSymbol;

	var wrappedWellKnownSymbol = {
		f: f$5
	};

	var path = global_1;

	var defineProperty$1 = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty$1(Symbol, NAME, {
	    value: wrappedWellKnownSymbol.f(NAME)
	  });
	};

	// all enumerable object keys, includes symbols
	var enumKeys = function (it) {
	  var result = objectKeys(it);
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  if (getOwnPropertySymbols) {
	    var symbols = getOwnPropertySymbols(it);
	    var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (propertyIsEnumerable.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$6 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$6
	};

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(SYMBOL);
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var $Symbol = global_1.Symbol;
	var JSON$1 = global_1.JSON;
	var nativeJSONStringify = JSON$1 && JSON$1.stringify;
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var SymbolRegistry = shared('symbol-registry');
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var WellKnownSymbolsStore = shared('wks');
	var ObjectPrototype$1 = Object[PROTOTYPE$1];
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, key);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[key];
	  nativeDefineProperty$1(it, key, D);
	  if (ObjectPrototypeDescriptor && it !== ObjectPrototype$1) {
	    nativeDefineProperty$1(ObjectPrototype$1, key, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState$1(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = nativeSymbol && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) nativeDefineProperty$1(it, HIDDEN, createPropertyDescriptor(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = objectCreate(D, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(it, key, D);
	  } return nativeDefineProperty$1(it, key, D);
	};

	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIndexedObject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};

	var $create = function create(it, P) {
	  return P === undefined ? objectCreate(it) : $defineProperties(objectCreate(it), P);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = nativePropertyIsEnumerable$1.call(this, key = toPrimitive(key, true));
	  if (this === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIndexedObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var D = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && !has(hiddenKeys, key)) result.push(key);
	  } return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectPrototype$1;
	  var names = nativeGetOwnPropertyNames$1(IS_OP ? ObjectPrototypeSymbols : toIndexedObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectPrototype$1, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };
	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState$1(this).tag;
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$1(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype$1, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }

	  wrappedWellKnownSymbol.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	for (var wellKnownSymbols = objectKeys(WellKnownSymbolsStore), k = 0; wellKnownSymbols.length > k;) {
	  defineWellKnownSymbol(wellKnownSymbols[k++]);
	}

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	JSON$1 && _export({ target: 'JSON', stat: true, forced: !nativeSymbol || fails(function () {
	  var symbol = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  return nativeJSONStringify([symbol]) != '[null]'
	    // WebKit converts symbol values to JSON as null
	    || nativeJSONStringify({ a: symbol }) != '{}'
	    // V8 throws on boxed symbols
	    || nativeJSONStringify(Object(symbol)) != '{}';
	}) }, {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!isArray(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return nativeJSONStringify.apply(JSON$1, args);
	  }
	});

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) hide($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	var defineProperty$2 = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;

	if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$2(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Symbol.iterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$2 = internalState.set;
	var getInternalState$2 = internalState.getterFor(ARRAY_ITERATOR);

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
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$2(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
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
	iterators.Arguments = iterators.Array;

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var SLOPPY_METHOD$1 = sloppyArrayMethod('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || SLOPPY_METHOD$1 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  return !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$2] = 'z';

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = String(test) !== '[object z]' ? function toString() {
	  return '[object ' + classof(this) + ']';
	} : test.toString;

	var ObjectPrototype$2 = Object.prototype;

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (objectToString !== ObjectPrototype$2.toString) {
	  redefine(ObjectPrototype$2, 'toString', objectToString, { unsafe: true });
	}

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING = 'toString';
	var nativeToString = /./[TO_STRING];
	var RegExpPrototype = RegExp.prototype;

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(re, str);

	    if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	var SPECIES$3 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;
	    re.exec = function () { execCalled = true; return null; };

	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$3] = function () { return re; };
	    }

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	    if (sham) hide(RegExp.prototype[SYMBOL], 'sham', true);
	  }
	};

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? stringAt(S, index, true).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	var max$2 = Math.max;
	var min$2 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max$2(min$2(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	// `SameValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-samevalue
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// @@search logic
	fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = requireObjectCoercible(this);
	      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
	      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
	    function (regexp) {
	      var res = maybeCallNative(nativeSearch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
	      var result = regexpExecAbstract(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

	var SPECIES$4 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction(S);
	};

	var arrayPush = [].push;
	var min$3 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output.length > lim ? output.slice(0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);
	      var C = speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (SUPPORTS_Y ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = min$3(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	}, !SUPPORTS_Y);

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global_1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  if (CollectionPrototype$1) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues) try {
	      hide(CollectionPrototype$1, ITERATOR$5, ArrayValues);
	    } catch (error) {
	      CollectionPrototype$1[ITERATOR$5] = ArrayValues;
	    }
	    if (!CollectionPrototype$1[TO_STRING_TAG$3]) hide(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
	    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        hide(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	var ITERATOR$6 = wellKnownSymbol('iterator');

	var nativeUrl = !fails(function () {
	  var url = new URL('b?e=1', 'http://a');
	  var searchParams = url.searchParams;
	  url.pathname = 'c%20d';
	  return (isPure && !url.toJSON)
	    || !searchParams.sort
	    || url.href !== 'http://a/c%20d?e=1'
	    || searchParams.get('e') !== '1'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !searchParams[ITERATOR$6]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('http://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('http://a#б').hash !== '#%D0%B1';
	});

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	var nativeAssign = Object.assign;

	// 19.1.2.1 Object.assign(target, source, ...)
	// should work with symbols and should have deterministic property order (V8 bug)
	var objectAssign = !nativeAssign || fails(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
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
	var floor$2 = Math.floor;
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
	  delta = firstTime ? floor$2(delta / damp) : delta >> 1;
	  delta += floor$2(delta / numPoints);
	  for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
	    delta = floor$2(delta / baseMinusTMin);
	  }
	  return floor$2(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	// eslint-disable-next-line  max-statements
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
	    if (m - n > floor$2((maxInt - delta) / handledCPCountPlusOne)) {
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
	          if (q < t) {
	            break;
	          }
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
	          q = floor$2(qMinusT / baseMinusT);
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

	var punycodeToAscii = function (input) {
	  var encoded = [];
	  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
	  }
	  return encoded.join('.');
	};

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

	var ITERATOR$7 = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState$3 = internalState.set;
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
	    var i = 0;
	    var attribute, entry;
	    while (i < attributes.length) {
	      attribute = attributes[i++];
	      if (attribute.length) {
	        entry = attribute.split('=');
	        result.push({
	          key: deserialize(entry.shift()),
	          value: deserialize(entry.join('='))
	        });
	      }
	    }
	  } return result;
	};

	var updateSearchParams = function (query) {
	  this.entries.length = 0;
	  parseSearchParams(this.entries, query);
	};

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw TypeError('Not enough arguments');
	};

	var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
	  setInternalState$3(this, {
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
	  var iteratorMethod, iterator, step, entryIterator, first, second, key;

	  setInternalState$3(that, {
	    type: URL_SEARCH_PARAMS,
	    entries: entries,
	    updateURL: null,
	    updateSearchParams: updateSearchParams
	  });

	  if (init !== undefined) {
	    if (isObject(init)) {
	      iteratorMethod = getIteratorMethod(init);
	      if (typeof iteratorMethod === 'function') {
	        iterator = iteratorMethod.call(init);
	        while (!(step = iterator.next()).done) {
	          entryIterator = getIterator(anObject(step.value));
	          if (
	            (first = entryIterator.next()).done ||
	            (second = entryIterator.next()).done ||
	            !entryIterator.next().done
	          ) throw TypeError('Expected sequence with length 2');
	          entries.push({ key: first.value + '', value: second.value + '' });
	        }
	      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
	    } else {
	      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
	    }
	  }
	};

	var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

	redefineAll(URLSearchParamsPrototype, {
	  // `URLSearchParams.prototype.appent` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    validateArgumentsLength(arguments.length, 2);
	    var state = getInternalParamsState(this);
	    state.entries.push({ key: name + '', value: value + '' });
	    if (state.updateURL) state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var key = name + '';
	    var i = 0;
	    while (i < entries.length) {
	      if (entries[i].key === key) entries.splice(i, 1);
	      else i++;
	    }
	    if (state.updateURL) state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var i = 0;
	    for (; i < entries.length; i++) if (entries[i].key === key) return entries[i].value;
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var result = [];
	    var i = 0;
	    for (; i < entries.length; i++) if (entries[i].key === key) result.push(entries[i].value);
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var i = 0;
	    while (i < entries.length) if (entries[i++].key === key) return true;
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
	    var i = 0;
	    var entry;
	    for (; i < entries.length; i++) {
	      entry = entries[i];
	      if (entry.key === key) {
	        if (found) entries.splice(i--, 1);
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) entries.push({ key: key, value: val });
	    if (state.updateURL) state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    // Array#sort is not stable in some engines
	    var slice = entries.slice();
	    var entry, i, j;
	    entries.length = 0;
	    for (i = 0; i < slice.length; i++) {
	      entry = slice[i];
	      for (j = 0; j < i; j++) if (entries[j].key > entry.key) {
	        entries.splice(j, 0, entry);
	        break;
	      }
	      if (j === i) entries.push(entry);
	    }
	    if (state.updateURL) state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = bindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
	    var i = 0;
	    var entry;
	    while (i < entries.length) {
	      entry = entries[i++];
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
	redefine(URLSearchParamsPrototype, ITERATOR$7, URLSearchParamsPrototype.entries);

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	redefine(URLSearchParamsPrototype, 'toString', function toString() {
	  var entries = getInternalParamsState(this).entries;
	  var result = [];
	  var i = 0;
	  var entry;
	  while (i < entries.length) {
	    entry = entries[i++];
	    result.push(serialize(entry.key) + '=' + serialize(entry.value));
	  } return result.join('&');
	}, { enumerable: true });

	setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

	_export({ global: true, forced: !nativeUrl }, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	var web_urlSearchParams = {
	  URLSearchParams: URLSearchParamsConstructor,
	  getState: getInternalParamsState
	};

	var NativeURL = global_1.URL;
	var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
	var getInternalSearchParamsState = web_urlSearchParams.getState;
	var setInternalState$4 = internalState.set;
	var getInternalURLState = internalState.getterFor('URL');
	var pow = Math.pow;

	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';

	var ALPHA = /[A-Za-z]/;
	var ALPHANUMERIC = /[\d+\-.A-Za-z]/;
	var DIGIT = /\d/;
	var HEX_START = /^(0x|0X)/;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\dA-Fa-f]+$/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
	// eslint-disable-next-line no-control-regex
	var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
	var EOF;

	var parseHost = function (url, input) {
	  var result, codePoints, i;
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
	    for (i = 0; i < codePoints.length; i++) result += percentEncode(codePoints[i], C0ControlPercentEncodeSet);
	    url.host = result;
	  } else {
	    input = punycodeToAscii(input);
	    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
	    result = parseIPv4(input);
	    if (result === null) return INVALID_HOST;
	    url.host = result;
	  }
	};

	var parseIPv4 = function (input) {
	  var parts = input.split('.');
	  var partsLength, numbers, i, part, R, n, ipv4;
	  if (parts[parts.length - 1] == '') {
	    if (parts.length) parts.pop();
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) return input;
	  numbers = [];
	  for (i = 0; i < partsLength; i++) {
	    part = parts[i];
	    if (part == '') return input;
	    R = 10;
	    if (part.length > 1 && part.charAt(0) == '0') {
	      R = HEX_START.test(part) ? 16 : 8;
	      part = part.slice(R == 8 ? 1 : 2);
	    }
	    if (part === '') {
	      n = 0;
	    } else {
	      if (!(R == 10 ? DEC : R == 8 ? OCT : HEX).test(part)) return input;
	      n = parseInt(part, R);
	    }
	    numbers.push(n);
	  }
	  for (i = 0; i < partsLength; i++) {
	    n = numbers[i];
	    if (i == partsLength - 1) {
	      if (n >= pow(256, 5 - partsLength)) return null;
	    } else if (n > 255) return null;
	  }
	  ipv4 = numbers.pop();
	  for (i = 0; i < numbers.length; i++) {
	    ipv4 += numbers[i] * pow(256, 3 - i);
	  }
	  return ipv4;
	};

	// eslint-disable-next-line max-statements
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
	  var i = 0;
	  for (; i < 8; i++) {
	    if (ipv6[i] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) currStart = i;
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
	  var result, i, compress, ignore0;
	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (i = 0; i < 4; i++) {
	      result.unshift(host % 256);
	      host = Math.floor(host / 256);
	    } return result.join('.');
	  // ipv6
	  } else if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence(host);
	    for (i = 0; i < 8; i++) {
	      if (ignore0 && host[i] === 0) continue;
	      if (ignore0) ignore0 = false;
	      if (compress === i) {
	        result += i ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += host[i].toString(16);
	        if (i < 7) result += ':';
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
	  var code = stringAt(char, 0);
	  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
	};

	var specialSchemes = {
	  ftp: 21,
	  file: null,
	  gopher: 70,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	var isSpecial = function (url) {
	  return has(specialSchemes, url.scheme);
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

	// eslint-disable-next-line max-statements
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
	          if (stateOverride) {
	            if (
	              (isSpecial(url) != has(specialSchemes, buffer)) ||
	              (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
	              (url.scheme == 'file' && !url.host)
	            ) return;
	          }
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
	  var state = setInternalState$4(that, { type: 'URL' });
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
	  // eslint-disable-next-line no-unused-vars
	  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
	    return nativeCreateObjectURL.apply(NativeURL, arguments);
	  });
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  // eslint-disable-next-line no-unused-vars
	  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
	    return nativeRevokeObjectURL.apply(NativeURL, arguments);
	  });
	}

	setToStringTag(URLConstructor, 'URL');

	_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
	  URL: URLConstructor
	});

	function _typeof(obj) {
	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

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

	(function (global) {
	  /**
	   * Polyfill URLSearchParams
	   *
	   * Inspired from : https://github.com/WebReflection/url-search-params/blob/master/src/url-search-params.js
	   */
	  var checkIfIteratorIsSupported = function checkIfIteratorIsSupported() {
	    try {
	      return !!Symbol.iterator;
	    } catch (error) {
	      return false;
	    }
	  };

	  var iteratorSupported = checkIfIteratorIsSupported();

	  var createIterator = function createIterator(items) {
	    var iterator = {
	      next: function next() {
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


	  var serializeParam = function serializeParam(value) {
	    return encodeURIComponent(value).replace(/%20/g, '+');
	  };

	  var deserializeParam = function deserializeParam(value) {
	    return decodeURIComponent(String(value).replace(/\+/g, ' '));
	  };

	  var polyfillURLSearchParams = function polyfillURLSearchParams() {
	    var URLSearchParams = function URLSearchParams(searchString) {
	      Object.defineProperty(this, '_entries', {
	        writable: true,
	        value: {}
	      });

	      var typeofSearchString = _typeof(searchString);

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

	  if (!('URLSearchParams' in global) || new global.URLSearchParams('?a=1').toString() !== 'a=1') {
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
	      value: function value(searchString) {
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
	  var checkIfURLIsSupported = function checkIfURLIsSupported() {
	    try {
	      var u = new global.URL('b', 'http://a');
	      u.pathname = 'c%20d';
	      return u.href === 'http://a/c%20d' && u.searchParams;
	    } catch (e) {
	      return false;
	    }
	  };

	  var polyfillURL = function polyfillURL() {
	    var _URL = global.URL;

	    var URL = function URL(url, base) {
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

	      if (anchorElement.protocol === ':' || !/:/.test(anchorElement.href)) {
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
	        value: function value() {
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

	    var linkURLWithAnchorAttribute = function linkURLWithAnchorAttribute(attributeName) {
	      Object.defineProperty(proto, attributeName, {
	        get: function get() {
	          return this._anchorElement[attributeName];
	        },
	        set: function set(value) {
	          this._anchorElement[attributeName] = value;
	        },
	        enumerable: true
	      });
	    };

	    ['hash', 'host', 'hostname', 'port', 'protocol'].forEach(function (attributeName) {
	      linkURLWithAnchorAttribute(attributeName);
	    });
	    Object.defineProperty(proto, 'search', {
	      get: function get() {
	        return this._anchorElement['search'];
	      },
	      set: function set(value) {
	        this._anchorElement['search'] = value;

	        this._updateSearchParams();
	      },
	      enumerable: true
	    });
	    Object.defineProperties(proto, {
	      'toString': {
	        get: function get() {
	          var _this = this;

	          return function () {
	            return _this.href;
	          };
	        }
	      },
	      'href': {
	        get: function get() {
	          return this._anchorElement.href.replace(/\?$/, '');
	        },
	        set: function set(value) {
	          this._anchorElement.href = value;

	          this._updateSearchParams();
	        },
	        enumerable: true
	      },
	      'pathname': {
	        get: function get() {
	          return this._anchorElement.pathname.replace(/(^\/?)/, '/');
	        },
	        set: function set(value) {
	          this._anchorElement.pathname = value;
	        },
	        enumerable: true
	      },
	      'origin': {
	        get: function get() {
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
	        get: function get() {
	          return '';
	        },
	        set: function set(value) {},
	        enumerable: true
	      },
	      'username': {
	        // TODO
	        get: function get() {
	          return '';
	        },
	        set: function set(value) {},
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
	    var getOrigin = function getOrigin() {
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

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	var IS_CONCAT_SPREADABLE_SUPPORT = !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT$1;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	// `Array.prototype.fill` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill
	var arrayFill = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject(this);
	  var length = toLength(O.length);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	// `Array.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill
	_export({ target: 'Array', proto: true }, { fill: arrayFill });

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('fill');

	var defineProperty$3 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$3(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var aFunction$1 = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var SPECIES$5 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var C = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;
	  if (descriptors && C && !C[SPECIES$5]) defineProperty(C, SPECIES$5, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	var iterate = createCommonjsModule(function (module) {
	var BREAK = {};

	var exports = module.exports = function (iterable, fn, that, ENTRIES, ITERATOR) {
	  var boundFunction = bindContext(fn, that, ENTRIES ? 2 : 1);
	  var iterator, iterFn, index, length, result, step;

	  if (ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = toLength(iterable.length); length > index; index++) {
	        result = ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
	        if (result === BREAK) return BREAK;
	      } return;
	    }
	    iterator = iterFn.call(iterable);
	  }

	  while (!(step = iterator.next()).done) {
	    if (callWithSafeIterationClosing(iterator, boundFunction, step.value, ENTRIES) === BREAK) return BREAK;
	  }
	};

	exports.BREAK = BREAK;
	});

	var location = global_1.location;
	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process = global_1.process;
	var MessageChannel = global_1.MessageChannel;
	var Dispatch = global_1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(id + '', location.protocol + '//' + location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (classofRaw(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = bindContext(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post)) {
	    defer = post;
	    global_1.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set$1,
	  clear: clear
	};

	var navigator$1 = global_1.navigator;

	var userAgent = navigator$1 && navigator$1.userAgent || '';

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

	var macrotask = task.set;


	var MutationObserver$1 = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var process$1 = global_1.process;
	var Promise$1 = global_1.Promise;
	var IS_NODE = classofRaw(process$1) == 'process';
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify, toggle, node, promise;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE && (parent = process$1.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (IS_NODE) {
	    notify = function () {
	      process$1.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  } else if (MutationObserver$1 && !/(iphone|ipod|ipad).*applewebkit/i.test(userAgent)) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver$1(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    notify = function () {
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global_1, flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify();
	  } last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject = aFunction(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	var f$7 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$7
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;
	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var task$1 = task.set;










	var SPECIES$6 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState$3 = internalState.get;
	var setInternalState$5 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = global_1[PROMISE];
	var TypeError$1 = global_1.TypeError;
	var document$3 = global_1.document;
	var process$2 = global_1.process;
	var $fetch = global_1.fetch;
	var versions = process$2 && process$2.versions;
	var v8 = versions && versions.v8 || '';
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var IS_NODE$1 = classofRaw(process$2) == 'process';
	var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper;

	var FORCED$1 = isForced_1(PROMISE, function () {
	  // correct subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);
	  var empty = function () { /* empty */ };
	  var FakePromise = (promise.constructor = {})[SPECIES$6] = function (exec) {
	    exec(empty, empty);
	  };
	  // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  return !((IS_NODE$1 || typeof PromiseRejectionEvent == 'function')
	    && (!isPure || promise['finally'])
	    && promise.then(empty) instanceof FakePromise
	    // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // we can't detect it synchronously, so just check versions
	    && v8.indexOf('6.6') !== 0
	    && userAgent.indexOf('Chrome/66') === -1);
	});

	var INCORRECT_ITERATION$1 = FORCED$1 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$1 = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
	            state.rejection = HANDLED;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // may throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(promise, state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$3.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (handler = global_1['on' + name]) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (IS_NODE$1) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    if (IS_NODE$1) {
	      process$2.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify$1(promise, state, true);
	};

	var internalResolve = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          then.call(value,
	            bind(internalResolve, promise, wrapper, state),
	            bind(internalReject, promise, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify$1(promise, state, false);
	    }
	  } catch (error) {
	    internalReject(promise, { done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$1) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction(executor);
	    Internal.call(this);
	    var state = getInternalState$3(this);
	    try {
	      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    setInternalState$5(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$1 ? process$2.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$3(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, promise, state);
	    this.reject = bind(internalReject, promise, state);
	  };
	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  // wrap fetch result
	  if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
	    // eslint-disable-next-line no-unused-vars
	    fetch: function fetch(input) {
	      return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
	    }
	  });
	}

	_export({ global: true, wrap: true, forced: FORCED$1 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = path[PROMISE];

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED$1 }, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced: FORCED$1 }, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve(this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction(C.resolve);
	      iterate(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var max$3 = Math.max;
	var min$4 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	var SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('splice');

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$2 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$4(max$3(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	var internalFilter = arrayMethods(2);
	var SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$3 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return internalFilter(this, callbackfn, arguments[1]);
	  }
	});

	var internalMap = arrayMethods(1);
	var SPECIES_SUPPORT$4 = arrayMethodHasSpeciesSupport('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$4 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return internalMap(this, callbackfn, arguments[1]);
	  }
	});

	var defineProperty$4 = objectDefineProperty.f;





	var DataView = global_1.DataView;
	var DataViewPrototype = DataView && DataView.prototype;
	var Int8Array$1 = global_1.Int8Array;
	var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
	var Uint8ClampedArray = global_1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
	var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
	var ObjectPrototype$3 = Object.prototype;
	var isPrototypeOf = ObjectPrototype$3.isPrototypeOf;

	var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	var NATIVE_ARRAY_BUFFER = !!(global_1.ArrayBuffer && global_1.DataView);
	var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!objectSetPrototypeOf;
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME$1;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var isView = function isView(it) {
	  var klass = classof(it);
	  return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
	};

	var isTypedArray = function (it) {
	  return isObject(it) && has(TypedArrayConstructorsList, classof(it));
	};

	var aTypedArray = function (it) {
	  if (isTypedArray(it)) return it;
	  throw TypeError('Target is not a typed array');
	};

	var aTypedArrayConstructor = function (C) {
	  if (objectSetPrototypeOf) {
	    if (isPrototypeOf.call(TypedArray, C)) return C;
	  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME$1)) {
	    var TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
	      return C;
	    }
	  } throw TypeError('Target is not a typed array constructor');
	};

	var exportProto = function (KEY, property, forced) {
	  if (!descriptors) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
	      delete TypedArrayConstructor.prototype[KEY];
	    }
	  }
	  if (!TypedArrayPrototype[KEY] || forced) {
	    redefine(TypedArrayPrototype, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
	  }
	};

	var exportStatic = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!descriptors) return;
	  if (objectSetPrototypeOf) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global_1[ARRAY];
	      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
	        delete TypedArrayConstructor[KEY];
	      }
	    }
	    if (!TypedArray[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
	      } catch (error) { /* empty */ }
	    } else return;
	  }
	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      redefine(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME$1 in TypedArrayConstructorsList) {
	  if (!global_1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow
	  TypedArray = function TypedArray() {
	    throw TypeError('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1], TypedArray);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$3) {
	  TypedArrayPrototype = TypedArray.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype);
	  }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
	  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
	}

	if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$4)) {
	  TYPED_ARRAY_TAG_REQIRED = true;
	  defineProperty$4(TypedArrayPrototype, TO_STRING_TAG$4, { get: function () {
	    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
	  } });
	  for (NAME$1 in TypedArrayConstructorsList) if (global_1[NAME$1]) {
	    hide(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
	  }
	}

	// WebKit bug - the same parent prototype for typed arrays and data view
	if (NATIVE_ARRAY_BUFFER && objectSetPrototypeOf && objectGetPrototypeOf(DataViewPrototype) !== ObjectPrototype$3) {
	  objectSetPrototypeOf(DataViewPrototype, ObjectPrototype$3);
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER: NATIVE_ARRAY_BUFFER,
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
	  aTypedArray: aTypedArray,
	  aTypedArrayConstructor: aTypedArrayConstructor,
	  exportProto: exportProto,
	  exportStatic: exportStatic,
	  isView: isView,
	  isTypedArray: isTypedArray,
	  TypedArray: TypedArray,
	  TypedArrayPrototype: TypedArrayPrototype
	};

	// `ToIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-toindex
	var toIndex = function (it) {
	  if (it === undefined) return 0;
	  var number = toInteger(it);
	  var length = toLength(number);
	  if (number !== length) throw RangeError('Wrong length or index');
	  return length;
	};

	var arrayBuffer = createCommonjsModule(function (module, exports) {


	var NATIVE_ARRAY_BUFFER = arrayBufferViewCore.NATIVE_ARRAY_BUFFER;







	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var defineProperty = objectDefineProperty.f;




	var getInternalState = internalState.get;
	var setInternalState = internalState.set;
	var ARRAY_BUFFER = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE = 'prototype';
	var WRONG_LENGTH = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer = global_1[ARRAY_BUFFER];
	var $ArrayBuffer = NativeArrayBuffer;
	var $DataView = global_1[DATA_VIEW];
	var Math = global_1.Math;
	var RangeError = global_1.RangeError;
	// eslint-disable-next-line no-shadow-restricted-names
	var Infinity = 1 / 0;
	var abs = Math.abs;
	var pow = Math.pow;
	var floor = Math.floor;
	var log = Math.log;
	var LN2 = Math.LN2;

	// IEEE754 conversions based on https://github.com/feross/ieee754
	var packIEEE754 = function (number, mantissaLength, bytes) {
	  var buffer = new Array(bytes);
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
	  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	  var index = 0;
	  var exponent, mantissa, c;
	  number = abs(number);
	  // eslint-disable-next-line no-self-compare
	  if (number != number || number === Infinity) {
	    // eslint-disable-next-line no-self-compare
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor(log(number) / LN2);
	    if (number * (c = pow(2, -exponent)) < 1) {
	      exponent--;
	      c *= 2;
	    }
	    if (exponent + eBias >= 1) {
	      number += rt / c;
	    } else {
	      number += rt * pow(2, 1 - eBias);
	    }
	    if (number * c >= 2) {
	      exponent++;
	      c /= 2;
	    }
	    if (exponent + eBias >= eMax) {
	      mantissa = 0;
	      exponent = eMax;
	    } else if (exponent + eBias >= 1) {
	      mantissa = (number * c - 1) * pow(2, mantissaLength);
	      exponent = exponent + eBias;
	    } else {
	      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
	      exponent = 0;
	    }
	  }
	  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
	  exponent = exponent << mantissaLength | mantissa;
	  exponentLength += mantissaLength;
	  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
	  buffer[--index] |= sign * 128;
	  return buffer;
	};

	var unpackIEEE754 = function (buffer, mantissaLength) {
	  var bytes = buffer.length;
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var nBits = exponentLength - 7;
	  var index = bytes - 1;
	  var sign = buffer[index--];
	  var exponent = sign & 127;
	  var mantissa;
	  sign >>= 7;
	  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
	  mantissa = exponent & (1 << -nBits) - 1;
	  exponent >>= -nBits;
	  nBits += mantissaLength;
	  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
	  if (exponent === 0) {
	    exponent = 1 - eBias;
	  } else if (exponent === eMax) {
	    return mantissa ? NaN : sign ? -Infinity : Infinity;
	  } else {
	    mantissa = mantissa + pow(2, mantissaLength);
	    exponent = exponent - eBias;
	  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
	};

	var unpackInt32 = function (buffer) {
	  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	};

	var packInt8 = function (number) {
	  return [number & 0xFF];
	};

	var packInt16 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF];
	};

	var packInt32 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	};

	var packFloat32 = function (number) {
	  return packIEEE754(number, 23, 4);
	};

	var packFloat64 = function (number) {
	  return packIEEE754(number, 52, 8);
	};

	var addGetter = function (Constructor, key) {
	  defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
	};

	var get = function (view, count, index, isLittleEndian) {
	  var numIndex = +index;
	  var intIndex = toIndex(numIndex);
	  var store = getInternalState(view);
	  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
	  var bytes = getInternalState(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = bytes.slice(start, start + count);
	  return isLittleEndian ? pack : pack.reverse();
	};

	var set = function (view, count, index, conversion, value, isLittleEndian) {
	  var numIndex = +index;
	  var intIndex = toIndex(numIndex);
	  var store = getInternalState(view);
	  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
	  var bytes = getInternalState(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	};

	if (!NATIVE_ARRAY_BUFFER) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
	    var byteLength = toIndex(length);
	    setInternalState(this, {
	      bytes: arrayFill.call(new Array(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!descriptors) this.byteLength = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance(this, $DataView, DATA_VIEW);
	    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = getInternalState(buffer).byteLength;
	    var offset = toInteger(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
	    setInternalState(this, {
	      buffer: buffer,
	      byteLength: byteLength,
	      byteOffset: offset
	    });
	    if (!descriptors) {
	      this.buffer = buffer;
	      this.byteLength = byteLength;
	      this.byteOffset = offset;
	    }
	  };

	  if (descriptors) {
	    addGetter($ArrayBuffer, 'byteLength');
	    addGetter($DataView, 'buffer');
	    addGetter($DataView, 'byteLength');
	    addGetter($DataView, 'byteOffset');
	  }

	  redefineAll($DataView[PROTOTYPE], {
	    getInt8: function getInt8(byteOffset) {
	      return get(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get(this, 4, byteOffset, arguments[1]));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get(this, 4, byteOffset, arguments[1])) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set(this, 1, byteOffset, packInt8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set(this, 1, byteOffset, packInt8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packInt16, value, arguments[2]);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packInt16, value, arguments[2]);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packInt32, value, arguments[2]);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packInt32, value, arguments[2]);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packFloat32, value, arguments[2]);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set(this, 8, byteOffset, packFloat64, value, arguments[2]);
	    }
	  });
	} else {
	  if (!fails(function () {
	    NativeArrayBuffer(1);
	  }) || !fails(function () {
	    new NativeArrayBuffer(-1); // eslint-disable-line no-new
	  }) || fails(function () {
	    new NativeArrayBuffer(); // eslint-disable-line no-new
	    new NativeArrayBuffer(1.5); // eslint-disable-line no-new
	    new NativeArrayBuffer(NaN); // eslint-disable-line no-new
	    return NativeArrayBuffer.name != ARRAY_BUFFER;
	  })) {
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance(this, $ArrayBuffer);
	      return new NativeArrayBuffer(toIndex(length));
	    };
	    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE];
	    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
	      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, NativeArrayBuffer[key]);
	    }
	    ArrayBufferPrototype.constructor = $ArrayBuffer;
	  }
	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var nativeSetInt8 = $DataView[PROTOTYPE].setInt8;
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
	    setInt8: function setInt8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, { unsafe: true });
	}

	setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	setToStringTag($DataView, DATA_VIEW);
	exports[ARRAY_BUFFER] = $ArrayBuffer;
	exports[DATA_VIEW] = $DataView;
	});

	var ArrayBuffer = arrayBuffer.ArrayBuffer;
	var DataView$1 = arrayBuffer.DataView;
	var nativeArrayBufferSlice = ArrayBuffer.prototype.slice;

	var INCORRECT_SLICE = fails(function () {
	  return !new ArrayBuffer(2).slice(1, undefined).byteLength;
	});

	// `ArrayBuffer.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
	_export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
	  slice: function slice(start, end) {
	    if (nativeArrayBufferSlice !== undefined && end === undefined) {
	      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
	    }
	    var length = anObject(this).byteLength;
	    var first = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    var result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first));
	    var viewSource = new DataView$1(this);
	    var viewTarget = new DataView$1(result);
	    var index = 0;
	    while (first < fin) {
	      viewTarget.setUint8(index++, viewSource.getUint8(first++));
	    } return result;
	  }
	});

	var nativeIsFrozen = Object.isFrozen;
	var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeIsFrozen(1); });

	// `Object.isFrozen` method
	// https://tc39.github.io/ecma262/#sec-object.isfrozen
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
	  isFrozen: function isFrozen(it) {
	    return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
	  }
	});

	var inheritIfRequired = function (that, target, C) {
	  var S = target.constructor;
	  var P;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && objectSetPrototypeOf) {
	    objectSetPrototypeOf(that, P);
	  } return that;
	};

	var defineProperty$5 = objectDefineProperty.f;
	var getOwnPropertyNames = objectGetOwnPropertyNames.f;







	var MATCH$2 = wellKnownSymbol('match');
	var NativeRegExp = global_1.RegExp;
	var RegExpPrototype$1 = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var FORCED$2 = isForced_1('RegExp', descriptors && (!CORRECT_NEW || fails(function () {
	  re2[MATCH$2] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor
	if (FORCED$2) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    return !thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined ? pattern
	      : inheritIfRequired(CORRECT_NEW
	        ? new NativeRegExp(patternIsRegExp && !flagsAreUndefined ? pattern.source : pattern, flags)
	        : NativeRegExp((patternIsRegExp = pattern instanceof RegExpWrapper)
	          ? pattern.source
	          : pattern, patternIsRegExp && flagsAreUndefined ? regexpFlags.call(pattern) : flags)
	      , thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);
	  };
	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$5(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys$1 = getOwnPropertyNames(NativeRegExp);
	  var i = 0;
	  while (i < keys$1.length) proxy(keys$1[i++]);
	  RegExpPrototype$1.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$1;
	  redefine(global_1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	/* eslint-disable no-new */



	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$1 = global_1.ArrayBuffer;
	var Int8Array$2 = global_1.Int8Array;

	var typedArraysConstructorsRequiresWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails(function () {
	  Int8Array$2(1);
	}) || !fails(function () {
	  new Int8Array$2(-1);
	}) || !checkCorrectnessOfIteration(function (iterable) {
	  new Int8Array$2();
	  new Int8Array$2(null);
	  new Int8Array$2(1.5);
	  new Int8Array$2(iterable);
	}, true) || fails(function () {
	  // Safari 11 bug
	  return new Int8Array$2(new ArrayBuffer$1(2), 1, undefined).length !== 1;
	});

	var toOffset = function (it, BYTES) {
	  var offset = toInteger(it);
	  if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset');
	  return offset;
	};

	var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

	var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
	  var O = toObject(source);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var i, length, result, step, iterator;
	  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
	    iterator = iteratorMethod.call(O);
	    O = [];
	    while (!(step = iterator.next()).done) {
	      O.push(step.value);
	    }
	  }
	  if (mapping && argumentsLength > 2) {
	    mapfn = bindContext(mapfn, arguments[2], 2);
	  }
	  length = toLength(O.length);
	  result = new (aTypedArrayConstructor$1(this))(length);
	  for (i = 0; length > i; i++) {
	    result[i] = mapping ? mapfn(O[i], i) : O[i];
	  }
	  return result;
	};

	var typedArrayConstructor = createCommonjsModule(function (module) {


















	var getOwnPropertyNames = objectGetOwnPropertyNames.f;







	var getInternalState = internalState.get;
	var setInternalState = internalState.set;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var forEach = arrayMethods(0);
	var RangeError = global_1.RangeError;
	var ArrayBuffer = arrayBuffer.ArrayBuffer;
	var DataView = arrayBuffer.DataView;
	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
	var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
	var TypedArray = arrayBufferViewCore.TypedArray;
	var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
	var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
	var isTypedArray = arrayBufferViewCore.isTypedArray;
	var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	var WRONG_LENGTH = 'Wrong length';

	var fromList = function (C, list) {
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var addGetter = function (it, key) {
	  nativeDefineProperty(it, key, { get: function () {
	    return getInternalState(this)[key];
	  } });
	};

	var isArrayBuffer = function (it) {
	  var klass;
	  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	};

	var isTypedArrayIndex = function (target, key) {
	  return isTypedArray(target)
	    && typeof key != 'symbol'
	    && key in target
	    && String(+key) == String(key);
	};

	var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	  return isTypedArrayIndex(target, key = toPrimitive(key, true))
	    ? createPropertyDescriptor(2, target[key])
	    : nativeGetOwnPropertyDescriptor(target, key);
	};

	var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	  if (isTypedArrayIndex(target, key = toPrimitive(key, true))
	    && isObject(descriptor)
	    && has(descriptor, 'value')
	    && !has(descriptor, 'get')
	    && !has(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!has(descriptor, 'writable') || descriptor.writable)
	    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
	  ) {
	    target[key] = descriptor.value;
	    return target;
	  } return nativeDefineProperty(target, key, descriptor);
	};

	if (descriptors) {
	  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
	    objectDefineProperty.f = wrappedDefineProperty;
	    addGetter(TypedArrayPrototype, 'buffer');
	    addGetter(TypedArrayPrototype, 'byteOffset');
	    addGetter(TypedArrayPrototype, 'byteLength');
	    addGetter(TypedArrayPrototype, 'length');
	  }

	  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
	    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	    defineProperty: wrappedDefineProperty
	  });

	  // eslint-disable-next-line max-statements
	  module.exports = function (TYPE, BYTES, wrapper, CLAMPED) {
	    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + TYPE;
	    var SETTER = 'set' + TYPE;
	    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
	    var TypedArrayConstructor = NativeTypedArrayConstructor;
	    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	    var exported = {};

	    var getter = function (that, index) {
	      var data = getInternalState(that);
	      return data.view[GETTER](index * BYTES + data.byteOffset, true);
	    };

	    var setter = function (that, index, value) {
	      var data = getInternalState(that);
	      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
	      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	    };

	    var addElement = function (that, index) {
	      nativeDefineProperty(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };

	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        var index = 0;
	        var byteOffset = 0;
	        var buffer, byteLength, length;
	        if (!isObject(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new ArrayBuffer(byteLength);
	        } else if (isArrayBuffer(data)) {
	          buffer = data;
	          byteOffset = toOffset(offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	            byteLength = $len - byteOffset;
	            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (isTypedArray(data)) {
	          return fromList(TypedArrayConstructor, data);
	        } else {
	          return typedArrayFrom.call(TypedArrayConstructor, data);
	        }
	        setInternalState(that, {
	          buffer: buffer,
	          byteOffset: byteOffset,
	          byteLength: byteLength,
	          length: length,
	          view: new DataView(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });

	      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
	    } else if (typedArraysConstructorsRequiresWrappers) {
	      TypedArrayConstructor = wrapper(function (that, data, typedArrayOffset, $length) {
	        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
	        if (isArrayBuffer(data)) return $length !== undefined
	          ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
	          : typedArrayOffset !== undefined
	            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
	            : new NativeTypedArrayConstructor(data);
	        if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
	        return typedArrayFrom.call(TypedArrayConstructor, data);
	      });

	      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
	        if (!(key in TypedArrayConstructor)) hide(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	      });
	      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	    }

	    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	      hide(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	    }

	    if (TYPED_ARRAY_TAG) hide(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);

	    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

	    _export({
	      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
	    }, exported);

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	      hide(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	    }

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	      hide(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	    }

	    setSpecies(CONSTRUCTOR_NAME);
	  };
	} else module.exports = function () { /* empty */ };
	});

	// `Uint16Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint16', 2, function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject(this);
	  var len = toLength(O.length);
	  var to = toAbsoluteIndex(target, len);
	  var from = toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};

	var aTypedArray$1 = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
	arrayBufferViewCore.exportProto('copyWithin', function copyWithin(target, start /* , end */) {
	  return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var arrayEvery = arrayMethods(4);
	var aTypedArray$2 = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.every` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
	arrayBufferViewCore.exportProto('every', function every(callbackfn /* , thisArg */) {
	  return arrayEvery(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$3 = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
	// eslint-disable-next-line no-unused-vars
	arrayBufferViewCore.exportProto('fill', function fill(value /* , start, end */) {
	  return arrayFill.apply(aTypedArray$3(this), arguments);
	});

	var arrayFilter = arrayMethods(2);
	var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
	arrayBufferViewCore.exportProto('filter', function filter(callbackfn /* , thisArg */) {
	  var list = arrayFilter(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$2(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	});

	var arrayFind = arrayMethods(5);
	var aTypedArray$5 = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
	arrayBufferViewCore.exportProto('find', function find(predicate /* , thisArg */) {
	  return arrayFind(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var arrayFindIndex = arrayMethods(6);
	var aTypedArray$6 = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
	arrayBufferViewCore.exportProto('findIndex', function findIndex(predicate /* , thisArg */) {
	  return arrayFindIndex(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var arrayForEach$1 = arrayMethods(0);
	var aTypedArray$7 = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
	arrayBufferViewCore.exportProto('forEach', function forEach(callbackfn /* , thisArg */) {
	  arrayForEach$1(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
	var arrayIncludes$1 = arrayIncludes(true);

	// `%TypedArray%.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
	arrayBufferViewCore.exportProto('includes', function includes(searchElement /* , fromIndex */) {
	  return arrayIncludes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
	var arrayIndexOf$1 = arrayIncludes(false);

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
	arrayBufferViewCore.exportProto('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return arrayIndexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ITERATOR$8 = wellKnownSymbol('iterator');
	var Uint8Array = global_1.Uint8Array;
	var arrayValues = es_array_iterator.values;
	var arrayKeys = es_array_iterator.keys;
	var arrayEntries = es_array_iterator.entries;
	var aTypedArray$a = arrayBufferViewCore.aTypedArray;
	var exportProto$1 = arrayBufferViewCore.exportProto;
	var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR$8];

	var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
	  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

	var typedArrayValues = function values() {
	  return arrayValues.call(aTypedArray$a(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
	exportProto$1('entries', function entries() {
	  return arrayEntries.call(aTypedArray$a(this));
	});
	// `%TypedArray%.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
	exportProto$1('keys', function keys() {
	  return arrayKeys.call(aTypedArray$a(this));
	});
	// `%TypedArray%.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
	exportProto$1('values', typedArrayValues, !CORRECT_ITER_NAME);
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportProto$1(ITERATOR$8, typedArrayValues, !CORRECT_ITER_NAME);

	var aTypedArray$b = arrayBufferViewCore.aTypedArray;
	var arrayJoin = [].join;

	// `%TypedArray%.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
	// eslint-disable-next-line no-unused-vars
	arrayBufferViewCore.exportProto('join', function join(separator) {
	  return arrayJoin.apply(aTypedArray$b(this), arguments);
	});

	var nativeLastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var SLOPPY_METHOD$2 = sloppyArrayMethod('lastIndexOf');

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = (NEGATIVE_ZERO || SLOPPY_METHOD$2) ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0;
	  var O = toIndexedObject(this);
	  var length = toLength(O.length);
	  var index = length - 1;
	  if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
	  if (index < 0) index = length + index;
	  for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
	  return -1;
	} : nativeLastIndexOf;

	var aTypedArray$c = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
	// eslint-disable-next-line no-unused-vars
	arrayBufferViewCore.exportProto('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
	});

	var aTypedArray$d = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;

	var internalTypedArrayMap = arrayMethods(1, function (O, length) {
	  return new (aTypedArrayConstructor$3(speciesConstructor(O, O.constructor)))(length);
	});

	// `%TypedArray%.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
	arrayBufferViewCore.exportProto('map', function map(mapfn /* , thisArg */) {
	  return internalTypedArrayMap(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	var arrayReduce = function (that, callbackfn, argumentsLength, memo, isRight) {
	  aFunction(callbackfn);
	  var O = toObject(that);
	  var self = indexedObject(O);
	  var length = toLength(O.length);
	  var index = isRight ? length - 1 : 0;
	  var i = isRight ? -1 : 1;
	  if (argumentsLength < 2) while (true) {
	    if (index in self) {
	      memo = self[index];
	      index += i;
	      break;
	    }
	    index += i;
	    if (isRight ? index < 0 : length <= index) {
	      throw TypeError('Reduce of empty array with no initial value');
	    }
	  }
	  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
	    memo = callbackfn(memo, self[index], index, O);
	  }
	  return memo;
	};

	var aTypedArray$e = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
	arrayBufferViewCore.exportProto('reduce', function reduce(callbackfn /* , initialValue */) {
	  return arrayReduce(aTypedArray$e(this), callbackfn, arguments.length, arguments[1], false);
	});

	var aTypedArray$f = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.reduceRicht` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
	arrayBufferViewCore.exportProto('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  return arrayReduce(aTypedArray$f(this), callbackfn, arguments.length, arguments[1], true);
	});

	var aTypedArray$g = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
	arrayBufferViewCore.exportProto('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$g(that).length;
	  var middle = Math.floor(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var aTypedArray$h = arrayBufferViewCore.aTypedArray;

	var FORCED$3 = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).set({});
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
	arrayBufferViewCore.exportProto('set', function set(arrayLike /* , offset */) {
	  aTypedArray$h(this);
	  var offset = toOffset(arguments[1], 1);
	  var length = this.length;
	  var src = toObject(arrayLike);
	  var len = toLength(src.length);
	  var index = 0;
	  if (len + offset > length) throw RangeError('Wrong length');
	  while (index < len) this[offset + index] = src[index++];
	}, FORCED$3);

	var aTypedArray$i = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
	var arraySlice = [].slice;

	var FORCED$4 = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
	arrayBufferViewCore.exportProto('slice', function slice(start, end) {
	  var list = arraySlice.call(aTypedArray$i(this), start, end);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$4(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	}, FORCED$4);

	var arraySome = arrayMethods(3);
	var aTypedArray$j = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.some` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
	arrayBufferViewCore.exportProto('some', function some(callbackfn /* , thisArg */) {
	  return arraySome(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$k = arrayBufferViewCore.aTypedArray;
	var arraySort = [].sort;

	// `%TypedArray%.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
	arrayBufferViewCore.exportProto('sort', function sort(comparefn) {
	  return arraySort.call(aTypedArray$k(this), comparefn);
	});

	var aTypedArray$l = arrayBufferViewCore.aTypedArray;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
	arrayBufferViewCore.exportProto('subarray', function subarray(begin, end) {
	  var O = aTypedArray$l(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  return new (speciesConstructor(O, O.constructor))(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
	  );
	});

	var Int8Array$3 = global_1.Int8Array;
	var aTypedArray$m = arrayBufferViewCore.aTypedArray;
	var arrayToLocaleString = [].toLocaleString;
	var arraySlice$1 = [].slice;

	// iOS Safari 6.x fails here
	var TO_LOCALE_BUG = !!Int8Array$3 && fails(function () {
	  arrayToLocaleString.call(new Int8Array$3(1));
	});
	var FORCED$5 = fails(function () {
	  return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
	}) || !fails(function () {
	  Int8Array$3.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
	arrayBufferViewCore.exportProto('toLocaleString', function toLocaleString() {
	  return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
	}, FORCED$5);

	var Uint8Array$1 = global_1.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype;
	var arrayToString = [].toString;
	var arrayJoin$1 = [].join;

	if (fails(function () { arrayToString.call({}); })) {
	  arrayToString = function toString() {
	    return arrayJoin$1.call(this);
	  };
	}

	// `%TypedArray%.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
	arrayBufferViewCore.exportProto('toString', arrayToString, (Uint8ArrayPrototype || {}).toString != arrayToString);

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
	  } // https://github.com/ftlabs/js-abbreviate/blob/fa709e5f139e7770a71827b1893f22418097fbda/index.js#L95-L106


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
	      cycleReplacer = function cycleReplacer(key, value) {
	        if (stack[0] === value) {
	          return '[Circular ~]';
	        }

	        return '[Circular ~.' + keys.slice(0, indexOf(stack, value)).join('.') + ']';
	      };
	    }

	    return function (key, value) {
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

	      return replacer == null ? value instanceof Error ? stringifyError(value) : value : replacer.call(this, key, value);
	    };
	  }
	});
	var stringify_2 = stringify_1.getSerialize;

	var _window = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	function isObject$1(what) {
	  return _typeof(what) === 'object' && what !== null;
	} // Yanked from https://git.io/vS8DV re-used under CC0
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

	function isArray$1(what) {
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
	} // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default
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

	  each(obj2, function (key, value) {
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

	  return str.length <= max ? str : str.substr(0, max) + "\u2026";
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
	    } // Intentionally skip other cases

	  }

	  return new RegExp(sources.join('|'), 'i');
	}

	function urlencode(o) {
	  var pairs = [];
	  each(o, function (key, value) {
	    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	  });
	  return pairs.join('&');
	} // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
	// intentionally using regex and not <a/> href parsing trick because React Native and other
	// environments where DOM might not be available


	function parseUrl(url) {
	  if (typeof url !== 'string') return {};
	  var match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/); // coerce to undefined values to empty string so we don't get 'undefined'

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
	    crypto.getRandomValues(arr); // set 4 in byte 7

	    arr[3] = arr[3] & 0xfff | 0x4000; // set 2 most significant bits of byte 9 to '10'

	    arr[4] = arr[4] & 0x3fff | 0x8000;

	    var pad = function pad(num) {
	      var v = num.toString(16);

	      while (v.length < 4) {
	        v = '0' + v;
	      }

	      return v;
	    };

	    return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
	  } else {
	    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
	    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	      var r = Math.random() * 16 | 0,
	          v = c === 'x' ? r : r & 0x3 | 0x8;
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
	    nextStr = htmlElementAsString(elem); // bail out if
	    // - nextStr is the 'html' element
	    // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
	    //   (ignore this limit if we are on the first iteration)

	    if (nextStr === 'html' || height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN) {
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
	  if (ex1.type !== ex2.type || ex1.value !== ex2.value) return false; // in case both stacktraces are undefined, we can't decide so default to false

	  if (isBothUndefined(ex1.stacktrace, ex2.stacktrace)) return false;
	  return isSameStacktrace(ex1.stacktrace, ex2.stacktrace);
	}
	/**
	 * Returns true if the two input stack trace interfaces have the same content
	 */


	function isSameStacktrace(stack1, stack2) {
	  if (isOnlyOneTruthy(stack1, stack2)) return false;
	  var frames1 = stack1.frames;
	  var frames2 = stack2.frames; // Exit early if stacktrace is malformed

	  if (frames1 === undefined || frames2 === undefined) return false; // Exit early if frame count differs

	  if (frames1.length !== frames2.length) return false; // Iterate through every frame; bail out if anything differs

	  var a, b;

	  for (var i = 0; i < frames1.length; i++) {
	    a = frames1[i];
	    b = frames2[i];
	    if (a.filename !== b.filename || a.lineno !== b.lineno || a.colno !== b.colno || a['function'] !== b['function']) return false;
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
	  if (!isArray$1(input)) return '';
	  var output = [];

	  for (var i = 0; i < input.length; i++) {
	    try {
	      output.push(String(input[i]));
	    } catch (e) {
	      output.push('[value cannot be serialized]');
	    }
	  }

	  return output.join(delimiter);
	} // Default Node.js REPL depth


	var MAX_SERIALIZE_EXCEPTION_DEPTH = 3; // 50kB, as 100kB is max payload size, so half sounds reasonable

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
	  } else if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'undefined') {
	    return value;
	  }

	  var type = Object.prototype.toString.call(value); // Node.js REPL notation

	  if (type === '[object Object]') return '[Object]';
	  if (type === '[object Array]') return '[Array]';
	  if (type === '[object Function]') return value.name ? '[Function: ' + value.name + ']' : '[Function]';
	  return value;
	}

	function serializeObject(value, depth) {
	  if (depth === 0) return serializeValue(value);

	  if (isPlainObject(value)) {
	    return Object.keys(value).reduce(function (acc, key) {
	      acc[key] = serializeObject(value[key], depth - 1);
	      return acc;
	    }, {});
	  } else if (Array.isArray(value)) {
	    return value.map(function (val) {
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
	  keys = keys.filter(function (key) {
	    return typeof key === 'string';
	  });
	  if (keys.length === 0) return '[object has no keys]';
	  maxLength = typeof maxLength !== 'number' ? MAX_SERIALIZE_KEYS_LENGTH : maxLength;
	  if (keys[0].length >= maxLength) return keys[0];

	  for (var usedKeys = keys.length; usedKeys > 0; usedKeys--) {
	    var serialized = keys.slice(0, usedKeys).join(', ');
	    if (serialized.length > maxLength) continue;
	    if (usedKeys === keys.length) return serialized;
	    return serialized + "\u2026";
	  }

	  return '';
	}

	function sanitize(input, sanitizeKeys) {
	  if (!isArray$1(sanitizeKeys) || isArray$1(sanitizeKeys) && sanitizeKeys.length === 0) return input;
	  var sanitizeRegExp = joinRegExp(sanitizeKeys);
	  var sanitizeMask = '********';
	  var safeInput;

	  try {
	    safeInput = JSON.parse(stringify_1(input));
	  } catch (o_O) {
	    return input;
	  }

	  function sanitizeWorker(workerInput) {
	    if (isArray$1(workerInput)) {
	      return workerInput.map(function (val) {
	        return sanitizeWorker(val);
	      });
	    }

	    if (isPlainObject(workerInput)) {
	      return Object.keys(workerInput).reduce(function (acc, k) {
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
	  isObject: isObject$1,
	  isError: isError,
	  isErrorEvent: isErrorEvent,
	  isDOMError: isDOMError,
	  isDOMException: isDOMException,
	  isUndefined: isUndefined,
	  isFunction: isFunction,
	  isPlainObject: isPlainObject,
	  isString: isString,
	  isArray: isArray$1,
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
	}; // This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)

	var _window$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {}; // global reference to slice


	var _slice = [].slice;
	var UNKNOWN_FUNCTION = '?'; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types

	var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;

	function getLocationHref() {
	  if (typeof document === 'undefined' || document.location == null) return '';
	  return document.location.href;
	}

	function getLocationOrigin() {
	  if (typeof document === 'undefined' || document.location == null) return ''; // Oh dear IE10...

	  if (!document.location.origin) {
	    return document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '');
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


	TraceKit.report = function reportModuleWrapper() {
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
	    var stack = null; // If 'ex' is ErrorEvent, get real Error from inside

	    var exception = utils.isErrorEvent(ex) ? ex.error : ex; // If 'msg' is ErrorEvent, get real message from inside

	    var message = utils.isErrorEvent(msg) ? msg.message : msg;

	    if (lastExceptionStack) {
	      TraceKit.computeStackTrace.augmentStackTraceWithInitialElement(lastExceptionStack, url, lineNo, message);
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
	    lastArgs = args; // If the stack trace is incomplete, wait for 2 seconds for
	    // slow slow IE to see if onerror occurs or not before reporting
	    // this exception; otherwise, we will end up with an incomplete
	    // stack trace

	    setTimeout(function () {
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
	}();
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


	TraceKit.computeStackTrace = function computeStackTraceWrapper() {
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
	    var winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i; // NOTE: blob urls are now supposed to always have an origin, therefore it's format
	    // which is `blob:http://url/path/with-some-uuid`, is matched by `blob.*?:\/` as well

	    var gecko = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i; // Used to additionally parse URL/line/column from eval frames

	    var geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
	    var chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/;
	    var lines = ex.stack.split('\n');
	    var stack = [];
	    var submatch;
	    var parts;
	    var element;
	    var reference = /^(.*) is undefined$/.exec(ex.message);

	    for (var i = 0, j = lines.length; i < j; ++i) {
	      if (parts = chrome.exec(lines[i])) {
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
	      } else if (parts = winjs.exec(lines[i])) {
	        element = {
	          url: parts[2],
	          func: parts[1] || UNKNOWN_FUNCTION,
	          args: [],
	          line: +parts[3],
	          column: parts[4] ? +parts[4] : null
	        };
	      } else if (parts = gecko.exec(lines[i])) {
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
	        xhr.send(null); // If we failed to download the source, skip this patch

	        if (xhr.status === 200) {
	          var source = xhr.responseText || ''; // We trim the source down to the last 300 characters as sourceMappingURL is always at the end of the file.
	          // Why 300? To be in line with: https://github.com/getsentry/sentry/blob/4af29e8f2350e20c28a6933354e4f42437b4ba42/src/sentry/lang/javascript/processor.py#L164-L175

	          source = source.slice(-300); // Now we dig out the source map URL

	          var sourceMaps = source.match(/\/\/# sourceMappingURL=(.*)$/); // If we don't find a source map comment or we find more than one, continue on to the next element.

	          if (sourceMaps) {
	            var sourceMapAddress = sourceMaps[1]; // Now we check to see if it's a relative URL.
	            // If it is, convert it to an absolute one.

	            if (sourceMapAddress.charAt(0) === '~') {
	              sourceMapAddress = getLocationOrigin() + sourceMapAddress.slice(1);
	            } // Now we strip the '.map' off of the end of the URL and update the
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
	          } else if (!stackInfo.stack[0].line && stackInfo.stack[0].func === initial.func) {
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

	    for (var curr = computeStackTraceByWalkingCallerChain.caller; curr && !recursion; curr = curr.caller) {
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
	      } else if (parts = functionName.exec(curr.toString())) {
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
	    augmentStackTraceWithInitialElement(result, ex.sourceURL || ex.fileName, ex.line || ex.lineNumber, ex.message || ex.description);
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
	}();

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
	  return msw << 16 | lsw & 0xffff;
	}
	/*
	* Bitwise rotate a 32-bit number to the left.
	*/


	function bitRotateLeft(num, cnt) {
	  return num << cnt | num >>> 32 - cnt;
	}
	/*
	* These functions implement the four basic operations the algorithm uses.
	*/


	function md5cmn(q, a, b, x, s, t) {
	  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
	}

	function md5ff(a, b, c, d, x, s, t) {
	  return md5cmn(b & c | ~b & d, a, b, x, s, t);
	}

	function md5gg(a, b, c, d, x, s, t) {
	  return md5cmn(b & d | c & ~d, a, b, x, s, t);
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
	  x[len >> 5] |= 0x80 << len % 32;
	  x[(len + 64 >>> 9 << 4) + 14] = len;
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
	    output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xff);
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
	    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
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
	    output += hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f);
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

	var wrapMethod = function wrapMethod(console, level, callback) {
	  var originalConsoleLevel = console[level];
	  var originalConsole = console;

	  if (!(level in console)) {
	    return;
	  }

	  var sentryLevel = level === 'warn' ? 'warning' : level;

	  console[level] = function () {
	    var args = [].slice.call(arguments);
	    var msg = utils.safeJoin(args, ' ');
	    var data = {
	      level: sentryLevel,
	      logger: 'console',
	      extra: {
	        arguments: args
	      }
	    };

	    if (level === 'assert') {
	      if (args[0] === false) {
	        // Default browsers message
	        msg = 'Assertion failed: ' + (utils.safeJoin(args.slice(1), ' ') || 'console.assert');
	        data.extra.arguments = args.slice(1);
	        callback && callback(msg, data);
	      }
	    } else {
	      callback && callback(msg, data);
	    } // this fails for some browsers. :(


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
	var isObject$2 = utils.isObject;
	var isPlainObject$1 = utils.isPlainObject;
	var isUndefined$1 = utils.isUndefined;
	var isFunction$1 = utils.isFunction;
	var isString$1 = utils.isString;
	var isArray$2 = utils.isArray;
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
	} // This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)


	var _window$2 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	var _document = _window$2.document;
	var _navigator = _window$2.navigator;

	function keepOriginalCallback(original, callback) {
	  return isFunction$1(callback) ? function (data) {
	    return callback(data, original);
	  } : callback;
	} // First, check for JSON support
	// If there is no JSON, we no-op the core features of Raven
	// since JSON is required to encode the payload


	function Raven() {
	  this._hasJSON = !!((typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) === 'object' && JSON.stringify); // Raven can run in contexts where there's no document (react-native)

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
	  this._originalErrorStackTraceLimit = Error.stackTraceLimit; // capture references to window.console *and* all its methods first
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

	  this._resetBackoff(); // eslint-disable-next-line guard-for-in


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
	  VERSION: '3.27.1',
	  debug: false,
	  TraceKit: tracekit,
	  // alias to TraceKit

	  /*
	     * Configure Raven with a DSN and extra options
	     *
	     * @param {string} dsn The public Sentry DSN
	     * @param {object} options Set of global options [optional]
	     * @return {Raven}
	     */
	  config: function config(dsn, options) {
	    var self = this;

	    if (self._globalServer) {
	      this._logDebug('error', 'Error: Raven has already been configured');

	      return self;
	    }

	    if (!dsn) return self;
	    var globalOptions = self._globalOptions; // merge in options

	    if (options) {
	      each$1(options, function (key, value) {
	        // tags and extra are special and need to be put into context
	        if (key === 'tags' || key === 'extra' || key === 'user') {
	          self._globalContext[key] = value;
	        } else {
	          globalOptions[key] = value;
	        }
	      });
	    }

	    self.setDSN(dsn); // "Script error." is hard coded into browsers for errors that it can't read.
	    // this is the result of a script being pulled in from an external domain and CORS.

	    globalOptions.ignoreErrors.push(/^Script error\.?$/);
	    globalOptions.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/); // join regexp rules into one big rule

	    globalOptions.ignoreErrors = joinRegExp$1(globalOptions.ignoreErrors);
	    globalOptions.ignoreUrls = globalOptions.ignoreUrls.length ? joinRegExp$1(globalOptions.ignoreUrls) : false;
	    globalOptions.whitelistUrls = globalOptions.whitelistUrls.length ? joinRegExp$1(globalOptions.whitelistUrls) : false;
	    globalOptions.includePaths = joinRegExp$1(globalOptions.includePaths);
	    globalOptions.maxBreadcrumbs = Math.max(0, Math.min(globalOptions.maxBreadcrumbs || 100, 100)); // default and hard limit is 100

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
	    tracekit.collectWindowErrors = !!globalOptions.collectWindowErrors; // return for chaining

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
	  install: function install() {
	    var self = this;

	    if (self.isSetup() && !self._isRavenInstalled) {
	      tracekit.report.subscribe(function () {
	        self._handleOnErrorStackInfo.apply(self, arguments);
	      });

	      if (self._globalOptions.captureUnhandledRejections) {
	        self._attachPromiseRejectionHandler();
	      }

	      self._patchFunctionToString();

	      if (self._globalOptions.instrument && self._globalOptions.instrument.tryCatch) {
	        self._instrumentTryCatch();
	      }

	      if (self._globalOptions.autoBreadcrumbs) self._instrumentBreadcrumbs(); // Install all of the plugins

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
	  setDSN: function setDSN(dsn) {
	    var self = this,
	        uri = self._parseDSN(dsn),
	        lastSlash = uri.path.lastIndexOf('/'),
	        path = uri.path.substr(1, lastSlash);

	    self._dsn = dsn;
	    self._globalKey = uri.user;
	    self._globalSecret = uri.pass && uri.pass.substr(1);
	    self._globalProject = uri.path.substr(lastSlash + 1);
	    self._globalServer = self._getGlobalServer(uri);
	    self._globalEndpoint = self._globalServer + '/' + path + 'api/' + self._globalProject + '/store/'; // Reset backoff state since we may be pointing at a
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
	  context: function context(options, func, args) {
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
	  wrap: function wrap(options, func, _before) {
	    var self = this; // 1 argument has been passed, and it's not a function
	    // so just return it

	    if (isUndefined$1(func) && !isFunction$1(options)) {
	      return options;
	    } // options is optional


	    if (isFunction$1(options)) {
	      func = options;
	      options = undefined;
	    } // At this point, we've passed along 2 arguments, and the second one
	    // is not a function either, so we'll just return the second argument.


	    if (!isFunction$1(func)) {
	      return func;
	    } // We don't wanna wrap it twice!


	    try {
	      if (func.__raven__) {
	        return func;
	      } // If this has already been wrapped in the past, return that


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
	          deep = !options || options && options.deep !== false;

	      if (_before && isFunction$1(_before)) {
	        _before.apply(this, arguments);
	      } // Recursively wrap all of a function's arguments that are
	      // functions themselves.


	      while (i--) {
	        args[i] = deep ? self.wrap(options, arguments[i]) : arguments[i];
	      }

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
	    } // copy over properties of the old function


	    for (var property in func) {
	      if (hasKey$1(func, property)) {
	        wrapped[property] = func[property];
	      }
	    }

	    wrapped.prototype = func.prototype;
	    func.__raven_wrapper__ = wrapped; // Signal that this function has been wrapped/filled already
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
	  uninstall: function uninstall() {
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
	  _promiseRejectionHandler: function _promiseRejectionHandler(event) {
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
	  _attachPromiseRejectionHandler: function _attachPromiseRejectionHandler() {
	    this._promiseRejectionHandler = this._promiseRejectionHandler.bind(this);
	    _window$2.addEventListener && _window$2.addEventListener('unhandledrejection', this._promiseRejectionHandler);
	    return this;
	  },

	  /**
	   * Uninstalls the global promise rejection handler.
	   *
	   * @return {raven}
	   */
	  _detachPromiseRejectionHandler: function _detachPromiseRejectionHandler() {
	    _window$2.removeEventListener && _window$2.removeEventListener('unhandledrejection', this._promiseRejectionHandler);
	    return this;
	  },

	  /**
	   * Manually capture an exception and send it over to Sentry
	   *
	   * @param {error} ex An exception to be logged
	   * @param {object} options A specific set of options for this error [optional]
	   * @return {Raven}
	   */
	  captureException: function captureException(ex, options) {
	    options = objectMerge$1({
	      trimHeadFrames: 0
	    }, options ? options : {});

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
	      return this.captureMessage(message, objectMerge$1(options, {
	        // neither DOMError or DOMException provide stack trace and we most likely wont get it this way as well
	        // but it's barely any overhead so we may at least try
	        stacktrace: true,
	        trimHeadFrames: options.trimHeadFrames + 1
	      }));
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
	      return this.captureMessage(ex, objectMerge$1(options, {
	        stacktrace: true,
	        // if we fall back to captureMessage, default to attempting a new trace
	        trimHeadFrames: options.trimHeadFrames + 1
	      }));
	    } // Store the raw exception object for potential debugging and introspection


	    this._lastCapturedException = ex; // TraceKit.report will re-raise any exception passed to it,
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
	  _getCaptureExceptionOptionsFromPlainObject: function _getCaptureExceptionOptionsFromPlainObject(currentOptions, ex) {
	    var exKeys = Object.keys(ex).sort();
	    var options = objectMerge$1(currentOptions, {
	      message: 'Non-Error exception captured with keys: ' + serializeKeysForMessage$1(exKeys),
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
	  captureMessage: function captureMessage(msg, options) {
	    // config() automagically converts ignoreErrors from a list to a RegExp so we need to test for an
	    // early call; we'll error on the side of logging anything called before configuration since it's
	    // probably something you should see:
	    if (!!this._globalOptions.ignoreErrors.test && this._globalOptions.ignoreErrors.test(msg)) {
	      return;
	    }

	    options = options || {};
	    msg = msg + ''; // Make sure it's actually a string

	    var data = objectMerge$1({
	      message: msg
	    }, options);
	    var ex; // Generate a "synthetic" stack trace from this point.
	    // NOTE: If you are a Sentry user, and you are seeing this stack frame, it is NOT indicative
	    //       of a bug with Raven.js. Sentry generates synthetic traces either by configuration,
	    //       or if it catches a thrown object without a "stack" property.

	    try {
	      throw new Error(msg);
	    } catch (ex1) {
	      ex = ex1;
	    } // null exception name so `Error` isn't prefixed to msg


	    ex.name = null;
	    var stack = tracekit.computeStackTrace(ex); // stack[0] is `throw new Error(msg)` call itself, we are interested in the frame that was just before that, stack[1]

	    var initialCall = isArray$2(stack.stack) && stack.stack[1]; // if stack[1] is `Raven.captureException`, it means that someone passed a string to it and we redirected that call
	    // to be handled by `captureMessage`, thus `initialCall` is the 3rd one, not 2nd
	    // initialCall => captureException(string) => captureMessage(string)

	    if (initialCall && initialCall.func === 'Raven.captureException') {
	      initialCall = stack.stack[2];
	    }

	    var fileurl = initialCall && initialCall.url || '';

	    if (!!this._globalOptions.ignoreUrls.test && this._globalOptions.ignoreUrls.test(fileurl)) {
	      return;
	    }

	    if (!!this._globalOptions.whitelistUrls.test && !this._globalOptions.whitelistUrls.test(fileurl)) {
	      return;
	    } // Always attempt to get stacktrace if message is empty.
	    // It's the only way to provide any helpful information to the user.


	    if (this._globalOptions.stacktrace || options.stacktrace || data.message === '') {
	      // fingerprint on msg, not stack trace (legacy behavior, could be revisited)
	      data.fingerprint = data.fingerprint == null ? msg : data.fingerprint;
	      options = objectMerge$1({
	        trimHeadFrames: 0
	      }, options); // Since we know this is a synthetic trace, the top frame (this function call)
	      // MUST be from Raven.js, so mark it for trimming
	      // We add to the trim counter so that callers can choose to trim extra frames, such
	      // as utility functions.

	      options.trimHeadFrames += 1;

	      var frames = this._prepareFrames(stack, options);

	      data.stacktrace = {
	        // Sentry expects frames oldest to newest
	        frames: frames.reverse()
	      };
	    } // Make sure that fingerprint is always wrapped in an array


	    if (data.fingerprint) {
	      data.fingerprint = isArray$2(data.fingerprint) ? data.fingerprint : [data.fingerprint];
	    } // Fire away!


	    this._send(data);

	    return this;
	  },
	  captureBreadcrumb: function captureBreadcrumb(obj) {
	    var crumb = objectMerge$1({
	      timestamp: now() / 1000
	    }, obj);

	    if (isFunction$1(this._globalOptions.breadcrumbCallback)) {
	      var result = this._globalOptions.breadcrumbCallback(crumb);

	      if (isObject$2(result) && !isEmptyObject$1(result)) {
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
	  addPlugin: function addPlugin(plugin
	  /*arg1, arg2, ... argN*/
	  ) {
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
	  setUserContext: function setUserContext(user) {
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
	  setExtraContext: function setExtraContext(extra) {
	    this._mergeContext('extra', extra);

	    return this;
	  },

	  /*
	     * Merge tags to be sent along with the payload.
	     *
	     * @param {object} tags An object representing tags [optional]
	     * @return {Raven}
	     */
	  setTagsContext: function setTagsContext(tags) {
	    this._mergeContext('tags', tags);

	    return this;
	  },

	  /*
	     * Clear all of the context.
	     *
	     * @return {Raven}
	     */
	  clearContext: function clearContext() {
	    this._globalContext = {};
	    return this;
	  },

	  /*
	     * Get a copy of the current context. This cannot be mutated.
	     *
	     * @return {object} copy of context
	     */
	  getContext: function getContext() {
	    // lol javascript
	    return JSON.parse(stringify_1(this._globalContext));
	  },

	  /*
	     * Set environment of application
	     *
	     * @param {string} environment Typically something like 'production'.
	     * @return {Raven}
	     */
	  setEnvironment: function setEnvironment(environment) {
	    this._globalOptions.environment = environment;
	    return this;
	  },

	  /*
	     * Set release version of application
	     *
	     * @param {string} release Typically something like a git SHA to identify version
	     * @return {Raven}
	     */
	  setRelease: function setRelease(release) {
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
	  setDataCallback: function setDataCallback(callback) {
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
	  setBreadcrumbCallback: function setBreadcrumbCallback(callback) {
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
	  setShouldSendCallback: function setShouldSendCallback(callback) {
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
	  setTransport: function setTransport(transport) {
	    this._globalOptions.transport = transport;
	    return this;
	  },

	  /*
	     * Get the latest raw exception that was captured by Raven.
	     *
	     * @return {error}
	     */
	  lastException: function lastException() {
	    return this._lastCapturedException;
	  },

	  /*
	     * Get the last event id
	     *
	     * @return {string}
	     */
	  lastEventId: function lastEventId() {
	    return this._lastEventId;
	  },

	  /*
	     * Determine if Raven is setup and ready to go.
	     *
	     * @return {boolean}
	     */
	  isSetup: function isSetup() {
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
	  afterLoad: function afterLoad() {
	    // TODO: remove window dependence?
	    // Attempt to initialize Raven on load
	    var RavenConfig = _window$2.RavenConfig;

	    if (RavenConfig) {
	      this.config(RavenConfig.dsn, RavenConfig.config).install();
	    }
	  },
	  showReportDialog: function showReportDialog(options) {
	    if (!_document // doesn't work without a document (React native)
	    ) return;
	    options = objectMerge$1({
	      eventId: this.lastEventId(),
	      dsn: this._dsn,
	      user: this._globalContext.user || {}
	    }, options);

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
	  _ignoreNextOnError: function _ignoreNextOnError() {
	    var self = this;
	    this._ignoreOnError += 1;
	    setTimeout(function () {
	      // onerror should trigger before setTimeout
	      self._ignoreOnError -= 1;
	    });
	  },
	  _triggerEvent: function _triggerEvent(eventType, options) {
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

	    for (key in options) {
	      if (hasKey$1(options, key)) {
	        evt[key] = options[key];
	      }
	    }

	    if (_document.createEvent) {
	      // IE9 if standards
	      _document.dispatchEvent(evt);
	    } else {
	      // IE8 regardless of Quirks or Standards
	      // IE9 if quirks
	      try {
	        _document.fireEvent('on' + evt.eventType.toLowerCase(), evt);
	      } catch (e) {// Do nothing
	      }
	    }
	  },

	  /**
	   * Wraps addEventListener to capture UI breadcrumbs
	   * @param evtName the event name (e.g. "click")
	   * @returns {Function}
	   * @private
	   */
	  _breadcrumbEventHandler: function _breadcrumbEventHandler(evtName) {
	    var self = this;
	    return function (evt) {
	      // reset keypress timeout; e.g. triggering a 'click' after
	      // a 'keypress' will reset the keypress debounce so that a new
	      // set of keypresses can be recorded
	      self._keypressTimeout = null; // It's possible this handler might trigger multiple times for the same
	      // event (e.g. event propagation through node ancestors). Ignore if we've
	      // already captured the event.

	      if (self._lastCapturedEvent === evt) return;
	      self._lastCapturedEvent = evt; // try/catch both:
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
	        category: 'ui.' + evtName,
	        // e.g. ui.click, ui.input
	        message: target
	      });
	    };
	  },

	  /**
	   * Wraps addEventListener to capture keypress UI events
	   * @returns {Function}
	   * @private
	   */
	  _keypressEventHandler: function _keypressEventHandler() {
	    var self = this,
	        debounceDuration = 1000; // milliseconds
	    // TODO: if somehow user switches keypress target before
	    //       debounce timeout is triggered, we will only capture
	    //       a single breadcrumb from the FIRST target (acceptable?)

	    return function (evt) {
	      var target;

	      try {
	        target = evt.target;
	      } catch (e) {
	        // just accessing event properties can throw an exception in some rare circumstances
	        // see: https://github.com/getsentry/raven-js/issues/838
	        return;
	      }

	      var tagName = target && target.tagName; // only consider keypress events on actual input elements
	      // this will disregard keypresses targeting body (e.g. tabbing
	      // through elements, hotkeys, etc)

	      if (!tagName || tagName !== 'INPUT' && tagName !== 'TEXTAREA' && !target.isContentEditable) return; // record first keypress in a series, but ignore subsequent
	      // keypresses until debounce clears

	      var timeout = self._keypressTimeout;

	      if (!timeout) {
	        self._breadcrumbEventHandler('input')(evt);
	      }

	      clearTimeout(timeout);
	      self._keypressTimeout = setTimeout(function () {
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
	  _captureUrlChange: function _captureUrlChange(from, to) {
	    var parsedLoc = parseUrl$1(this._location.href);
	    var parsedTo = parseUrl$1(to);
	    var parsedFrom = parseUrl$1(from); // because onpopstate only tells you the "new" (to) value of location.href, and
	    // not the previous (from) value, we need to track the value of the current URL
	    // state ourselves

	    this._lastHref = to; // Use only the path component of the URL if the URL matches the current
	    // document (almost all the time when using pushState)

	    if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host) to = parsedTo.relative;
	    if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host) from = parsedFrom.relative;
	    this.captureBreadcrumb({
	      category: 'navigation',
	      data: {
	        to: to,
	        from: from
	      }
	    });
	  },
	  _patchFunctionToString: function _patchFunctionToString() {
	    var self = this;
	    self._originalFunctionToString = Function.prototype.toString; // eslint-disable-next-line no-extend-native

	    Function.prototype.toString = function () {
	      if (typeof this === 'function' && this.__raven__) {
	        return self._originalFunctionToString.apply(this.__orig__, arguments);
	      }

	      return self._originalFunctionToString.apply(this, arguments);
	    };
	  },
	  _unpatchFunctionToString: function _unpatchFunctionToString() {
	    if (this._originalFunctionToString) {
	      // eslint-disable-next-line no-extend-native
	      Function.prototype.toString = this._originalFunctionToString;
	    }
	  },

	  /**
	   * Wrap timer functions and event targets to catch errors and provide
	   * better metadata.
	   */
	  _instrumentTryCatch: function _instrumentTryCatch() {
	    var self = this;
	    var wrappedBuiltIns = self._wrappedBuiltIns;

	    function wrapTimeFn(orig) {
	      return function (fn, t) {
	        // preserve arity
	        // Make a copy of the arguments to prevent deoptimization
	        // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	        var args = new Array(arguments.length);

	        for (var i = 0; i < args.length; ++i) {
	          args[i] = arguments[i];
	        }

	        var originalCallback = args[0];

	        if (isFunction$1(originalCallback)) {
	          args[0] = self.wrap({
	            mechanism: {
	              type: 'instrument',
	              data: {
	                function: orig.name || '<anonymous>'
	              }
	            }
	          }, originalCallback);
	        } // IE < 9 doesn't support .call/.apply on setInterval/setTimeout, but it
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
	        fill$1(proto, 'addEventListener', function (orig) {
	          return function (evtName, fn, capture, secure) {
	            // preserve arity
	            try {
	              if (fn && fn.handleEvent) {
	                fn.handleEvent = self.wrap({
	                  mechanism: {
	                    type: 'instrument',
	                    data: {
	                      target: global,
	                      function: 'handleEvent',
	                      handler: fn && fn.name || '<anonymous>'
	                    }
	                  }
	                }, fn.handleEvent);
	              }
	            } catch (err) {} // can sometimes get 'Permission denied to access property "handle Event'
	            // More breadcrumb DOM capture ... done here and not in `_instrumentBreadcrumbs`
	            // so that we don't have more than one wrapper function


	            var before, clickHandler, keypressHandler;

	            if (autoBreadcrumbs && autoBreadcrumbs.dom && (global === 'EventTarget' || global === 'Node')) {
	              // NOTE: generating multiple handlers per addEventListener invocation, should
	              //       revisit and verify we can just use one (almost certainly)
	              clickHandler = self._breadcrumbEventHandler('click');
	              keypressHandler = self._keypressEventHandler();

	              before = function before(evt) {
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

	                if (eventType === 'click') return clickHandler(evt);else if (eventType === 'keypress') return keypressHandler(evt);
	              };
	            }

	            return orig.call(this, evtName, self.wrap({
	              mechanism: {
	                type: 'instrument',
	                data: {
	                  target: global,
	                  function: 'addEventListener',
	                  handler: fn && fn.name || '<anonymous>'
	                }
	              }
	            }, fn, before), capture, secure);
	          };
	        }, wrappedBuiltIns);
	        fill$1(proto, 'removeEventListener', function (orig) {
	          return function (evt, fn, capture, secure) {
	            try {
	              fn = fn && (fn.__raven_wrapper__ ? fn.__raven_wrapper__ : fn);
	            } catch (e) {// ignore, accessing __raven_wrapper__ will throw in some Selenium environments
	            }

	            return orig.call(this, evt, fn, capture, secure);
	          };
	        }, wrappedBuiltIns);
	      }
	    }

	    fill$1(_window$2, 'setTimeout', wrapTimeFn, wrappedBuiltIns);
	    fill$1(_window$2, 'setInterval', wrapTimeFn, wrappedBuiltIns);

	    if (_window$2.requestAnimationFrame) {
	      fill$1(_window$2, 'requestAnimationFrame', function (orig) {
	        return function (cb) {
	          return orig(self.wrap({
	            mechanism: {
	              type: 'instrument',
	              data: {
	                function: 'requestAnimationFrame',
	                handler: orig && orig.name || '<anonymous>'
	              }
	            }
	          }, cb));
	        };
	      }, wrappedBuiltIns);
	    } // event targets borrowed from bugsnag-js:
	    // https://github.com/bugsnag/bugsnag-js/blob/master/src/bugsnag.js#L666


	    var eventTargets = ['EventTarget', 'Window', 'Node', 'ApplicationCache', 'AudioTrackList', 'ChannelMergerNode', 'CryptoOperation', 'EventSource', 'FileReader', 'HTMLUnknownElement', 'IDBDatabase', 'IDBRequest', 'IDBTransaction', 'KeyOperation', 'MediaController', 'MessagePort', 'ModalWindow', 'Notification', 'SVGElementInstance', 'Screen', 'TextTrack', 'TextTrackCue', 'TextTrackList', 'WebSocket', 'WebSocketWorker', 'Worker', 'XMLHttpRequest', 'XMLHttpRequestEventTarget', 'XMLHttpRequestUpload'];

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
	  _instrumentBreadcrumbs: function _instrumentBreadcrumbs() {
	    var self = this;
	    var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;
	    var wrappedBuiltIns = self._wrappedBuiltIns;

	    function wrapProp(prop, xhr) {
	      if (prop in xhr && isFunction$1(xhr[prop])) {
	        fill$1(xhr, prop, function (orig) {
	          return self.wrap({
	            mechanism: {
	              type: 'instrument',
	              data: {
	                function: prop,
	                handler: orig && orig.name || '<anonymous>'
	              }
	            }
	          }, orig);
	        }); // intentionally don't track filled methods on XHR instances
	      }
	    }

	    if (autoBreadcrumbs.xhr && 'XMLHttpRequest' in _window$2) {
	      var xhrproto = _window$2.XMLHttpRequest && _window$2.XMLHttpRequest.prototype;
	      fill$1(xhrproto, 'open', function (origOpen) {
	        return function (method, url) {
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
	      }, wrappedBuiltIns);
	      fill$1(xhrproto, 'send', function (origSend) {
	        return function () {
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
	            fill$1(xhr, 'onreadystatechange', function (orig) {
	              return self.wrap({
	                mechanism: {
	                  type: 'instrument',
	                  data: {
	                    function: 'onreadystatechange',
	                    handler: orig && orig.name || '<anonymous>'
	                  }
	                }
	              }, orig, onreadystatechangeHandler);
	            }
	            /* intentionally don't track this instrumentation */
	            );
	          } else {
	            // if onreadystatechange wasn't actually set by the page on this xhr, we
	            // are free to set our own and capture the breadcrumb
	            xhr.onreadystatechange = onreadystatechangeHandler;
	          }

	          return origSend.apply(this, arguments);
	        };
	      }, wrappedBuiltIns);
	    }

	    if (autoBreadcrumbs.xhr && supportsFetch$1()) {
	      fill$1(_window$2, 'fetch', function (origFetch) {
	        return function () {
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
	          } // if Sentry key appears in URL, don't capture, as it's our own request


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
	          return origFetch.apply(this, args).then(function (response) {
	            fetchData.status_code = response.status;
	            self.captureBreadcrumb({
	              type: 'http',
	              category: 'fetch',
	              data: fetchData
	            });
	            return response;
	          })['catch'](function (err) {
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
	      }, wrappedBuiltIns);
	    } // Capture breadcrumbs from any click that is unhandled / bubbled up all the way
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
	    } // record navigation (URL) changes
	    // NOTE: in Chrome App environment, touching history.pushState, *even inside
	    //       a try/catch block*, will cause Chrome to output an error to console.error
	    // borrowed from: https://github.com/angular/angular.js/pull/13945/files


	    var chrome = _window$2.chrome;
	    var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
	    var hasPushAndReplaceState = !isChromePackagedApp && _window$2.history && _window$2.history.pushState && _window$2.history.replaceState;

	    if (autoBreadcrumbs.location && hasPushAndReplaceState) {
	      // TODO: remove onpopstate handler on uninstall()
	      var oldOnPopState = _window$2.onpopstate;

	      _window$2.onpopstate = function () {
	        var currentHref = self._location.href;

	        self._captureUrlChange(self._lastHref, currentHref);

	        if (oldOnPopState) {
	          return oldOnPopState.apply(this, arguments);
	        }
	      };

	      var historyReplacementFunction = function historyReplacementFunction(origHistFunction) {
	        // note history.pushState.length is 0; intentionally not declaring
	        // params to preserve 0 arity
	        return function ()
	        /* state, title, url */
	        {
	          var url = arguments.length > 2 ? arguments[2] : undefined; // url argument is optional

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
	      var consoleMethodCallback = function consoleMethodCallback(msg, data) {
	        self.captureBreadcrumb({
	          message: msg,
	          level: data.level,
	          category: 'console'
	        });
	      };

	      each$1(['debug', 'info', 'warn', 'error', 'log'], function (_, level) {
	        wrapConsoleMethod(console, level, consoleMethodCallback);
	      });
	    }
	  },
	  _restoreBuiltIns: function _restoreBuiltIns() {
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
	  _restoreConsole: function _restoreConsole() {
	    // eslint-disable-next-line guard-for-in
	    for (var method in this._originalConsoleMethods) {
	      this._originalConsole[method] = this._originalConsoleMethods[method];
	    }
	  },
	  _drainPlugins: function _drainPlugins() {
	    var self = this; // FIX ME TODO

	    each$1(this._plugins, function (_, plugin) {
	      var installer = plugin[0];
	      var args = plugin[1];
	      installer.apply(self, [self].concat(args));
	    });
	  },
	  _parseDSN: function _parseDSN(str) {
	    var m = dsnPattern.exec(str),
	        dsn = {},
	        i = 7;

	    try {
	      while (i--) {
	        dsn[dsnKeys[i]] = m[i] || '';
	      }
	    } catch (e) {
	      throw new configError('Invalid DSN: ' + str);
	    }

	    if (dsn.pass && !this._globalOptions.allowSecretKey) {
	      throw new configError('Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key');
	    }

	    return dsn;
	  },
	  _getGlobalServer: function _getGlobalServer(uri) {
	    // assemble the endpoint from the uri pieces
	    var globalServer = '//' + uri.host + (uri.port ? ':' + uri.port : '');

	    if (uri.protocol) {
	      globalServer = uri.protocol + ':' + globalServer;
	    }

	    return globalServer;
	  },
	  _handleOnErrorStackInfo: function _handleOnErrorStackInfo(stackInfo, options) {
	    options = options || {};
	    options.mechanism = options.mechanism || {
	      type: 'onerror',
	      handled: false
	    }; // if we are intentionally ignoring errors via onerror, bail out

	    if (!this._ignoreOnError) {
	      this._handleStackInfo(stackInfo, options);
	    }
	  },
	  _handleStackInfo: function _handleStackInfo(stackInfo, options) {
	    var frames = this._prepareFrames(stackInfo, options);

	    this._triggerEvent('handle', {
	      stackInfo: stackInfo,
	      options: options
	    });

	    this._processException(stackInfo.name, stackInfo.message, stackInfo.url, stackInfo.lineno, frames, options);
	  },
	  _prepareFrames: function _prepareFrames(stackInfo, options) {
	    var self = this;
	    var frames = [];

	    if (stackInfo.stack && stackInfo.stack.length) {
	      each$1(stackInfo.stack, function (i, stack) {
	        var frame = self._normalizeFrame(stack, stackInfo.url);

	        if (frame) {
	          frames.push(frame);
	        }
	      }); // e.g. frames captured via captureMessage throw

	      if (options && options.trimHeadFrames) {
	        for (var j = 0; j < options.trimHeadFrames && j < frames.length; j++) {
	          frames[j].in_app = false;
	        }
	      }
	    }

	    frames = frames.slice(0, this._globalOptions.stackTraceLimit);
	    return frames;
	  },
	  _normalizeFrame: function _normalizeFrame(frame, stackInfoUrl) {
	    // normalize the frames data
	    var normalized = {
	      filename: frame.url,
	      lineno: frame.line,
	      colno: frame.column,
	      function: frame.func || '?'
	    }; // Case when we don't have any information about the error
	    // E.g. throwing a string or raw object, instead of an `Error` in Firefox
	    // Generating synthetic error doesn't add any value here
	    //
	    // We should probably somehow let a user know that they should fix their code

	    if (!frame.url) {
	      normalized.filename = stackInfoUrl; // fallback to whole stacks url from onerror handler
	    }

	    normalized.in_app = !( // determine if an exception came from outside of our app
	    // first we check the global includePaths list.
	    !!this._globalOptions.includePaths.test && !this._globalOptions.includePaths.test(normalized.filename) || // Now we check for fun, if the function name is Raven or TraceKit
	    /(Raven|TraceKit)\./.test(normalized['function']) || // finally, we do a last ditch effort and check for raven.min.js
	    /raven\.(min\.)?js$/.test(normalized.filename));
	    return normalized;
	  },
	  _processException: function _processException(type, message, fileurl, lineno, frames, options) {
	    var prefixedMessage = (type ? type + ': ' : '') + (message || '');

	    if (!!this._globalOptions.ignoreErrors.test && (this._globalOptions.ignoreErrors.test(message) || this._globalOptions.ignoreErrors.test(prefixedMessage))) {
	      return;
	    }

	    var stacktrace;

	    if (frames && frames.length) {
	      fileurl = frames[0].filename || fileurl; // Sentry expects frames oldest to newest
	      // and JS sends them as newest to oldest

	      frames.reverse();
	      stacktrace = {
	        frames: frames
	      };
	    } else if (fileurl) {
	      stacktrace = {
	        frames: [{
	          filename: fileurl,
	          lineno: lineno,
	          in_app: true
	        }]
	      };
	    }

	    if (!!this._globalOptions.ignoreUrls.test && this._globalOptions.ignoreUrls.test(fileurl)) {
	      return;
	    }

	    if (!!this._globalOptions.whitelistUrls.test && !this._globalOptions.whitelistUrls.test(fileurl)) {
	      return;
	    }

	    var data = objectMerge$1({
	      // sentry.interfaces.Exception
	      exception: {
	        values: [{
	          type: type,
	          value: message,
	          stacktrace: stacktrace
	        }]
	      },
	      transaction: fileurl
	    }, options);
	    var ex = data.exception.values[0];

	    if (ex.type == null && ex.value === '') {
	      ex.value = 'Unrecoverable error caught';
	    } // Move mechanism from options to exception interface
	    // We do this, as requiring user to pass `{exception:{mechanism:{ ... }}}` would be
	    // too much


	    if (!data.exception.mechanism && data.mechanism) {
	      data.exception.mechanism = data.mechanism;
	      delete data.mechanism;
	    }

	    data.exception.mechanism = objectMerge$1({
	      type: 'generic',
	      handled: true
	    }, data.exception.mechanism || {}); // Fire away!

	    this._send(data);
	  },
	  _trimPacket: function _trimPacket(data) {
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

	    if (data.breadcrumbs && data.breadcrumbs.values) this._trimBreadcrumbs(data.breadcrumbs);
	    return data;
	  },

	  /**
	   * Truncate breadcrumb values (right now just URLs)
	   */
	  _trimBreadcrumbs: function _trimBreadcrumbs(breadcrumbs) {
	    // known breadcrumb properties with urls
	    // TODO: also consider arbitrary prop values that start with (https?)?://
	    var urlProps = ['to', 'from', 'url'],
	        urlProp,
	        crumb,
	        data;

	    for (var i = 0; i < breadcrumbs.values.length; ++i) {
	      crumb = breadcrumbs.values[i];
	      if (!crumb.hasOwnProperty('data') || !isObject$2(crumb.data) || objectFrozen$1(crumb.data)) continue;
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
	  _getHttpData: function _getHttpData() {
	    if (!this._hasNavigator && !this._hasDocument) return;
	    var httpData = {};

	    if (this._hasNavigator && _navigator.userAgent) {
	      httpData.headers = {
	        'User-Agent': _navigator.userAgent
	      };
	    } // Check in `window` instead of `document`, as we may be in ServiceWorker environment


	    if (_window$2.location && _window$2.location.href) {
	      httpData.url = _window$2.location.href;
	    }

	    if (this._hasDocument && _document.referrer) {
	      if (!httpData.headers) httpData.headers = {};
	      httpData.headers.Referer = _document.referrer;
	    }

	    return httpData;
	  },
	  _resetBackoff: function _resetBackoff() {
	    this._backoffDuration = 0;
	    this._backoffStart = null;
	  },
	  _shouldBackoff: function _shouldBackoff() {
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
	  _isRepeatData: function _isRepeatData(current) {
	    var last = this._lastData;
	    if (!last || current.message !== last.message || // defined for captureMessage
	    current.transaction !== last.transaction // defined for captureException/onerror
	    ) return false; // Stacktrace interface (i.e. from captureMessage)

	    if (current.stacktrace || last.stacktrace) {
	      return isSameStacktrace$1(current.stacktrace, last.stacktrace);
	    } else if (current.exception || last.exception) {
	      // Exception interface (i.e. from captureException/onerror)
	      return isSameException$1(current.exception, last.exception);
	    } else if (current.fingerprint || last.fingerprint) {
	      return Boolean(current.fingerprint && last.fingerprint) && JSON.stringify(current.fingerprint) === JSON.stringify(last.fingerprint);
	    }

	    return true;
	  },
	  _setBackoffState: function _setBackoffState(request) {
	    // If we are already in a backoff state, don't change anything
	    if (this._shouldBackoff()) {
	      return;
	    }

	    var status = request.status; // 400 - project_id doesn't exist or some other fatal
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
	      } // Retry-After is returned in seconds


	      retry = parseInt(retry, 10) * 1000;
	    } catch (e) {
	      /* eslint no-empty:0 */
	    }

	    this._backoffDuration = retry ? // If Sentry server returned a Retry-After value, use it
	    retry : // Otherwise, double the last backoff duration (starts at 1 sec)
	    this._backoffDuration * 2 || 1000;
	    this._backoffStart = now();
	  },
	  _send: function _send(data) {
	    var globalOptions = this._globalOptions;

	    var baseData = {
	      project: this._globalProject,
	      logger: globalOptions.logger,
	      platform: 'javascript'
	    },
	        httpData = this._getHttpData();

	    if (httpData) {
	      baseData.request = httpData;
	    } // HACK: delete `trimHeadFrames` to prevent from appearing in outbound payload


	    if (data.trimHeadFrames) delete data.trimHeadFrames;
	    data = objectMerge$1(baseData, data); // Merge in the tags and extra separately since objectMerge doesn't handle a deep merge

	    data.tags = objectMerge$1(objectMerge$1({}, this._globalContext.tags), data.tags);
	    data.extra = objectMerge$1(objectMerge$1({}, this._globalContext.extra), data.extra); // Send along our own collected metadata with extra

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
	    } // Include the environment if it's defined in globalOptions


	    if (globalOptions.environment) data.environment = globalOptions.environment; // Include the release if it's defined in globalOptions

	    if (globalOptions.release) data.release = globalOptions.release; // Include server_name if it's defined in globalOptions

	    if (globalOptions.serverName) data.server_name = globalOptions.serverName;
	    data = this._sanitizeData(data); // Cleanup empty properties before sending them to the server

	    Object.keys(data).forEach(function (key) {
	      if (data[key] == null || data[key] === '' || isEmptyObject$1(data[key])) {
	        delete data[key];
	      }
	    });

	    if (isFunction$1(globalOptions.dataCallback)) {
	      data = globalOptions.dataCallback(data) || data;
	    } // Why??????????


	    if (!data || isEmptyObject$1(data)) {
	      return;
	    } // Check if the request should be filtered or not


	    if (isFunction$1(globalOptions.shouldSendCallback) && !globalOptions.shouldSendCallback(data)) {
	      return;
	    } // Backoff state: Sentry server previously responded w/ an error (e.g. 429 - too many requests),
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
	  _sanitizeData: function _sanitizeData(data) {
	    return sanitize$1(data, this._globalOptions.sanitizeKeys);
	  },
	  _getUuid: function _getUuid() {
	    return uuid4$1();
	  },
	  _sendProcessedPayload: function _sendProcessedPayload(data, callback) {
	    var self = this;
	    var globalOptions = this._globalOptions;
	    if (!this.isSetup()) return; // Try and clean up the packet before sending by truncating long values

	    data = this._trimPacket(data); // ideally duplicate error testing should occur *before* dataCallback/shouldSendCallback,
	    // but this would require copying an un-truncated copy of the data packet, which can be
	    // arbitrarily deep (extra_data) -- could be worthwhile? will revisit

	    if (!this._globalOptions.allowDuplicates && this._isRepeatData(data)) {
	      this._logDebug('warn', 'Raven dropped repeat event: ', data);

	      return;
	    } // Send along an event_id if not explicitly passed.
	    // This event_id can be used to reference the error within Sentry itself.
	    // Set lastEventId after we know the error should actually be sent


	    this._lastEventId = data.event_id || (data.event_id = this._getUuid()); // Store outbound payload after trim

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

	    var exception = data.exception && data.exception.values[0]; // only capture 'sentry' breadcrumb is autoBreadcrumbs is truthy

	    if (this._globalOptions.autoBreadcrumbs && this._globalOptions.autoBreadcrumbs.sentry) {
	      this.captureBreadcrumb({
	        category: 'sentry',
	        message: exception ? (exception.type ? exception.type + ': ' : '') + exception.value : data.message,
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
	  _makeRequest: function _makeRequest(opts) {
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

	      return _window$2.fetch(url, fetchOptions).then(function (response) {
	        if (response.ok) {
	          opts.onSuccess && opts.onSuccess();
	        } else {
	          var error = new Error('Sentry error code: ' + response.status); // It's called request only to keep compatibility with XHR interface
	          // and not add more redundant checks in setBackoffState method

	          error.request = response;
	          opts.onError && opts.onError(error);
	        }
	      })['catch'](function () {
	        opts.onError && opts.onError(new Error('Sentry error code: network unavailable'));
	      });
	    }

	    var request = _window$2.XMLHttpRequest && new _window$2.XMLHttpRequest();
	    if (!request) return; // if browser doesn't support CORS (e.g. IE7), we are out of luck

	    var hasCORS = 'withCredentials' in request || typeof XDomainRequest !== 'undefined';
	    if (!hasCORS) return;

	    if ('withCredentials' in request) {
	      request.onreadystatechange = function () {
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
	      request = new XDomainRequest(); // xdomainrequest cannot go http -> https (or vice versa),
	      // so always use protocol relative

	      url = url.replace(/^https?:/, ''); // onreadystatechange not supported by XDomainRequest

	      if (opts.onSuccess) {
	        request.onload = opts.onSuccess;
	      }

	      if (opts.onError) {
	        request.onerror = function () {
	          var err = new Error('Sentry error code: XDomainRequest');
	          err.request = request;
	          opts.onError(err);
	        };
	      }
	    }

	    request.open('POST', url);

	    if (evaluatedHeaders) {
	      each$1(evaluatedHeaders, function (key, value) {
	        request.setRequestHeader(key, value);
	      });
	    }

	    request.send(stringify_1(opts.data));
	  },
	  _evaluateHash: function _evaluateHash(hash) {
	    var evaluated = {};

	    for (var key in hash) {
	      if (hash.hasOwnProperty(key)) {
	        var value = hash[key];
	        evaluated[key] = typeof value === 'function' ? value() : value;
	      }
	    }

	    return evaluated;
	  },
	  _logDebug: function _logDebug(level) {
	    // We allow `Raven.debug` and `Raven.config(DSN, { debug: true })` to not make backward incompatible API change
	    if (this._originalConsoleMethods[level] && (this.debug || this._globalOptions.debug)) {
	      // In IE<10 console methods do not have their own 'apply' method
	      Function.prototype.apply.call(this._originalConsoleMethods[level], this._originalConsole, [].slice.call(arguments, 1));
	    }
	  },
	  _mergeContext: function _mergeContext(key, context) {
	    if (isUndefined$1(context)) {
	      delete this._globalContext[key];
	    } else {
	      this._globalContext[key] = objectMerge$1(this._globalContext[key] || {}, context);
	    }
	  }
	}; // Deprecations

	Raven.prototype.setUser = Raven.prototype.setUserContext;
	Raven.prototype.setReleaseContext = Raven.prototype.setRelease;
	var raven = Raven;

	/**
	 * Enforces a single instance of the Raven client, and the
	 * main entry point for Raven. If you are a consumer of the
	 * Raven library, you SHOULD load this file (vs raven.js).
	 **/
	// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)

	var _window$3 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	var _Raven = _window$3.Raven;
	var Raven$1 = new raven();
	/*
	 * Allow multiple versions of Raven to be installed.
	 * Strip Raven from the global context and returns the instance.
	 *
	 * @return {Raven}
	 */

	Raven$1.noConflict = function () {
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

	var internalFind = arrayMethods(5);
	var FIND = 'find';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return internalFind(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// 1 -> String#trimStart
	// 2 -> String#trimEnd
	// 3 -> String#trim
	var stringTrim = function (string, TYPE) {
	  string = String(requireObjectCoercible(string));
	  if (TYPE & 1) string = string.replace(ltrim, '');
	  if (TYPE & 2) string = string.replace(rtrim, '');
	  return string;
	};

	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$6 = objectDefineProperty.f;


	var NUMBER = 'Number';
	var NativeNumber = global_1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;
	var NATIVE_TRIM = 'trim' in String.prototype;

	// `ToNumber` abstract operation
	// https://tc39.github.io/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, false);
	  var first, third, radix, maxCode, digits, length, i, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = NATIVE_TRIM ? it.trim() : stringTrim(it, 3);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (i = 0; i < length; i++) {
	        code = digits.charCodeAt(i);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.github.io/ecma262/#sec-number-constructor
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var that = this;
	    return that instanceof NumberWrapper
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(that); }) : classofRaw(that) != NUMBER)
	        ? inheritIfRequired(new NativeNumber(toNumber(it)), that, NumberWrapper) : toNumber(it);
	  };
	  for (var keys$2 = descriptors ? getOwnPropertyNames$1(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key; keys$2.length > j; j++) {
	    if (has(NativeNumber, key = keys$2[j]) && !has(NumberWrapper, key)) {
	      defineProperty$6(NumberWrapper, key, getOwnPropertyDescriptor$3(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global_1, NUMBER, NumberWrapper);
	}

	// `Number.isNaN` method
	// https://tc39.github.io/ecma262/#sec-number.isnan
	_export({ target: 'Number', stat: true }, {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare
	    return number != number;
	  }
	});

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	// TO_ENTRIES: true  -> Object.entries
	// TO_ENTRIES: false -> Object.values
	var objectToArray = function (it, TO_ENTRIES) {
	  var O = toIndexedObject(it);
	  var keys = objectKeys(O);
	  var length = keys.length;
	  var i = 0;
	  var result = [];
	  var key;
	  while (length > i) {
	    key = keys[i++];
	    if (!descriptors || propertyIsEnumerable.call(O, key)) {
	      result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	    }
	  }
	  return result;
	};

	// `Object.entries` method
	// https://tc39.github.io/ecma262/#sec-object.entries
	_export({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return objectToArray(O, true);
	  }
	});

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

	function _slicedToArray$1(e, t) {
	  return _arrayWithHoles$1(e) || _iterableToArrayLimit$1(e, t) || _nonIterableRest$1();
	}

	function _arrayWithHoles$1(e) {
	  if (Array.isArray(e)) return e;
	}

	function _iterableToArrayLimit$1(e, t) {
	  var n = [],
	      r = !0,
	      o = !1,
	      i = void 0;

	  try {
	    for (var s, a = e[Symbol.iterator](); !(r = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); r = !0) {
	      ;
	    }
	  } catch (e) {
	    o = !0, i = e;
	  } finally {
	    try {
	      r || null == a.return || a.return();
	    } finally {
	      if (o) throw i;
	    }
	  }

	  return n;
	}

	function _nonIterableRest$1() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
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
	    isObject$3 = function isObject(e) {
	  return getConstructor(e) === Object;
	},
	    isNumber = function isNumber(e) {
	  return getConstructor(e) === Number && !Number.isNaN(e);
	},
	    isString$2 = function isString(e) {
	  return getConstructor(e) === String;
	},
	    isBoolean = function isBoolean(e) {
	  return getConstructor(e) === Boolean;
	},
	    isFunction$2 = function isFunction(e) {
	  return getConstructor(e) === Function;
	},
	    isArray$3 = function isArray(e) {
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
	  return isNullOrUndefined(e) || (isString$2(e) || isArray$3(e) || isNodeList(e)) && !e.length || isObject$3(e) && !Object.keys(e).length;
	},
	    is = {
	  nullOrUndefined: isNullOrUndefined,
	  object: isObject$3,
	  number: isNumber,
	  string: isString$2,
	  boolean: isBoolean,
	  function: isFunction$2,
	  array: isArray$3,
	  nodeList: isNodeList,
	  element: isElement,
	  event: isEvent,
	  empty: isEmpty
	},
	    constants = {
	  facebook: {
	    domain: "facebook.com",
	    url: function url(e) {
	      return "https://graph.facebook.com/?id=".concat(e, "&fields=og_object{engagement}");
	    },
	    shareCount: function shareCount(e) {
	      return e.og_object.engagement.count;
	    },
	    popup: {
	      width: 640,
	      height: 360
	    }
	  },
	  twitter: {
	    domain: "twitter.com",
	    url: function url() {
	      return null;
	    },
	    shareCount: function shareCount() {
	      return null;
	    },
	    popup: {
	      width: 640,
	      height: 240
	    }
	  },
	  pinterest: {
	    domain: "pinterest.com",
	    url: function url(e) {
	      return "https://widgets.pinterest.com/v1/urls/count.json?url=".concat(e);
	    },
	    shareCount: function shareCount(e) {
	      return e.count;
	    },
	    popup: {
	      width: 830,
	      height: 700
	    }
	  },
	  github: {
	    domain: "github.com",
	    url: function url(e, t) {
	      return "https://api.github.com/repos/".concat(e).concat(is.string(t) ? "?access_token=".concat(t) : "");
	    },
	    shareCount: function shareCount(e) {
	      return e.data.stargazers_count;
	    }
	  },
	  youtube: {
	    domain: "youtube.com",
	    url: function url(e, t) {
	      return "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=".concat(e, "&key=").concat(t);
	    },
	    shareCount: function shareCount(e) {
	      if (!is.empty(e.error)) return null;

	      var t = _slicedToArray$1(e.items, 1)[0];

	      return is.empty(t) ? null : t.statistics.subscriberCount;
	    }
	  }
	},
	    defaults = {
	  debug: !1,
	  wrapper: {
	    className: "shr"
	  },
	  count: {
	    className: "shr__count",
	    displayZero: !1,
	    format: !0,
	    position: "after",
	    increment: !0
	  },
	  tokens: {
	    github: "",
	    youtube: ""
	  },
	  storage: {
	    enabled: !0,
	    key: "shr",
	    ttl: 3e5
	  }
	};

	function getJSONP(e) {
	  return new Promise(function (t, n) {
	    var r = "jsonp_callback_".concat(Math.round(1e5 * Math.random())),
	        o = document.createElement("script");
	    o.addEventListener("error", function (e) {
	      return n(e);
	    }), window[r] = function (e) {
	      delete window[r], document.body.removeChild(o), t(e);
	    };
	    var i = new URL(e);
	    i.searchParams.set("callback", r), o.setAttribute("src", i.toString()), document.body.appendChild(o);
	  });
	}

	var noop = function noop() {},
	    Console = function () {
	  function e() {
	    var t = !!(0 < arguments.length && void 0 !== arguments[0]) && arguments[0];
	    _classCallCheck$1(this, e), this.enabled = window.console && t, this.enabled && this.log("Debugging enabled");
	  }

	  return _createClass$1(e, [{
	    key: "log",
	    get: function get() {
	      return this.enabled ? Function.prototype.bind.call(console.log, console) : noop;
	    }
	  }, {
	    key: "warn",
	    get: function get() {
	      return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop;
	    }
	  }, {
	    key: "error",
	    get: function get() {
	      return this.enabled ? Function.prototype.bind.call(console.error, console) : noop;
	    }
	  }]), e;
	}();

	function matches(e, t) {
	  return function () {
	    return Array.from(document.querySelectorAll(t)).includes(this);
	  }.call(e, t);
	}

	function wrap$1(e, t) {
	  var n = e.length ? e : [e];
	  Array.from(n).reverse().forEach(function (e, n) {
	    var r = 0 < n ? t.cloneNode(!0) : t,
	        o = e.parentNode,
	        i = e.nextSibling;
	    r.appendChild(e), i ? o.insertBefore(r, i) : o.appendChild(r);
	  });
	}

	function setAttributes(e, t) {
	  !is.element(e) || is.empty(t) || Object.entries(t).filter(function (e) {
	    var t = _slicedToArray$1(e, 2)[1];

	    return !is.nullOrUndefined(t);
	  }).forEach(function (t) {
	    var n = _slicedToArray$1(t, 2),
	        r = n[0],
	        o = n[1];

	    return e.setAttribute(r, o);
	  });
	}

	function createElement(e, t, n) {
	  var r = document.createElement(e);
	  return is.object(t) && setAttributes(r, t), is.string(n) && (r.innerText = n), r;
	}

	function formatNumber(e) {
	  var t = /\./.test(1.1.toLocaleString()) ? "." : ",",
	      n = new RegExp("\\".concat(t, "\\d+$"));
	  return Math.round(e).toLocaleString().replace(n, "");
	}

	function extend() {
	  for (var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, t = arguments.length, n = Array(1 < t ? t - 1 : 0), r = 1; r < t; r++) {
	    n[r - 1] = arguments[r];
	  }

	  if (!n.length) return e;
	  var o = n.shift();
	  return is.object(o) ? (Object.keys(o).forEach(function (t) {
	    is.object(o[t]) ? (!Object.keys(e).includes(t) && Object.assign(e, _defineProperty$1({}, t, {})), extend(e[t], o[t])) : Object.assign(e, _defineProperty$1({}, t, o[t]));
	  }), extend.apply(void 0, [e].concat(n))) : e;
	}

	var Storage = function () {
	  function e(t, n) {
	    var r = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2];
	    _classCallCheck$1(this, e), this.enabled = r && e.supported, this.key = t, this.ttl = n;
	  }

	  return _createClass$1(e, [{
	    key: "get",
	    value: function value(t) {
	      if (!e.supported || !this.enabled) return null;
	      var n = window.localStorage.getItem(this.key);
	      if (is.empty(n)) return null;
	      var r = window.localStorage.getItem("".concat(this.key, "_ttl"));
	      if (is.empty(r) || r < Date.now()) return null;
	      var o = JSON.parse(n);
	      return is.string(t) && t.length ? o[t] : o;
	    }
	  }, {
	    key: "set",
	    value: function value(t) {
	      if (e.supported && this.enabled && is.object(t)) {
	        var n = this.get();
	        is.empty(n) && (n = {}), extend(n, t), window.localStorage.setItem(this.key, JSON.stringify(n)), window.localStorage.setItem("".concat(this.key, "_ttl"), Date.now() + this.ttl);
	      }
	    }
	  }], [{
	    key: "supported",
	    get: function get() {
	      try {
	        return "localStorage" in window && (window.localStorage.setItem("___test", "___test"), window.localStorage.removeItem("___test"), !0);
	      } catch (e) {
	        return !1;
	      }
	    }
	  }]), e;
	}();

	function getDomain(e) {
	  var t = new URL(e).hostname,
	      n = t.split("."),
	      r = n.length;
	  return 2 < r && (t = "".concat(n[r - 2], ".").concat(n[r - 1]), 2 === n[r - 2].length && 2 === n[r - 1].length && (t = "".concat(n[r - 3], ".").concat(t))), t;
	}

	var Shr = function () {
	  function e(t, n) {
	    var r = this;
	    _classCallCheck$1(this, e), this.elements = {
	      count: null,
	      trigger: null,
	      popup: null
	    }, is.element(t) ? this.elements.trigger = t : is.string(t) && (this.elements.trigger = document.querySelector(t)), is.element(this.elements.trigger) && is.empty(this.elements.trigger.shr) && (this.config = extend({}, defaults, n, {
	      networks: constants
	    }), this.console = new Console(this.config.debug), this.storage = new Storage(this.config.storage.key, this.config.storage.ttl, this.config.storage.enabled), this.getCount().then(function (e) {
	      return r.updateDisplay(e);
	    }).catch(function () {}), this.listeners(!0), this.elements.trigger.shr = this);
	  }

	  return _createClass$1(e, [{
	    key: "destroy",
	    value: function value() {
	      this.listeners(!1);
	    }
	  }, {
	    key: "listeners",
	    value: function value() {
	      var e = this,
	          t = !!(0 < arguments.length && void 0 !== arguments[0]) && arguments[0] ? "addEventListener" : "removeEventListener";
	      this.elements.trigger[t]("click", function (t) {
	        return e.share(t);
	      }, !1);
	    }
	  }, {
	    key: "share",
	    value: function value(e) {
	      var t = this;
	      this.openPopup(e);
	      var n = this.config.count.increment;
	      this.getCount().then(function (e) {
	        return t.updateDisplay(e, n);
	      }).catch(function () {});
	    }
	  }, {
	    key: "openPopup",
	    value: function value(e) {
	      if (!is.empty(this.network) && this.networkConfig.popup) {
	        is.event(e) && e.preventDefault();
	        var t = this.networkConfig.popup,
	            n = t.width,
	            r = t.height,
	            o = "shr-popup--".concat(this.network);
	        if (this.popup && !this.popup.closed) this.popup.focus(), this.console.log("Popup re-focused.");else {
	          var i = void 0 === window.screenLeft ? window.screen.left : window.screenLeft,
	              s = void 0 === window.screenTop ? window.screen.top : window.screenTop,
	              a = window.screen.width / 2 - n / 2 + i,
	              c = window.screen.height / 2 - r / 2 + s;
	          this.popup = window.open(this.href, o, "top=".concat(c, ",left=").concat(a, ",width=").concat(n, ",height=").concat(r)), !this.popup || this.popup.closed || !is.boolean(this.popup.closed) ? this.console.error("Popup blocked.") : (this.popup.focus(), this.console.log("Popup opened."));
	        }
	      }
	    }
	  }, {
	    key: "getCount",
	    value: function value() {
	      var e = this,
	          t = !(0 < arguments.length && void 0 !== arguments[0]) || arguments[0];
	      return new Promise(function (n, r) {
	        var o = e.apiUrl;
	        if (is.empty(o)) r(new Error("No URL available for ".concat(e.network, ".")));else {
	          if (t) {
	            var i = e.storage.get(e.target);

	            if (!is.empty(i) && Object.keys(i).includes(e.network)) {
	              var s = i[e.network];
	              return n(is.number(s) ? s : 0), void e.console.log("getCount for '".concat(e.target, "' for '").concat(e.network, "' resolved from cache."));
	            }
	          }

	          getJSONP(o).then(function (t) {
	            var r = 0,
	                o = e.elements.trigger.getAttribute("data-shr-display");
	            r = is.empty(o) ? e.networkConfig.shareCount(t) : t[o], is.empty(r) ? r = 0 : (r = parseInt(r, 10), !is.number(r) && (r = 0)), e.storage.set(_defineProperty$1({}, e.target, _defineProperty$1({}, e.network, r))), n(r);
	          }).catch(r);
	        }
	      });
	    }
	  }, {
	    key: "updateDisplay",
	    value: function value(e) {
	      var t = !!(1 < arguments.length && void 0 !== arguments[1]) && arguments[1],
	          n = this.config,
	          r = n.count,
	          o = n.wrapper,
	          i = t ? e + 1 : e,
	          s = r.position.toLowerCase();

	      if (0 < i || r.displayZero) {
	        var a = function a(e) {
	          return Math.round(i / e * 10) / 10;
	        },
	            c = formatNumber(i);

	        r.format && (1e6 < i ? c = "".concat(a(1e6), "M") : 1e3 < i && (c = "".concat(a(1e3), "K"))), is.element(this.elements.count) ? this.elements.count.textContent = c : (wrap$1(this.elements.trigger, createElement("span", {
	          class: o.className
	        })), this.elements.count = createElement("span", {
	          class: "".concat(r.className, " ").concat(r.className, "--").concat(s)
	        }, c), this.elements.trigger.insertAdjacentElement("after" === s ? "afterend" : "beforebegin", this.elements.count));
	      }
	    }
	  }, {
	    key: "href",
	    get: function get() {
	      return is.element(this.elements.trigger) ? this.elements.trigger.href : null;
	    }
	  }, {
	    key: "network",
	    get: function get() {
	      var e = this;
	      if (!is.element(this.elements.trigger)) return null;
	      var t = this.config.networks;
	      return Object.keys(t).find(function (n) {
	        return getDomain(e.href) === t[n].domain;
	      });
	    }
	  }, {
	    key: "networkConfig",
	    get: function get() {
	      return is.empty(this.network) ? null : this.config.networks[this.network];
	    }
	  }, {
	    key: "target",
	    get: function get() {
	      if (is.empty(this.network)) return null;
	      var e = new URL(this.href);

	      switch (this.network) {
	        case "facebook":
	          return e.searchParams.get("u");

	        case "github":
	          return e.pathname.substring(1);

	        case "youtube":
	          return e.pathname.split("/").pop();

	        default:
	          return e.searchParams.get("url");
	      }
	    }
	  }, {
	    key: "apiUrl",
	    get: function get() {
	      if (is.empty(this.network)) return null;
	      var e = this.config.tokens;

	      switch (this.network) {
	        case "github":
	          return this.networkConfig.url(this.target, e.github);

	        case "youtube":
	          return this.networkConfig.url(this.target, e.youtube);

	        default:
	          return this.networkConfig.url(encodeURIComponent(this.target));
	      }
	    }
	  }], [{
	    key: "setup",
	    value: function value(t) {
	      var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
	          r = null;
	      if (is.string(t) ? r = Array.from(document.querySelectorAll(t)) : is.element(t) ? r = [t] : is.nodeList(t) ? r = Array.from(t) : is.array(t) && (r = t.filter(is.element)), is.empty(r)) return null;
	      var o = Object.assign({}, defaults, n);
	      is.string(t) && o.watch && new MutationObserver(function (n) {
	        Array.from(n).forEach(function (n) {
	          Array.from(n.addedNodes).forEach(function (n) {
	            is.element(n) && matches(n, t) && new e(n, o);
	          });
	        });
	      }).observe(document.body, {
	        childList: !0,
	        subtree: !0
	      });
	      return r.map(function (t) {
	        return new e(t, n);
	      });
	    }
	  }]), e;
	}();

	var O$1 = 'object';
	var check$1 = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1$1 =
	  // eslint-disable-next-line no-undef
	  check$1(typeof globalThis == O$1 && globalThis) ||
	  check$1(typeof window == O$1 && window) ||
	  check$1(typeof self == O$1 && self) ||
	  check$1(typeof commonjsGlobal == O$1 && commonjsGlobal) ||
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
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var nativePropertyIsEnumerable$2 = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor$4 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG$1 = getOwnPropertyDescriptor$4 && !nativePropertyIsEnumerable$2.call({ 1: 2 }, 1);

	var f$8 = NASHORN_BUG$1 ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$4(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable$2;

	var objectPropertyIsEnumerable$1 = {
		f: f$8
	};

	var createPropertyDescriptor$1 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString$2 = {}.toString;

	var classofRaw$1 = function (it) {
	  return toString$2.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings



	var split$1 = ''.split;

	var indexedObject$1 = fails$1(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw$1(it) == 'String' ? split$1.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$1 = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject$1 = function (it) {
	  return indexedObject$1(requireObjectCoercible$1(it));
	};

	var isObject$4 = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// 7.1.1 ToPrimitive(input [, PreferredType])
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive$1 = function (it, S) {
	  if (!isObject$4(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject$4(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject$4(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject$4(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty$1 = {}.hasOwnProperty;

	var has$2 = function (it, key) {
	  return hasOwnProperty$1.call(it, key);
	};

	var document$4 = global_1$1.document;
	// typeof document.createElement is 'object' in old IE
	var exist$1 = isObject$4(document$4) && isObject$4(document$4.createElement);

	var documentCreateElement$1 = function (it) {
	  return exist$1 ? document$4.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine$1 = !descriptors$1 && !fails$1(function () {
	  return Object.defineProperty(documentCreateElement$1('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

	var f$9 = descriptors$1 ? nativeGetOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$1(O);
	  P = toPrimitive$1(P, true);
	  if (ie8DomDefine$1) try {
	    return nativeGetOwnPropertyDescriptor$2(O, P);
	  } catch (error) { /* empty */ }
	  if (has$2(O, P)) return createPropertyDescriptor$1(!objectPropertyIsEnumerable$1.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor$1 = {
		f: f$9
	};

	var anObject$1 = function (it) {
	  if (!isObject$4(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty$2 = Object.defineProperty;

	var f$a = descriptors$1 ? nativeDefineProperty$2 : function defineProperty(O, P, Attributes) {
	  anObject$1(O);
	  P = toPrimitive$1(P, true);
	  anObject$1(Attributes);
	  if (ie8DomDefine$1) try {
	    return nativeDefineProperty$2(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty$1 = {
		f: f$a
	};

	var hide$1 = descriptors$1 ? function (object, key, value) {
	  return objectDefineProperty$1.f(object, key, createPropertyDescriptor$1(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal$1 = function (key, value) {
	  try {
	    hide$1(global_1$1, key, value);
	  } catch (error) {
	    global_1$1[key] = value;
	  } return value;
	};

	var isPure$1 = false;

	var shared$1 = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = global_1$1[SHARED] || setGlobal$1(SHARED, {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.1.3',
	  mode: 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var functionToString$1 = shared$1('native-function-to-string', Function.toString);

	var WeakMap$3 = global_1$1.WeakMap;

	var nativeWeakMap$1 = typeof WeakMap$3 === 'function' && /native code/.test(functionToString$1.call(WeakMap$3));

	var id$1 = 0;
	var postfix$1 = Math.random();

	var uid$1 = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$1 + postfix$1).toString(36));
	};

	var keys$3 = shared$1('keys');

	var sharedKey$1 = function (key) {
	  return keys$3[key] || (keys$3[key] = uid$1(key));
	};

	var hiddenKeys$2 = {};

	var WeakMap$4 = global_1$1.WeakMap;
	var set$2, get$1, has$3;

	var enforce$1 = function (it) {
	  return has$3(it) ? get$1(it) : set$2(it, {});
	};

	var getterFor$1 = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject$4(it) || (state = get$1(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap$1) {
	  var store$2 = new WeakMap$4();
	  var wmget$1 = store$2.get;
	  var wmhas$1 = store$2.has;
	  var wmset$1 = store$2.set;
	  set$2 = function (it, metadata) {
	    wmset$1.call(store$2, it, metadata);
	    return metadata;
	  };
	  get$1 = function (it) {
	    return wmget$1.call(store$2, it) || {};
	  };
	  has$3 = function (it) {
	    return wmhas$1.call(store$2, it);
	  };
	} else {
	  var STATE$1 = sharedKey$1('state');
	  hiddenKeys$2[STATE$1] = true;
	  set$2 = function (it, metadata) {
	    hide$1(it, STATE$1, metadata);
	    return metadata;
	  };
	  get$1 = function (it) {
	    return has$2(it, STATE$1) ? it[STATE$1] : {};
	  };
	  has$3 = function (it) {
	    return has$2(it, STATE$1);
	  };
	}

	var internalState$1 = {
	  set: set$2,
	  get: get$1,
	  has: has$3,
	  enforce: enforce$1,
	  getterFor: getterFor$1
	};

	var redefine$1 = createCommonjsModule(function (module) {
	var getInternalState = internalState$1.get;
	var enforceInternalState = internalState$1.enforce;
	var TEMPLATE = String(functionToString$1).split('toString');

	shared$1('inspectSource', function (it) {
	  return functionToString$1.call(it);
	});

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has$2(value, 'name')) hide$1(value, 'name', key);
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
	  else hide$1(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || functionToString$1.call(this);
	});
	});

	var ceil$1 = Math.ceil;
	var floor$3 = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger$1 = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$3 : ceil$1)(argument);
	};

	var min$5 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength$1 = function (argument) {
	  return argument > 0 ? min$5(toInteger$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max$4 = Math.max;
	var min$6 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toInteger$1(index);
	  return integer < 0 ? max$4(integer + length, 0) : min$6(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	// false -> Array#indexOf
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	// true  -> Array#includes
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	var arrayIncludes$2 = function (IS_INCLUDES) {
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
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIndexOf$2 = arrayIncludes$2(false);

	var objectKeysInternal$1 = function (object, names) {
	  var O = toIndexedObject$1(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has$2(hiddenKeys$2, key) && has$2(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has$2(O, key = names[i++])) {
	    ~arrayIndexOf$2(result, key) || result.push(key);
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

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)



	var hiddenKeys$3 = enumBugKeys$1.concat('length', 'prototype');

	var f$b = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal$1(O, hiddenKeys$3);
	};

	var objectGetOwnPropertyNames$1 = {
		f: f$b
	};

	var f$c = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols$1 = {
		f: f$c
	};

	var Reflect$1 = global_1$1.Reflect;

	// all object keys, includes non-enumerable and symbols
	var ownKeys$1 = Reflect$1 && Reflect$1.ownKeys || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames$1.f(anObject$1(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols$1.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties$1 = function (target, source) {
	  var keys = ownKeys$1(source);
	  var defineProperty = objectDefineProperty$1.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor$1.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has$2(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
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

	var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor$1.f;






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
	      descriptor = getOwnPropertyDescriptor$5(target, key);
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
	      hide$1(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine$1(target, key, sourceProperty, options);
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray$4 = Array.isArray || function isArray(arg) {
	  return classofRaw$1(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject$1 = function (argument) {
	  return Object(requireObjectCoercible$1(argument));
	};

	var createProperty$1 = function (object, key, value) {
	  var propertyKey = toPrimitive$1(key);
	  if (propertyKey in object) objectDefineProperty$1.f(object, propertyKey, createPropertyDescriptor$1(0, value));
	  else object[propertyKey] = value;
	};

	var nativeSymbol$1 = !!Object.getOwnPropertySymbols && !fails$1(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var Symbol$2 = global_1$1.Symbol;
	var store$3 = shared$1('wks');

	var wellKnownSymbol$1 = function (name) {
	  return store$3[name] || (store$3[name] = nativeSymbol$1 && Symbol$2[name]
	    || (nativeSymbol$1 ? Symbol$2 : uid$1)('Symbol.' + name));
	};

	var SPECIES$7 = wellKnownSymbol$1('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate$1 = function (originalArray, length) {
	  var C;
	  if (isArray$4(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray$4(C.prototype))) C = undefined;
	    else if (isObject$4(C)) {
	      C = C[SPECIES$7];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var SPECIES$8 = wellKnownSymbol$1('species');

	var arrayMethodHasSpeciesSupport$1 = function (METHOD_NAME) {
	  return !fails$1(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$8] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE$1 = wellKnownSymbol$1('isConcatSpreadable');
	var MAX_SAFE_INTEGER$2 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED$1 = 'Maximum allowed index exceeded';

	var IS_CONCAT_SPREADABLE_SUPPORT$1 = !fails$1(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE$1] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT$5 = arrayMethodHasSpeciesSupport$1('concat');

	var isConcatSpreadable$1 = function (O) {
	  if (!isObject$4(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE$1];
	  return spreadable !== undefined ? !!spreadable : isArray$4(O);
	};

	var FORCED$6 = !IS_CONCAT_SPREADABLE_SUPPORT$1 || !SPECIES_SUPPORT$5;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export$1({ target: 'Array', proto: true, forced: FORCED$6 }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject$1(this);
	    var A = arraySpeciesCreate$1(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable$1(E)) {
	        len = toLength$1(E.length);
	        if (n + len > MAX_SAFE_INTEGER$2) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED$1);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty$1(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER$2) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED$1);
	        createProperty$1(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var aFunction$2 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var bindContext$1 = function (fn, that, length) {
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

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	// 0 -> Array#forEach
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	// 1 -> Array#map
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// 2 -> Array#filter
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// 3 -> Array#some
	// https://tc39.github.io/ecma262/#sec-array.prototype.some
	// 4 -> Array#every
	// https://tc39.github.io/ecma262/#sec-array.prototype.every
	// 5 -> Array#find
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	// 6 -> Array#findIndex
	// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	var arrayMethods$1 = function (TYPE, specificCreate) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = specificCreate || arraySpeciesCreate$1;
	  return function ($this, callbackfn, that) {
	    var O = toObject$1($this);
	    var self = indexedObject$1(O);
	    var boundFunction = bindContext$1(callbackfn, that, 3);
	    var length = toLength$1(self.length);
	    var index = 0;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: target.push(value);       // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var internalFilter$1 = arrayMethods$1(2);
	var SPECIES_SUPPORT$6 = arrayMethodHasSpeciesSupport$1('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export$1({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$6 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return internalFilter$1(this, callbackfn, arguments[1]);
	  }
	});

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var objectKeys$1 = Object.keys || function keys(O) {
	  return objectKeysInternal$1(O, enumBugKeys$1);
	};

	var objectDefineProperties$1 = descriptors$1 ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$1(O);
	  var keys = objectKeys$1(Properties);
	  var length = keys.length;
	  var i = 0;
	  var key;
	  while (length > i) objectDefineProperty$1.f(O, key = keys[i++], Properties[key]);
	  return O;
	};

	var document$5 = global_1$1.document;

	var html$1 = document$5 && document$5.documentElement;

	var IE_PROTO$2 = sharedKey$1('IE_PROTO');

	var PROTOTYPE$2 = 'prototype';
	var Empty$1 = function () { /* empty */ };

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict$1 = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement$1('iframe');
	  var length = enumBugKeys$1.length;
	  var lt = '<';
	  var script = 'script';
	  var gt = '>';
	  var js = 'java' + script + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html$1.appendChild(iframe);
	  iframe.src = String(js);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
	  iframeDocument.close();
	  createDict$1 = iframeDocument.F;
	  while (length--) delete createDict$1[PROTOTYPE$2][enumBugKeys$1[length]];
	  return createDict$1();
	};

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var objectCreate$1 = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty$1[PROTOTYPE$2] = anObject$1(O);
	    result = new Empty$1();
	    Empty$1[PROTOTYPE$2] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$2] = O;
	  } else result = createDict$1();
	  return Properties === undefined ? result : objectDefineProperties$1(result, Properties);
	};

	hiddenKeys$2[IE_PROTO$2] = true;

	var UNSCOPABLES$1 = wellKnownSymbol$1('unscopables');
	var ArrayPrototype$2 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$2[UNSCOPABLES$1] == undefined) {
	  hide$1(ArrayPrototype$2, UNSCOPABLES$1, objectCreate$1(null));
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables$1 = function (key) {
	  ArrayPrototype$2[UNSCOPABLES$1][key] = true;
	};

	var internalFind$1 = arrayMethods$1(5);
	var FIND$1 = 'find';
	var SKIPS_HOLES$1 = true;

	// Shouldn't skip holes
	if (FIND$1 in []) Array(1)[FIND$1](function () { SKIPS_HOLES$1 = false; });

	// `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	_export$1({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return internalFind$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$1(FIND$1);

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

	var iterators$1 = {};

	var ITERATOR$9 = wellKnownSymbol$1('iterator');
	var ArrayPrototype$3 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod$1 = function (it) {
	  return it !== undefined && (iterators$1.Array === it || ArrayPrototype$3[ITERATOR$9] === it);
	};

	var TO_STRING_TAG$5 = wellKnownSymbol$1('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS$1 = classofRaw$1(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet$1 = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$1 = function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet$1(O = Object(it), TO_STRING_TAG$5)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS$1 ? classofRaw$1(O)
	    // ES3 arguments fallback
	    : (result = classofRaw$1(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	var ITERATOR$a = wellKnownSymbol$1('iterator');

	var getIteratorMethod$1 = function (it) {
	  if (it != undefined) return it[ITERATOR$a]
	    || it['@@iterator']
	    || iterators$1[classof$1(it)];
	};

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom$1 = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject$1(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var index = 0;
	  var iteratorMethod = getIteratorMethod$1(O);
	  var length, result, step, iterator;
	  if (mapping) mapfn = bindContext$1(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod$1(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    result = new C();
	    for (;!(step = iterator.next()).done; index++) {
	      createProperty$1(result, index, mapping
	        ? callWithSafeIterationClosing$1(iterator, mapfn, [step.value, index], true)
	        : step.value
	      );
	    }
	  } else {
	    length = toLength$1(O.length);
	    result = new C(length);
	    for (;length > index; index++) {
	      createProperty$1(result, index, mapping ? mapfn(O[index], index) : O[index]);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$b = wellKnownSymbol$1('iterator');
	var SAFE_CLOSING$1 = false;

	try {
	  var called$1 = 0;
	  var iteratorWithReturn$1 = {
	    next: function () {
	      return { done: !!called$1++ };
	    },
	    'return': function () {
	      SAFE_CLOSING$1 = true;
	    }
	  };
	  iteratorWithReturn$1[ITERATOR$b] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn$1, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration$1 = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING$1) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$b] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION$2 = !checkCorrectnessOfIteration$1(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export$1({ target: 'Array', stat: true, forced: INCORRECT_ITERATION$2 }, {
	  from: arrayFrom$1
	});

	var internalIncludes$1 = arrayIncludes$2(true);

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export$1({ target: 'Array', proto: true }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return internalIncludes$1(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$1('includes');

	var correctPrototypeGetter$1 = !fails$1(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$3 = sharedKey$1('IE_PROTO');
	var ObjectPrototype$4 = Object.prototype;

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var objectGetPrototypeOf$1 = correctPrototypeGetter$1 ? Object.getPrototypeOf : function (O) {
	  O = toObject$1(O);
	  if (has$2(O, IE_PROTO$3)) return O[IE_PROTO$3];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype$4 : null;
	};

	var ITERATOR$c = wellKnownSymbol$1('iterator');
	var BUGGY_SAFARI_ITERATORS$2 = false;

	var returnThis$3 = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$3, PrototypeOfArrayIteratorPrototype$1, arrayIterator$1;

	if ([].keys) {
	  arrayIterator$1 = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator$1)) BUGGY_SAFARI_ITERATORS$2 = true;
	  else {
	    PrototypeOfArrayIteratorPrototype$1 = objectGetPrototypeOf$1(objectGetPrototypeOf$1(arrayIterator$1));
	    if (PrototypeOfArrayIteratorPrototype$1 !== Object.prototype) IteratorPrototype$3 = PrototypeOfArrayIteratorPrototype$1;
	  }
	}

	if (IteratorPrototype$3 == undefined) IteratorPrototype$3 = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if (!has$2(IteratorPrototype$3, ITERATOR$c)) hide$1(IteratorPrototype$3, ITERATOR$c, returnThis$3);

	var iteratorsCore$1 = {
	  IteratorPrototype: IteratorPrototype$3,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$2
	};

	var defineProperty$7 = objectDefineProperty$1.f;



	var TO_STRING_TAG$6 = wellKnownSymbol$1('toStringTag');

	var setToStringTag$1 = function (it, TAG, STATIC) {
	  if (it && !has$2(it = STATIC ? it : it.prototype, TO_STRING_TAG$6)) {
	    defineProperty$7(it, TO_STRING_TAG$6, { configurable: true, value: TAG });
	  }
	};

	var IteratorPrototype$4 = iteratorsCore$1.IteratorPrototype;





	var returnThis$4 = function () { return this; };

	var createIteratorConstructor$1 = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate$1(IteratorPrototype$4, { next: createPropertyDescriptor$1(1, next) });
	  setToStringTag$1(IteratorConstructor, TO_STRING_TAG, false);
	  iterators$1[TO_STRING_TAG] = returnThis$4;
	  return IteratorConstructor;
	};

	var validateSetPrototypeOfArguments$1 = function (O, proto) {
	  anObject$1(O);
	  if (!isObject$4(proto) && proto !== null) {
	    throw TypeError("Can't set " + String(proto) + ' as a prototype');
	  }
	};

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf$1 = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var correctSetter = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    correctSetter = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    validateSetPrototypeOfArguments$1(O, proto);
	    if (correctSetter) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$5 = iteratorsCore$1.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$3 = iteratorsCore$1.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$d = wellKnownSymbol$1('iterator');
	var KEYS$1 = 'keys';
	var VALUES$1 = 'values';
	var ENTRIES$1 = 'entries';

	var returnThis$5 = function () { return this; };

	var defineIterator$1 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor$1(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$3 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS$1: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES$1: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES$1: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$d]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$3 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf$1(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$5 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (objectGetPrototypeOf$1(CurrentIteratorPrototype) !== IteratorPrototype$5) {
	        if (objectSetPrototypeOf$1) {
	          objectSetPrototypeOf$1(CurrentIteratorPrototype, IteratorPrototype$5);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$d] != 'function') {
	          hide$1(CurrentIteratorPrototype, ITERATOR$d, returnThis$5);
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
	  if (IterablePrototype[ITERATOR$d] !== defaultIterator) {
	    hide$1(IterablePrototype, ITERATOR$d, defaultIterator);
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
	      if (BUGGY_SAFARI_ITERATORS$3 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine$1(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export$1({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$3 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR$1 = 'Array Iterator';
	var setInternalState$6 = internalState$1.set;
	var getInternalState$4 = internalState$1.getterFor(ARRAY_ITERATOR$1);

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
	var es_array_iterator$1 = defineIterator$1(Array, 'Array', function (iterated, kind) {
	  setInternalState$6(this, {
	    type: ARRAY_ITERATOR$1,
	    target: toIndexedObject$1(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$4(this);
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

	var sloppyArrayMethod$1 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !method || !fails$1(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var nativeJoin$1 = [].join;

	var ES3_STRINGS$1 = indexedObject$1 != Object;
	var SLOPPY_METHOD$3 = sloppyArrayMethod$1('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	_export$1({ target: 'Array', proto: true, forced: ES3_STRINGS$1 || SLOPPY_METHOD$3 }, {
	  join: function join(separator) {
	    return nativeJoin$1.call(toIndexedObject$1(this), separator === undefined ? ',' : separator);
	  }
	});

	var internalMap$1 = arrayMethods$1(1);
	var SPECIES_SUPPORT$7 = arrayMethodHasSpeciesSupport$1('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export$1({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$7 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return internalMap$1(this, callbackfn, arguments[1]);
	  }
	});

	var inheritIfRequired$1 = function (that, target, C) {
	  var S = target.constructor;
	  var P;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject$4(P) && objectSetPrototypeOf$1) {
	    objectSetPrototypeOf$1(that, P);
	  } return that;
	};

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces$1 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace$1 = '[' + whitespaces$1 + ']';
	var ltrim$1 = RegExp('^' + whitespace$1 + whitespace$1 + '*');
	var rtrim$1 = RegExp(whitespace$1 + whitespace$1 + '*$');

	// 1 -> String#trimStart
	// 2 -> String#trimEnd
	// 3 -> String#trim
	var stringTrim$1 = function (string, TYPE) {
	  string = String(requireObjectCoercible$1(string));
	  if (TYPE & 1) string = string.replace(ltrim$1, '');
	  if (TYPE & 2) string = string.replace(rtrim$1, '');
	  return string;
	};

	var getOwnPropertyNames$2 = objectGetOwnPropertyNames$1.f;
	var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor$1.f;
	var defineProperty$8 = objectDefineProperty$1.f;


	var NUMBER$1 = 'Number';
	var NativeNumber$1 = global_1$1[NUMBER$1];
	var NumberPrototype$1 = NativeNumber$1.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF$1 = classofRaw$1(objectCreate$1(NumberPrototype$1)) == NUMBER$1;
	var NATIVE_TRIM$1 = 'trim' in String.prototype;

	// `ToNumber` abstract operation
	// https://tc39.github.io/ecma262/#sec-tonumber
	var toNumber$1 = function (argument) {
	  var it = toPrimitive$1(argument, false);
	  var first, third, radix, maxCode, digits, length, i, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = NATIVE_TRIM$1 ? it.trim() : stringTrim$1(it, 3);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (i = 0; i < length; i++) {
	        code = digits.charCodeAt(i);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.github.io/ecma262/#sec-number-constructor
	if (isForced_1$1(NUMBER$1, !NativeNumber$1(' 0o1') || !NativeNumber$1('0b1') || NativeNumber$1('+0x1'))) {
	  var NumberWrapper$1 = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var that = this;
	    return that instanceof NumberWrapper$1
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF$1 ? fails$1(function () { NumberPrototype$1.valueOf.call(that); }) : classofRaw$1(that) != NUMBER$1)
	        ? inheritIfRequired$1(new NativeNumber$1(toNumber$1(it)), that, NumberWrapper$1) : toNumber$1(it);
	  };
	  for (var keys$4 = descriptors$1 ? getOwnPropertyNames$2(NativeNumber$1) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j$1 = 0, key$1; keys$4.length > j$1; j$1++) {
	    if (has$2(NativeNumber$1, key$1 = keys$4[j$1]) && !has$2(NumberWrapper$1, key$1)) {
	      defineProperty$8(NumberWrapper$1, key$1, getOwnPropertyDescriptor$6(NativeNumber$1, key$1));
	    }
	  }
	  NumberWrapper$1.prototype = NumberPrototype$1;
	  NumberPrototype$1.constructor = NumberWrapper$1;
	  redefine$1(global_1$1, NUMBER$1, NumberWrapper$1);
	}

	var FAILS_ON_PRIMITIVES$2 = fails$1(function () { objectKeys$1(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export$1({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
	  keys: function keys(it) {
	    return objectKeys$1(toObject$1(it));
	  }
	});

	var TO_STRING_TAG$7 = wellKnownSymbol$1('toStringTag');
	var test$1 = {};

	test$1[TO_STRING_TAG$7] = 'z';

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString$1 = String(test$1) !== '[object z]' ? function toString() {
	  return '[object ' + classof$1(this) + ']';
	} : test$1.toString;

	var ObjectPrototype$5 = Object.prototype;

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (objectToString$1 !== ObjectPrototype$5.toString) {
	  redefine$1(ObjectPrototype$5, 'toString', objectToString$1, { unsafe: true });
	}

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags$1 = function () {
	  var that = anObject$1(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING$1 = 'toString';
	var nativeToString$1 = /./[TO_STRING$1];
	var RegExpPrototype$2 = RegExp.prototype;

	var NOT_GENERIC$1 = fails$1(function () { return nativeToString$1.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME$1 = nativeToString$1.name != TO_STRING$1;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC$1 || INCORRECT_NAME$1) {
	  redefine$1(RegExp.prototype, TO_STRING$1, function toString() {
	    var R = anObject$1(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$2) ? regexpFlags$1.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var MATCH$3 = wellKnownSymbol$1('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp$1 = function (it) {
	  var isRegExp;
	  return isObject$4(it) && ((isRegExp = it[MATCH$3]) !== undefined ? !!isRegExp : classofRaw$1(it) == 'RegExp');
	};

	// helper for String#{startsWith, endsWith, includes}



	var validateStringMethodArguments$1 = function (that, searchString, NAME) {
	  if (isRegexp$1(searchString)) {
	    throw TypeError('String.prototype.' + NAME + " doesn't accept regex");
	  } return String(requireObjectCoercible$1(that));
	};

	var MATCH$4 = wellKnownSymbol$1('match');

	var correctIsRegexpLogic$1 = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$4] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export$1({ target: 'String', proto: true, forced: !correctIsRegexpLogic$1('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~validateStringMethodArguments$1(this, searchString, 'includes')
	      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// CONVERT_TO_STRING: true  -> String#at
	// CONVERT_TO_STRING: false -> String#codePointAt
	var stringAt$1 = function (that, pos, CONVERT_TO_STRING) {
	  var S = String(requireObjectCoercible$1(that));
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

	var STRING_ITERATOR$1 = 'String Iterator';
	var setInternalState$7 = internalState$1.set;
	var getInternalState$5 = internalState$1.getterFor(STRING_ITERATOR$1);

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
	  var state = getInternalState$5(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = stringAt$1(string, index, true);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var nativeExec$1 = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace$1 = String.prototype.replace;

	var patchedExec$1 = nativeExec$1;

	var UPDATES_LAST_INDEX_WRONG$1 = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec$1.call(re1, 'a');
	  nativeExec$1.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED$1 = /()??/.exec('')[1] !== undefined;

	var PATCH$1 = UPDATES_LAST_INDEX_WRONG$1 || NPCG_INCLUDED$1;

	if (PATCH$1) {
	  patchedExec$1 = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;

	    if (NPCG_INCLUDED$1) {
	      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags$1.call(re));
	    }
	    if (UPDATES_LAST_INDEX_WRONG$1) lastIndex = re.lastIndex;

	    match = nativeExec$1.call(re, str);

	    if (UPDATES_LAST_INDEX_WRONG$1 && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED$1 && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace$1.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec$1 = patchedExec$1;

	var SPECIES$9 = wellKnownSymbol$1('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS$1 = !fails$1(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC$1 = !fails$1(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic$1 = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol$1(KEY);

	  var DELEGATES_TO_SYMBOL = !fails$1(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$1(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;
	    re.exec = function () { execCalled = true; return null; };

	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$9] = function () { return re; };
	    }

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS$1) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC$1)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec$1) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine$1(String.prototype, KEY, stringMethod);
	    redefine$1(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	    if (sham) hide$1(RegExp.prototype[SYMBOL], 'sham', true);
	  }
	};

	// `SameValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-samevalue
	var sameValue$1 = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract$1 = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw$1(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec$1.call(R, S);
	};

	// @@search logic
	fixRegexpWellKnownSymbolLogic$1('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = requireObjectCoercible$1(this);
	      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
	      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
	    function (regexp) {
	      var res = maybeCallNative(nativeSearch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject$1(regexp);
	      var S = String(this);

	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue$1(previousLastIndex, 0)) rx.lastIndex = 0;
	      var result = regexpExecAbstract$1(rx, S);
	      if (!sameValue$1(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

	var redefineAll$1 = function (target, src, options) {
	  for (var key in src) redefine$1(target, key, src[key], options);
	  return target;
	};

	var freezing = !fails$1(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty$1.f;



	var METADATA = uid$1('meta');
	var id = 0;

	var isExtensible = Object.isExtensible || function () {
	  return true;
	};

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + ++id, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject$4(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has$2(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!has$2(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (freezing && meta.REQUIRED && isExtensible(it) && !has$2(it, METADATA)) setMetadata(it);
	  return it;
	};

	var meta = module.exports = {
	  REQUIRED: false,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys$2[METADATA] = true;
	});
	var internalMetadata_1 = internalMetadata.REQUIRED;
	var internalMetadata_2 = internalMetadata.fastKey;
	var internalMetadata_3 = internalMetadata.getWeakData;
	var internalMetadata_4 = internalMetadata.onFreeze;

	var iterate$1 = createCommonjsModule(function (module) {
	var BREAK = {};

	var exports = module.exports = function (iterable, fn, that, ENTRIES, ITERATOR) {
	  var boundFunction = bindContext$1(fn, that, ENTRIES ? 2 : 1);
	  var iterator, iterFn, index, length, result, step;

	  if (ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod$1(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod$1(iterFn)) {
	      for (index = 0, length = toLength$1(iterable.length); length > index; index++) {
	        result = ENTRIES ? boundFunction(anObject$1(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
	        if (result === BREAK) return BREAK;
	      } return;
	    }
	    iterator = iterFn.call(iterable);
	  }

	  while (!(step = iterator.next()).done) {
	    if (callWithSafeIterationClosing$1(iterator, boundFunction, step.value, ENTRIES) === BREAK) return BREAK;
	  }
	};

	exports.BREAK = BREAK;
	});

	var anInstance$1 = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	var collection = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
	  var NativeConstructor = global_1$1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var nativeMethod = NativePrototype[KEY];
	    redefine$1(NativePrototype, KEY,
	      KEY == 'add' ? function add(a) {
	        nativeMethod.call(this, a === 0 ? 0 : a);
	        return this;
	      } : KEY == 'delete' ? function (a) {
	        return IS_WEAK && !isObject$4(a) ? false : nativeMethod.call(this, a === 0 ? 0 : a);
	      } : KEY == 'get' ? function get(a) {
	        return IS_WEAK && !isObject$4(a) ? undefined : nativeMethod.call(this, a === 0 ? 0 : a);
	      } : KEY == 'has' ? function has(a) {
	        return IS_WEAK && !isObject$4(a) ? false : nativeMethod.call(this, a === 0 ? 0 : a);
	      } : function set(a, b) {
	        nativeMethod.call(this, a === 0 ? 0 : a, b);
	        return this;
	      }
	    );
	  };

	  // eslint-disable-next-line max-len
	  if (isForced_1$1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails$1(function () {
	    new NativeConstructor().entries().next();
	  })))) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.REQUIRED = true;
	  } else if (isForced_1$1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails$1(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration$1(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails$1(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (target, iterable) {
	        anInstance$1(target, Constructor, CONSTRUCTOR_NAME);
	        var that = inheritIfRequired$1(new NativeConstructor(), target, Constructor);
	        if (iterable != undefined) iterate$1(iterable, that[ADDER], that, IS_MAP);
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export$1({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag$1(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var getWeakData = internalMetadata.getWeakData;








	var setInternalState$8 = internalState$1.set;
	var internalStateGetterFor = internalState$1.getterFor;
	var arrayFind$1 = arrayMethods$1(5);
	var arrayFindIndex$1 = arrayMethods$1(6);
	var id$2 = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return arrayFind$1(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.entries.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = arrayFindIndex$1(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.entries.splice(index, 1);
	    return !!~index;
	  }
	};

	var collectionWeak = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance$1(that, C, CONSTRUCTOR_NAME);
	      setInternalState$8(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id$2++,
	        frozen: undefined
	      });
	      if (iterable != undefined) iterate$1(iterable, that[ADDER], that, IS_MAP);
	    });

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject$1(key), true);
	      if (data === true) uncaughtFrozenStore(state).set(key, value);
	      else data[state.id] = value;
	      return that;
	    };

	    redefineAll$1(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject$4(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
	        return data && has$2(data, state.id) && delete data[state.id];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key) {
	        var state = getInternalState(this);
	        if (!isObject$4(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state).has(key);
	        return data && has$2(data, state.id);
	      }
	    });

	    redefineAll$1(C.prototype, IS_MAP ? {
	      // 23.3.3.3 WeakMap.prototype.get(key)
	      get: function get(key) {
	        var state = getInternalState(this);
	        if (isObject$4(key)) {
	          var data = getWeakData(key);
	          if (data === true) return uncaughtFrozenStore(state).get(key);
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // 23.3.3.5 WeakMap.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // 23.4.3.1 WeakSet.prototype.add(value)
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });

	    return C;
	  }
	};

	var es_weakMap = createCommonjsModule(function (module) {






	var enforceIternalState = internalState$1.enforce;


	var IS_IE11 = !global_1$1.ActiveXObject && 'ActiveXObject' in global_1$1;
	var isExtensible = Object.isExtensible;
	var InternalWeakMap;

	var wrapper = function (get) {
	  return function WeakMap() {
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	};

	// `WeakMap` constructor
	// https://tc39.github.io/ecma262/#sec-weakmap-constructor
	var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak, true, true);

	// IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485
	if (nativeWeakMap$1 && IS_IE11) {
	  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
	  internalMetadata.REQUIRED = true;
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = WeakMapPrototype['delete'];
	  var nativeHas = WeakMapPrototype.has;
	  var nativeGet = WeakMapPrototype.get;
	  var nativeSet = WeakMapPrototype.set;
	  redefineAll$1(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject$4(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeDelete.call(this, key) || state.frozen['delete'](key);
	      } return nativeDelete.call(this, key);
	    },
	    has: function has(key) {
	      if (isObject$4(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) || state.frozen.has(key);
	      } return nativeHas.call(this, key);
	    },
	    get: function get(key) {
	      if (isObject$4(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
	      } return nativeGet.call(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject$4(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
	      } else nativeSet.call(this, key, value);
	      return this;
	    }
	  });
	}
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables$1 = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var ITERATOR$e = wellKnownSymbol$1('iterator');
	var TO_STRING_TAG$8 = wellKnownSymbol$1('toStringTag');
	var ArrayValues$1 = es_array_iterator$1.values;

	for (var COLLECTION_NAME$2 in domIterables$1) {
	  var Collection$2 = global_1$1[COLLECTION_NAME$2];
	  var CollectionPrototype$2 = Collection$2 && Collection$2.prototype;
	  if (CollectionPrototype$2) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype$2[ITERATOR$e] !== ArrayValues$1) try {
	      hide$1(CollectionPrototype$2, ITERATOR$e, ArrayValues$1);
	    } catch (error) {
	      CollectionPrototype$2[ITERATOR$e] = ArrayValues$1;
	    }
	    if (!CollectionPrototype$2[TO_STRING_TAG$8]) hide$1(CollectionPrototype$2, TO_STRING_TAG$8, COLLECTION_NAME$2);
	    if (domIterables$1[COLLECTION_NAME$2]) for (var METHOD_NAME$1 in es_array_iterator$1) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype$2[METHOD_NAME$1] !== es_array_iterator$1[METHOD_NAME$1]) try {
	        hide$1(CollectionPrototype$2, METHOD_NAME$1, es_array_iterator$1[METHOD_NAME$1]);
	      } catch (error) {
	        CollectionPrototype$2[METHOD_NAME$1] = es_array_iterator$1[METHOD_NAME$1];
	      }
	    }
	  }
	}

	var nativeAssign$1 = Object.assign;

	// 19.1.2.1 Object.assign(target, source, ...)
	// should work with symbols and should have deterministic property order (V8 bug)
	var objectAssign$1 = !nativeAssign$1 || fails$1(function () {
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

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export$1({ target: 'Object', stat: true, forced: Object.assign !== objectAssign$1 }, {
	  assign: objectAssign$1
	});

	var SPECIES$a = wellKnownSymbol$1('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor$1 = function (O, defaultConstructor) {
	  var C = anObject$1(O).constructor;
	  var S;
	  return C === undefined || (S = anObject$1(C)[SPECIES$a]) == undefined ? defaultConstructor : aFunction$2(S);
	};

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex$1 = function (S, index, unicode) {
	  return index + (unicode ? stringAt$1(S, index, true).length : 1);
	};

	var arrayPush$1 = [].push;
	var min$7 = Math.min;
	var MAX_UINT32$1 = 0xFFFFFFFF;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y$1 = !fails$1(function () { return !RegExp(MAX_UINT32$1, 'y'); });

	// @@split logic
	fixRegexpWellKnownSymbolLogic$1('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible$1(this));
	      var lim = limit === undefined ? MAX_UINT32$1 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegexp$1(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = regexpExec$1.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush$1.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output.length > lim ? output.slice(0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible$1(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	      if (res.done) return res.value;

	      var rx = anObject$1(regexp);
	      var S = String(this);
	      var C = speciesConstructor$1(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (SUPPORTS_Y$1 ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y$1 ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32$1 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return regexpExecAbstract$1(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y$1 ? q : 0;
	        var z = regexpExecAbstract$1(splitter, SUPPORTS_Y$1 ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = min$7(toLength$1(splitter.lastIndex + (SUPPORTS_Y$1 ? 0 : q)), S.length)) === p
	        ) {
	          q = advanceStringIndex$1(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	}, !SUPPORTS_Y$1);

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var forcedStringTrimMethod = function (METHOD_NAME) {
	  return fails$1(function () {
	    return !!whitespaces$1[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces$1[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var FORCED$7 = forcedStringTrimMethod('trim');

	// `String.prototype.trim` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.trim
	_export$1({ target: 'String', proto: true, forced: FORCED$7 }, {
	  trim: function trim() {
	    return stringTrim$1(this, 3);
	  }
	});

	var internalForEach$1 = arrayMethods$1(0);
	var SLOPPY_METHOD$4 = sloppyArrayMethod$1('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach$2 = SLOPPY_METHOD$4 ? function forEach(callbackfn /* , thisArg */) {
	  return internalForEach$1(this, callbackfn, arguments[1]);
	} : [].forEach;

	for (var COLLECTION_NAME$3 in domIterables$1) {
	  var Collection$3 = global_1$1[COLLECTION_NAME$3];
	  var CollectionPrototype$3 = Collection$3 && Collection$3.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype$3 && CollectionPrototype$3.forEach !== arrayForEach$2) try {
	    hide$1(CollectionPrototype$3, 'forEach', arrayForEach$2);
	  } catch (error) {
	    CollectionPrototype$3.forEach = arrayForEach$2;
	  }
	}

	var ITERATOR$f = wellKnownSymbol$1('iterator');

	var nativeUrl$1 = !fails$1(function () {
	  var url = new URL('b?e=1', 'http://a');
	  var searchParams = url.searchParams;
	  url.pathname = 'c%20d';
	  return (isPure$1 && !url.toJSON)
	    || !searchParams.sort
	    || url.href !== 'http://a/c%20d?e=1'
	    || searchParams.get('e') !== '1'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !searchParams[ITERATOR$f]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('http://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('http://a#б').hash !== '#%D0%B1';
	});

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
	  for (/* no initialization */; delta > baseMinusTMin$1 * tMax$1 >> 1; k += base$1) {
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
	          if (q < t) {
	            break;
	          }
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

	var punycodeToAscii$1 = function (input) {
	  var encoded = [];
	  var labels = input.toLowerCase().replace(regexSeparators$1, '\u002E').split('.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    encoded.push(regexNonASCII$1.test(label) ? 'xn--' + encode$1(label) : label);
	  }
	  return encoded.join('.');
	};

	var getIterator$1 = function (it) {
	  var iteratorMethod = getIteratorMethod$1(it);
	  if (typeof iteratorMethod != 'function') {
	    throw TypeError(String(it) + ' is not iterable');
	  } return anObject$1(iteratorMethod.call(it));
	};

	var ITERATOR$g = wellKnownSymbol$1('iterator');
	var URL_SEARCH_PARAMS$1 = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR$1 = URL_SEARCH_PARAMS$1 + 'Iterator';
	var setInternalState$9 = internalState$1.set;
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
	    var i = 0;
	    var attribute, entry;
	    while (i < attributes.length) {
	      attribute = attributes[i++];
	      if (attribute.length) {
	        entry = attribute.split('=');
	        result.push({
	          key: deserialize$1(entry.shift()),
	          value: deserialize$1(entry.join('='))
	        });
	      }
	    }
	  } return result;
	};

	var updateSearchParams$1 = function (query) {
	  this.entries.length = 0;
	  parseSearchParams$1(this.entries, query);
	};

	var validateArgumentsLength$1 = function (passed, required) {
	  if (passed < required) throw TypeError('Not enough arguments');
	};

	var URLSearchParamsIterator$1 = createIteratorConstructor$1(function Iterator(params, kind) {
	  setInternalState$9(this, {
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
	  var iteratorMethod, iterator, step, entryIterator, first, second, key;

	  setInternalState$9(that, {
	    type: URL_SEARCH_PARAMS$1,
	    entries: entries,
	    updateURL: null,
	    updateSearchParams: updateSearchParams$1
	  });

	  if (init !== undefined) {
	    if (isObject$4(init)) {
	      iteratorMethod = getIteratorMethod$1(init);
	      if (typeof iteratorMethod === 'function') {
	        iterator = iteratorMethod.call(init);
	        while (!(step = iterator.next()).done) {
	          entryIterator = getIterator$1(anObject$1(step.value));
	          if (
	            (first = entryIterator.next()).done ||
	            (second = entryIterator.next()).done ||
	            !entryIterator.next().done
	          ) throw TypeError('Expected sequence with length 2');
	          entries.push({ key: first.value + '', value: second.value + '' });
	        }
	      } else for (key in init) if (has$2(init, key)) entries.push({ key: key, value: init[key] + '' });
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
	    if (state.updateURL) state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name) {
	    validateArgumentsLength$1(arguments.length, 1);
	    var state = getInternalParamsState$1(this);
	    var entries = state.entries;
	    var key = name + '';
	    var i = 0;
	    while (i < entries.length) {
	      if (entries[i].key === key) entries.splice(i, 1);
	      else i++;
	    }
	    if (state.updateURL) state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    validateArgumentsLength$1(arguments.length, 1);
	    var entries = getInternalParamsState$1(this).entries;
	    var key = name + '';
	    var i = 0;
	    for (; i < entries.length; i++) if (entries[i].key === key) return entries[i].value;
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    validateArgumentsLength$1(arguments.length, 1);
	    var entries = getInternalParamsState$1(this).entries;
	    var key = name + '';
	    var result = [];
	    var i = 0;
	    for (; i < entries.length; i++) if (entries[i].key === key) result.push(entries[i].value);
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name) {
	    validateArgumentsLength$1(arguments.length, 1);
	    var entries = getInternalParamsState$1(this).entries;
	    var key = name + '';
	    var i = 0;
	    while (i < entries.length) if (entries[i++].key === key) return true;
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
	    var i = 0;
	    var entry;
	    for (; i < entries.length; i++) {
	      entry = entries[i];
	      if (entry.key === key) {
	        if (found) entries.splice(i--, 1);
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) entries.push({ key: key, value: val });
	    if (state.updateURL) state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState$1(this);
	    var entries = state.entries;
	    // Array#sort is not stable in some engines
	    var slice = entries.slice();
	    var entry, i, j;
	    entries.length = 0;
	    for (i = 0; i < slice.length; i++) {
	      entry = slice[i];
	      for (j = 0; j < i; j++) if (entries[j].key > entry.key) {
	        entries.splice(j, 0, entry);
	        break;
	      }
	      if (j === i) entries.push(entry);
	    }
	    if (state.updateURL) state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState$1(this).entries;
	    var boundFunction = bindContext$1(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
	    var i = 0;
	    var entry;
	    while (i < entries.length) {
	      entry = entries[i++];
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
	redefine$1(URLSearchParamsPrototype$1, ITERATOR$g, URLSearchParamsPrototype$1.entries);

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	redefine$1(URLSearchParamsPrototype$1, 'toString', function toString() {
	  var entries = getInternalParamsState$1(this).entries;
	  var result = [];
	  var i = 0;
	  var entry;
	  while (i < entries.length) {
	    entry = entries[i++];
	    result.push(serialize$1(entry.key) + '=' + serialize$1(entry.value));
	  } return result.join('&');
	}, { enumerable: true });

	setToStringTag$1(URLSearchParamsConstructor$1, URL_SEARCH_PARAMS$1);

	_export$1({ global: true, forced: !nativeUrl$1 }, {
	  URLSearchParams: URLSearchParamsConstructor$1
	});

	var web_urlSearchParams$1 = {
	  URLSearchParams: URLSearchParamsConstructor$1,
	  getState: getInternalParamsState$1
	};

	var NativeURL$1 = global_1$1.URL;
	var URLSearchParams$2 = web_urlSearchParams$1.URLSearchParams;
	var getInternalSearchParamsState$1 = web_urlSearchParams$1.getState;
	var setInternalState$a = internalState$1.set;
	var getInternalURLState$1 = internalState$1.getterFor('URL');
	var pow$1 = Math.pow;

	var INVALID_AUTHORITY$1 = 'Invalid authority';
	var INVALID_SCHEME$1 = 'Invalid scheme';
	var INVALID_HOST$1 = 'Invalid host';
	var INVALID_PORT$1 = 'Invalid port';

	var ALPHA$1 = /[A-Za-z]/;
	var ALPHANUMERIC$1 = /[\d+\-.A-Za-z]/;
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
	  var result, codePoints, i;
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
	    for (i = 0; i < codePoints.length; i++) result += percentEncode$1(codePoints[i], C0ControlPercentEncodeSet$1);
	    url.host = result;
	  } else {
	    input = punycodeToAscii$1(input);
	    if (FORBIDDEN_HOST_CODE_POINT$1.test(input)) return INVALID_HOST$1;
	    result = parseIPv4$1(input);
	    if (result === null) return INVALID_HOST$1;
	    url.host = result;
	  }
	};

	var parseIPv4$1 = function (input) {
	  var parts = input.split('.');
	  var partsLength, numbers, i, part, R, n, ipv4;
	  if (parts[parts.length - 1] == '') {
	    if (parts.length) parts.pop();
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) return input;
	  numbers = [];
	  for (i = 0; i < partsLength; i++) {
	    part = parts[i];
	    if (part == '') return input;
	    R = 10;
	    if (part.length > 1 && part.charAt(0) == '0') {
	      R = HEX_START$1.test(part) ? 16 : 8;
	      part = part.slice(R == 8 ? 1 : 2);
	    }
	    if (part === '') {
	      n = 0;
	    } else {
	      if (!(R == 10 ? DEC$1 : R == 8 ? OCT$1 : HEX$1).test(part)) return input;
	      n = parseInt(part, R);
	    }
	    numbers.push(n);
	  }
	  for (i = 0; i < partsLength; i++) {
	    n = numbers[i];
	    if (i == partsLength - 1) {
	      if (n >= pow$1(256, 5 - partsLength)) return null;
	    } else if (n > 255) return null;
	  }
	  ipv4 = numbers.pop();
	  for (i = 0; i < numbers.length; i++) {
	    ipv4 += numbers[i] * pow$1(256, 3 - i);
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
	  var i = 0;
	  for (; i < 8; i++) {
	    if (ipv6[i] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) currStart = i;
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
	  var result, i, compress, ignore0;
	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (i = 0; i < 4; i++) {
	      result.unshift(host % 256);
	      host = Math.floor(host / 256);
	    } return result.join('.');
	  // ipv6
	  } else if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence$1(host);
	    for (i = 0; i < 8; i++) {
	      if (ignore0 && host[i] === 0) continue;
	      if (ignore0) ignore0 = false;
	      if (compress === i) {
	        result += i ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += host[i].toString(16);
	        if (i < 7) result += ':';
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
	  var code = stringAt$1(char, 0);
	  return code > 0x20 && code < 0x7F && !has$2(set, char) ? char : encodeURIComponent(char);
	};

	var specialSchemes$1 = {
	  ftp: 21,
	  file: null,
	  gopher: 70,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	var isSpecial$1 = function (url) {
	  return has$2(specialSchemes$1, url.scheme);
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
	          if (stateOverride) {
	            if (
	              (isSpecial$1(url) != has$2(specialSchemes$1, buffer)) ||
	              (buffer == 'file' && (includesCredentials$1(url) || url.port !== null)) ||
	              (url.scheme == 'file' && !url.host)
	            ) return;
	          }
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
	  var state = setInternalState$a(that, { type: 'URL' });
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

	// `thisNumberValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-thisnumbervalue
	var thisNumberValue = function (value) {
	  if (typeof value != 'number' && classofRaw$1(value) != 'Number') {
	    throw TypeError('Incorrect invocation');
	  }
	  return +value;
	};

	// `String.prototype.repeat` method implementation
	// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
	var stringRepeat = ''.repeat || function repeat(count) {
	  var str = String(requireObjectCoercible$1(this));
	  var result = '';
	  var n = toInteger$1(count);
	  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
	  return result;
	};

	var nativeToFixed = 1.0.toFixed;
	var floor$5 = Math.floor;
	var data$2 = [0, 0, 0, 0, 0, 0];

	var multiply = function (n, c) {
	  var i = -1;
	  var c2 = c;
	  while (++i < 6) {
	    c2 += n * data$2[i];
	    data$2[i] = c2 % 1e7;
	    c2 = floor$5(c2 / 1e7);
	  }
	};

	var divide = function (n) {
	  var i = 6;
	  var c = 0;
	  while (--i >= 0) {
	    c += data$2[i];
	    data$2[i] = floor$5(c / n);
	    c = (c % n) * 1e7;
	  }
	};

	var numToString = function () {
	  var i = 6;
	  var s = '';
	  while (--i >= 0) {
	    if (s !== '' || i === 0 || data$2[i] !== 0) {
	      var t = String(data$2[i]);
	      s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
	    }
	  } return s;
	};

	var pow$2 = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow$2(x, n - 1, acc * x) : pow$2(x * x, n / 2, acc);
	};

	var log = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};

	var FORCED$8 = nativeToFixed && (
	  0.00008.toFixed(3) !== '0.000' ||
	  0.9.toFixed(0) !== '1' ||
	  1.255.toFixed(2) !== '1.25' ||
	  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
	) || !fails$1(function () {
	  // V8 ~ Android 4.3-
	  nativeToFixed.call({});
	});

	// `Number.prototype.toFixed` method
	// https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
	_export$1({ target: 'Number', proto: true, forced: FORCED$8 }, {
	  toFixed: function toFixed(fractionDigits) {
	    var x = thisNumberValue(this);
	    var f = toInteger$1(fractionDigits);
	    var s = '';
	    var m = '0';
	    var e, z, j, k;
	    if (f < 0 || f > 20) throw RangeError('Incorrect fraction digits');
	    // eslint-disable-next-line no-self-compare
	    if (x != x) return 'NaN';
	    if (x <= -1e21 || x >= 1e21) return String(x);
	    if (x < 0) {
	      s = '-';
	      x = -x;
	    }
	    if (x > 1e-21) {
	      e = log(x * pow$2(2, 69, 1)) - 69;
	      z = e < 0 ? x * pow$2(2, -e, 1) : x / pow$2(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(0, z);
	        j = f;
	        while (j >= 7) {
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow$2(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        m = numToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        m = numToString() + stringRepeat.call('0', f);
	      }
	    }
	    if (f > 0) {
	      k = m.length;
	      m = s + (k <= f ? '0.' + stringRepeat.call('0', f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
	    } else {
	      m = s + m;
	    } return m;
	  }
	});

	var propertyIsEnumerable$1 = objectPropertyIsEnumerable$1.f;

	// TO_ENTRIES: true  -> Object.entries
	// TO_ENTRIES: false -> Object.values
	var objectToArray$1 = function (it, TO_ENTRIES) {
	  var O = toIndexedObject$1(it);
	  var keys = objectKeys$1(O);
	  var length = keys.length;
	  var i = 0;
	  var result = [];
	  var key;
	  while (length > i) {
	    key = keys[i++];
	    if (!descriptors$1 || propertyIsEnumerable$1.call(O, key)) {
	      result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	    }
	  }
	  return result;
	};

	// `Object.entries` method
	// https://tc39.github.io/ecma262/#sec-object.entries
	_export$1({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return objectToArray$1(O, true);
	  }
	});

	// `Object.values` method
	// https://tc39.github.io/ecma262/#sec-object.values
	_export$1({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return objectToArray$1(O);
	  }
	});

	var max$5 = Math.max;
	var min$8 = Math.min;
	var floor$6 = Math.floor;
	var SUBSTITUTION_SYMBOLS$1 = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED$1 = /\$([$&'`]|\d\d?)/g;

	var maybeToString$1 = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic$1('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible$1(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	      if (res.done) return res.value;

	      var rx = anObject$1(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract$1(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$1(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max$5(min$8(toInteger$1(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString$1(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED$1;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject$1(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS$1;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$6(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	var defaults$1 = {
	  addCSS: true,
	  // Add CSS to the element to improve usability (required here or in your CSS!)
	  thumbWidth: 15,
	  // The width of the thumb handle
	  watch: true // Watch for new elements that match a string target

	};

	// Element matches a selector
	function matches$1(element, selector) {

	  function match() {
	    return Array.from(document.querySelectorAll(selector)).includes(this);
	  }

	  var matches = match;
	  return matches.call(element, selector);
	}

	// Trigger event
	function trigger(element, type) {
	  if (!element || !type) {
	    return;
	  } // Create and dispatch the event


	  var event = new Event(type); // Dispatch the event

	  element.dispatchEvent(event);
	}

	// `Number.isNaN` method
	// https://tc39.github.io/ecma262/#sec-number.isnan
	_export$1({ target: 'Number', stat: true }, {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare
	    return number != number;
	  }
	});

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

	var isObject$5 = function isObject(input) {
	  return getConstructor$1(input) === Object;
	};

	var isNumber$1 = function isNumber(input) {
	  return getConstructor$1(input) === Number && !Number.isNaN(input);
	};

	var isString$3 = function isString(input) {
	  return getConstructor$1(input) === String;
	};

	var isBoolean$1 = function isBoolean(input) {
	  return getConstructor$1(input) === Boolean;
	};

	var isFunction$3 = function isFunction(input) {
	  return getConstructor$1(input) === Function;
	};

	var isArray$5 = function isArray(input) {
	  return Array.isArray(input);
	};

	var isNodeList$1 = function isNodeList(input) {
	  return instanceOf$1(input, NodeList);
	};

	var isElement$1 = function isElement(input) {
	  return instanceOf$1(input, Element);
	};

	var isEvent$1 = function isEvent(input) {
	  return instanceOf$1(input, Event);
	};

	var isEmpty$1 = function isEmpty(input) {
	  return isNullOrUndefined$1(input) || (isString$3(input) || isArray$5(input) || isNodeList$1(input)) && !input.length || isObject$5(input) && !Object.keys(input).length;
	};

	var is$1 = {
	  nullOrUndefined: isNullOrUndefined$1,
	  object: isObject$5,
	  number: isNumber$1,
	  string: isString$3,
	  boolean: isBoolean$1,
	  function: isFunction$3,
	  array: isArray$5,
	  nodeList: isNodeList$1,
	  element: isElement$1,
	  event: isEvent$1,
	  empty: isEmpty$1
	};

	// @@match logic
	fixRegexpWellKnownSymbolLogic$1('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible$1(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject$1(regexp);
	      var S = String(this);

	      if (!rx.global) return regexpExecAbstract$1(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract$1(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$1(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	// Get the number of decimal places
	function getDecimalPlaces(value) {
	  var match = "".concat(value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

	  if (!match) {
	    return 0;
	  }

	  return Math.max(0, // Number of digits right of decimal point.
	  (match[1] ? match[1].length : 0) - ( // Adjust for scientific notation.
	  match[2] ? +match[2] : 0));
	} // Round to the nearest step

	function round(number, step) {
	  if (step < 1) {
	    var places = getDecimalPlaces(step);
	    return parseFloat(number.toFixed(places));
	  }

	  return Math.round(number / step) * step;
	}

	var RangeTouch =
	/*#__PURE__*/
	function () {
	  /**
	   * Setup a new instance
	   * @param {String|Element} target
	   * @param {Object} options
	   */
	  function RangeTouch(target, options) {
	    _classCallCheck(this, RangeTouch);

	    if (is$1.element(target)) {
	      // An Element is passed, use it directly
	      this.element = target;
	    } else if (is$1.string(target)) {
	      // A CSS Selector is passed, fetch it from the DOM
	      this.element = document.querySelector(target);
	    }

	    if (!is$1.element(this.element) || !is$1.empty(this.element.rangeTouch)) {
	      return;
	    }

	    this.config = Object.assign({}, defaults$1, options);
	    this.init();
	  }

	  _createClass(RangeTouch, [{
	    key: "init",
	    value: function init() {
	      // Bail if not a touch enabled device
	      if (!RangeTouch.enabled) {
	        return;
	      } // Add useful CSS


	      if (this.config.addCSS) {
	        // TODO: Restore original values on destroy
	        this.element.style.userSelect = 'none';
	        this.element.style.webKitUserSelect = 'none';
	        this.element.style.touchAction = 'manipulation';
	      }

	      this.listeners(true);
	      this.element.rangeTouch = this;
	    }
	  }, {
	    key: "destroy",
	    value: function destroy() {
	      // Bail if not a touch enabled device
	      if (!RangeTouch.enabled) {
	        return;
	      }

	      this.listeners(false);
	      this.element.rangeTouch = null;
	    }
	  }, {
	    key: "listeners",
	    value: function listeners(toggle) {
	      var _this = this;

	      var method = toggle ? 'addEventListener' : 'removeEventListener'; // Listen for events

	      ['touchstart', 'touchmove', 'touchend'].forEach(function (type) {
	        _this.element[method](type, function (event) {
	          return _this.set(event);
	        }, false);
	      });
	    }
	    /**
	     * Get the value based on touch position
	     * @param {Event} event
	     */

	  }, {
	    key: "get",
	    value: function get(event) {
	      if (!RangeTouch.enabled || !is$1.event(event)) {
	        return null;
	      }

	      var input = event.target;
	      var touch = event.changedTouches[0];
	      var min = parseFloat(input.getAttribute('min')) || 0;
	      var max = parseFloat(input.getAttribute('max')) || 100;
	      var step = parseFloat(input.getAttribute('step')) || 1;
	      var delta = max - min; // Calculate percentage

	      var percent;
	      var clientRect = input.getBoundingClientRect();
	      var thumbWidth = 100 / clientRect.width * (this.config.thumbWidth / 2) / 100; // Determine left percentage

	      percent = 100 / clientRect.width * (touch.clientX - clientRect.left); // Don't allow outside bounds

	      if (percent < 0) {
	        percent = 0;
	      } else if (percent > 100) {
	        percent = 100;
	      } // Factor in the thumb offset


	      if (percent < 50) {
	        percent -= (100 - percent * 2) * thumbWidth;
	      } else if (percent > 50) {
	        percent += (percent - 50) * 2 * thumbWidth;
	      } // Find the closest step to the mouse position


	      return min + round(delta * (percent / 100), step);
	    }
	    /**
	     * Update range value based on position
	     * @param {Event} event
	     */

	  }, {
	    key: "set",
	    value: function set(event) {
	      if (!RangeTouch.enabled || !is$1.event(event) || event.target.disabled) {
	        return;
	      } // Prevent text highlight on iOS


	      event.preventDefault(); // Set value

	      event.target.value = this.get(event); // Trigger event

	      trigger(event.target, event.type === 'touchend' ? 'change' : 'input');
	    }
	  }], [{
	    key: "setup",

	    /**
	     * Setup multiple instances
	     * @param {String|Element|NodeList|Array} target
	     * @param {Object} options
	     */
	    value: function setup(target) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var targets = null;

	      if (is$1.empty(target) || is$1.string(target)) {
	        targets = Array.from(document.querySelectorAll(is$1.string(target) ? target : 'input[type="range"]'));
	      } else if (is$1.element(target)) {
	        targets = [target];
	      } else if (is$1.nodeList(target)) {
	        targets = Array.from(target);
	      } else if (is$1.array(target)) {
	        targets = target.filter(is$1.element);
	      }

	      if (is$1.empty(targets)) {
	        return null;
	      }

	      var config = Object.assign({}, defaults$1, options);

	      if (is$1.string(target) && config.watch) {
	        // Create an observer instance
	        var observer = new MutationObserver(function (mutations) {
	          Array.from(mutations).forEach(function (mutation) {
	            Array.from(mutation.addedNodes).forEach(function (node) {
	              if (!is$1.element(node) || !matches$1(node, target)) {
	                return;
	              } // eslint-disable-next-line no-unused-vars


	              var range = new RangeTouch(node, config);
	            });
	          });
	        }); // Pass in the target node, as well as the observer options

	        observer.observe(document.body, {
	          childList: true,
	          subtree: true
	        });
	      }

	      return targets.map(function (t) {
	        return new RangeTouch(t, options);
	      });
	    }
	  }, {
	    key: "enabled",
	    get: function get() {
	      return 'ontouchstart' in document.documentElement;
	    }
	  }]);

	  return RangeTouch;
	}();

	var path$1 = global_1$1;

	var aFunction$3 = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn$1 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction$3(path$1[namespace]) || aFunction$3(global_1$1[namespace])
	    : path$1[namespace] && path$1[namespace][method] || global_1$1[namespace] && global_1$1[namespace][method];
	};

	var SPECIES$b = wellKnownSymbol$1('species');

	var setSpecies$1 = function (CONSTRUCTOR_NAME) {
	  var C = getBuiltIn$1(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty$1.f;
	  if (descriptors$1 && C && !C[SPECIES$b]) defineProperty(C, SPECIES$b, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	var location$1 = global_1$1.location;
	var set$3 = global_1$1.setImmediate;
	var clear$1 = global_1$1.clearImmediate;
	var process$3 = global_1$1.process;
	var MessageChannel$1 = global_1$1.MessageChannel;
	var Dispatch$1 = global_1$1.Dispatch;
	var counter$1 = 0;
	var queue$1 = {};
	var ONREADYSTATECHANGE$1 = 'onreadystatechange';
	var defer$1, channel$1, port$1;

	var run$1 = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue$1.hasOwnProperty(id)) {
	    var fn = queue$1[id];
	    delete queue$1[id];
	    fn();
	  }
	};

	var runner$1 = function (id) {
	  return function () {
	    run$1(id);
	  };
	};

	var listener$1 = function (event) {
	  run$1(event.data);
	};

	var post$1 = function (id) {
	  // old engines have not location.origin
	  global_1$1.postMessage(id + '', location$1.protocol + '//' + location$1.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$3 || !clear$1) {
	  set$3 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue$1[++counter$1] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer$1(counter$1);
	    return counter$1;
	  };
	  clear$1 = function clearImmediate(id) {
	    delete queue$1[id];
	  };
	  // Node.js 0.8-
	  if (classofRaw$1(process$3) == 'process') {
	    defer$1 = function (id) {
	      process$3.nextTick(runner$1(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch$1 && Dispatch$1.now) {
	    defer$1 = function (id) {
	      Dispatch$1.now(runner$1(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel$1) {
	    channel$1 = new MessageChannel$1();
	    port$1 = channel$1.port2;
	    channel$1.port1.onmessage = listener$1;
	    defer$1 = bindContext$1(port$1.postMessage, port$1, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global_1$1.addEventListener && typeof postMessage == 'function' && !global_1$1.importScripts && !fails$1(post$1)) {
	    defer$1 = post$1;
	    global_1$1.addEventListener('message', listener$1, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE$1 in documentCreateElement$1('script')) {
	    defer$1 = function (id) {
	      html$1.appendChild(documentCreateElement$1('script'))[ONREADYSTATECHANGE$1] = function () {
	        html$1.removeChild(this);
	        run$1(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer$1 = function (id) {
	      setTimeout(runner$1(id), 0);
	    };
	  }
	}

	var task$2 = {
	  set: set$3,
	  clear: clear$1
	};

	var navigator$2 = global_1$1.navigator;

	var userAgent$1 = navigator$2 && navigator$2.userAgent || '';

	var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor$1.f;

	var macrotask$1 = task$2.set;


	var MutationObserver$2 = global_1$1.MutationObserver || global_1$1.WebKitMutationObserver;
	var process$4 = global_1$1.process;
	var Promise$2 = global_1$1.Promise;
	var IS_NODE$2 = classofRaw$1(process$4) == 'process';
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor$1 = getOwnPropertyDescriptor$7(global_1$1, 'queueMicrotask');
	var queueMicrotask$1 = queueMicrotaskDescriptor$1 && queueMicrotaskDescriptor$1.value;

	var flush$1, head$1, last$1, notify$2, toggle$1, node$1, promise$1;

	// modern engines have queueMicrotask method
	if (!queueMicrotask$1) {
	  flush$1 = function () {
	    var parent, fn;
	    if (IS_NODE$2 && (parent = process$4.domain)) parent.exit();
	    while (head$1) {
	      fn = head$1.fn;
	      head$1 = head$1.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head$1) notify$2();
	        else last$1 = undefined;
	        throw error;
	      }
	    } last$1 = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (IS_NODE$2) {
	    notify$2 = function () {
	      process$4.nextTick(flush$1);
	    };
	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  } else if (MutationObserver$2 && !/(iphone|ipod|ipad).*applewebkit/i.test(userAgent$1)) {
	    toggle$1 = true;
	    node$1 = document.createTextNode('');
	    new MutationObserver$2(flush$1).observe(node$1, { characterData: true }); // eslint-disable-line no-new
	    notify$2 = function () {
	      node$1.data = toggle$1 = !toggle$1;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$2 && Promise$2.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise$1 = Promise$2.resolve(undefined);
	    notify$2 = function () {
	      promise$1.then(flush$1);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify$2 = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask$1.call(global_1$1, flush$1);
	    };
	  }
	}

	var microtask$1 = queueMicrotask$1 || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last$1) last$1.next = task;
	  if (!head$1) {
	    head$1 = task;
	    notify$2();
	  } last$1 = task;
	};

	var PromiseCapability$1 = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$2(resolve);
	  this.reject = aFunction$2(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	var f$d = function (C) {
	  return new PromiseCapability$1(C);
	};

	var newPromiseCapability$2 = {
		f: f$d
	};

	var promiseResolve$1 = function (C, x) {
	  anObject$1(C);
	  if (isObject$4(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability$2.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors$1 = function (a, b) {
	  var console = global_1$1.console;
	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform$1 = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var task$3 = task$2.set;










	var SPECIES$c = wellKnownSymbol$1('species');
	var PROMISE$1 = 'Promise';
	var getInternalState$6 = internalState$1.get;
	var setInternalState$b = internalState$1.set;
	var getInternalPromiseState$1 = internalState$1.getterFor(PROMISE$1);
	var PromiseConstructor$1 = global_1$1[PROMISE$1];
	var TypeError$2 = global_1$1.TypeError;
	var document$6 = global_1$1.document;
	var process$5 = global_1$1.process;
	var $fetch$1 = global_1$1.fetch;
	var versions$1 = process$5 && process$5.versions;
	var v8$1 = versions$1 && versions$1.v8 || '';
	var newPromiseCapability$3 = newPromiseCapability$2.f;
	var newGenericPromiseCapability$1 = newPromiseCapability$3;
	var IS_NODE$3 = classofRaw$1(process$5) == 'process';
	var DISPATCH_EVENT$1 = !!(document$6 && document$6.createEvent && global_1$1.dispatchEvent);
	var UNHANDLED_REJECTION$1 = 'unhandledrejection';
	var REJECTION_HANDLED$1 = 'rejectionhandled';
	var PENDING$1 = 0;
	var FULFILLED$1 = 1;
	var REJECTED$1 = 2;
	var HANDLED$1 = 1;
	var UNHANDLED$1 = 2;
	var Internal$1, OwnPromiseCapability$1, PromiseWrapper$1;

	var FORCED$9 = isForced_1$1(PROMISE$1, function () {
	  // correct subclassing with @@species support
	  var promise = PromiseConstructor$1.resolve(1);
	  var empty = function () { /* empty */ };
	  var FakePromise = (promise.constructor = {})[SPECIES$c] = function (exec) {
	    exec(empty, empty);
	  };
	  // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  return !((IS_NODE$3 || typeof PromiseRejectionEvent == 'function')
	    && (!isPure$1 || promise['finally'])
	    && promise.then(empty) instanceof FakePromise
	    // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // we can't detect it synchronously, so just check versions
	    && v8$1.indexOf('6.6') !== 0
	    && userAgent$1.indexOf('Chrome/66') === -1);
	});

	var INCORRECT_ITERATION$3 = FORCED$9 || !checkCorrectnessOfIteration$1(function (iterable) {
	  PromiseConstructor$1.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable$1 = function (it) {
	  var then;
	  return isObject$4(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$3 = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask$1(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED$1;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED$1) onHandleUnhandled$1(promise, state);
	            state.rejection = HANDLED$1;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // may throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$2('Promise-chain cycle'));
	          } else if (then = isThenable$1(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled$1(promise, state);
	  });
	};

	var dispatchEvent$1 = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT$1) {
	    event = document$6.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1$1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (handler = global_1$1['on' + name]) handler(event);
	  else if (name === UNHANDLED_REJECTION$1) hostReportErrors$1('Unhandled promise rejection', reason);
	};

	var onUnhandled$1 = function (promise, state) {
	  task$3.call(global_1$1, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled$1(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform$1(function () {
	        if (IS_NODE$3) {
	          process$5.emit('unhandledRejection', value, promise);
	        } else dispatchEvent$1(UNHANDLED_REJECTION$1, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$3 || isUnhandled$1(state) ? UNHANDLED$1 : HANDLED$1;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled$1 = function (state) {
	  return state.rejection !== HANDLED$1 && !state.parent;
	};

	var onHandleUnhandled$1 = function (promise, state) {
	  task$3.call(global_1$1, function () {
	    if (IS_NODE$3) {
	      process$5.emit('rejectionHandled', promise);
	    } else dispatchEvent$1(REJECTION_HANDLED$1, promise, state.value);
	  });
	};

	var bind$1 = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject$1 = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED$1;
	  notify$3(promise, state, true);
	};

	var internalResolve$1 = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (promise === value) throw TypeError$2("Promise can't be resolved itself");
	    var then = isThenable$1(value);
	    if (then) {
	      microtask$1(function () {
	        var wrapper = { done: false };
	        try {
	          then.call(value,
	            bind$1(internalResolve$1, promise, wrapper, state),
	            bind$1(internalReject$1, promise, wrapper, state)
	          );
	        } catch (error) {
	          internalReject$1(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED$1;
	      notify$3(promise, state, false);
	    }
	  } catch (error) {
	    internalReject$1(promise, { done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$9) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor$1 = function Promise(executor) {
	    anInstance$1(this, PromiseConstructor$1, PROMISE$1);
	    aFunction$2(executor);
	    Internal$1.call(this);
	    var state = getInternalState$6(this);
	    try {
	      executor(bind$1(internalResolve$1, this, state), bind$1(internalReject$1, this, state));
	    } catch (error) {
	      internalReject$1(this, state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal$1 = function Promise(executor) {
	    setInternalState$b(this, {
	      type: PROMISE$1,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING$1,
	      value: undefined
	    });
	  };
	  Internal$1.prototype = redefineAll$1(PromiseConstructor$1.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState$1(this);
	      var reaction = newPromiseCapability$3(speciesConstructor$1(this, PromiseConstructor$1));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$3 ? process$5.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING$1) notify$3(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability$1 = function () {
	    var promise = new Internal$1();
	    var state = getInternalState$6(promise);
	    this.promise = promise;
	    this.resolve = bind$1(internalResolve$1, promise, state);
	    this.reject = bind$1(internalReject$1, promise, state);
	  };
	  newPromiseCapability$2.f = newPromiseCapability$3 = function (C) {
	    return C === PromiseConstructor$1 || C === PromiseWrapper$1
	      ? new OwnPromiseCapability$1(C)
	      : newGenericPromiseCapability$1(C);
	  };

	  // wrap fetch result
	  if (typeof $fetch$1 == 'function') _export$1({ global: true, enumerable: true, forced: true }, {
	    // eslint-disable-next-line no-unused-vars
	    fetch: function fetch(input) {
	      return promiseResolve$1(PromiseConstructor$1, $fetch$1.apply(global_1$1, arguments));
	    }
	  });
	}

	_export$1({ global: true, wrap: true, forced: FORCED$9 }, {
	  Promise: PromiseConstructor$1
	});

	setToStringTag$1(PromiseConstructor$1, PROMISE$1, false);
	setSpecies$1(PROMISE$1);

	PromiseWrapper$1 = path$1[PROMISE$1];

	// statics
	_export$1({ target: PROMISE$1, stat: true, forced: FORCED$9 }, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$3(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export$1({ target: PROMISE$1, stat: true, forced: FORCED$9 }, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve$1(this, x);
	  }
	});

	_export$1({ target: PROMISE$1, stat: true, forced: INCORRECT_ITERATION$3 }, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$3(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$1(function () {
	      var $promiseResolve = aFunction$2(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$3(C);
	    var reject = capability.reject;
	    var result = perform$1(function () {
	      var $promiseResolve = aFunction$2(C.resolve);
	      iterate$1(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var STARTS_WITH = 'startsWith';
	var nativeStartsWith = ''[STARTS_WITH];

	// `String.prototype.startsWith` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.startswith
	_export$1({ target: 'String', proto: true, forced: !correctIsRegexpLogic$1(STARTS_WITH) }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = validateStringMethodArguments$1(this, searchString, STARTS_WITH);
	    var index = toLength$1(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = String(searchString);
	    return nativeStartsWith
	      ? nativeStartsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

	// ==========================================================================
	// Type checking utils
	// ==========================================================================
	var getConstructor$2 = function getConstructor(input) {
	  return input !== null && typeof input !== 'undefined' ? input.constructor : null;
	};

	var instanceOf$2 = function instanceOf(input, constructor) {
	  return Boolean(input && constructor && input instanceof constructor);
	};

	var isNullOrUndefined$2 = function isNullOrUndefined(input) {
	  return input === null || typeof input === 'undefined';
	};

	var isObject$6 = function isObject(input) {
	  return getConstructor$2(input) === Object;
	};

	var isNumber$2 = function isNumber(input) {
	  return getConstructor$2(input) === Number && !Number.isNaN(input);
	};

	var isString$4 = function isString(input) {
	  return getConstructor$2(input) === String;
	};

	var isBoolean$2 = function isBoolean(input) {
	  return getConstructor$2(input) === Boolean;
	};

	var isFunction$4 = function isFunction(input) {
	  return getConstructor$2(input) === Function;
	};

	var isArray$6 = function isArray(input) {
	  return Array.isArray(input);
	};

	var isWeakMap = function isWeakMap(input) {
	  return instanceOf$2(input, WeakMap);
	};

	var isNodeList$2 = function isNodeList(input) {
	  return instanceOf$2(input, NodeList);
	};

	var isElement$2 = function isElement(input) {
	  return instanceOf$2(input, Element);
	};

	var isTextNode = function isTextNode(input) {
	  return getConstructor$2(input) === Text;
	};

	var isEvent$2 = function isEvent(input) {
	  return instanceOf$2(input, Event);
	};

	var isKeyboardEvent = function isKeyboardEvent(input) {
	  return instanceOf$2(input, KeyboardEvent);
	};

	var isCue = function isCue(input) {
	  return instanceOf$2(input, window.TextTrackCue) || instanceOf$2(input, window.VTTCue);
	};

	var isTrack = function isTrack(input) {
	  return instanceOf$2(input, TextTrack) || !isNullOrUndefined$2(input) && isString$4(input.kind);
	};

	var isPromise = function isPromise(input) {
	  return instanceOf$2(input, Promise);
	};

	var isEmpty$2 = function isEmpty(input) {
	  return isNullOrUndefined$2(input) || (isString$4(input) || isArray$6(input) || isNodeList$2(input)) && !input.length || isObject$6(input) && !Object.keys(input).length;
	};

	var isUrl = function isUrl(input) {
	  // Accept a URL object
	  if (instanceOf$2(input, window.URL)) {
	    return true;
	  } // Must be string from here


	  if (!isString$4(input)) {
	    return false;
	  } // Add the protocol if required


	  var string = input;

	  if (!input.startsWith('http://') || !input.startsWith('https://')) {
	    string = "http://".concat(input);
	  }

	  try {
	    return !isEmpty$2(new URL(string).hostname);
	  } catch (e) {
	    return false;
	  }
	};

	var is$2 = {
	  nullOrUndefined: isNullOrUndefined$2,
	  object: isObject$6,
	  number: isNumber$2,
	  string: isString$4,
	  boolean: isBoolean$2,
	  function: isFunction$4,
	  array: isArray$6,
	  weakMap: isWeakMap,
	  nodeList: isNodeList$2,
	  element: isElement$2,
	  textNode: isTextNode,
	  event: isEvent$2,
	  keyboardEvent: isKeyboardEvent,
	  cue: isCue,
	  track: isTrack,
	  promise: isPromise,
	  url: isUrl,
	  empty: isEmpty$2
	};

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
	  return is$2.string(type) ? events[type] : false;
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
	  if (!element || !('addEventListener' in element) || is$2.empty(event) || !is$2.function(callback)) {
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
	  if (!is$2.element(element) || is$2.empty(type)) {
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

	function cloneDeep(object) {
	  return JSON.parse(JSON.stringify(object));
	} // Get a nested value in an object

	function getDeep(object, path) {
	  return path.split('.').reduce(function (obj, key) {
	    return obj && obj[key];
	  }, object);
	} // Deep extend destination object with N more objects

	function extend$1() {
	  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    sources[_key - 1] = arguments[_key];
	  }

	  if (!sources.length) {
	    return target;
	  }

	  var source = sources.shift();

	  if (!is$2.object(source)) {
	    return target;
	  }

	  Object.keys(source).forEach(function (key) {
	    if (is$2.object(source[key])) {
	      if (!Object.keys(target).includes(key)) {
	        Object.assign(target, _defineProperty({}, key, {}));
	      }

	      extend$1(target[key], source[key]);
	    } else {
	      Object.assign(target, _defineProperty({}, key, source[key]));
	    }
	  });
	  return extend$1.apply(void 0, [target].concat(sources));
	}

	function wrap$2(elements, wrapper) {
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

	function setAttributes$1(element, attributes) {
	  if (!is$2.element(element) || is$2.empty(attributes)) {
	    return;
	  } // Assume null and undefined attributes should be left out,
	  // Setting them would otherwise convert them to "null" and "undefined"


	  Object.entries(attributes).filter(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        value = _ref2[1];

	    return !is$2.nullOrUndefined(value);
	  }).forEach(function (_ref3) {
	    var _ref4 = _slicedToArray(_ref3, 2),
	        key = _ref4[0],
	        value = _ref4[1];

	    return element.setAttribute(key, value);
	  });
	} // Create a DocumentFragment

	function createElement$1(type, attributes, text) {
	  // Create a new <element>
	  var element = document.createElement(type); // Set all passed attributes

	  if (is$2.object(attributes)) {
	    setAttributes$1(element, attributes);
	  } // Add text node


	  if (is$2.string(text)) {
	    element.innerText = text;
	  } // Return built element


	  return element;
	} // Inaert an element after another

	function insertAfter(element, target) {
	  if (!is$2.element(element) || !is$2.element(target)) {
	    return;
	  }

	  target.parentNode.insertBefore(element, target.nextSibling);
	} // Insert a DocumentFragment

	function insertElement(type, parent, attributes, text) {
	  if (!is$2.element(parent)) {
	    return;
	  }

	  parent.appendChild(createElement$1(type, attributes, text));
	} // Remove element(s)

	function removeElement(element) {
	  if (is$2.nodeList(element) || is$2.array(element)) {
	    Array.from(element).forEach(removeElement);
	    return;
	  }

	  if (!is$2.element(element) || !is$2.element(element.parentNode)) {
	    return;
	  }

	  element.parentNode.removeChild(element);
	} // Remove all child elements

	function emptyElement(element) {
	  if (!is$2.element(element)) {
	    return;
	  }

	  var length = element.childNodes.length;

	  while (length > 0) {
	    element.removeChild(element.lastChild);
	    length -= 1;
	  }
	} // Replace element

	function replaceElement(newChild, oldChild) {
	  if (!is$2.element(oldChild) || !is$2.element(oldChild.parentNode) || !is$2.element(newChild)) {
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
	  if (!is$2.string(sel) || is$2.empty(sel)) {
	    return {};
	  }

	  var attributes = {};
	  var existing = extend$1({}, existingAttributes);
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
	        if (is$2.string(existing.class)) {
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

	      default:
	        break;
	    }
	  });
	  return extend$1(existing, attributes);
	} // Toggle hidden

	function toggleHidden(element, hidden) {
	  if (!is$2.element(element)) {
	    return;
	  }

	  var hide = hidden;

	  if (!is$2.boolean(hide)) {
	    hide = !element.hidden;
	  } // eslint-disable-next-line no-param-reassign


	  element.hidden = hide;
	} // Mirror Element.classList.toggle, with IE compatibility for "force" argument

	function toggleClass(element, className, force) {
	  if (is$2.nodeList(element)) {
	    return Array.from(element).map(function (e) {
	      return toggleClass(e, className, force);
	    });
	  }

	  if (is$2.element(element)) {
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
	  return is$2.element(element) && element.classList.contains(className);
	} // Element matches selector

	function matches$2(element, selector) {

	  function match() {
	    return Array.from(document.querySelectorAll(selector)).includes(this);
	  }

	  var method = match;
	  return method.call(element, selector);
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

	  if (!is$2.element(element)) {
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

	  if (!is$2.element(element)) {
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


	    if (is$2.function(createElement$1('video').webkitSetPresentationMode)) {
	      return true;
	    } // Chrome
	    // https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture


	    if (document.pictureInPictureEnabled && !createElement$1('video').disablePictureInPicture) {
	      return true;
	    }

	    return false;
	  }(),
	  // Airplay support
	  // Safari only currently
	  airplay: is$2.function(window.WebKitPlaybackTargetAvailabilityEvent),
	  // Inline playback support
	  // https://webkit.org/blog/6784/new-video-policies-for-ios/
	  playsinline: 'playsInline' in document.createElement('video'),
	  // Check for mime type support against a player instance
	  // Credits: http://diveintohtml5.info/everything.html
	  // Related: http://www.leanbackplayer.com/test/h5mt.html
	  mime: function mime(input) {
	    if (is$2.empty(input)) {
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

	function validateRatio(input) {
	  if (!is$2.array(input) && (!is$2.string(input) || !input.includes(':'))) {
	    return false;
	  }

	  var ratio = is$2.array(input) ? input : input.split(':');
	  return ratio.map(Number).every(is$2.number);
	}
	function reduceAspectRatio(ratio) {
	  if (!is$2.array(ratio) || !ratio.every(is$2.number)) {
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


	  if (ratio === null && !is$2.empty(this.embed) && is$2.array(this.embed.ratio)) {
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

	  var ratio = getAspectRatio.call(this, input);

	  var _ref = is$2.array(ratio) ? ratio : [0, 0],
	      _ref2 = _slicedToArray(_ref, 2),
	      w = _ref2[0],
	      h = _ref2[1];

	  var padding = 100 / w * h;
	  this.elements.wrapper.style.paddingBottom = "".concat(padding, "%"); // For Vimeo we have an extra <div> to hide the standard controls and UI

	  if (this.isVimeo && this.supported.ui) {
	    var height = 240;
	    var offset = (height - padding) / (height / 50);
	    this.media.style.transform = "translateY(-".concat(offset, "%)");
	  } else if (this.isHTML5) {
	    this.elements.wrapper.classList.toggle(this.config.classNames.videoFixedRatio, ratio !== null);
	  }

	  return {
	    padding: padding,
	    ratio: ratio
	  };
	}

	var html5 = {
	  getSources: function getSources() {
	    var _this = this;

	    if (!this.isHTML5) {
	      return [];
	    }

	    var sources = Array.from(this.media.querySelectorAll('source')); // Filter out unsupported sources (if type is specified)

	    return sources.filter(function (source) {
	      var type = source.getAttribute('type');

	      if (is$2.empty(type)) {
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

	    var player = this; // Set aspect ratio if fixed

	    if (!is$2.empty(this.config.ratio)) {
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

	function dedupe(array) {
	  if (!is$2.array(array)) {
	    return array;
	  }

	  return array.filter(function (item, index) {
	    return array.indexOf(item) === index;
	  });
	} // Get the closest value in an array

	function closest(array, value) {
	  if (!is$2.array(array) || !array.length) {
	    return null;
	  }

	  return array.reduce(function (prev, curr) {
	    return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
	  });
	}

	var SPECIES$d = wellKnownSymbol$1('species');
	var nativeSlice$1 = [].slice;
	var max$6 = Math.max;

	var SPECIES_SUPPORT$8 = arrayMethodHasSpeciesSupport$1('slice');

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export$1({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$8 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject$1(this);
	    var length = toLength$1(O.length);
	    var k = toAbsoluteIndex$1(start, length);
	    var fin = toAbsoluteIndex$1(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray$4(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray$4(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject$4(Constructor)) {
	        Constructor = Constructor[SPECIES$d];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice$1.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$6(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty$1(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var defineProperty$9 = objectDefineProperty$1.f;
	var getOwnPropertyNames$3 = objectGetOwnPropertyNames$1.f;







	var MATCH$5 = wellKnownSymbol$1('match');
	var NativeRegExp$1 = global_1$1.RegExp;
	var RegExpPrototype$3 = NativeRegExp$1.prototype;
	var re1$1 = /a/g;
	var re2$1 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW$1 = new NativeRegExp$1(re1$1) !== re1$1;

	var FORCED$a = isForced_1$1('RegExp', descriptors$1 && (!CORRECT_NEW$1 || fails$1(function () {
	  re2$1[MATCH$5] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp$1(re1$1) != re1$1 || NativeRegExp$1(re2$1) == re2$1 || NativeRegExp$1(re1$1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor
	if (FORCED$a) {
	  var RegExpWrapper$1 = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper$1;
	    var patternIsRegExp = isRegexp$1(pattern);
	    var flagsAreUndefined = flags === undefined;
	    return !thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper$1 && flagsAreUndefined ? pattern
	      : inheritIfRequired$1(CORRECT_NEW$1
	        ? new NativeRegExp$1(patternIsRegExp && !flagsAreUndefined ? pattern.source : pattern, flags)
	        : NativeRegExp$1((patternIsRegExp = pattern instanceof RegExpWrapper$1)
	          ? pattern.source
	          : pattern, patternIsRegExp && flagsAreUndefined ? regexpFlags$1.call(pattern) : flags)
	      , thisIsRegExp ? this : RegExpPrototype$3, RegExpWrapper$1);
	  };
	  var proxy$1 = function (key) {
	    key in RegExpWrapper$1 || defineProperty$9(RegExpWrapper$1, key, {
	      configurable: true,
	      get: function () { return NativeRegExp$1[key]; },
	      set: function (it) { NativeRegExp$1[key] = it; }
	    });
	  };
	  var keys$5 = getOwnPropertyNames$3(NativeRegExp$1);
	  var i$1 = 0;
	  while (i$1 < keys$5.length) proxy$1(keys$5[i$1++]);
	  RegExpPrototype$3.constructor = RegExpWrapper$1;
	  RegExpWrapper$1.prototype = RegExpPrototype$3;
	  redefine$1(global_1$1, 'RegExp', RegExpWrapper$1);
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
	setSpecies$1('RegExp');

	function generateId(prefix) {
	  return "".concat(prefix, "-").concat(Math.floor(Math.random() * 10000));
	} // Format string

	function format(input) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (is$2.empty(input)) {
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

	    if (is$2.empty(key) || is$2.empty(config)) {
	      return '';
	    }

	    var string = getDeep(config.i18n, key);

	    if (is$2.empty(string)) {
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

	var Storage$1 =
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

	      if (is$2.empty(store)) {
	        return null;
	      }

	      var json = JSON.parse(store);
	      return is$2.string(key) && key.length ? json[key] : json;
	    }
	  }, {
	    key: "set",
	    value: function set(object) {
	      // Bail if we don't have localStorage support or it's disabled
	      if (!Storage.supported || !this.enabled) {
	        return;
	      } // Can only store objectst


	      if (!is$2.object(object)) {
	        return;
	      } // Get current storage


	      var storage = this.get(); // Default to empty object

	      if (is$2.empty(storage)) {
	        storage = {};
	      } // Update the working copy of the values


	      extend$1(storage, object); // Update storage

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
	  if (!is$2.string(url)) {
	    return;
	  }

	  var prefix = 'cache';
	  var hasId = is$2.string(id);
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
	    var useStorage = Storage$1.supported; // Create container

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
	      if (is$2.empty(result)) {
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

	var ceil$2 = Math.ceil;
	var floor$7 = Math.floor;

	// `Math.trunc` method
	// https://tc39.github.io/ecma262/#sec-math.trunc
	_export$1({ target: 'Math', stat: true }, {
	  trunc: function trunc(it) {
	    return (it > 0 ? floor$7 : ceil$2)(it);
	  }
	});

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
	  if (!is$2.number(time)) {
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

	      if (is$2.element(this.elements.progress)) {
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
	    setAttributes$1(icon, extend$1(attributes, {
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
	    return createElement$1('span', attributes, text);
	  },
	  // Create a badge
	  createBadge: function createBadge(text) {
	    if (is$2.empty(text)) {
	      return null;
	    }

	    var badge = createElement$1('span', {
	      class: this.config.classNames.menu.value
	    });
	    badge.appendChild(createElement$1('span', {
	      class: this.config.classNames.menu.badge
	    }, text));
	    return badge;
	  },
	  // Create a <button>
	  createButton: function createButton(buttonType, attr) {
	    var _this = this;

	    var attributes = extend$1({}, attr);
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
	        extend$1(attributes, {
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
	        if (is$2.empty(props.label)) {
	          props.label = type;
	        }

	        if (is$2.empty(props.icon)) {
	          props.icon = buttonType;
	        }

	    }

	    var button = createElement$1(props.element); // Setup toggle icon and labels

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


	    extend$1(attributes, getAttributesFromSelector(this.config.selectors.buttons[type], attributes));
	    setAttributes$1(button, attributes); // We have multiple play buttons

	    if (type === 'play') {
	      if (!is$2.array(this.elements.buttons[type])) {
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
	    var input = createElement$1('input', extend$1(getAttributesFromSelector(this.config.selectors.inputs[type]), {
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
	    var progress = createElement$1('progress', extend$1(getAttributesFromSelector(this.config.selectors.display[type]), {
	      min: 0,
	      max: 100,
	      value: 0,
	      role: 'progressbar',
	      'aria-hidden': true
	    }, attributes)); // Create the label inside

	    if (type !== 'volume') {
	      progress.appendChild(createElement$1('span', null, '0'));
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
	    var container = createElement$1('div', extend$1(attributes, {
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

	      var isRadioButton = matches$2(menuItem, '[role="menuitemradio"]'); // Show the respective menu

	      if (!isRadioButton && [32, 39].includes(event.which)) {
	        controls.showMenuPanel.call(_this2, type, true);
	      } else {
	        var target;

	        if (event.which !== 32) {
	          if (event.which === 40 || isRadioButton && event.which === 39) {
	            target = menuItem.nextElementSibling;

	            if (!is$2.element(target)) {
	              target = menuItem.parentNode.firstElementChild;
	            }
	          } else {
	            target = menuItem.previousElementSibling;

	            if (!is$2.element(target)) {
	              target = menuItem.parentNode.lastElementChild;
	            }
	          }

	          setFocus.call(_this2, target, true);
	        }
	      }
	    }, false); // Enter will fire a `click` event but we still need to manage focus
	    // So we bind to keyup which fires after and set focus here

	    on(menuItem, 'keyup', function (event) {
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
	    var menuItem = createElement$1('button', extend$1(attributes, {
	      type: 'button',
	      role: 'menuitemradio',
	      class: "".concat(this.config.classNames.control, " ").concat(attributes.class ? attributes.class : '').trim(),
	      'aria-checked': checked,
	      value: value
	    }));
	    var flex = createElement$1('span'); // We have to set as HTML incase of special characters

	    flex.innerHTML = title;

	    if (is$2.element(badge)) {
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
	            return matches$2(node, '[role="menuitemradio"]');
	          }).forEach(function (node) {
	            return node.setAttribute('aria-checked', 'false');
	          });
	        }

	        menuItem.setAttribute('aria-checked', check ? 'true' : 'false');
	      }
	    });
	    this.listeners.bind(menuItem, 'click keyup', function (event) {
	      if (is$2.keyboardEvent(event) && event.which !== 32) {
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

	        default:
	          break;
	      }

	      controls.showMenuPanel.call(_this3, 'home', is$2.keyboardEvent(event));
	    }, type, false);
	    controls.bindMenuItemShortcuts.call(this, menuItem, type);
	    list.appendChild(menuItem);
	  },
	  // Format a time for display
	  formatTime: function formatTime$1() {
	    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    var inverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	    // Bail if the value isn't a number
	    if (!is$2.number(time)) {
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
	    if (!is$2.element(target) || !is$2.number(time)) {
	      return;
	    } // eslint-disable-next-line no-param-reassign


	    target.innerText = controls.formatTime(time, inverted);
	  },
	  // Update volume UI and storage
	  updateVolume: function updateVolume() {
	    if (!this.supported.ui) {
	      return;
	    } // Update range


	    if (is$2.element(this.elements.inputs.volume)) {
	      controls.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume);
	    } // Update mute state


	    if (is$2.element(this.elements.buttons.mute)) {
	      this.elements.buttons.mute.pressed = this.muted || this.volume === 0;
	    }
	  },
	  // Update seek value and lower fill
	  setRange: function setRange(target) {
	    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	    if (!is$2.element(target)) {
	      return;
	    } // eslint-disable-next-line


	    target.value = value; // Webkit range fill

	    controls.updateRangeFill.call(this, target);
	  },
	  // Update <progress> elements
	  updateProgress: function updateProgress(event) {
	    var _this4 = this;

	    if (!this.supported.ui || !is$2.event(event)) {
	      return;
	    }

	    var value = 0;

	    var setProgress = function setProgress(target, input) {
	      var val = is$2.number(input) ? input : 0;
	      var progress = is$2.element(target) ? target : _this4.elements.display.buffer; // Update value and label

	      if (is$2.element(progress)) {
	        progress.value = val; // Update text label inside

	        var label = progress.getElementsByTagName('span')[0];

	        if (is$2.element(label)) {
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

	        default:
	          break;
	      }
	    }
	  },
	  // Webkit polyfill for lower fill range
	  updateRangeFill: function updateRangeFill(target) {
	    // Get range from event if event passed
	    var range = is$2.event(target) ? target.target : target; // Needs to be a valid <input type='range'>

	    if (!is$2.element(range) || range.getAttribute('type') !== 'range') {
	      return;
	    } // Set aria values for https://github.com/sampotts/plyr/issues/905


	    if (matches$2(range, this.config.selectors.inputs.seek)) {
	      range.setAttribute('aria-valuenow', this.currentTime);
	      var currentTime = controls.formatTime(this.currentTime);
	      var duration = controls.formatTime(this.duration);
	      var format = i18n.get('seekLabel', this.config);
	      range.setAttribute('aria-valuetext', format.replace('{currentTime}', currentTime).replace('{duration}', duration));
	    } else if (matches$2(range, this.config.selectors.inputs.volume)) {
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
	    if (!this.config.tooltips.seek || !is$2.element(this.elements.inputs.seek) || !is$2.element(this.elements.display.seekTooltip) || this.duration === 0) {
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

	    if (is$2.event(event)) {
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

	    if (is$2.event(event) && ['mouseenter', 'mouseleave'].includes(event.type)) {
	      toggle(event.type === 'mouseenter');
	    }
	  },
	  // Handle time change event
	  timeUpdate: function timeUpdate(event) {
	    // Only invert if only one time element is displayed and used for both duration and currentTime
	    var invert = !is$2.element(this.elements.display.duration) && this.config.invertTime; // Duration

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


	    if (is$2.element(this.elements.inputs.seek)) {
	      this.elements.inputs.seek.setAttribute('aria-valuemax', this.duration);
	    } // If there's a spot to display duration


	    var hasDuration = is$2.element(this.elements.display.duration); // If there's only one time display, display duration there

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
	      value = !is$2.empty(input) ? input : this[setting]; // Get default

	      if (is$2.empty(value)) {
	        value = this.config[setting].default;
	      } // Unsupported value


	      if (!is$2.empty(this.options[setting]) && !this.options[setting].includes(value)) {
	        this.debug.warn("Unsupported value of '".concat(value, "' for ").concat(setting));
	        return;
	      } // Disabled value


	      if (!this.config[setting].options.includes(value)) {
	        this.debug.warn("Disabled value of '".concat(value, "' for ").concat(setting));
	        return;
	      }
	    } // Get the list if we need to


	    if (!is$2.element(list)) {
	      list = pane && pane.querySelector('[role="menu"]');
	    } // If there's no list it means it's not been rendered...


	    if (!is$2.element(list)) {
	      return;
	    } // Update the label


	    var label = this.elements.settings.buttons[setting].querySelector(".".concat(this.config.classNames.menu.value));
	    label.innerHTML = controls.getLabel.call(this, setting, value); // Find the radio option and check it

	    var target = list && list.querySelector("[value=\"".concat(value, "\"]"));

	    if (is$2.element(target)) {
	      target.checked = true;
	    }
	  },
	  // Translate a value into a nice label
	  getLabel: function getLabel(setting, value) {
	    switch (setting) {
	      case 'speed':
	        return value === 1 ? i18n.get('normal', this.config) : "".concat(value, "&times;");

	      case 'quality':
	        if (is$2.number(value)) {
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
	    if (!is$2.element(this.elements.settings.panels.quality)) {
	      return;
	    }

	    var type = 'quality';
	    var list = this.elements.settings.panels.quality.querySelector('[role="menu"]'); // Set options if passed and filter based on uniqueness and config

	    if (is$2.array(options)) {
	      this.options.quality = dedupe(options).filter(function (quality) {
	        return _this6.config.quality.options.includes(quality);
	      });
	    } // Toggle the pane and tab


	    var toggle = !is$2.empty(this.options.quality) && this.options.quality.length > 1;
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
	    if (!is$2.element(this.elements.settings.panels.captions)) {
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
	  setSpeedMenu: function setSpeedMenu(options) {
	    var _this8 = this;

	    // Menu required
	    if (!is$2.element(this.elements.settings.panels.speed)) {
	      return;
	    }

	    var type = 'speed';
	    var list = this.elements.settings.panels.speed.querySelector('[role="menu"]'); // Set the speed options

	    if (is$2.array(options)) {
	      this.options.speed = options;
	    } else if (this.isHTML5 || this.isVimeo) {
	      this.options.speed = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
	    } // Set options if passed and filter based on config


	    this.options.speed = this.options.speed.filter(function (speed) {
	      return _this8.config.speed.options.includes(speed);
	    }); // Toggle the pane and tab

	    var toggle = !is$2.empty(this.options.speed) && this.options.speed.length > 1;
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
	    var visible = !is$2.empty(buttons) && Object.values(buttons).some(function (button) {
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

	    if (!is$2.element(target)) {
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

	    if (!is$2.element(popup) || !is$2.element(button)) {
	      return;
	    } // True toggle by default


	    var hidden = popup.hidden;
	    var show = hidden;

	    if (is$2.boolean(input)) {
	      show = input;
	    } else if (is$2.keyboardEvent(input) && input.which === 27) {
	      show = false;
	    } else if (is$2.event(input)) {
	      // If Plyr is in a shadowDOM, the event target is set to the component, instead of the
	      // Element in the shadowDOM. The path, if available, is complete.
	      var target = is$2.function(input.composedPath) ? input.composedPath()[0] : input.target;
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

	    if (show && is$2.keyboardEvent(input)) {
	      controls.focusFirstMenuItem.call(this, null, true);
	    } else if (!show && !hidden) {
	      // If closing, re-focus the button
	      setFocus.call(this, button, is$2.keyboardEvent(input));
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

	    if (!is$2.element(target)) {
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

	    if (!is$2.element(button)) {
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

	    if (this.config.controls.includes('play-large')) {
	      this.elements.container.appendChild(createButton.call(this, 'play-large'));
	    } // Create the container


	    var container = createElement$1('div', getAttributesFromSelector(this.config.selectors.controls.wrapper));
	    this.elements.controls = container; // Default item attributes

	    var defaultAttributes = {
	      class: 'plyr__controls__item'
	    }; // Loop through controls in order

	    dedupe(this.config.controls).forEach(function (control) {
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
	        var progressContainer = createElement$1('div', {
	          class: "".concat(defaultAttributes.class, " plyr__progress__container")
	        });
	        var progress = createElement$1('div', getAttributesFromSelector(_this10.config.selectors.progress)); // Seek range slider

	        progress.appendChild(createRange.call(_this10, 'seek', {
	          id: "plyr-seek-".concat(data.id)
	        })); // Buffer progress

	        progress.appendChild(createProgress.call(_this10, 'buffer')); // TODO: Add loop display indicator
	        // Seek tooltip

	        if (_this10.config.tooltips.seek) {
	          var tooltip = createElement$1('span', {
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

	        if (!is$2.element(volume) || !container.contains(volume)) {
	          volume = createElement$1('div', extend$1({}, defaultAttributes, {
	            class: "".concat(defaultAttributes.class, " plyr__volume").trim()
	          }));
	          _this10.elements.volume = volume;
	          container.appendChild(volume);
	        } // Toggle mute button


	        if (control === 'mute') {
	          volume.appendChild(createButton.call(_this10, 'mute'));
	        } // Volume range control


	        if (control === 'volume') {
	          // Set the attributes
	          var attributes = {
	            max: 1,
	            step: 0.05,
	            value: _this10.config.volume
	          }; // Create the volume range slider

	          volume.appendChild(createRange.call(_this10, 'volume', extend$1(attributes, {
	            id: "plyr-volume-".concat(data.id)
	          })));
	        }
	      } // Toggle captions button


	      if (control === 'captions') {
	        container.appendChild(createButton.call(_this10, 'captions', defaultAttributes));
	      } // Settings button / menu


	      if (control === 'settings' && !is$2.empty(_this10.config.settings)) {
	        var wrapper = createElement$1('div', extend$1({}, defaultAttributes, {
	          class: "".concat(defaultAttributes.class, " plyr__menu").trim(),
	          hidden: ''
	        }));
	        wrapper.appendChild(createButton.call(_this10, 'settings', {
	          'aria-haspopup': true,
	          'aria-controls': "plyr-settings-".concat(data.id),
	          'aria-expanded': false
	        }));
	        var popup = createElement$1('div', {
	          class: 'plyr__menu__container',
	          id: "plyr-settings-".concat(data.id),
	          hidden: ''
	        });
	        var inner = createElement$1('div');
	        var home = createElement$1('div', {
	          id: "plyr-settings-".concat(data.id, "-home")
	        }); // Create the menu

	        var menu = createElement$1('div', {
	          role: 'menu'
	        });
	        home.appendChild(menu);
	        inner.appendChild(home);
	        _this10.elements.settings.panels.home = home; // Build the menu items

	        _this10.config.settings.forEach(function (type) {
	          // TODO: bundle this with the createMenuItem helper and bindings
	          var menuItem = createElement$1('button', extend$1(getAttributesFromSelector(_this10.config.selectors.buttons.settings), {
	            type: 'button',
	            class: "".concat(_this10.config.classNames.control, " ").concat(_this10.config.classNames.control, "--forward"),
	            role: 'menuitem',
	            'aria-haspopup': true,
	            hidden: ''
	          })); // Bind menu shortcuts for keyboard users

	          bindMenuItemShortcuts.call(_this10, menuItem, type); // Show menu on click

	          on(menuItem, 'click', function () {
	            showMenuPanel.call(_this10, type, false);
	          });
	          var flex = createElement$1('span', null, i18n.get(type, _this10.config));
	          var value = createElement$1('span', {
	            class: _this10.config.classNames.menu.value
	          }); // Speed contains HTML entities

	          value.innerHTML = data[type];
	          flex.appendChild(value);
	          menuItem.appendChild(flex);
	          menu.appendChild(menuItem); // Build the panes

	          var pane = createElement$1('div', {
	            id: "plyr-settings-".concat(data.id, "-").concat(type),
	            hidden: ''
	          }); // Back button

	          var backButton = createElement$1('button', {
	            type: 'button',
	            class: "".concat(_this10.config.classNames.control, " ").concat(_this10.config.classNames.control, "--back")
	          }); // Visible label

	          backButton.appendChild(createElement$1('span', {
	            'aria-hidden': true
	          }, i18n.get(type, _this10.config))); // Screen reader label

	          backButton.appendChild(createElement$1('span', {
	            class: _this10.config.classNames.hidden
	          }, i18n.get('menuBack', _this10.config))); // Go back via keyboard

	          on(pane, 'keydown', function (event) {
	            // We only care about <-
	            if (event.which !== 37) {
	              return;
	            } // Prevent seek


	            event.preventDefault();
	            event.stopPropagation(); // Show the respective menu

	            showMenuPanel.call(_this10, 'home', true);
	          }, false); // Go back via button click

	          on(backButton, 'click', function () {
	            showMenuPanel.call(_this10, 'home', false);
	          }); // Add to pane

	          pane.appendChild(backButton); // Menu

	          pane.appendChild(createElement$1('div', {
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
	        var _attributes = extend$1({}, defaultAttributes, {
	          element: 'a',
	          href: _this10.download,
	          target: '_blank'
	        });

	        var download = _this10.config.urls.download;

	        if (!is$2.url(download) && _this10.isEmbed) {
	          extend$1(_attributes, {
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

	    if (is$2.function(this.config.controls)) {
	      this.config.controls = this.config.controls.call(this, props);
	    } // Convert falsy controls to empty array (primarily for empty strings)


	    if (!this.config.controls) {
	      this.config.controls = [];
	    }

	    if (is$2.element(this.config.controls) || is$2.string(this.config.controls)) {
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
	      if (is$2.string(this.config.controls)) {
	        container = replace(container);
	      } else if (is$2.element(container)) {
	        container.innerHTML = replace(container.innerHTML);
	      }
	    } // Controls container


	    var target; // Inject to custom location

	    if (is$2.string(this.config.selectors.controls.container)) {
	      target = document.querySelector(this.config.selectors.controls.container);
	    } // Inject into the container by default


	    if (!is$2.element(target)) {
	      target = this.elements.container;
	    } // Inject controls HTML (needs to be before captions, hence "afterbegin")


	    var insertMethod = is$2.element(container) ? 'insertAdjacentElement' : 'insertAdjacentHTML';
	    target[insertMethod]('afterbegin', container); // Find the elements if need be

	    if (!is$2.element(this.elements.controls)) {
	      controls.findElements.call(this);
	    } // Add pressed property to buttons


	    if (!is$2.empty(this.elements.buttons)) {
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
	        if (is$2.array(button) || is$2.nodeList(button)) {
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

	  if (is$2.object(input)) {
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
	      if (is$2.array(this.config.controls) && this.config.controls.includes('settings') && this.config.settings.includes('captions')) {
	        controls.setCaptionsMenu.call(this);
	      }

	      return;
	    } // Inject the container


	    if (!is$2.element(this.elements.captions)) {
	      this.elements.captions = createElement$1('div', getAttributesFromSelector(this.config.selectors.captions));
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

	    if (!is$2.boolean(active)) {
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

	        Object.assign(track, {
	          mode: 'hidden'
	        }); // Add event listener for cue changes

	        on.call(_this, track, 'cuechange', function () {
	          return captions.updateCues.call(_this);
	        });
	      });
	    } // Update language first time it matches, or if the previous matching track was removed


	    if (languageExists && this.language !== language || !tracks.includes(currentTrackNode)) {
	      captions.setLanguage.call(this, language);
	      captions.toggle.call(this, active && languageExists);
	    } // Enable or disable captions based on track length


	    toggleClass(this.elements.container, this.config.classNames.captions.enabled, !is$2.empty(tracks)); // Update available languages in list

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

	    var active = is$2.nullOrUndefined(input) ? !toggled : input; // Update state and trigger event

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

	    if (!is$2.number(index)) {
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

	    if (!is$2.string(input)) {
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

	    if (!is$2.track(currentTrack) && support.textTracks && this.captions.toggled) {
	      currentTrack = captions.getCurrentTrack.call(this);
	    }

	    if (is$2.track(currentTrack)) {
	      if (!is$2.empty(currentTrack.label)) {
	        return currentTrack.label;
	      }

	      if (!is$2.empty(currentTrack.language)) {
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

	    if (!is$2.element(this.elements.captions)) {
	      this.debug.warn('No captions element to render to');
	      return;
	    } // Only accept array or empty input


	    if (!is$2.nullOrUndefined(input) && !Array.isArray(input)) {
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
	      var caption = createElement$1('span', getAttributesFromSelector(this.config.selectors.caption));
	      caption.innerHTML = content;
	      this.elements.captions.appendChild(caption); // Trigger event

	      triggerEvent.call(this, this.media, 'cuechange');
	    }
	  }
	};

	// ==========================================================================
	// Plyr default config
	// ==========================================================================
	var defaults$2 = {
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
	  iconUrl: 'https://cdn.plyr.io/3.5.2/plyr.svg',
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
	var noop$1 = function noop() {};

	var Console$1 =
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
	      return this.enabled ? Function.prototype.bind.call(console.log, console) : noop$1;
	    }
	  }, {
	    key: "warn",
	    get: function get() {
	      // eslint-disable-next-line no-console
	      return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop$1;
	    }
	  }, {
	    key: "error",
	    get: function get() {
	      // eslint-disable-next-line no-console
	      return this.enabled ? Function.prototype.bind.call(console.error, console) : noop$1;
	    }
	  }]);

	  return Console;
	}();

	function onChange() {
	  if (!this.enabled) {
	    return;
	  } // Update toggle button


	  var button = this.player.elements.buttons.fullscreen;

	  if (is$2.element(button)) {
	    button.pressed = this.active;
	  } // Trigger an event


	  triggerEvent.call(this.player, this.target, this.active ? 'enterfullscreen' : 'exitfullscreen', true); // Trap focus in container

	  if (!browser.isIos) {
	    trapFocus.call(this.player, this.target, this.active);
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


	    var hasProperty = is$2.string(viewport.content) && viewport.content.includes(property);

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


	  onChange.call(this);
	}

	var Fullscreen =
	/*#__PURE__*/
	function () {
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

	    this.forceFallback = player.config.fullscreen.fallback === 'force'; // Register event listeners
	    // Handle event (incase user presses escape etc)

	    on.call(this.player, document, this.prefix === 'ms' ? 'MSFullscreenChange' : "".concat(this.prefix, "fullscreenchange"), function () {
	      // TODO: Filter for target??
	      onChange.call(_this);
	    }); // Fullscreen toggle on double click

	    on.call(this.player, this.player.elements.container, 'dblclick', function (event) {
	      // Ignore double click in controls
	      if (is$2.element(_this.player.elements.controls) && _this.player.elements.controls.contains(event.target)) {
	        return;
	      }

	      _this.toggle();
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
	      } else if (!is$2.empty(this.prefix)) {
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
	      } else if (!is$2.empty(this.prefix)) {
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
	      if (is$2.function(document.exitFullscreen)) {
	        return '';
	      } // Check for fullscreen support by vendor prefix


	      var value = '';
	      var prefixes = ['webkit', 'moz', 'ms'];
	      prefixes.some(function (pre) {
	        if (is$2.function(document["".concat(pre, "ExitFullscreen")]) || is$2.function(document["".concat(pre, "CancelFullScreen")])) {
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

	// `Math.sign` method implementation
	// https://tc39.github.io/ecma262/#sec-math.sign
	var mathSign = Math.sign || function sign(x) {
	  // eslint-disable-next-line no-self-compare
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};

	// `Math.sign` method
	// https://tc39.github.io/ecma262/#sec-math.sign
	_export$1({ target: 'Math', stat: true }, {
	  sign: mathSign
	});

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


	    if (!is$2.element(this.elements.controls)) {
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

	    if (is$2.string(this.config.title) && !is$2.empty(this.config.title)) {
	      label += ", ".concat(this.config.title);
	    } // If there's a play button, set label


	    Array.from(this.elements.buttons.play || []).forEach(function (button) {
	      button.setAttribute('aria-label', label);
	    }); // Set iframe title
	    // https://github.com/sampotts/plyr/issues/124

	    if (this.isEmbed) {
	      var iframe = getElement.call(this, 'iframe');

	      if (!is$2.element(iframe)) {
	        return;
	      } // Default to media type


	      var title = !is$2.empty(this.config.title) ? this.config.title : 'video';
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
	      Object.assign(target, {
	        pressed: _this3.playing
	      });
	    }); // Only update controls on non timeupdate events

	    if (is$2.event(event) && event.type === 'timeupdate') {
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
	  }
	};

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


	      if (!is$2.number(code)) {
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

	        if (is$2.element(focused)) {
	          var editable = player.config.selectors.editable;
	          var seek = elements.inputs.seek;

	          if (focused !== seek && matches$2(focused, editable)) {
	            return;
	          }

	          if (event.which === 32 && matches$2(focused, 'button, [role^="menuitem"]')) {
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
	        if (!player.isVimeo) {
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


	        if (!player.isEmbed && is$2.empty(player.config.ratio)) {
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

	        if (!is$2.element(wrapper)) {
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
	      var hasCustomHandler = is$2.function(customHandler);
	      var returned = true; // Execute custom handler

	      if (hasCustomHandler) {
	        returned = customHandler.call(player, event);
	      } // Only call default handler if not prevented in custom handler


	      if (returned && is$2.function(defaultHandler)) {
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
	      var hasCustomHandler = is$2.function(customHandler);
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

	        if (is$2.keyboardEvent(event) && code !== 39 && code !== 37) {
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

	        if (is$2.empty(seekTo)) {
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


	      if (player.config.toggleInvert && !is$2.element(elements.display.duration)) {
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

	var defineProperty$a = objectDefineProperty$1.f;

	var FunctionPrototype$1 = Function.prototype;
	var FunctionPrototypeToString$1 = FunctionPrototype$1.toString;
	var nameRE$1 = /^\s*function ([^ (]*)/;
	var NAME$2 = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors$1 && !(NAME$2 in FunctionPrototype$1)) {
	  defineProperty$a(FunctionPrototype$1, NAME$2, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString$1.call(this).match(nameRE$1)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var max$7 = Math.max;
	var min$9 = Math.min;
	var MAX_SAFE_INTEGER$3 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED$1 = 'Maximum allowed length exceeded';

	var SPECIES_SUPPORT$9 = arrayMethodHasSpeciesSupport$1('splice');

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export$1({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$9 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject$1(this);
	    var len = toLength$1(O.length);
	    var actualStart = toAbsoluteIndex$1(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$9(max$7(toInteger$1(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$3) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED$1);
	    }
	    A = arraySpeciesCreate$1(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty$1(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

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
	          pathStripped = path.replace(/^(css|img)!/, ''),
	          isLegacyIECss,
	          e;
	      numTries = numTries || 0;

	      if (/(^css!|\.css$)/.test(path)) {
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

	function loadScript(url) {
	  return new Promise(function (resolve, reject) {
	    loadjs_umd(url, {
	      success: resolve,
	      error: reject
	    });
	  });
	}

	function parseId(url) {
	  if (is$2.empty(url)) {
	    return null;
	  }

	  if (is$2.number(Number(url))) {
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

	    setAspectRatio.call(this); // Load the SDK if not already

	    if (!is$2.object(window.Vimeo)) {
	      loadScript(this.config.urls.vimeo.sdk).then(function () {
	        vimeo.ready.call(_this);
	      }).catch(function (error) {
	        _this.debug.warn('Vimeo SDK (player.js) failed to load', error);
	      });
	    } else {
	      vimeo.ready.call(this);
	    }
	  },
	  // API Ready
	  ready: function ready() {
	    var _this2 = this;

	    var player = this;
	    var config = player.config.vimeo; // Get Vimeo params for the iframe

	    var params = buildUrlParams(extend$1({}, {
	      loop: player.config.loop.active,
	      autoplay: player.autoplay,
	      muted: player.muted,
	      gesture: 'media',
	      playsinline: !this.config.fullscreen.iosNative
	    }, config)); // Get the source URL or ID

	    var source = player.media.getAttribute('src'); // Get from <div> if needed

	    if (is$2.empty(source)) {
	      source = player.media.getAttribute(player.config.attributes.embed.id);
	    }

	    var id = parseId(source); // Build an iframe

	    var iframe = createElement$1('iframe');
	    var src = format(player.config.urls.vimeo.iframe, id, params);
	    iframe.setAttribute('src', src);
	    iframe.setAttribute('allowfullscreen', '');
	    iframe.setAttribute('allowtransparency', '');
	    iframe.setAttribute('allow', 'autoplay'); // Get poster, if already set

	    var poster = player.poster; // Inject the package

	    var wrapper = createElement$1('div', {
	      poster: poster,
	      class: player.config.classNames.embedContainer
	    });
	    wrapper.appendChild(iframe);
	    player.media = replaceElement(wrapper, player.media); // Get poster image

	    fetch(format(player.config.urls.vimeo.api, id), 'json').then(function (response) {
	      if (is$2.empty(response)) {
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
	        var toggle = is$2.boolean(input) ? input : false;
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
	        var toggle = is$2.boolean(input) ? input : player.config.loop.active;
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

	      player.embed.ratio = [width, height];
	      setAspectRatio.call(_this2);
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

	      if (is$2.element(player.embed.element) && player.supported.ui) {
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

	function parseId$1(url) {
	  if (is$2.empty(url)) {
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

	function getHost$2(config) {
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

	    if (is$2.object(window.YT) && is$2.function(window.YT.Player)) {
	      youtube.ready.call(this);
	    } else {
	      // Reference current global callback
	      var callback = window.onYouTubeIframeAPIReady; // Set callback to process queue

	      window.onYouTubeIframeAPIReady = function () {
	        // Call global callback if set
	        if (is$2.function(callback)) {
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
	      if (is$2.object(data)) {
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
	    var player = this; // Ignore already setup (race condition)

	    var currentId = player.media && player.media.getAttribute('id');

	    if (!is$2.empty(currentId) && currentId.startsWith('youtube-')) {
	      return;
	    } // Get the source URL or ID


	    var source = player.media.getAttribute('src'); // Get from <div> if needed

	    if (is$2.empty(source)) {
	      source = player.media.getAttribute(this.config.attributes.embed.id);
	    } // Replace the <iframe> with a <div> due to YouTube API issues


	    var videoId = parseId$1(source);
	    var id = generateId(player.provider); // Get poster, if already set

	    var poster = player.poster; // Replace media element

	    var container = createElement$1('div', {
	      id: id,
	      poster: poster
	    });
	    player.media = replaceElement(container, player.media); // Id to poster wrapper

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
	    var config = player.config.youtube; // Setup instance
	    // https://developers.google.com/youtube/iframe_api_reference

	    player.embed = new window.YT.Player(id, {
	      videoId: videoId,
	      host: getHost$2(config),
	      playerVars: extend$1({}, {
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
	          if (is$2.function(player.media.play)) {
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
	              var toggle = is$2.boolean(input) ? input : muted;
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
	              if (!player.config.autoplay && player.media.paused && !player.embed.hasPlayed) {
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
	      this.elements.wrapper = createElement$1('div', {
	        class: this.config.classNames.video
	      }); // Wrap the video in a container

	      wrap$2(this.media, this.elements.wrapper); // Faux poster container

	      this.elements.poster = createElement$1('div', {
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

	var Ads =
	/*#__PURE__*/
	function () {
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


	      if (!is$2.object(window.google) || !is$2.object(window.google.ima)) {
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
	      // Create the container for our advertisements
	      this.elements.container = createElement$1('div', {
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
	      if (!is$2.empty(this.cuePoints)) {
	        this.cuePoints.forEach(function (cuePoint) {
	          if (cuePoint !== 0 && cuePoint !== -1 && cuePoint < _this7.player.duration) {
	            var seekElement = _this7.player.elements.progress;

	            if (is$2.element(seekElement)) {
	              var cuePercentage = 100 / _this7.player.duration * cuePoint;
	              var cue = createElement$1('span', {
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
	          this.loadAds();
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

	        if (is$2.empty(_this9.cuePoints)) {
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

	      if (is$2.array(handlers)) {
	        handlers.forEach(function (handler) {
	          if (is$2.function(handler)) {
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
	      if (!is$2.array(this.events[event])) {
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
	      if (!is$2.nullOrUndefined(this.safetyTimer)) {
	        this.player.debug.log("Safety timer cleared from: ".concat(from));
	        clearTimeout(this.safetyTimer);
	        this.safetyTimer = null;
	      }
	    }
	  }, {
	    key: "enabled",
	    get: function get() {
	      var config = this.config;
	      return this.player.isHTML5 && this.player.isVideo && config.enabled && (!is$2.empty(config.publisherId) || is$2.url(config.tagUrl));
	    }
	  }, {
	    key: "tagUrl",
	    get: function get() {
	      var config = this.config;

	      if (is$2.url(config.tagUrl)) {
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

	var internalFindIndex = arrayMethods$1(6);
	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES$2 = true;

	// Shouldn't skip holes
	if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$2 = false; });

	// `Array.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
	_export$1({ target: 'Array', proto: true, forced: SKIPS_HOLES$2 }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return internalFindIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$1(FIND_INDEX);

	var parseVtt = function parseVtt(vttDataString) {
	  var processedList = [];
	  var frames = vttDataString.split(/\r\n\r\n|\n\n|\r\r/);
	  frames.forEach(function (frame) {
	    var result = {};
	    var lines = frame.split(/\r\n|\n|\r/);
	    lines.forEach(function (line) {
	      if (!is$2.number(result.startTime)) {
	        // The line with start and end times on it is the first line of interest
	        var matchTimes = line.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/); // Note that this currently ignores caption formatting directives that are optionally on the end of this line - fine for non-captions VTT

	        if (matchTimes) {
	          result.startTime = Number(matchTimes[1] || 0) * 60 * 60 + Number(matchTimes[2]) * 60 + Number(matchTimes[3]) + Number("0.".concat(matchTimes[4]));
	          result.endTime = Number(matchTimes[6] || 0) * 60 * 60 + Number(matchTimes[7]) * 60 + Number(matchTimes[8]) + Number("0.".concat(matchTimes[9]));
	        }
	      } else if (!is$2.empty(line.trim()) && is$2.empty(result.text)) {
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

	        if (is$2.empty(src)) {
	          throw new Error('Missing previewThumbnails.src config attribute');
	        } // If string, convert into single-element list


	        var urls = is$2.string(src) ? [src] : src; // Loop through each src URL. Download and process the VTT file, storing the resulting data in this.thumbnails

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

	      if (!is$2.event(event) || !['touchmove', 'mousemove'].includes(event.type)) {
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
	      this.elements.thumb.container = createElement$1('div', {
	        class: this.player.config.classNames.previewThumbnails.thumbContainer
	      }); // Wrapper for the image for styling

	      this.elements.thumb.imageContainer = createElement$1('div', {
	        class: this.player.config.classNames.previewThumbnails.imageContainer
	      });
	      this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer); // Create HTML element, parent+span: time text (e.g., 01:32:00)

	      var timeContainer = createElement$1('div', {
	        class: this.player.config.classNames.previewThumbnails.timeContainer
	      });
	      this.elements.thumb.time = createElement$1('span', {}, '00:00');
	      timeContainer.appendChild(this.elements.thumb.time);
	      this.elements.thumb.container.appendChild(timeContainer); // Inject the whole thumb

	      if (is$2.element(this.player.elements.progress)) {
	        this.player.elements.progress.appendChild(this.elements.thumb.container);
	      } // Create HTML element: plyr__preview-scrubbing-container


	      this.elements.scrubbing.container = createElement$1('div', {
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


	      var multiplier = this.thumbContainerHeight / frame.h; // eslint-disable-next-line no-param-reassign

	      previewImage.style.height = "".concat(Math.floor(previewImage.naturalHeight * multiplier), "px"); // eslint-disable-next-line no-param-reassign

	      previewImage.style.width = "".concat(Math.floor(previewImage.naturalWidth * multiplier), "px"); // eslint-disable-next-line no-param-reassign

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

	    if (is$2.string(attributes)) {
	      insertElement(type, this.media, {
	        src: attributes
	      });
	    } else if (is$2.array(attributes)) {
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

	      if (is$2.element(_this2.elements.container)) {
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
	        media: createElement$1(tagName, attributes)
	      }); // Inject the new element

	      _this2.elements.container.appendChild(_this2.media); // Autoplay the new source?


	      if (is$2.boolean(input.autoplay)) {
	        _this2.config.autoplay = input.autoplay;
	      } // Set attributes for audio and video


	      if (_this2.isHTML5) {
	        if (_this2.config.crossorigin) {
	          _this2.media.setAttribute('crossorigin', '');
	        }

	        if (_this2.config.autoplay) {
	          _this2.media.setAttribute('autoplay', '');
	        }

	        if (!is$2.empty(input.poster)) {
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

	    if (is$2.string(this.media)) {
	      this.media = document.querySelectorAll(this.media);
	    } // jQuery, NodeList or Array passed, use first element


	    if (window.jQuery && this.media instanceof jQuery || is$2.nodeList(this.media) || is$2.array(this.media)) {
	      // eslint-disable-next-line
	      this.media = this.media[0];
	    } // Set config


	    this.config = extend$1({}, defaults$2, Plyr.defaults, options || {}, function () {
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

	    this.debug = new Console$1(this.config.debug); // Log config options and support

	    this.debug.log('Config', this.config);
	    this.debug.log('Support', support); // We need an element to setup

	    if (is$2.nullOrUndefined(this.media) || !is$2.element(this.media)) {
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

	        if (is$2.element(iframe)) {
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


	        if (is$2.empty(this.provider) || !Object.keys(providers).includes(this.provider)) {
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

	    this.storage = new Storage$1(this); // Store reference

	    this.media.plyr = this; // Wrap media

	    if (!is$2.element(this.elements.container)) {
	      this.elements.container = createElement$1('div', {
	        tabindex: 0
	      });
	      wrap$2(this.media, this.elements.container);
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


	    if (this.isHTML5 && this.config.autoplay) {
	      setTimeout(function () {
	        return _this.play();
	      }, 10);
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

	      if (!is$2.function(this.media.play)) {
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
	      if (!this.playing || !is$2.function(this.media.pause)) {
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
	     * @param {Boolean} input
	     */
	    value: function togglePlay(input) {
	      // Toggle based on current state if nothing passed
	      var toggle = is$2.boolean(input) ? input : !this.playing;

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
	      } else if (is$2.function(this.media.stop)) {
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
	      this.currentTime = this.currentTime - (is$2.number(seekTime) ? seekTime : this.config.seekTime);
	    }
	    /**
	     * Fast forward
	     * @param {Number} seekTime - how far to fast forward in seconds. Defaults to the config.seekTime
	     */

	  }, {
	    key: "forward",
	    value: function forward(seekTime) {
	      this.currentTime = this.currentTime + (is$2.number(seekTime) ? seekTime : this.config.seekTime);
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
	      this.volume = volume + (is$2.number(step) ? step : 0);
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

	        if (hiding && this.config.controls.includes('settings') && !is$2.empty(this.config.settings)) {
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


	          if (is$2.function(callback)) {
	            callback();
	          }
	        } else {
	          // Unbind listeners
	          unbindListeners.call(_this3); // Replace the container with the original element provided

	          replaceElement(_this3.elements.original, _this3.elements.container); // Event

	          triggerEvent.call(_this3, _this3.elements.original, 'destroyed', true); // Callback

	          if (is$2.function(callback)) {
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

	        if (this.embed !== null && is$2.function(this.embed.destroy)) {
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


	      var inputIsValid = is$2.number(input) && input > 0; // Set

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

	      if (is$2.number(buffered)) {
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
	      var duration = !is$2.number(realDuration) || realDuration === Infinity ? 0 : realDuration; // If config duration is funky, use regular duration

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

	      if (is$2.string(volume)) {
	        volume = Number(volume);
	      } // Load volume from storage if no value specified


	      if (!is$2.number(volume)) {
	        volume = this.storage.get('volume');
	      } // Use config if all else fails


	      if (!is$2.number(volume)) {
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

	      if (!is$2.empty(value) && this.muted && volume > 0) {
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

	      if (!is$2.boolean(toggle)) {
	        toggle = this.storage.get('muted');
	      } // Use config if all else fails


	      if (!is$2.boolean(toggle)) {
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

	      if (is$2.number(input)) {
	        speed = input;
	      }

	      if (!is$2.number(speed)) {
	        speed = this.storage.get('speed');
	      }

	      if (!is$2.number(speed)) {
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

	      var quality = [!is$2.empty(input) && Number(input), this.storage.get('quality'), config.selected, config.default].find(is$2.number);
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
	     * @param {Boolean} input - Whether to loop or not
	     */

	  }, {
	    key: "loop",
	    set: function set(input) {
	      var toggle = is$2.boolean(input) ? input : this.config.loop.active;
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
	      return is$2.url(download) ? download : this.source;
	    }
	    /**
	     * Set the download URL
	     */
	    ,
	    set: function set(input) {
	      if (!is$2.url(input)) {
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

	      return this.media.getAttribute('poster');
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
	      return is$2.array(ratio) ? ratio.join(':') : ratio;
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

	      if (!is$2.string(input) || !validateRatio(input)) {
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
	      var toggle = is$2.boolean(input) ? input : this.config.autoplay;
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


	      var toggle = is$2.boolean(input) ? input : !this.pip; // Toggle based on current state
	      // Safari

	      if (is$2.function(this.media.webkitSetPresentationMode)) {
	        this.media.webkitSetPresentationMode(toggle ? pip.active : pip.inactive);
	      } // Chrome


	      if (is$2.function(this.media.requestPictureInPicture)) {
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


	      if (!is$2.empty(this.media.webkitPresentationMode)) {
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

	      if (is$2.string(selector)) {
	        targets = Array.from(document.querySelectorAll(selector));
	      } else if (is$2.nodeList(selector)) {
	        targets = Array.from(selector);
	      } else if (is$2.array(selector)) {
	        targets = selector.filter(is$2.element);
	      }

	      if (is$2.empty(targets)) {
	        return null;
	      }

	      return targets.map(function (t) {
	        return new Plyr(t, options);
	      });
	    }
	  }]);

	  return Plyr;
	}();

	Plyr.defaults = cloneDeep(defaults$2);

	var sources = {
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
	      src: 'https://vimeo.com/76979871',
	      provider: 'vimeo'
	    }]
	  }
	};

	// Toggle class on an element
	var toggleClass$1 = function toggleClass(element) {
	  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	  var toggle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	  return element && element.classList[toggle ? 'add' : 'remove'](className);
	};

	(function () {
	  var host = window.location.host;
	  var env = {
	    prod: host === 'plyr.io',
	    dev: host === 'dev.plyr.io'
	  };
	  document.addEventListener('DOMContentLoaded', function () {
	    singleton.context(function () {
	      var selector = '#player'; // Setup share buttons

	      Shr.setup('.js-shr', {
	        count: {
	          className: 'button__count'
	        },
	        wrapper: {
	          className: 'button--with-count'
	        }
	      }); // Setup the player

	      var player = new Plyr(selector, {
	        debug: true,
	        title: 'View From A Blue Moon',
	        iconUrl: 'dist/demo.svg',
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
	          enabled: env.prod || env.dev,
	          publisherId: '918848828995742'
	        },
	        previewThumbnails: {
	          enabled: true,
	          src: ['https://cdn.plyr.io/static/demo/thumbs/100p.vtt', 'https://cdn.plyr.io/static/demo/thumbs/240p.vtt']
	        }
	      }); // Expose for tinkering in the console

	      window.player = player; // Setup type toggle

	      var buttons = document.querySelectorAll('[data-source]');
	      var types = Object.keys(sources);
	      var historySupport = Boolean(window.history && window.history.pushState);
	      var currentType = window.location.hash.substring(1);
	      var hasCurrentType = !currentType.length;

	      function render(type) {
	        // Remove active classes
	        Array.from(buttons).forEach(function (button) {
	          return toggleClass$1(button.parentElement, 'active', false);
	        }); // Set active on parent

	        toggleClass$1(document.querySelector("[data-source=\"".concat(type, "\"]")), 'active', true); // Show cite

	        Array.from(document.querySelectorAll('.plyr__cite')).forEach(function (cite) {
	          // eslint-disable-next-line no-param-reassign
	          cite.hidden = true;
	        });
	        document.querySelector(".plyr__cite--".concat(type)).hidden = false;
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


	      Array.from(buttons).forEach(function (button) {
	        button.addEventListener('click', function () {
	          var type = button.getAttribute('data-source');
	          setSource(type);

	          if (historySupport) {
	            window.history.pushState({
	              type: type
	            }, '', "#".concat(type));
	          }
	        });
	      }); // List for backwards/forwards

	      window.addEventListener('popstate', function (event) {
	        if (event.state && Object.keys(event.state).includes('type')) {
	          setSource(event.state.type);
	        }
	      }); // If there's no current type set, assume video

	      if (hasCurrentType) {
	        currentType = 'video';
	      } // Replace current history state


	      if (historySupport && types.includes(currentType)) {
	        window.history.replaceState({
	          type: currentType
	        }, '', hasCurrentType ? '' : "#".concat(currentType));
	      } // If it's not video, load the source


	      if (currentType !== 'video') {
	        setSource(currentType, true);
	      }

	      render(currentType);
	    });
	  }); // Raven / Sentry
	  // For demo site (https://plyr.io) only

	  if (env.prod) {
	    singleton.config('https://d4ad9866ad834437a4754e23937071e4@sentry.io/305555').install();
	  }
	})();

}());
