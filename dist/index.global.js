"use strict";
var VPlayerReact = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/react/cjs/react.production.js
  var require_react_production = __commonJS({
    "node_modules/react/cjs/react.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
      var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
      var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
      var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
      var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
      var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
      var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      var ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function() {
        },
        enqueueReplaceState: function() {
        },
        enqueueSetState: function() {
        }
      };
      var assign = Object.assign;
      var emptyObject = {};
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      function ComponentDummy() {
      }
      ComponentDummy.prototype = Component.prototype;
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
      pureComponentPrototype.constructor = PureComponent;
      assign(pureComponentPrototype, Component.prototype);
      pureComponentPrototype.isPureReactComponent = true;
      var isArrayImpl = Array.isArray;
      function noop() {
      }
      var ReactSharedInternals = { H: null, A: null, T: null, S: null };
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function ReactElement(type, key, props) {
        var refProp = props.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== refProp ? refProp : null,
          props
        };
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        return ReactElement(oldElement.type, newKey, oldElement.props);
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      var userProvidedKeyEscapeRegex = /\/+/g;
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback)
          return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + invokeCallback
          )), array.push(callback)), 1;
        invokeCallback = 0;
        var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ctor = payload._result;
          ctor = ctor();
          ctor.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 1, payload._result = moduleObject;
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 2, payload._result = error;
            }
          );
          -1 === payload._status && (payload._status = 0, payload._result = ctor);
        }
        if (1 === payload._status) return payload._result.default;
        throw payload._result;
      }
      var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      };
      var Children = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = Children;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(size) {
          return ReactSharedInternals.H.useMemoCache(size);
        }
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key;
        if (null != config)
          for (propName in void 0 !== config.key && (key = "" + config.key), config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          for (var childArray = Array(propName), i = 0; i < propName; i++)
            childArray[i] = arguments[i + 2];
          props.children = childArray;
        }
        return ReactElement(element.type, key, props);
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        var propName, props = {}, key = null;
        if (null != config)
          for (propName in void 0 !== config.key && (key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) props.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
            childArray[i] = arguments[i + 2];
          props.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === props[propName] && (props[propName] = childrenLength[propName]);
        return ReactElement(type, key, props);
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(render) {
        return { $$typeof: REACT_FORWARD_REF_TYPE, render };
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        return {
          $$typeof: REACT_LAZY_TYPE,
          _payload: { _status: -1, _result: ctor },
          _init: lazyInitializer
        };
      };
      exports.memo = function(type, compare) {
        return {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return ReactSharedInternals.H.useCacheRefresh();
      };
      exports.use = function(usable) {
        return ReactSharedInternals.H.use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return ReactSharedInternals.H.useActionState(action, initialState, permalink);
      };
      exports.useCallback = function(callback, deps) {
        return ReactSharedInternals.H.useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        return ReactSharedInternals.H.useContext(Context);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(value, initialValue) {
        return ReactSharedInternals.H.useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        return ReactSharedInternals.H.useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return ReactSharedInternals.H.useEffectEvent(callback);
      };
      exports.useId = function() {
        return ReactSharedInternals.H.useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        return ReactSharedInternals.H.useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        return ReactSharedInternals.H.useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return ReactSharedInternals.H.useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return ReactSharedInternals.H.useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return ReactSharedInternals.H.useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return ReactSharedInternals.H.useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return ReactSharedInternals.H.useTransition();
      };
      exports.version = "19.2.4";
    }
  });

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      "production" !== process.env.NODE_ENV && (function() {
        function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              console.warn(
                "%s(...) is deprecated in plain JavaScript React classes. %s",
                info[0],
                info[1]
              );
            }
          });
        }
        function getIteratorFn(maybeIterable) {
          if (null === maybeIterable || "object" !== typeof maybeIterable)
            return null;
          maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
          return "function" === typeof maybeIterable ? maybeIterable : null;
        }
        function warnNoop(publicInstance, callerName) {
          publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
          var warningKey = publicInstance + "." + callerName;
          didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
            "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
            callerName,
            publicInstance
          ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function ComponentDummy() {
        }
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function noop() {
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          newKey = ReactElement(
            oldElement.type,
            newKey,
            oldElement.props,
            oldElement._owner,
            oldElement._debugStack,
            oldElement._debugTask
          );
          oldElement._store && (newKey._store.validated = oldElement._store.validated);
          return newKey;
        }
        function validateChildKeys(node) {
          isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function escape(key) {
          var escaperLookup = { "=": "=0", ":": "=2" };
          return "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
          });
        }
        function getElementKey(element, index) {
          return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
        }
        function resolveThenable(thenable) {
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
            default:
              switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
                function(fulfilledValue) {
                  "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
                },
                function(error) {
                  "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              )), thenable.status) {
                case "fulfilled":
                  return thenable.value;
                case "rejected":
                  throw thenable.reason;
              }
          }
          throw thenable;
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if ("undefined" === type || "boolean" === type) children = null;
          var invokeCallback = false;
          if (null === children) invokeCallback = true;
          else
            switch (type) {
              case "bigint":
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                    break;
                  case REACT_LAZY_TYPE:
                    return invokeCallback = children._init, mapIntoArray(
                      invokeCallback(children._payload),
                      array,
                      escapedPrefix,
                      nameSoFar,
                      callback
                    );
                }
            }
          if (invokeCallback) {
            invokeCallback = children;
            callback = callback(invokeCallback);
            var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
            isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
              return c;
            })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
              callback,
              escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
                userProvidedKeyEscapeRegex,
                "$&/"
              ) + "/") + childKey
            ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
            return 1;
          }
          invokeCallback = 0;
          childKey = "" === nameSoFar ? "." : nameSoFar + ":";
          if (isArrayImpl(children))
            for (var i = 0; i < children.length; i++)
              nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if (i = getIteratorFn(children), "function" === typeof i)
            for (i === children.entries && (didWarnAboutMaps || console.warn(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
              nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if ("object" === type) {
            if ("function" === typeof children.then)
              return mapIntoArray(
                resolveThenable(children),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
            array = String(children);
            throw Error(
              "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
            );
          }
          return invokeCallback;
        }
        function mapChildren(children, func, context) {
          if (null == children) return children;
          var result = [], count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function lazyInitializer(payload) {
          if (-1 === payload._status) {
            var ioInfo = payload._ioInfo;
            null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
            ioInfo = payload._result;
            var thenable = ioInfo();
            thenable.then(
              function(moduleObject) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 1;
                  payload._result = moduleObject;
                  var _ioInfo = payload._ioInfo;
                  null != _ioInfo && (_ioInfo.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
                }
              },
              function(error) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 2;
                  payload._result = error;
                  var _ioInfo2 = payload._ioInfo;
                  null != _ioInfo2 && (_ioInfo2.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              }
            );
            ioInfo = payload._ioInfo;
            if (null != ioInfo) {
              ioInfo.value = thenable;
              var displayName = thenable.displayName;
              "string" === typeof displayName && (ioInfo.name = displayName);
            }
            -1 === payload._status && (payload._status = 0, payload._result = thenable);
          }
          if (1 === payload._status)
            return ioInfo = payload._result, void 0 === ioInfo && console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
              ioInfo
            ), "default" in ioInfo || console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
              ioInfo
            ), ioInfo.default;
          throw payload._result;
        }
        function resolveDispatcher() {
          var dispatcher = ReactSharedInternals.H;
          null === dispatcher && console.error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
          );
          return dispatcher;
        }
        function releaseAsyncTransition() {
          ReactSharedInternals.asyncTransitions--;
        }
        function enqueueTask(task) {
          if (null === enqueueTaskImpl)
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              enqueueTaskImpl = (module && module[requireString]).call(
                module,
                "timers"
              ).setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                  "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
                ));
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          return enqueueTaskImpl(task);
        }
        function aggregateErrors(errors) {
          return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
        }
        function popActScope(prevActQueue, prevActScopeDepth) {
          prevActScopeDepth !== actScopeDepth - 1 && console.error(
            "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
          );
          actScopeDepth = prevActScopeDepth;
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          var queue = ReactSharedInternals.actQueue;
          if (null !== queue)
            if (0 !== queue.length)
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                });
                return;
              } catch (error) {
                ReactSharedInternals.thrownErrors.push(error);
              }
            else ReactSharedInternals.actQueue = null;
          0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
        }
        function flushActQueue(queue) {
          if (!isFlushing) {
            isFlushing = true;
            var i = 0;
            try {
              for (; i < queue.length; i++) {
                var callback = queue[i];
                do {
                  ReactSharedInternals.didUsePromise = false;
                  var continuation = callback(false);
                  if (null !== continuation) {
                    if (ReactSharedInternals.didUsePromise) {
                      queue[i] = callback;
                      queue.splice(0, i);
                      return;
                    }
                    callback = continuation;
                  } else break;
                } while (1);
              }
              queue.length = 0;
            } catch (error) {
              queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
            } finally {
              isFlushing = false;
            }
          }
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
          isMounted: function() {
            return false;
          },
          enqueueForceUpdate: function(publicInstance) {
            warnNoop(publicInstance, "forceUpdate");
          },
          enqueueReplaceState: function(publicInstance) {
            warnNoop(publicInstance, "replaceState");
          },
          enqueueSetState: function(publicInstance) {
            warnNoop(publicInstance, "setState");
          }
        }, assign = Object.assign, emptyObject = {};
        Object.freeze(emptyObject);
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
            throw Error(
              "takes an object of state variables to update or a function which returns an object of state variables."
            );
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        var deprecatedAPIs = {
          isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
          ],
          replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
          ]
        };
        for (fnName in deprecatedAPIs)
          deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        ComponentDummy.prototype = Component.prototype;
        deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
        deprecatedAPIs.constructor = PureComponent;
        assign(deprecatedAPIs, Component.prototype);
        deprecatedAPIs.isPureReactComponent = true;
        var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
          H: null,
          A: null,
          T: null,
          S: null,
          actQueue: null,
          asyncTransitions: 0,
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false,
          didUsePromise: false,
          thrownErrors: [],
          getCurrentStack: null,
          recentlyCreatedOwnerStacks: 0
        }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        deprecatedAPIs = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
          deprecatedAPIs,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
          if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
            var event = new window.ErrorEvent("error", {
              bubbles: true,
              cancelable: true,
              message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
              error
            });
            if (!window.dispatchEvent(event)) return;
          } else if ("object" === typeof process && "function" === typeof process.emit) {
            process.emit("uncaughtException", error);
            return;
          }
          console.error(error);
        }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
          queueMicrotask(function() {
            return queueMicrotask(callback);
          });
        } : enqueueTask;
        deprecatedAPIs = Object.freeze({
          __proto__: null,
          c: function(size) {
            return resolveDispatcher().useMemoCache(size);
          }
        });
        var fnName = {
          map: mapChildren,
          forEach: function(children, forEachFunc, forEachContext) {
            mapChildren(
              children,
              function() {
                forEachFunc.apply(this, arguments);
              },
              forEachContext
            );
          },
          count: function(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          },
          toArray: function(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          },
          only: function(children) {
            if (!isValidElement(children))
              throw Error(
                "React.Children.only expected to receive a single React element child."
              );
            return children;
          }
        };
        exports.Activity = REACT_ACTIVITY_TYPE;
        exports.Children = fnName;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
        exports.__COMPILER_RUNTIME = deprecatedAPIs;
        exports.act = function(callback) {
          var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
          try {
            var result = callback();
          } catch (error) {
            ReactSharedInternals.thrownErrors.push(error);
          }
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          if (null !== result && "object" === typeof result && "function" === typeof result.then) {
            var thenable = result;
            queueSeveralMicrotasks(function() {
              didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
                "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
              ));
            });
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                thenable.then(
                  function(returnValue) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    if (0 === prevActScopeDepth) {
                      try {
                        flushActQueue(queue), enqueueTask(function() {
                          return recursivelyFlushAsyncActWork(
                            returnValue,
                            resolve,
                            reject
                          );
                        });
                      } catch (error$0) {
                        ReactSharedInternals.thrownErrors.push(error$0);
                      }
                      if (0 < ReactSharedInternals.thrownErrors.length) {
                        var _thrownError = aggregateErrors(
                          ReactSharedInternals.thrownErrors
                        );
                        ReactSharedInternals.thrownErrors.length = 0;
                        reject(_thrownError);
                      }
                    } else resolve(returnValue);
                  },
                  function(error) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                      ReactSharedInternals.thrownErrors
                    ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                  }
                );
              }
            };
          }
          var returnValue$jscomp$0 = result;
          popActScope(prevActQueue, prevActScopeDepth);
          0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
            ));
          }), ReactSharedInternals.actQueue = null);
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
                return recursivelyFlushAsyncActWork(
                  returnValue$jscomp$0,
                  resolve,
                  reject
                );
              })) : resolve(returnValue$jscomp$0);
            }
          };
        };
        exports.cache = function(fn) {
          return function() {
            return fn.apply(null, arguments);
          };
        };
        exports.cacheSignal = function() {
          return null;
        };
        exports.captureOwnerStack = function() {
          var getCurrentStack = ReactSharedInternals.getCurrentStack;
          return null === getCurrentStack ? null : getCurrentStack();
        };
        exports.cloneElement = function(element, config, children) {
          if (null === element || void 0 === element)
            throw Error(
              "The argument must be a React element, but you passed " + element + "."
            );
          var props = assign({}, element.props), key = element.key, owner = element._owner;
          if (null != config) {
            var JSCompiler_inline_result;
            a: {
              if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
                config,
                "ref"
              ).get) && JSCompiler_inline_result.isReactWarning) {
                JSCompiler_inline_result = false;
                break a;
              }
              JSCompiler_inline_result = void 0 !== config.ref;
            }
            JSCompiler_inline_result && (owner = getOwner());
            hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
            for (propName in config)
              !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
          }
          var propName = arguments.length - 2;
          if (1 === propName) props.children = children;
          else if (1 < propName) {
            JSCompiler_inline_result = Array(propName);
            for (var i = 0; i < propName; i++)
              JSCompiler_inline_result[i] = arguments[i + 2];
            props.children = JSCompiler_inline_result;
          }
          props = ReactElement(
            element.type,
            key,
            props,
            owner,
            element._debugStack,
            element._debugTask
          );
          for (key = 2; key < arguments.length; key++)
            validateChildKeys(arguments[key]);
          return props;
        };
        exports.createContext = function(defaultValue) {
          defaultValue = {
            $$typeof: REACT_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null
          };
          defaultValue.Provider = defaultValue;
          defaultValue.Consumer = {
            $$typeof: REACT_CONSUMER_TYPE,
            _context: defaultValue
          };
          defaultValue._currentRenderer = null;
          defaultValue._currentRenderer2 = null;
          return defaultValue;
        };
        exports.createElement = function(type, config, children) {
          for (var i = 2; i < arguments.length; i++)
            validateChildKeys(arguments[i]);
          i = {};
          var key = null;
          if (null != config)
            for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
              "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
            )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
              hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
          var childrenLength = arguments.length - 2;
          if (1 === childrenLength) i.children = children;
          else if (1 < childrenLength) {
            for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
              childArray[_i] = arguments[_i + 2];
            Object.freeze && Object.freeze(childArray);
            i.children = childArray;
          }
          if (type && type.defaultProps)
            for (propName in childrenLength = type.defaultProps, childrenLength)
              void 0 === i[propName] && (i[propName] = childrenLength[propName]);
          key && defineKeyPropWarningGetter(
            i,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return ReactElement(
            type,
            key,
            i,
            getOwner(),
            propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.createRef = function() {
          var refObject = { current: null };
          Object.seal(refObject);
          return refObject;
        };
        exports.forwardRef = function(render) {
          null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
            "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
          ) : "function" !== typeof render ? console.error(
            "forwardRef requires a render function but was given %s.",
            null === render ? "null" : typeof render
          ) : 0 !== render.length && 2 !== render.length && console.error(
            "forwardRef render functions accept exactly two parameters: props and ref. %s",
            1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
          );
          null != render && null != render.defaultProps && console.error(
            "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
          );
          var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
            }
          });
          return elementType;
        };
        exports.isValidElement = isValidElement;
        exports.lazy = function(ctor) {
          ctor = { _status: -1, _result: ctor };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: ctor,
            _init: lazyInitializer
          }, ioInfo = {
            name: "lazy",
            start: -1,
            end: -1,
            value: null,
            owner: null,
            debugStack: Error("react-stack-top-frame"),
            debugTask: console.createTask ? console.createTask("lazy()") : null
          };
          ctor._ioInfo = ioInfo;
          lazyType._debugInfo = [{ awaited: ioInfo }];
          return lazyType;
        };
        exports.memo = function(type, compare) {
          null == type && console.error(
            "memo: The first argument must be a component. Instead received: %s",
            null === type ? "null" : typeof type
          );
          compare = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: void 0 === compare ? null : compare
          };
          var ownName;
          Object.defineProperty(compare, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
            }
          });
          return compare;
        };
        exports.startTransition = function(scope) {
          var prevTransition = ReactSharedInternals.T, currentTransition = {};
          currentTransition._updatedFibers = /* @__PURE__ */ new Set();
          ReactSharedInternals.T = currentTransition;
          try {
            var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
          } catch (error) {
            reportGlobalError(error);
          } finally {
            null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
              "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
            )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
              "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
            ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
          }
        };
        exports.unstable_useCacheRefresh = function() {
          return resolveDispatcher().useCacheRefresh();
        };
        exports.use = function(usable) {
          return resolveDispatcher().use(usable);
        };
        exports.useActionState = function(action, initialState, permalink) {
          return resolveDispatcher().useActionState(
            action,
            initialState,
            permalink
          );
        };
        exports.useCallback = function(callback, deps) {
          return resolveDispatcher().useCallback(callback, deps);
        };
        exports.useContext = function(Context) {
          var dispatcher = resolveDispatcher();
          Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
            "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
          );
          return dispatcher.useContext(Context);
        };
        exports.useDebugValue = function(value, formatterFn) {
          return resolveDispatcher().useDebugValue(value, formatterFn);
        };
        exports.useDeferredValue = function(value, initialValue) {
          return resolveDispatcher().useDeferredValue(value, initialValue);
        };
        exports.useEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useEffect(create, deps);
        };
        exports.useEffectEvent = function(callback) {
          return resolveDispatcher().useEffectEvent(callback);
        };
        exports.useId = function() {
          return resolveDispatcher().useId();
        };
        exports.useImperativeHandle = function(ref, create, deps) {
          return resolveDispatcher().useImperativeHandle(ref, create, deps);
        };
        exports.useInsertionEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useInsertionEffect(create, deps);
        };
        exports.useLayoutEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useLayoutEffect(create, deps);
        };
        exports.useMemo = function(create, deps) {
          return resolveDispatcher().useMemo(create, deps);
        };
        exports.useOptimistic = function(passthrough, reducer) {
          return resolveDispatcher().useOptimistic(passthrough, reducer);
        };
        exports.useReducer = function(reducer, initialArg, init) {
          return resolveDispatcher().useReducer(reducer, initialArg, init);
        };
        exports.useRef = function(initialValue) {
          return resolveDispatcher().useRef(initialValue);
        };
        exports.useState = function(initialState) {
          return resolveDispatcher().useState(initialState);
        };
        exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
          return resolveDispatcher().useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot
          );
        };
        exports.useTransition = function() {
          return resolveDispatcher().useTransition();
        };
        exports.version = "19.2.4";
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (process.env.NODE_ENV === "production") {
        module.exports = require_react_production();
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // node_modules/react/cjs/react-jsx-runtime.production.js
  var require_react_jsx_runtime_production = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      function jsxProd(type, config, maybeKey) {
        var key = null;
        void 0 !== maybeKey && (key = "" + maybeKey);
        void 0 !== config.key && (key = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        config = maybeKey.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== config ? config : null,
          props: maybeKey
        };
      }
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = jsxProd;
      exports.jsxs = jsxProd;
    }
  });

  // node_modules/react/cjs/react-jsx-runtime.development.js
  var require_react_jsx_runtime_development = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
      "use strict";
      "production" !== process.env.NODE_ENV && (function() {
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
          var children = config.children;
          if (void 0 !== children)
            if (isStaticChildren)
              if (isArrayImpl(children)) {
                for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                  validateChildKeys(children[isStaticChildren]);
                Object.freeze && Object.freeze(children);
              } else
                console.error(
                  "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
                );
            else validateChildKeys(children);
          if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
              return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
              'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
              isStaticChildren,
              children,
              keys,
              children
            ), didWarnAboutKeySpread[children + isStaticChildren] = true);
          }
          children = null;
          void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
          hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
          if ("key" in config) {
            maybeKey = {};
            for (var propName in config)
              "key" !== propName && (maybeKey[propName] = config[propName]);
          } else maybeKey = config;
          children && defineKeyPropWarningGetter(
            maybeKey,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          return ReactElement(
            type,
            children,
            maybeKey,
            getOwner(),
            debugStack,
            debugTask
          );
        }
        function validateChildKeys(node) {
          isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        var React2 = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        React2 = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = React2.react_stack_bottom_frame.bind(
          React2,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutKeySpread = {};
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.jsx = function(type, config, maybeKey) {
          var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return jsxDEVImpl(
            type,
            config,
            maybeKey,
            false,
            trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.jsxs = function(type, config, maybeKey) {
          var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return jsxDEVImpl(
            type,
            config,
            maybeKey,
            true,
            trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
      })();
    }
  });

  // node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (process.env.NODE_ENV === "production") {
        module.exports = require_react_jsx_runtime_production();
      } else {
        module.exports = require_react_jsx_runtime_development();
      }
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    VPlayer: () => VPlayer,
    formatTime: () => formatTime,
    parseAspectRatio: () => parseAspectRatio,
    parseVideoSource: () => parseVideoSource
  });

  // src/VPlayer.tsx
  var import_react = __toESM(require_react());

  // src/utils.ts
  function parseVideoSource(src) {
    const ytMatch = src.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) {
      return {
        type: "youtube",
        videoId: ytMatch[1],
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
      };
    }
    const vimeoMatch = src.match(
      /(?:vimeo\.com\/)(\d+)/
    );
    if (vimeoMatch) {
      return {
        type: "vimeo",
        videoId: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&portrait=0&title=0`
      };
    }
    const biliMatch = src.match(
      /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/
    );
    if (biliMatch) {
      return {
        type: "bilibili",
        videoId: biliMatch[1],
        embedUrl: `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&high_quality=1&danmaku=0`
      };
    }
    const biliAidMatch = src.match(
      /bilibili\.com\/video\/av(\d+)/
    );
    if (biliAidMatch) {
      return {
        type: "bilibili",
        videoId: biliAidMatch[1],
        embedUrl: `https://player.bilibili.com/player.html?aid=${biliAidMatch[1]}&high_quality=1&danmaku=0`
      };
    }
    return {
      type: "native",
      videoId: "",
      embedUrl: src
    };
  }
  function formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    const sStr = s.toString().padStart(2, "0");
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${sStr}`;
    }
    return `${m}:${sStr}`;
  }
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function parseAspectRatio(ratio) {
    const parts = ratio.split(":");
    if (parts.length === 2) {
      const w = parseFloat(parts[0]);
      const h = parseFloat(parts[1]);
      if (w > 0 && h > 0) return h / w;
    }
    return 9 / 16;
  }

  // src/icons.tsx
  var import_jsx_runtime = __toESM(require_jsx_runtime());
  function PlayIcon({ size = 24, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M6.5 4.226a.75.75 0 0 1 1.146-.638l11.2 7.274a.75.75 0 0 1 0 1.276l-11.2 7.274A.75.75 0 0 1 6.5 18.774V4.226Z",
            fill: color
          }
        )
      }
    );
  }
  function PauseIcon({ size = 24, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", fill: color }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", fill: color })
        ]
      }
    );
  }
  function VolumeHighIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "path",
            {
              d: "M11 5L6 9H2v6h4l5 4V5Z",
              fill: color
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "path",
            {
              d: "M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14",
              stroke: color,
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
  function VolumeLowIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "path",
            {
              d: "M11 5L6 9H2v6h4l5 4V5Z",
              fill: color
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "path",
            {
              d: "M15.54 8.46a5 5 0 0 1 0 7.07",
              stroke: color,
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
  function VolumeMuteIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "path",
            {
              d: "M11 5L6 9H2v6h4l5 4V5Z",
              fill: color
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "path",
            {
              d: "M23 9l-6 6M17 9l6 6",
              stroke: color,
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
  function FullscreenIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
            stroke: color,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
  function ExitFullscreenIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3",
            stroke: color,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    );
  }
  function SettingsIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "3", stroke: color, strokeWidth: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "path",
            {
              d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z",
              stroke: color,
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ]
      }
    );
  }
  function PipIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", stroke: color, strokeWidth: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "11", y: "9", width: "9", height: "6", rx: "1", fill: color })
        ]
      }
    );
  }
  function SpinnerIcon({ size = 40, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: { animation: "vplayer-spin 1s linear infinite", ...style },
        "aria-hidden": "true",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "10",
            stroke: color,
            strokeWidth: "3",
            strokeDasharray: "31.4 31.4",
            strokeLinecap: "round",
            opacity: "0.7"
          }
        )
      }
    );
  }
  function CCIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2", stroke: color, strokeWidth: "1.5" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 12.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2", stroke: color, strokeWidth: "1.5", strokeLinecap: "round" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13 12.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2", stroke: color, strokeWidth: "1.5", strokeLinecap: "round" })
    ] });
  }
  function ErrorIcon({ size = 40, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style,
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "10", stroke: "#ef4444", strokeWidth: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 8v4", stroke: "#ef4444", strokeWidth: "2", strokeLinecap: "round" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "16", r: "1", fill: "#ef4444" })
        ]
      }
    );
  }
  function PrevIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 5L9 12l10 7V5Z", fill: color }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "5", y: "5", width: "2", height: "14", rx: "1", fill: color })
    ] });
  }
  function NextIcon({ size = 20, color = "#fff", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 5l10 7-10 7V5Z", fill: color }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "17", y: "5", width: "2", height: "14", rx: "1", fill: color })
    ] });
  }

  // src/styles.ts
  function getContainerStyle(width) {
    return {
      position: "relative",
      width: typeof width === "number" ? `${width}px` : width,
      maxWidth: "100%",
      backgroundColor: "#000",
      overflow: "hidden",
      outline: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      isolation: "isolate"
    };
  }
  function getAspectBoxStyle(ratio) {
    return {
      position: "relative",
      width: "100%",
      paddingTop: `${ratio * 100}%`
    };
  }
  function getInnerStyle() {
    return {
      position: "absolute",
      inset: 0
    };
  }
  function getVideoStyle() {
    return {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block"
    };
  }
  function getIframeStyle() {
    return {
      width: "100%",
      height: "100%",
      border: "none"
    };
  }
  function getPosterOverlayStyle(posterUrl, visible) {
    return {
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${posterUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: visible ? "pointer" : "default",
      zIndex: 10,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s ease",
      pointerEvents: visible ? "auto" : "none"
    };
  }
  function getPosterGradientStyle() {
    return {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)"
    };
  }
  function getPlayButtonLargeStyle(accentColor) {
    return {
      position: "relative",
      zIndex: 1,
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      backgroundColor: accentColor,
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      boxShadow: `0 4px 24px ${accentColor}66`,
      padding: 0
    };
  }
  function getControlsBarStyle(visible) {
    return {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      background: "linear-gradient(transparent, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.85))",
      padding: "32px 16px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s ease",
      pointerEvents: visible ? "auto" : "none",
      zIndex: 20
    };
  }
  function getProgressContainerStyle() {
    return {
      position: "relative",
      width: "100%",
      height: "20px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer"
    };
  }
  function getProgressTrackStyle() {
    return {
      position: "absolute",
      left: 0,
      right: 0,
      height: "4px",
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: "2px",
      overflow: "hidden",
      transition: "height 0.15s ease"
    };
  }
  function getProgressBufferStyle(buffered) {
    return {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${buffered}%`,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: "2px"
    };
  }
  function getProgressFillStyle(progress, accentColor) {
    return {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${progress}%`,
      backgroundColor: accentColor,
      borderRadius: "2px",
      transition: "none"
    };
  }
  function getProgressThumbStyle(progress, accentColor, isHovering) {
    return {
      position: "absolute",
      left: `${progress}%`,
      top: "50%",
      width: isHovering ? "14px" : "0px",
      height: isHovering ? "14px" : "0px",
      borderRadius: "50%",
      backgroundColor: accentColor,
      transform: "translate(-50%, -50%)",
      transition: "width 0.15s ease, height 0.15s ease",
      boxShadow: `0 0 6px ${accentColor}88`,
      zIndex: 2,
      pointerEvents: "none"
    };
  }
  function getControlsRowStyle() {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px"
    };
  }
  function getControlGroupStyle() {
    return {
      display: "flex",
      alignItems: "center",
      gap: "4px"
    };
  }
  function getControlButtonStyle() {
    return {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "background-color 0.15s ease",
      color: "#fff",
      lineHeight: 1
    };
  }
  function getTimeDisplayStyle() {
    return {
      color: "rgba(255,255,255,0.85)",
      fontSize: "13px",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
      letterSpacing: "0.02em",
      padding: "0 4px"
    };
  }
  function getVolumeSliderContainerStyle() {
    return {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      position: "relative"
    };
  }
  function getVolumeSliderTrackStyle() {
    return {
      width: "60px",
      height: "20px",
      backgroundColor: "transparent",
      borderRadius: "2px",
      position: "relative",
      cursor: "pointer",
      display: "flex",
      alignItems: "center"
    };
  }
  function getVolumeSliderTrackBarStyle() {
    return {
      position: "absolute",
      left: 0,
      right: 0,
      height: "4px",
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: "2px"
    };
  }
  function getVolumeSliderFillStyle(volume, accentColor) {
    return {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${volume * 100}%`,
      backgroundColor: accentColor,
      borderRadius: "2px"
    };
  }
  function getVolumeSliderThumbStyle(volume, accentColor) {
    return {
      position: "absolute",
      left: `${volume * 100}%`,
      top: "50%",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: accentColor,
      transform: "translate(-50%, -50%)",
      boxShadow: `0 0 4px ${accentColor}66`,
      zIndex: 1,
      pointerEvents: "none"
    };
  }
  function getErrorOverlayStyle() {
    return {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      backgroundColor: "rgba(0,0,0,0.7)",
      zIndex: 15
    };
  }
  function getErrorMessageStyle() {
    return {
      color: "rgba(255,255,255,0.85)",
      fontSize: "14px",
      textAlign: "center",
      maxWidth: "80%"
    };
  }
  function getLoadingOverlayStyle() {
    return {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.3)",
      zIndex: 15,
      pointerEvents: "none"
    };
  }
  function getTitleOverlayStyle() {
    return {
      position: "absolute",
      top: "16px",
      left: "16px",
      color: "#fff",
      fontSize: "14px",
      fontWeight: 500,
      textShadow: "0 1px 4px rgba(0,0,0,0.5)",
      zIndex: 5,
      maxWidth: "70%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };
  }
  function getSpeedMenuStyle() {
    return {
      position: "absolute",
      bottom: "48px",
      right: 0,
      backgroundColor: "rgba(20,20,20,0.95)",
      borderRadius: "8px",
      padding: "4px 0",
      minWidth: "100px",
      maxHeight: "240px",
      overflowY: "auto",
      zIndex: 30,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.1)"
    };
  }
  function getSpeedMenuItemStyle(isActive, accentColor) {
    return {
      display: "block",
      width: "100%",
      padding: "6px 16px",
      background: "none",
      border: "none",
      color: isActive ? accentColor : "rgba(255,255,255,0.85)",
      fontSize: "13px",
      cursor: "pointer",
      textAlign: "left",
      fontWeight: isActive ? 600 : 400,
      transition: "background-color 0.1s ease"
    };
  }
  function getTooltipStyle(x) {
    const safeX = Math.min(Math.max(x, 5), 95);
    return {
      position: "absolute",
      bottom: "24px",
      left: `${safeX}%`,
      transform: "translateX(-50%)",
      backgroundColor: "rgba(0,0,0,0.85)",
      color: "#fff",
      fontSize: "12px",
      padding: "3px 8px",
      borderRadius: "4px",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums",
      zIndex: 5
    };
  }
  function getCCMenuStyle() {
    return {
      position: "absolute",
      bottom: "48px",
      right: "0",
      backgroundColor: "rgba(20,20,20,0.95)",
      borderRadius: "8px",
      padding: "4px 0",
      minWidth: "120px",
      zIndex: 30,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.1)"
    };
  }
  function getShortcutsOverlayStyle() {
    return {
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 40
    };
  }
  function getShortcutsBoxStyle() {
    return {
      backgroundColor: "rgba(20,20,20,0.97)",
      borderRadius: "12px",
      padding: "20px 24px",
      minWidth: "280px",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: "#fff"
    };
  }
  function getShortcutRowStyle() {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "5px 0",
      gap: "16px"
    };
  }
  function getKbdStyle() {
    return {
      fontFamily: "monospace",
      fontSize: "12px",
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "4px",
      padding: "2px 6px",
      color: "#fff",
      whiteSpace: "nowrap"
    };
  }
  function getChapterMarkerStyle(pct) {
    return {
      position: "absolute",
      left: `${pct}%`,
      top: 0,
      bottom: 0,
      width: "2px",
      backgroundColor: "rgba(255,255,255,0.5)",
      transform: "translateX(-50%)",
      pointerEvents: "none",
      zIndex: 3
    };
  }
  function getPreviewThumbnailStyle(x, thumb, frameIndex) {
    const safeX = Math.min(Math.max(x, 5), 95);
    return {
      position: "absolute",
      bottom: "52px",
      left: `${safeX}%`,
      transform: "translateX(-50%)",
      width: `${thumb.width}px`,
      height: `${thumb.height}px`,
      backgroundImage: `url(${thumb.src})`,
      backgroundPosition: `-${frameIndex * thumb.width}px 0`,
      backgroundSize: `${thumb.width * thumb.count}px ${thumb.height}px`,
      backgroundRepeat: "no-repeat",
      borderRadius: "4px",
      border: "2px solid rgba(255,255,255,0.3)",
      pointerEvents: "none",
      zIndex: 5
    };
  }
  var injected = false;
  function injectKeyframes() {
    if (injected || typeof document === "undefined") return;
    injected = true;
    const style = document.createElement("style");
    style.textContent = `
    @keyframes vplayer-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    [data-vplayer-root] {
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.5;
    }
    [data-vplayer-root]:focus-visible {
      outline: 2px solid rgba(255,255,255,0.2);
      outline-offset: 2px;
    }
    [data-vplayer-root]:fullscreen,
    [data-vplayer-root]:-webkit-full-screen {
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 0 !important;
    }
    [data-vplayer-root]:fullscreen [data-vplayer-aspect],
    [data-vplayer-root]:-webkit-full-screen [data-vplayer-aspect] {
      padding-top: 0 !important;
      height: 100vh;
    }
    [data-vplayer-root]:fullscreen [data-vplayer-inner],
    [data-vplayer-root]:-webkit-full-screen [data-vplayer-inner] {
      position: static;
    }
    @media (pointer: coarse) {
      [data-vplayer-volume-slider] {
        display: none !important;
      }
    }
  `;
    document.head.appendChild(style);
  }

  // src/VPlayer.tsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime());
  var DEFAULT_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect fill='%23111' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='central' textAnchor='middle' fontFamily='system-ui' fontSize='48' fill='%23333'%3EVideo%3C/text%3E%3C/svg%3E";
  var PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  var HIDE_CONTROLS_DELAY = 3e3;
  var VOLUME_STORAGE_KEY = "vplayer-volume";
  var SHORTCUTS = [
    ["Space / K", "Play / Pause"],
    ["\u2190 / \u2192", "Seek \xB15s"],
    ["Shift+\u2190 / \u2192", "Prev / Next chapter"],
    ["\u2191 / \u2193", "Volume \xB110%"],
    ["F", "Fullscreen"],
    ["M", "Mute"],
    ["0\u20139", "Seek to 0%\u201390%"],
    ["< / >", "Speed down / up"],
    ["?", "Toggle shortcuts"]
  ];
  var DEFAULT_KEYMAP = {
    play: [" ", "k"],
    mute: "m",
    fullscreen: "f",
    seekBack: "ArrowLeft",
    seekForward: "ArrowRight",
    volumeUp: "ArrowUp",
    volumeDown: "ArrowDown",
    speedDown: "<",
    speedUp: ">",
    shortcuts: "?"
  };
  function matchesKey(key, binding) {
    if (!binding) return false;
    return Array.isArray(binding) ? binding.includes(key) : binding === key;
  }
  var VPlayer = (0, import_react.forwardRef)(function VPlayer2({
    src,
    poster,
    width = "100%",
    aspectRatio = "16:9",
    accentColor = "#e11d48",
    iconColor = "#ffffff",
    initialTime,
    autoPlay = false,
    loop = false,
    loopPlaylist = false,
    muted = false,
    title,
    className,
    style,
    onPlay,
    onPause,
    onEnded,
    onError,
    onSeek,
    onTimeUpdate,
    preload = "metadata",
    ariaLabel,
    tracks,
    onBuffer,
    chapters,
    previewThumbnails,
    onMilestone,
    onNext,
    onPrev,
    activeIndex,
    onIndexChange,
    persistVolume = false,
    onChapterChange,
    onVolumeChange,
    keymap
  }, ref) {
    const srcList = Array.isArray(src) ? src : [src];
    const isPlaylist = srcList.length > 1;
    const [internalIndex, setInternalIndex] = (0, import_react.useState)(0);
    const isControlled = activeIndex !== void 0;
    const currentIndex = isControlled ? activeIndex : internalIndex;
    const setCurrentIndex = (0, import_react.useCallback)(
      (updater) => {
        const nextIndex = typeof updater === "function" ? updater(currentIndex) : updater;
        if (isControlled) {
          onIndexChange?.(nextIndex);
        } else {
          setInternalIndex(nextIndex);
          onIndexChange?.(nextIndex);
        }
      },
      [isControlled, currentIndex, onIndexChange]
    );
    const activeSrc = srcList[currentIndex] ?? srcList[0];
    const containerRef = (0, import_react.useRef)(null);
    const videoRef = (0, import_react.useRef)(null);
    const progressRef = (0, import_react.useRef)(null);
    const hideTimerRef = (0, import_react.useRef)(null);
    const isPlayingRef = (0, import_react.useRef)(false);
    const hasStartedRef = (0, import_react.useRef)(false);
    const milestonesFiredRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
    const playlistAdvancingRef = (0, import_react.useRef)(false);
    const initialTimeAppliedRef = (0, import_react.useRef)(false);
    const currentChapterRef = (0, import_react.useRef)(null);
    const parsed = parseVideoSource(activeSrc);
    const ratio = parseAspectRatio(aspectRatio);
    const isNative = parsed.type === "native";
    const resolvedKeymap = (0, import_react.useMemo)(
      () => ({ ...DEFAULT_KEYMAP, ...keymap }),
      [keymap]
    );
    const [state, setState] = (0, import_react.useState)(() => {
      let volume = muted ? 0 : 1;
      let isMuted = muted;
      if (persistVolume && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
          if (stored !== null) {
            const vol = parseFloat(stored);
            if (isFinite(vol) && vol >= 0 && vol <= 1) {
              volume = vol;
              isMuted = vol === 0;
            }
          }
        } catch {
        }
      }
      return {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume,
        isMuted,
        isFullscreen: false,
        buffered: 0,
        isLoading: false,
        hasStarted: false,
        showControls: true,
        isFocused: false,
        playbackRate: 1,
        error: null
      };
    });
    const [showSpeedMenu, setShowSpeedMenu] = (0, import_react.useState)(false);
    const [showVolumeSlider, setShowVolumeSlider] = (0, import_react.useState)(false);
    const [showCCMenu, setShowCCMenu] = (0, import_react.useState)(false);
    const [showShortcuts, setShowShortcuts] = (0, import_react.useState)(false);
    const [hoverProgress, setHoverProgress] = (0, import_react.useState)(null);
    const [isDragging, setIsDragging] = (0, import_react.useState)(false);
    const [embedStarted, setEmbedStarted] = (0, import_react.useState)(false);
    const [supportsPip, setSupportsPip] = (0, import_react.useState)(false);
    const [activeTrack, setActiveTrack] = (0, import_react.useState)(null);
    (0, import_react.useEffect)(() => {
      injectKeyframes();
      setSupportsPip("pictureInPictureEnabled" in document);
    }, []);
    (0, import_react.useEffect)(() => {
      if (!persistVolume) return;
      try {
        localStorage.setItem(
          VOLUME_STORAGE_KEY,
          String(state.isMuted ? 0 : state.volume)
        );
      } catch {
      }
    }, [persistVolume, state.volume, state.isMuted]);
    (0, import_react.useEffect)(() => {
      isPlayingRef.current = state.isPlaying;
    }, [state.isPlaying]);
    (0, import_react.useEffect)(() => {
      hasStartedRef.current = state.hasStarted;
    }, [state.hasStarted]);
    const resetHideTimer = (0, import_react.useCallback)(() => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setState((s) => ({ ...s, showControls: true }));
      if (isPlayingRef.current && hasStartedRef.current) {
        hideTimerRef.current = setTimeout(() => {
          setState((s) => ({ ...s, showControls: false }));
          setShowSpeedMenu(false);
          setShowVolumeSlider(false);
        }, HIDE_CONTROLS_DELAY);
      }
    }, []);
    (0, import_react.useEffect)(() => {
      const handleFSChange = () => {
        setState((s) => ({
          ...s,
          isFullscreen: !!(document.fullscreenElement || document.webkitFullscreenElement)
        }));
      };
      document.addEventListener("fullscreenchange", handleFSChange);
      document.addEventListener("webkitfullscreenchange", handleFSChange);
      return () => {
        document.removeEventListener("fullscreenchange", handleFSChange);
        document.removeEventListener("webkitfullscreenchange", handleFSChange);
      };
    }, []);
    (0, import_react.useEffect)(() => {
      setState((s) => ({
        ...s,
        currentTime: 0,
        duration: 0,
        hasStarted: false,
        isPlaying: false,
        buffered: 0,
        isLoading: false,
        error: null
      }));
      milestonesFiredRef.current = /* @__PURE__ */ new Set();
      setEmbedStarted(false);
      if (playlistAdvancingRef.current) {
        playlistAdvancingRef.current = false;
        const v = videoRef.current;
        if (v) {
          setState((s) => ({ ...s, hasStarted: true, isLoading: true }));
          const attemptPlay = () => {
            v.play().then(
              () => setState((s) => ({ ...s, isPlaying: true, isLoading: false }))
            ).catch(() => setState((s) => ({ ...s, isPlaying: false })));
          };
          v.addEventListener("canplay", attemptPlay, { once: true });
          return () => {
            v.removeEventListener("canplay", attemptPlay);
          };
        }
      }
    }, [activeSrc]);
    (0, import_react.useEffect)(() => {
      const v = videoRef.current;
      if (!v || !tracks?.length) return;
      Array.from(v.textTracks).forEach((track, i) => {
        track.mode = i === activeTrack ? "showing" : "hidden";
      });
    }, [activeTrack, tracks]);
    const handleLoadedMetadata = (0, import_react.useCallback)(() => {
      const v = videoRef.current;
      if (!v) return;
      if (initialTime && initialTime > 0 && !initialTimeAppliedRef.current && initialTime < v.duration) {
        v.currentTime = initialTime;
        initialTimeAppliedRef.current = true;
      }
      setState((s) => ({
        ...s,
        duration: v.duration,
        currentTime: v.currentTime,
        isLoading: false
      }));
    }, [initialTime]);
    const handleTimeUpdate = (0, import_react.useCallback)(() => {
      const v = videoRef.current;
      if (!v) return;
      setState((s) => ({
        ...s,
        currentTime: v.currentTime
      }));
      onTimeUpdate?.(v.currentTime, v.duration);
      if (onMilestone && v.duration > 0) {
        const pct = v.currentTime / v.duration * 100;
        for (const milestone of [25, 50, 75, 100]) {
          if (pct >= milestone && !milestonesFiredRef.current.has(milestone)) {
            milestonesFiredRef.current.add(milestone);
            onMilestone(milestone);
          }
        }
      }
      if (onChapterChange && chapters && chapters.length > 0 && v.duration > 0) {
        let current = null;
        for (let i = chapters.length - 1; i >= 0; i--) {
          if (v.currentTime >= chapters[i].time) {
            current = chapters[i];
            break;
          }
        }
        const currentLabel = current?.label ?? null;
        if (currentLabel !== currentChapterRef.current) {
          currentChapterRef.current = currentLabel;
          onChapterChange(current);
        }
      }
    }, [onTimeUpdate, onMilestone, onChapterChange, chapters]);
    const handleProgress = (0, import_react.useCallback)(() => {
      const v = videoRef.current;
      if (!v || v.buffered.length === 0) return;
      const end = v.buffered.end(v.buffered.length - 1);
      const pct = v.duration ? end / v.duration * 100 : 0;
      setState((s) => ({ ...s, buffered: pct }));
      onBuffer?.(pct);
    }, [onBuffer]);
    const handleWaiting = (0, import_react.useCallback)(() => {
      setState((s) => ({ ...s, isLoading: true }));
    }, []);
    const handleDurationChange = (0, import_react.useCallback)(() => {
      const v = videoRef.current;
      if (!v || !isFinite(v.duration)) return;
      setState((s) => ({ ...s, duration: v.duration }));
    }, []);
    const handleCanPlay = (0, import_react.useCallback)(() => {
      setState((s) => ({ ...s, isLoading: false }));
    }, []);
    const handleError = (0, import_react.useCallback)(() => {
      const v = videoRef.current;
      if (!v) return;
      const error = v.error ?? null;
      setState((s) => ({ ...s, error, isLoading: false }));
      onError?.(error);
    }, [onError]);
    const handleVideoEnded = (0, import_react.useCallback)(() => {
      if (isPlaylist && currentIndex < srcList.length - 1) {
        playlistAdvancingRef.current = true;
        setCurrentIndex((i) => i + 1);
        onNext?.();
      } else if (isPlaylist && loopPlaylist) {
        playlistAdvancingRef.current = true;
        setCurrentIndex(0);
        onNext?.();
      } else {
        setState((s) => ({ ...s, isPlaying: false, showControls: true }));
        onEnded?.();
      }
    }, [isPlaylist, currentIndex, srcList.length, loopPlaylist, onNext, onEnded]);
    const togglePlay = (0, import_react.useCallback)(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        v.play().catch(() => {
          setState((s) => ({ ...s, isPlaying: false }));
        });
        setState((s) => ({ ...s, isPlaying: true, hasStarted: true }));
        onPlay?.();
      } else {
        v.pause();
        setState((s) => ({ ...s, isPlaying: false, showControls: true }));
        onPause?.();
      }
    }, [onPlay, onPause]);
    const startPlayback = (0, import_react.useCallback)(() => {
      if (!isNative) {
        setEmbedStarted(true);
        setState((s) => ({ ...s, hasStarted: true }));
        return;
      }
      const v = videoRef.current;
      if (!v) return;
      v.play().catch(() => {
        setState((s) => ({ ...s, isPlaying: false }));
      });
      setState((s) => ({ ...s, isPlaying: true, hasStarted: true }));
      onPlay?.();
    }, [isNative, onPlay]);
    const handleProgressClick = (0, import_react.useCallback)(
      (e) => {
        const v = videoRef.current;
        const bar = progressRef.current;
        if (!v || !bar) return;
        const rect = bar.getBoundingClientRect();
        const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        v.currentTime = pct * v.duration;
        setState((s) => ({ ...s, currentTime: v.currentTime }));
        onSeek?.(v.currentTime);
      },
      [onSeek]
    );
    const handleProgressMouseDown = (0, import_react.useCallback)(
      (e) => {
        e.preventDefault();
        setIsDragging(true);
        const v = videoRef.current;
        const bar = progressRef.current;
        if (!v || !bar) return;
        const rect = bar.getBoundingClientRect();
        const onMove = (ev) => {
          const pct = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
          v.currentTime = pct * v.duration;
          setState((s) => ({ ...s, currentTime: v.currentTime }));
        };
        const onUp = () => {
          setIsDragging(false);
          if (v) onSeek?.(v.currentTime);
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      },
      [onSeek]
    );
    (0, import_react.useEffect)(() => {
      const bar = progressRef.current;
      if (!bar) return;
      const onTouchStart = (e) => {
        e.preventDefault();
        setIsDragging(true);
        const v = videoRef.current;
        if (!v) return;
        const rect = bar.getBoundingClientRect();
        const touch = e.touches[0];
        if (touch) {
          const pct = clamp((touch.clientX - rect.left) / rect.width, 0, 1);
          v.currentTime = pct * v.duration;
          setState((s) => ({ ...s, currentTime: v.currentTime }));
        }
        const onMove = (ev) => {
          const t = ev.touches[0];
          if (!t) return;
          const pct = clamp((t.clientX - rect.left) / rect.width, 0, 1);
          v.currentTime = pct * v.duration;
          setState((s) => ({ ...s, currentTime: v.currentTime }));
        };
        const onEnd = () => {
          setIsDragging(false);
          onSeek?.(v.currentTime);
          window.removeEventListener("touchmove", onMove);
          window.removeEventListener("touchend", onEnd);
        };
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", onEnd);
      };
      bar.addEventListener("touchstart", onTouchStart, { passive: false });
      return () => {
        bar.removeEventListener("touchstart", onTouchStart);
      };
    }, [onSeek]);
    const handleProgressHover = (0, import_react.useCallback)(
      (e) => {
        const bar = progressRef.current;
        if (!bar) return;
        const rect = bar.getBoundingClientRect();
        const pct = clamp((e.clientX - rect.left) / rect.width * 100, 0, 100);
        setHoverProgress(pct);
      },
      []
    );
    const toggleMute = (0, import_react.useCallback)(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.muted || v.volume === 0) {
        v.muted = false;
        v.volume = state.volume > 0 ? state.volume : 1;
        setState((s) => ({ ...s, isMuted: false, volume: v.volume }));
        onVolumeChange?.(v.volume, false);
      } else {
        v.muted = true;
        setState((s) => ({ ...s, isMuted: true }));
        onVolumeChange?.(0, true);
      }
    }, [state.volume, onVolumeChange]);
    const handleVolumeChange = (0, import_react.useCallback)(
      (e) => {
        const v = videoRef.current;
        const target = e.currentTarget;
        if (!v) return;
        const rect = target.getBoundingClientRect();
        const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        v.volume = pct;
        v.muted = pct === 0;
        setState((s) => ({ ...s, volume: pct, isMuted: pct === 0 }));
        onVolumeChange?.(pct, pct === 0);
      },
      [onVolumeChange]
    );
    const toggleFullscreen = (0, import_react.useCallback)(() => {
      const c = containerRef.current;
      const v = videoRef.current;
      if (!c) return;
      if (!document.fullscreenElement) {
        if (c.requestFullscreen) {
          c.requestFullscreen();
        } else if (v && v.webkitEnterFullscreen) {
          v.webkitEnterFullscreen();
        }
      } else {
        document.exitFullscreen?.();
      }
    }, []);
    const togglePip = (0, import_react.useCallback)(async () => {
      const v = videoRef.current;
      if (!v) return;
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await v.requestPictureInPicture();
        }
      } catch {
      }
    }, []);
    const setPlaybackRate = (0, import_react.useCallback)((rate) => {
      const v = videoRef.current;
      if (!v) return;
      v.playbackRate = rate;
      setState((s) => ({ ...s, playbackRate: rate }));
      setShowSpeedMenu(false);
    }, []);
    const handleFocus = (0, import_react.useCallback)(() => {
      setState((s) => ({ ...s, isFocused: true }));
    }, []);
    const handleBlur = (0, import_react.useCallback)((e) => {
      if (containerRef.current?.contains(e.relatedTarget)) return;
      setState((s) => ({ ...s, isFocused: false }));
      setShowSpeedMenu(false);
      setShowCCMenu(false);
    }, []);
    const handleKeyDown = (0, import_react.useCallback)(
      (e) => {
        if (!state.isFocused || !isNative) return;
        const v = videoRef.current;
        if (!v) return;
        if (e.shiftKey && e.key === "ArrowLeft" && chapters && chapters.length > 0) {
          e.preventDefault();
          const target = [...chapters].reverse().find((ch) => ch.time < v.currentTime - 2);
          v.currentTime = target ? target.time : 0;
          resetHideTimer();
          return;
        }
        if (e.shiftKey && e.key === "ArrowRight" && chapters && chapters.length > 0) {
          e.preventDefault();
          const target = chapters.find((ch) => ch.time > v.currentTime + 0.5);
          if (target) v.currentTime = target.time;
          resetHideTimer();
          return;
        }
        if (matchesKey(e.key, resolvedKeymap.play)) {
          e.preventDefault();
          togglePlay();
        } else if (matchesKey(e.key, resolvedKeymap.seekBack)) {
          e.preventDefault();
          v.currentTime = Math.max(0, v.currentTime - 5);
        } else if (matchesKey(e.key, resolvedKeymap.seekForward)) {
          e.preventDefault();
          v.currentTime = Math.min(v.duration, v.currentTime + 5);
        } else if (matchesKey(e.key, resolvedKeymap.volumeUp)) {
          e.preventDefault();
          v.volume = clamp(v.volume + 0.1, 0, 1);
          setState((s) => ({ ...s, volume: v.volume, isMuted: false }));
          v.muted = false;
          onVolumeChange?.(v.volume, false);
        } else if (matchesKey(e.key, resolvedKeymap.volumeDown)) {
          e.preventDefault();
          v.volume = clamp(v.volume - 0.1, 0, 1);
          setState((s) => ({ ...s, volume: v.volume, isMuted: v.volume === 0 }));
          onVolumeChange?.(v.volume, v.volume === 0);
        } else if (matchesKey(e.key, resolvedKeymap.fullscreen)) {
          e.preventDefault();
          toggleFullscreen();
        } else if (matchesKey(e.key, resolvedKeymap.mute)) {
          e.preventDefault();
          toggleMute();
        } else if (matchesKey(e.key, resolvedKeymap.speedDown)) {
          e.preventDefault();
          const idx = PLAYBACK_RATES.indexOf(state.playbackRate);
          if (idx > 0) setPlaybackRate(PLAYBACK_RATES[idx - 1]);
        } else if (matchesKey(e.key, resolvedKeymap.speedUp)) {
          e.preventDefault();
          const idx = PLAYBACK_RATES.indexOf(state.playbackRate);
          if (idx < PLAYBACK_RATES.length - 1)
            setPlaybackRate(PLAYBACK_RATES[idx + 1]);
        } else if (matchesKey(e.key, resolvedKeymap.shortcuts)) {
          e.preventDefault();
          setShowShortcuts((prev) => !prev);
        } else if (e.key === "Escape") {
          e.preventDefault();
          setShowShortcuts(false);
          setShowSpeedMenu(false);
          setShowCCMenu(false);
        } else if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          const pct = parseInt(e.key) / 10;
          v.currentTime = pct * v.duration;
        }
        resetHideTimer();
      },
      [
        state.isFocused,
        state.playbackRate,
        isNative,
        resolvedKeymap,
        togglePlay,
        toggleFullscreen,
        toggleMute,
        setPlaybackRate,
        resetHideTimer,
        chapters,
        onVolumeChange
      ]
    );
    const handleMouseMove = (0, import_react.useCallback)(() => {
      resetHideTimer();
    }, [resetHideTimer]);
    const handleMouseLeave = (0, import_react.useCallback)(() => {
      if (isPlayingRef.current) {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => {
          setState((s) => ({ ...s, showControls: false }));
          setShowSpeedMenu(false);
          setShowVolumeSlider(false);
        }, 800);
      }
      setHoverProgress(null);
    }, []);
    const progress = state.duration > 0 ? state.currentTime / state.duration * 100 : 0;
    const thumbFrame = previewThumbnails && hoverProgress !== null ? Math.min(
      Math.floor(hoverProgress / 100 * previewThumbnails.count),
      previewThumbnails.count - 1
    ) : null;
    const nearChapter = chapters && hoverProgress !== null ? chapters.find(
      (ch) => state.duration > 0 && Math.abs(ch.time / state.duration * 100 - hoverProgress) < 2
    ) : void 0;
    const posterUrl = poster || DEFAULT_POSTER;
    const showPoster = !state.hasStarted;
    const controlsVisible = state.showControls || !state.isPlaying || isDragging || showSpeedMenu || showCCMenu;
    const VolumeIcon = state.isMuted ? VolumeMuteIcon : state.volume < 0.5 ? VolumeLowIcon : VolumeHighIcon;
    (0, import_react.useImperativeHandle)(
      ref,
      () => ({
        play: () => {
          const v = videoRef.current;
          if (v) v.play().catch(() => {
          });
        },
        pause: () => {
          const v = videoRef.current;
          if (v) v.pause();
        },
        seek: (time) => {
          const v = videoRef.current;
          if (v) v.currentTime = clamp(time, 0, v.duration || Infinity);
        },
        getCurrentTime: () => videoRef.current?.currentTime ?? 0,
        getDuration: () => videoRef.current?.duration ?? 0,
        getVolume: () => videoRef.current?.volume ?? state.volume,
        setVolume: (volume) => {
          const v = videoRef.current;
          if (!v) return;
          v.volume = clamp(volume, 0, 1);
          v.muted = volume === 0;
          setState((s) => ({ ...s, volume: v.volume, isMuted: v.muted }));
        },
        toggleMute: () => toggleMute(),
        toggleFullscreen: () => toggleFullscreen(),
        getVideoElement: () => videoRef.current
      }),
      [state.volume, toggleMute, toggleFullscreen]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        ref: containerRef,
        className,
        "data-vplayer-root": "",
        style: { ...getContainerStyle(width), ...style },
        tabIndex: 0,
        role: "region",
        "aria-label": ariaLabel || `Video player${title ? `: ${title}` : ""}`,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onTouchStart: handleMouseMove,
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-vplayer-aspect": "", style: getAspectBoxStyle(ratio), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { "data-vplayer-inner": "", style: getInnerStyle(), children: [
          isNative && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "video",
            {
              ref: videoRef,
              src: parsed.embedUrl,
              poster: posterUrl,
              preload,
              loop,
              autoPlay,
              muted: state.isMuted,
              playsInline: true,
              style: getVideoStyle(),
              onLoadedMetadata: handleLoadedMetadata,
              onDurationChange: handleDurationChange,
              onTimeUpdate: handleTimeUpdate,
              onProgress: handleProgress,
              onWaiting: handleWaiting,
              onCanPlay: handleCanPlay,
              onEnded: handleVideoEnded,
              onError: handleError,
              onClick: togglePlay,
              "aria-hidden": "true",
              children: tracks?.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "track",
                {
                  kind: "subtitles",
                  src: t.src,
                  srcLang: t.lang,
                  label: t.label,
                  default: t.default
                },
                i
              ))
            }
          ),
          !isNative && embedStarted && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "iframe",
            {
              src: `${parsed.embedUrl}&autoplay=1`,
              style: getIframeStyle(),
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: true,
              title: title || "Embedded video",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              style: getPosterOverlayStyle(posterUrl, showPoster),
              onClick: showPoster ? startPlayback : void 0,
              role: showPoster ? "button" : void 0,
              tabIndex: showPoster ? -1 : void 0,
              "aria-label": showPoster ? "Play video" : void 0,
              "aria-hidden": !showPoster,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getPosterGradientStyle() }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    type: "button",
                    style: getPlayButtonLargeStyle(accentColor),
                    tabIndex: showPoster ? 0 : -1,
                    onMouseEnter: (e) => {
                      e.currentTarget.style.transform = "scale(1.08)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    },
                    "aria-label": "Play video",
                    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlayIcon, { size: 32, color: iconColor })
                  }
                )
              ]
            }
          ),
          state.isLoading && state.hasStarted && !state.error && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getLoadingOverlayStyle(), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SpinnerIcon, { size: 40, color: iconColor }) }),
          state.error && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getErrorOverlayStyle(), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ErrorIcon, { size: 40, color: iconColor }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: getErrorMessageStyle(), children: state.error.code === 4 ? "This video format is not supported" : "Video could not be loaded" })
          ] }),
          title && state.hasStarted && controlsVisible && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getTitleOverlayStyle(), children: title }),
          showShortcuts && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "div",
            {
              style: getShortcutsOverlayStyle(),
              onClick: () => setShowShortcuts(false),
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "div",
                {
                  style: getShortcutsBoxStyle(),
                  onClick: (e) => e.stopPropagation(),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      "div",
                      {
                        style: {
                          fontWeight: 600,
                          marginBottom: "12px",
                          fontSize: "14px"
                        },
                        children: "Keyboard Shortcuts"
                      }
                    ),
                    SHORTCUTS.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getShortcutRowStyle(), children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("kbd", { style: getKbdStyle(), children: key }),
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                        "span",
                        {
                          style: {
                            color: "rgba(255,255,255,0.75)",
                            fontSize: "13px"
                          },
                          children: label
                        }
                      )
                    ] }, key))
                  ]
                }
              )
            }
          ),
          isNative && state.hasStarted && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlsBarStyle(controlsVisible), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "div",
              {
                ref: progressRef,
                style: getProgressContainerStyle(),
                onClick: handleProgressClick,
                onMouseDown: handleProgressMouseDown,
                onMouseMove: handleProgressHover,
                onMouseLeave: () => setHoverProgress(null),
                role: "slider",
                "aria-label": "Seek",
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-valuenow": Math.round(progress),
                "aria-valuetext": `${formatTime(state.currentTime)} of ${formatTime(state.duration)}`,
                tabIndex: -1,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                    "div",
                    {
                      style: {
                        ...getProgressTrackStyle(),
                        height: hoverProgress !== null || isDragging ? "6px" : "4px"
                      },
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getProgressBufferStyle(state.buffered) }),
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                          "div",
                          {
                            style: getProgressFillStyle(progress, accentColor)
                          }
                        ),
                        chapters && state.duration > 0 && chapters.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                          "div",
                          {
                            style: getChapterMarkerStyle(
                              ch.time / state.duration * 100
                            )
                          },
                          i
                        ))
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "div",
                    {
                      style: getProgressThumbStyle(
                        progress,
                        accentColor,
                        hoverProgress !== null || isDragging
                      )
                    }
                  ),
                  thumbFrame !== null && previewThumbnails && hoverProgress !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "div",
                    {
                      style: getPreviewThumbnailStyle(
                        hoverProgress,
                        previewThumbnails,
                        thumbFrame
                      )
                    }
                  ),
                  hoverProgress !== null && state.duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getTooltipStyle(hoverProgress), children: nearChapter?.label ?? formatTime(hoverProgress / 100 * state.duration) })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlsRowStyle(), children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlGroupStyle(), children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    type: "button",
                    style: getControlButtonStyle(),
                    onClick: togglePlay,
                    "aria-label": state.isPlaying ? "Pause" : "Play",
                    onMouseEnter: (e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    },
                    children: state.isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PauseIcon, { size: 20, color: iconColor }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlayIcon, { size: 20, color: iconColor })
                  }
                ),
                isPlaylist && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
                  currentIndex > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      type: "button",
                      style: getControlButtonStyle(),
                      onClick: () => {
                        setCurrentIndex((i) => i - 1);
                        onPrev?.();
                      },
                      "aria-label": "Previous",
                      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PrevIcon, { size: 18, color: iconColor })
                    }
                  ),
                  currentIndex < srcList.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      type: "button",
                      style: getControlButtonStyle(),
                      onClick: () => {
                        setCurrentIndex((i) => i + 1);
                        onNext?.();
                      },
                      "aria-label": "Next",
                      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NextIcon, { size: 18, color: iconColor })
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                  "div",
                  {
                    style: getVolumeSliderContainerStyle(),
                    onMouseEnter: () => setShowVolumeSlider(true),
                    onMouseLeave: () => setShowVolumeSlider(false),
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                        "button",
                        {
                          type: "button",
                          style: getControlButtonStyle(),
                          onClick: toggleMute,
                          "aria-label": state.isMuted ? "Unmute" : "Mute",
                          onMouseEnter: (e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                          },
                          onMouseLeave: (e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          },
                          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(VolumeIcon, { size: 20, color: iconColor })
                        }
                      ),
                      showVolumeSlider && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                        "div",
                        {
                          "data-vplayer-volume-slider": "",
                          style: getVolumeSliderTrackStyle(),
                          onClick: handleVolumeChange,
                          role: "slider",
                          "aria-label": "Volume",
                          "aria-valuemin": 0,
                          "aria-valuemax": 100,
                          "aria-valuenow": Math.round(
                            (state.isMuted ? 0 : state.volume) * 100
                          ),
                          tabIndex: -1,
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getVolumeSliderTrackBarStyle() }),
                            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                              "div",
                              {
                                style: getVolumeSliderFillStyle(
                                  state.isMuted ? 0 : state.volume,
                                  accentColor
                                )
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                              "div",
                              {
                                style: getVolumeSliderThumbStyle(
                                  state.isMuted ? 0 : state.volume,
                                  accentColor
                                )
                              }
                            )
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: getTimeDisplayStyle(), children: [
                  formatTime(state.currentTime),
                  " / ",
                  formatTime(state.duration)
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlGroupStyle(), children: [
                tracks && tracks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { position: "relative" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      type: "button",
                      style: getControlButtonStyle(),
                      onClick: () => setShowCCMenu(!showCCMenu),
                      "aria-label": "Captions",
                      "aria-expanded": showCCMenu,
                      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                        CCIcon,
                        {
                          size: 18,
                          color: activeTrack !== null ? accentColor : iconColor
                        }
                      )
                    }
                  ),
                  showCCMenu && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getCCMenuStyle(), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      "button",
                      {
                        type: "button",
                        style: getSpeedMenuItemStyle(
                          activeTrack === null,
                          accentColor
                        ),
                        onClick: () => {
                          setActiveTrack(null);
                          setShowCCMenu(false);
                        },
                        children: "Off"
                      }
                    ),
                    tracks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      "button",
                      {
                        type: "button",
                        style: getSpeedMenuItemStyle(
                          activeTrack === i,
                          accentColor
                        ),
                        onClick: () => {
                          setActiveTrack(i);
                          setShowCCMenu(false);
                        },
                        children: t.label
                      },
                      i
                    ))
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { position: "relative" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      type: "button",
                      style: {
                        ...getControlButtonStyle(),
                        fontSize: "12px",
                        fontWeight: 600,
                        minWidth: "32px"
                      },
                      onClick: () => setShowSpeedMenu(!showSpeedMenu),
                      "aria-label": "Playback speed",
                      "aria-expanded": showSpeedMenu,
                      onMouseEnter: (e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      },
                      children: state.playbackRate === 1 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SettingsIcon, { size: 18, color: iconColor }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: accentColor }, children: [
                        state.playbackRate,
                        "x"
                      ] })
                    }
                  ),
                  showSpeedMenu && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getSpeedMenuStyle(), children: PLAYBACK_RATES.map((rate) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      type: "button",
                      style: getSpeedMenuItemStyle(
                        state.playbackRate === rate,
                        accentColor
                      ),
                      onClick: () => setPlaybackRate(rate),
                      onMouseEnter: (e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      },
                      children: rate === 1 ? "Normal" : `${rate}x`
                    },
                    rate
                  )) })
                ] }),
                supportsPip && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    type: "button",
                    style: getControlButtonStyle(),
                    onClick: togglePip,
                    "aria-label": "Picture in Picture",
                    onMouseEnter: (e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PipIcon, { size: 18, color: iconColor })
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    type: "button",
                    style: getControlButtonStyle(),
                    onClick: toggleFullscreen,
                    "aria-label": state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
                    onMouseEnter: (e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    },
                    children: state.isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ExitFullscreenIcon, { size: 18, color: iconColor }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FullscreenIcon, { size: 18, color: iconColor })
                  }
                )
              ] })
            ] })
          ] })
        ] }) })
      }
    );
  });
  return __toCommonJS(index_exports);
})();
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
