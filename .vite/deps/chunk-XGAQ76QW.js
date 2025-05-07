import {
  Et,
  Wt,
  Yr,
  animated,
  band,
  c,
  k,
  linear,
  log,
  number_default,
  o,
  point,
  r,
  require_Set,
  require_SetCache,
  require_Stack,
  require_arrayIncludes,
  require_arrayIncludesWith,
  require_arrayMap,
  require_baseFlatten,
  require_baseFor,
  require_baseGet,
  require_baseGetTag,
  require_baseIsEqual,
  require_baseRest,
  require_baseUnary,
  require_cacheHas,
  require_get,
  require_hasIn,
  require_identity,
  require_isArray,
  require_isArrayLike,
  require_isIterateeCall,
  require_isKey,
  require_isObject,
  require_isObjectLike,
  require_isSymbol,
  require_keys,
  require_last,
  require_nodeUtil,
  require_setToArray,
  require_toKey,
  round_default,
  symlog,
  time,
  useSpring,
  useTransition,
  utcTime
} from "./chunk-EFKILSXK.js";
import {
  require_jsx_runtime
} from "./chunk-X3VLT5EQ.js";
import {
  require_react
} from "./chunk-2CLD7BNN.js";
import {
  __commonJS,
  __toESM
} from "./chunk-WOOG5QLI.js";

// node_modules/lodash/_baseIsMatch.js
var require_baseIsMatch = __commonJS({
  "node_modules/lodash/_baseIsMatch.js"(exports, module) {
    var Stack = require_Stack();
    var baseIsEqual = require_baseIsEqual();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseIsMatch(object, source, matchData, customizer) {
      var index2 = matchData.length, length = index2, noCustomizer = !customizer;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index2--) {
        var data = matchData[index2];
        if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
          return false;
        }
      }
      while (++index2 < length) {
        data = matchData[index2];
        var key = data[0], objValue = object[key], srcValue = data[1];
        if (noCustomizer && data[2]) {
          if (objValue === void 0 && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack();
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
            return false;
          }
        }
      }
      return true;
    }
    module.exports = baseIsMatch;
  }
});

// node_modules/lodash/_isStrictComparable.js
var require_isStrictComparable = __commonJS({
  "node_modules/lodash/_isStrictComparable.js"(exports, module) {
    var isObject = require_isObject();
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }
    module.exports = isStrictComparable;
  }
});

// node_modules/lodash/_getMatchData.js
var require_getMatchData = __commonJS({
  "node_modules/lodash/_getMatchData.js"(exports, module) {
    var isStrictComparable = require_isStrictComparable();
    var keys = require_keys();
    function getMatchData(object) {
      var result = keys(object), length = result.length;
      while (length--) {
        var key = result[length], value = object[key];
        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }
    module.exports = getMatchData;
  }
});

// node_modules/lodash/_matchesStrictComparable.js
var require_matchesStrictComparable = __commonJS({
  "node_modules/lodash/_matchesStrictComparable.js"(exports, module) {
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
      };
    }
    module.exports = matchesStrictComparable;
  }
});

// node_modules/lodash/_baseMatches.js
var require_baseMatches = __commonJS({
  "node_modules/lodash/_baseMatches.js"(exports, module) {
    var baseIsMatch = require_baseIsMatch();
    var getMatchData = require_getMatchData();
    var matchesStrictComparable = require_matchesStrictComparable();
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }
    module.exports = baseMatches;
  }
});

// node_modules/lodash/_baseMatchesProperty.js
var require_baseMatchesProperty = __commonJS({
  "node_modules/lodash/_baseMatchesProperty.js"(exports, module) {
    var baseIsEqual = require_baseIsEqual();
    var get = require_get();
    var hasIn = require_hasIn();
    var isKey = require_isKey();
    var isStrictComparable = require_isStrictComparable();
    var matchesStrictComparable = require_matchesStrictComparable();
    var toKey = require_toKey();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }
    module.exports = baseMatchesProperty;
  }
});

// node_modules/lodash/_baseProperty.js
var require_baseProperty = __commonJS({
  "node_modules/lodash/_baseProperty.js"(exports, module) {
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    module.exports = baseProperty;
  }
});

// node_modules/lodash/_basePropertyDeep.js
var require_basePropertyDeep = __commonJS({
  "node_modules/lodash/_basePropertyDeep.js"(exports, module) {
    var baseGet = require_baseGet();
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }
    module.exports = basePropertyDeep;
  }
});

// node_modules/lodash/property.js
var require_property = __commonJS({
  "node_modules/lodash/property.js"(exports, module) {
    var baseProperty = require_baseProperty();
    var basePropertyDeep = require_basePropertyDeep();
    var isKey = require_isKey();
    var toKey = require_toKey();
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }
    module.exports = property;
  }
});

// node_modules/lodash/_baseIteratee.js
var require_baseIteratee = __commonJS({
  "node_modules/lodash/_baseIteratee.js"(exports, module) {
    var baseMatches = require_baseMatches();
    var baseMatchesProperty = require_baseMatchesProperty();
    var identity = require_identity();
    var isArray = require_isArray();
    var property = require_property();
    function baseIteratee(value) {
      if (typeof value == "function") {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == "object") {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
      }
      return property(value);
    }
    module.exports = baseIteratee;
  }
});

// node_modules/lodash/noop.js
var require_noop = __commonJS({
  "node_modules/lodash/noop.js"(exports, module) {
    function noop() {
    }
    module.exports = noop;
  }
});

// node_modules/lodash/_createSet.js
var require_createSet = __commonJS({
  "node_modules/lodash/_createSet.js"(exports, module) {
    var Set2 = require_Set();
    var noop = require_noop();
    var setToArray = require_setToArray();
    var INFINITY = 1 / 0;
    var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set2(values);
    };
    module.exports = createSet;
  }
});

// node_modules/lodash/_baseUniq.js
var require_baseUniq = __commonJS({
  "node_modules/lodash/_baseUniq.js"(exports, module) {
    var SetCache = require_SetCache();
    var arrayIncludes = require_arrayIncludes();
    var arrayIncludesWith = require_arrayIncludesWith();
    var cacheHas = require_cacheHas();
    var createSet = require_createSet();
    var setToArray = require_setToArray();
    var LARGE_ARRAY_SIZE = 200;
    function baseUniq(array2, iteratee, comparator) {
      var index2 = -1, includes = arrayIncludes, length = array2.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set2 = iteratee ? null : createSet(array2);
        if (set2) {
          return setToArray(set2);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index2 < length) {
          var value = array2[index2], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }
    module.exports = baseUniq;
  }
});

// node_modules/lodash/uniqBy.js
var require_uniqBy = __commonJS({
  "node_modules/lodash/uniqBy.js"(exports, module) {
    var baseIteratee = require_baseIteratee();
    var baseUniq = require_baseUniq();
    function uniqBy(array2, iteratee) {
      return array2 && array2.length ? baseUniq(array2, baseIteratee(iteratee, 2)) : [];
    }
    module.exports = uniqBy;
  }
});

// node_modules/lodash/uniq.js
var require_uniq = __commonJS({
  "node_modules/lodash/uniq.js"(exports, module) {
    var baseUniq = require_baseUniq();
    function uniq(array2) {
      return array2 && array2.length ? baseUniq(array2) : [];
    }
    module.exports = uniq;
  }
});

// node_modules/lodash/_baseForOwn.js
var require_baseForOwn = __commonJS({
  "node_modules/lodash/_baseForOwn.js"(exports, module) {
    var baseFor = require_baseFor();
    var keys = require_keys();
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }
    module.exports = baseForOwn;
  }
});

// node_modules/lodash/_createBaseEach.js
var require_createBaseEach = __commonJS({
  "node_modules/lodash/_createBaseEach.js"(exports, module) {
    var isArrayLike = require_isArrayLike();
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length, index2 = fromRight ? length : -1, iterable = Object(collection);
        while (fromRight ? index2-- : ++index2 < length) {
          if (iteratee(iterable[index2], index2, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }
    module.exports = createBaseEach;
  }
});

// node_modules/lodash/_baseEach.js
var require_baseEach = __commonJS({
  "node_modules/lodash/_baseEach.js"(exports, module) {
    var baseForOwn = require_baseForOwn();
    var createBaseEach = require_createBaseEach();
    var baseEach = createBaseEach(baseForOwn);
    module.exports = baseEach;
  }
});

// node_modules/lodash/_baseMap.js
var require_baseMap = __commonJS({
  "node_modules/lodash/_baseMap.js"(exports, module) {
    var baseEach = require_baseEach();
    var isArrayLike = require_isArrayLike();
    function baseMap(collection, iteratee) {
      var index2 = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
      baseEach(collection, function(value, key, collection2) {
        result[++index2] = iteratee(value, key, collection2);
      });
      return result;
    }
    module.exports = baseMap;
  }
});

// node_modules/lodash/_baseSortBy.js
var require_baseSortBy = __commonJS({
  "node_modules/lodash/_baseSortBy.js"(exports, module) {
    function baseSortBy(array2, comparer) {
      var length = array2.length;
      array2.sort(comparer);
      while (length--) {
        array2[length] = array2[length].value;
      }
      return array2;
    }
    module.exports = baseSortBy;
  }
});

// node_modules/lodash/_compareAscending.js
var require_compareAscending = __commonJS({
  "node_modules/lodash/_compareAscending.js"(exports, module) {
    var isSymbol = require_isSymbol();
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
        var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
        if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
          return 1;
        }
        if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }
    module.exports = compareAscending;
  }
});

// node_modules/lodash/_compareMultiple.js
var require_compareMultiple = __commonJS({
  "node_modules/lodash/_compareMultiple.js"(exports, module) {
    var compareAscending = require_compareAscending();
    function compareMultiple(object, other, orders) {
      var index2 = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
      while (++index2 < length) {
        var result = compareAscending(objCriteria[index2], othCriteria[index2]);
        if (result) {
          if (index2 >= ordersLength) {
            return result;
          }
          var order = orders[index2];
          return result * (order == "desc" ? -1 : 1);
        }
      }
      return object.index - other.index;
    }
    module.exports = compareMultiple;
  }
});

// node_modules/lodash/_baseOrderBy.js
var require_baseOrderBy = __commonJS({
  "node_modules/lodash/_baseOrderBy.js"(exports, module) {
    var arrayMap = require_arrayMap();
    var baseGet = require_baseGet();
    var baseIteratee = require_baseIteratee();
    var baseMap = require_baseMap();
    var baseSortBy = require_baseSortBy();
    var baseUnary = require_baseUnary();
    var compareMultiple = require_compareMultiple();
    var identity = require_identity();
    var isArray = require_isArray();
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            };
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }
      var index2 = -1;
      iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
      var result = baseMap(collection, function(value, key, collection2) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { "criteria": criteria, "index": ++index2, "value": value };
      });
      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }
    module.exports = baseOrderBy;
  }
});

// node_modules/lodash/sortBy.js
var require_sortBy = __commonJS({
  "node_modules/lodash/sortBy.js"(exports, module) {
    var baseFlatten = require_baseFlatten();
    var baseOrderBy = require_baseOrderBy();
    var baseRest = require_baseRest();
    var isIterateeCall = require_isIterateeCall();
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });
    module.exports = sortBy;
  }
});

// node_modules/lodash/_baseIsDate.js
var require_baseIsDate = __commonJS({
  "node_modules/lodash/_baseIsDate.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var dateTag = "[object Date]";
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }
    module.exports = baseIsDate;
  }
});

// node_modules/lodash/isDate.js
var require_isDate = __commonJS({
  "node_modules/lodash/isDate.js"(exports, module) {
    var baseIsDate = require_baseIsDate();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsDate = nodeUtil && nodeUtil.isDate;
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
    module.exports = isDate;
  }
});

// node_modules/@nivo/scales/dist/nivo-scales.mjs
var import_uniq = __toESM(require_uniq(), 1);
var import_uniqBy = __toESM(require_uniqBy(), 1);
var import_sortBy = __toESM(require_sortBy(), 1);
var import_last = __toESM(require_last(), 1);
var import_isDate = __toESM(require_isDate(), 1);

// node_modules/@nivo/scales/node_modules/d3-time/src/interval.js
var t0 = /* @__PURE__ */ new Date();
var t1 = /* @__PURE__ */ new Date();
function newInterval(floori, offseti, count2, field) {
  function interval(date) {
    return floori(date = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+date)), date;
  }
  interval.floor = function(date) {
    return floori(date = /* @__PURE__ */ new Date(+date)), date;
  };
  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };
  interval.round = function(date) {
    var d0 = interval(date), d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };
  interval.offset = function(date, step) {
    return offseti(date = /* @__PURE__ */ new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };
  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range;
    do
      range.push(previous = /* @__PURE__ */ new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };
  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {
          }
        }
        else while (--step >= 0) {
          while (offseti(date, 1), !test(date)) {
          }
        }
      }
    });
  };
  if (count2) {
    interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count2(t0, t1));
    };
    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function(d) {
        return field(d) % step === 0;
      } : function(d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }
  return interval;
}

// node_modules/@nivo/scales/node_modules/d3-time/src/millisecond.js
var millisecond = newInterval(function() {
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});
millisecond.every = function(k3) {
  k3 = Math.floor(k3);
  if (!isFinite(k3) || !(k3 > 0)) return null;
  if (!(k3 > 1)) return millisecond;
  return newInterval(function(date) {
    date.setTime(Math.floor(date / k3) * k3);
  }, function(date, step) {
    date.setTime(+date + step * k3);
  }, function(start, end) {
    return (end - start) / k3;
  });
};
var millisecond_default = millisecond;
var milliseconds = millisecond.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/duration.js
var durationSecond = 1e3;
var durationMinute = 6e4;
var durationHour = 36e5;
var durationDay = 864e5;
var durationWeek = 6048e5;

// node_modules/@nivo/scales/node_modules/d3-time/src/second.js
var second = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds());
}, function(date, step) {
  date.setTime(+date + step * durationSecond);
}, function(start, end) {
  return (end - start) / durationSecond;
}, function(date) {
  return date.getUTCSeconds();
});
var second_default = second;
var seconds = second.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/minute.js
var minute = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getMinutes();
});
var minute_default = minute;
var minutes = minute.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/hour.js
var hour = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getHours();
});
var hour_default = hour;
var hours = hour.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/day.js
var day = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date) {
  return date.getDate() - 1;
});
var day_default = day;
var days = day.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/week.js
function weekday(i2) {
  return newInterval(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i2) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}
var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);
var sundays = sunday.range;
var mondays = monday.range;
var tuesdays = tuesday.range;
var wednesdays = wednesday.range;
var thursdays = thursday.range;
var fridays = friday.range;
var saturdays = saturday.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/month.js
var month = newInterval(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});
var month_default = month;
var months = month.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/year.js
var year = newInterval(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});
year.every = function(k3) {
  return !isFinite(k3 = Math.floor(k3)) || !(k3 > 0) ? null : newInterval(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k3) * k3);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k3);
  });
};
var year_default = year;
var years = year.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/utcMinute.js
var utcMinute = newInterval(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getUTCMinutes();
});
var utcMinute_default = utcMinute;
var utcMinutes = utcMinute.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/utcHour.js
var utcHour = newInterval(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getUTCHours();
});
var utcHour_default = utcHour;
var utcHours = utcHour.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/utcDay.js
var utcDay = newInterval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / durationDay;
}, function(date) {
  return date.getUTCDate() - 1;
});
var utcDay_default = utcDay;
var utcDays = utcDay.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/utcWeek.js
function utcWeekday(i2) {
  return newInterval(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i2) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek;
  });
}
var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);
var utcSundays = utcSunday.range;
var utcMondays = utcMonday.range;
var utcTuesdays = utcTuesday.range;
var utcWednesdays = utcWednesday.range;
var utcThursdays = utcThursday.range;
var utcFridays = utcFriday.range;
var utcSaturdays = utcSaturday.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/utcMonth.js
var utcMonth = newInterval(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});
var utcMonth_default = utcMonth;
var utcMonths = utcMonth.range;

// node_modules/@nivo/scales/node_modules/d3-time/src/utcYear.js
var utcYear = newInterval(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});
utcYear.every = function(k3) {
  return !isFinite(k3 = Math.floor(k3)) || !(k3 > 0) ? null : newInterval(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k3) * k3);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k3);
  });
};
var utcYear_default = utcYear;
var utcYears = utcYear.range;

// node_modules/@nivo/scales/node_modules/d3-time-format/src/locale.js
function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}
function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}
function newDate(y, m, d) {
  return { y, m, d, H: 0, M: 0, S: 0, L: 0 };
}
function formatLocale(locale4) {
  var locale_dateTime = locale4.dateTime, locale_date = locale4.date, locale_time = locale4.time, locale_periods = locale4.periods, locale_weekdays = locale4.days, locale_shortWeekdays = locale4.shortDays, locale_months = locale4.months, locale_shortMonths = locale4.shortMonths;
  var periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths);
  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "g": formatYearISO,
    "G": formatFullYearISO,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "q": formatQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };
  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "g": formatUTCYearISO,
    "G": formatUTCFullYearISO,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "q": formatUTCQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };
  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "g": parseYear,
    "G": parseFullYear,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "q": parseQuarter,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);
  function newFormat(specifier, formats2) {
    return function(date) {
      var string = [], i2 = -1, j = 0, n3 = specifier.length, c2, pad3, format2;
      if (!(date instanceof Date)) date = /* @__PURE__ */ new Date(+date);
      while (++i2 < n3) {
        if (specifier.charCodeAt(i2) === 37) {
          string.push(specifier.slice(j, i2));
          if ((pad3 = pads[c2 = specifier.charAt(++i2)]) != null) c2 = specifier.charAt(++i2);
          else pad3 = c2 === "e" ? " " : "0";
          if (format2 = formats2[c2]) c2 = format2(date, pad3);
          string.push(c2);
          j = i2 + 1;
        }
      }
      string.push(specifier.slice(j, i2));
      return string.join("");
    };
  }
  function newParse(specifier, Z2) {
    return function(string) {
      var d = newDate(1900, void 0, 1), i2 = parseSpecifier(d, specifier, string += "", 0), week, day3;
      if (i2 != string.length) return null;
      if ("Q" in d) return new Date(d.Q);
      if ("s" in d) return new Date(d.s * 1e3 + ("L" in d ? d.L : 0));
      if (Z2 && !("Z" in d)) d.Z = 0;
      if ("p" in d) d.H = d.H % 12 + d.p * 12;
      if (d.m === void 0) d.m = "q" in d ? d.q : 0;
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate(newDate(d.y, 0, 1)), day3 = week.getUTCDay();
          week = day3 > 4 || day3 === 0 ? utcMonday.ceil(week) : utcMonday(week);
          week = utcDay_default.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = localDate(newDate(d.y, 0, 1)), day3 = week.getDay();
          week = day3 > 4 || day3 === 0 ? monday.ceil(week) : monday(week);
          week = day_default.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day3 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day3 + 5) % 7 : d.w + d.U * 7 - (day3 + 6) % 7;
      }
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }
      return localDate(d);
    };
  }
  function parseSpecifier(d, specifier, string, j) {
    var i2 = 0, n3 = specifier.length, m = string.length, c2, parse;
    while (i2 < n3) {
      if (j >= m) return -1;
      c2 = specifier.charCodeAt(i2++);
      if (c2 === 37) {
        c2 = specifier.charAt(i2++);
        parse = parses[c2 in pads ? specifier.charAt(i2++) : c2];
        if (!parse || (j = parse(d, string, j)) < 0) return -1;
      } else if (c2 != string.charCodeAt(j++)) {
        return -1;
      }
    }
    return j;
  }
  function parsePeriod(d, string, i2) {
    var n3 = periodRe.exec(string.slice(i2));
    return n3 ? (d.p = periodLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseShortWeekday(d, string, i2) {
    var n3 = shortWeekdayRe.exec(string.slice(i2));
    return n3 ? (d.w = shortWeekdayLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseWeekday(d, string, i2) {
    var n3 = weekdayRe.exec(string.slice(i2));
    return n3 ? (d.w = weekdayLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseShortMonth(d, string, i2) {
    var n3 = shortMonthRe.exec(string.slice(i2));
    return n3 ? (d.m = shortMonthLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseMonth(d, string, i2) {
    var n3 = monthRe.exec(string.slice(i2));
    return n3 ? (d.m = monthLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseLocaleDateTime(d, string, i2) {
    return parseSpecifier(d, locale_dateTime, string, i2);
  }
  function parseLocaleDate(d, string, i2) {
    return parseSpecifier(d, locale_date, string, i2);
  }
  function parseLocaleTime(d, string, i2) {
    return parseSpecifier(d, locale_time, string, i2);
  }
  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }
  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }
  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }
  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }
  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }
  function formatQuarter(d) {
    return 1 + ~~(d.getMonth() / 3);
  }
  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }
  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }
  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }
  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }
  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }
  function formatUTCQuarter(d) {
    return 1 + ~~(d.getUTCMonth() / 3);
  }
  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() {
        return specifier;
      };
      return f;
    },
    parse: function(specifier) {
      var p2 = newParse(specifier += "", false);
      p2.toString = function() {
        return specifier;
      };
      return p2;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() {
        return specifier;
      };
      return f;
    },
    utcParse: function(specifier) {
      var p2 = newParse(specifier += "", true);
      p2.toString = function() {
        return specifier;
      };
      return p2;
    }
  };
}
var pads = { "-": "", "_": " ", "0": "0" };
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\^$*+?|[\]().{}]/g;
function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}
function requote(s) {
  return s.replace(requoteRe, "\\$&");
}
function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}
function formatLookup(names) {
  return new Map(names.map((name, i2) => [name.toLowerCase(), i2]));
}
function parseWeekdayNumberSunday(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 1));
  return n3 ? (d.w = +n3[0], i2 + n3[0].length) : -1;
}
function parseWeekdayNumberMonday(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 1));
  return n3 ? (d.u = +n3[0], i2 + n3[0].length) : -1;
}
function parseWeekNumberSunday(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.U = +n3[0], i2 + n3[0].length) : -1;
}
function parseWeekNumberISO(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.V = +n3[0], i2 + n3[0].length) : -1;
}
function parseWeekNumberMonday(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.W = +n3[0], i2 + n3[0].length) : -1;
}
function parseFullYear(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 4));
  return n3 ? (d.y = +n3[0], i2 + n3[0].length) : -1;
}
function parseYear(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.y = +n3[0] + (+n3[0] > 68 ? 1900 : 2e3), i2 + n3[0].length) : -1;
}
function parseZone(d, string, i2) {
  var n3 = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i2, i2 + 6));
  return n3 ? (d.Z = n3[1] ? 0 : -(n3[2] + (n3[3] || "00")), i2 + n3[0].length) : -1;
}
function parseQuarter(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 1));
  return n3 ? (d.q = n3[0] * 3 - 3, i2 + n3[0].length) : -1;
}
function parseMonthNumber(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.m = n3[0] - 1, i2 + n3[0].length) : -1;
}
function parseDayOfMonth(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.d = +n3[0], i2 + n3[0].length) : -1;
}
function parseDayOfYear(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 3));
  return n3 ? (d.m = 0, d.d = +n3[0], i2 + n3[0].length) : -1;
}
function parseHour24(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.H = +n3[0], i2 + n3[0].length) : -1;
}
function parseMinutes(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.M = +n3[0], i2 + n3[0].length) : -1;
}
function parseSeconds(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.S = +n3[0], i2 + n3[0].length) : -1;
}
function parseMilliseconds(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 3));
  return n3 ? (d.L = +n3[0], i2 + n3[0].length) : -1;
}
function parseMicroseconds(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2, i2 + 6));
  return n3 ? (d.L = Math.floor(n3[0] / 1e3), i2 + n3[0].length) : -1;
}
function parseLiteralPercent(d, string, i2) {
  var n3 = percentRe.exec(string.slice(i2, i2 + 1));
  return n3 ? i2 + n3[0].length : -1;
}
function parseUnixTimestamp(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2));
  return n3 ? (d.Q = +n3[0], i2 + n3[0].length) : -1;
}
function parseUnixTimestampSeconds(d, string, i2) {
  var n3 = numberRe.exec(string.slice(i2));
  return n3 ? (d.s = +n3[0], i2 + n3[0].length) : -1;
}
function formatDayOfMonth(d, p2) {
  return pad(d.getDate(), p2, 2);
}
function formatHour24(d, p2) {
  return pad(d.getHours(), p2, 2);
}
function formatHour12(d, p2) {
  return pad(d.getHours() % 12 || 12, p2, 2);
}
function formatDayOfYear(d, p2) {
  return pad(1 + day_default.count(year_default(d), d), p2, 3);
}
function formatMilliseconds(d, p2) {
  return pad(d.getMilliseconds(), p2, 3);
}
function formatMicroseconds(d, p2) {
  return formatMilliseconds(d, p2) + "000";
}
function formatMonthNumber(d, p2) {
  return pad(d.getMonth() + 1, p2, 2);
}
function formatMinutes(d, p2) {
  return pad(d.getMinutes(), p2, 2);
}
function formatSeconds(d, p2) {
  return pad(d.getSeconds(), p2, 2);
}
function formatWeekdayNumberMonday(d) {
  var day3 = d.getDay();
  return day3 === 0 ? 7 : day3;
}
function formatWeekNumberSunday(d, p2) {
  return pad(sunday.count(year_default(d) - 1, d), p2, 2);
}
function dISO(d) {
  var day3 = d.getDay();
  return day3 >= 4 || day3 === 0 ? thursday(d) : thursday.ceil(d);
}
function formatWeekNumberISO(d, p2) {
  d = dISO(d);
  return pad(thursday.count(year_default(d), d) + (year_default(d).getDay() === 4), p2, 2);
}
function formatWeekdayNumberSunday(d) {
  return d.getDay();
}
function formatWeekNumberMonday(d, p2) {
  return pad(monday.count(year_default(d) - 1, d), p2, 2);
}
function formatYear(d, p2) {
  return pad(d.getFullYear() % 100, p2, 2);
}
function formatYearISO(d, p2) {
  d = dISO(d);
  return pad(d.getFullYear() % 100, p2, 2);
}
function formatFullYear(d, p2) {
  return pad(d.getFullYear() % 1e4, p2, 4);
}
function formatFullYearISO(d, p2) {
  var day3 = d.getDay();
  d = day3 >= 4 || day3 === 0 ? thursday(d) : thursday.ceil(d);
  return pad(d.getFullYear() % 1e4, p2, 4);
}
function formatZone(d) {
  var z2 = d.getTimezoneOffset();
  return (z2 > 0 ? "-" : (z2 *= -1, "+")) + pad(z2 / 60 | 0, "0", 2) + pad(z2 % 60, "0", 2);
}
function formatUTCDayOfMonth(d, p2) {
  return pad(d.getUTCDate(), p2, 2);
}
function formatUTCHour24(d, p2) {
  return pad(d.getUTCHours(), p2, 2);
}
function formatUTCHour12(d, p2) {
  return pad(d.getUTCHours() % 12 || 12, p2, 2);
}
function formatUTCDayOfYear(d, p2) {
  return pad(1 + utcDay_default.count(utcYear_default(d), d), p2, 3);
}
function formatUTCMilliseconds(d, p2) {
  return pad(d.getUTCMilliseconds(), p2, 3);
}
function formatUTCMicroseconds(d, p2) {
  return formatUTCMilliseconds(d, p2) + "000";
}
function formatUTCMonthNumber(d, p2) {
  return pad(d.getUTCMonth() + 1, p2, 2);
}
function formatUTCMinutes(d, p2) {
  return pad(d.getUTCMinutes(), p2, 2);
}
function formatUTCSeconds(d, p2) {
  return pad(d.getUTCSeconds(), p2, 2);
}
function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}
function formatUTCWeekNumberSunday(d, p2) {
  return pad(utcSunday.count(utcYear_default(d) - 1, d), p2, 2);
}
function UTCdISO(d) {
  var day3 = d.getUTCDay();
  return day3 >= 4 || day3 === 0 ? utcThursday(d) : utcThursday.ceil(d);
}
function formatUTCWeekNumberISO(d, p2) {
  d = UTCdISO(d);
  return pad(utcThursday.count(utcYear_default(d), d) + (utcYear_default(d).getUTCDay() === 4), p2, 2);
}
function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}
function formatUTCWeekNumberMonday(d, p2) {
  return pad(utcMonday.count(utcYear_default(d) - 1, d), p2, 2);
}
function formatUTCYear(d, p2) {
  return pad(d.getUTCFullYear() % 100, p2, 2);
}
function formatUTCYearISO(d, p2) {
  d = UTCdISO(d);
  return pad(d.getUTCFullYear() % 100, p2, 2);
}
function formatUTCFullYear(d, p2) {
  return pad(d.getUTCFullYear() % 1e4, p2, 4);
}
function formatUTCFullYearISO(d, p2) {
  var day3 = d.getUTCDay();
  d = day3 >= 4 || day3 === 0 ? utcThursday(d) : utcThursday.ceil(d);
  return pad(d.getUTCFullYear() % 1e4, p2, 4);
}
function formatUTCZone() {
  return "+0000";
}
function formatLiteralPercent() {
  return "%";
}
function formatUnixTimestamp(d) {
  return +d;
}
function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1e3);
}

// node_modules/@nivo/scales/node_modules/d3-time-format/src/defaultLocale.js
var locale;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;
defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function defaultLocale(definition) {
  locale = formatLocale(definition);
  timeFormat = locale.format;
  timeParse = locale.parse;
  utcFormat = locale.utcFormat;
  utcParse = locale.utcParse;
  return locale;
}

// node_modules/@nivo/scales/node_modules/d3-time-format/src/isoFormat.js
var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
function formatIsoNative(date) {
  return date.toISOString();
}
var formatIso = Date.prototype.toISOString ? formatIsoNative : utcFormat(isoSpecifier);

// node_modules/@nivo/scales/node_modules/d3-time-format/src/isoParse.js
function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}
var parseIso = +/* @__PURE__ */ new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : utcParse(isoSpecifier);

// node_modules/@nivo/scales/dist/nivo-scales.mjs
function J() {
  return J = Object.assign ? Object.assign.bind() : function(n3) {
    for (var t3 = 1; t3 < arguments.length; t3++) {
      var r4 = arguments[t3];
      for (var e4 in r4) ({}).hasOwnProperty.call(r4, e4) && (n3[e4] = r4[e4]);
    }
    return n3;
  }, J.apply(null, arguments);
}
var L = [function(n3) {
  return n3.setMilliseconds(0);
}, function(n3) {
  return n3.setSeconds(0);
}, function(n3) {
  return n3.setMinutes(0);
}, function(n3) {
  return n3.setHours(0);
}, function(n3) {
  return n3.setDate(1);
}, function(n3) {
  return n3.setMonth(0);
}];
var Q = { millisecond: [], second: L.slice(0, 1), minute: L.slice(0, 2), hour: L.slice(0, 3), day: L.slice(0, 4), month: L.slice(0, 5), year: L.slice(0, 6) };
var W = function(n3) {
  return function(t3) {
    return Q[n3].forEach(function(n4) {
      n4(t3);
    }), t3;
  };
};
var X = function(n3) {
  var t3 = n3.format, r4 = void 0 === t3 ? "native" : t3, e4 = n3.precision, a2 = void 0 === e4 ? "millisecond" : e4, u = n3.useUTC, c2 = void 0 === u || u, s = W(a2);
  return function(n4) {
    if (void 0 === n4) return n4;
    if ("native" === r4 || n4 instanceof Date) return s(n4);
    var t4 = c2 ? utcParse(r4) : timeParse(r4);
    return s(t4(n4));
  };
};
var Y = function(n3, t3, r4, e4) {
  var a2, i2, o2, c2, s = n3.min, d = void 0 === s ? 0 : s, f = n3.max, l = void 0 === f ? "auto" : f, m = n3.stacked, y = void 0 !== m && m, h = n3.reverse, g = void 0 !== h && h, x = n3.clamp, k3 = void 0 !== x && x, T2 = n3.nice, M = void 0 !== T2 && T2, b2 = n3.round, w2 = void 0 === b2 || b2;
  "auto" === d ? a2 = true === y ? null != (i2 = t3.minStacked) ? i2 : 0 : t3.min : a2 = d;
  "auto" === l ? o2 = true === y ? null != (c2 = t3.maxStacked) ? c2 : 0 : t3.max : o2 = l;
  var E = linear().range("x" === e4 ? [0, r4] : [r4, 0]).interpolate(w2 ? round_default : number_default).domain(g ? [o2, a2] : [a2, o2]).clamp(k3);
  return true === M ? E.nice() : "number" == typeof M && E.nice(M), Z(E, y);
};
var Z = function(n3, t3) {
  void 0 === t3 && (t3 = false);
  var r4 = n3;
  return r4.type = "linear", r4.stacked = t3, r4;
};
var _ = function(n3, t3, r4) {
  var e4 = point().range([0, r4]).domain(t3.all);
  return e4.type = "point", e4;
};
var tn = function(n3, t3, r4, e4) {
  var a2 = n3.round, i2 = void 0 === a2 || a2, o2 = band().range("x" === e4 ? [0, r4] : [r4, 0]).domain(t3.all).round(i2);
  return rn(o2);
};
var rn = function(n3) {
  var t3 = n3;
  return t3.type = "band", t3;
};
var en = function(n3, t3, r4) {
  var e4, a2, i2 = n3.format, o2 = void 0 === i2 ? "native" : i2, u = n3.precision, c2 = void 0 === u ? "millisecond" : u, s = n3.min, l = void 0 === s ? "auto" : s, m = n3.max, v = void 0 === m ? "auto" : m, p2 = n3.useUTC, y = void 0 === p2 || p2, h = n3.nice, g = void 0 !== h && h, x = X({ format: o2, precision: c2, useUTC: y });
  e4 = "auto" === l ? x(t3.min) : "native" !== o2 ? x(l) : l, a2 = "auto" === v ? x(t3.max) : "native" !== o2 ? x(v) : v;
  var k3 = y ? utcTime() : time();
  k3.range([0, r4]), e4 && a2 && k3.domain([e4, a2]), true === g ? k3.nice() : "object" != typeof g && "number" != typeof g || k3.nice(g);
  var T2 = k3;
  return T2.type = "time", T2.useUTC = y, T2;
};
var an = function(n3, t3, r4, e4) {
  var a2, i2 = n3.base, o2 = void 0 === i2 ? 10 : i2, u = n3.min, c2 = void 0 === u ? "auto" : u, s = n3.max, d = void 0 === s ? "auto" : s;
  if (t3.all.some(function(n4) {
    return 0 === n4;
  })) throw new Error("a log scale domain must not include or cross zero");
  var f, m, v = false;
  if (t3.all.filter(function(n4) {
    return null != n4;
  }).forEach(function(n4) {
    v || (void 0 === a2 ? a2 = Math.sign(n4) : Math.sign(n4) !== a2 && (v = true));
  }), v) throw new Error("a log scale domain must be strictly-positive or strictly-negative");
  f = "auto" === c2 ? t3.min : c2, m = "auto" === d ? t3.max : d;
  var p2 = log().domain([f, m]).rangeRound("x" === e4 ? [0, r4] : [r4, 0]).base(o2).nice();
  return p2.type = "log", p2;
};
var on = function(n3, t3, r4, e4) {
  var a2, i2, o2 = n3.constant, u = void 0 === o2 ? 1 : o2, c2 = n3.min, s = void 0 === c2 ? "auto" : c2, d = n3.max, f = void 0 === d ? "auto" : d, l = n3.reverse, v = void 0 !== l && l;
  a2 = "auto" === s ? t3.min : s, i2 = "auto" === f ? t3.max : f;
  var p2 = symlog().constant(u).rangeRound("x" === e4 ? [0, r4] : [r4, 0]).nice();
  true === v ? p2.domain([i2, a2]) : p2.domain([a2, i2]);
  var y = p2;
  return y.type = "symlog", y;
};
var un = function(n3) {
  return "x" === n3 ? "y" : "x";
};
var cn = function(n3, t3) {
  return n3 === t3;
};
var sn = function(n3, t3) {
  return n3.getTime() === t3.getTime();
};
function dn(n3, t3, r4, e4) {
  switch (n3.type) {
    case "linear":
      return Y(n3, t3, r4, e4);
    case "point":
      return _(0, t3, r4);
    case "band":
      return tn(n3, t3, r4, e4);
    case "time":
      return en(n3, t3, r4);
    case "log":
      return an(n3, t3, r4, e4);
    case "symlog":
      return on(n3, t3, r4, e4);
    default:
      throw new Error("invalid scale spec");
  }
}
var fn = function(n3, t3, r4) {
  var e4;
  if ("stacked" in r4 && r4.stacked) {
    var a2 = n3.data["x" === t3 ? "xStacked" : "yStacked"];
    return null == a2 ? null : r4(a2);
  }
  return null != (e4 = r4(n3.data[t3])) ? e4 : null;
};
var ln = function(n3, t3, r4, e4, a2) {
  var i2 = n3.map(function(n4) {
    return function(n5) {
      return J({}, n5, { data: n5.data.map(function(n6) {
        return { data: J({}, n6) };
      }) });
    }(n4);
  }), o2 = mn(i2, t3, r4);
  "stacked" in t3 && true === t3.stacked && yn(o2, i2), "stacked" in r4 && true === r4.stacked && hn(o2, i2);
  var u = dn(t3, o2.x, e4, "x"), c2 = dn(r4, o2.y, a2, "y"), s = i2.map(function(n4) {
    return J({}, n4, { data: n4.data.map(function(n5) {
      return J({}, n5, { position: { x: fn(n5, "x", u), y: fn(n5, "y", c2) } });
    }) });
  });
  return J({}, o2, { series: s, xScale: u, yScale: c2 });
};
var mn = function(n3, t3, r4) {
  return { x: vn(n3, "x", t3), y: vn(n3, "y", r4) };
};
var vn = function(a2, i2, o2, u) {
  var c2 = void 0 === u ? {} : u, s = c2.getValue, d = void 0 === s ? function(n3) {
    return n3.data[i2];
  } : s, f = c2.setValue, l = void 0 === f ? function(n3, t3) {
    n3.data[i2] = t3;
  } : f;
  if ("linear" === o2.type) a2.forEach(function(n3) {
    n3.data.forEach(function(n4) {
      var t3 = d(n4);
      t3 && l(n4, parseFloat(String(t3)));
    });
  });
  else if ("time" === o2.type && "native" !== o2.format) {
    var m = X(o2);
    a2.forEach(function(n3) {
      n3.data.forEach(function(n4) {
        var t3 = d(n4);
        t3 && l(n4, m(t3));
      });
    });
  }
  var v = [];
  switch (a2.forEach(function(n3) {
    n3.data.forEach(function(n4) {
      v.push(d(n4));
    });
  }), o2.type) {
    case "linear":
      var p2 = (0, import_sortBy.default)((0, import_uniq.default)(v).filter(function(n3) {
        return null !== n3;
      }), function(n3) {
        return n3;
      });
      return { all: p2, min: Math.min.apply(Math, p2), max: Math.max.apply(Math, p2) };
    case "time":
      var y = (0, import_uniqBy.default)(v, function(n3) {
        return n3.getTime();
      }).slice(0).sort(function(n3, t3) {
        return t3.getTime() - n3.getTime();
      }).reverse();
      return { all: y, min: y[0], max: (0, import_last.default)(y) };
    default:
      var h = (0, import_uniq.default)(v);
      return { all: h, min: h[0], max: (0, import_last.default)(h) };
  }
};
var pn = function(n3, t3, r4) {
  var i2 = un(n3), o2 = [];
  t3[i2].all.forEach(function(t4) {
    var u = (0, import_isDate.default)(t4) ? sn : cn, c2 = [];
    r4.forEach(function(r5) {
      var a2 = r5.data.find(function(n4) {
        return u(n4.data[i2], t4);
      }), s = null, d = null;
      if (void 0 !== a2) {
        if (null !== (s = a2.data[n3])) {
          var f = (0, import_last.default)(c2);
          void 0 === f ? d = s : null !== f && (d = f + s);
        }
        a2.data["x" === n3 ? "xStacked" : "yStacked"] = d;
      }
      c2.push(d), null !== d && o2.push(d);
    });
  }), t3[n3].minStacked = Math.min.apply(Math, o2), t3[n3].maxStacked = Math.max.apply(Math, o2);
};
var yn = function(n3, t3) {
  return pn("x", n3, t3);
};
var hn = function(n3, t3) {
  return pn("y", n3, t3);
};
var gn = function(n3) {
  var t3 = n3.bandwidth();
  if (0 === t3) return n3;
  var r4 = t3 / 2;
  return n3.round() && (r4 = Math.round(r4)), function(t4) {
    var e4;
    return (null != (e4 = n3(t4)) ? e4 : 0) + r4;
  };
};
var xn = { millisecond: [millisecond_default, millisecond_default], second: [second_default, second_default], minute: [minute_default, utcMinute_default], hour: [hour_default, utcHour_default], day: [newInterval(function(n3) {
  return n3.setHours(0, 0, 0, 0);
}, function(n3, t3) {
  return n3.setDate(n3.getDate() + t3);
}, function(n3, t3) {
  return (t3.getTime() - n3.getTime()) / 864e5;
}, function(n3) {
  return Math.floor(n3.getTime() / 864e5);
}), newInterval(function(n3) {
  return n3.setUTCHours(0, 0, 0, 0);
}, function(n3, t3) {
  return n3.setUTCDate(n3.getUTCDate() + t3);
}, function(n3, t3) {
  return (t3.getTime() - n3.getTime()) / 864e5;
}, function(n3) {
  return Math.floor(n3.getTime() / 864e5);
})], week: [sunday, utcSunday], sunday: [sunday, utcSunday], monday: [monday, utcMonday], tuesday: [tuesday, utcTuesday], wednesday: [wednesday, utcWednesday], thursday: [thursday, utcThursday], friday: [friday, utcFriday], saturday: [saturday, utcSaturday], month: [month_default, utcMonth_default], year: [year_default, utcYear_default] };
var kn = Object.keys(xn);
var Tn = new RegExp("^every\\s*(\\d+)?\\s*(" + kn.join("|") + ")s?$", "i");
var Mn = function(n3, t3) {
  if (Array.isArray(t3)) return t3;
  if ("string" == typeof t3 && "useUTC" in n3) {
    var r4 = t3.match(Tn);
    if (r4) {
      var e4 = r4[1], a2 = r4[2], i2 = xn[a2][n3.useUTC ? 1 : 0];
      if ("day" === a2) {
        var o2, u, c2 = n3.domain(), s = c2[0], d = c2[1], f = new Date(d);
        return f.setDate(f.getDate() + 1), null != (o2 = null == (u = i2.every(Number(null != e4 ? e4 : 1))) ? void 0 : u.range(s, f)) ? o2 : [];
      }
      if (void 0 === e4) return n3.ticks(i2);
      var l = i2.every(Number(e4));
      if (l) return n3.ticks(l);
    }
    throw new Error("Invalid tickValues: " + t3);
  }
  if ("ticks" in n3) {
    if (void 0 === t3) return n3.ticks();
    if ("number" == typeof (m = t3) && isFinite(m) && Math.floor(m) === m) return n3.ticks(t3);
  }
  var m;
  return n3.domain();
};

// node_modules/@nivo/axes/dist/nivo-axes.mjs
var t2 = __toESM(require_react(), 1);
var import_react = __toESM(require_react(), 1);

// node_modules/@nivo/axes/node_modules/d3-time/src/interval.js
var t02 = /* @__PURE__ */ new Date();
var t12 = /* @__PURE__ */ new Date();
function newInterval2(floori, offseti, count2, field) {
  function interval(date) {
    return floori(date = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+date)), date;
  }
  interval.floor = function(date) {
    return floori(date = /* @__PURE__ */ new Date(+date)), date;
  };
  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };
  interval.round = function(date) {
    var d0 = interval(date), d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };
  interval.offset = function(date, step) {
    return offseti(date = /* @__PURE__ */ new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };
  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range;
    do
      range.push(previous = /* @__PURE__ */ new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };
  interval.filter = function(test) {
    return newInterval2(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {
          }
        }
        else while (--step >= 0) {
          while (offseti(date, 1), !test(date)) {
          }
        }
      }
    });
  };
  if (count2) {
    interval.count = function(start, end) {
      t02.setTime(+start), t12.setTime(+end);
      floori(t02), floori(t12);
      return Math.floor(count2(t02, t12));
    };
    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function(d) {
        return field(d) % step === 0;
      } : function(d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }
  return interval;
}

// node_modules/@nivo/axes/node_modules/d3-time/src/millisecond.js
var millisecond2 = newInterval2(function() {
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});
millisecond2.every = function(k3) {
  k3 = Math.floor(k3);
  if (!isFinite(k3) || !(k3 > 0)) return null;
  if (!(k3 > 1)) return millisecond2;
  return newInterval2(function(date) {
    date.setTime(Math.floor(date / k3) * k3);
  }, function(date, step) {
    date.setTime(+date + step * k3);
  }, function(start, end) {
    return (end - start) / k3;
  });
};
var millisecond_default2 = millisecond2;
var milliseconds2 = millisecond2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/duration.js
var durationSecond2 = 1e3;
var durationMinute2 = durationSecond2 * 60;
var durationHour2 = durationMinute2 * 60;
var durationDay2 = durationHour2 * 24;
var durationWeek2 = durationDay2 * 7;
var durationMonth = durationDay2 * 30;
var durationYear = durationDay2 * 365;

// node_modules/@nivo/axes/node_modules/d3-time/src/second.js
var second2 = newInterval2(function(date) {
  date.setTime(date - date.getMilliseconds());
}, function(date, step) {
  date.setTime(+date + step * durationSecond2);
}, function(start, end) {
  return (end - start) / durationSecond2;
}, function(date) {
  return date.getUTCSeconds();
});
var second_default2 = second2;
var seconds2 = second2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/minute.js
var minute2 = newInterval2(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond2);
}, function(date, step) {
  date.setTime(+date + step * durationMinute2);
}, function(start, end) {
  return (end - start) / durationMinute2;
}, function(date) {
  return date.getMinutes();
});
var minute_default2 = minute2;
var minutes2 = minute2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/hour.js
var hour2 = newInterval2(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond2 - date.getMinutes() * durationMinute2);
}, function(date, step) {
  date.setTime(+date + step * durationHour2);
}, function(start, end) {
  return (end - start) / durationHour2;
}, function(date) {
  return date.getHours();
});
var hour_default2 = hour2;
var hours2 = hour2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/day.js
var day2 = newInterval2(
  (date) => date.setHours(0, 0, 0, 0),
  (date, step) => date.setDate(date.getDate() + step),
  (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute2) / durationDay2,
  (date) => date.getDate() - 1
);
var day_default2 = day2;
var days2 = day2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/week.js
function weekday2(i2) {
  return newInterval2(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i2) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute2) / durationWeek2;
  });
}
var sunday2 = weekday2(0);
var monday2 = weekday2(1);
var tuesday2 = weekday2(2);
var wednesday2 = weekday2(3);
var thursday2 = weekday2(4);
var friday2 = weekday2(5);
var saturday2 = weekday2(6);
var sundays2 = sunday2.range;
var mondays2 = monday2.range;
var tuesdays2 = tuesday2.range;
var wednesdays2 = wednesday2.range;
var thursdays2 = thursday2.range;
var fridays2 = friday2.range;
var saturdays2 = saturday2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/month.js
var month2 = newInterval2(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});
var month_default2 = month2;
var months2 = month2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/year.js
var year2 = newInterval2(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});
year2.every = function(k3) {
  return !isFinite(k3 = Math.floor(k3)) || !(k3 > 0) ? null : newInterval2(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k3) * k3);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k3);
  });
};
var year_default2 = year2;
var years2 = year2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/utcMinute.js
var utcMinute2 = newInterval2(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute2);
}, function(start, end) {
  return (end - start) / durationMinute2;
}, function(date) {
  return date.getUTCMinutes();
});
var utcMinute_default2 = utcMinute2;
var utcMinutes2 = utcMinute2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/utcHour.js
var utcHour2 = newInterval2(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour2);
}, function(start, end) {
  return (end - start) / durationHour2;
}, function(date) {
  return date.getUTCHours();
});
var utcHour_default2 = utcHour2;
var utcHours2 = utcHour2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/utcDay.js
var utcDay2 = newInterval2(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / durationDay2;
}, function(date) {
  return date.getUTCDate() - 1;
});
var utcDay_default2 = utcDay2;
var utcDays2 = utcDay2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/utcWeek.js
function utcWeekday2(i2) {
  return newInterval2(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i2) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek2;
  });
}
var utcSunday2 = utcWeekday2(0);
var utcMonday2 = utcWeekday2(1);
var utcTuesday2 = utcWeekday2(2);
var utcWednesday2 = utcWeekday2(3);
var utcThursday2 = utcWeekday2(4);
var utcFriday2 = utcWeekday2(5);
var utcSaturday2 = utcWeekday2(6);
var utcSundays2 = utcSunday2.range;
var utcMondays2 = utcMonday2.range;
var utcTuesdays2 = utcTuesday2.range;
var utcWednesdays2 = utcWednesday2.range;
var utcThursdays2 = utcThursday2.range;
var utcFridays2 = utcFriday2.range;
var utcSaturdays2 = utcSaturday2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/utcMonth.js
var utcMonth2 = newInterval2(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});
var utcMonth_default2 = utcMonth2;
var utcMonths2 = utcMonth2.range;

// node_modules/@nivo/axes/node_modules/d3-time/src/utcYear.js
var utcYear2 = newInterval2(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});
utcYear2.every = function(k3) {
  return !isFinite(k3 = Math.floor(k3)) || !(k3 > 0) ? null : newInterval2(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k3) * k3);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k3);
  });
};
var utcYear_default2 = utcYear2;
var utcYears2 = utcYear2.range;

// node_modules/@nivo/axes/node_modules/d3-array/src/ascending.js
function ascending_default(a2, b2) {
  return a2 < b2 ? -1 : a2 > b2 ? 1 : a2 >= b2 ? 0 : NaN;
}

// node_modules/@nivo/axes/node_modules/d3-array/src/bisector.js
function bisector_default(f) {
  let delta = f;
  let compare = f;
  if (f.length === 1) {
    delta = (d, x) => f(d) - x;
    compare = ascendingComparator(f);
  }
  function left(a2, x, lo, hi) {
    if (lo == null) lo = 0;
    if (hi == null) hi = a2.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (compare(a2[mid], x) < 0) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  function right(a2, x, lo, hi) {
    if (lo == null) lo = 0;
    if (hi == null) hi = a2.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (compare(a2[mid], x) > 0) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
  function center(a2, x, lo, hi) {
    if (lo == null) lo = 0;
    if (hi == null) hi = a2.length;
    const i2 = left(a2, x, lo, hi - 1);
    return i2 > lo && delta(a2[i2 - 1], x) > -delta(a2[i2], x) ? i2 - 1 : i2;
  }
  return { left, center, right };
}
function ascendingComparator(f) {
  return (d, x) => ascending_default(f(d), x);
}

// node_modules/@nivo/axes/node_modules/d3-array/src/number.js
function number_default2(x) {
  return x === null ? NaN : +x;
}

// node_modules/@nivo/axes/node_modules/d3-array/src/bisect.js
var ascendingBisect = bisector_default(ascending_default);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;
var bisectCenter = bisector_default(number_default2).center;

// node_modules/@nivo/axes/node_modules/d3-array/src/array.js
var array = Array.prototype;
var slice = array.slice;
var map = array.map;

// node_modules/@nivo/axes/node_modules/d3-array/src/ticks.js
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function tickStep(start, stop, count2) {
  var step0 = Math.abs(stop - start) / Math.max(0, count2), step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)), error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

// node_modules/@nivo/axes/node_modules/d3-array/src/shuffle.js
var shuffle_default = shuffler(Math.random);
function shuffler(random) {
  return function shuffle(array2, i0 = 0, i1 = array2.length) {
    let m = i1 - (i0 = +i0);
    while (m) {
      const i2 = random() * m-- | 0, t3 = array2[m + i0];
      array2[m + i0] = array2[i2 + i0];
      array2[i2 + i0] = t3;
    }
    return array2;
  };
}

// node_modules/@nivo/axes/node_modules/d3-time/src/ticks.js
function ticker(year3, month3, week, day3, hour3, minute3) {
  const tickIntervals = [
    [second_default2, 1, durationSecond2],
    [second_default2, 5, 5 * durationSecond2],
    [second_default2, 15, 15 * durationSecond2],
    [second_default2, 30, 30 * durationSecond2],
    [minute3, 1, durationMinute2],
    [minute3, 5, 5 * durationMinute2],
    [minute3, 15, 15 * durationMinute2],
    [minute3, 30, 30 * durationMinute2],
    [hour3, 1, durationHour2],
    [hour3, 3, 3 * durationHour2],
    [hour3, 6, 6 * durationHour2],
    [hour3, 12, 12 * durationHour2],
    [day3, 1, durationDay2],
    [day3, 2, 2 * durationDay2],
    [week, 1, durationWeek2],
    [month3, 1, durationMonth],
    [month3, 3, 3 * durationMonth],
    [year3, 1, durationYear]
  ];
  function ticks(start, stop, count2) {
    const reverse2 = stop < start;
    if (reverse2) [start, stop] = [stop, start];
    const interval = count2 && typeof count2.range === "function" ? count2 : tickInterval(start, stop, count2);
    const ticks2 = interval ? interval.range(start, +stop + 1) : [];
    return reverse2 ? ticks2.reverse() : ticks2;
  }
  function tickInterval(start, stop, count2) {
    const target = Math.abs(stop - start) / count2;
    const i2 = bisector_default(([, , step2]) => step2).right(tickIntervals, target);
    if (i2 === tickIntervals.length) return year3.every(tickStep(start / durationYear, stop / durationYear, count2));
    if (i2 === 0) return millisecond_default2.every(Math.max(tickStep(start, stop, count2), 1));
    const [t3, step] = tickIntervals[target / tickIntervals[i2 - 1][2] < tickIntervals[i2][2] / target ? i2 - 1 : i2];
    return t3.every(step);
  }
  return [ticks, tickInterval];
}
var [utcTicks, utcTickInterval] = ticker(utcYear_default2, utcMonth_default2, utcSunday2, utcDay_default2, utcHour_default2, utcMinute_default2);
var [timeTicks, timeTickInterval] = ticker(year_default2, month_default2, sunday2, day_default2, hour_default2, minute_default2);

// node_modules/@nivo/axes/node_modules/d3-time-format/src/locale.js
function localDate2(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}
function utcDate2(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}
function newDate2(y, m, d) {
  return { y, m, d, H: 0, M: 0, S: 0, L: 0 };
}
function formatLocale2(locale4) {
  var locale_dateTime = locale4.dateTime, locale_date = locale4.date, locale_time = locale4.time, locale_periods = locale4.periods, locale_weekdays = locale4.days, locale_shortWeekdays = locale4.shortDays, locale_months = locale4.months, locale_shortMonths = locale4.shortMonths;
  var periodRe = formatRe2(locale_periods), periodLookup = formatLookup2(locale_periods), weekdayRe = formatRe2(locale_weekdays), weekdayLookup = formatLookup2(locale_weekdays), shortWeekdayRe = formatRe2(locale_shortWeekdays), shortWeekdayLookup = formatLookup2(locale_shortWeekdays), monthRe = formatRe2(locale_months), monthLookup = formatLookup2(locale_months), shortMonthRe = formatRe2(locale_shortMonths), shortMonthLookup = formatLookup2(locale_shortMonths);
  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth2,
    "e": formatDayOfMonth2,
    "f": formatMicroseconds2,
    "g": formatYearISO2,
    "G": formatFullYearISO2,
    "H": formatHour242,
    "I": formatHour122,
    "j": formatDayOfYear2,
    "L": formatMilliseconds2,
    "m": formatMonthNumber2,
    "M": formatMinutes2,
    "p": formatPeriod,
    "q": formatQuarter,
    "Q": formatUnixTimestamp2,
    "s": formatUnixTimestampSeconds2,
    "S": formatSeconds2,
    "u": formatWeekdayNumberMonday2,
    "U": formatWeekNumberSunday2,
    "V": formatWeekNumberISO2,
    "w": formatWeekdayNumberSunday2,
    "W": formatWeekNumberMonday2,
    "x": null,
    "X": null,
    "y": formatYear2,
    "Y": formatFullYear2,
    "Z": formatZone2,
    "%": formatLiteralPercent2
  };
  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth2,
    "e": formatUTCDayOfMonth2,
    "f": formatUTCMicroseconds2,
    "g": formatUTCYearISO2,
    "G": formatUTCFullYearISO2,
    "H": formatUTCHour242,
    "I": formatUTCHour122,
    "j": formatUTCDayOfYear2,
    "L": formatUTCMilliseconds2,
    "m": formatUTCMonthNumber2,
    "M": formatUTCMinutes2,
    "p": formatUTCPeriod,
    "q": formatUTCQuarter,
    "Q": formatUnixTimestamp2,
    "s": formatUnixTimestampSeconds2,
    "S": formatUTCSeconds2,
    "u": formatUTCWeekdayNumberMonday2,
    "U": formatUTCWeekNumberSunday2,
    "V": formatUTCWeekNumberISO2,
    "w": formatUTCWeekdayNumberSunday2,
    "W": formatUTCWeekNumberMonday2,
    "x": null,
    "X": null,
    "y": formatUTCYear2,
    "Y": formatUTCFullYear2,
    "Z": formatUTCZone2,
    "%": formatLiteralPercent2
  };
  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth2,
    "e": parseDayOfMonth2,
    "f": parseMicroseconds2,
    "g": parseYear2,
    "G": parseFullYear2,
    "H": parseHour242,
    "I": parseHour242,
    "j": parseDayOfYear2,
    "L": parseMilliseconds2,
    "m": parseMonthNumber2,
    "M": parseMinutes2,
    "p": parsePeriod,
    "q": parseQuarter2,
    "Q": parseUnixTimestamp2,
    "s": parseUnixTimestampSeconds2,
    "S": parseSeconds2,
    "u": parseWeekdayNumberMonday2,
    "U": parseWeekNumberSunday2,
    "V": parseWeekNumberISO2,
    "w": parseWeekdayNumberSunday2,
    "W": parseWeekNumberMonday2,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear2,
    "Y": parseFullYear2,
    "Z": parseZone2,
    "%": parseLiteralPercent2
  };
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);
  function newFormat(specifier, formats2) {
    return function(date) {
      var string = [], i2 = -1, j = 0, n3 = specifier.length, c2, pad3, format2;
      if (!(date instanceof Date)) date = /* @__PURE__ */ new Date(+date);
      while (++i2 < n3) {
        if (specifier.charCodeAt(i2) === 37) {
          string.push(specifier.slice(j, i2));
          if ((pad3 = pads2[c2 = specifier.charAt(++i2)]) != null) c2 = specifier.charAt(++i2);
          else pad3 = c2 === "e" ? " " : "0";
          if (format2 = formats2[c2]) c2 = format2(date, pad3);
          string.push(c2);
          j = i2 + 1;
        }
      }
      string.push(specifier.slice(j, i2));
      return string.join("");
    };
  }
  function newParse(specifier, Z2) {
    return function(string) {
      var d = newDate2(1900, void 0, 1), i2 = parseSpecifier(d, specifier, string += "", 0), week, day3;
      if (i2 != string.length) return null;
      if ("Q" in d) return new Date(d.Q);
      if ("s" in d) return new Date(d.s * 1e3 + ("L" in d ? d.L : 0));
      if (Z2 && !("Z" in d)) d.Z = 0;
      if ("p" in d) d.H = d.H % 12 + d.p * 12;
      if (d.m === void 0) d.m = "q" in d ? d.q : 0;
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate2(newDate2(d.y, 0, 1)), day3 = week.getUTCDay();
          week = day3 > 4 || day3 === 0 ? utcMonday2.ceil(week) : utcMonday2(week);
          week = utcDay_default2.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = localDate2(newDate2(d.y, 0, 1)), day3 = week.getDay();
          week = day3 > 4 || day3 === 0 ? monday2.ceil(week) : monday2(week);
          week = day_default2.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day3 = "Z" in d ? utcDate2(newDate2(d.y, 0, 1)).getUTCDay() : localDate2(newDate2(d.y, 0, 1)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day3 + 5) % 7 : d.w + d.U * 7 - (day3 + 6) % 7;
      }
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate2(d);
      }
      return localDate2(d);
    };
  }
  function parseSpecifier(d, specifier, string, j) {
    var i2 = 0, n3 = specifier.length, m = string.length, c2, parse;
    while (i2 < n3) {
      if (j >= m) return -1;
      c2 = specifier.charCodeAt(i2++);
      if (c2 === 37) {
        c2 = specifier.charAt(i2++);
        parse = parses[c2 in pads2 ? specifier.charAt(i2++) : c2];
        if (!parse || (j = parse(d, string, j)) < 0) return -1;
      } else if (c2 != string.charCodeAt(j++)) {
        return -1;
      }
    }
    return j;
  }
  function parsePeriod(d, string, i2) {
    var n3 = periodRe.exec(string.slice(i2));
    return n3 ? (d.p = periodLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseShortWeekday(d, string, i2) {
    var n3 = shortWeekdayRe.exec(string.slice(i2));
    return n3 ? (d.w = shortWeekdayLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseWeekday(d, string, i2) {
    var n3 = weekdayRe.exec(string.slice(i2));
    return n3 ? (d.w = weekdayLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseShortMonth(d, string, i2) {
    var n3 = shortMonthRe.exec(string.slice(i2));
    return n3 ? (d.m = shortMonthLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseMonth(d, string, i2) {
    var n3 = monthRe.exec(string.slice(i2));
    return n3 ? (d.m = monthLookup.get(n3[0].toLowerCase()), i2 + n3[0].length) : -1;
  }
  function parseLocaleDateTime(d, string, i2) {
    return parseSpecifier(d, locale_dateTime, string, i2);
  }
  function parseLocaleDate(d, string, i2) {
    return parseSpecifier(d, locale_date, string, i2);
  }
  function parseLocaleTime(d, string, i2) {
    return parseSpecifier(d, locale_time, string, i2);
  }
  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }
  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }
  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }
  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }
  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }
  function formatQuarter(d) {
    return 1 + ~~(d.getMonth() / 3);
  }
  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }
  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }
  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }
  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }
  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }
  function formatUTCQuarter(d) {
    return 1 + ~~(d.getUTCMonth() / 3);
  }
  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() {
        return specifier;
      };
      return f;
    },
    parse: function(specifier) {
      var p2 = newParse(specifier += "", false);
      p2.toString = function() {
        return specifier;
      };
      return p2;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() {
        return specifier;
      };
      return f;
    },
    utcParse: function(specifier) {
      var p2 = newParse(specifier += "", true);
      p2.toString = function() {
        return specifier;
      };
      return p2;
    }
  };
}
var pads2 = { "-": "", "_": " ", "0": "0" };
var numberRe2 = /^\s*\d+/;
var percentRe2 = /^%/;
var requoteRe2 = /[\\^$*+?|[\]().{}]/g;
function pad2(value, fill, width) {
  var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}
function requote2(s) {
  return s.replace(requoteRe2, "\\$&");
}
function formatRe2(names) {
  return new RegExp("^(?:" + names.map(requote2).join("|") + ")", "i");
}
function formatLookup2(names) {
  return new Map(names.map((name, i2) => [name.toLowerCase(), i2]));
}
function parseWeekdayNumberSunday2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 1));
  return n3 ? (d.w = +n3[0], i2 + n3[0].length) : -1;
}
function parseWeekdayNumberMonday2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 1));
  return n3 ? (d.u = +n3[0], i2 + n3[0].length) : -1;
}
function parseWeekNumberSunday2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.U = +n3[0], i2 + n3[0].length) : -1;
}
function parseWeekNumberISO2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.V = +n3[0], i2 + n3[0].length) : -1;
}
function parseWeekNumberMonday2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.W = +n3[0], i2 + n3[0].length) : -1;
}
function parseFullYear2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 4));
  return n3 ? (d.y = +n3[0], i2 + n3[0].length) : -1;
}
function parseYear2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.y = +n3[0] + (+n3[0] > 68 ? 1900 : 2e3), i2 + n3[0].length) : -1;
}
function parseZone2(d, string, i2) {
  var n3 = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i2, i2 + 6));
  return n3 ? (d.Z = n3[1] ? 0 : -(n3[2] + (n3[3] || "00")), i2 + n3[0].length) : -1;
}
function parseQuarter2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 1));
  return n3 ? (d.q = n3[0] * 3 - 3, i2 + n3[0].length) : -1;
}
function parseMonthNumber2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.m = n3[0] - 1, i2 + n3[0].length) : -1;
}
function parseDayOfMonth2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.d = +n3[0], i2 + n3[0].length) : -1;
}
function parseDayOfYear2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 3));
  return n3 ? (d.m = 0, d.d = +n3[0], i2 + n3[0].length) : -1;
}
function parseHour242(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.H = +n3[0], i2 + n3[0].length) : -1;
}
function parseMinutes2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.M = +n3[0], i2 + n3[0].length) : -1;
}
function parseSeconds2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 2));
  return n3 ? (d.S = +n3[0], i2 + n3[0].length) : -1;
}
function parseMilliseconds2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 3));
  return n3 ? (d.L = +n3[0], i2 + n3[0].length) : -1;
}
function parseMicroseconds2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2, i2 + 6));
  return n3 ? (d.L = Math.floor(n3[0] / 1e3), i2 + n3[0].length) : -1;
}
function parseLiteralPercent2(d, string, i2) {
  var n3 = percentRe2.exec(string.slice(i2, i2 + 1));
  return n3 ? i2 + n3[0].length : -1;
}
function parseUnixTimestamp2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2));
  return n3 ? (d.Q = +n3[0], i2 + n3[0].length) : -1;
}
function parseUnixTimestampSeconds2(d, string, i2) {
  var n3 = numberRe2.exec(string.slice(i2));
  return n3 ? (d.s = +n3[0], i2 + n3[0].length) : -1;
}
function formatDayOfMonth2(d, p2) {
  return pad2(d.getDate(), p2, 2);
}
function formatHour242(d, p2) {
  return pad2(d.getHours(), p2, 2);
}
function formatHour122(d, p2) {
  return pad2(d.getHours() % 12 || 12, p2, 2);
}
function formatDayOfYear2(d, p2) {
  return pad2(1 + day_default2.count(year_default2(d), d), p2, 3);
}
function formatMilliseconds2(d, p2) {
  return pad2(d.getMilliseconds(), p2, 3);
}
function formatMicroseconds2(d, p2) {
  return formatMilliseconds2(d, p2) + "000";
}
function formatMonthNumber2(d, p2) {
  return pad2(d.getMonth() + 1, p2, 2);
}
function formatMinutes2(d, p2) {
  return pad2(d.getMinutes(), p2, 2);
}
function formatSeconds2(d, p2) {
  return pad2(d.getSeconds(), p2, 2);
}
function formatWeekdayNumberMonday2(d) {
  var day3 = d.getDay();
  return day3 === 0 ? 7 : day3;
}
function formatWeekNumberSunday2(d, p2) {
  return pad2(sunday2.count(year_default2(d) - 1, d), p2, 2);
}
function dISO2(d) {
  var day3 = d.getDay();
  return day3 >= 4 || day3 === 0 ? thursday2(d) : thursday2.ceil(d);
}
function formatWeekNumberISO2(d, p2) {
  d = dISO2(d);
  return pad2(thursday2.count(year_default2(d), d) + (year_default2(d).getDay() === 4), p2, 2);
}
function formatWeekdayNumberSunday2(d) {
  return d.getDay();
}
function formatWeekNumberMonday2(d, p2) {
  return pad2(monday2.count(year_default2(d) - 1, d), p2, 2);
}
function formatYear2(d, p2) {
  return pad2(d.getFullYear() % 100, p2, 2);
}
function formatYearISO2(d, p2) {
  d = dISO2(d);
  return pad2(d.getFullYear() % 100, p2, 2);
}
function formatFullYear2(d, p2) {
  return pad2(d.getFullYear() % 1e4, p2, 4);
}
function formatFullYearISO2(d, p2) {
  var day3 = d.getDay();
  d = day3 >= 4 || day3 === 0 ? thursday2(d) : thursday2.ceil(d);
  return pad2(d.getFullYear() % 1e4, p2, 4);
}
function formatZone2(d) {
  var z2 = d.getTimezoneOffset();
  return (z2 > 0 ? "-" : (z2 *= -1, "+")) + pad2(z2 / 60 | 0, "0", 2) + pad2(z2 % 60, "0", 2);
}
function formatUTCDayOfMonth2(d, p2) {
  return pad2(d.getUTCDate(), p2, 2);
}
function formatUTCHour242(d, p2) {
  return pad2(d.getUTCHours(), p2, 2);
}
function formatUTCHour122(d, p2) {
  return pad2(d.getUTCHours() % 12 || 12, p2, 2);
}
function formatUTCDayOfYear2(d, p2) {
  return pad2(1 + utcDay_default2.count(utcYear_default2(d), d), p2, 3);
}
function formatUTCMilliseconds2(d, p2) {
  return pad2(d.getUTCMilliseconds(), p2, 3);
}
function formatUTCMicroseconds2(d, p2) {
  return formatUTCMilliseconds2(d, p2) + "000";
}
function formatUTCMonthNumber2(d, p2) {
  return pad2(d.getUTCMonth() + 1, p2, 2);
}
function formatUTCMinutes2(d, p2) {
  return pad2(d.getUTCMinutes(), p2, 2);
}
function formatUTCSeconds2(d, p2) {
  return pad2(d.getUTCSeconds(), p2, 2);
}
function formatUTCWeekdayNumberMonday2(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}
function formatUTCWeekNumberSunday2(d, p2) {
  return pad2(utcSunday2.count(utcYear_default2(d) - 1, d), p2, 2);
}
function UTCdISO2(d) {
  var day3 = d.getUTCDay();
  return day3 >= 4 || day3 === 0 ? utcThursday2(d) : utcThursday2.ceil(d);
}
function formatUTCWeekNumberISO2(d, p2) {
  d = UTCdISO2(d);
  return pad2(utcThursday2.count(utcYear_default2(d), d) + (utcYear_default2(d).getUTCDay() === 4), p2, 2);
}
function formatUTCWeekdayNumberSunday2(d) {
  return d.getUTCDay();
}
function formatUTCWeekNumberMonday2(d, p2) {
  return pad2(utcMonday2.count(utcYear_default2(d) - 1, d), p2, 2);
}
function formatUTCYear2(d, p2) {
  return pad2(d.getUTCFullYear() % 100, p2, 2);
}
function formatUTCYearISO2(d, p2) {
  d = UTCdISO2(d);
  return pad2(d.getUTCFullYear() % 100, p2, 2);
}
function formatUTCFullYear2(d, p2) {
  return pad2(d.getUTCFullYear() % 1e4, p2, 4);
}
function formatUTCFullYearISO2(d, p2) {
  var day3 = d.getUTCDay();
  d = day3 >= 4 || day3 === 0 ? utcThursday2(d) : utcThursday2.ceil(d);
  return pad2(d.getUTCFullYear() % 1e4, p2, 4);
}
function formatUTCZone2() {
  return "+0000";
}
function formatLiteralPercent2() {
  return "%";
}
function formatUnixTimestamp2(d) {
  return +d;
}
function formatUnixTimestampSeconds2(d) {
  return Math.floor(+d / 1e3);
}

// node_modules/@nivo/axes/node_modules/d3-time-format/src/defaultLocale.js
var locale2;
var timeFormat2;
var timeParse2;
var utcFormat2;
var utcParse2;
defaultLocale2({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function defaultLocale2(definition) {
  locale2 = formatLocale2(definition);
  timeFormat2 = locale2.format;
  timeParse2 = locale2.parse;
  utcFormat2 = locale2.utcFormat;
  utcParse2 = locale2.utcParse;
  return locale2;
}

// node_modules/@nivo/axes/node_modules/d3-time-format/src/isoFormat.js
var isoSpecifier2 = "%Y-%m-%dT%H:%M:%S.%LZ";
function formatIsoNative2(date) {
  return date.toISOString();
}
var formatIso2 = Date.prototype.toISOString ? formatIsoNative2 : utcFormat2(isoSpecifier2);

// node_modules/@nivo/axes/node_modules/d3-time-format/src/isoParse.js
function parseIsoNative2(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}
var parseIso2 = +/* @__PURE__ */ new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative2 : utcParse2(isoSpecifier2);

// node_modules/@nivo/axes/node_modules/d3-format/src/formatDecimal.js
function formatDecimal_default(x) {
  return Math.abs(x = Math.round(x)) >= 1e21 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
}
function formatDecimalParts(x, p2) {
  if ((i2 = (x = p2 ? x.toExponential(p2 - 1) : x.toExponential()).indexOf("e")) < 0) return null;
  var i2, coefficient = x.slice(0, i2);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i2 + 1)
  ];
}

// node_modules/@nivo/axes/node_modules/d3-format/src/exponent.js
function exponent_default(x) {
  return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}

// node_modules/@nivo/axes/node_modules/d3-format/src/formatGroup.js
function formatGroup_default(grouping, thousands) {
  return function(value, width) {
    var i2 = value.length, t3 = [], j = 0, g = grouping[0], length = 0;
    while (i2 > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t3.push(value.substring(i2 -= g, i2 + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }
    return t3.reverse().join(thousands);
  };
}

// node_modules/@nivo/axes/node_modules/d3-format/src/formatNumerals.js
function formatNumerals_default(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i2) {
      return numerals[+i2];
    });
  };
}

// node_modules/@nivo/axes/node_modules/d3-format/src/formatSpecifier.js
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
  this.align = specifier.align === void 0 ? ">" : specifier.align + "";
  this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

// node_modules/@nivo/axes/node_modules/d3-format/src/formatTrim.js
function formatTrim_default(s) {
  out: for (var n3 = s.length, i2 = 1, i0 = -1, i1; i2 < n3; ++i2) {
    switch (s[i2]) {
      case ".":
        i0 = i1 = i2;
        break;
      case "0":
        if (i0 === 0) i0 = i2;
        i1 = i2;
        break;
      default:
        if (!+s[i2]) break out;
        if (i0 > 0) i0 = 0;
        break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

// node_modules/@nivo/axes/node_modules/d3-format/src/formatPrefixAuto.js
var prefixExponent;
function formatPrefixAuto_default(x, p2) {
  var d = formatDecimalParts(x, p2);
  if (!d) return x + "";
  var coefficient = d[0], exponent = d[1], i2 = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n3 = coefficient.length;
  return i2 === n3 ? coefficient : i2 > n3 ? coefficient + new Array(i2 - n3 + 1).join("0") : i2 > 0 ? coefficient.slice(0, i2) + "." + coefficient.slice(i2) : "0." + new Array(1 - i2).join("0") + formatDecimalParts(x, Math.max(0, p2 + i2 - 1))[0];
}

// node_modules/@nivo/axes/node_modules/d3-format/src/formatRounded.js
function formatRounded_default(x, p2) {
  var d = formatDecimalParts(x, p2);
  if (!d) return x + "";
  var coefficient = d[0], exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

// node_modules/@nivo/axes/node_modules/d3-format/src/formatTypes.js
var formatTypes_default = {
  "%": function(x, p2) {
    return (x * 100).toFixed(p2);
  },
  "b": function(x) {
    return Math.round(x).toString(2);
  },
  "c": function(x) {
    return x + "";
  },
  "d": formatDecimal_default,
  "e": function(x, p2) {
    return x.toExponential(p2);
  },
  "f": function(x, p2) {
    return x.toFixed(p2);
  },
  "g": function(x, p2) {
    return x.toPrecision(p2);
  },
  "o": function(x) {
    return Math.round(x).toString(8);
  },
  "p": function(x, p2) {
    return formatRounded_default(x * 100, p2);
  },
  "r": formatRounded_default,
  "s": formatPrefixAuto_default,
  "X": function(x) {
    return Math.round(x).toString(16).toUpperCase();
  },
  "x": function(x) {
    return Math.round(x).toString(16);
  }
};

// node_modules/@nivo/axes/node_modules/d3-format/src/identity.js
function identity_default2(x) {
  return x;
}

// node_modules/@nivo/axes/node_modules/d3-format/src/locale.js
var map3 = Array.prototype.map;
var prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function locale_default(locale4) {
  var group2 = locale4.grouping === void 0 || locale4.thousands === void 0 ? identity_default2 : formatGroup_default(map3.call(locale4.grouping, Number), locale4.thousands + ""), currencyPrefix = locale4.currency === void 0 ? "" : locale4.currency[0] + "", currencySuffix = locale4.currency === void 0 ? "" : locale4.currency[1] + "", decimal = locale4.decimal === void 0 ? "." : locale4.decimal + "", numerals = locale4.numerals === void 0 ? identity_default2 : formatNumerals_default(map3.call(locale4.numerals, String)), percent = locale4.percent === void 0 ? "%" : locale4.percent + "", minus = locale4.minus === void 0 ? "-" : locale4.minus + "", nan = locale4.nan === void 0 ? "NaN" : locale4.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    if (type === "n") comma = true, type = "g";
    else if (!formatTypes_default[type]) precision === void 0 && (precision = 12), trim = true, type = "g";
    if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
    var formatType = formatTypes_default[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format2(value) {
      var valuePrefix = prefix, valueSuffix = suffix, i2, n3, c2;
      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim) value = formatTrim_default(value);
        if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;
        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
        if (maybeSuffix) {
          i2 = -1, n3 = value.length;
          while (++i2 < n3) {
            if (c2 = value.charCodeAt(i2), 48 > c2 || c2 > 57) {
              valueSuffix = (c2 === 46 ? decimal + value.slice(i2 + 1) : value.slice(i2)) + valueSuffix;
              value = value.slice(0, i2);
              break;
            }
          }
        }
      }
      if (comma && !zero) value = group2(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      if (comma && zero) value = group2(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format2.toString = function() {
      return specifier + "";
    };
    return format2;
  }
  function formatPrefix2(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e4 = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k3 = Math.pow(10, -e4), prefix = prefixes[8 + e4 / 3];
    return function(value2) {
      return f(k3 * value2) + prefix;
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix2
  };
}

// node_modules/@nivo/axes/node_modules/d3-format/src/defaultLocale.js
var locale3;
var format;
var formatPrefix;
defaultLocale3({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});
function defaultLocale3(definition) {
  locale3 = locale_default(definition);
  format = locale3.format;
  formatPrefix = locale3.formatPrefix;
  return locale3;
}

// node_modules/@nivo/axes/dist/nivo-axes.mjs
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function P() {
  return P = Object.assign ? Object.assign.bind() : function(t3) {
    for (var e4 = 1; e4 < arguments.length; e4++) {
      var i2 = arguments[e4];
      for (var n3 in i2) ({}).hasOwnProperty.call(i2, n3) && (t3[n3] = i2[n3]);
    }
    return t3;
  }, P.apply(null, arguments);
}
var T = function(t3) {
  var e4, i2 = t3.axis, n3 = t3.scale, r4 = t3.ticksPosition, o2 = t3.tickValues, l = t3.tickSize, s = t3.tickPadding, c2 = t3.tickRotation, f = t3.truncateTickAt, u = t3.engine, x = void 0 === u ? "svg" : u, d = Mn(n3, o2), m = Et[x], y = "bandwidth" in n3 ? gn(n3) : n3, v = { lineX: 0, lineY: 0 }, k3 = { textX: 0, textY: 0 }, p2 = "object" == typeof document && "rtl" === document.dir, b2 = m.align.center, T2 = m.baseline.center;
  "x" === i2 ? (e4 = function(t4) {
    var e6;
    return { x: null != (e6 = y(t4)) ? e6 : 0, y: 0 };
  }, v.lineY = l * ("after" === r4 ? 1 : -1), k3.textY = (l + s) * ("after" === r4 ? 1 : -1), T2 = "after" === r4 ? m.baseline.top : m.baseline.bottom, 0 === c2 ? b2 = m.align.center : "after" === r4 && c2 < 0 || "before" === r4 && c2 > 0 ? (b2 = m.align[p2 ? "left" : "right"], T2 = m.baseline.center) : ("after" === r4 && c2 > 0 || "before" === r4 && c2 < 0) && (b2 = m.align[p2 ? "right" : "left"], T2 = m.baseline.center)) : (e4 = function(t4) {
    var e6;
    return { x: 0, y: null != (e6 = y(t4)) ? e6 : 0 };
  }, v.lineX = l * ("after" === r4 ? 1 : -1), k3.textX = (l + s) * ("after" === r4 ? 1 : -1), b2 = "after" === r4 ? m.align.left : m.align.right);
  return { ticks: d.map(function(t4) {
    var i3 = "string" == typeof t4 ? function(t5) {
      var e6 = String(t5).length;
      return f && f > 0 && e6 > f ? "" + String(t5).slice(0, f).concat("...") : "" + t5;
    }(t4) : t4;
    return P({ key: t4 instanceof Date ? "" + t4.valueOf() : "" + t4, value: i3 }, e4(t4), v, k3);
  }), textAlign: b2, textBaseline: T2 };
};
var A = function(t3, e4) {
  if (void 0 === t3 || "function" == typeof t3) return t3;
  if ("time" === e4.type) {
    var i2 = timeFormat2(t3);
    return function(t4) {
      return i2(t4 instanceof Date ? t4 : new Date(t4));
    };
  }
  return format(t3);
};
var S = function(t3) {
  var e4, i2 = t3.width, n3 = t3.height, r4 = t3.scale, a2 = t3.axis, o2 = t3.values, l = (e4 = o2, Array.isArray(e4) ? o2 : void 0) || Mn(r4, o2), s = "bandwidth" in r4 ? gn(r4) : r4, c2 = "x" === a2 ? l.map(function(t4) {
    var e6, i3;
    return { key: t4 instanceof Date ? "" + t4.valueOf() : "" + t4, x1: null != (e6 = s(t4)) ? e6 : 0, x2: null != (i3 = s(t4)) ? i3 : 0, y1: 0, y2: n3 };
  }) : l.map(function(t4) {
    var e6, n4;
    return { key: t4 instanceof Date ? "" + t4.valueOf() : "" + t4, x1: 0, x2: i2, y1: null != (e6 = s(t4)) ? e6 : 0, y2: null != (n4 = s(t4)) ? n4 : 0 };
  });
  return c2;
};
var w = (0, import_react.memo)(function(t3) {
  var e4, n3 = t3.value, r4 = t3.format, a2 = t3.lineX, o2 = t3.lineY, l = t3.onClick, f = t3.textBaseline, u = t3.textAnchor, d = t3.animatedProps, m = k(), y = m.axis.ticks.line, v = null != (e4 = null == r4 ? void 0 : r4(n3)) ? e4 : n3, g = (0, import_react.useMemo)(function() {
    var t4 = { opacity: d.opacity };
    return l ? { style: P({}, t4, { cursor: "pointer" }), onClick: function(t5) {
      return l(t5, v);
    } } : { style: t4 };
  }, [d.opacity, l, v]);
  return (0, import_jsx_runtime.jsxs)(animated.g, P({ transform: d.transform }, g, { children: [(0, import_jsx_runtime.jsx)("line", { x1: 0, x2: a2, y1: 0, y2: o2, style: y }), (0, import_jsx_runtime.jsx)(c, { dominantBaseline: f, textAnchor: u, transform: d.textTransform, style: m.axis.ticks.text, children: "" + v })] }));
});
var X2 = function(e4) {
  var r4 = e4.axis, a2 = e4.scale, l = e4.x, f = void 0 === l ? 0 : l, u = e4.y, y = void 0 === u ? 0 : u, v = e4.length, g = e4.ticksPosition, h = e4.tickValues, S2 = e4.tickSize, X3 = void 0 === S2 ? 5 : S2, Y3 = e4.tickPadding, B2 = void 0 === Y3 ? 5 : Y3, O2 = e4.tickRotation, W3 = void 0 === O2 ? 0 : O2, V2 = e4.format, z2 = e4.renderTick, C2 = void 0 === z2 ? w : z2, D2 = e4.truncateTickAt, R2 = e4.legend, j = e4.legendPosition, E = void 0 === j ? "end" : j, q = e4.legendOffset, N = void 0 === q ? 0 : q, F = e4.onClick, H = e4.ariaHidden, I = k(), G = (0, import_react.useMemo)(function() {
    return A(V2, a2);
  }, [V2, a2]), J2 = T({ axis: r4, scale: a2, ticksPosition: g, tickValues: h, tickSize: X3, tickPadding: B2, tickRotation: W3, truncateTickAt: D2 }), K = J2.ticks, L2 = J2.textAlign, M = J2.textBaseline, Q2 = null;
  if (void 0 !== R2) {
    var U, Z2 = 0, $ = 0, _2 = 0;
    "y" === r4 ? (_2 = -90, Z2 = N, "start" === E ? (U = "start", $ = v) : "middle" === E ? (U = "middle", $ = v / 2) : "end" === E && (U = "end")) : ($ = N, "start" === E ? U = "start" : "middle" === E ? (U = "middle", Z2 = v / 2) : "end" === E && (U = "end", Z2 = v)), Q2 = (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(c, { transform: "translate(" + Z2 + ", " + $ + ") rotate(" + _2 + ")", textAnchor: U, style: P({}, I.axis.legend.text, { dominantBaseline: "central" }), children: R2 }) });
  }
  var tt = Yr(), et = tt.animate, it = tt.config, nt = useSpring({ transform: "translate(" + f + "," + y + ")", lineX2: "x" === r4 ? v : 0, lineY2: "x" === r4 ? 0 : v, config: it, immediate: !et }), rt = (0, import_react.useCallback)(function(t3) {
    return { opacity: 1, transform: "translate(" + t3.x + "," + t3.y + ")", textTransform: "translate(" + t3.textX + "," + t3.textY + ") rotate(" + W3 + ")" };
  }, [W3]), at = (0, import_react.useCallback)(function(t3) {
    return { opacity: 0, transform: "translate(" + t3.x + "," + t3.y + ")", textTransform: "translate(" + t3.textX + "," + t3.textY + ") rotate(" + W3 + ")" };
  }, [W3]), ot = useTransition(K, { keys: function(t3) {
    return t3.key;
  }, initial: rt, from: at, enter: rt, update: rt, leave: { opacity: 0 }, config: it, immediate: !et });
  return (0, import_jsx_runtime.jsxs)(animated.g, { transform: nt.transform, "aria-hidden": H, children: [ot(function(e6, i2, n3, r5) {
    return t2.createElement(C2, P({ tickIndex: r5, format: G, rotate: W3, textBaseline: M, textAnchor: L2, truncateTickAt: D2, animatedProps: e6 }, i2, F ? { onClick: F } : {}));
  }), (0, import_jsx_runtime.jsx)(animated.line, { style: I.axis.domain.line, x1: 0, x2: nt.lineX2, y1: 0, y2: nt.lineY2 }), Q2] });
};
var Y2 = (0, import_react.memo)(X2);
var B = ["top", "right", "bottom", "left"];
var O = (0, import_react.memo)(function(t3) {
  var e4 = t3.xScale, i2 = t3.yScale, n3 = t3.width, r4 = t3.height, a2 = { top: t3.top, right: t3.right, bottom: t3.bottom, left: t3.left };
  return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: B.map(function(t4) {
    var o2 = a2[t4];
    if (!o2) return null;
    var l = "top" === t4 || "bottom" === t4;
    return (0, import_jsx_runtime.jsx)(Y2, P({}, o2, { axis: l ? "x" : "y", x: "right" === t4 ? n3 : 0, y: "bottom" === t4 ? r4 : 0, scale: l ? e4 : i2, length: l ? n3 : r4, ticksPosition: "top" === t4 || "left" === t4 ? "before" : "after", truncateTickAt: o2.truncateTickAt }), t4);
  }) });
});
var W2 = (0, import_react.memo)(function(t3) {
  var e4 = t3.animatedProps, i2 = k();
  return (0, import_jsx_runtime.jsx)(animated.line, P({}, e4, i2.grid.line));
});
var V = (0, import_react.memo)(function(t3) {
  var e4 = t3.lines, i2 = Yr(), n3 = i2.animate, a2 = i2.config, l = useTransition(e4, { keys: function(t4) {
    return t4.key;
  }, initial: function(t4) {
    return { opacity: 1, x1: t4.x1, x2: t4.x2, y1: t4.y1, y2: t4.y2 };
  }, from: function(t4) {
    return { opacity: 0, x1: t4.x1, x2: t4.x2, y1: t4.y1, y2: t4.y2 };
  }, enter: function(t4) {
    return { opacity: 1, x1: t4.x1, x2: t4.x2, y1: t4.y1, y2: t4.y2 };
  }, update: function(t4) {
    return { opacity: 1, x1: t4.x1, x2: t4.x2, y1: t4.y1, y2: t4.y2 };
  }, leave: { opacity: 0 }, config: a2, immediate: !n3 });
  return (0, import_jsx_runtime.jsx)("g", { children: l(function(t4, e6) {
    return (0, import_react.createElement)(W2, P({}, e6, { key: e6.key, animatedProps: t4 }));
  }) });
});
var z = (0, import_react.memo)(function(t3) {
  var e4 = t3.width, n3 = t3.height, r4 = t3.xScale, a2 = t3.yScale, o2 = t3.xValues, l = t3.yValues, s = (0, import_react.useMemo)(function() {
    return !!r4 && S({ width: e4, height: n3, scale: r4, axis: "x", values: o2 });
  }, [r4, o2, e4, n3]), c2 = (0, import_react.useMemo)(function() {
    return !!a2 && S({ width: e4, height: n3, scale: a2, axis: "y", values: l });
  }, [n3, e4, a2, l]);
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [s && (0, import_jsx_runtime.jsx)(V, { lines: s }), c2 && (0, import_jsx_runtime.jsx)(V, { lines: c2 })] });
});
var C = function(t3, e4) {
  var i2, n3 = e4.axis, r4 = e4.scale, a2 = e4.x, o2 = void 0 === a2 ? 0 : a2, s = e4.y, c2 = void 0 === s ? 0 : s, x = e4.length, d = e4.ticksPosition, m = e4.tickValues, y = e4.tickSize, v = void 0 === y ? 5 : y, g = e4.tickPadding, h = void 0 === g ? 5 : g, k3 = e4.tickRotation, p2 = void 0 === k3 ? 0 : k3, b2 = e4.format, P2 = e4.legend, A2 = e4.legendPosition, S2 = void 0 === A2 ? "end" : A2, w2 = e4.legendOffset, X3 = void 0 === w2 ? 0 : w2, Y3 = e4.theme, B2 = T({ axis: n3, scale: r4, ticksPosition: d, tickValues: m, tickSize: v, tickPadding: h, tickRotation: p2, engine: "canvas" }), O2 = B2.ticks, W3 = B2.textAlign, V2 = B2.textBaseline;
  t3.save(), t3.translate(o2, c2), t3.textAlign = W3, t3.textBaseline = V2, r(t3, Y3.axis.ticks.text), (null != (i2 = Y3.axis.domain.line.strokeWidth) ? i2 : 0) > 0 && (t3.lineWidth = Number(Y3.axis.domain.line.strokeWidth), t3.lineCap = "square", Y3.axis.domain.line.stroke && (t3.strokeStyle = Y3.axis.domain.line.stroke), t3.beginPath(), t3.moveTo(0, 0), t3.lineTo("x" === n3 ? x : 0, "x" === n3 ? 0 : x), t3.stroke());
  var z2 = "function" == typeof b2 ? b2 : function(t4) {
    return "" + t4;
  };
  if (O2.forEach(function(e6) {
    var i3;
    (null != (i3 = Y3.axis.ticks.line.strokeWidth) ? i3 : 0) > 0 && (t3.lineWidth = Number(Y3.axis.ticks.line.strokeWidth), t3.lineCap = "square", Y3.axis.ticks.line.stroke && (t3.strokeStyle = Y3.axis.ticks.line.stroke), t3.beginPath(), t3.moveTo(e6.x, e6.y), t3.lineTo(e6.x + e6.lineX, e6.y + e6.lineY), t3.stroke());
    var n4 = z2(e6.value);
    t3.save(), t3.translate(e6.x + e6.textX, e6.y + e6.textY), t3.rotate(Wt(p2)), o(t3, Y3.axis.ticks.text, "" + n4), t3.fillText("" + n4, 0, 0), t3.restore();
  }), void 0 !== P2) {
    var C2 = 0, D2 = 0, R2 = 0, j = "center";
    "y" === n3 ? (R2 = -90, C2 = X3, "start" === S2 ? (j = "start", D2 = x) : "middle" === S2 ? (j = "center", D2 = x / 2) : "end" === S2 && (j = "end")) : (D2 = X3, "start" === S2 ? j = "start" : "middle" === S2 ? (j = "center", C2 = x / 2) : "end" === S2 && (j = "end", C2 = x)), t3.translate(C2, D2), t3.rotate(Wt(R2)), t3.font = (Y3.axis.legend.text.fontWeight ? Y3.axis.legend.text.fontWeight + " " : "") + Y3.axis.legend.text.fontSize + "px " + Y3.axis.legend.text.fontFamily, Y3.axis.legend.text.fill && (t3.fillStyle = Y3.axis.legend.text.fill), t3.textAlign = j, t3.textBaseline = "middle", t3.fillText(P2, 0, 0);
  }
  t3.restore();
};
var D = function(t3, e4) {
  var i2 = e4.xScale, n3 = e4.yScale, r4 = e4.width, a2 = e4.height, o2 = e4.top, l = e4.right, s = e4.bottom, c2 = e4.left, f = e4.theme, u = { top: o2, right: l, bottom: s, left: c2 };
  B.forEach(function(e6) {
    var o3 = u[e6];
    if (!o3) return null;
    var l2 = "top" === e6 || "bottom" === e6, s2 = "top" === e6 || "left" === e6 ? "before" : "after", c3 = l2 ? i2 : n3, x = A(o3.format, c3);
    C(t3, P({}, o3, { axis: l2 ? "x" : "y", x: "right" === e6 ? r4 : 0, y: "bottom" === e6 ? a2 : 0, scale: c3, format: x, length: l2 ? r4 : a2, ticksPosition: s2, theme: f }));
  });
};
var R = function(t3, e4) {
  var i2 = e4.width, n3 = e4.height, r4 = e4.scale, a2 = e4.axis, o2 = e4.values;
  S({ width: i2, height: n3, scale: r4, axis: a2, values: o2 }).forEach(function(e6) {
    t3.beginPath(), t3.moveTo(e6.x1, e6.y1), t3.lineTo(e6.x2, e6.y2), t3.stroke();
  });
};

export {
  require_baseIteratee,
  require_uniqBy,
  require_baseEach,
  dn,
  ln,
  O,
  z,
  D,
  R
};
//# sourceMappingURL=chunk-XGAQ76QW.js.map
