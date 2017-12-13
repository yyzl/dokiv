(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Clair = factory());
}(this, (function () { 'use strict';

var breakpoints = [ 'xs', 'sm', 'md', 'lg', 'xl' ];

var responsiveFun = function (Vue) {
  var responsive = new Vue({
    data: { media: breakpoints[0] }
  });

  // create an element to listen viewport change
  if (typeof window === 'object') {
    var element = document.createElement('div');
    element.className = 'c-responsive-listener';
    document.body.appendChild(element);
    var getMediaType = function (_) {
      return breakpoints[element.clientWidth]
    };
    element.addEventListener('transitionend', function (e) {
      var oldMedia = responsive.media;
      var media = getMediaType();
      if (oldMedia === media) { return } // no media change
      responsive.$emit('change', media, oldMedia);
      responsive.media = media;
    });
    responsive.media = getMediaType();
  }

  return responsive
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

// polyfill `Object.assign`
// SEE https://www.npmjs.com/package/object-assign
Object.assign = objectAssign;

/**
 * install function when Clair is used
 * NOTE: components are registered automatically, DON'T register them here
 */
var main = {
  install: function install (Vue) {
    if (!('$clair' in Vue.prototype)) {
      var responsive = responsiveFun(Vue);
      var $clair = new Vue({
        data: {
          responsive: responsive,
          icon: 'feather'
        }
      });

      Object.defineProperty(Vue.prototype, '$clair', {
        get: function get () { return $clair }
      });
    }
  }
};

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

var _baseClamp = baseClamp;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Number
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 * @example
 *
 * _.clamp(-10, -5, 5);
 * // => -5
 *
 * _.clamp(10, -5, 5);
 * // => 5
 */
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }
  if (upper !== undefined) {
    upper = toNumber_1(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== undefined) {
    lower = toNumber_1(lower);
    lower = lower === lower ? lower : 0;
  }
  return _baseClamp(toNumber_1(number), lower, upper);
}

var clamp_1 = clamp;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root.Date.now();
};

var now_1 = now;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;
var nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber_1(wait) || 0;
  if (isObject_1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now_1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now_1());
  }

  function debounced() {
    var time = now_1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject_1(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce_1(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

var throttle_1 = throttle;

var MOUSE_MOVE_DEFALT_TRHOTTLE_TIME = 80;

var baseRange = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"container",staticClass:"c-base-range",on:{"mousedown":function($event){$event.preventDefault();_vm.onMousedown($event);}}},[_vm._t("default"),_vm._t("thumb")],2)},staticRenderFns: [],
  name: 'c-base-range',
  model: { event: 'change' },
  props: {
    direction: {
      type: String,
      default: 'h'
    },
    throttle: {
      type: Number,
      default: MOUSE_MOVE_DEFALT_TRHOTTLE_TIME
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onMousedown: function onMousedown (e) {
      var this$1 = this;

      if (this.disabled) {
        return
      }

      e.preventDefault();

      var onmousemove = throttle_1(function (e) {
        e.preventDefault();
        this$1.updateValue(e);
      }, this.throttle);

      var onmouseup = function (e) {
        this$1.updateValue(e);
        document.removeEventListener('mousemove', onmousemove);
        document.removeEventListener('mouseup', onmouseup);
      };

      document.addEventListener('mousemove', onmousemove);
      document.addEventListener('mouseup', onmouseup);
      this.updateValue(e);
    },

    updateValue: function updateValue (ref) {
      if ( ref === void 0 ) ref = {};
      var clientX = ref.clientX; if ( clientX === void 0 ) clientX = 0;
      var clientY = ref.clientY; if ( clientY === void 0 ) clientY = 0;

      var rect = this.$refs.container.getBoundingClientRect();
      var left = rect.left;
      var top = rect.top;
      var width = rect.width;
      var height = rect.height;

      var deltaX = clientX - left;
      var deltaY = clientY - top;

      var x = clamp_1(deltaX / width, 0, 1);
      var y = clamp_1(deltaY / height, 0, 1);

      var dir = this.direction;
      // eslint-disable-next-line
      var data = dir === 'vh' ? { x: x, y: y } : (dir === 'v' ? y : x);

      this.$emit('change', data);
    }
  },
  created: function created () {
    var ref = this;
    var direction = ref.direction;

    if (direction === 'hv') {
      this.direction = 'vh';
    }
  }
};

var ButtonGroup = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-button-group"},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'c-button-group',
  props: {},

  data: function data () {
    return {}
  },

  methods: {}
};

/**
 * @desc get Vue props definitions from modifier list
 * @param modifiers {Array}
 * @return {Object}
 * @see https://vuejs.org/v2/guide/components.html#Props
 */
function toVueProps (modifiers) {
  return modifiers.reduce(function (props, modifier) {
    props[modifier] = Boolean;
    return props
  }, {})
}

/**
 * @desc get Vue class binding from `block` and `modifiers`
 * @param block {String} `block` part of BEM, eg. `.c-button`
 * @param modifiers {Array} list of `modifier`
 * @return {Object} Vue class binding object, see
 * @see https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax
 * @see https://en.bem.info/methodology/
 */
function toClassNames (block, modifiers) {
  return function () {
    var this$1 = this;

    return modifiers
      .filter(function (m) { return this$1[m]; })
      .map(function (m) { return (block + "--" + m); })
  }
}

/**
 * return a 6 length random string
 * warning: uniqueness NOT guaranteed
 */
function randomString () {
  var radix = 36;
  var length = 6;
  return Math.random().toString(radix).substr(-length)
}

// import css
var name = 'c-button';
var block = "c-button";
var modifiers = [
  'primary',
  'danger',
  'round',
  'outline',
  'loading'
];
var props = Object.assign(
  {
    href: String,
    size: String,
    icon: String
  },
  toVueProps(modifiers)
);
var classNames = toClassNames(block, modifiers);

var Button = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.href)?_c('router-link',{staticClass:"c-button",class:_vm.classNames,attrs:{"tag":"button","to":_vm.href}},[(_vm.iconName)?_c('c-icon',{attrs:{"name":_vm.iconName,"valign":"middle"}}):_vm._e(),(_vm.$slots.default)?_c('span',[_vm._t("default")],2):_vm._e()],1):_c('button',{staticClass:"c-button",class:_vm.classNames,on:{"click":_vm.onClick}},[(_vm.iconName)?_c('c-icon',{attrs:{"name":_vm.iconName,"valign":"middle"}}):_vm._e(),(_vm.$slots.default)?_c('span',[_vm._t("default")],2):_vm._e()],1)},staticRenderFns: [],
  name: name,
  props: props,
  computed: {
    iconName: function iconName () {
      return this.loading ? 'loader' : this.icon
    },
    classNames: function classNames$1 () {
      var classList = classNames.call(this);
      if (this.size) { classList.push(("c-button--" + (this.size))); }
      return classList
    }
  },
  methods: {
    onClick: function onClick (e) {
      this.$emit('click', e);
    }
  }
};

/**
 * 获取变量的字符串值
 */
function toString (value) {
  return value === void 0 || value === null
    ? ''
    : value.toString().trim()
}

var ruleset = {

  /**
   * 必填(选)验证
   */
  required: function (value) {
    // value需要转换成字符串再计算length，不然数字或者0都会是invalid
    var valid = Boolean(toString(value).length);
    var msg = valid ? '' : '请填写此项';
    return { valid: valid, msg: msg }
  },

  /**
   * 最小长度验证
   * @param param {String} 最少输入多少个字
   */
  minlength: function (value, param) {
    // value需要转换成字符串计算length，不然数字或者0都会是invalid
    var valid = toString(value).length >= parseInt(param);
    var msg = valid ? '' : ("请最少填写" + param + "个字");
    return { valid: valid, msg: msg }
  },

  /**
   * 最大长度验证， 主要针对 IE9 下 textarea 的 maxlength 无效的情况
   * @param param {String} 最多输入多少个字
   */
  maxlength: function (value, param) {
    // value需要转换成字符串计算length，不然数字或者0都会是invalid
    var valid = toString(value).length <= parseInt(param);
    var msg = valid ? '' : ("最多填写" + param + "个字");
    return { valid: valid, msg: msg }
  },

  /**
   * 验证输入是否某种指定类型的格式
   * @param param {String} 类型，比如email、tel等
   */
  type: function (value, param) {
    var method = param + "Type";
    return ruleset[method](value)
  },

  /**
   * 邮箱格式验证
   */
  emailType: function (value) {
    var pattern = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    var valid = pattern.test(toString(value));
    var msg = valid ? '' : '邮箱格式不正确';
    return { valid: valid, msg: msg }
  },

  /**
   * 手机号码格式
   */
  mobileType: function (value) {
    var pattern = /^1[3|4|5|7|8]\d{9}$/;
    var valid = pattern.test(toString(value));
    var msg = valid ? '' : '手机号码格式不正确';
    return { valid: valid, msg: msg }
  },

  /**
   * 固定电话格式
   */
  telType: function (value) {
    var pattern = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/;
    var valid = pattern.test(toString(value));
    var msg = valid ? '' : '固定电话号码格式不正确';
    return { valid: valid, msg: msg }
  },

  /**
   * 数字格式
   */
  numberType: function (value) {
    var valid = !isNaN(value);
    var msg = valid ? '' : '请输入数字';
    return { valid: valid, msg: msg }
  },

  /**
   * max格式
   */
  max: function (value, param) {
    var valid = !isNaN(value);
    var msg = valid ? '' : '请输入数字';
    if (!valid) { return { valid: valid, msg: msg } }
    valid = parseFloat(value) <= parseFloat(param);
    msg = valid ? '' : ("输入值最大为" + param);
    return { valid: valid, msg: msg }
  },

  /**
   * min格式
   */
  min: function (value, param) {
    var valid = !isNaN(value);
    var msg = valid ? '' : '请输入数字';
    if (!valid) { return { valid: valid, msg: msg } }
    valid = parseFloat(value) >= parseFloat(param);
    msg = valid ? '' : ("输入值最小为" + param);
    return { valid: valid, msg: msg }
  },
  /**
   * 整数格式
   */
  integerType: function (value, input) {
    var pattern = /^\d*$/;
    var valid = pattern.test(toString(value));
    var msg = valid ? '' : '请输入整数';
    return { valid: valid, msg: msg }
  },

  /**
   * URL格式
   */
  urlType: function (value) {
    /* eslint-disable max-len, no-useless-escape */
    var pattern = /^(https?\:\/\/)?([a-z\d\-]+\.)+[a-z]{2,6}[\/\?\#]?([\/\?\#][\w|\:|\/|\.|\-|\#|\!|\~|\%|\&|\+|\=|\?|\$]+)?$/i;
    var valid = pattern.test(toString(value));
    var msg = valid ? '' : 'URL 格式不正确';
    return { valid: valid, msg: msg }
  },

  /**
   * 自定义正则
   */
  pattern: function (value, param) {
    var valid = param.test(toString(value));
    var msg = valid ? '' : '格式不符合要求';
    return { valid: valid, msg: msg }
  }
};

var Validator = { validate: validate };

/**
 * 验证 value 是否符合规则
 * @param value {String} 要验证的值
 * @param rules {Object} 规则
 * @return {Object} 结果对象，有valid和msg两个字段
 */
function validate (value, rules) {
  if ( rules === void 0 ) rules = {};

  // msg 为自定义错误信息
  var msg = rules.msg;
  var pass = { valid: true };
  var isValueEmpty = toString(value).length === 0;

  // 非必填项且没有填写时，不进行校验
  if (!rules.required && isValueEmpty) { return pass }

  var results = Object.keys(rules)
    .filter(function (ruleName) { return canValidate(ruleName, rules[ruleName]); })
    .map(function (ruleName) { return checkSingleRule(ruleName, rules[ruleName], value, msg); });

  var failedResult = results.find(function (result) { return !result.valid; });
  return failedResult || pass
}

/**
 * 验证单条规则
 */
function checkSingleRule (ruleName, param, value, msg) {
  var validFunction = typeof param === 'function' ? param : ruleset[ruleName];
  var result = validFunction(value, param);
  if (!result.valid && msg) { // 验证不通过且有自定义消息
    if (typeof msg == 'string') { // 自定义消息为字符串时直接使用
      result.msg = msg;
    } else if (msg[ruleName]) { // 自定义消息为对象时，取出该类错误的消息
      result.msg = msg[ruleName];
    }
  }
  return result
}

/**
 * 给出的规则是否可验证
 * 条件：
 * 1. 非保留字，'msg' 用来指定自定义提示
 * 2. 内置或自定义规则
 */
function canValidate (ruleName, param) {
  var isReservedWord = ruleName === 'msg';
  var isBuiltinRule = typeof ruleset[ruleName] === 'function';
  var isCustomRule = typeof param === 'function';
  return !isReservedWord && (isBuiltinRule || isCustomRule)
}

/**
 * A Vue.js mixin to add validate functionality
 */
var validatable = {

  data: function () { return ({
    // store validation result
    validity: {
      valid: true,
      msg: '',
      dirty: false
    }
  }); },

  created: function () {
    var hasRules = this.$options.props.rules || this.rules;
    if (!this.$options.props.value || !hasRules) {
      var msg = "Prop 'value' and 'rules' are required to use 'Validatable'.";
      throw new Error(msg)
    }
    var setDirty = function setDirty () {
      this.validity.dirty = true;
    };
    this.$on('input', setDirty);
    this.$on('change', setDirty);
  },

  watch: {
    value: function () {
      if (this.validity.dirty) {
        Object.assign(this.validity, this.validate());
      }
    }
  },

  methods: {
    validate: function () {
      this.validity.dirty = true;
      return Object.assign(
        this.validity,
        Validator.validate(this.value, this.rules)
      )
    }
  }

};

var name$1 = 'c-checkbox-group';
var pass = { valid: true, msg: '' };

// 必填检查
var required = function (value) {
  if (!this.required) { return pass }
  var valid = Array.isArray(value) && value.length > 0;
  var msg = valid ? '' : '请至少选择一项';
  return { valid: valid, msg: msg }
};

// 最少选择X项
var minItems = function (value) {
  if (!this.minItems) { return pass }
  var valid = Array.isArray(value) && value.length >= this.minItems;
  var msg = valid ? '' : ("请至少选择" + (this.minItems) + "项");
  return { valid: valid, msg: msg }
};

// 最多选择X项
var maxItems = function (value) {
  if (!this.maxItems) { return pass }
  var valid = Array.isArray(value) && value.length <= this.maxItems;
  var msg = valid ? '' : ("最多可以选择" + (this.maxItems) + "项");
  return { valid: valid, msg: msg }
};

var props$1 = {
  value: {
    type: Array,
    default: function default$1 () { return [] }
  },
  required: Boolean,
  minItems: Number,
  maxItems: Number,
  options: {
    type: Array,
    required: true,
    default: function default$2 () { return [] }
  }
};

var CheckboxGroup = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-checkbox-group"},[_vm._l((_vm.optionList),function(option,index){return _c('c-checkbox',{attrs:{"label":option.label,"disabled":option.disabled},on:{"change":function($event){_vm.onItemChange($event, index);}},model:{value:(_vm.isChecked[index]),callback:function ($$v) {var $$exp = _vm.isChecked, $$idx = index;if (!Array.isArray($$exp)){_vm.isChecked[index]=$$v;}else{$$exp.splice($$idx, 1, $$v);}},expression:"isChecked[index]"}})}),(!_vm.validity.valid)?_c('em',{staticClass:"c-error-msg"},[_vm._v(_vm._s(_vm.validity.msg))]):_vm._e()],2)},staticRenderFns: [],
  name: name$1,
  model: {
    event: 'change'
  },
  props: props$1,
  mixins: [validatable],
  data: function data () {
    return {
      isChecked: [],
      rules: {}
    }
  },
  computed: {
    optionList: function optionList () {
      return this.options.map(function (item) {
        if (typeof item === 'string') {
          return {
            value: item,
            label: item
          }
        }

        if (item && typeof item === 'object') {
          if (item.hasOwnProperty('label') && item.hasOwnProperty('value')) {
            return item
          }
        }

        throw new TypeError('Type of option prop is invalid.')
      })
    }
  },
  created: function created () {
    Object.assign(this.rules, {
      required: required.bind(this),
      minItems: minItems.bind(this),
      maxItems: maxItems.bind(this)
    });
    this.updateChecked();
    this.$watch('options', this.updateChecked);
    this.$watch('value', this.updateChecked);
  },
  methods: {
    updateChecked: function updateChecked () {
      var this$1 = this;

      var isChecked = this.optionList.map(function (option) {
        return this$1.value.indexOf(option.value) > -1
      });
      this.isChecked = isChecked;
    },

    onItemChange: function onItemChange (checked, index) {
      var isChecked = [].concat( this.isChecked );
      isChecked[index] = checked;

      var checkedValues = this.optionList
        .filter(function (_, i) { return isChecked[i]; })
        .map(function (option) { return option.value; });

      this.$emit('change', checkedValues);
    }
  }
};

// import css
var name$2 = 'c-checkbox';
var props$2 = {
  value: Boolean,
  name: String,
  label: String,
  disabled: Boolean,
  indeterminate: Boolean
};

var Checkbox = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{staticClass:"c-checkbox",on:{"change":_vm.onChange}},[_c('input',{ref:"input",attrs:{"type":"checkbox","name":_vm.name,"disabled":_vm.disabled},domProps:{"checked":_vm.value}}),_c('span',{staticClass:"c-checkbox__box"}),_c('span',{staticClass:"c-checkbox__label"},[_vm._v(_vm._s(_vm.label))])])},staticRenderFns: [],
  name: name$2,
  model: {
    event: 'change'
  },
  props: props$2,
  watch: {
    indeterminate: function indeterminate (newVal) {
      if (this.$refs.input) {
        this.$refs.input.indeterminate = Boolean(newVal);
      }
    }
  },
  mounted: function mounted () {
    if (this.$refs.input) {
      this.$refs.input.indeterminate = this.indeterminate;
    }
  },
  methods: {
    onChange: function onChange (e) {
      this.$emit('change', e.target.checked);
    }
  }
};

/**
 * multiply a quantity (with unit)
 */
function multiply (quatity, times) {
  var ref = /(-?\d+(?:\.\d+)?)(.*)/.exec(quatity) || [];
  var num = ref[1];
  var unit = ref[2];
  var timedNum = parseFloat(num) * times;
  return ("" + timedNum + unit)
}

var props$3 = breakpoints
  .map(function (bp) { return (bp + "-only"); })
  .concat(breakpoints)
  .concat(['order', 'span', 'offset']);

var getClassName = function (values, media) {
  if (!values) { return [] }
  return values.split(/\s+/)
    .map(function (val) { return (media + "-" + val); })
};

var BoxItem = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-box__item",class:_vm.classNames,style:(_vm.style)},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'c-box-item',
  props: props$3,
  computed: {

    /**
     * get class name list of the box item
     */
    classNames: function classNames () {
      var this$1 = this;

      var classNames = breakpoints
        .reduce(function (classNames, bp) {
          classNames.push.apply(classNames, getClassName(this$1[bp], bp));
          classNames.push.apply(classNames, getClassName(this$1[(bp + "Only")], (bp + "-only")));
          return classNames
        }, []);
      if (this.span) { classNames.push(("is-" + (this.span))); }
      if (this.offset) { classNames.push(("is-offset-" + (this.offset))); }
      return classNames
    },

    /**
     * set gap of parent
     */
    padding: function padding () {
      return this.$parent.gap ? multiply(this.$parent.gap, 0.5) : ''
    },

    /**
     * set box item gap
     */
    style: function style () {
      var style = {};
      if (this.padding) {
        style.paddingLeft = this.padding;
        style.paddingRight = this.padding;
      }
      if (this.order) {
        style.order = this.order;
      }
      return style
    }

  },
  methods: {
  }
};

var Container = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-container",class:_vm.classNames},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'c-container',
  props: {
    size: String,
    align: String
  },
  computed: {
    classNames: function classNames () {
      var classNames = [];
      if (this.size) { classNames.push(("is-" + (this.size))); }
      if (this.align) { classNames.push(("is-" + (this.align))); }
      return classNames
    }
  }
};

var Grid = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-box",class:_vm.classNames,style:(_vm.style)},[_vm._t("default")],2)},staticRenderFns: [],
  props: {
    gap: String,
    justify: String,
    align: String
  },
  name: 'c-box',
  computed: {
    margin: function margin () {
      return this.gap ? multiply(this.gap, -0.5) : ''
    },
    style: function style () {
      var style = {};
      // margin for gap
      if (this.margin) {
        style.marginLeft = this.margin;
        style.marginRight = this.margin;
      }
      return style
    },
    classNames: function classNames () {
      var classNames = [];
      var ref = this;
      var justify = ref.justify;
      var align = ref.align;
      if (justify) { classNames.push(("is-justify-" + justify)); }
      if (align) { classNames.push(("is-align-" + align)); }
      return classNames
    }
  }
};

var activity = "<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"></polyline>";
var airplay = "<path d=\"M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1\"></path><polygon points=\"12 15 17 21 7 21 12 15\"></polygon>";
var anchor = "<circle cx=\"12\" cy=\"5\" r=\"3\"></circle><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"8\"></line><path d=\"M5 12H2a10 10 0 0 0 20 0h-3\"></path>";
var aperture = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"14.31\" y1=\"8\" x2=\"20.05\" y2=\"17.94\"></line><line x1=\"9.69\" y1=\"8\" x2=\"21.17\" y2=\"8\"></line><line x1=\"7.38\" y1=\"12\" x2=\"13.12\" y2=\"2.06\"></line><line x1=\"9.69\" y1=\"16\" x2=\"3.95\" y2=\"6.06\"></line><line x1=\"14.31\" y1=\"16\" x2=\"2.83\" y2=\"16\"></line><line x1=\"16.62\" y1=\"12\" x2=\"10.88\" y2=\"21.94\"></line>";
var award = "<circle cx=\"12\" cy=\"8\" r=\"7\"></circle><polyline points=\"8.21 13.89 7 23 12 20 17 23 15.79 13.88\"></polyline>";
var battery = "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" ry=\"2\"></rect><line x1=\"23\" y1=\"13\" x2=\"23\" y2=\"11\"></line>";
var bell = "<path d=\"M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0\"></path>";
var bluetooth = "<polyline points=\"6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5\"></polyline>";
var bold = "<path d=\"M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z\"></path><path d=\"M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z\"></path>";
var book = "<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"></path><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"></path>";
var bookmark = "<path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"></path>";
var box = "<path d=\"M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z\"></path><polyline points=\"2.32 6.16 12 11 21.68 6.16\"></polyline><line x1=\"12\" y1=\"22.76\" x2=\"12\" y2=\"11\"></line>";
var briefcase = "<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"></rect><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path>";
var calendar = "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line>";
var camera = "<path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"></path><circle cx=\"12\" cy=\"13\" r=\"4\"></circle>";
var cast = "<path d=\"M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6\"></path><line x1=\"2\" y1=\"20\" x2=\"2\" y2=\"20\"></line>";
var check = "<polyline points=\"20 6 9 17 4 12\"></polyline>";
var chrome = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"4\"></circle><line x1=\"21.17\" y1=\"8\" x2=\"12\" y2=\"8\"></line><line x1=\"3.95\" y1=\"6.06\" x2=\"8.54\" y2=\"14\"></line><line x1=\"10.88\" y1=\"21.94\" x2=\"15.46\" y2=\"14\"></line>";
var circle = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle>";
var clipboard = "<path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"></path><rect x=\"8\" y=\"2\" width=\"8\" height=\"4\" rx=\"1\" ry=\"1\"></rect>";
var clock = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 15 15\"></polyline>";
var cloud = "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\"></path>";
var codepen = "<polygon points=\"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2\"></polygon><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"15.5\"></line><polyline points=\"22 8.5 12 15.5 2 8.5\"></polyline><polyline points=\"2 15.5 12 8.5 22 15.5\"></polyline><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"8.5\"></line>";
var command = "<path d=\"M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z\"></path>";
var compass = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\"></polygon>";
var copy = "<rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path>";
var cpu = "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" ry=\"2\"></rect><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"></rect><line x1=\"9\" y1=\"1\" x2=\"9\" y2=\"4\"></line><line x1=\"15\" y1=\"1\" x2=\"15\" y2=\"4\"></line><line x1=\"9\" y1=\"20\" x2=\"9\" y2=\"23\"></line><line x1=\"15\" y1=\"20\" x2=\"15\" y2=\"23\"></line><line x1=\"20\" y1=\"9\" x2=\"23\" y2=\"9\"></line><line x1=\"20\" y1=\"14\" x2=\"23\" y2=\"14\"></line><line x1=\"1\" y1=\"9\" x2=\"4\" y2=\"9\"></line><line x1=\"1\" y1=\"14\" x2=\"4\" y2=\"14\"></line>";
var crop = "<path d=\"M6.13 1L6 16a2 2 0 0 0 2 2h15\"></path><path d=\"M1 6.13L16 6a2 2 0 0 1 2 2v15\"></path>";
var crosshair = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"22\" y1=\"12\" x2=\"18\" y2=\"12\"></line><line x1=\"6\" y1=\"12\" x2=\"2\" y2=\"12\"></line><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"2\"></line><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"18\"></line>";
var disc = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>";
var download = "<path d=\"M3 17v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3\"></path><polyline points=\"8 12 12 16 16 12\"></polyline><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"16\"></line>";
var droplet = "<path d=\"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\"></path>";
var edit = "<path d=\"M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34\"></path><polygon points=\"18 2 22 6 12 16 8 16 8 12 18 2\"></polygon>";
var eye = "<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>";
var facebook = "<path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\"></path>";
var feather = "<path d=\"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z\"></path><line x1=\"16\" y1=\"8\" x2=\"2\" y2=\"22\"></line><line x1=\"17\" y1=\"15\" x2=\"9\" y2=\"15\"></line>";
var file = "<path d=\"M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z\"></path><polyline points=\"13 2 13 9 20 9\"></polyline>";
var film = "<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2.18\" ry=\"2.18\"></rect><line x1=\"7\" y1=\"2\" x2=\"7\" y2=\"22\"></line><line x1=\"17\" y1=\"2\" x2=\"17\" y2=\"22\"></line><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"2\" y1=\"7\" x2=\"7\" y2=\"7\"></line><line x1=\"2\" y1=\"17\" x2=\"7\" y2=\"17\"></line><line x1=\"17\" y1=\"17\" x2=\"22\" y2=\"17\"></line><line x1=\"17\" y1=\"7\" x2=\"22\" y2=\"7\"></line>";
var filter = "<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\"></polygon>";
var flag = "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"></path><line x1=\"4\" y1=\"22\" x2=\"4\" y2=\"15\"></line>";
var folder = "<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"></path>";
var github = "<path d=\"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22\"></path>";
var gitlab = "<path d=\"M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z\"></path>";
var globe = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"></path>";
var grid = "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect>";
var hash = "<line x1=\"4\" y1=\"9\" x2=\"20\" y2=\"9\"></line><line x1=\"4\" y1=\"15\" x2=\"20\" y2=\"15\"></line><line x1=\"10\" y1=\"3\" x2=\"8\" y2=\"21\"></line><line x1=\"16\" y1=\"3\" x2=\"14\" y2=\"21\"></line>";
var headphones = "<path d=\"M3 18v-6a9 9 0 0 1 18 0v6\"></path><path d=\"M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z\"></path>";
var heart = "<path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"></path>";
var home = "<path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path><polyline points=\"9 22 9 12 15 12 15 22\"></polyline>";
var image = "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"></circle><polyline points=\"21 15 16 10 5 21\"></polyline>";
var inbox = "<polyline points=\"22 13 16 13 14 16 10 16 8 13 2 13\"></polyline><path d=\"M5.47 5.19L2 13v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5l-3.47-7.81A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.83 1.19z\"></path>";
var info = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"8\"></line>";
var instagram = "<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\" ry=\"5\"></rect><path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"></path><line x1=\"17.5\" y1=\"6.5\" x2=\"17.5\" y2=\"6.5\"></line>";
var italic = "<line x1=\"19\" y1=\"4\" x2=\"10\" y2=\"4\"></line><line x1=\"14\" y1=\"20\" x2=\"5\" y2=\"20\"></line><line x1=\"15\" y1=\"4\" x2=\"9\" y2=\"20\"></line>";
var layers = "<polygon points=\"12 2 2 7 12 12 22 7 12 2\"></polygon><polyline points=\"2 17 12 22 22 17\"></polyline><polyline points=\"2 12 12 17 22 12\"></polyline>";
var layout = "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"></line><line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\"></line>";
var link = "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>";
var list = "<line x1=\"8\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"8\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"8\" y1=\"18\" x2=\"21\" y2=\"18\"></line><line x1=\"3\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"3\" y1=\"12\" x2=\"3\" y2=\"12\"></line><line x1=\"3\" y1=\"18\" x2=\"3\" y2=\"18\"></line>";
var loader = "<line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"6\"></line><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"22\"></line><line x1=\"4.93\" y1=\"4.93\" x2=\"7.76\" y2=\"7.76\"></line><line x1=\"16.24\" y1=\"16.24\" x2=\"19.07\" y2=\"19.07\"></line><line x1=\"2\" y1=\"12\" x2=\"6\" y2=\"12\"></line><line x1=\"18\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"4.93\" y1=\"19.07\" x2=\"7.76\" y2=\"16.24\"></line><line x1=\"16.24\" y1=\"7.76\" x2=\"19.07\" y2=\"4.93\"></line>";
var lock = "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>";
var mail = "<path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"></path><polyline points=\"22,6 12,13 2,6\"></polyline>";
var map = "<polygon points=\"1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6\"></polygon><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"18\"></line><line x1=\"16\" y1=\"6\" x2=\"16\" y2=\"22\"></line>";
var maximize = "<path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"></path>";
var menu = "<line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"></line>";
var mic = "<path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\"></path><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"></path><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"></line><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"></line>";
var minimize = "<path d=\"M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3\"></path>";
var minus = "<line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>";
var monitor = "<rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"></rect><line x1=\"8\" y1=\"21\" x2=\"16\" y2=\"21\"></line><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\"></line>";
var moon = "<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"></path>";
var move = "<polyline points=\"5 9 2 12 5 15\"></polyline><polyline points=\"9 5 12 2 15 5\"></polyline><polyline points=\"15 19 12 22 9 19\"></polyline><polyline points=\"19 9 22 12 19 15\"></polyline><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"></line>";
var music = "<path d=\"M9 17H5a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm12-2h-4a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z\"></path><polyline points=\"9 17 9 5 21 3 21 15\"></polyline>";
var navigation = "<polygon points=\"3 11 22 2 13 21 11 13 3 11\"></polygon>";
var octagon = "<polygon points=\"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2\"></polygon>";
var paperclip = "<path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"></path>";
var pause = "<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"></rect><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"></rect>";
var percent = "<line x1=\"19\" y1=\"5\" x2=\"5\" y2=\"19\"></line><circle cx=\"6.5\" cy=\"6.5\" r=\"2.5\"></circle><circle cx=\"17.5\" cy=\"17.5\" r=\"2.5\"></circle>";
var phone = "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>";
var play = "<polygon points=\"5 3 19 12 5 21 5 3\"></polygon>";
var plus = "<line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>";
var pocket = "<path d=\"M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z\"></path><polyline points=\"8 10 12 14 16 10\"></polyline>";
var power = "<path d=\"M18.36 6.64a9 9 0 1 1-12.73 0\"></path><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"12\"></line>";
var printer = "<polyline points=\"6 9 6 2 18 2 18 9\"></polyline><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"></rect>";
var radio = "<circle cx=\"12\" cy=\"12\" r=\"2\"></circle><path d=\"M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14\"></path>";
var repeat = "<polyline points=\"17 1 21 5 17 9\"></polyline><path d=\"M3 11V9a4 4 0 0 1 4-4h14\"></path><polyline points=\"7 23 3 19 7 15\"></polyline><path d=\"M21 13v2a4 4 0 0 1-4 4H3\"></path>";
var rewind = "<polygon points=\"11 19 2 12 11 5 11 19\"></polygon><polygon points=\"22 19 13 12 22 5 22 19\"></polygon>";
var save = "<path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"></path><polyline points=\"17 21 17 13 7 13 7 21\"></polyline><polyline points=\"7 3 7 8 15 8\"></polyline>";
var scissors = "<circle cx=\"6\" cy=\"6\" r=\"3\"></circle><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><line x1=\"20\" y1=\"4\" x2=\"8.12\" y2=\"15.88\"></line><line x1=\"14.47\" y1=\"14.48\" x2=\"20\" y2=\"20\"></line><line x1=\"8.12\" y1=\"8.12\" x2=\"12\" y2=\"12\"></line>";
var search = "<circle cx=\"10.5\" cy=\"10.5\" r=\"7.5\"></circle><line x1=\"21\" y1=\"21\" x2=\"15.8\" y2=\"15.8\"></line>";
var server = "<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" y1=\"6\" x2=\"6\" y2=\"6\"></line><line x1=\"6\" y1=\"18\" x2=\"6\" y2=\"18\"></line>";
var settings = "<circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"></path>";
var share = "<path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\"></path><polyline points=\"16 6 12 2 8 6\"></polyline><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"15\"></line>";
var shield = "<path d=\"M12 22s8-4 8-10V4l-8-2-8 2v8c0 6 8 10 8 10z\"></path>";
var shuffle = "<polyline points=\"16 3 21 3 21 8\"></polyline><line x1=\"4\" y1=\"20\" x2=\"21\" y2=\"3\"></line><polyline points=\"21 16 21 21 16 21\"></polyline><line x1=\"15\" y1=\"15\" x2=\"21\" y2=\"21\"></line><line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"></line>";
var sidebar = "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"9\" y1=\"3\" x2=\"9\" y2=\"21\"></line>";
var slack = "<path d=\"M22.08 9C19.81 1.41 16.54-.35 9 1.92S-.35 7.46 1.92 15 7.46 24.35 15 22.08 24.35 16.54 22.08 9z\"></path><line x1=\"12.57\" y1=\"5.99\" x2=\"16.15\" y2=\"16.39\"></line><line x1=\"7.85\" y1=\"7.61\" x2=\"11.43\" y2=\"18.01\"></line><line x1=\"16.39\" y1=\"7.85\" x2=\"5.99\" y2=\"11.43\"></line><line x1=\"18.01\" y1=\"12.57\" x2=\"7.61\" y2=\"16.15\"></line>";
var slash = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"></line>";
var sliders = "<line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\"></line><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\"></line><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\"></line><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\"></line><line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\"></line><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"></line><line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\"></line>";
var smartphone = "<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" ry=\"2\"></rect><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"18\"></line>";
var speaker = "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" ry=\"2\"></rect><circle cx=\"12\" cy=\"14\" r=\"4\"></circle><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"6\"></line>";
var square = "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect>";
var star = "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"></polygon>";
var sun = "<circle cx=\"12\" cy=\"12\" r=\"5\"></circle><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"></line><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"></line><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"></line><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"></line><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"></line><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"></line><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"></line>";
var sunrise = "<path d=\"M17 18a5 5 0 0 0-10 0\"></path><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"9\"></line><line x1=\"4.22\" y1=\"10.22\" x2=\"5.64\" y2=\"11.64\"></line><line x1=\"1\" y1=\"18\" x2=\"3\" y2=\"18\"></line><line x1=\"21\" y1=\"18\" x2=\"23\" y2=\"18\"></line><line x1=\"18.36\" y1=\"11.64\" x2=\"19.78\" y2=\"10.22\"></line><line x1=\"23\" y1=\"22\" x2=\"1\" y2=\"22\"></line><polyline points=\"8 6 12 2 16 6\"></polyline>";
var sunset = "<path d=\"M17 18a5 5 0 0 0-10 0\"></path><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"2\"></line><line x1=\"4.22\" y1=\"10.22\" x2=\"5.64\" y2=\"11.64\"></line><line x1=\"1\" y1=\"18\" x2=\"3\" y2=\"18\"></line><line x1=\"21\" y1=\"18\" x2=\"23\" y2=\"18\"></line><line x1=\"18.36\" y1=\"11.64\" x2=\"19.78\" y2=\"10.22\"></line><line x1=\"23\" y1=\"22\" x2=\"1\" y2=\"22\"></line><polyline points=\"16 5 12 9 8 5\"></polyline>";
var tablet = "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" ry=\"2\" transform=\"rotate(180 12 12)\"></rect><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"18\"></line>";
var tag = "<path d=\"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z\"></path><line x1=\"7\" y1=\"7\" x2=\"7\" y2=\"7\"></line>";
var target = "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"6\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle>";
var thermometer = "<path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\"></path>";
var trash = "<polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>";
var triangle = "<path d=\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"></path>";
var tv = "<rect x=\"2\" y=\"7\" width=\"20\" height=\"15\" rx=\"2\" ry=\"2\"></rect><polyline points=\"17 2 12 7 7 2\"></polyline>";
var twitter = "<path d=\"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z\"></path>";
var type = "<polyline points=\"4 7 4 4 20 4 20 7\"></polyline><line x1=\"9\" y1=\"20\" x2=\"15\" y2=\"20\"></line><line x1=\"12\" y1=\"4\" x2=\"12\" y2=\"20\"></line>";
var umbrella = "<path d=\"M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7\"></path>";
var underline = "<path d=\"M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3\"></path><line x1=\"4\" y1=\"21\" x2=\"20\" y2=\"21\"></line>";
var unlock = "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 9.9-1\"></path>";
var upload = "<path d=\"M3 17v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3\"></path><polyline points=\"16 6 12 2 8 6\"></polyline><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"16\"></line>";
var user = "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle>";
var users = "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>";
var video = "<polygon points=\"23 7 16 12 23 17 23 7\"></polygon><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" ry=\"2\"></rect>";
var voicemail = "<circle cx=\"5.5\" cy=\"11.5\" r=\"4.5\"></circle><circle cx=\"18.5\" cy=\"11.5\" r=\"4.5\"></circle><line x1=\"5.5\" y1=\"16\" x2=\"18.5\" y2=\"16\"></line>";
var volume = "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon>";
var watch = "<circle cx=\"12\" cy=\"12\" r=\"7\"></circle><polyline points=\"12 9 12 12 13.5 13.5\"></polyline><path d=\"M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83\"></path>";
var wifi = "<path d=\"M5 12.55a11 11 0 0 1 14.08 0\"></path><path d=\"M1.42 9a16 16 0 0 1 21.16 0\"></path><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\"></path><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"20\"></line>";
var wind = "<path d=\"M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2\"></path>";
var x = "<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line>";
var zap = "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon>";
var featherIcons = {
	activity: activity,
	airplay: airplay,
	anchor: anchor,
	aperture: aperture,
	award: award,
	battery: battery,
	bell: bell,
	bluetooth: bluetooth,
	bold: bold,
	book: book,
	bookmark: bookmark,
	box: box,
	briefcase: briefcase,
	calendar: calendar,
	camera: camera,
	cast: cast,
	check: check,
	chrome: chrome,
	circle: circle,
	clipboard: clipboard,
	clock: clock,
	cloud: cloud,
	codepen: codepen,
	command: command,
	compass: compass,
	copy: copy,
	cpu: cpu,
	crop: crop,
	crosshair: crosshair,
	disc: disc,
	download: download,
	droplet: droplet,
	edit: edit,
	eye: eye,
	facebook: facebook,
	feather: feather,
	file: file,
	film: film,
	filter: filter,
	flag: flag,
	folder: folder,
	github: github,
	gitlab: gitlab,
	globe: globe,
	grid: grid,
	hash: hash,
	headphones: headphones,
	heart: heart,
	home: home,
	image: image,
	inbox: inbox,
	info: info,
	instagram: instagram,
	italic: italic,
	layers: layers,
	layout: layout,
	link: link,
	list: list,
	loader: loader,
	lock: lock,
	mail: mail,
	map: map,
	maximize: maximize,
	menu: menu,
	mic: mic,
	minimize: minimize,
	minus: minus,
	monitor: monitor,
	moon: moon,
	move: move,
	music: music,
	navigation: navigation,
	octagon: octagon,
	paperclip: paperclip,
	pause: pause,
	percent: percent,
	phone: phone,
	play: play,
	plus: plus,
	pocket: pocket,
	power: power,
	printer: printer,
	radio: radio,
	repeat: repeat,
	rewind: rewind,
	save: save,
	scissors: scissors,
	search: search,
	server: server,
	settings: settings,
	share: share,
	shield: shield,
	shuffle: shuffle,
	sidebar: sidebar,
	slack: slack,
	slash: slash,
	sliders: sliders,
	smartphone: smartphone,
	speaker: speaker,
	square: square,
	star: star,
	sun: sun,
	sunrise: sunrise,
	sunset: sunset,
	tablet: tablet,
	tag: tag,
	target: target,
	thermometer: thermometer,
	trash: trash,
	triangle: triangle,
	tv: tv,
	twitter: twitter,
	type: type,
	umbrella: umbrella,
	underline: underline,
	unlock: unlock,
	upload: upload,
	user: user,
	users: users,
	video: video,
	voicemail: voicemail,
	volume: volume,
	watch: watch,
	wifi: wifi,
	wind: wind,
	x: x,
	zap: zap,
	"alert-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"16\"></line>",
	"alert-octagon": "<polygon points=\"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2\"></polygon><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"16\"></line>",
	"alert-triangle": "<path d=\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"></path><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"13\"></line><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"17\"></line>",
	"align-center": "<line x1=\"18\" y1=\"10\" x2=\"6\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"18\" y1=\"18\" x2=\"6\" y2=\"18\"></line>",
	"align-justify": "<line x1=\"21\" y1=\"10\" x2=\"3\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"21\" y1=\"18\" x2=\"3\" y2=\"18\"></line>",
	"align-left": "<line x1=\"17\" y1=\"10\" x2=\"3\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"17\" y1=\"18\" x2=\"3\" y2=\"18\"></line>",
	"align-right": "<line x1=\"21\" y1=\"10\" x2=\"7\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"21\" y1=\"18\" x2=\"7\" y2=\"18\"></line>",
	"arrow-down-left": "<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><polyline points=\"15 18 6 18 6 9\"></polyline>",
	"arrow-down-right": "<line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line><polyline points=\"9 18 18 18 18 9\"></polyline>",
	"arrow-down": "<line x1=\"12\" y1=\"4\" x2=\"12\" y2=\"20\"></line><polyline points=\"18 14 12 20 6 14\"></polyline>",
	"arrow-left": "<line x1=\"20\" y1=\"12\" x2=\"4\" y2=\"12\"></line><polyline points=\"10 18 4 12 10 6\"></polyline>",
	"arrow-right": "<line x1=\"4\" y1=\"12\" x2=\"20\" y2=\"12\"></line><polyline points=\"14 6 20 12 14 18\"></polyline>",
	"arrow-up-left": "<line x1=\"18\" y1=\"18\" x2=\"6\" y2=\"6\"></line><polyline points=\"15 6 6 6 6 15\"></polyline>",
	"arrow-up-right": "<line x1=\"6\" y1=\"18\" x2=\"18\" y2=\"6\"></line><polyline points=\"9 6 18 6 18 15\"></polyline>",
	"arrow-up": "<line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"></line><polyline points=\"6 10 12 4 18 10\"></polyline>",
	"at-sign": "<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M16 12v1a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94\"></path>",
	"bar-chart-2": "<rect x=\"10\" y=\"3\" width=\"4\" height=\"18\"></rect><rect x=\"18\" y=\"8\" width=\"4\" height=\"13\"></rect><rect x=\"2\" y=\"13\" width=\"4\" height=\"8\"></rect>",
	"bar-chart": "<rect x=\"18\" y=\"3\" width=\"4\" height=\"18\"></rect><rect x=\"10\" y=\"8\" width=\"4\" height=\"13\"></rect><rect x=\"2\" y=\"13\" width=\"4\" height=\"8\"></rect>",
	"battery-charging": "<path d=\"M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19\"></path><line x1=\"23\" y1=\"13\" x2=\"23\" y2=\"11\"></line><polyline points=\"11 6 7 12 13 12 9 18\"></polyline>",
	"bell-off": "<path d=\"M8.56 2.9A7 7 0 0 1 19 9v4m-2 4H2a3 3 0 0 0 3-3V9a7 7 0 0 1 .78-3.22M13.73 21a2 2 0 0 1-3.46 0\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>",
	"camera-off": "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line><path d=\"M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56\"></path>",
	"check-circle": "<path d=\"M22 11.07V12a10 10 0 1 1-5.93-9.14\"></path><polyline points=\"23 3 12 14 9 11\"></polyline>",
	"check-square": "<polyline points=\"9 11 12 14 23 3\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path>",
	"chevron-down": "<polyline points=\"6 9 12 15 18 9\"></polyline>",
	"chevron-left": "<polyline points=\"15 18 9 12 15 6\"></polyline>",
	"chevron-right": "<polyline points=\"9 18 15 12 9 6\"></polyline>",
	"chevron-up": "<polyline points=\"18 15 12 9 6 15\"></polyline>",
	"chevrons-down": "<polyline points=\"7 13 12 18 17 13\"></polyline><polyline points=\"7 6 12 11 17 6\"></polyline>",
	"chevrons-left": "<polyline points=\"11 17 6 12 11 7\"></polyline><polyline points=\"18 17 13 12 18 7\"></polyline>",
	"chevrons-right": "<polyline points=\"13 17 18 12 13 7\"></polyline><polyline points=\"6 17 11 12 6 7\"></polyline>",
	"chevrons-up": "<polyline points=\"17 11 12 6 7 11\"></polyline><polyline points=\"17 18 12 13 7 18\"></polyline>",
	"cloud-drizzle": "<line x1=\"8\" y1=\"19\" x2=\"8\" y2=\"21\"></line><line x1=\"8\" y1=\"13\" x2=\"8\" y2=\"15\"></line><line x1=\"16\" y1=\"19\" x2=\"16\" y2=\"21\"></line><line x1=\"16\" y1=\"13\" x2=\"16\" y2=\"15\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"></line><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"17\"></line><path d=\"M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25\"></path>",
	"cloud-lightning": "<path d=\"M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9\"></path><polyline points=\"13 11 9 17 15 17 11 23\"></polyline>",
	"cloud-off": "<path d=\"M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>",
	"cloud-rain": "<line x1=\"16\" y1=\"13\" x2=\"16\" y2=\"21\"></line><line x1=\"8\" y1=\"13\" x2=\"8\" y2=\"21\"></line><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"23\"></line><path d=\"M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25\"></path>",
	"cloud-snow": "<path d=\"M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25\"></path><line x1=\"8\" y1=\"16\" x2=\"8\" y2=\"16\"></line><line x1=\"8\" y1=\"20\" x2=\"8\" y2=\"20\"></line><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"18\"></line><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"22\"></line><line x1=\"16\" y1=\"16\" x2=\"16\" y2=\"16\"></line><line x1=\"16\" y1=\"20\" x2=\"16\" y2=\"20\"></line>",
	"corner-down-left": "<polyline points=\"9 10 4 15 9 20\"></polyline><path d=\"M20 4v7a4 4 0 0 1-4 4H4\"></path>",
	"corner-down-right": "<polyline points=\"15 10 20 15 15 20\"></polyline><path d=\"M4 4v7a4 4 0 0 0 4 4h12\"></path>",
	"corner-left-down": "<polyline points=\"14 15 9 20 4 15\"></polyline><path d=\"M20 4h-7a4 4 0 0 0-4 4v12\"></path>",
	"corner-left-up": "<polyline points=\"14 9 9 4 4 9\"></polyline><path d=\"M20 20h-7a4 4 0 0 1-4-4V4\"></path>",
	"corner-right-down": "<polyline points=\"10 15 15 20 20 15\"></polyline><path d=\"M4 4h7a4 4 0 0 1 4 4v12\"></path>",
	"corner-right-up": "<polyline points=\"10 9 15 4 20 9\"></polyline><path d=\"M4 20h7a4 4 0 0 0 4-4V4\"></path>",
	"corner-up-left": "<polyline points=\"9 14 4 9 9 4\"></polyline><path d=\"M20 20v-7a4 4 0 0 0-4-4H4\"></path>",
	"corner-up-right": "<polyline points=\"15 14 20 9 15 4\"></polyline><path d=\"M4 20v-7a4 4 0 0 1 4-4h12\"></path>",
	"credit-card": "<rect x=\"1\" y=\"4\" width=\"22\" height=\"16\" rx=\"2\" ry=\"2\"></rect><line x1=\"1\" y1=\"10\" x2=\"23\" y2=\"10\"></line>",
	"delete": "<path d=\"M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z\"></path><line x1=\"18\" y1=\"9\" x2=\"12\" y2=\"15\"></line><line x1=\"12\" y1=\"9\" x2=\"18\" y2=\"15\"></line>",
	"download-cloud": "<polyline points=\"8 17 12 21 16 17\"></polyline><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\"></line><path d=\"M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29\"></path>",
	"edit-2": "<polygon points=\"16 3 21 8 8 21 3 21 3 16 16 3\"></polygon>",
	"edit-3": "<polygon points=\"14 2 18 6 7 17 3 17 3 13 14 2\"></polygon><line x1=\"3\" y1=\"22\" x2=\"21\" y2=\"22\"></line>",
	"external-link": "<path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>",
	"eye-off": "<path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>",
	"fast-forward": "<polygon points=\"13 19 22 12 13 5 13 19\"></polygon><polygon points=\"2 19 11 12 2 5 2 19\"></polygon>",
	"file-minus": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14 2 14 8 20 8\"></polyline><line x1=\"9\" y1=\"15\" x2=\"15\" y2=\"15\"></line>",
	"file-plus": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14 2 14 8 20 8\"></polyline><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"12\"></line><line x1=\"9\" y1=\"15\" x2=\"15\" y2=\"15\"></line>",
	"file-text": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14 2 14 8 20 8\"></polyline><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"></line><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"></line><polyline points=\"10 9 9 9 8 9\"></polyline>",
	"help-circle": "<path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"></path><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"17\"></line>",
	"life-buoy": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"4\"></circle><line x1=\"4.93\" y1=\"4.93\" x2=\"9.17\" y2=\"9.17\"></line><line x1=\"14.83\" y1=\"14.83\" x2=\"19.07\" y2=\"19.07\"></line><line x1=\"14.83\" y1=\"9.17\" x2=\"19.07\" y2=\"4.93\"></line><line x1=\"14.83\" y1=\"9.17\" x2=\"18.36\" y2=\"5.64\"></line><line x1=\"4.93\" y1=\"19.07\" x2=\"9.17\" y2=\"14.83\"></line>",
	"link-2": "<path d=\"M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3\"></path><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>",
	"log-in": "<path d=\"M14 22h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5\"></path><polyline points=\"11 16 15 12 11 8\"></polyline><line x1=\"15\" y1=\"12\" x2=\"3\" y2=\"12\"></line>",
	"log-out": "<path d=\"M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5\"></path><polyline points=\"17 16 21 12 17 8\"></polyline><line x1=\"21\" y1=\"12\" x2=\"9\" y2=\"12\"></line>",
	"map-pin": "<path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\"></path><circle cx=\"12\" cy=\"10\" r=\"3\"></circle>",
	"maximize-2": "<polyline points=\"15 3 21 3 21 9\"></polyline><polyline points=\"9 21 3 21 3 15\"></polyline><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\"></line><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"></line>",
	"message-circle": "<path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\"></path>",
	"message-square": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path>",
	"mic-off": "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line><path d=\"M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6\"></path><path d=\"M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23\"></path><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"></line><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"></line>",
	"minimize-2": "<polyline points=\"4 14 10 14 10 20\"></polyline><polyline points=\"20 10 14 10 14 4\"></polyline><line x1=\"14\" y1=\"10\" x2=\"21\" y2=\"3\"></line><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"></line>",
	"minus-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>",
	"minus-square": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>",
	"more-horizontal": "<circle cx=\"12\" cy=\"12\" r=\"2\"></circle><circle cx=\"20\" cy=\"12\" r=\"2\"></circle><circle cx=\"4\" cy=\"12\" r=\"2\"></circle>",
	"more-vertical": "<circle cx=\"12\" cy=\"12\" r=\"2\"></circle><circle cx=\"12\" cy=\"4\" r=\"2\"></circle><circle cx=\"12\" cy=\"20\" r=\"2\"></circle>",
	"navigation-2": "<polygon points=\"12 2 19 21 12 17 5 21 12 2\"></polygon>",
	"package": "<path d=\"M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z\"></path><polyline points=\"2.32 6.16 12 11 21.68 6.16\"></polyline><line x1=\"12\" y1=\"22.76\" x2=\"12\" y2=\"11\"></line><line x1=\"7\" y1=\"3.5\" x2=\"17\" y2=\"8.5\"></line>",
	"pause-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"10\" y1=\"15\" x2=\"10\" y2=\"9\"></line><line x1=\"14\" y1=\"15\" x2=\"14\" y2=\"9\"></line>",
	"phone-call": "<path d=\"M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>",
	"phone-forwarded": "<polyline points=\"19 1 23 5 19 9\"></polyline><line x1=\"15\" y1=\"5\" x2=\"23\" y2=\"5\"></line><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>",
	"phone-incoming": "<polyline points=\"16 2 16 8 22 8\"></polyline><line x1=\"23\" y1=\"1\" x2=\"16\" y2=\"8\"></line><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>",
	"phone-missed": "<line x1=\"23\" y1=\"1\" x2=\"17\" y2=\"7\"></line><line x1=\"17\" y1=\"1\" x2=\"23\" y2=\"7\"></line><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>",
	"phone-off": "<path d=\"M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91\"></path><line x1=\"23\" y1=\"1\" x2=\"1\" y2=\"23\"></line>",
	"phone-outgoing": "<polyline points=\"23 7 23 1 17 1\"></polyline><line x1=\"16\" y1=\"8\" x2=\"23\" y2=\"1\"></line><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>",
	"pie-chart": "<path d=\"M21.21 15.89A10 10 0 1 1 8 2.83\"></path><path d=\"M22 12A10 10 0 0 0 12 2v10z\"></path>",
	"play-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polygon points=\"10 8 16 12 10 16 10 8\"></polygon>",
	"plus-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"></line><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>",
	"plus-square": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"></line><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>",
	"refresh-ccw": "<polyline points=\"1 4 1 10 7 10\"></polyline><polyline points=\"23 20 23 14 17 14\"></polyline><path d=\"M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15\"></path>",
	"refresh-cw": "<polyline points=\"23 4 23 10 17 10\"></polyline><polyline points=\"1 20 1 14 7 14\"></polyline><path d=\"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15\"></path>",
	"rotate-ccw": "<polyline points=\"1 4 1 10 7 10\"></polyline><path d=\"M3.51 15a9 9 0 1 0 2.13-9.36L1 10\"></path>",
	"rotate-cw": "<polyline points=\"23 4 23 10 17 10\"></polyline><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"></path>",
	"share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\"></circle><circle cx=\"6\" cy=\"12\" r=\"3\"></circle><circle cx=\"18\" cy=\"19\" r=\"3\"></circle><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\"></line><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\"></line>",
	"shopping-cart": "<circle cx=\"8\" cy=\"21\" r=\"2\"></circle><circle cx=\"20\" cy=\"21\" r=\"2\"></circle><path d=\"M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1\"></path>",
	"skip-back": "<polygon points=\"19 20 9 12 19 4 19 20\"></polygon><line x1=\"5\" y1=\"19\" x2=\"5\" y2=\"5\"></line>",
	"skip-forward": "<polygon points=\"5 4 15 12 5 20 5 4\"></polygon><line x1=\"19\" y1=\"5\" x2=\"19\" y2=\"19\"></line>",
	"stop-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"></rect>",
	"thumbs-down": "<path d=\"M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17\"></path>",
	"thumbs-up": "<path d=\"M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3\"></path>",
	"toggle-left": "<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" ry=\"7\"></rect><circle cx=\"8\" cy=\"12\" r=\"3\"></circle>",
	"toggle-right": "<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" ry=\"7\"></rect><circle cx=\"16\" cy=\"12\" r=\"3\"></circle>",
	"trash-2": "<polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"></line><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"></line>",
	"trending-down": "<polyline points=\"23 18 13.5 8.5 8.5 13.5 1 6\"></polyline><polyline points=\"17 18 23 18 23 12\"></polyline>",
	"trending-up": "<polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"></polyline><polyline points=\"17 6 23 6 23 12\"></polyline>",
	"upload-cloud": "<polyline points=\"16 16 12 12 8 16\"></polyline><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\"></line><path d=\"M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3\"></path><polyline points=\"16 16 12 12 8 16\"></polyline>",
	"user-check": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"8.5\" cy=\"7\" r=\"4\"></circle><polyline points=\"17 11 19 13 23 9\"></polyline>",
	"user-minus": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"8.5\" cy=\"7\" r=\"4\"></circle><line x1=\"23\" y1=\"11\" x2=\"17\" y2=\"11\"></line>",
	"user-plus": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"8.5\" cy=\"7\" r=\"4\"></circle><line x1=\"20\" y1=\"8\" x2=\"20\" y2=\"14\"></line><line x1=\"23\" y1=\"11\" x2=\"17\" y2=\"11\"></line>",
	"user-x": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"8.5\" cy=\"7\" r=\"4\"></circle><line x1=\"18\" y1=\"8\" x2=\"23\" y2=\"13\"></line><line x1=\"23\" y1=\"8\" x2=\"18\" y2=\"13\"></line>",
	"video-off": "<path d=\"M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>",
	"volume-1": "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\"></path>",
	"volume-2": "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07\"></path>",
	"volume-x": "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><line x1=\"23\" y1=\"9\" x2=\"17\" y2=\"15\"></line><line x1=\"17\" y1=\"9\" x2=\"23\" y2=\"15\"></line>",
	"wifi-off": "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line><path d=\"M16.72 11.06A10.94 10.94 0 0 1 19 12.55\"></path><path d=\"M5 12.55a10.94 10.94 0 0 1 5.17-2.39\"></path><path d=\"M10.71 5.05A16 16 0 0 1 22.58 9\"></path><path d=\"M1.42 9a15.91 15.91 0 0 1 4.7-2.88\"></path><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\"></path><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"20\"></line>",
	"x-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"></line><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"></line>",
	"x-square": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"></line><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"></line>",
	"zoom-in": "<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line><line x1=\"11\" y1=\"8\" x2=\"11\" y2=\"14\"></line><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\"></line>",
	"zoom-out": "<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\"></line>"
};

var Icon = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.ligature)?_c('i',{class:_vm.iconType,style:({ color: _vm.iconColor, fontSize: _vm.size, verticalAlign: _vm.valign })},[_vm._v(_vm._s(_vm.name))]):(_vm.isSvg)?_c('span',{staticClass:"c-icon"},[_c('svg',{class:_vm.classNames,style:({verticalAlign: _vm.valign}),attrs:{"width":_vm.size,"height":_vm.size,"stroke":_vm.iconColor,"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24","fill":"none","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},domProps:{"innerHTML":_vm._s(_vm.svgContent)}})]):_c('i',{staticClass:"c-icon",class:_vm.classNames,style:({ color: _vm.iconColor, fontSize: _vm.size, verticalAlign: _vm.valign })})},staticRenderFns: [],
  name: 'c-icon',
  props: {
    type: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    size: {
      type: String,
      default: '1em'
    },
    valign: {
      type: String,
      default: 'baseline'
    },
    ligature: {
      type: Boolean,
      default: false
    }
  },

  data: function data () {
    return {}
  },

  computed: {
    iconType: function iconType () {
      if (this.type == null) {
        return this.$clair.icon || 'feather'
      }
      return this.type
    },
    isSvg: function isSvg () {
      return this.iconType === 'feather'
    },
    classNames: function classNames () {
      var prefix = this.iconType !== '' ? ((this.iconType) + "-") : '';
      return ((this.iconType) + " " + prefix + (this.name))
    },
    svgContent: function svgContent () {
      return this.isSvg ? featherIcons[this.name] : ''
    },
    iconColor: function iconColor () {
      if (!this.color) {
        return this.isSvg ? 'currentColor' : 'inherit'
      }

      return this.color
    }
  }
};

/**
 * Thanks to https://github.com/ant-design/ant-design/
 * SEE: /master/components/input/calculateNodeHeight.tsx
 */

// Thanks to https://github.com/andreypopp/react-textarea-autosize/
/**
 * calculateNodeHeight(uiTextNode, useCache = false)
 */

var HIDDEN_TEXTAREA_STYLE = "\nmin-height:0 !important;\nmax-height:none !important;\nheight:0 !important;\nvisibility:hidden !important;\noverflow:hidden !important;\nposition:absolute !important;\nz-index:-1000 !important;\ntop:0 !important;\nright:0 !important\n";

var SIZING_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
];

var computedStyleCache = {};
var hiddenTextarea;

function calculateNodeStyling (node, useCache) {
  if ( useCache === void 0 ) useCache = false;

  var nodeRef = (
    node.getAttribute('id') ||
  node.getAttribute('data-reactid') ||
  node.getAttribute('name')
  );

  if (useCache && computedStyleCache[nodeRef]) {
    return computedStyleCache[nodeRef]
  }

  var style = window.getComputedStyle(node);

  var boxSizing = (
    style.getPropertyValue('box-sizing') ||
      style.getPropertyValue('-moz-box-sizing') ||
      style.getPropertyValue('-webkit-box-sizing')
  );

  var paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom')) +
      parseFloat(style.getPropertyValue('padding-top'))
  );

  var borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width')) +
      parseFloat(style.getPropertyValue('border-top-width'))
  );

  var sizingStyle = SIZING_STYLE
    .map(function (name) { return (name + ":" + (style.getPropertyValue(name))); })
    .join(';');

  var nodeInfo = {
    sizingStyle: sizingStyle,
    paddingSize: paddingSize,
    borderSize: borderSize,
    boxSizing: boxSizing
  };

  if (useCache && nodeRef) {
    computedStyleCache[nodeRef] = nodeInfo;
  }

  return nodeInfo
}

function calculateNodeHeight (
  uiTextNode,
  useCache,
  minRows,
  maxRows
) {
  if ( useCache === void 0 ) useCache = false;
  if ( minRows === void 0 ) minRows = null;
  if ( maxRows === void 0 ) maxRows = null;

  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }

  // Fix wrap="off" issue
  // https://github.com/ant-design/ant-design/issues/6577
  if (uiTextNode.getAttribute('wrap')) {
    hiddenTextarea.setAttribute('wrap', uiTextNode.getAttribute('wrap'));
  } else {
    hiddenTextarea.removeAttribute('wrap');
  }

  // Copy all CSS properties that have an impact on the height of the content in
  // the textbox
  var ref = calculateNodeStyling(uiTextNode, useCache);
  var paddingSize = ref.paddingSize;
  var borderSize = ref.borderSize;
  var boxSizing = ref.boxSizing;
  var sizingStyle = ref.sizingStyle;

  // Need to have the overflow attribute to hide the scrollbar otherwise
  // text-lines will not calculated properly as the shadow will technically be
  // narrower for content
  hiddenTextarea.setAttribute('style',
    (sizingStyle + ";" + HIDDEN_TEXTAREA_STYLE)
  );
  hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || '';

  var minHeight = -Infinity;
  var maxHeight = Infinity;
  var height = hiddenTextarea.scrollHeight;
  var overflowY;

  if (boxSizing === 'border-box') {
  // border-box: add border, since height = content + padding + border
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
  // remove padding, since height = content
    height = height - paddingSize;
  }

  if (minRows !== null || maxRows !== null) {
  // measure height of a textarea with a single row
    hiddenTextarea.value = '';
    var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (minRows !== null) {
      minHeight = singleRowHeight * minRows;
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
    }
    if (maxRows !== null) {
      maxHeight = singleRowHeight * maxRows;
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      overflowY = height > maxHeight ? '' : 'hidden';
      height = Math.min(maxHeight, height);
    }
  }
  // Remove scroll bar flash when autosize without maxRows
  if (!maxRows) {
    overflowY = 'hidden';
  }
  return {
    height: (height + "px"),
    minHeight: (minHeight + "px"),
    maxHeight: (maxHeight + "px"),
    overflowY: overflowY
  }
}

// SEE https://github.com/jackmoore/autosize
// import autoSize from 'autosize'
var Input = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-input-wrap",class:_vm.className},[(!_vm.multiLine)?_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.inputValue),expression:"inputValue"}],staticClass:"c-input",attrs:{"type":_vm.type,"name":_vm.name,"placeholder":_vm.placeholder,"readonly":_vm.readonly,"disabled":_vm.disabled,"maxlength":_vm.maxlength},domProps:{"value":(_vm.inputValue)},on:{"input":[function($event){if($event.target.composing){ return; }_vm.inputValue=$event.target.value;},_vm.onChange],"change":_vm.onChange}}):_vm._e(),(_vm.multiLine)?_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.inputValue),expression:"inputValue"}],ref:"textArea",staticClass:"c-input",style:(_vm.textAreaStyle),attrs:{"name":_vm.name,"placeholder":_vm.placeholder,"readonly":_vm.readonly,"disabled":_vm.disabled,"maxlength":_vm.maxlength,"rows":_vm.rows,"cols":_vm.cols,"wrap":_vm.wrap},domProps:{"value":(_vm.inputValue)},on:{"input":[function($event){if($event.target.composing){ return; }_vm.inputValue=$event.target.value;},_vm.onChange],"change":_vm.onChange}}):_vm._e(),(!_vm.validity.valid)?_c('em',{staticClass:"c-error-msg"},[_vm._v(_vm._s(_vm.validity.msg))]):_vm._e()])},staticRenderFns: [],
  name: 'c-input',
  model: {
    event: 'change'
  },
  mixins: [validatable],
  props: {
    value: {
      type: [String, Number],
      default: function default$1 () {
        return ''
      }
    },
    rules: Object,
    placeholder: String,
    size: String,
    width: String,
    readonly: Boolean,
    disabled: Boolean,
    multiLine: Boolean,
    autosize: Array,
    wrap: String,
    type: {
      type: String,
      default: 'text'
    },
    name: String,
    rows: {
      type: Number,
      default: 3
    },
    cols: {
      type: Number,
      default: 60
    },
    maxlength: [Number, String]
  },
  computed: {
    className: function className () {
      var classNames = [];
      if (!this.validity.valid) { classNames.push('c-input--error'); }
      if (this.size) { classNames.push(("is-" + (this.size))); }
      if (this.width) { classNames.push(("is-" + (this.width))); }
      return classNames
    }
  },
  data: function data () {
    return {
      origRows: this.rows,
      textAreaStyle: {},
      inputValue: ''
    }
  },

  watch: {
    value: {
      handler: function handler (val) {
        this.inputValue = val;
      },
      immediate: true
    }
  },

  methods: {
    onChange: function onChange (e) {
      this.$emit('change', e.target.value);
      this.resizeTextArea();
    },

    resizeTextArea: function resizeTextArea () {
      var this$1 = this;

      var ref = this;
      var multiLine = ref.multiLine;
      var autosize = ref.autosize;
      if (multiLine && autosize) {
        var ref$1 = this.autosize;
        var minRows = ref$1[0];
        var maxRows = ref$1[1];
        var node = this.$refs.textArea;

        this.$nextTick(function () {
          var style = calculateNodeHeight(node, false, minRows, maxRows);
          this$1.textAreaStyle = style;
        });
      }
    }
  },

  mounted: function mounted () {
    var ref = this;
    var multiLine = ref.multiLine;
    var autosize = ref.autosize;

    if (multiLine && autosize) {
      this.resizeTextArea();
    }

    this.resizeTextArea = throttle_1(this.resizeTextArea.bind(this), 200);
  }
};

var Radio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{class:[_vm.button ? 'c-radio--button': 'c-radio'],on:{"change":_vm.onChange}},[_c('input',{attrs:{"type":"radio","name":_vm.name,"disabled":_vm.disabled},domProps:{"value":_vm.value,"checked":_vm.value == _vm.checkedIndex}}),_c('span',{staticClass:"c-radio__box"}),_c('span',{staticClass:"c-radio__label"},[_vm._v(_vm._s(_vm.label))])])},staticRenderFns: [],
  name: 'c-radio',
  model: {
    prop: 'checkedIndex'
  },
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    label: String,
    disabled: Boolean,
    button: Boolean,
    checkedIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    onChange: function onChange (e) {
      this.$emit('input', this.value);
    }
  }
};

var RadioGroup = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-radio-group"},_vm._l((_vm.options),function(option,index){return _c('c-radio',{attrs:{"name":_vm.name,"value":index,"button":_vm.button,"label":option.label,"disabled":option.disabled},model:{value:(_vm.checkedIndex),callback:function ($$v) {_vm.checkedIndex=$$v;},expression:"checkedIndex"}})}))},staticRenderFns: [],
  name: 'c-radio-group',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [Number, String, Object]
    },
    button: Boolean
  },
  data: function data () {
    return {
      name: randomString(),
      checkedIndex: -1
    }
  },
  created: function created () {
    var this$1 = this;

    this.updateChecked();
    this.$watch('options', this.updateChecked);
    this.$watch('checkedIndex', function (_) {
      this$1.$emit('input', this$1.options[this$1.checkedIndex].value);
    });
  },
  methods: {
    updateChecked: function updateChecked () {
      var this$1 = this;

      this.checkedIndex = this.options.findIndex(
        function (option) { return option.value === this$1.value; }
      );
    }
  }
};

/**
 * get absolute position relative to another element
 */
var POSITION = {
  TOP: 'top',
  BOTTOM: 'bottom'
};
function getPosition (el, refEl, pos) {
  if ( pos === void 0 ) pos = POSITION.TOP;

  var refRect = refEl.getBoundingClientRect();
  var refTop = refRect.top + window.pageYOffset;
  var refLeft = refRect.left + window.pageXOffset;
  var left = refLeft;
  var top = pos === POSITION.TOP ? refTop : refTop + refEl.clientHeight;
  return { left: left, top: top }
}

// ensure each option has label and value
var normalizeOptions = function (options) {
  return options.map(function (option) {
    if (option.label && option.value) { return option }
    return { label: option, value: option }
  })
};

var Select = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-select",class:_vm.classNames,attrs:{"role":"combobox","aria-autocomplete":"list","aria-haspopup":"true","aria-expanded":_vm.isOpen,"aria-disabled":"disabled","tabindex":_vm.disabled ? -1 : 0},on:{"keydown":_vm.onKeyDown,"click":_vm.toggleOpen}},[_c('i',{staticClass:"c-select__caret"}),_c('div',{staticClass:"c-select__selection"},[(_vm.showPlaceholder)?_c('div',{staticClass:"c-select__placeholder"},[_vm._v(_vm._s(_vm.placeholder))]):_vm._e(),(!_vm.multiple && _vm.selectedOptions.length)?_c('div',{staticClass:"c-select__value"},[_vm._v(_vm._s(_vm.selectedOptions[0].label))]):_vm._e(),_vm._l((_vm.selectedOptions),function(option){return (_vm.multiple)?_c('div',{staticClass:"c-chip",class:{ 'is-disabled': option.disabled }},[_vm._t("selection",[_c('span',[_vm._v(_vm._s(option.label))])],{option:option}),_c('div',{staticClass:"c-chip__close",on:{"click":function($event){$event.stopPropagation();_vm.unselectOption(option);}}})],2):_vm._e()}),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showInput),expression:"showInput"}],staticClass:"c-select__input",class:_vm.multiple ? 'is-multiple' : 'is-single'},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.query),expression:"query"}],attrs:{"autocomplete":"off"},domProps:{"value":(_vm.query)},on:{"click":function($event){$event.stopPropagation();},"blur":function($event){_vm.$el.focus();},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"delete",[8,46])){ return null; }_vm.onDeleteKey($event);},"input":[function($event){if($event.target.composing){ return; }_vm.query=$event.target.value;},_vm.onSearchInput]}})])],2),_c('transition',{attrs:{"name":"fade-in-down"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isOpen),expression:"isOpen"}],staticClass:"c-select__menu",class:_vm.size ? 'is-'+_vm.size : '',style:(_vm.menuStyle),attrs:{"role":"menu","aria-activedescendant":""}},[(_vm.autocomplete && !_vm.filteredOptions.length)?_vm._t("no-match",[_c('div',{staticClass:"c-select__empty"},[_vm._v("无匹配选项")])]):_vm._e(),_vm._l((_vm.filteredOptions),function(option,index){return _c('c-option',{ref:"$options",refInFor:true,attrs:{"label":option.label,"isActive":_vm.activeOption == option,"isSelected":_vm.selectedOptions.indexOf(option) > -1,"disabled":option.disabled,"option":option}},[_vm._t("menu-item",null,{label:option.label,isActive:_vm.activeOption == option,isSelected:_vm.selectedOptions.indexOf(option) > -1,disabled:option.disabled,index:index,option:option})],2)})],2)])],1)},staticRenderFns: [],

  name: 'c-select',

  props: {
    value: [Number, String, Object, Array],
    options: Array,
    disabled: Boolean,
    placeholder: {
      type: String,
      default: '请选择...'
    },
    multiple: Boolean,
    combobox: Boolean,
    autocomplete: Boolean,
    size: String,
    width: String,
    filter: {
      type: Function,
      default: function (options, query) {
        var q = query.trim().toLowerCase();
        if (!q) { return options }
        return options
          .filter(function (option) { return option.label.toLowerCase().indexOf(q) > -1; })
      }
    }
  },

  model: {
    event: 'change'
  },

  provide: function provide () {
    return { $select: this }
  },

  data: function data () {
    return {
      isOpen: false,
      menuStyle: {
        top: 'auto',
        left: 'auto',
        minWidth: 0
      },
      activeOption: null,
      selectedOptions: [],
      filteredOptions: [],
      selectionEl: null,
      menuEl: null,
      query: '',
      promiseId: 0
    }
  },

  computed: {
    normalizedOptions: function normalizedOptions () {
      return normalizeOptions(this.options)
    },
    canInput: function canInput () {
      return this.combobox || this.autocomplete
    },
    showInput: function showInput () {
      return this.canInput && this.isOpen
    },
    classNames: function classNames () {
      var classNames = [
        {
          'is-open': this.isOpen,
          'is-disabled': this.disabled
        }
      ];
      if (this.size) { classNames.push(("is-" + (this.size))); }
      if (this.width) { classNames.push(("is-" + (this.width))); }
      return classNames
    },
    selectedValues: function selectedValues () {
      return this.selectedOptions.map(function (option) { return option.value; })
    },
    showPlaceholder: function showPlaceholder () {
      var empty = !this.selectedOptions.length;
      return empty && !this.isOpen
    }
  },

  watch: {
    isOpen: function isOpen () {
      if (this.isOpen) {
        this.menuStyle.minWidth = (this.$el.offsetWidth) + "px";
        this.positionMenu();
        window.addEventListener('click', this.onBodyClick, true);
      } else {
        window.removeEventListener('click', this.onBodyClick, true);
      }
    },

    value: {
      immediate: true,
      handler: function (value) {
        var this$1 = this;

        var isEmpty = value === void 0 || value === null || value === '';
        if (isEmpty) { return }
        if (this.multiple) {
          var isArray = Array.isArray(value);
          var isEmptyArray = isArray && value.length === 0;
          if (isEmptyArray) { return }
          var valueArr = isArray ? value : [value];
          this.selectedOptions = valueArr
            .map(function (v) { return this$1.getOption(v); })
            .filter(function (option) { return option; });
        } else {
          var option = this.getOption(value);
          if (option) {
            this.selectedOptions = [option];
          }
        }
      }
    },

    selectedOptions: function () {
      if (!this.multiple || this.$isServer) { return }
      this.$nextTick(function () {
        this.positionMenu();
      });
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    // render menu in body
    if (typeof document === 'object') {
      this.menuEl = this.$el.querySelector('.c-select__menu');
      this.selectionEl = this.$el.querySelector('.c-select__selection');
      document.body.appendChild(this.menuEl);
    }

    // hover the option
    this.$on('option-activated', function (option) {
      this$1.activeOption = option;
    });

    // select the option
    this.$on('option-clicked', function (option) { return this$1.selectOption(option); });

    // watch options, query to filter options
    this.$watch(
      function () {
        return [this.normalizedOptions, this.query, this.isOpen]
      },
      function filterOptions () {
        var this$1 = this;

        var ref = this;
        var autocomplete = ref.autocomplete;
        var query = ref.query;
        if (!autocomplete) {
          this.filteredOptions = this.normalizedOptions;
          return
        }
        var filtered = this.filter(this.normalizedOptions, query);
        if (typeof filtered.then === 'function') {
          var promiseId = Date.now();
          this.promiseId = promiseId;
          filtered.then(function (options) {
            if (this$1.promiseId > promiseId) { return }
            this$1.filteredOptions = normalizeOptions(options);
          });
        } else {
          this.filteredOptions = normalizeOptions(filtered);
        }
      }
    );
  },

  beforeDestroy: function beforeDestroy () {
    this.menuEl.remove();
  },

  destroyed: function destroyed () {
    this.menuEl && document.body.removeChild(this.menuEl);
  },

  methods: {
    toggleOpen: function toggleOpen () {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    getOption: function getOption (value) {
      var fn = function (option) { return option.value === value; };
      return this.filteredOptions.find(fn) ||
        this.normalizedOptions.find(fn) ||
        this.selectedOptions.find(fn)
    },

    open: function open () {
      var this$1 = this;

      this.isOpen = true;
      var assign;
      (assign = this.filteredOptions, this.activeOption = assign[0]);
      if (this.showInput) {
        this.query = '';
        this.$nextTick(function (_) {
          this$1.$el.querySelector('input').focus();
        });
      }
    },

    close: function close () {
      this.isOpen = false;
    },

    getNextOption: function getNextOption (current) {
      var currentIndex = this.filteredOptions.indexOf(current);
      var next = this.filteredOptions.find(function (option, index) {
        return index > currentIndex && !option.disabled
      });
      return next || current
    },

    getPreviousOption: function getPreviousOption (current) {
      var this$1 = this;

      var prev = null;
      var currentIndex = this.filteredOptions.indexOf(current);
      for (var i = currentIndex - 1; i >= 0; i--) {
        if (!this$1.filteredOptions[i].disabled) {
          prev = this$1.filteredOptions[i];
          break
        }
      }
      return prev || current
    },

    activateNext: function activateNext () {
      var next = this.getNextOption(this.activeOption);
      this.activeOption = next;
    },

    activatePrevious: function activatePrevious () {
      var prev = this.getPreviousOption(this.activeOption);
      this.activeOption = prev;
    },

    selectPrevious: function selectPrevious () {
      var prev = this.getPreviousOption(this.selectedOptions[0]);
      this.selectOption(prev);
    },

    selectNext: function selectNext () {
      var next = this.getNextOption(this.selectedOptions[0]);
      this.selectOption(next);
    },

    selectOption: function selectOption (option) {
      if (this.multiple) {
        if (this.autocomplete) { this.query = ''; }
        var isSelected = this.selectedOptions.includes(option);
        if (isSelected) { return this.unselectOption(option) }
        this.selectedOptions.push(option);
      } else {
        this.selectedOptions = [option];
        this.close();
      }
      this.emitChange();
    },

    unselectOption: function unselectOption (option) {
      var index = this.selectedOptions.indexOf(option);
      this.selectedOptions.splice(index, 1);
      this.emitChange();
    },

    positionMenu: function positionMenu () {
      var pos = this.canInput ? POSITION.BOTTOM : POSITION.TOP;
      var ref = getPosition(this.menuEl, this.$el, pos);
      var top = ref.top;
      var left = ref.left;
      this.menuEl.style.top = top + "px";
      this.menuEl.style.left = left + "px";
    },

    onBodyClick: function onBodyClick (e) {
      var isInSelect = this.$el.contains(e.target);
      var isInMenu = this.menuEl.contains(e.target);
      if (!isInSelect && !isInMenu) {
        this.close();
        this.$el.focus();
      }
    },

    onDeleteKey: function onDeleteKey (e) {
      if (!this.query) { this.selectedOptions.pop(); }
    },

    onKeyDown: function onKeyDown (e) {
      var keys = {
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
      };
      var keyCode = e.keyCode;
      var ref = this;
      var isOpen = ref.isOpen;
      var multiple = ref.multiple;
      var open = ref.open;
      var close = ref.close;
      var selectOption = ref.selectOption;
      var selectPrevious = ref.selectPrevious;
      var selectNext = ref.selectNext;
      var activeOption = ref.activeOption;
      var activateNext = ref.activateNext;
      var activatePrevious = ref.activatePrevious;

      if (Object.values(keys).includes(keyCode)) { e.preventDefault(); }

      // open menu on space, up, down key
      var openTrigger = [
        keys.SPACE,
        keys.ENTER,
        keys.UP,
        keys.DOWN
      ].includes(keyCode);
      if (openTrigger && !isOpen) { return open() }

      // close menu on escape
      if (keyCode === keys.ESC && isOpen) { return close() }

      // press enter to select
      if (keyCode === keys.ENTER && isOpen) { return selectOption(activeOption) }

      // use left, right to navigate on closed state of non-multiple select
      var canSelect = !isOpen && !multiple;
      if (canSelect && keyCode === keys.LEFT) { return selectPrevious() }
      if (canSelect && keyCode === keys.RIGHT) { return selectNext() }

      // use up, down to navigate on open state
      if (isOpen && keyCode === keys.UP) { return activatePrevious() }
      if (isOpen && keyCode === keys.DOWN) { return activateNext() }
    },

    onSearchInput: function onSearchInput (e) {
      this.$emit('searchinput', e.target.value);
    },

    emitChange: function emitChange () {
      var value = this.multiple ? this.selectedValues : this.selectedValues[0];
      this.$emit('change', value);
    }
  }
};

var Option = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-select__option",class:_vm.classNames,attrs:{"role":"menuitem","aria-selected":"isSelected"},on:{"mouseenter":_vm.activate,"mouseleave":_vm.deactivate,"mousedown":function($event){$event.preventDefault();},"click":_vm.onClick}},[_vm._t("default",[_vm._v(_vm._s(_vm.label))])],2)},staticRenderFns: [],
  name: 'c-option',
  props: {
    label: String,
    disabled: Boolean,
    isActive: Boolean,
    isSelected: Boolean,
    option: Object,
    value: [String, Number, Object]
  },
  inject: ['$select'],
  computed: {
    classNames: function classNames () {
      return {
        'is-hover': this.isActive,
        'is-selected': this.isSelected,
        'is-disabled': this.disabled
      }
    }
  },
  methods: {
    activate: function activate () {
      this.$select.$emit('option-activated', this.option);
    },
    deactivate: function deactivate () {
      this.$select.$emit('option-deactivated', this.option);
    },
    onClick: function onClick (e) {
      e.preventDefault();
      if (this.disabled) { return }
      this.$select.$emit('option-clicked', this.option);
    }
  }
};

var Slider = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('c-base-range',{staticClass:"c-slider is-bg-gray-2",class:_vm.className,style:(_vm.height ? { height: _vm.height } : null),attrs:{"direction":_vm.vertical ? 'v' : 'h',"disabled":_vm.disabled},on:{"change":_vm.onRangeChange}},[_c('input',{attrs:{"type":"range","min":_vm.min,"max":_vm.max,"step":_vm.step,"disabled":_vm.disabled},domProps:{"value":_vm.nominal}}),_c('div',{staticClass:"c-slider__progress is-bg-blue-5",style:(_vm.progressPos)}),_c('ul',{staticClass:"c-slider__marks"},_vm._l((_vm.normalizedMarks),function(mark){return _c('li',{style:(((_vm.vertical ? 'bottom' : 'left') + ": " + (mark.p)))},[_vm._v(_vm._s(mark.n))])})),_c('div',{staticClass:"c-slider__stops"},_vm._l((_vm.normalizedMarks),function(mark){return _c('span',{style:(((_vm.vertical ? 'bottom' : 'left') + ": " + (mark.p)))})})),_c('div',{staticClass:"c-slider__thumb",style:(_vm.thumbPos)},[_c('div',{staticClass:"c-slider__tip"},[_vm._v(_vm._s(_vm.formmater(this.nominal, 'tip')))])])])},staticRenderFns: [],
  name: 'c-slider',
  components: {
    'c-base-range': baseRange
  },
  model: { event: 'change' },
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: [Number, String],
      default: 0
    },
    marks: {
      type: Array
    },
    formmater: {
      type: Function,
      default: function (id) { return id; }
    },
    vertical: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    }
  },

  data: function data () {
    return {
      normorlizedValue: 0
    }
  },

  computed: {
    className: function className () {
      var ref = this;
      var vertical = ref.vertical;
      var disabled = ref.disabled;
      return [
        ("c-slider--" + (vertical ? 'vertical' : 'horizontal')),
        disabled ? 'c-slider--disabled' : ''
      ]
    },

    precision: function precision () {
      var ref = ("" + (this.step)).split('.');
      var fraction = ref[1];
      return fraction ? fraction.length : 0
    },

    /**
     * nominal value being denormalized
     */
    nominal: function nominal () {
      return this.denormalize(this.normorlizedValue)
    },

    percentage: function percentage () {
      var ref = this;
      var nominal = ref.nominal;
      var proportion = this.normalize(nominal);
      // eslint-disable-next-line
      return ((proportion * 100) + "%")
    },

    thumbPos: function thumbPos () {
      var ref = this;
      var vertical = ref.vertical;
      var percentage = ref.percentage;
      var key = vertical ? 'bottom' : 'left';
      var style = {};
      style[key] = percentage;
      return style
    },

    progressPos: function progressPos () {
      var ref = this;
      var vertical = ref.vertical;
      var percentage = ref.percentage;
      var key = vertical ? 'height' : 'width';
      var style = {};
      style[key] = percentage;
      return style
    },

    normalizedMarks: function normalizedMarks () {
      var this$1 = this;

      var ref = this;
      var marks = ref.marks;
      var min = ref.min;
      var max = ref.max;
      var formmater = ref.formmater;
      var arr = marks || [min, max];
      return arr.map(function (mk) {
        var mark = clamp_1(mk, min, max);

        return {
          // eslint-disable-next-line
          p: ((this$1.normalize(mark) * 100) + "%"),
          n: formmater ? formmater(mark, 'scale') : mark
        }
      })
    }
  },

  methods: {
    normalize: function normalize (val) {
      var ref = this;
      var min = ref.min;
      var max = ref.max;
      var decimal = (val - min) / (max - min);
      return clamp_1(decimal, 0, 1)
    },
    denormalize: function denormalize (val) {
      var ref = this;
      var min = ref.min;
      var max = ref.max;
      var step = ref.step;
      var precision = ref.precision;
      var range = (max - min);
      var nominal = min + Math.round(range * val / step) * step;
      return parseFloat(nominal.toFixed(precision))
    },
    onRangeChange: function onRangeChange (e) {
      this.normorlizedValue = this.vertical ? 1 - e : e;
    }
  },

  created: function created () {
    this.normorlizedValue = this.normalize(this.value);
    this.$emit('change', this.nominal);
  },

  watch: {
    value: {
      handler: function handler (newVal) {
        var ref = this;
        var max = ref.max;
        var min = ref.min;
        var val = Number(newVal);

        if (val !== clamp_1(val, min, max)) {
          throw new Error("The value " + val + " exceeded range" +
            " [" + min + ", " + max + "]."
          )
        }

        this.normorlizedValue = this.normalize(val);
      },
      immediate: true
    },
    nominal: function nominal (val) {
      this.$emit('change', this.nominal);
    }
  }
};

var Toolbar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-toolbar"},[_vm._t("default")],2)},staticRenderFns: [],
};

/* eslint-disable no-unused-vars */
// WARNING: 以下无内容 NO content allowed AFTER THIS LINE!!!

var component = {
  install: function install (Vue) {
    main.install(Vue);
    var comps = [baseRange, ButtonGroup, Button, CheckboxGroup, Checkbox, BoxItem, Container, Grid, Icon, Input, Radio, RadioGroup, Select, Option, Slider, Toolbar];
    comps.forEach(function (comp) { return comp.name && Vue.component(comp.name, comp); });
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(component);
}

return component;

})));
