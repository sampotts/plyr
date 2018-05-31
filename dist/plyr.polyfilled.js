typeof navigator === "object" && (function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('Plyr', factory) :
	(global.Plyr = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _redefine = createCommonjsModule(function (module) {
var SRC = _uid('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

_core.inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === _global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    _hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    _hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
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

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var TYPED = _uid('typed_array');
var VIEW = _uid('view');
var ABV = !!(_global.ArrayBuffer && _global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = _global[TypedArrayConstructors[i++]]) {
    _hide(Typed.prototype, TYPED, true);
    _hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

var _typed = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

var _library = false;

var _redefineAll = function (target, src, safe) {
  for (var key in src) _redefine(target, key, src[key], safe);
  return target;
};

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

// https://tc39.github.io/ecma262/#sec-toindex


var _toIndex = function (it) {
  if (it === undefined) return 0;
  var number = _toInteger(it);
  var length = _toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
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

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$1
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

var _arrayFill = function fill(value /* , start = 0, end = @length */) {
  var O = _toObject(this);
  var length = _toLength(O.length);
  var aLen = arguments.length;
  var index = _toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : _toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var _typedBuffer = createCommonjsModule(function (module, exports) {











var gOPN = _objectGopn.f;
var dP = _objectDp.f;


var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = _global[ARRAY_BUFFER];
var $DataView = _global[DATA_VIEW];
var Math = _global.Math;
var RangeError = _global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = _global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = _descriptors ? '_b' : BUFFER;
var $LENGTH = _descriptors ? '_l' : BYTE_LENGTH;
var $OFFSET = _descriptors ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = _toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = _toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!_typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    _anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = _toIndex(length);
    this._b = _arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    _anInstance(this, $DataView, DATA_VIEW);
    _anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = _toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : _toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (_descriptors) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  _redefineAll($DataView[PROTOTYPE], {
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
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!_fails(function () {
    $ArrayBuffer(1);
  }) || !_fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || _fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      _anInstance(this, $ArrayBuffer);
      return new BaseBuffer(_toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) _hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!_library) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) _redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
_setToStringTag($ArrayBuffer, ARRAY_BUFFER);
_setToStringTag($DataView, DATA_VIEW);
_hide($DataView[PROTOTYPE], _typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var ArrayBuffer = _global.ArrayBuffer;

var $ArrayBuffer = _typedBuffer.ArrayBuffer;
var $DataView = _typedBuffer.DataView;
var $isView = _typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW$1 = _typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

_export(_export.G + _export.W + _export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

_export(_export.S + _export.F * !_typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || _isObject(it) && VIEW$1 in it;
  }
});

_export(_export.P + _export.U + _export.F * _fails(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(_anObject(this), start); // FF fix
    var len = _anObject(this).byteLength;
    var first = _toAbsoluteIndex(start, len);
    var final = _toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (_speciesConstructor(this, $ArrayBuffer))(_toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

_setSpecies(ARRAY_BUFFER);

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _iterators = {};

// check on default Array iterator

var ITERATOR = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR] === it);
};

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR$1 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var SPECIES$2 = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex





var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto$1 = Array.prototype;
if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto$1[UNSCOPABLES][key] = true;
};

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

var ITERATOR$2 = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR$2] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && !_has(IteratorPrototype, ITERATOR$2)) _hide(IteratorPrototype, ITERATOR$2, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR$2])) {
    _hide(proto, ITERATOR$2, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () { SAFE_CLOSING = true; };
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$3] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

var _arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = _toObject(this);
  var len = _toLength(O.length);
  var to = _toAbsoluteIndex(target, len);
  var from = _toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : _toAbsoluteIndex(end, len)) - from, len - to);
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

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

var gOPD = Object.getOwnPropertyDescriptor;

var f$3 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$3
};

var _typedArray = createCommonjsModule(function (module) {
if (_descriptors) {
  var LIBRARY = _library;
  var global = _global;
  var fails = _fails;
  var $export = _export;
  var $typed = _typed;
  var $buffer = _typedBuffer;
  var ctx = _ctx;
  var anInstance = _anInstance;
  var propertyDesc = _propertyDesc;
  var hide = _hide;
  var redefineAll = _redefineAll;
  var toInteger = _toInteger;
  var toLength = _toLength;
  var toIndex = _toIndex;
  var toAbsoluteIndex = _toAbsoluteIndex;
  var toPrimitive = _toPrimitive;
  var has = _has;
  var classof = _classof;
  var isObject = _isObject;
  var toObject = _toObject;
  var isArrayIter = _isArrayIter;
  var create = _objectCreate;
  var getPrototypeOf = _objectGpo;
  var gOPN = _objectGopn.f;
  var getIterFn = core_getIteratorMethod;
  var uid = _uid;
  var wks = _wks;
  var createArrayMethod = _arrayMethods;
  var createArrayIncludes = _arrayIncludes;
  var speciesConstructor = _speciesConstructor;
  var ArrayIterators = es6_array_iterator;
  var Iterators = _iterators;
  var $iterDetect = _iterDetect;
  var setSpecies = _setSpecies;
  var arrayFill = _arrayFill;
  var arrayCopyWithin = _arrayCopyWithin;
  var $DP = _objectDp;
  var $GOPD = _objectGopd;
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };
});

_typedArray('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

_typedArray('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});
var _meta_1 = _meta.KEY;
var _meta_2 = _meta.NEED;
var _meta_3 = _meta.fastKey;
var _meta_4 = _meta.getWeak;
var _meta_5 = _meta.onFreeze;

var _validateCollection = function (it, TYPE) {
  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

var dP$1 = _objectDp.f;









var fastKey = _meta.fastKey;

var SIZE = _descriptors ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

var _collectionStrong = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = _objectCreate(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = _validateCollection(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        _validateCollection(this, NAME);
        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(_validateCollection(this, NAME), key);
      }
    });
    if (_descriptors) dP$1(C.prototype, 'size', {
      get: function () {
        return _validateCollection(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _iterDefine(C, NAME, function (iterated, kind) {
      this._t = _validateCollection(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return _iterStep(1);
      }
      // return step by kind
      if (kind == 'keys') return _iterStep(0, entry.k);
      if (kind == 'values') return _iterStep(0, entry.v);
      return _iterStep(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    _setSpecies(NAME);
  }
};

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */


var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

var setPrototypeOf = _setProto.set;
var _inheritIfRequired = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = _global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    _redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !_isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _redefineAll(C.prototype, methods);
    _meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = _fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = _iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && _fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        _anInstance(target, C, NAME);
        var that = _inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  _setToStringTag(C, NAME);

  O[NAME] = C;
  _export(_export.G + _export.W + _export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

var MAP = 'Map';

// 23.1 Map Objects
var es6_map = _collection(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = _collectionStrong.getEntry(_validateCollection(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return _collectionStrong.def(_validateCollection(this, MAP), key === 0 ? 0 : key, value);
  }
}, _collectionStrong, true);

var SET = 'Set';

// 23.2 Set Objects
var es6_set = _collection(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
  }
}, _collectionStrong);

var f$4 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$4
};

// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

var getWeak = _meta.getWeak;







var arrayFind = _arrayMethods(5);
var arrayFindIndex = _arrayMethods(6);
var id$1 = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
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
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

var _collectionWeak = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id$1++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!_isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(_validateCollection(this, NAME))['delete'](key);
        return data && _has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!_isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(_validateCollection(this, NAME)).has(key);
        return data && _has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(_anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

var es6_weakMap = createCommonjsModule(function (module) {
var each = _arrayMethods(0);







var WEAK_MAP = 'WeakMap';
var getWeak = _meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = _collectionWeak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (_isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(_validateCollection(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return _collectionWeak.def(_validateCollection(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = _collection(WEAK_MAP, wrapper, methods, _collectionWeak, true, true);

// IE11 WeakMap frozen keys fix
if (_fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = _collectionWeak.getConstructor(wrapper, WEAK_MAP);
  _objectAssign(InternalMap.prototype, methods);
  _meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    _redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (_isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
});

var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
_collection(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return _collectionWeak.def(_validateCollection(this, WEAK_SET), value, true);
  }
}, _collectionWeak, false, true);

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)



var rApply = (_global.Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
_export(_export.S + _export.F * !_fails(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = _aFunction(target);
    var L = _anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

var _bind = Function.bind || function bind(that /* , ...args */) {
  var fn = _aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : _invoke(fn, args, that);
  };
  if (_isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])







var rConstruct = (_global.Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = _fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !_fails(function () {
  rConstruct(function () { /* empty */ });
});

_export(_export.S + _export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    _aFunction(Target);
    _anObject(args);
    var newTarget = arguments.length < 3 ? Target : _aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (_bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = _objectCreate(_isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return _isObject(result) ? result : instance;
  }
});

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)





// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
_export(_export.S + _export.F * _fails(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(_objectDp.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    _anObject(target);
    propertyKey = _toPrimitive(propertyKey, true);
    _anObject(attributes);
    try {
      _objectDp.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

// 26.1.4 Reflect.deleteProperty(target, propertyKey)

var gOPD$1 = _objectGopd.f;


_export(_export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD$1(_anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

// 26.1.6 Reflect.get(target, propertyKey [, receiver])







function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (_anObject(target) === receiver) return target[propertyKey];
  if (desc = _objectGopd.f(target, propertyKey)) return _has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (_isObject(proto = _objectGpo(target))) return get(proto, propertyKey, receiver);
}

_export(_export.S, 'Reflect', { get: get });

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)




_export(_export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return _objectGopd.f(_anObject(target), propertyKey);
  }
});

// 26.1.8 Reflect.getPrototypeOf(target)




_export(_export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return _objectGpo(_anObject(target));
  }
});

// 26.1.9 Reflect.has(target, propertyKey)


_export(_export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

// 26.1.10 Reflect.isExtensible(target)


var $isExtensible = Object.isExtensible;

_export(_export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    _anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

// all object keys, includes non-enumerable and symbols



var Reflect$1 = _global.Reflect;
var _ownKeys = Reflect$1 && Reflect$1.ownKeys || function ownKeys(it) {
  var keys = _objectGopn.f(_anObject(it));
  var getSymbols = _objectGops.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

// 26.1.11 Reflect.ownKeys(target)


_export(_export.S, 'Reflect', { ownKeys: _ownKeys });

// 26.1.12 Reflect.preventExtensions(target)


var $preventExtensions = Object.preventExtensions;

_export(_export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    _anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])









function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = _objectGopd.f(_anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (_isObject(proto = _objectGpo(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = _propertyDesc(0);
  }
  if (_has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !_isObject(receiver)) return false;
    existingDescriptor = _objectGopd.f(receiver, propertyKey) || _propertyDesc(0);
    existingDescriptor.value = V;
    _objectDp.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

_export(_export.S, 'Reflect', { set: set });

// 26.1.14 Reflect.setPrototypeOf(target, proto)



if (_setProto) _export(_export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    _setProto.check(target, proto);
    try {
      _setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

var process = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process) == 'process') {
    defer = function (id) {
      process.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$1 = _global.process;
var Promise$1 = _global.Promise;
var isNode = _cof(process$1) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process$1.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process$1.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    var promise = Promise$1.resolve();
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
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$5 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$5
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var task = _task.set;
var microtask = _microtask();



var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process$2 = _global.process;
var $Promise = _global[PROMISE];
var isNode$1 = _classof(process$2) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode$1 || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode$1) {
          process$2.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode$1) {
      process$2.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode$1 ? process$2.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

var f$6 = _wks;

var _wksExt = {
	f: f$6
};

var defineProperty = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
};

// all enumerable object keys, includes symbols



var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$7 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
};

var _objectGopnExt = {
	f: f$7
};

// ECMAScript 6 symbols shim





var META = _meta.KEY;



















var gOPD$2 = _objectGopd.f;
var dP$2 = _objectDp.f;
var gOPN$1 = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE$1 = typeof $Symbol == 'function';
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$2({}, 'a', {
    get: function () { return dP$2(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD$2(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$2(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$2(ObjectProto$1, key, protoDesc);
} : dP$2;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE$1 && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$2(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP$2(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD$2(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN$1(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE$1) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE$1, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE$1, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE$1 || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!_isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

// most Object methods by ES6 should accept primitives



var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.5 Object.freeze(O)

var meta = _meta.onFreeze;

_objectSap('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && _isObject(it) ? $freeze(meta(it)) : it;
  };
});

// 19.1.2.17 Object.seal(O)

var meta$1 = _meta.onFreeze;

_objectSap('seal', function ($seal) {
  return function seal(it) {
    return $seal && _isObject(it) ? $seal(meta$1(it)) : it;
  };
});

// 19.1.2.15 Object.preventExtensions(O)

var meta$2 = _meta.onFreeze;

_objectSap('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && _isObject(it) ? $preventExtensions(meta$2(it)) : it;
  };
});

// 19.1.2.12 Object.isFrozen(O)


_objectSap('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return _isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

// 19.1.2.13 Object.isSealed(O)


_objectSap('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return _isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

// 19.1.2.11 Object.isExtensible(O)


_objectSap('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return _isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)

var $getOwnPropertyDescriptor$1 = _objectGopd.f;

_objectSap('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor$1(_toIobject(it), key);
  };
});

// 19.1.2.9 Object.getPrototypeOf(O)



_objectSap('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return _objectGpo(_toObject(it));
  };
});

// 19.1.2.14 Object.keys(O)



_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

// 19.1.2.7 Object.getOwnPropertyNames(O)
_objectSap('getOwnPropertyNames', function () {
  return _objectGopnExt.f;
});

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

// 7.2.9 SameValue(x, y)
var _sameValue = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

// 19.1.3.10 Object.is(value1, value2)

_export(_export.S, 'Object', { is: _sameValue });

var dP$3 = _objectDp.f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || _descriptors && dP$3(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

_export(_export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = _toIobject(callSite.raw);
    var len = _toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
_export(_export.S + _export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (_toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var $at = _stringAt(false);
_export(_export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

var _stringRepeat = function repeat(count) {
  var str = String(_defined(this));
  var res = '';
  var n = _toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

_export(_export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: _stringRepeat
});

// 7.2.8 IsRegExp(argument)


var MATCH = _wks('match');
var _isRegexp = function (it) {
  var isRegExp;
  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
};

// helper for String#{startsWith, endsWith, includes}



var _stringContext = function (that, searchString, NAME) {
  if (_isRegexp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(_defined(that));
};

var MATCH$1 = _wks('match');
var _failsIsRegexp = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH$1] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

_export(_export.P + _export.F * _failsIsRegexp(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = _stringContext(this, searchString, STARTS_WITH);
    var index = _toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

_export(_export.P + _export.F * _failsIsRegexp(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = _stringContext(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = _toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(_toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

var INCLUDES = 'includes';

_export(_export.P + _export.F * _failsIsRegexp(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~_stringContext(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// 21.2.5.3 get RegExp.prototype.flags

var _flags = function () {
  var that = _anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// 21.2.5.3 get RegExp.prototype.flags()
if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
  configurable: true,
  get: _flags
});

var _fixReWks = function (KEY, length, exec) {
  var SYMBOL = _wks(KEY);
  var fns = exec(_defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (_fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    _redefine(String.prototype, KEY, strfn);
    _hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

// @@match logic
_fixReWks('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

// @@replace logic
_fixReWks('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

// @@split logic
_fixReWks('split', 2, function (defined, SPLIT, $split) {
  var isRegExp = _isRegexp;
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

// @@search logic
_fixReWks('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

_export(_export.S + _export.F * !_iterDetect(function (iter) { }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

// WebKit Array.of isn't generic
_export(_export.S + _export.F * _fails(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) _createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)


_export(_export.P, 'Array', { copyWithin: _arrayCopyWithin });

_addToUnscopables('copyWithin');

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $find = _arrayMethods(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
_export(_export.P + _export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY);

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

var $find$1 = _arrayMethods(6);
var KEY$1 = 'findIndex';
var forced$1 = true;
// Shouldn't skip holes
if (KEY$1 in []) Array(1)[KEY$1](function () { forced$1 = false; });
_export(_export.P + _export.F * forced$1, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY$1);

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


_export(_export.P, 'Array', { fill: _arrayFill });

_addToUnscopables('fill');

// 20.1.2.2 Number.isFinite(number)

var _isFinite = _global.isFinite;

_export(_export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

// 20.1.2.3 Number.isInteger(number)

var floor$1 = Math.floor;
var _isInteger = function isInteger(it) {
  return !_isObject(it) && isFinite(it) && floor$1(it) === it;
};

// 20.1.2.3 Number.isInteger(number)


_export(_export.S, 'Number', { isInteger: _isInteger });

// 20.1.2.5 Number.isSafeInteger(number)


var abs = Math.abs;

_export(_export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return _isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

// 20.1.2.4 Number.isNaN(number)


_export(_export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

// 20.1.2.1 Number.EPSILON


_export(_export.S, 'Number', { EPSILON: Math.pow(2, -52) });

// 20.1.2.10 Number.MIN_SAFE_INTEGER


_export(_export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

// 20.1.2.6 Number.MAX_SAFE_INTEGER


_export(_export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

// 20.2.2.20 Math.log1p(x)
var _mathLog1p = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

// 20.2.2.3 Math.acosh(x)


var sqrt = Math.sqrt;
var $acosh = Math.acosh;

_export(_export.S + _export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : _mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

// 20.2.2.5 Math.asinh(x)

var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
_export(_export.S + _export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

// 20.2.2.7 Math.atanh(x)

var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
_export(_export.S + _export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

// 20.2.2.28 Math.sign(x)
var _mathSign = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

// 20.2.2.9 Math.cbrt(x)



_export(_export.S, 'Math', {
  cbrt: function cbrt(x) {
    return _mathSign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

// 20.2.2.11 Math.clz32(x)


_export(_export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

// 20.2.2.12 Math.cosh(x)

var exp = Math.exp;

_export(_export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
var _mathExpm1 = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

// 20.2.2.14 Math.expm1(x)



_export(_export.S + _export.F * (_mathExpm1 != Math.expm1), 'Math', { expm1: _mathExpm1 });

// 20.2.2.16 Math.fround(x)

var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

var _mathFround = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = _mathSign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

// 20.2.2.16 Math.fround(x)


_export(_export.S, 'Math', { fround: _mathFround });

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])

var abs$1 = Math.abs;

_export(_export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs$1(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

// 20.2.2.18 Math.imul(x, y)

var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
_export(_export.S + _export.F * _fails(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

// 20.2.2.20 Math.log1p(x)


_export(_export.S, 'Math', { log1p: _mathLog1p });

// 20.2.2.21 Math.log10(x)


_export(_export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

// 20.2.2.22 Math.log2(x)


_export(_export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

// 20.2.2.28 Math.sign(x)


_export(_export.S, 'Math', { sign: _mathSign });

// 20.2.2.30 Math.sinh(x)


var exp$1 = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
_export(_export.S + _export.F * _fails(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (_mathExpm1(x) - _mathExpm1(-x)) / 2
      : (exp$1(x - 1) - exp$1(-x - 1)) * (Math.E / 2);
  }
});

// 20.2.2.33 Math.tanh(x)


var exp$2 = Math.exp;

_export(_export.S, 'Math', {
  tanh: function tanh(x) {
    var a = _mathExpm1(x = +x);
    var b = _mathExpm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
  }
});

// 20.2.2.34 Math.trunc(x)


_export(_export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

// https://github.com/tc39/Array.prototype.includes

var $includes = _arrayIncludes(true);

_export(_export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

_addToUnscopables('includes');

var isEnum$1 = _objectPie.f;
var _objectToArray = function (isEntries) {
  return function (it) {
    var O = _toIobject(it);
    var keys = _objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum$1.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

// https://github.com/tc39/proposal-object-values-entries

var $values = _objectToArray(false);

_export(_export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

// https://github.com/tc39/proposal-object-values-entries

var $entries = _objectToArray(true);

_export(_export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

// https://github.com/tc39/proposal-object-getownpropertydescriptors






_export(_export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = _toIobject(object);
    var getDesc = _objectGopd.f;
    var keys = _ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) _createProperty(result, key, desc);
    }
    return result;
  }
});

// https://github.com/tc39/proposal-string-pad-start-end




var _stringPad = function (that, maxLength, fillString, left) {
  var S = String(_defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = _toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = _stringRepeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

var navigator$1 = _global.navigator;

var _userAgent = navigator$1 && navigator$1.userAgent || '';

// https://github.com/tc39/proposal-string-pad-start-end




// https://github.com/zloirock/core-js/issues/280
_export(_export.P + _export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(_userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return _stringPad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

// https://github.com/tc39/proposal-string-pad-start-end




// https://github.com/zloirock/core-js/issues/280
_export(_export.P + _export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(_userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return _stringPad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

// ie9- setTimeout & setInterval additional parameters fix



var slice = [].slice;
var MSIE = /MSIE .\./.test(_userAgent); // <- dirty ie9- check
var wrap$1 = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
_export(_export.G + _export.B + _export.F * MSIE, {
  setTimeout: wrap$1(_global.setTimeout),
  setInterval: wrap$1(_global.setInterval)
});

_export(_export.G + _export.B, {
  setImmediate: _task.set,
  clearImmediate: _task.clear
});

var ITERATOR$4 = _wks('iterator');
var TO_STRING_TAG = _wks('toStringTag');
var ArrayValues = _iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = _objectKeys(DOMIterables), i$1 = 0; i$1 < collections.length; i$1++) {
  var NAME$1 = collections[i$1];
  var explicit = DOMIterables[NAME$1];
  var Collection = _global[NAME$1];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR$4]) _hide(proto, ITERATOR$4, ArrayValues);
    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME$1);
    _iterators[NAME$1] = ArrayValues;
    if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
  }
}

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof commonjsGlobal === "object" ? commonjsGlobal :
  typeof window === "object" ? window :
  typeof self === "object" ? self : commonjsGlobal
);
});

// Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

try {
    var ce = new window.CustomEvent('test');
    ce.preventDefault();
    if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error('Could not prevent default');
    }
} catch(e) {
  var CustomEvent$1 = function(event, params) {
    var evt, origPrevent;
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };

    evt = document.createEvent("CustomEvent");
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
      } catch(e) {
        this.defaultPrevented = true;
      }
    };
    return evt;
  };

  CustomEvent$1.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent$1; // expose definition to window
}

(function(global) {
  /**
   * Polyfill URLSearchParams
   *
   * Inspired from : https://github.com/WebReflection/url-search-params/blob/master/src/url-search-params.js
   */

  var checkIfIteratorIsSupported = function() {
    try {
      return !!Symbol.iterator;
    } catch(error) {
      return false;
    }
  };


  var iteratorSupported = checkIfIteratorIsSupported();

  var createIterator = function(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return { done: value === void 0, value: value };
      }
    };

    if(iteratorSupported) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }

    return iterator;
  };

  /**
   * Search param name and values should be encoded according to https://url.spec.whatwg.org/#urlencoded-serializing
   * encodeURIComponent() produces the same result except encoding spaces as `%20` instead of `+`.
   */
  var serializeParam = function(value) {
    return encodeURIComponent(value).replace(/%20/g, '+');
  };

  var deserializeParam = function(value) {
    return decodeURIComponent(value).replace(/\+/g, ' ');
  };

  var polyfillURLSearchParams= function() {

    var URLSearchParams = function(searchString) {
      Object.defineProperty(this, '_entries', { value: {} });

      if(typeof searchString === 'string') {
        if(searchString !== '') {
          searchString = searchString.replace(/^\?/, '');
          var attributes = searchString.split('&');
          var attribute;
          for(var i = 0; i < attributes.length; i++) {
            attribute = attributes[i].split('=');
            this.append(
              deserializeParam(attribute[0]),
              (attribute.length > 1) ? deserializeParam(attribute[1]) : ''
            );
          }
        }
      } else if(searchString instanceof URLSearchParams) {
        var _this = this;
        searchString.forEach(function(value, name) {
          _this.append(value, name);
        });
      }
    };

    var proto = URLSearchParams.prototype;

    proto.append = function(name, value) {
      if(name in this._entries) {
        this._entries[name].push(value.toString());
      } else {
        this._entries[name] = [value.toString()];
      }
    };

    proto.delete = function(name) {
      delete this._entries[name];
    };

    proto.get = function(name) {
      return (name in this._entries) ? this._entries[name][0] : null;
    };

    proto.getAll = function(name) {
      return (name in this._entries) ? this._entries[name].slice(0) : [];
    };

    proto.has = function(name) {
      return (name in this._entries);
    };

    proto.set = function(name, value) {
      this._entries[name] = [value.toString()];
    };

    proto.forEach = function(callback, thisArg) {
      var entries;
      for(var name in this._entries) {
        if(this._entries.hasOwnProperty(name)) {
          entries = this._entries[name];
          for(var i = 0; i < entries.length; i++) {
            callback.call(thisArg, entries[i], name, this);
          }
        }
      }
    };

    proto.keys = function() {
      var items = [];
      this.forEach(function(value, name) { items.push(name); });
      return createIterator(items);
    };

    proto.values = function() {
      var items = [];
      this.forEach(function(value) { items.push(value); });
      return createIterator(items);
    };

    proto.entries = function() {
      var items = [];
      this.forEach(function(value, name) { items.push([name, value]); });
      return createIterator(items);
    };

    if(iteratorSupported) {
      proto[Symbol.iterator] = proto.entries;
    }

    proto.toString = function() {
      var searchString = '';
      this.forEach(function(value, name) {
        if(searchString.length > 0) searchString+= '&';
        searchString += serializeParam(name) + '=' + serializeParam(value);
      });
      return searchString;
    };

    global.URLSearchParams = URLSearchParams;
  };

  if(!('URLSearchParams' in global) || (new URLSearchParams('?a=1').toString() !== 'a=1')) {
    polyfillURLSearchParams();
  }

  // HTMLAnchorElement

})(
  (typeof commonjsGlobal !== 'undefined') ? commonjsGlobal
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : commonjsGlobal))
);

(function(global) {
  /**
   * Polyfill URL
   *
   * Inspired from : https://github.com/arv/DOM-URL-Polyfill/blob/master/src/url.js
   */

  var checkIfURLIsSupported = function() {
    try {
      var u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      return (u.href === 'http://a/c%20d') && u.searchParams;
    } catch(e) {
      return false;
    }
  };


  var polyfillURL = function() {
    var _URL = global.URL;

    var URL = function(url, base) {
      if(typeof url !== 'string') url = String(url);

      var doc = document.implementation.createHTMLDocument('');
      window.doc = doc;
      if(base) {
        var baseElement = doc.createElement('base');
        baseElement.href = base;
        doc.head.appendChild(baseElement);
      }

      var anchorElement = doc.createElement('a');
      anchorElement.href = url;
      doc.body.appendChild(anchorElement);
      anchorElement.href = anchorElement.href; // force href to refresh

      if(anchorElement.protocol === ':' || !/:/.test(anchorElement.href)) {
        throw new TypeError('Invalid URL');
      }

      Object.defineProperty(this, '_anchorElement', {
        value: anchorElement
      });
    };

    var proto = URL.prototype;

    var linkURLWithAnchorAttribute = function(attributeName) {
      Object.defineProperty(proto, attributeName, {
        get: function() {
          return this._anchorElement[attributeName];
        },
        set: function(value) {
          this._anchorElement[attributeName] = value;
        },
        enumerable: true
      });
    };

    ['hash', 'host', 'hostname', 'port', 'protocol', 'search']
    .forEach(function(attributeName) {
      linkURLWithAnchorAttribute(attributeName);
    });

    Object.defineProperties(proto, {

      'toString': {
        get: function() {
          var _this = this;
          return function() {
            return _this.href;
          };
        }
      },

      'href' : {
        get: function() {
          return this._anchorElement.href.replace(/\?$/,'');
        },
        set: function(value) {
          this._anchorElement.href = value;
        },
        enumerable: true
      },

      'pathname' : {
        get: function() {
          return this._anchorElement.pathname.replace(/(^\/?)/,'/');
        },
        set: function(value) {
          this._anchorElement.pathname = value;
        },
        enumerable: true
      },

      'origin': {
        get: function() {
          // get expected port from protocol
          var expectedPort = {'http:': 80, 'https:': 443, 'ftp:': 21}[this._anchorElement.protocol];
          // add port to origin if, expected port is different than actual port
          // and it is not empty f.e http://foo:8080
          // 8080 != 80 && 8080 != ''
          var addPortToOrigin = this._anchorElement.port != expectedPort &&
            this._anchorElement.port !== '';

          return this._anchorElement.protocol +
            '//' +
            this._anchorElement.hostname +
            (addPortToOrigin ? (':' + this._anchorElement.port) : '');
        },
        enumerable: true
      },

      'password': { // TODO
        get: function() {
          return '';
        },
        set: function(value) {
        },
        enumerable: true
      },

      'username': { // TODO
        get: function() {
          return '';
        },
        set: function(value) {
        },
        enumerable: true
      },

      'searchParams': {
        get: function() {
          var searchParams = new URLSearchParams(this.search);
          var _this = this;
          ['append', 'delete', 'set'].forEach(function(methodName) {
            var method = searchParams[methodName];
            searchParams[methodName] = function() {
              method.apply(searchParams, arguments);
              _this.search = searchParams.toString();
            };
          });
          return searchParams;
        },
        enumerable: true
      }
    });

    URL.createObjectURL = function(blob) {
      return _URL.createObjectURL.apply(_URL, arguments);
    };

    URL.revokeObjectURL = function(url) {
      return _URL.revokeObjectURL.apply(_URL, arguments);
    };

    global.URL = URL;

  };

  if(!checkIfURLIsSupported()) {
    polyfillURL();
  }

  if((global.location !== void 0) && !('origin' in global.location)) {
    var getOrigin = function() {
      return global.location.protocol + '//' + global.location.hostname + (global.location.port ? (':' + global.location.port) : '');
    };

    try {
      Object.defineProperty(global.location, 'origin', {
        get: getOrigin,
        enumerable: true
      });
    } catch(e) {
      setInterval(function() {
        global.location.origin = getOrigin();
      }, 100);
    }
  }

})(
  (typeof commonjsGlobal !== 'undefined') ? commonjsGlobal
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : commonjsGlobal))
);

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

var defineProperty$1 = function (obj, key, value) {
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

var Storage = function () {
    function Storage(player) {
        classCallCheck(this, Storage);

        this.enabled = player.config.storage.enabled;
        this.key = player.config.storage.key;
    }

    // Check for actual support (see if we can use it)


    createClass(Storage, [{
        key: 'get',
        value: function get(key) {
            if (!Storage.supported || !this.enabled) {
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
        value: function set(object) {
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
        get: function get() {
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
            return this.instanceof(input, window.TextTrackCue) || this.instanceof(input, window.VTTCue);
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


    // Load image avoiding xhr/fetch CORS issues
    // Server status can't be obtained this way unfortunately, so this uses "naturalWidth" to determine if the image has loaded.
    // By default it checks if it is at least 1px, but you can add a second argument to change this.
    loadImage: function loadImage(src) {
        var minWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        return new Promise(function (resolve, reject) {
            var image = new Image();
            var handler = function handler() {
                delete image.onload;
                delete image.onerror;
                (image.naturalWidth >= minWidth ? resolve : reject)(image);
            };
            Object.assign(image, { onload: handler, onerror: handler, src: src });
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
            var useStorage = Storage.supported;

            // Create container
            var container = document.createElement('div');
            utils.toggleHidden(container, true);

            if (hasId) {
                container.setAttribute('id', id);
            }

            // Check in cache
            if (useStorage) {
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

                if (useStorage) {
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
            element.innerText = text;
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


    // Mirror Element.classList.toggle, with IE compatibility for "force" argument
    toggleClass: function toggleClass(element, className, force) {
        if (utils.is.element(element)) {
            var method = 'toggle';
            if (typeof force !== 'undefined') {
                method = force ? 'add' : 'remove';
            }

            element.classList[method](className);
            return element.classList.contains(className);
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
                    Object.assign(target, defineProperty$1({}, key, {}));
                }

                utils.extend(target[key], source[key]);
            } else {
                Object.assign(target, defineProperty$1({}, key, source[key]));
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


    // Clone nested objects
    cloneDeep: function cloneDeep(object) {
        return JSON.parse(JSON.stringify(object));
    },


    // Get a nested value in an object
    getDeep: function getDeep(object, path) {
        return path.split('.').reduce(function (obj, key) {
            return obj && obj[key];
        }, object);
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

            return Object.assign(params, defineProperty$1({}, key, decodeURIComponent(val)));
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
            window.removeEventListener('test', null, options);
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

                // Restore time
                var onLoadedMetaData = function onLoadedMetaData() {
                    player.currentTime = currentTime;
                    player.off('loadedmetadata', onLoadedMetaData);
                };
                player.on('loadedmetadata', onLoadedMetaData);

                // Load new source
                player.media.load();

                // Resume playing
                if (playing) {
                    player.play();
                }

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
    get: function get() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (utils.is.empty(key) || utils.is.empty(config)) {
            return '';
        }

        var string = utils.getDeep(config.i18n, key);

        if (utils.is.empty(string)) {
            return '';
        }

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

            progress.innerText = '% ' + suffix.toLowerCase();
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
        target.innerText = utils.formatTime(time, forceHours, inverted);
    },


    // Update volume UI and storage
    updateVolume: function updateVolume() {
        if (!this.supported.ui) {
            return;
        }

        // Update range
        if (utils.is.element(this.elements.inputs.volume)) {
            controls.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume);
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


    // Update <progress> elements
    updateProgress: function updateProgress(event) {
        var _this = this;

        if (!this.supported.ui || !utils.is.event(event)) {
            return;
        }

        var value = 0;

        var setProgress = function setProgress(target, input) {
            var value = utils.is.number(input) ? input : 0;
            var progress = utils.is.element(target) ? target : _this.elements.display.buffer;

            // Update value and label
            if (utils.is.element(progress)) {
                progress.value = value;

                // Update text label inside
                var label = progress.getElementsByTagName('span')[0];
                if (utils.is.element(label)) {
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
                    value = utils.getPercentage(this.currentTime, this.duration);

                    // Set seek range value only if it's a 'natural' time event
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
        var range = utils.is.event(target) ? target.target : target;

        // Needs to be a valid <input type='range'>
        if (!utils.is.element(range) || range.getAttribute('type') !== 'range') {
            return;
        }

        // Set aria value for https://github.com/sampotts/plyr/issues/905
        range.setAttribute('aria-valuenow', range.value);

        // WebKit only
        if (!browser.isWebkit) {
            return;
        }

        // Set CSS custom property
        range.style.setProperty('--value', range.value / range.max * 100 + '%');
    },


    // Update hover tooltip for seeking
    updateSeekTooltip: function updateSeekTooltip(event) {
        var _this2 = this;

        // Bail if setting not true
        if (!this.config.tooltips.seek || !utils.is.element(this.elements.inputs.seek) || !utils.is.element(this.elements.display.seekTooltip) || this.duration === 0) {
            return;
        }

        // Calculate percentage
        var percent = 0;
        var clientRect = this.elements.progress.getBoundingClientRect();
        var visible = this.config.classNames.tooltip + '--visible';

        var toggle = function toggle(_toggle) {
            utils.toggleClass(_this2.elements.display.seekTooltip, visible, _toggle);
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
        controls.updateTimeDisplay.call(this, this.elements.display.seekTooltip, this.duration / 100 * percent);

        // Set position
        this.elements.display.seekTooltip.style.left = percent + '%';

        // Show/hide the tooltip
        // If the event is a moues in/out and percentage is inside bounds
        if (utils.is.event(event) && ['mouseenter', 'mouseleave'].includes(event.type)) {
            toggle(event.type === 'mouseenter');
        }
    },


    // Handle time change event
    timeUpdate: function timeUpdate(event) {
        // Only invert if only one time element is displayed and used for both duration and currentTime
        var invert = !utils.is.element(this.elements.display.duration) && this.config.invertTime;

        // Duration
        controls.updateTimeDisplay.call(this, this.elements.display.currentTime, invert ? this.duration - this.currentTime : this.currentTime, invert);

        // Ignore updates while seeking
        if (event && event.type === 'timeupdate' && this.media.seeking) {
            return;
        }

        // Playing progress
        controls.updateProgress.call(this, event);
    },


    // Show the duration on metadataloaded or durationchange events
    durationUpdate: function durationUpdate() {
        // Bail if no ui or durationchange event triggered after playing/seek when invertTime is false
        if (!this.supported.ui || !this.config.invertTime && this.currentTime) {
            return;
        }

        // If there's a spot to display duration
        var hasDuration = utils.is.element(this.elements.display.duration);

        // If there's only one time display, display duration there
        if (!hasDuration && this.config.displayDuration && this.paused) {
            controls.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration);
        }

        // If there's a duration element, update content
        if (hasDuration) {
            controls.updateTimeDisplay.call(this, this.elements.display.duration, this.duration);
        }

        // Update the tooltip (if visible)
        controls.updateSeekTooltip.call(this);
    },


    // Hide/show a tab
    toggleTab: function toggleTab(setting, toggle) {
        utils.toggleHidden(this.elements.settings.tabs[setting], !toggle);
    },


    // Set the quality menu
    // TODO: Vimeo support
    setQualityMenu: function setQualityMenu(options) {
        var _this3 = this;

        // Menu required
        if (!utils.is.element(this.elements.settings.panes.quality)) {
            return;
        }

        var type = 'quality';
        var list = this.elements.settings.panes.quality.querySelector('ul');

        // Set options if passed and filter based on config
        if (utils.is.array(options)) {
            this.options.quality = options.filter(function (quality) {
                return _this3.config.quality.options.includes(quality);
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
            var label = i18n.get('qualityBadge.' + quality, _this3.config);

            if (!label.length) {
                return null;
            }

            return controls.createBadge.call(_this3, label);
        };

        // Sort options by the config and then render options
        this.options.quality.sort(function (a, b) {
            var sorting = _this3.config.quality.options;
            return sorting.indexOf(a) > sorting.indexOf(b) ? 1 : -1;
        }).forEach(function (quality) {
            var label = controls.getLabel.call(_this3, 'quality', quality);
            controls.createMenuItem.call(_this3, quality, list, type, label, getBadge(quality));
        });

        controls.updateSetting.call(this, type, list);
    },


    // Translate a value into a nice label
    getLabel: function getLabel(setting, value) {
        switch (setting) {
            case 'speed':
                return value === 1 ? i18n.get('normal', this.config) : value + '&times;';

            case 'quality':
                if (utils.is.number(value)) {
                    var label = i18n.get('qualityLabel.' + value, this.config);

                    if (!label.length) {
                        return value + 'p';
                    }

                    return label;
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
        var _this4 = this;

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
                label: captions.getLabel.call(_this4, track)
            };
        });

        // Add the "Disabled" option to turn off captions
        tracks.unshift({
            language: '',
            label: i18n.get('disabled', this.config)
        });

        // Generate options
        tracks.forEach(function (track) {
            controls.createMenuItem.call(_this4, track.language, list, 'language', track.label, track.language !== 'enabled' ? controls.createBadge.call(_this4, track.language.toUpperCase()) : null, track.language.toLowerCase() === _this4.language);
        });

        controls.updateSetting.call(this, type, list);
    },


    // Set a list of available captions languages
    setSpeedMenu: function setSpeedMenu(options) {
        var _this5 = this;

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
            return _this5.config.speed.options.includes(speed);
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
            var label = controls.getLabel.call(_this5, 'speed', speed);
            controls.createMenuItem.call(_this5, speed, list, type, label);
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
        var _this6 = this;

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

                var button = utils.createElement('button', utils.extend(utils.getAttributesFromSelector(_this6.config.selectors.buttons.settings), {
                    type: 'button',
                    class: _this6.config.classNames.control + ' ' + _this6.config.classNames.control + '--forward',
                    id: 'plyr-settings-' + data.id + '-' + type + '-tab',
                    'aria-haspopup': true,
                    'aria-controls': 'plyr-settings-' + data.id + '-' + type,
                    'aria-expanded': false
                }), i18n.get(type, _this6.config));

                var value = utils.createElement('span', {
                    class: _this6.config.classNames.menu.value
                });

                // Speed contains HTML entities
                value.innerHTML = data[type];

                button.appendChild(value);
                tab.appendChild(button);
                tabs.appendChild(tab);

                _this6.elements.settings.tabs[type] = tab;
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
                    class: _this6.config.classNames.control + ' ' + _this6.config.classNames.control + '--back',
                    'aria-haspopup': true,
                    'aria-controls': 'plyr-settings-' + data.id + '-home',
                    'aria-expanded': false
                }, i18n.get(type, _this6.config));

                pane.appendChild(back);

                var options = utils.createElement('ul');

                pane.appendChild(options);
                inner.appendChild(pane);

                _this6.elements.settings.panes[type] = pane;
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
        var _this7 = this;

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
                utils.toggleClass(label, _this7.config.classNames.hidden, false);
                utils.toggleClass(label, _this7.config.classNames.tooltip, true);
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

        // Try to load the value from storage
        var active = this.storage.get('captions');

        // Otherwise fall back to the default config
        if (!utils.is.boolean(active)) {
            active = this.config.captions.active;
        }

        // Set toggled state
        this.toggleCaptions(active);

        // Watch changes to textTracks and update captions menu
        if (this.config.captions.update) {
            utils.on(this.media.textTracks, 'addtrack removetrack', captions.update.bind(this));
        }

        // Update available languages in list next tick (the event must not be triggered before the listeners)
        setTimeout(captions.update.bind(this), 0);
    },
    update: function update() {
        // Update tracks
        var tracks = captions.getTracks.call(this);
        this.options.captions = tracks.map(function (_ref) {
            var language = _ref.language;
            return language;
        });

        // Set language if it hasn't been set already
        if (!this.language) {
            var language = this.config.captions.language;

            if (language === 'auto') {
                var _split = (navigator.language || navigator.userLanguage).split('-');

                var _split2 = slicedToArray(_split, 1);

                language = _split2[0];
            }
            this.language = this.storage.get('language') || (language || '').toLowerCase();
        }

        // Toggle the class hooks
        utils.toggleClass(this.elements.container, this.config.classNames.captions.enabled, !utils.is.empty(captions.getTracks.call(this)));

        // Update available languages in list
        if ((this.config.controls || []).includes('settings') && this.config.settings.includes('captions')) {
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
                content.innerText = caption.trim();
            } else {
                content.appendChild(caption);
            }

            // Set new caption text
            this.elements.captions.appendChild(content);
        } else {
            this.debug.warn('No captions element to render to');
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
        get: function get() {
            // eslint-disable-next-line no-console
            return this.enabled ? Function.prototype.bind.call(console.log, console) : noop;
        }
    }, {
        key: 'warn',
        get: function get() {
            // eslint-disable-next-line no-console
            return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop;
        }
    }, {
        key: 'error',
        get: function get() {
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
    iconUrl: 'https://cdn.plyr.io/3.3.10/plyr.svg',

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
        language: 'auto',
        // Listen to new tracks added after Plyr is initialized.
        // This is needed for streaming captions, but may result in unselectable options
        update: false
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
            buffer: '.plyr__progress__buffer',
            loop: '.plyr__progress__loop', // Used later
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
        posterEnabled: 'plyr__poster-enabled',
        ads: 'plyr__ads',
        control: 'plyr__control',
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

var browser$1 = utils.getBrowser();

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
    if (!browser$1.isIos) {
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
            if (browser$1.isIos && this.player.config.fullscreen.iosNative) {
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
            if (browser$1.isIos && this.player.config.fullscreen.iosNative) {
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
        get: function get() {
            return (Fullscreen.native || this.player.config.fullscreen.fallback) && this.player.config.fullscreen.enabled && this.player.supported.ui && this.player.isVideo;
        }

        // Get active state

    }, {
        key: 'active',
        get: function get() {
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
        get: function get() {
            return browser$1.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.container;
        }
    }], [{
        key: 'native',
        get: function get() {
            return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
        }

        // Get the prefix for handlers

    }, {
        key: 'prefix',
        get: function get() {
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
        get: function get() {
            return this.prefix === 'moz' ? 'FullScreen' : 'Fullscreen';
        }
    }]);
    return Fullscreen;
}();

// ==========================================================================

// Sniff out the browser
var browser$2 = utils.getBrowser();

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

        // Setup captions for HTML5
        if (this.isHTML5) {
            captions.setup.call(this);
        }

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
        controls.updateVolume.call(this);

        // Reset time display
        controls.timeUpdate.call(this);

        // Update the UI
        ui.checkPlaying.call(this);

        // Check for picture-in-picture support
        utils.toggleClass(this.elements.container, this.config.classNames.pip.supported, support.pip && this.isHTML5 && this.isVideo);

        // Check for airplay support
        utils.toggleClass(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5);

        // Add iOS class
        utils.toggleClass(this.elements.container, this.config.classNames.isIos, browser$2.isIos);

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

        // Assure the poster image is set, if the property was added before the element was created
        if (this.poster && this.elements.poster && !this.elements.poster.style.backgroundImage) {
            ui.setPoster.call(this, this.poster);
        }

        // Manually set the duration if user has overridden it.
        // The event listeners for it doesn't get called if preload is disabled (#701)
        if (this.config.duration) {
            controls.durationUpdate.call(this);
        }
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


    // Toggle poster
    togglePoster: function togglePoster(enable) {
        utils.toggleClass(this.elements.container, this.config.classNames.posterEnabled, enable);
    },


    // Set the poster image (async)
    setPoster: function setPoster(poster) {
        var _this2 = this;

        // Set property regardless of validity
        this.media.setAttribute('poster', poster);

        // Bail if element is missing
        if (!utils.is.element(this.elements.poster)) {
            return Promise.reject();
        }

        // Load the image, and set poster if successful
        var loadPromise = utils.loadImage(poster).then(function () {
            _this2.elements.poster.style.backgroundImage = 'url(\'' + poster + '\')';
            Object.assign(_this2.elements.poster.style, {
                backgroundImage: 'url(\'' + poster + '\')',
                // Reset backgroundSize as well (since it can be set to "cover" for padded thumbnails for youtube)
                backgroundSize: ''
            });
            ui.togglePoster.call(_this2, true);
            return poster;
        });

        // Hide the element if the poster can't be loaded (otherwise it will just be a black element covering the video)
        loadPromise.catch(function () {
            return ui.togglePoster.call(_this2, false);
        });

        // Return the promise so the caller can use it as well
        return loadPromise;
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
        ui.toggleControls.call(this);
    },


    // Check if media is loading
    checkLoading: function checkLoading(event) {
        var _this3 = this;

        this.loading = ['stalled', 'waiting'].includes(event.type);

        // Clear timer
        clearTimeout(this.timers.loading);

        // Timer to prevent flicker when seeking
        this.timers.loading = setTimeout(function () {
            // Update progress bar loading class state
            utils.toggleClass(_this3.elements.container, _this3.config.classNames.loading, _this3.loading);

            // Update controls visibility
            ui.toggleControls.call(_this3);
        }, this.loading ? 250 : 0);
    },


    // Toggle controls based on state and `force` argument
    toggleControls: function toggleControls(force) {
        var controls$$1 = this.elements.controls;


        if (controls$$1 && this.config.hideControls) {
            // Show controls if force, loading, paused, or button interaction, otherwise hide
            this.toggleControls(Boolean(force || this.loading || this.paused || controls$$1.pressed || controls$$1.hover));
        }
    }
};

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

            // Toggle controls on mouse events and entering fullscreen
            utils.on(this.player.elements.container, 'mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen', function (event) {
                var controls$$1 = _this2.player.elements.controls;

                // Remove button states for fullscreen

                if (event.type === 'enterfullscreen') {
                    controls$$1.pressed = false;
                    controls$$1.hover = false;
                }

                // Show, then hide after a timeout unless another control event occurs
                var show = ['touchstart', 'touchmove', 'mousemove'].includes(event.type);

                var delay = 0;

                if (show) {
                    ui.toggleControls.call(_this2.player, true);
                    // Use longer timeout for touch devices
                    delay = _this2.player.touch ? 3000 : 2000;
                }

                // Clear timer
                clearTimeout(_this2.player.timers.controls);
                // Timer to prevent flicker when seeking
                _this2.player.timers.controls = setTimeout(function () {
                    return ui.toggleControls.call(_this2.player, false);
                }, delay);
            });
        }

        // Listen for media events

    }, {
        key: 'media',
        value: function media() {
            var _this3 = this;

            // Time change on media
            utils.on(this.player.media, 'timeupdate seeking seeked', function (event) {
                return controls.timeUpdate.call(_this3.player, event);
            });

            // Display duration
            utils.on(this.player.media, 'durationchange loadeddata loadedmetadata', function (event) {
                return controls.durationUpdate.call(_this3.player, event);
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
            utils.on(this.player.media, 'progress playing seeking seeked', function (event) {
                return controls.updateProgress.call(_this3.player, event);
            });

            // Handle volume changes
            utils.on(this.player.media, 'volumechange', function (event) {
                return controls.updateVolume.call(_this3.player, event);
            });

            // Handle play/pause
            utils.on(this.player.media, 'playing play pause ended emptied timeupdate', function (event) {
                return ui.checkPlaying.call(_this3.player, event);
            });

            // Loading state
            utils.on(this.player.media, 'waiting canplay seeked playing', function (event) {
                return ui.checkLoading.call(_this3.player, event);
            });

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

            // Set range input alternative "value", which matches the tooltip time (#954)
            on(this.player.elements.inputs.seek, 'mousedown mousemove', function (event) {
                var clientRect = _this4.player.elements.progress.getBoundingClientRect();
                var percent = 100 / clientRect.width * (event.pageX - clientRect.left);
                event.currentTarget.setAttribute('seek-value', percent);
            });

            // Pause while seeking
            on(this.player.elements.inputs.seek, 'mousedown mouseup keydown keyup touchstart touchend', function (event) {
                var seek = event.currentTarget;

                // Was playing before?
                var play = seek.hasAttribute('play-on-seeked');

                // Done seeking
                var done = ['mouseup', 'touchend', 'keyup'].includes(event.type);

                // If we're done seeking and it was playing, resume playback
                if (play && done) {
                    seek.removeAttribute('play-on-seeked');
                    _this4.player.play();
                } else if (!done && _this4.player.playing) {
                    seek.setAttribute('play-on-seeked', '');
                    _this4.player.pause();
                }
            });

            // Seek
            on(this.player.elements.inputs.seek, inputEvent, function (event) {
                var seek = event.currentTarget;

                // If it exists, use seek-value instead of "value" for consistency with tooltip time (#954)
                var seekTo = seek.getAttribute('seek-value');

                if (utils.is.empty(seekTo)) {
                    seekTo = seek.value;
                }

                seek.removeAttribute('seek-value');

                _this4.player.currentTime = seekTo / seek.max * _this4.player.duration;
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

                    controls.timeUpdate.call(_this4.player);
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

            // Update controls.hover state (used for ui.toggleControls to avoid hiding when interacting)
            on(this.player.elements.controls, 'mouseenter mouseleave', function (event) {
                _this4.player.elements.controls.hover = !_this4.player.touch && event.type === 'mouseenter';
            });

            // Update controls.pressed state (used for ui.toggleControls to avoid hiding when interacting)
            on(this.player.elements.controls, 'mousedown mouseup touchstart touchend touchcancel', function (event) {
                _this4.player.elements.controls.pressed = ['mousedown', 'touchstart'].includes(event.type);
            });

            // Focus in/out on controls
            on(this.player.elements.controls, 'focusin focusout', function (event) {
                var _player = _this4.player,
                    config = _player.config,
                    elements = _player.elements,
                    timers = _player.timers;

                // Skip transition to prevent focus from scrolling the parent element

                utils.toggleClass(elements.controls, config.classNames.noTransition, event.type === 'focusin');

                // Toggle
                ui.toggleControls.call(_this4.player, event.type === 'focusin');

                // If focusin, hide again after delay
                if (event.type === 'focusin') {
                    // Restore transition
                    setTimeout(function () {
                        utils.toggleClass(elements.controls, config.classNames.noTransition, false);
                    }, 0);

                    // Delay a little more for keyboard users
                    var delay = _this4.touch ? 3000 : 4000;

                    // Clear timer
                    clearTimeout(timers.controls);
                    // Hide
                    timers.controls = setTimeout(function () {
                        return ui.toggleControls.call(_this4.player, false);
                    }, delay);
                }
            });

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

// Set playback state and trigger change (only on actual change)
function assurePlaybackState(play) {
    if (this.media.paused === play) {
        this.media.paused = !play;
        utils.dispatchEvent.call(this, this.media, play ? 'play' : 'pause');
    }
}

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

            // Set and show poster
            ui.setPoster.call(player, url.href);
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
        };

        // Seeking
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

                // Set seeking state and trigger event

                media.seeking = true;
                utils.dispatchEvent.call(player, media, 'seeking');

                // If paused, mute until seek is complete
                Promise.resolve(paused && embed.setVolume(0))
                // Seek
                .then(function () {
                    return embed.setCurrentTime(time);
                })
                // Restore paused
                .then(function () {
                    return paused && embed.pause();
                })
                // Restore volume
                .then(function () {
                    return paused && embed.setVolume(volume);
                }).catch(function () {
                    // Do nothing
                });
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
            assurePlaybackState.call(player, true);
            utils.dispatchEvent.call(player, player.media, 'playing');
        });

        player.embed.on('pause', function () {
            assurePlaybackState.call(player, false);
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

// Set playback state and trigger change (only on actual change)
function assurePlaybackState$1(play) {
    if (this.media.paused === play) {
        this.media.paused = !play;
        utils.dispatchEvent.call(this, this.media, play ? 'play' : 'pause');
    }
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
        var posterSrc = function posterSrc(format) {
            return 'https://img.youtube.com/vi/' + videoId + '/' + format + 'default.jpg';
        };

        // Check thumbnail images in order of quality, but reject fallback thumbnails (120px wide)
        utils.loadImage(posterSrc('maxres'), 121) // Higest quality and unpadded
        .catch(function () {
            return utils.loadImage(posterSrc('sd'), 121);
        }) // 480p padded 4:3
        .catch(function () {
            return utils.loadImage(posterSrc('hq'));
        }) // 360p padded 4:3. Always exists
        .then(function (image) {
            return ui.setPoster.call(player, image.src);
        }).then(function (posterSrc) {
            // If the image is padded, use background-size "cover" instead (like youtube does too with their posters)
            if (!posterSrc.includes('maxres')) {
                player.elements.poster.style.backgroundSize = 'cover';
            }
        });

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
                    player.media.paused = true;

                    // Seeking
                    player.media.currentTime = 0;
                    Object.defineProperty(player.media, 'currentTime', {
                        get: function get() {
                            return Number(instance.getCurrentTime());
                        },
                        set: function set(time) {
                            // If paused, mute audio preventively (YouTube starts playing on seek if the video hasn't been played yet).
                            if (player.paused) {
                                player.embed.mute();
                            }

                            // Set seeking state and trigger event
                            player.media.seeking = true;
                            utils.dispatchEvent.call(player, player.media, 'seeking');

                            // Seek after events sent
                            instance.seekTo(time);
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

                    var seeked = player.media.seeking && [1, 2].includes(event.data);

                    if (seeked) {
                        // Unset seeking and fire seeked event
                        player.media.seeking = false;
                        utils.dispatchEvent.call(player, player.media, 'seeked');
                    }

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
                            assurePlaybackState$1.call(player, false);

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
                            // Restore paused state (YouTube starts playing on seek if the video hasn't been played yet)
                            if (player.media.paused) {
                                player.media.pause();
                            } else {
                                assurePlaybackState$1.call(player, true);

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
        get: function get() {
            return this.player.isVideo && this.player.config.ads.enabled && !utils.is.empty(this.publisherId);
        }
    }, {
        key: 'tagUrl',
        get: function get() {
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
        this.config = utils.extend({}, defaults$1, Plyr.defaults, options || {}, function () {
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
            var active = utils.is.boolean(input) ? input : !this.elements.container.classList.contains(this.config.classNames.captions.active);

            // Toggle state
            utils.toggleState(this.elements.buttons.captions, active);

            // Add class hook
            utils.toggleClass(this.elements.container, this.config.classNames.captions.active, active);

            // Update state and trigger event
            if (active !== this.captions.active) {
                this.captions.active = active;
                utils.dispatchEvent.call(this, this.media, this.captions.active ? 'captionsenabled' : 'captionsdisabled');
            }
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
         * @param {boolean} [toggle] - Whether to show the controls
         */

    }, {
        key: 'toggleControls',
        value: function toggleControls(toggle) {
            // Don't toggle if missing UI support or if it's audio
            if (this.supported.ui && !this.isAudio) {
                // Get state before change
                var isHidden = utils.hasClass(this.elements.container, this.config.classNames.hideControls);

                // Negate the argument if not undefined since adding the class to hides the controls
                var force = typeof toggle === 'undefined' ? undefined : !toggle;

                // Apply and get updated state
                var hiding = utils.toggleClass(this.elements.container, this.config.classNames.hideControls, force);

                // Close menu
                if (hiding && this.config.controls.includes('settings') && !utils.is.empty(this.config.settings)) {
                    controls.toggleMenu.call(this, false);
                }
                // Trigger event on change
                if (hiding !== isHidden) {
                    var eventName = hiding ? 'controlshidden' : 'controlsshown';
                    utils.dispatchEvent.call(this, this.media, eventName);
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
            var _this2 = this;

            var soft = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!this.ready) {
                return;
            }

            var done = function done() {
                // Reset overflow (incase destroyed while in fullscreen)
                document.body.style.overflow = '';

                // GC for embed
                _this2.embed = null;

                // If it's a soft destroy, make minimal changes
                if (soft) {
                    if (Object.keys(_this2.elements).length) {
                        // Remove elements
                        utils.removeElement(_this2.elements.buttons.play);
                        utils.removeElement(_this2.elements.captions);
                        utils.removeElement(_this2.elements.controls);
                        utils.removeElement(_this2.elements.wrapper);

                        // Clear for GC
                        _this2.elements.buttons.play = null;
                        _this2.elements.captions = null;
                        _this2.elements.controls = null;
                        _this2.elements.wrapper = null;
                    }

                    // Callback
                    if (utils.is.function(callback)) {
                        callback();
                    }
                } else {
                    // Unbind listeners
                    _this2.listeners.clear();

                    // Replace the container with the original element provided
                    utils.replaceElement(_this2.elements.original, _this2.elements.container);

                    // Event
                    utils.dispatchEvent.call(_this2, _this2.elements.original, 'destroyed', true);

                    // Callback
                    if (utils.is.function(callback)) {
                        callback.call(_this2.elements.original);
                    }

                    // Reset state
                    _this2.ready = false;

                    // Clear for garbage collection
                    setTimeout(function () {
                        _this2.elements = null;
                        _this2.media = null;
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
        get: function get() {
            return Boolean(this.provider === providers.html5);
        }
    }, {
        key: 'isEmbed',
        get: function get() {
            return Boolean(this.isYouTube || this.isVimeo);
        }
    }, {
        key: 'isYouTube',
        get: function get() {
            return Boolean(this.provider === providers.youtube);
        }
    }, {
        key: 'isVimeo',
        get: function get() {
            return Boolean(this.provider === providers.vimeo);
        }
    }, {
        key: 'isVideo',
        get: function get() {
            return Boolean(this.type === types.video);
        }
    }, {
        key: 'isAudio',
        get: function get() {
            return Boolean(this.type === types.audio);
        }
    }, {
        key: 'playing',
        get: function get() {
            return Boolean(this.ready && !this.paused && !this.ended);
        }

        /**
         * Get paused state
         */

    }, {
        key: 'paused',
        get: function get() {
            return Boolean(this.media.paused);
        }

        /**
         * Get stopped state
         */

    }, {
        key: 'stopped',
        get: function get() {
            return Boolean(this.paused && this.currentTime === 0);
        }

        /**
         * Get ended state
         */

    }, {
        key: 'ended',
        get: function get() {
            return Boolean(this.media.ended);
        }
    }, {
        key: 'currentTime',
        set: function set(input) {
            // Bail if media duration isn't available yet
            if (!this.duration) {
                return;
            }

            // Validate input
            var inputIsValid = utils.is.number(input) && input > 0;

            // Set
            this.media.currentTime = inputIsValid ? Math.min(input, this.duration) : 0;

            // Logging
            this.debug.log('Seeking to ' + this.currentTime + ' seconds');
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
        key: 'buffered',
        get: function get() {
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
        get: function get() {
            return Boolean(this.media.seeking);
        }

        /**
         * Get the duration of the current media
         */

    }, {
        key: 'duration',
        get: function get() {
            // Faux duration set via config
            var fauxDuration = parseFloat(this.config.duration);

            // Media duration can be NaN before the media has loaded
            var duration = (this.media || {}).duration || 0;

            // If config duration is funky, use regular duration
            return fauxDuration || duration;
        }

        /**
         * Set the player volume
         * @param {number} value - must be between 0 and 1. Defaults to the value from local storage and config.volume if not set in storage
         */

    }, {
        key: 'volume',
        set: function set(value) {
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
        get: function get() {
            return Number(this.media.volume);
        }
    }, {
        key: 'muted',
        set: function set(mute) {
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
        get: function get() {
            return Boolean(this.media.muted);
        }

        /**
         * Check if the media has audio
         */

    }, {
        key: 'hasAudio',
        get: function get() {
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
        set: function set(input) {
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
        get: function get() {
            return Number(this.media.playbackRate);
        }

        /**
         * Set playback quality
         * Currently HTML5 & YouTube only
         * @param {number} input - Quality level
         */

    }, {
        key: 'quality',
        set: function set(input) {
            var quality = null;

            if (!utils.is.empty(input)) {
                quality = Number(input);
            }

            if (!utils.is.number(quality)) {
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
        get: function get() {
            return this.media.quality;
        }

        /**
         * Toggle loop
         * TODO: Finish fancy new logic. Set the indicator on load as user may pass loop as config
         * @param {boolean} input - Whether to loop or not
         */

    }, {
        key: 'loop',
        set: function set(input) {
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
        get: function get() {
            return Boolean(this.media.loop);
        }

        /**
         * Set new media source
         * @param {object} input - The new source object (see docs)
         */

    }, {
        key: 'source',
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
         * Set the poster image for a video
         * @param {input} - the URL for the new poster image
         */

    }, {
        key: 'poster',
        set: function set(input) {
            if (!this.isVideo) {
                this.debug.warn('Poster can only be set for video');
                return;
            }

            ui.setPoster.call(this, input);
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
        key: 'autoplay',
        set: function set(input) {
            var toggle = utils.is.boolean(input) ? input : this.config.autoplay;
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
        key: 'language',
        set: function set(input) {
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
        get: function get() {
            return this.captions.language;
        }

        /**
         * Toggle picture-in-picture playback on WebKit/MacOS
         * TODO: update player with state, support, enabled
         * TODO: detect outside changes
         */

    }, {
        key: 'pip',
        set: function set(input) {
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
        get: function get() {
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

Plyr.defaults = utils.cloneDeep(defaults$1);

// ==========================================================================

return Plyr;

})));

//# sourceMappingURL=plyr.polyfilled.js.map
