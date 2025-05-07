import {
  D,
  O,
  R,
  dn as dn2,
  require_baseEach,
  require_baseIteratee,
  require_uniqBy,
  z as z2
} from "./chunk-XGAQ76QW.js";
import {
  $t,
  At,
  Fr,
  H,
  It,
  Ot,
  T,
  Wt,
  Ye,
  Yr,
  Yt,
  _t,
  animated,
  c,
  diverging_default,
  dn,
  gn,
  j,
  k,
  nn,
  o,
  pn,
  pr,
  qr,
  r,
  require_Stack,
  require_Symbol,
  require_arrayFilter,
  require_arrayMap,
  require_arrayPush,
  require_assignValue,
  require_baseGet,
  require_baseGetAllKeys,
  require_baseGetTag,
  require_baseUnary,
  require_castPath,
  require_cloneArrayBuffer,
  require_cloneBuffer,
  require_cloneTypedArray,
  require_copyArray,
  require_copyObject,
  require_flatRest,
  require_getAllKeys,
  require_getPrototype,
  require_getSymbols,
  require_getTag,
  require_initCloneObject,
  require_isArray,
  require_isBuffer,
  require_isObject,
  require_isObjectLike,
  require_isPlainObject,
  require_keys,
  require_keysIn,
  require_last,
  require_nodeUtil,
  require_stubArray,
  require_toKey,
  stack_default,
  to,
  un,
  useSpring,
  useTransition,
  xt,
  yn,
  z
} from "./chunk-EFKILSXK.js";
import {
  require_jsx_runtime
} from "./chunk-X3VLT5EQ.js";
import "./chunk-PV7ZWGTI.js";
import {
  require_react
} from "./chunk-2CLD7BNN.js";
import {
  __commonJS,
  __toESM
} from "./chunk-WOOG5QLI.js";

// node_modules/lodash/_baseFilter.js
var require_baseFilter = __commonJS({
  "node_modules/lodash/_baseFilter.js"(exports, module) {
    var baseEach = require_baseEach();
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection2) {
        if (predicate(value, index, collection2)) {
          result.push(value);
        }
      });
      return result;
    }
    module.exports = baseFilter;
  }
});

// node_modules/lodash/filter.js
var require_filter = __commonJS({
  "node_modules/lodash/filter.js"(exports, module) {
    var arrayFilter = require_arrayFilter();
    var baseFilter = require_baseFilter();
    var baseIteratee = require_baseIteratee();
    var isArray = require_isArray();
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, baseIteratee(predicate, 3));
    }
    module.exports = filter;
  }
});

// node_modules/lodash/isNumber.js
var require_isNumber = __commonJS({
  "node_modules/lodash/isNumber.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var numberTag = "[object Number]";
    function isNumber(value) {
      return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
    }
    module.exports = isNumber;
  }
});

// node_modules/lodash/_arrayEach.js
var require_arrayEach = __commonJS({
  "node_modules/lodash/_arrayEach.js"(exports, module) {
    function arrayEach(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    module.exports = arrayEach;
  }
});

// node_modules/lodash/_baseAssign.js
var require_baseAssign = __commonJS({
  "node_modules/lodash/_baseAssign.js"(exports, module) {
    var copyObject = require_copyObject();
    var keys = require_keys();
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }
    module.exports = baseAssign;
  }
});

// node_modules/lodash/_baseAssignIn.js
var require_baseAssignIn = __commonJS({
  "node_modules/lodash/_baseAssignIn.js"(exports, module) {
    var copyObject = require_copyObject();
    var keysIn = require_keysIn();
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }
    module.exports = baseAssignIn;
  }
});

// node_modules/lodash/_copySymbols.js
var require_copySymbols = __commonJS({
  "node_modules/lodash/_copySymbols.js"(exports, module) {
    var copyObject = require_copyObject();
    var getSymbols = require_getSymbols();
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }
    module.exports = copySymbols;
  }
});

// node_modules/lodash/_getSymbolsIn.js
var require_getSymbolsIn = __commonJS({
  "node_modules/lodash/_getSymbolsIn.js"(exports, module) {
    var arrayPush = require_arrayPush();
    var getPrototype = require_getPrototype();
    var getSymbols = require_getSymbols();
    var stubArray = require_stubArray();
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };
    module.exports = getSymbolsIn;
  }
});

// node_modules/lodash/_copySymbolsIn.js
var require_copySymbolsIn = __commonJS({
  "node_modules/lodash/_copySymbolsIn.js"(exports, module) {
    var copyObject = require_copyObject();
    var getSymbolsIn = require_getSymbolsIn();
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }
    module.exports = copySymbolsIn;
  }
});

// node_modules/lodash/_getAllKeysIn.js
var require_getAllKeysIn = __commonJS({
  "node_modules/lodash/_getAllKeysIn.js"(exports, module) {
    var baseGetAllKeys = require_baseGetAllKeys();
    var getSymbolsIn = require_getSymbolsIn();
    var keysIn = require_keysIn();
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }
    module.exports = getAllKeysIn;
  }
});

// node_modules/lodash/_initCloneArray.js
var require_initCloneArray = __commonJS({
  "node_modules/lodash/_initCloneArray.js"(exports, module) {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function initCloneArray(array) {
      var length = array.length, result = new array.constructor(length);
      if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }
    module.exports = initCloneArray;
  }
});

// node_modules/lodash/_cloneDataView.js
var require_cloneDataView = __commonJS({
  "node_modules/lodash/_cloneDataView.js"(exports, module) {
    var cloneArrayBuffer = require_cloneArrayBuffer();
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }
    module.exports = cloneDataView;
  }
});

// node_modules/lodash/_cloneRegExp.js
var require_cloneRegExp = __commonJS({
  "node_modules/lodash/_cloneRegExp.js"(exports, module) {
    var reFlags = /\w*$/;
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    module.exports = cloneRegExp;
  }
});

// node_modules/lodash/_cloneSymbol.js
var require_cloneSymbol = __commonJS({
  "node_modules/lodash/_cloneSymbol.js"(exports, module) {
    var Symbol = require_Symbol();
    var symbolProto = Symbol ? Symbol.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }
    module.exports = cloneSymbol;
  }
});

// node_modules/lodash/_initCloneByTag.js
var require_initCloneByTag = __commonJS({
  "node_modules/lodash/_initCloneByTag.js"(exports, module) {
    var cloneArrayBuffer = require_cloneArrayBuffer();
    var cloneDataView = require_cloneDataView();
    var cloneRegExp = require_cloneRegExp();
    var cloneSymbol = require_cloneSymbol();
    var cloneTypedArray = require_cloneTypedArray();
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);
        case boolTag:
        case dateTag:
          return new Ctor(+object);
        case dataViewTag:
          return cloneDataView(object, isDeep);
        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);
        case mapTag:
          return new Ctor();
        case numberTag:
        case stringTag:
          return new Ctor(object);
        case regexpTag:
          return cloneRegExp(object);
        case setTag:
          return new Ctor();
        case symbolTag:
          return cloneSymbol(object);
      }
    }
    module.exports = initCloneByTag;
  }
});

// node_modules/lodash/_baseIsMap.js
var require_baseIsMap = __commonJS({
  "node_modules/lodash/_baseIsMap.js"(exports, module) {
    var getTag = require_getTag();
    var isObjectLike = require_isObjectLike();
    var mapTag = "[object Map]";
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }
    module.exports = baseIsMap;
  }
});

// node_modules/lodash/isMap.js
var require_isMap = __commonJS({
  "node_modules/lodash/isMap.js"(exports, module) {
    var baseIsMap = require_baseIsMap();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsMap = nodeUtil && nodeUtil.isMap;
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
    module.exports = isMap;
  }
});

// node_modules/lodash/_baseIsSet.js
var require_baseIsSet = __commonJS({
  "node_modules/lodash/_baseIsSet.js"(exports, module) {
    var getTag = require_getTag();
    var isObjectLike = require_isObjectLike();
    var setTag = "[object Set]";
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }
    module.exports = baseIsSet;
  }
});

// node_modules/lodash/isSet.js
var require_isSet = __commonJS({
  "node_modules/lodash/isSet.js"(exports, module) {
    var baseIsSet = require_baseIsSet();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsSet = nodeUtil && nodeUtil.isSet;
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
    module.exports = isSet;
  }
});

// node_modules/lodash/_baseClone.js
var require_baseClone = __commonJS({
  "node_modules/lodash/_baseClone.js"(exports, module) {
    var Stack = require_Stack();
    var arrayEach = require_arrayEach();
    var assignValue = require_assignValue();
    var baseAssign = require_baseAssign();
    var baseAssignIn = require_baseAssignIn();
    var cloneBuffer = require_cloneBuffer();
    var copyArray = require_copyArray();
    var copySymbols = require_copySymbols();
    var copySymbolsIn = require_copySymbolsIn();
    var getAllKeys = require_getAllKeys();
    var getAllKeysIn = require_getAllKeysIn();
    var getTag = require_getTag();
    var initCloneArray = require_initCloneArray();
    var initCloneByTag = require_initCloneByTag();
    var initCloneObject = require_initCloneObject();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isMap = require_isMap();
    var isObject = require_isObject();
    var isSet = require_isSet();
    var keys = require_keys();
    var keysIn = require_keysIn();
    var CLONE_DEEP_FLAG = 1;
    var CLONE_FLAT_FLAG = 2;
    var CLONE_SYMBOLS_FLAG = 4;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== void 0) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || isFunc && !object) {
          result = isFlat || isFunc ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      stack || (stack = new Stack());
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);
      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key2) {
          result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
      }
      var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
      var props = isArr ? void 0 : keysFunc(value);
      arrayEach(props || value, function(subValue, key2) {
        if (props) {
          key2 = subValue;
          subValue = value[key2];
        }
        assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
      return result;
    }
    module.exports = baseClone;
  }
});

// node_modules/lodash/_baseSlice.js
var require_baseSlice = __commonJS({
  "node_modules/lodash/_baseSlice.js"(exports, module) {
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    module.exports = baseSlice;
  }
});

// node_modules/lodash/_parent.js
var require_parent = __commonJS({
  "node_modules/lodash/_parent.js"(exports, module) {
    var baseGet = require_baseGet();
    var baseSlice = require_baseSlice();
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }
    module.exports = parent;
  }
});

// node_modules/lodash/_baseUnset.js
var require_baseUnset = __commonJS({
  "node_modules/lodash/_baseUnset.js"(exports, module) {
    var castPath = require_castPath();
    var last = require_last();
    var parent = require_parent();
    var toKey = require_toKey();
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }
    module.exports = baseUnset;
  }
});

// node_modules/lodash/_customOmitClone.js
var require_customOmitClone = __commonJS({
  "node_modules/lodash/_customOmitClone.js"(exports, module) {
    var isPlainObject = require_isPlainObject();
    function customOmitClone(value) {
      return isPlainObject(value) ? void 0 : value;
    }
    module.exports = customOmitClone;
  }
});

// node_modules/lodash/omit.js
var require_omit = __commonJS({
  "node_modules/lodash/omit.js"(exports, module) {
    var arrayMap = require_arrayMap();
    var baseClone = require_baseClone();
    var baseUnset = require_baseUnset();
    var castPath = require_castPath();
    var copyObject = require_copyObject();
    var customOmitClone = require_customOmitClone();
    var flatRest = require_flatRest();
    var getAllKeysIn = require_getAllKeysIn();
    var CLONE_DEEP_FLAG = 1;
    var CLONE_FLAT_FLAG = 2;
    var CLONE_SYMBOLS_FLAG = 4;
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });
    module.exports = omit;
  }
});

// node_modules/@nivo/bar/dist/nivo-bar.mjs
var import_react2 = __toESM(require_react(), 1);

// node_modules/@nivo/annotations/dist/nivo-annotations.mjs
var import_react = __toESM(require_react(), 1);
var import_filter = __toESM(require_filter(), 1);
var import_isNumber = __toESM(require_isNumber(), 1);
var import_omit = __toESM(require_omit(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function g() {
  return g = Object.assign ? Object.assign.bind() : function(t2) {
    for (var n2 = 1; n2 < arguments.length; n2++) {
      var i2 = arguments[n2];
      for (var o4 in i2) ({}).hasOwnProperty.call(i2, o4) && (t2[o4] = i2[o4]);
    }
    return t2;
  }, g.apply(null, arguments);
}
var k2 = { dotSize: 4, noteWidth: 120, noteTextOffset: 8, animate: true };
var W = function(n2) {
  var i2 = typeof n2;
  return (0, import_react.isValidElement)(n2) || "string" === i2 || "function" === i2 || "object" === i2;
};
var v = function(t2) {
  var n2 = typeof t2;
  return "string" === n2 || "function" === n2;
};
var b = function(t2) {
  return "circle" === t2.type;
};
var w = function(t2) {
  return "dot" === t2.type;
};
var z3 = function(t2) {
  return "rect" === t2.type;
};
var P = function(t2) {
  var n2 = t2.data, i2 = t2.annotations, e2 = t2.getPosition, r2 = t2.getDimensions;
  return i2.reduce(function(t3, i3) {
    var s = i3.offset || 0;
    return [].concat(t3, (0, import_filter.default)(n2, i3.match).map(function(t4) {
      var n3 = e2(t4), o4 = r2(t4);
      return (b(i3) || z3(i3)) && (o4.size = o4.size + 2 * s, o4.width = o4.width + 2 * s, o4.height = o4.height + 2 * s), g({}, (0, import_omit.default)(i3, ["match", "offset"]), n3, o4, { size: i3.size || o4.size, datum: t4 });
    }));
  }, []);
};
var C = function(t2, n2, i2, o4) {
  var e2 = Math.atan2(o4 - n2, i2 - t2);
  return At(It(e2));
};
var S = function(t2) {
  var n2, i2, o4 = t2.x, a2 = t2.y, r2 = t2.noteX, s = t2.noteY, h = t2.noteWidth, d = void 0 === h ? k2.noteWidth : h, c2 = t2.noteTextOffset, f = void 0 === c2 ? k2.noteTextOffset : c2;
  if ((0, import_isNumber.default)(r2)) n2 = o4 + r2;
  else {
    if (void 0 === r2.abs) throw new Error("noteX should be either a number or an object containing an 'abs' property");
    n2 = r2.abs;
  }
  if ((0, import_isNumber.default)(s)) i2 = a2 + s;
  else {
    if (void 0 === s.abs) throw new Error("noteY should be either a number or an object containing an 'abs' property");
    i2 = s.abs;
  }
  var y2 = o4, x3 = a2, m2 = C(o4, a2, n2, i2);
  if (b(t2)) {
    var p2 = Yt(Wt(m2), t2.size / 2);
    y2 += p2.x, x3 += p2.y;
  }
  if (z3(t2)) {
    var g2 = Math.round((m2 + 90) / 45) % 8;
    0 === g2 && (x3 -= t2.height / 2), 1 === g2 && (y2 += t2.width / 2, x3 -= t2.height / 2), 2 === g2 && (y2 += t2.width / 2), 3 === g2 && (y2 += t2.width / 2, x3 += t2.height / 2), 4 === g2 && (x3 += t2.height / 2), 5 === g2 && (y2 -= t2.width / 2, x3 += t2.height / 2), 6 === g2 && (y2 -= t2.width / 2), 7 === g2 && (y2 -= t2.width / 2, x3 -= t2.height / 2);
  }
  var W2 = n2, v2 = n2;
  return (m2 + 90) % 360 > 180 ? (W2 -= d, v2 -= d) : v2 += d, { points: [[y2, x3], [n2, i2], [v2, i2]], text: [W2, i2 - f], angle: m2 + 90 };
};
var O2 = function(t2) {
  var i2 = t2.data, o4 = t2.annotations, e2 = t2.getPosition, a2 = t2.getDimensions;
  return (0, import_react.useMemo)(function() {
    return P({ data: i2, annotations: o4, getPosition: e2, getDimensions: a2 });
  }, [i2, o4, e2, a2]);
};
var j2 = function(t2) {
  var i2 = t2.annotations;
  return (0, import_react.useMemo)(function() {
    return i2.map(function(t3) {
      return g({}, t3, { computed: S(g({}, t3)) });
    });
  }, [i2]);
};
var M = function(t2) {
  return (0, import_react.useMemo)(function() {
    return S(t2);
  }, [t2]);
};
var T2 = function(t2) {
  var n2 = t2.datum, o4 = t2.x, e2 = t2.y, r2 = t2.note, s = k(), l = Yr(), u = l.animate, d = l.config, k4 = useSpring({ x: o4, y: e2, config: d, immediate: !u });
  return "function" == typeof r2 ? (0, import_react.createElement)(r2, { x: o4, y: e2, datum: n2 }) : (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [s.annotations.text.outlineWidth > 0 && (0, import_jsx_runtime.jsx)(animated.text, { x: k4.x, y: k4.y, style: g({}, s.annotations.text, { strokeLinejoin: "round", strokeWidth: 2 * s.annotations.text.outlineWidth, stroke: s.annotations.text.outlineColor }), children: r2 }), (0, import_jsx_runtime.jsx)(animated.text, { x: k4.x, y: k4.y, style: (0, import_omit.default)(s.annotations.text, ["outlineWidth", "outlineColor"]), children: r2 })] });
};
var E = function(t2) {
  var i2 = t2.points, o4 = t2.isOutline, e2 = void 0 !== o4 && o4, a2 = k(), r2 = (0, import_react.useMemo)(function() {
    var t3 = i2[0];
    return i2.slice(1).reduce(function(t4, n2) {
      return t4 + " L" + n2[0] + "," + n2[1];
    }, "M" + t3[0] + "," + t3[1]);
  }, [i2]), s = Fr(r2);
  if (e2 && a2.annotations.link.outlineWidth <= 0) return null;
  var l = g({}, a2.annotations.link);
  return e2 && (l.strokeLinecap = "square", l.strokeWidth = a2.annotations.link.strokeWidth + 2 * a2.annotations.link.outlineWidth, l.stroke = a2.annotations.link.outlineColor, l.opacity = a2.annotations.link.outlineOpacity), (0, import_jsx_runtime.jsx)(animated.path, { fill: "none", d: s, style: l });
};
var I = function(t2) {
  var n2 = t2.x, i2 = t2.y, o4 = t2.size, e2 = k(), a2 = Yr(), r2 = a2.animate, s = a2.config, l = useSpring({ x: n2, y: i2, radius: o4 / 2, config: s, immediate: !r2 });
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [e2.annotations.outline.outlineWidth > 0 && (0, import_jsx_runtime.jsx)(animated.circle, { cx: l.x, cy: l.y, r: l.radius, style: g({}, e2.annotations.outline, { fill: "none", strokeWidth: e2.annotations.outline.strokeWidth + 2 * e2.annotations.outline.outlineWidth, stroke: e2.annotations.outline.outlineColor, opacity: e2.annotations.outline.outlineOpacity }) }), (0, import_jsx_runtime.jsx)(animated.circle, { cx: l.x, cy: l.y, r: l.radius, style: e2.annotations.outline })] });
};
var D2 = function(t2) {
  var n2 = t2.x, i2 = t2.y, o4 = t2.size, e2 = void 0 === o4 ? k2.dotSize : o4, a2 = k(), r2 = Yr(), s = r2.animate, l = r2.config, u = useSpring({ x: n2, y: i2, radius: e2 / 2, config: l, immediate: !s });
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [a2.annotations.outline.outlineWidth > 0 && (0, import_jsx_runtime.jsx)(animated.circle, { cx: u.x, cy: u.y, r: u.radius, style: g({}, a2.annotations.outline, { fill: "none", strokeWidth: 2 * a2.annotations.outline.outlineWidth, stroke: a2.annotations.outline.outlineColor, opacity: a2.annotations.outline.outlineOpacity }) }), (0, import_jsx_runtime.jsx)(animated.circle, { cx: u.x, cy: u.y, r: u.radius, style: a2.annotations.symbol })] });
};
var L = function(t2) {
  var n2 = t2.x, i2 = t2.y, o4 = t2.width, e2 = t2.height, a2 = t2.borderRadius, r2 = void 0 === a2 ? 6 : a2, s = k(), l = Yr(), u = l.animate, d = l.config, k4 = useSpring({ x: n2 - o4 / 2, y: i2 - e2 / 2, width: o4, height: e2, config: d, immediate: !u });
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [s.annotations.outline.outlineWidth > 0 && (0, import_jsx_runtime.jsx)(animated.rect, { x: k4.x, y: k4.y, rx: r2, ry: r2, width: k4.width, height: k4.height, style: g({}, s.annotations.outline, { fill: "none", strokeWidth: s.annotations.outline.strokeWidth + 2 * s.annotations.outline.outlineWidth, stroke: s.annotations.outline.outlineColor, opacity: s.annotations.outline.outlineOpacity }) }), (0, import_jsx_runtime.jsx)(animated.rect, { x: k4.x, y: k4.y, rx: r2, ry: r2, width: k4.width, height: k4.height, style: s.annotations.outline })] });
};
var R2 = function(t2) {
  var n2 = t2.datum, i2 = t2.x, o4 = t2.y, e2 = t2.note, a2 = M(t2);
  if (!W(e2)) throw new Error("note should be a valid react element");
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(E, { points: a2.points, isOutline: true }), b(t2) && (0, import_jsx_runtime.jsx)(I, { x: i2, y: o4, size: t2.size }), w(t2) && (0, import_jsx_runtime.jsx)(D2, { x: i2, y: o4, size: t2.size }), z3(t2) && (0, import_jsx_runtime.jsx)(L, { x: i2, y: o4, width: t2.width, height: t2.height, borderRadius: t2.borderRadius }), (0, import_jsx_runtime.jsx)(E, { points: a2.points }), (0, import_jsx_runtime.jsx)(T2, { datum: n2, x: a2.text[0], y: a2.text[1], note: e2 })] });
};
var q = function(t2, n2) {
  n2.forEach(function(n3, i2) {
    var o4 = n3[0], e2 = n3[1];
    0 === i2 ? t2.moveTo(o4, e2) : t2.lineTo(o4, e2);
  });
};
var J = function(t2, n2) {
  var i2 = n2.annotations, o4 = n2.theme;
  0 !== i2.length && (t2.save(), i2.forEach(function(n3) {
    if (!v(n3.note)) throw new Error("note is invalid for canvas implementation");
    o4.annotations.link.outlineWidth > 0 && (t2.lineCap = "square", t2.strokeStyle = o4.annotations.link.outlineColor, t2.lineWidth = o4.annotations.link.strokeWidth + 2 * o4.annotations.link.outlineWidth, t2.beginPath(), q(t2, n3.computed.points), t2.stroke(), t2.lineCap = "butt"), b(n3) && o4.annotations.outline.outlineWidth > 0 && (t2.strokeStyle = o4.annotations.outline.outlineColor, t2.lineWidth = o4.annotations.outline.strokeWidth + 2 * o4.annotations.outline.outlineWidth, t2.beginPath(), t2.arc(n3.x, n3.y, n3.size / 2, 0, 2 * Math.PI), t2.stroke()), w(n3) && o4.annotations.symbol.outlineWidth > 0 && (t2.strokeStyle = o4.annotations.symbol.outlineColor, t2.lineWidth = 2 * o4.annotations.symbol.outlineWidth, t2.beginPath(), t2.arc(n3.x, n3.y, n3.size / 2, 0, 2 * Math.PI), t2.stroke()), z3(n3) && o4.annotations.outline.outlineWidth > 0 && (t2.strokeStyle = o4.annotations.outline.outlineColor, t2.lineWidth = o4.annotations.outline.strokeWidth + 2 * o4.annotations.outline.outlineWidth, t2.beginPath(), t2.rect(n3.x - n3.width / 2, n3.y - n3.height / 2, n3.width, n3.height), t2.stroke()), t2.strokeStyle = o4.annotations.link.stroke, t2.lineWidth = o4.annotations.link.strokeWidth, t2.beginPath(), q(t2, n3.computed.points), t2.stroke(), b(n3) && (t2.strokeStyle = o4.annotations.outline.stroke, t2.lineWidth = o4.annotations.outline.strokeWidth, t2.beginPath(), t2.arc(n3.x, n3.y, n3.size / 2, 0, 2 * Math.PI), t2.stroke()), w(n3) && (t2.fillStyle = o4.annotations.symbol.fill, t2.beginPath(), t2.arc(n3.x, n3.y, n3.size / 2, 0, 2 * Math.PI), t2.fill()), z3(n3) && (t2.strokeStyle = o4.annotations.outline.stroke, t2.lineWidth = o4.annotations.outline.strokeWidth, t2.beginPath(), t2.rect(n3.x - n3.width / 2, n3.y - n3.height / 2, n3.width, n3.height), t2.stroke()), "function" == typeof n3.note ? n3.note(t2, { datum: n3.datum, x: n3.computed.text[0], y: n3.computed.text[1], theme: o4 }) : (t2.font = o4.annotations.text.fontSize + "px " + o4.annotations.text.fontFamily, t2.textAlign = "left", t2.textBaseline = "alphabetic", t2.fillStyle = o4.annotations.text.fill, t2.strokeStyle = o4.annotations.text.outlineColor, t2.lineWidth = 2 * o4.annotations.text.outlineWidth, o4.annotations.text.outlineWidth > 0 && (t2.lineJoin = "round", t2.strokeText(n3.note, n3.computed.text[0], n3.computed.text[1]), t2.lineJoin = "miter"), t2.fillText(n3.note, n3.computed.text[0], n3.computed.text[1]));
  }), t2.restore());
};

// node_modules/@nivo/bar/dist/nivo-bar.mjs
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var import_uniqBy = __toESM(require_uniqBy(), 1);

// node_modules/@nivo/canvas/dist/nivo-canvas.mjs
var o3 = function(o4, e2, r2, a2, i2, u) {
  u > 0 ? (o4.moveTo(e2 + u, r2), o4.lineTo(e2 + a2 - u, r2), o4.quadraticCurveTo(e2 + a2, r2, e2 + a2, r2 + u), o4.lineTo(e2 + a2, r2 + i2 - u), o4.quadraticCurveTo(e2 + a2, r2 + i2, e2 + a2 - u, r2 + i2), o4.lineTo(e2 + u, r2 + i2), o4.quadraticCurveTo(e2, r2 + i2, e2, r2 + i2 - u), o4.lineTo(e2, r2 + u), o4.quadraticCurveTo(e2, r2, e2 + u, r2), o4.closePath()) : o4.rect(e2, r2, a2, i2);
};

// node_modules/@nivo/bar/dist/nivo-bar.mjs
function J2() {
  return J2 = Object.assign ? Object.assign.bind() : function(e2) {
    for (var t2 = 1; t2 < arguments.length; t2++) {
      var a2 = arguments[t2];
      for (var i2 in a2) ({}).hasOwnProperty.call(a2, i2) && (e2[i2] = a2[i2]);
    }
    return e2;
  }, J2.apply(null, arguments);
}
function Q(e2, t2) {
  if (null == e2) return {};
  var a2 = {};
  for (var i2 in e2) if ({}.hasOwnProperty.call(e2, i2)) {
    if (-1 !== t2.indexOf(i2)) continue;
    a2[i2] = e2[i2];
  }
  return a2;
}
var U;
var Z = function(e2) {
  var t2 = e2.bars, a2 = e2.annotations, i2 = O2({ data: t2, annotations: a2, getPosition: function(e3) {
    return { x: e3.x + e3.width / 2, y: e3.y + e3.height / 2 };
  }, getDimensions: function(e3) {
    var t3 = e3.height, a3 = e3.width;
    return { width: a3, height: t3, size: Math.max(a3, t3) };
  } });
  return (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: i2.map(function(e3, t3) {
    return (0, import_jsx_runtime2.jsx)(R2, J2({}, e3), t3);
  }) });
};
var $ = function(e2) {
  var t2 = e2.width, a2 = e2.height, i2 = e2.legends, n2 = e2.toggleSerie;
  return (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: i2.map(function(e3, i3) {
    var r2, l = e3[0], o4 = e3[1];
    return (0, import_jsx_runtime2.jsx)(H, J2({}, l, { containerWidth: t2, containerHeight: a2, data: null != (r2 = l.data) ? r2 : o4, toggleSerie: l.toggleSerie && "keys" === l.dataFrom ? n2 : void 0 }), i3);
  }) });
};
var ee = ["data"];
var te = function(e2) {
  var t2, a2 = e2.bar, i2 = a2.data, n2 = Q(a2, ee), r2 = e2.style, l = r2.borderColor, o4 = r2.color, d = r2.height, u = r2.labelColor, s = r2.labelOpacity, c2 = r2.labelX, h = r2.labelY, f = r2.transform, b2 = r2.width, v2 = r2.textAnchor, p2 = e2.borderRadius, k4 = e2.borderWidth, w3 = e2.label, L3 = e2.shouldRenderLabel, C3 = e2.isInteractive, V2 = e2.onClick, M2 = e2.onMouseEnter, W2 = e2.onMouseLeave, B = e2.tooltip, O3 = e2.isFocusable, T4 = e2.ariaLabel, E2 = e2.ariaLabelledBy, H2 = e2.ariaDescribedBy, R3 = e2.ariaDisabled, F = e2.ariaHidden, X = k(), G = z(), z4 = G.showTooltipFromEvent, N = G.showTooltipAt, j3 = G.hideTooltip, K = (0, import_react2.useMemo)(function() {
    return function() {
      return (0, import_react2.createElement)(B, J2({}, n2, i2));
    };
  }, [B, n2, i2]), _2 = (0, import_react2.useCallback)(function(e3) {
    null == V2 || V2(J2({ color: n2.color }, i2), e3);
  }, [n2, i2, V2]), q2 = (0, import_react2.useCallback)(function(e3) {
    return z4(K(), e3);
  }, [z4, K]), U2 = (0, import_react2.useCallback)(function(e3) {
    null == M2 || M2(i2, e3), z4(K(), e3);
  }, [i2, M2, z4, K]), Z2 = (0, import_react2.useCallback)(function(e3) {
    null == W2 || W2(i2, e3), j3();
  }, [i2, j3, W2]), $2 = (0, import_react2.useCallback)(function() {
    N(K(), [n2.absX + n2.width / 2, n2.absY]);
  }, [N, K, n2]), te2 = (0, import_react2.useCallback)(function() {
    j3();
  }, [j3]);
  return (0, import_jsx_runtime2.jsxs)(animated.g, { transform: f, children: [(0, import_jsx_runtime2.jsx)(animated.rect, { width: to(b2, function(e3) {
    return Math.max(e3, 0);
  }), height: to(d, function(e3) {
    return Math.max(e3, 0);
  }), rx: p2, ry: p2, fill: null != (t2 = i2.fill) ? t2 : o4, strokeWidth: k4, stroke: l, focusable: O3, tabIndex: O3 ? 0 : void 0, "aria-label": T4 ? T4(i2) : void 0, "aria-labelledby": E2 ? E2(i2) : void 0, "aria-describedby": H2 ? H2(i2) : void 0, "aria-disabled": R3 ? R3(i2) : void 0, "aria-hidden": F ? F(i2) : void 0, onMouseEnter: C3 ? U2 : void 0, onMouseMove: C3 ? q2 : void 0, onMouseLeave: C3 ? Z2 : void 0, onClick: C3 ? _2 : void 0, onFocus: C3 && O3 ? $2 : void 0, onBlur: C3 && O3 ? te2 : void 0 }), L3 && (0, import_jsx_runtime2.jsx)(c, { x: c2, y: h, textAnchor: v2, dominantBaseline: "central", fillOpacity: s, style: J2({}, X.labels.text, { pointerEvents: "none", fill: u }), children: w3 })] });
};
var ae = ["color", "label"];
var ie = function(e2) {
  var t2 = e2.color, a2 = e2.label, i2 = Q(e2, ae);
  return (0, import_jsx_runtime2.jsx)(T, { id: a2, value: i2.formattedValue, enableChip: true, color: t2 });
};
var ne = { indexBy: "id", keys: ["value"], groupMode: "stacked", layout: "vertical", reverse: false, minValue: "auto", maxValue: "auto", valueScale: { type: "linear" }, indexScale: { type: "band", round: true }, padding: 0.1, innerPadding: 0, axisBottom: {}, axisLeft: {}, enableGridX: false, enableGridY: true, enableLabel: true, label: "formattedValue", labelPosition: "middle", labelOffset: 0, labelSkipWidth: 0, labelSkipHeight: 0, labelTextColor: { from: "theme", theme: "labels.text.fill" }, colorBy: "id", colors: { scheme: "nivo" }, borderRadius: 0, borderWidth: 0, borderColor: { from: "color" }, isInteractive: true, tooltip: ie, tooltipLabel: function(e2) {
  return e2.id + " - " + e2.indexValue;
}, legends: [], initialHiddenIds: [], annotations: [], markers: [], enableTotals: false, totalsOffset: 10 };
var re = J2({}, ne, { layers: ["grid", "axes", "bars", "totals", "markers", "legends", "annotations"], barComponent: te, defs: [], fill: [], animate: true, motionConfig: "default", role: "img", isFocusable: false });
var le = J2({}, ne, { layers: ["grid", "axes", "bars", "totals", "legends", "annotations"], pixelRatio: "undefined" != typeof window && null != (U = window.devicePixelRatio) ? U : 1 });
var oe = function(e2, t2, a2, i2, n2, r2) {
  return dn2(i2, { all: e2.map(t2), min: 0, max: 0 }, n2, r2).padding(a2);
};
var de = function(e2, t2) {
  return e2.map(function(e3) {
    return J2({}, t2.reduce(function(e4, t3) {
      return e4[t3] = null, e4;
    }, {}), e3);
  });
};
var ue = function(e2) {
  return Object.keys(e2).reduce(function(t2, a2) {
    return e2[a2] && (t2[a2] = e2[a2]), t2;
  }, {});
};
var se = function(e2) {
  return [e2, Number(e2)];
};
function ce(e2, t2, a2, i2) {
  return void 0 === e2 && (e2 = ne.layout), void 0 === t2 && (t2 = ne.reverse), void 0 === a2 && (a2 = ne.labelPosition), void 0 === i2 && (i2 = ne.labelOffset), function(n2, r2) {
    var l = i2 * (t2 ? -1 : 1);
    if ("horizontal" === e2) {
      var o4 = n2 / 2;
      return "start" === a2 ? o4 = t2 ? n2 : 0 : "end" === a2 && (o4 = t2 ? 0 : n2), { labelX: o4 + l, labelY: r2 / 2, textAnchor: "middle" === a2 ? "middle" : t2 ? "end" : "start" };
    }
    var d = r2 / 2;
    return "start" === a2 ? d = t2 ? 0 : r2 : "end" === a2 && (d = t2 ? r2 : 0), { labelX: n2 / 2, labelY: d - l, textAnchor: "middle" };
  };
}
var he = ["layout", "minValue", "maxValue", "reverse", "width", "height", "padding", "innerPadding", "valueScale", "indexScale", "hiddenIds"];
var fe = function(e2, t2) {
  return e2 > t2;
};
var be = function(e2, t2) {
  return e2 < t2;
};
var ve = function(e2, t2) {
  return Array.from(" ".repeat(t2 - e2), function(t3, a2) {
    return e2 + a2;
  });
};
var ge = function(e2) {
  return fe(e2, 0) ? 0 : e2;
};
var me = function(e2, t2, a2, i2) {
  var n2 = e2.data, r2 = e2.formatValue, l = e2.getColor, o4 = e2.getIndex, d = e2.getTooltipLabel, u = e2.innerPadding, s = void 0 === u ? 0 : u, c2 = e2.keys, h = e2.xScale, f = e2.yScale, b2 = e2.margin, v2 = a2 ? be : fe, g2 = n2.map(ue), m2 = [];
  return c2.forEach(function(e3, a3) {
    return ve(0, h.domain().length).forEach(function(u2) {
      var c3, p2, x3, y2 = se(n2[u2][e3]), S3 = y2[0], k4 = y2[1], w3 = o4(n2[u2]), L3 = (null != (c3 = h(w3)) ? c3 : 0) + t2 * a3 + s * a3, C3 = v2(p2 = k4, 0) ? null != (x3 = f(p2)) ? x3 : 0 : i2, V2 = function(e4, t3) {
        var a4;
        return v2(e4, 0) ? i2 - t3 : (null != (a4 = f(e4)) ? a4 : 0) - i2;
      }(k4, C3), M2 = { id: e3, value: null === S3 ? S3 : k4, formattedValue: r2(k4), hidden: false, index: u2, indexValue: w3, data: g2[u2] };
      m2.push({ key: e3 + "." + M2.indexValue, index: m2.length, data: M2, x: L3, y: C3, absX: b2.left + L3, absY: b2.top + C3, width: t2, height: V2, color: l(M2), label: d(M2) });
    });
  }), m2;
};
var pe = function(e2, t2, a2, i2) {
  var n2 = e2.data, r2 = e2.formatValue, l = e2.getIndex, o4 = e2.getColor, d = e2.getTooltipLabel, u = e2.keys, s = e2.innerPadding, c2 = void 0 === s ? 0 : s, h = e2.xScale, f = e2.yScale, b2 = e2.margin, v2 = a2 ? be : fe, g2 = n2.map(ue), m2 = [];
  return u.forEach(function(e3, a3) {
    return ve(0, f.domain().length).forEach(function(u2) {
      var s2, p2, x3, y2 = se(n2[u2][e3]), S3 = y2[0], k4 = y2[1], w3 = l(n2[u2]), L3 = v2(p2 = k4, 0) ? i2 : null != (x3 = h(p2)) ? x3 : 0, C3 = (null != (s2 = f(w3)) ? s2 : 0) + t2 * a3 + c2 * a3, V2 = function(e4, t3) {
        var a4;
        return v2(e4, 0) ? (null != (a4 = h(e4)) ? a4 : 0) - i2 : i2 - t3;
      }(k4, L3), M2 = { id: e3, value: null === S3 ? S3 : k4, formattedValue: r2(k4), hidden: false, index: u2, indexValue: w3, data: g2[u2] };
      m2.push({ key: e3 + "." + M2.indexValue, index: m2.length, data: M2, x: L3, y: C3, absX: b2.left + L3, absY: b2.top + C3, width: V2, height: t2, color: o4(M2), label: d(M2) });
    });
  }), m2;
};
var xe = function(e2) {
  var t2, a2, i2 = e2.layout, n2 = e2.minValue, r2 = e2.maxValue, l = e2.reverse, o4 = e2.width, d = e2.height, u = e2.padding, s = void 0 === u ? 0 : u, c2 = e2.innerPadding, h = void 0 === c2 ? 0 : c2, f = e2.valueScale, b2 = e2.indexScale, v2 = e2.hiddenIds, g2 = void 0 === v2 ? [] : v2, m2 = Q(e2, he), p2 = m2.keys.filter(function(e3) {
    return !g2.includes(e3);
  }), x3 = de(m2.data, p2), y2 = "vertical" === i2 ? ["y", "x", o4] : ["x", "y", d], S3 = y2[0], k4 = y2[1], w3 = y2[2], L3 = oe(x3, m2.getIndex, s, b2, w3, k4), C3 = J2({ max: r2, min: n2, reverse: l }, f), V2 = "auto" === C3.min ? ge : function(e3) {
    return e3;
  }, M2 = x3.reduce(function(e3, t3) {
    return [].concat(e3, p2.map(function(e4) {
      return t3[e4];
    }));
  }, []).filter(Boolean), W2 = V2(Math.min.apply(Math, M2)), B = (a2 = Math.max.apply(Math, M2), isFinite(a2) ? a2 : 0), O3 = dn2(C3, { all: M2, min: W2, max: B }, "x" === S3 ? o4 : d, S3), I3 = "vertical" === i2 ? [L3, O3] : [O3, L3], T4 = I3[0], P3 = I3[1], E2 = (L3.bandwidth() - h * (p2.length - 1)) / p2.length, H2 = [J2({}, m2, { data: x3, keys: p2, innerPadding: h, xScale: T4, yScale: P3 }), E2, C3.reverse, null != (t2 = O3(0)) ? t2 : 0];
  return { xScale: T4, yScale: P3, bars: E2 > 0 ? "vertical" === i2 ? me.apply(void 0, H2) : pe.apply(void 0, H2) : [] };
};
var ye = ["data", "layout", "minValue", "maxValue", "reverse", "width", "height", "padding", "valueScale", "indexScale", "hiddenIds"];
var Se = function(e2) {
  var t2;
  return e2.some(Array.isArray) ? Se((t2 = []).concat.apply(t2, e2)) : e2;
};
var ke = function(e2, t2, a2) {
  var i2 = e2.formatValue, n2 = e2.getColor, r2 = e2.getIndex, l = e2.getTooltipLabel, o4 = e2.innerPadding, d = e2.stackedData, u = e2.xScale, s = e2.yScale, c2 = e2.margin, h = [];
  return d.forEach(function(e3) {
    return u.domain().forEach(function(d2, f) {
      var b2, v2, g2 = e3[f], m2 = null != (b2 = u(r2(g2.data))) ? b2 : 0, p2 = (null != (v2 = function(e4) {
        return s(e4[a2 ? 0 : 1]);
      }(g2)) ? v2 : 0) + 0.5 * o4, x3 = function(e4, t3) {
        var i3;
        return (null != (i3 = s(e4[a2 ? 1 : 0])) ? i3 : 0) - t3;
      }(g2, p2) - o4, y2 = se(g2.data[e3.key]), S3 = y2[0], k4 = y2[1], w3 = { id: e3.key, value: null === S3 ? S3 : k4, formattedValue: i2(k4), hidden: false, index: f, indexValue: d2, data: ue(g2.data) };
      h.push({ key: e3.key + "." + d2, index: h.length, data: w3, x: m2, y: p2, absX: c2.left + m2, absY: c2.top + p2, width: t2, height: x3, color: n2(w3), label: l(w3) });
    });
  }), h;
};
var we = function(e2, t2, a2) {
  var i2 = e2.formatValue, n2 = e2.getColor, r2 = e2.getIndex, l = e2.getTooltipLabel, o4 = e2.innerPadding, d = e2.stackedData, u = e2.xScale, s = e2.yScale, c2 = e2.margin, h = [];
  return d.forEach(function(e3) {
    return s.domain().forEach(function(d2, f) {
      var b2, v2, g2 = e3[f], m2 = null != (b2 = s(r2(g2.data))) ? b2 : 0, p2 = (null != (v2 = function(e4) {
        return u(e4[a2 ? 1 : 0]);
      }(g2)) ? v2 : 0) + 0.5 * o4, x3 = function(e4, t3) {
        var i3;
        return (null != (i3 = u(e4[a2 ? 0 : 1])) ? i3 : 0) - t3;
      }(g2, p2) - o4, y2 = se(g2.data[e3.key]), S3 = y2[0], k4 = y2[1], w3 = { id: e3.key, value: null === S3 ? S3 : k4, formattedValue: i2(k4), hidden: false, index: f, indexValue: d2, data: ue(g2.data) };
      h.push({ key: e3.key + "." + d2, index: h.length, data: w3, x: p2, y: m2, absX: c2.left + p2, absY: c2.top + m2, width: x3, height: t2, color: n2(w3), label: l(w3) });
    });
  }), h;
};
var Le = function(e2) {
  var t2, a2 = e2.data, i2 = e2.layout, n2 = e2.minValue, r2 = e2.maxValue, l = e2.reverse, o4 = e2.width, d = e2.height, u = e2.padding, s = void 0 === u ? 0 : u, c2 = e2.valueScale, h = e2.indexScale, f = e2.hiddenIds, b2 = void 0 === f ? [] : f, v2 = Q(e2, ye), g2 = v2.keys.filter(function(e3) {
    return !b2.includes(e3);
  }), m2 = stack_default().keys(g2).offset(diverging_default)(de(a2, g2)), p2 = "vertical" === i2 ? ["y", "x", o4] : ["x", "y", d], x3 = p2[0], y2 = p2[1], S3 = p2[2], k4 = oe(a2, v2.getIndex, s, h, S3, y2), w3 = J2({ max: r2, min: n2, reverse: l }, c2), L3 = (t2 = Se(m2), "log" === c2.type ? t2.filter(function(e3) {
    return 0 !== e3;
  }) : t2), C3 = Math.min.apply(Math, L3), V2 = Math.max.apply(Math, L3), M2 = dn2(w3, { all: L3, min: C3, max: V2 }, "x" === x3 ? o4 : d, x3), W2 = "vertical" === i2 ? [k4, M2] : [M2, k4], B = W2[0], O3 = W2[1], I3 = v2.innerPadding > 0 ? v2.innerPadding : 0, T4 = k4.bandwidth(), P3 = [J2({}, v2, { innerPadding: I3, stackedData: m2, xScale: B, yScale: O3 }), T4, w3.reverse];
  return { xScale: B, yScale: O3, bars: T4 > 0 ? "vertical" === i2 ? ke.apply(void 0, P3) : we.apply(void 0, P3) : [] };
};
var Ce = function(e2) {
  var t2 = e2.bars, a2 = e2.direction, i2 = e2.from, r2 = e2.groupMode, l = e2.layout, o4 = e2.legendLabel, d = e2.reverse, u = dn(null != o4 ? o4 : "indexes" === i2 ? "indexValue" : "id");
  return "indexes" === i2 ? function(e3, t3, a3) {
    var i3 = (0, import_uniqBy.default)(e3.map(function(e4) {
      var t4, i4;
      return { id: null != (t4 = e4.data.indexValue) ? t4 : "", label: a3(e4.data), hidden: e4.data.hidden, color: null != (i4 = e4.color) ? i4 : "#000" };
    }), function(e4) {
      return e4.id;
    });
    return "horizontal" === t3 && i3.reverse(), i3;
  }(t2, l, u) : function(e3, t3, a3, i3, n2, r3) {
    var l2 = (0, import_uniqBy.default)(e3.map(function(e4) {
      var t4;
      return { id: e4.data.id, label: r3(e4.data), hidden: e4.data.hidden, color: null != (t4 = e4.color) ? t4 : "#000" };
    }), function(e4) {
      return e4.id;
    });
    return ("vertical" === t3 && "stacked" === i3 && "column" === a3 && true !== n2 || "horizontal" === t3 && "stacked" === i3 && true === n2) && l2.reverse(), l2;
  }(t2, l, a2, r2, d, u);
};
var Ve = function(e2, t2, a2) {
  var i2 = e2.get(t2) || 0;
  e2.set(t2, i2 + a2);
};
var Me = function(e2, t2, a2) {
  var i2 = e2.get(t2) || 0;
  e2.set(t2, i2 + (a2 > 0 ? a2 : 0));
};
var We = function(e2, t2, a2) {
  var i2 = e2.get(t2) || 0;
  e2.set(t2, Math.max(i2, Number(a2)));
};
var Be = function(e2, t2) {
  var a2 = e2.get(t2) || 0;
  e2.set(t2, a2 + 1);
};
var Oe = function(e2) {
  var t2 = e2.indexBy, a2 = void 0 === t2 ? ne.indexBy : t2, i2 = e2.keys, n2 = void 0 === i2 ? ne.keys : i2, o4 = e2.label, d = void 0 === o4 ? ne.label : o4, u = e2.tooltipLabel, s = void 0 === u ? ne.tooltipLabel : u, c2 = e2.valueFormat, h = e2.colors, f = void 0 === h ? ne.colors : h, b2 = e2.colorBy, v2 = void 0 === b2 ? ne.colorBy : b2, g2 = e2.borderColor, m2 = void 0 === g2 ? ne.borderColor : g2, p2 = e2.labelTextColor, y2 = void 0 === p2 ? ne.labelTextColor : p2, w3 = e2.groupMode, L3 = void 0 === w3 ? ne.groupMode : w3, C3 = e2.layout, V2 = void 0 === C3 ? ne.layout : C3, M2 = e2.reverse, W2 = void 0 === M2 ? ne.reverse : M2, B = e2.data, O3 = e2.minValue, I3 = void 0 === O3 ? ne.minValue : O3, T4 = e2.maxValue, P3 = void 0 === T4 ? ne.maxValue : T4, E2 = e2.margin, H2 = e2.width, A = e2.height, X = e2.padding, Y = void 0 === X ? ne.padding : X, G = e2.innerPadding, z4 = void 0 === G ? ne.innerPadding : G, N = e2.valueScale, j3 = void 0 === N ? ne.valueScale : N, K = e2.indexScale, _2 = void 0 === K ? ne.indexScale : K, q2 = e2.initialHiddenIds, Q2 = void 0 === q2 ? ne.initialHiddenIds : q2, U2 = e2.enableLabel, Z2 = void 0 === U2 ? ne.enableLabel : U2, $2 = e2.labelSkipWidth, ee2 = void 0 === $2 ? ne.labelSkipWidth : $2, te2 = e2.labelSkipHeight, ae2 = void 0 === te2 ? ne.labelSkipHeight : te2, ie2 = e2.legends, re2 = void 0 === ie2 ? ne.legends : ie2, le2 = e2.legendLabel, oe2 = e2.totalsOffset, de2 = void 0 === oe2 ? ne.totalsOffset : oe2, ue2 = (0, import_react2.useState)(null != Q2 ? Q2 : []), se2 = ue2[0], ce2 = ue2[1], he2 = (0, import_react2.useCallback)(function(e3) {
    ce2(function(t3) {
      return t3.indexOf(e3) > -1 ? t3.filter(function(t4) {
        return t4 !== e3;
      }) : [].concat(t3, [e3]);
    });
  }, []), fe2 = un(a2), be2 = un(d), ve2 = un(s), ge2 = xt(c2), me2 = k(), pe2 = pr(f, v2), ye2 = Ye(m2, me2), Se2 = Ye(y2, me2), ke2 = ("grouped" === L3 ? xe : Le)({ layout: V2, reverse: W2, data: B, getIndex: fe2, keys: n2, minValue: I3, maxValue: P3, width: H2, height: A, getColor: pe2, padding: Y, innerPadding: z4, valueScale: j3, indexScale: _2, hiddenIds: se2, formatValue: ge2, getTooltipLabel: ve2, margin: E2 }), we2 = ke2.bars, Oe2 = ke2.xScale, Ie2 = ke2.yScale, Te2 = (0, import_react2.useMemo)(function() {
    return we2.filter(function(e3) {
      return null !== e3.data.value;
    }).map(function(e3, t3) {
      return J2({}, e3, { index: t3 });
    });
  }, [we2]), Pe2 = (0, import_react2.useCallback)(function(e3) {
    var t3 = e3.width, a3 = e3.height;
    return !!Z2 && (!(ee2 > 0 && t3 < ee2) && !(ae2 > 0 && a3 < ae2));
  }, [Z2, ee2, ae2]), Ee2 = (0, import_react2.useMemo)(function() {
    return n2.map(function(e3) {
      var t3 = we2.find(function(t4) {
        return t4.data.id === e3;
      });
      return J2({}, t3, { data: J2({ id: e3 }, null == t3 ? void 0 : t3.data, { hidden: se2.includes(e3) }) });
    });
  }, [se2, n2, we2]), He2 = (0, import_react2.useMemo)(function() {
    return re2.map(function(e3) {
      return [e3, Ce({ bars: "keys" === e3.dataFrom ? Ee2 : we2, direction: e3.direction, from: e3.dataFrom, groupMode: L3, layout: V2, legendLabel: le2, reverse: W2 })];
    });
  }, [re2, Ee2, we2, L3, V2, le2, W2]), Re2 = (0, import_react2.useMemo)(function() {
    return function(e3, t3, a3, i3, n3, r2, l) {
      void 0 === i3 && (i3 = ne.layout), void 0 === n3 && (n3 = ne.groupMode);
      var o5 = [];
      if (0 === e3.length) return o5;
      var d2 = /* @__PURE__ */ new Map(), u2 = e3[0].width, s2 = e3[0].height;
      if ("stacked" === n3) {
        var c3 = /* @__PURE__ */ new Map();
        e3.forEach(function(e4) {
          var t4 = e4.data, a4 = t4.indexValue, i4 = t4.value;
          Ve(d2, a4, Number(i4)), Me(c3, a4, Number(i4));
        }), c3.forEach(function(e4, n4) {
          var c4, h3, f3, b3 = d2.get(n4) || 0;
          "vertical" === i3 ? (c4 = t3(n4), h3 = a3(e4), f3 = a3(e4 / 2)) : (c4 = t3(e4), h3 = a3(n4), f3 = t3(e4 / 2)), c4 += "vertical" === i3 ? u2 / 2 : r2, h3 += "vertical" === i3 ? -r2 : s2 / 2, o5.push({ key: "total_" + n4, x: c4, y: h3, value: b3, formattedValue: l(b3), animationOffset: f3 });
        });
      } else if ("grouped" === n3) {
        var h2 = /* @__PURE__ */ new Map(), f2 = /* @__PURE__ */ new Map();
        e3.forEach(function(e4) {
          var t4 = e4.data, a4 = t4.indexValue, i4 = t4.value;
          Ve(d2, a4, Number(i4)), We(h2, a4, Number(i4)), Be(f2, a4);
        }), h2.forEach(function(e4, n4) {
          var c4, h3, b3, v3 = d2.get(n4) || 0, g3 = f2.get(n4);
          "vertical" === i3 ? (c4 = t3(n4), h3 = a3(e4), b3 = a3(e4 / 2)) : (c4 = t3(e4), h3 = a3(n4), b3 = t3(e4 / 2)), c4 += "vertical" === i3 ? g3 * u2 / 2 : r2, h3 += "vertical" === i3 ? -r2 : g3 * s2 / 2, o5.push({ key: "total_" + n4, x: c4, y: h3, value: v3, formattedValue: l(v3), animationOffset: b3 });
        });
      }
      return o5;
    }(we2, Oe2, Ie2, V2, L3, de2, ge2);
  }, [we2, Oe2, Ie2, V2, L3, de2, ge2]);
  return { bars: we2, barsWithValue: Te2, xScale: Oe2, yScale: Ie2, getIndex: fe2, getLabel: be2, getTooltipLabel: ve2, formatValue: ge2, getColor: pe2, getBorderColor: ye2, getLabelColor: Se2, shouldRenderBarLabel: Pe2, hiddenIds: se2, toggleSerie: he2, legendsWithData: He2, barTotals: Re2 };
};
var Ie = function(e2) {
  var t2 = e2.data, a2 = e2.springConfig, i2 = e2.animate, n2 = e2.layout, r2 = void 0 === n2 ? re.layout : n2, l = k();
  return useTransition(t2, { keys: function(e3) {
    return e3.key;
  }, from: function(e3) {
    return { x: "vertical" === r2 ? e3.x : e3.animationOffset, y: "vertical" === r2 ? e3.animationOffset : e3.y, labelOpacity: 0 };
  }, enter: function(e3) {
    return { x: e3.x, y: e3.y, labelOpacity: 1 };
  }, update: function(e3) {
    return { x: e3.x, y: e3.y, labelOpacity: 1 };
  }, leave: function(e3) {
    return { x: "vertical" === r2 ? e3.x : e3.animationOffset, y: "vertical" === r2 ? e3.animationOffset : e3.y, labelOpacity: 0 };
  }, config: a2, immediate: !i2, initial: i2 ? void 0 : null })(function(e3, t3) {
    return (0, import_jsx_runtime2.jsx)(animated.text, { x: e3.x, y: e3.y, fillOpacity: e3.labelOpacity, style: J2({}, l.labels.text, { pointerEvents: "none" }), fontWeight: "bold", fontSize: l.labels.text.fontSize, fontFamily: l.labels.text.fontFamily, textAnchor: "vertical" === r2 ? "middle" : "start", alignmentBaseline: "vertical" === r2 ? "alphabetic" : "middle", children: t3.formattedValue }, t3.key);
  });
};
var Te = ["isInteractive", "animate", "motionConfig", "theme", "renderWrapper"];
var Pe = function(a2) {
  var i2 = a2.data, n2 = a2.indexBy, r2 = a2.keys, l = a2.margin, o4 = a2.width, f = a2.height, b2 = a2.groupMode, v2 = a2.layout, g2 = a2.reverse, m2 = a2.minValue, S3 = a2.maxValue, k4 = a2.valueScale, L3 = a2.indexScale, C3 = a2.padding, V2 = a2.innerPadding, M2 = a2.axisTop, W2 = a2.axisRight, B = a2.axisBottom, O3 = void 0 === B ? re.axisBottom : B, T4 = a2.axisLeft, P3 = void 0 === T4 ? re.axisLeft : T4, E2 = a2.enableGridX, H2 = void 0 === E2 ? re.enableGridX : E2, R3 = a2.enableGridY, F = void 0 === R3 ? re.enableGridY : R3, D3 = a2.gridXValues, A = a2.gridYValues, X = a2.layers, Y = void 0 === X ? re.layers : X, G = a2.barComponent, z4 = void 0 === G ? re.barComponent : G, N = a2.enableLabel, j3 = void 0 === N ? re.enableLabel : N, K = a2.label, _2 = a2.labelSkipWidth, q2 = void 0 === _2 ? re.labelSkipWidth : _2, Q2 = a2.labelSkipHeight, U2 = void 0 === Q2 ? re.labelSkipHeight : Q2, ee2 = a2.labelTextColor, te2 = a2.labelPosition, ae2 = void 0 === te2 ? re.labelPosition : te2, ie2 = a2.labelOffset, ne2 = void 0 === ie2 ? re.labelOffset : ie2, le2 = a2.markers, oe2 = void 0 === le2 ? re.markers : le2, de2 = a2.colorBy, ue2 = a2.colors, se2 = a2.defs, he2 = void 0 === se2 ? re.defs : se2, fe2 = a2.fill, be2 = void 0 === fe2 ? re.fill : fe2, ve2 = a2.borderRadius, ge2 = void 0 === ve2 ? re.borderRadius : ve2, me2 = a2.borderWidth, pe2 = void 0 === me2 ? re.borderWidth : me2, xe2 = a2.borderColor, ye2 = a2.annotations, Se2 = void 0 === ye2 ? re.annotations : ye2, ke2 = a2.legendLabel, we2 = a2.tooltipLabel, Le2 = a2.valueFormat, Ce2 = a2.isInteractive, Ve2 = void 0 === Ce2 ? re.isInteractive : Ce2, Me2 = a2.tooltip, We2 = void 0 === Me2 ? re.tooltip : Me2, Be2 = a2.onClick, Te2 = a2.onMouseEnter, Pe2 = a2.onMouseLeave, Ee2 = a2.legends, He2 = a2.role, Re2 = void 0 === He2 ? re.role : He2, Fe2 = a2.ariaLabel, De2 = a2.ariaLabelledBy, Ae2 = a2.ariaDescribedBy, Xe2 = a2.isFocusable, Ye2 = void 0 === Xe2 ? re.isFocusable : Xe2, Ge = a2.barAriaLabel, ze = a2.barAriaLabelledBy, Ne = a2.barAriaDescribedBy, je = a2.barAriaHidden, Ke = a2.barAriaDisabled, _e = a2.initialHiddenIds, qe = a2.enableTotals, Je = void 0 === qe ? re.enableTotals : qe, Qe = a2.totalsOffset, Ue = void 0 === Qe ? re.totalsOffset : Qe, Ze = Yr(), $e = Ze.animate, et = Ze.config, tt = _t(o4, f, l), at = tt.outerWidth, it = tt.outerHeight, nt = tt.margin, rt = tt.innerWidth, lt = tt.innerHeight, ot = Oe({ indexBy: n2, label: K, tooltipLabel: we2, valueFormat: Le2, colors: ue2, colorBy: de2, borderColor: xe2, labelTextColor: ee2, groupMode: b2, layout: v2, reverse: g2, data: i2, keys: r2, minValue: m2, maxValue: S3, margin: nt, width: rt, height: lt, padding: C3, innerPadding: V2, valueScale: k4, indexScale: L3, enableLabel: j3, labelSkipWidth: q2, labelSkipHeight: U2, legends: Ee2, legendLabel: ke2, initialHiddenIds: _e, totalsOffset: Ue }), dt = ot.bars, ut = ot.barsWithValue, st = ot.xScale, ct = ot.yScale, ht = ot.getLabel, ft = ot.getTooltipLabel, bt = ot.getBorderColor, vt = ot.getLabelColor, gt = ot.shouldRenderBarLabel, mt = ot.toggleSerie, pt = ot.legendsWithData, xt2 = ot.barTotals, yt = ot.getColor, St = ce(v2, g2, ae2, ne2), kt = useTransition(ut, { keys: function(e2) {
    return e2.key;
  }, from: function(e2) {
    return J2({ borderColor: bt(e2), color: e2.color, height: 0, labelColor: vt(e2), labelOpacity: 0 }, St(e2.width, e2.height), { transform: "translate(" + e2.x + ", " + (e2.y + e2.height) + ")", width: e2.width }, "vertical" === v2 ? {} : { height: e2.height, transform: "translate(" + e2.x + ", " + e2.y + ")", width: 0 });
  }, enter: function(e2) {
    return J2({ borderColor: bt(e2), color: e2.color, height: e2.height, labelColor: vt(e2), labelOpacity: 1 }, St(e2.width, e2.height), { transform: "translate(" + e2.x + ", " + e2.y + ")", width: e2.width });
  }, update: function(e2) {
    return J2({ borderColor: bt(e2), color: e2.color, height: e2.height, labelColor: vt(e2), labelOpacity: 1 }, St(e2.width, e2.height), { transform: "translate(" + e2.x + ", " + e2.y + ")", width: e2.width });
  }, leave: function(e2) {
    return J2({ borderColor: bt(e2), color: e2.color, height: 0, labelColor: vt(e2), labelOpacity: 0 }, St(e2.width, e2.height), { labelY: 0, transform: "translate(" + e2.x + ", " + (e2.y + e2.height) + ")", width: e2.width }, "vertical" === v2 ? {} : J2({}, St(e2.width, e2.height), { labelX: 0, height: e2.height, transform: "translate(" + e2.x + ", " + e2.y + ")", width: 0 }));
  }, config: et, immediate: !$e, initial: $e ? void 0 : null }), wt = (0, import_react2.useMemo)(function() {
    return { borderRadius: ge2, borderWidth: pe2, enableLabel: j3, isInteractive: Ve2, labelSkipWidth: q2, labelSkipHeight: U2, onClick: Be2, onMouseEnter: Te2, onMouseLeave: Pe2, getTooltipLabel: ft, tooltip: We2, isFocusable: Ye2, ariaLabel: Ge, ariaLabelledBy: ze, ariaDescribedBy: Ne, ariaHidden: je, ariaDisabled: Ke };
  }, [ge2, pe2, j3, ft, Ve2, U2, q2, Be2, Te2, Pe2, We2, Ye2, Ge, ze, Ne, je, Ke]), Lt = yn(he2, dt, be2, { dataKey: "data", targetKey: "data.fill" }), Ct = { annotations: null, axes: null, bars: null, grid: null, legends: null, markers: null, totals: null };
  Y.includes("annotations") && (Ct.annotations = (0, import_jsx_runtime2.jsx)(Z, { bars: dt, annotations: Se2 }, "annotations")), Y.includes("axes") && (Ct.axes = (0, import_jsx_runtime2.jsx)(O, { xScale: st, yScale: ct, width: rt, height: lt, top: M2, right: W2, bottom: O3, left: P3 }, "axes")), Y.includes("bars") && (Ct.bars = (0, import_jsx_runtime2.jsx)(import_react2.Fragment, { children: kt(function(e2, t2) {
    return (0, import_react2.createElement)(z4, J2({}, wt, { bar: t2, style: e2, shouldRenderLabel: gt(t2), label: ht(t2.data) }));
  }) }, "bars")), Y.includes("grid") && (Ct.grid = (0, import_jsx_runtime2.jsx)(z2, { width: rt, height: lt, xScale: H2 ? st : null, yScale: F ? ct : null, xValues: D3, yValues: A }, "grid")), Y.includes("legends") && (Ct.legends = (0, import_jsx_runtime2.jsx)($, { width: rt, height: lt, legends: pt, toggleSerie: mt }, "legends")), Y.includes("markers") && (Ct.markers = (0, import_jsx_runtime2.jsx)(nn, { markers: oe2, width: rt, height: lt, xScale: st, yScale: ct }, "markers")), Y.includes("totals") && Je && (Ct.totals = (0, import_jsx_runtime2.jsx)(Ie, { data: xt2, springConfig: et, animate: $e, layout: v2 }, "totals"));
  var Vt = (0, import_react2.useMemo)(function() {
    return J2({}, wt, { margin: nt, width: o4, height: f, innerWidth: rt, innerHeight: lt, bars: dt, legendData: pt, enableLabel: j3, xScale: st, yScale: ct, tooltip: We2, getTooltipLabel: ft, onClick: Be2, onMouseEnter: Te2, onMouseLeave: Pe2, getColor: yt });
  }, [wt, nt, o4, f, rt, lt, dt, pt, j3, st, ct, We2, ft, Be2, Te2, Pe2, yt]);
  return (0, import_jsx_runtime2.jsx)($t, { width: at, height: it, margin: nt, defs: Lt, role: Re2, ariaLabel: Fe2, ariaLabelledBy: De2, ariaDescribedBy: Ae2, isFocusable: Ye2, children: Y.map(function(e2, t2) {
    var a3;
    return "function" == typeof e2 ? (0, import_jsx_runtime2.jsx)(import_react2.Fragment, { children: (0, import_react2.createElement)(e2, Vt) }, t2) : null != (a3 = null == Ct ? void 0 : Ct[e2]) ? a3 : null;
  }) });
};
var Ee = function(e2) {
  var t2 = e2.isInteractive, a2 = void 0 === t2 ? re.isInteractive : t2, i2 = e2.animate, n2 = void 0 === i2 ? re.animate : i2, r2 = e2.motionConfig, l = void 0 === r2 ? re.motionConfig : r2, d = e2.theme, u = e2.renderWrapper, s = Q(e2, Te);
  return (0, import_jsx_runtime2.jsx)(qr, { animate: n2, isInteractive: a2, motionConfig: l, renderWrapper: u, theme: d, children: (0, import_jsx_runtime2.jsx)(Pe, J2({ isInteractive: a2 }, s)) });
};
var He = ["isInteractive", "renderWrapper", "theme"];
var Re = function(e2, t2, a2, i2) {
  return e2.find(function(e3) {
    return pn(e3.x + t2.left, e3.y + t2.top, e3.width, e3.height, a2, i2);
  });
};
var Fe = function(e2) {
  var t2 = e2.data, n2 = e2.indexBy, r2 = e2.keys, o4 = e2.margin, d = e2.width, s = e2.height, c2 = e2.groupMode, h = e2.layout, b2 = e2.reverse, v2 = e2.minValue, g2 = e2.maxValue, m2 = e2.valueScale, p2 = e2.indexScale, k4 = e2.padding, w3 = e2.innerPadding, L3 = e2.axisTop, W2 = e2.axisRight, T4 = e2.axisBottom, P3 = void 0 === T4 ? le.axisBottom : T4, E2 = e2.axisLeft, R3 = void 0 === E2 ? le.axisLeft : E2, F = e2.enableGridX, X = void 0 === F ? le.enableGridX : F, Y = e2.enableGridY, N = void 0 === Y ? le.enableGridY : Y, j3 = e2.gridXValues, K = e2.gridYValues, _2 = e2.labelPosition, Q2 = void 0 === _2 ? le.labelPosition : _2, U2 = e2.labelOffset, Z2 = void 0 === U2 ? le.labelOffset : U2, $2 = e2.layers, ee2 = void 0 === $2 ? le.layers : $2, te2 = e2.renderBar, ae2 = void 0 === te2 ? function(e3, t3) {
    var a2 = t3.bar, i2 = a2.color, n3 = a2.height, r3 = a2.width, l = a2.x, o5 = a2.y, d2 = t3.borderColor, u = t3.borderRadius, s2 = t3.borderWidth, c3 = t3.label, h2 = t3.shouldRenderLabel, f = t3.labelStyle, b3 = t3.labelX, v3 = t3.labelY, g3 = t3.textAnchor;
    e3.fillStyle = i2, s2 > 0 && (e3.strokeStyle = d2, e3.lineWidth = s2), e3.beginPath(), o3(e3, l, o5, r3, n3, Math.min(u, n3)), e3.fill(), s2 > 0 && e3.stroke(), h2 && (e3.textBaseline = "middle", e3.textAlign = "middle" === g3 ? "center" : g3, o(e3, f, c3, l + b3, o5 + v3));
  } : te2, ie2 = e2.enableLabel, ne2 = void 0 === ie2 ? le.enableLabel : ie2, re2 = e2.label, oe2 = e2.labelSkipWidth, de2 = void 0 === oe2 ? le.labelSkipWidth : oe2, ue2 = e2.labelSkipHeight, se2 = void 0 === ue2 ? le.labelSkipHeight : ue2, he2 = e2.labelTextColor, fe2 = e2.colorBy, be2 = e2.colors, ve2 = e2.borderRadius, ge2 = void 0 === ve2 ? le.borderRadius : ve2, me2 = e2.borderWidth, pe2 = void 0 === me2 ? le.borderWidth : me2, xe2 = e2.borderColor, ye2 = e2.annotations, Se2 = void 0 === ye2 ? le.annotations : ye2, ke2 = e2.legendLabel, we2 = e2.tooltipLabel, Le2 = e2.valueFormat, Ce2 = e2.isInteractive, Ve2 = void 0 === Ce2 ? le.isInteractive : Ce2, Me2 = e2.tooltip, We2 = void 0 === Me2 ? le.tooltip : Me2, Be2 = e2.onClick, Ie2 = e2.onMouseEnter, Te2 = e2.onMouseLeave, Pe2 = e2.legends, Ee2 = e2.pixelRatio, He2 = void 0 === Ee2 ? le.pixelRatio : Ee2, Fe2 = e2.canvasRef, De2 = e2.enableTotals, Ae2 = void 0 === De2 ? le.enableTotals : De2, Xe2 = e2.totalsOffset, Ye2 = void 0 === Xe2 ? le.totalsOffset : Xe2, Ge = (0, import_react2.useRef)(null), ze = k(), Ne = _t(d, s, o4), je = Ne.margin, Ke = Ne.innerWidth, _e = Ne.innerHeight, qe = Ne.outerWidth, Je = Ne.outerHeight, Qe = Oe({ indexBy: n2, label: re2, tooltipLabel: we2, valueFormat: Le2, colors: be2, colorBy: fe2, borderColor: xe2, labelTextColor: he2, groupMode: c2, layout: h, reverse: b2, data: t2, keys: r2, minValue: v2, maxValue: g2, margin: je, width: Ke, height: _e, padding: k4, innerPadding: w3, valueScale: m2, indexScale: p2, enableLabel: ne2, labelSkipWidth: de2, labelSkipHeight: se2, legends: Pe2, legendLabel: ke2, totalsOffset: Ye2 }), Ue = Qe.bars, Ze = Qe.barsWithValue, $e = Qe.xScale, et = Qe.yScale, tt = Qe.getLabel, at = Qe.getTooltipLabel, it = Qe.getBorderColor, nt = Qe.getLabelColor, rt = Qe.shouldRenderBarLabel, lt = Qe.legendsWithData, ot = Qe.barTotals, dt = Qe.getColor, ut = z(), st = ut.showTooltipFromEvent, ct = ut.hideTooltip, ht = j2({ annotations: O2({ data: Ue, annotations: Se2, getPosition: function(e3) {
    return { x: e3.x, y: e3.y };
  }, getDimensions: function(e3) {
    var t3 = e3.width, a2 = e3.height;
    return { width: t3, height: a2, size: Math.max(t3, a2) };
  } }) }), ft = (0, import_react2.useMemo)(function() {
    return { borderRadius: ge2, borderWidth: pe2, isInteractive: Ve2, isFocusable: false, labelSkipWidth: de2, labelSkipHeight: se2, margin: je, width: d, height: s, innerWidth: Ke, innerHeight: _e, bars: Ue, legendData: lt, enableLabel: ne2, xScale: $e, yScale: et, tooltip: We2, getTooltipLabel: at, onClick: Be2, onMouseEnter: Ie2, onMouseLeave: Te2, getColor: dt };
  }, [ge2, pe2, Ve2, de2, se2, je, d, s, Ke, _e, Ue, lt, ne2, $e, et, We2, at, Be2, Ie2, Te2, dt]), bt = xt(Le2), vt = ce(h, b2, Q2, Z2);
  (0, import_react2.useEffect)(function() {
    var e3, t3 = null == (e3 = Ge.current) ? void 0 : e3.getContext("2d");
    Ge.current && t3 && (Ge.current.width = qe * He2, Ge.current.height = Je * He2, t3.scale(He2, He2), t3.fillStyle = ze.background, t3.fillRect(0, 0, qe, Je), t3.translate(je.left, je.top), ee2.forEach(function(e4) {
      "grid" === e4 ? "number" == typeof ze.grid.line.strokeWidth && ze.grid.line.strokeWidth > 0 && (t3.lineWidth = ze.grid.line.strokeWidth, t3.strokeStyle = ze.grid.line.stroke, X && R(t3, { width: Ke, height: _e, scale: $e, axis: "x", values: j3 }), N && R(t3, { width: Ke, height: _e, scale: et, axis: "y", values: K })) : "axes" === e4 ? D(t3, { xScale: $e, yScale: et, width: Ke, height: _e, top: L3, right: W2, bottom: P3, left: R3, theme: ze }) : "bars" === e4 ? (r(t3, ze.text), Ze.forEach(function(e5) {
        ae2(t3, J2({ bar: e5, borderColor: it(e5), borderRadius: ge2, borderWidth: pe2, label: tt(e5.data), shouldRenderLabel: rt(e5), labelStyle: J2({}, ze.labels.text, { fill: nt(e5) }) }, vt(e5.width, e5.height)));
      })) : "legends" === e4 ? lt.forEach(function(e5) {
        var a2 = e5[0], i2 = e5[1];
        j(t3, J2({}, a2, { data: i2, containerWidth: Ke, containerHeight: _e, theme: ze }));
      }) : "annotations" === e4 ? J(t3, { annotations: ht, theme: ze }) : "totals" === e4 && Ae2 ? function(e5, t4, a2, i2) {
        void 0 === i2 && (i2 = le.layout), r(e5, a2.labels.text), e5.textBaseline = "vertical" === i2 ? "alphabetic" : "middle", e5.textAlign = "vertical" === i2 ? "center" : "start", t4.forEach(function(t5) {
          o(e5, a2.labels.text, t5.formattedValue, t5.x, t5.y);
        });
      }(t3, ot, ze, h) : "function" == typeof e4 && e4(t3, ft);
    }), t3.save());
  }, [P3, R3, W2, L3, Ze, ge2, pe2, ht, X, N, it, tt, nt, j3, K, c2, s, _e, Ke, ft, ee2, h, lt, je.left, je.top, Je, qe, He2, ae2, $e, et, b2, rt, ze, d, ot, Ae2, bt, vt]);
  var gt = (0, import_react2.useCallback)(function(e3) {
    if (Ue && Ge.current) {
      var t3 = gn(Ge.current, e3), a2 = t3[0], i2 = t3[1], n3 = Re(Ue, je, a2, i2);
      void 0 !== n3 ? (st((0, import_react2.createElement)(We2, J2({}, n3.data, { color: n3.color, label: n3.label, value: Number(n3.data.value) })), e3), "mouseenter" === e3.type && (null == Ie2 || Ie2(n3.data, e3))) : ct();
    }
  }, [ct, je, Ie2, Ue, st, We2]), mt = (0, import_react2.useCallback)(function(e3) {
    if (Ue && Ge.current) {
      ct();
      var t3 = gn(Ge.current, e3), a2 = t3[0], i2 = t3[1], n3 = Re(Ue, je, a2, i2);
      n3 && (null == Te2 || Te2(n3.data, e3));
    }
  }, [ct, je, Te2, Ue]), pt = (0, import_react2.useCallback)(function(e3) {
    if (Ue && Ge.current) {
      var t3 = gn(Ge.current, e3), a2 = t3[0], i2 = t3[1], n3 = Re(Ue, je, a2, i2);
      void 0 !== n3 && (null == Be2 || Be2(J2({}, n3.data, { color: n3.color }), e3));
    }
  }, [je, Be2, Ue]);
  return (0, import_jsx_runtime2.jsx)("canvas", { ref: function(e3) {
    Ge.current = e3, Fe2 && "current" in Fe2 && (Fe2.current = e3);
  }, width: qe * He2, height: Je * He2, style: { width: qe, height: Je, cursor: Ve2 ? "auto" : "normal" }, onMouseEnter: Ve2 ? gt : void 0, onMouseMove: Ve2 ? gt : void 0, onMouseLeave: Ve2 ? mt : void 0, onClick: Ve2 ? pt : void 0 });
};
var De = (0, import_react2.forwardRef)(function(e2, t2) {
  var a2 = e2.isInteractive, i2 = e2.renderWrapper, n2 = e2.theme, r2 = Q(e2, He);
  return (0, import_jsx_runtime2.jsx)(qr, { isInteractive: a2, renderWrapper: i2, theme: n2, animate: false, children: (0, import_jsx_runtime2.jsx)(Fe, J2({}, r2, { canvasRef: t2 })) });
});
var Ae = function(e2) {
  return (0, import_jsx_runtime2.jsx)(Ot, { children: function(t2) {
    var a2 = t2.width, i2 = t2.height;
    return (0, import_jsx_runtime2.jsx)(Ee, J2({ width: a2, height: i2 }, e2));
  } });
};
var Xe = (0, import_react2.forwardRef)(function(e2, t2) {
  return (0, import_jsx_runtime2.jsx)(Ot, { children: function(a2) {
    var i2 = a2.width, n2 = a2.height;
    return (0, import_jsx_runtime2.jsx)(De, J2({ width: i2, height: n2 }, e2, { ref: t2 }));
  } });
});
export {
  Ee as Bar,
  De as BarCanvas,
  te as BarItem,
  ie as BarTooltip,
  Ie as BarTotals,
  Ae as ResponsiveBar,
  Xe as ResponsiveBarCanvas,
  le as canvasDefaultProps,
  ne as defaultProps,
  re as svgDefaultProps
};
//# sourceMappingURL=@nivo_bar.js.map
