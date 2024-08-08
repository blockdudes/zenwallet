"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/valtio";
exports.ids = ["vendor-chunks/valtio"];
exports.modules = {

/***/ "(ssr)/./node_modules/valtio/esm/vanilla.mjs":
/*!*********************************************!*\
  !*** ./node_modules/valtio/esm/vanilla.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getVersion: () => (/* binding */ getVersion),\n/* harmony export */   proxy: () => (/* binding */ proxy),\n/* harmony export */   ref: () => (/* binding */ ref),\n/* harmony export */   snapshot: () => (/* binding */ snapshot),\n/* harmony export */   subscribe: () => (/* binding */ subscribe),\n/* harmony export */   unstable_buildProxyFunction: () => (/* binding */ unstable_buildProxyFunction)\n/* harmony export */ });\n/* harmony import */ var proxy_compare__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! proxy-compare */ \"(ssr)/./node_modules/proxy-compare/dist/index.modern.js\");\n\n\nconst isObject = (x) => typeof x === \"object\" && x !== null;\nconst proxyStateMap = /* @__PURE__ */ new WeakMap();\nconst refSet = /* @__PURE__ */ new WeakSet();\nconst buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer), defaultHandlePromise = (promise) => {\n  switch (promise.status) {\n    case \"fulfilled\":\n      return promise.value;\n    case \"rejected\":\n      throw promise.reason;\n    default:\n      throw promise;\n  }\n}, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {\n  const cache = snapCache.get(target);\n  if ((cache == null ? void 0 : cache[0]) === version) {\n    return cache[1];\n  }\n  const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));\n  (0,proxy_compare__WEBPACK_IMPORTED_MODULE_0__.markToTrack)(snap, true);\n  snapCache.set(target, [version, snap]);\n  Reflect.ownKeys(target).forEach((key) => {\n    if (Object.getOwnPropertyDescriptor(snap, key)) {\n      return;\n    }\n    const value = Reflect.get(target, key);\n    const desc = {\n      value,\n      enumerable: true,\n      // This is intentional to avoid copying with proxy-compare.\n      // It's still non-writable, so it avoids assigning a value.\n      configurable: true\n    };\n    if (refSet.has(value)) {\n      (0,proxy_compare__WEBPACK_IMPORTED_MODULE_0__.markToTrack)(value, false);\n    } else if (value instanceof Promise) {\n      delete desc.value;\n      desc.get = () => handlePromise(value);\n    } else if (proxyStateMap.has(value)) {\n      const [target2, ensureVersion] = proxyStateMap.get(\n        value\n      );\n      desc.value = createSnapshot(\n        target2,\n        ensureVersion(),\n        handlePromise\n      );\n    }\n    Object.defineProperty(snap, key, desc);\n  });\n  return Object.preventExtensions(snap);\n}, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction = (initialObject) => {\n  if (!isObject(initialObject)) {\n    throw new Error(\"object required\");\n  }\n  const found = proxyCache.get(initialObject);\n  if (found) {\n    return found;\n  }\n  let version = versionHolder[0];\n  const listeners = /* @__PURE__ */ new Set();\n  const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {\n    if (version !== nextVersion) {\n      version = nextVersion;\n      listeners.forEach((listener) => listener(op, nextVersion));\n    }\n  };\n  let checkVersion = versionHolder[1];\n  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {\n    if (checkVersion !== nextCheckVersion && !listeners.size) {\n      checkVersion = nextCheckVersion;\n      propProxyStates.forEach(([propProxyState]) => {\n        const propVersion = propProxyState[1](nextCheckVersion);\n        if (propVersion > version) {\n          version = propVersion;\n        }\n      });\n    }\n    return version;\n  };\n  const createPropListener = (prop) => (op, nextVersion) => {\n    const newOp = [...op];\n    newOp[1] = [prop, ...newOp[1]];\n    notifyUpdate(newOp, nextVersion);\n  };\n  const propProxyStates = /* @__PURE__ */ new Map();\n  const addPropListener = (prop, propProxyState) => {\n    if (( false ? 0 : void 0) !== \"production\" && propProxyStates.has(prop)) {\n      throw new Error(\"prop listener already exists\");\n    }\n    if (listeners.size) {\n      const remove = propProxyState[3](createPropListener(prop));\n      propProxyStates.set(prop, [propProxyState, remove]);\n    } else {\n      propProxyStates.set(prop, [propProxyState]);\n    }\n  };\n  const removePropListener = (prop) => {\n    var _a;\n    const entry = propProxyStates.get(prop);\n    if (entry) {\n      propProxyStates.delete(prop);\n      (_a = entry[1]) == null ? void 0 : _a.call(entry);\n    }\n  };\n  const addListener = (listener) => {\n    listeners.add(listener);\n    if (listeners.size === 1) {\n      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {\n        if (( false ? 0 : void 0) !== \"production\" && prevRemove) {\n          throw new Error(\"remove already exists\");\n        }\n        const remove = propProxyState[3](createPropListener(prop));\n        propProxyStates.set(prop, [propProxyState, remove]);\n      });\n    }\n    const removeListener = () => {\n      listeners.delete(listener);\n      if (listeners.size === 0) {\n        propProxyStates.forEach(([propProxyState, remove], prop) => {\n          if (remove) {\n            remove();\n            propProxyStates.set(prop, [propProxyState]);\n          }\n        });\n      }\n    };\n    return removeListener;\n  };\n  const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));\n  const handler = {\n    deleteProperty(target, prop) {\n      const prevValue = Reflect.get(target, prop);\n      removePropListener(prop);\n      const deleted = Reflect.deleteProperty(target, prop);\n      if (deleted) {\n        notifyUpdate([\"delete\", [prop], prevValue]);\n      }\n      return deleted;\n    },\n    set(target, prop, value, receiver) {\n      const hasPrevValue = Reflect.has(target, prop);\n      const prevValue = Reflect.get(target, prop, receiver);\n      if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {\n        return true;\n      }\n      removePropListener(prop);\n      if (isObject(value)) {\n        value = (0,proxy_compare__WEBPACK_IMPORTED_MODULE_0__.getUntracked)(value) || value;\n      }\n      let nextValue = value;\n      if (value instanceof Promise) {\n        value.then((v) => {\n          value.status = \"fulfilled\";\n          value.value = v;\n          notifyUpdate([\"resolve\", [prop], v]);\n        }).catch((e) => {\n          value.status = \"rejected\";\n          value.reason = e;\n          notifyUpdate([\"reject\", [prop], e]);\n        });\n      } else {\n        if (!proxyStateMap.has(value) && canProxy(value)) {\n          nextValue = proxyFunction(value);\n        }\n        const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);\n        if (childProxyState) {\n          addPropListener(prop, childProxyState);\n        }\n      }\n      Reflect.set(target, prop, nextValue, receiver);\n      notifyUpdate([\"set\", [prop], value, prevValue]);\n      return true;\n    }\n  };\n  const proxyObject = newProxy(baseObject, handler);\n  proxyCache.set(initialObject, proxyObject);\n  const proxyState = [\n    baseObject,\n    ensureVersion,\n    createSnapshot,\n    addListener\n  ];\n  proxyStateMap.set(proxyObject, proxyState);\n  Reflect.ownKeys(initialObject).forEach((key) => {\n    const desc = Object.getOwnPropertyDescriptor(\n      initialObject,\n      key\n    );\n    if (\"value\" in desc) {\n      proxyObject[key] = initialObject[key];\n      delete desc.value;\n      delete desc.writable;\n    }\n    Object.defineProperty(baseObject, key, desc);\n  });\n  return proxyObject;\n}) => [\n  // public functions\n  proxyFunction,\n  // shared state\n  proxyStateMap,\n  refSet,\n  // internal things\n  objectIs,\n  newProxy,\n  canProxy,\n  defaultHandlePromise,\n  snapCache,\n  createSnapshot,\n  proxyCache,\n  versionHolder\n];\nconst [defaultProxyFunction] = buildProxyFunction();\nfunction proxy(initialObject = {}) {\n  return defaultProxyFunction(initialObject);\n}\nfunction getVersion(proxyObject) {\n  const proxyState = proxyStateMap.get(proxyObject);\n  return proxyState == null ? void 0 : proxyState[1]();\n}\nfunction subscribe(proxyObject, callback, notifyInSync) {\n  const proxyState = proxyStateMap.get(proxyObject);\n  if (( false ? 0 : void 0) !== \"production\" && !proxyState) {\n    console.warn(\"Please use proxy object\");\n  }\n  let promise;\n  const ops = [];\n  const addListener = proxyState[3];\n  let isListenerActive = false;\n  const listener = (op) => {\n    ops.push(op);\n    if (notifyInSync) {\n      callback(ops.splice(0));\n      return;\n    }\n    if (!promise) {\n      promise = Promise.resolve().then(() => {\n        promise = void 0;\n        if (isListenerActive) {\n          callback(ops.splice(0));\n        }\n      });\n    }\n  };\n  const removeListener = addListener(listener);\n  isListenerActive = true;\n  return () => {\n    isListenerActive = false;\n    removeListener();\n  };\n}\nfunction snapshot(proxyObject, handlePromise) {\n  const proxyState = proxyStateMap.get(proxyObject);\n  if (( false ? 0 : void 0) !== \"production\" && !proxyState) {\n    console.warn(\"Please use proxy object\");\n  }\n  const [target, ensureVersion, createSnapshot] = proxyState;\n  return createSnapshot(target, ensureVersion(), handlePromise);\n}\nfunction ref(obj) {\n  refSet.add(obj);\n  return obj;\n}\nconst unstable_buildProxyFunction = buildProxyFunction;\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdmFsdGlvL2VzbS92YW5pbGxhLm1qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQTBEOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsMERBQVc7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwwREFBVztBQUNqQixNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE1BQWUsR0FBRyxDQUFvQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsTUFBZSxHQUFHLENBQW9CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsMkRBQVk7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sTUFBZSxHQUFHLENBQW9CO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxNQUFlLEdBQUcsQ0FBb0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRW9GIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vemVucGF5d2FsbGV0X2Zyb250ZW5kLy4vbm9kZV9tb2R1bGVzL3ZhbHRpby9lc20vdmFuaWxsYS5tanM/ZTVjMyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtYXJrVG9UcmFjaywgZ2V0VW50cmFja2VkIH0gZnJvbSAncHJveHktY29tcGFyZSc7XG5cbmNvbnN0IGlzT2JqZWN0ID0gKHgpID0+IHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIHggIT09IG51bGw7XG5jb25zdCBwcm94eVN0YXRlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5jb25zdCByZWZTZXQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtTZXQoKTtcbmNvbnN0IGJ1aWxkUHJveHlGdW5jdGlvbiA9IChvYmplY3RJcyA9IE9iamVjdC5pcywgbmV3UHJveHkgPSAodGFyZ2V0LCBoYW5kbGVyKSA9PiBuZXcgUHJveHkodGFyZ2V0LCBoYW5kbGVyKSwgY2FuUHJveHkgPSAoeCkgPT4gaXNPYmplY3QoeCkgJiYgIXJlZlNldC5oYXMoeCkgJiYgKEFycmF5LmlzQXJyYXkoeCkgfHwgIShTeW1ib2wuaXRlcmF0b3IgaW4geCkpICYmICEoeCBpbnN0YW5jZW9mIFdlYWtNYXApICYmICEoeCBpbnN0YW5jZW9mIFdlYWtTZXQpICYmICEoeCBpbnN0YW5jZW9mIEVycm9yKSAmJiAhKHggaW5zdGFuY2VvZiBOdW1iZXIpICYmICEoeCBpbnN0YW5jZW9mIERhdGUpICYmICEoeCBpbnN0YW5jZW9mIFN0cmluZykgJiYgISh4IGluc3RhbmNlb2YgUmVnRXhwKSAmJiAhKHggaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciksIGRlZmF1bHRIYW5kbGVQcm9taXNlID0gKHByb21pc2UpID0+IHtcbiAgc3dpdGNoIChwcm9taXNlLnN0YXR1cykge1xuICAgIGNhc2UgXCJmdWxmaWxsZWRcIjpcbiAgICAgIHJldHVybiBwcm9taXNlLnZhbHVlO1xuICAgIGNhc2UgXCJyZWplY3RlZFwiOlxuICAgICAgdGhyb3cgcHJvbWlzZS5yZWFzb247XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IHByb21pc2U7XG4gIH1cbn0sIHNuYXBDYWNoZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpLCBjcmVhdGVTbmFwc2hvdCA9ICh0YXJnZXQsIHZlcnNpb24sIGhhbmRsZVByb21pc2UgPSBkZWZhdWx0SGFuZGxlUHJvbWlzZSkgPT4ge1xuICBjb25zdCBjYWNoZSA9IHNuYXBDYWNoZS5nZXQodGFyZ2V0KTtcbiAgaWYgKChjYWNoZSA9PSBudWxsID8gdm9pZCAwIDogY2FjaGVbMF0pID09PSB2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIGNhY2hlWzFdO1xuICB9XG4gIGNvbnN0IHNuYXAgPSBBcnJheS5pc0FycmF5KHRhcmdldCkgPyBbXSA6IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCkpO1xuICBtYXJrVG9UcmFjayhzbmFwLCB0cnVlKTtcbiAgc25hcENhY2hlLnNldCh0YXJnZXQsIFt2ZXJzaW9uLCBzbmFwXSk7XG4gIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNuYXAsIGtleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSk7XG4gICAgY29uc3QgZGVzYyA9IHtcbiAgICAgIHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWwgdG8gYXZvaWQgY29weWluZyB3aXRoIHByb3h5LWNvbXBhcmUuXG4gICAgICAvLyBJdCdzIHN0aWxsIG5vbi13cml0YWJsZSwgc28gaXQgYXZvaWRzIGFzc2lnbmluZyBhIHZhbHVlLlxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfTtcbiAgICBpZiAocmVmU2V0Lmhhcyh2YWx1ZSkpIHtcbiAgICAgIG1hcmtUb1RyYWNrKHZhbHVlLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIGRlbGV0ZSBkZXNjLnZhbHVlO1xuICAgICAgZGVzYy5nZXQgPSAoKSA9PiBoYW5kbGVQcm9taXNlKHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHByb3h5U3RhdGVNYXAuaGFzKHZhbHVlKSkge1xuICAgICAgY29uc3QgW3RhcmdldDIsIGVuc3VyZVZlcnNpb25dID0gcHJveHlTdGF0ZU1hcC5nZXQoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuICAgICAgZGVzYy52YWx1ZSA9IGNyZWF0ZVNuYXBzaG90KFxuICAgICAgICB0YXJnZXQyLFxuICAgICAgICBlbnN1cmVWZXJzaW9uKCksXG4gICAgICAgIGhhbmRsZVByb21pc2VcbiAgICAgICk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzbmFwLCBrZXksIGRlc2MpO1xuICB9KTtcbiAgcmV0dXJuIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhzbmFwKTtcbn0sIHByb3h5Q2FjaGUgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKSwgdmVyc2lvbkhvbGRlciA9IFsxLCAxXSwgcHJveHlGdW5jdGlvbiA9IChpbml0aWFsT2JqZWN0KSA9PiB7XG4gIGlmICghaXNPYmplY3QoaW5pdGlhbE9iamVjdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgcmVxdWlyZWRcIik7XG4gIH1cbiAgY29uc3QgZm91bmQgPSBwcm94eUNhY2hlLmdldChpbml0aWFsT2JqZWN0KTtcbiAgaWYgKGZvdW5kKSB7XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG4gIGxldCB2ZXJzaW9uID0gdmVyc2lvbkhvbGRlclswXTtcbiAgY29uc3QgbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgY29uc3Qgbm90aWZ5VXBkYXRlID0gKG9wLCBuZXh0VmVyc2lvbiA9ICsrdmVyc2lvbkhvbGRlclswXSkgPT4ge1xuICAgIGlmICh2ZXJzaW9uICE9PSBuZXh0VmVyc2lvbikge1xuICAgICAgdmVyc2lvbiA9IG5leHRWZXJzaW9uO1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcihvcCwgbmV4dFZlcnNpb24pKTtcbiAgICB9XG4gIH07XG4gIGxldCBjaGVja1ZlcnNpb24gPSB2ZXJzaW9uSG9sZGVyWzFdO1xuICBjb25zdCBlbnN1cmVWZXJzaW9uID0gKG5leHRDaGVja1ZlcnNpb24gPSArK3ZlcnNpb25Ib2xkZXJbMV0pID0+IHtcbiAgICBpZiAoY2hlY2tWZXJzaW9uICE9PSBuZXh0Q2hlY2tWZXJzaW9uICYmICFsaXN0ZW5lcnMuc2l6ZSkge1xuICAgICAgY2hlY2tWZXJzaW9uID0gbmV4dENoZWNrVmVyc2lvbjtcbiAgICAgIHByb3BQcm94eVN0YXRlcy5mb3JFYWNoKChbcHJvcFByb3h5U3RhdGVdKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BWZXJzaW9uID0gcHJvcFByb3h5U3RhdGVbMV0obmV4dENoZWNrVmVyc2lvbik7XG4gICAgICAgIGlmIChwcm9wVmVyc2lvbiA+IHZlcnNpb24pIHtcbiAgICAgICAgICB2ZXJzaW9uID0gcHJvcFZlcnNpb247XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmVyc2lvbjtcbiAgfTtcbiAgY29uc3QgY3JlYXRlUHJvcExpc3RlbmVyID0gKHByb3ApID0+IChvcCwgbmV4dFZlcnNpb24pID0+IHtcbiAgICBjb25zdCBuZXdPcCA9IFsuLi5vcF07XG4gICAgbmV3T3BbMV0gPSBbcHJvcCwgLi4ubmV3T3BbMV1dO1xuICAgIG5vdGlmeVVwZGF0ZShuZXdPcCwgbmV4dFZlcnNpb24pO1xuICB9O1xuICBjb25zdCBwcm9wUHJveHlTdGF0ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICBjb25zdCBhZGRQcm9wTGlzdGVuZXIgPSAocHJvcCwgcHJvcFByb3h5U3RhdGUpID0+IHtcbiAgICBpZiAoKGltcG9ydC5tZXRhLmVudiA/IGltcG9ydC5tZXRhLmVudi5NT0RFIDogdm9pZCAwKSAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgcHJvcFByb3h5U3RhdGVzLmhhcyhwcm9wKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicHJvcCBsaXN0ZW5lciBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgICB9XG4gICAgaWYgKGxpc3RlbmVycy5zaXplKSB7XG4gICAgICBjb25zdCByZW1vdmUgPSBwcm9wUHJveHlTdGF0ZVszXShjcmVhdGVQcm9wTGlzdGVuZXIocHJvcCkpO1xuICAgICAgcHJvcFByb3h5U3RhdGVzLnNldChwcm9wLCBbcHJvcFByb3h5U3RhdGUsIHJlbW92ZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wUHJveHlTdGF0ZXMuc2V0KHByb3AsIFtwcm9wUHJveHlTdGF0ZV0pO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcmVtb3ZlUHJvcExpc3RlbmVyID0gKHByb3ApID0+IHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgZW50cnkgPSBwcm9wUHJveHlTdGF0ZXMuZ2V0KHByb3ApO1xuICAgIGlmIChlbnRyeSkge1xuICAgICAgcHJvcFByb3h5U3RhdGVzLmRlbGV0ZShwcm9wKTtcbiAgICAgIChfYSA9IGVudHJ5WzFdKSA9PSBudWxsID8gdm9pZCAwIDogX2EuY2FsbChlbnRyeSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhZGRMaXN0ZW5lciA9IChsaXN0ZW5lcikgPT4ge1xuICAgIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIGlmIChsaXN0ZW5lcnMuc2l6ZSA9PT0gMSkge1xuICAgICAgcHJvcFByb3h5U3RhdGVzLmZvckVhY2goKFtwcm9wUHJveHlTdGF0ZSwgcHJldlJlbW92ZV0sIHByb3ApID0+IHtcbiAgICAgICAgaWYgKChpbXBvcnQubWV0YS5lbnYgPyBpbXBvcnQubWV0YS5lbnYuTU9ERSA6IHZvaWQgMCkgIT09IFwicHJvZHVjdGlvblwiICYmIHByZXZSZW1vdmUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZW1vdmUgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVtb3ZlID0gcHJvcFByb3h5U3RhdGVbM10oY3JlYXRlUHJvcExpc3RlbmVyKHByb3ApKTtcbiAgICAgICAgcHJvcFByb3h5U3RhdGVzLnNldChwcm9wLCBbcHJvcFByb3h5U3RhdGUsIHJlbW92ZV0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICBpZiAobGlzdGVuZXJzLnNpemUgPT09IDApIHtcbiAgICAgICAgcHJvcFByb3h5U3RhdGVzLmZvckVhY2goKFtwcm9wUHJveHlTdGF0ZSwgcmVtb3ZlXSwgcHJvcCkgPT4ge1xuICAgICAgICAgIGlmIChyZW1vdmUpIHtcbiAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICAgICAgcHJvcFByb3h5U3RhdGVzLnNldChwcm9wLCBbcHJvcFByb3h5U3RhdGVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHJlbW92ZUxpc3RlbmVyO1xuICB9O1xuICBjb25zdCBiYXNlT2JqZWN0ID0gQXJyYXkuaXNBcnJheShpbml0aWFsT2JqZWN0KSA/IFtdIDogT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5pdGlhbE9iamVjdCkpO1xuICBjb25zdCBoYW5kbGVyID0ge1xuICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCkge1xuICAgICAgY29uc3QgcHJldlZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wKTtcbiAgICAgIHJlbW92ZVByb3BMaXN0ZW5lcihwcm9wKTtcbiAgICAgIGNvbnN0IGRlbGV0ZWQgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCk7XG4gICAgICBpZiAoZGVsZXRlZCkge1xuICAgICAgICBub3RpZnlVcGRhdGUoW1wiZGVsZXRlXCIsIFtwcm9wXSwgcHJldlZhbHVlXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVsZXRlZDtcbiAgICB9LFxuICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgY29uc3QgaGFzUHJldlZhbHVlID0gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcbiAgICAgIGNvbnN0IHByZXZWYWx1ZSA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgaWYgKGhhc1ByZXZWYWx1ZSAmJiAob2JqZWN0SXMocHJldlZhbHVlLCB2YWx1ZSkgfHwgcHJveHlDYWNoZS5oYXModmFsdWUpICYmIG9iamVjdElzKHByZXZWYWx1ZSwgcHJveHlDYWNoZS5nZXQodmFsdWUpKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZW1vdmVQcm9wTGlzdGVuZXIocHJvcCk7XG4gICAgICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gZ2V0VW50cmFja2VkKHZhbHVlKSB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGxldCBuZXh0VmFsdWUgPSB2YWx1ZTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgdmFsdWUudGhlbigodikgPT4ge1xuICAgICAgICAgIHZhbHVlLnN0YXR1cyA9IFwiZnVsZmlsbGVkXCI7XG4gICAgICAgICAgdmFsdWUudmFsdWUgPSB2O1xuICAgICAgICAgIG5vdGlmeVVwZGF0ZShbXCJyZXNvbHZlXCIsIFtwcm9wXSwgdl0pO1xuICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIHZhbHVlLnN0YXR1cyA9IFwicmVqZWN0ZWRcIjtcbiAgICAgICAgICB2YWx1ZS5yZWFzb24gPSBlO1xuICAgICAgICAgIG5vdGlmeVVwZGF0ZShbXCJyZWplY3RcIiwgW3Byb3BdLCBlXSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFwcm94eVN0YXRlTWFwLmhhcyh2YWx1ZSkgJiYgY2FuUHJveHkodmFsdWUpKSB7XG4gICAgICAgICAgbmV4dFZhbHVlID0gcHJveHlGdW5jdGlvbih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2hpbGRQcm94eVN0YXRlID0gIXJlZlNldC5oYXMobmV4dFZhbHVlKSAmJiBwcm94eVN0YXRlTWFwLmdldChuZXh0VmFsdWUpO1xuICAgICAgICBpZiAoY2hpbGRQcm94eVN0YXRlKSB7XG4gICAgICAgICAgYWRkUHJvcExpc3RlbmVyKHByb3AsIGNoaWxkUHJveHlTdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgbmV4dFZhbHVlLCByZWNlaXZlcik7XG4gICAgICBub3RpZnlVcGRhdGUoW1wic2V0XCIsIFtwcm9wXSwgdmFsdWUsIHByZXZWYWx1ZV0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuICBjb25zdCBwcm94eU9iamVjdCA9IG5ld1Byb3h5KGJhc2VPYmplY3QsIGhhbmRsZXIpO1xuICBwcm94eUNhY2hlLnNldChpbml0aWFsT2JqZWN0LCBwcm94eU9iamVjdCk7XG4gIGNvbnN0IHByb3h5U3RhdGUgPSBbXG4gICAgYmFzZU9iamVjdCxcbiAgICBlbnN1cmVWZXJzaW9uLFxuICAgIGNyZWF0ZVNuYXBzaG90LFxuICAgIGFkZExpc3RlbmVyXG4gIF07XG4gIHByb3h5U3RhdGVNYXAuc2V0KHByb3h5T2JqZWN0LCBwcm94eVN0YXRlKTtcbiAgUmVmbGVjdC5vd25LZXlzKGluaXRpYWxPYmplY3QpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgaW5pdGlhbE9iamVjdCxcbiAgICAgIGtleVxuICAgICk7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSB7XG4gICAgICBwcm94eU9iamVjdFtrZXldID0gaW5pdGlhbE9iamVjdFtrZXldO1xuICAgICAgZGVsZXRlIGRlc2MudmFsdWU7XG4gICAgICBkZWxldGUgZGVzYy53cml0YWJsZTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGJhc2VPYmplY3QsIGtleSwgZGVzYyk7XG4gIH0pO1xuICByZXR1cm4gcHJveHlPYmplY3Q7XG59KSA9PiBbXG4gIC8vIHB1YmxpYyBmdW5jdGlvbnNcbiAgcHJveHlGdW5jdGlvbixcbiAgLy8gc2hhcmVkIHN0YXRlXG4gIHByb3h5U3RhdGVNYXAsXG4gIHJlZlNldCxcbiAgLy8gaW50ZXJuYWwgdGhpbmdzXG4gIG9iamVjdElzLFxuICBuZXdQcm94eSxcbiAgY2FuUHJveHksXG4gIGRlZmF1bHRIYW5kbGVQcm9taXNlLFxuICBzbmFwQ2FjaGUsXG4gIGNyZWF0ZVNuYXBzaG90LFxuICBwcm94eUNhY2hlLFxuICB2ZXJzaW9uSG9sZGVyXG5dO1xuY29uc3QgW2RlZmF1bHRQcm94eUZ1bmN0aW9uXSA9IGJ1aWxkUHJveHlGdW5jdGlvbigpO1xuZnVuY3Rpb24gcHJveHkoaW5pdGlhbE9iamVjdCA9IHt9KSB7XG4gIHJldHVybiBkZWZhdWx0UHJveHlGdW5jdGlvbihpbml0aWFsT2JqZWN0KTtcbn1cbmZ1bmN0aW9uIGdldFZlcnNpb24ocHJveHlPYmplY3QpIHtcbiAgY29uc3QgcHJveHlTdGF0ZSA9IHByb3h5U3RhdGVNYXAuZ2V0KHByb3h5T2JqZWN0KTtcbiAgcmV0dXJuIHByb3h5U3RhdGUgPT0gbnVsbCA/IHZvaWQgMCA6IHByb3h5U3RhdGVbMV0oKTtcbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShwcm94eU9iamVjdCwgY2FsbGJhY2ssIG5vdGlmeUluU3luYykge1xuICBjb25zdCBwcm94eVN0YXRlID0gcHJveHlTdGF0ZU1hcC5nZXQocHJveHlPYmplY3QpO1xuICBpZiAoKGltcG9ydC5tZXRhLmVudiA/IGltcG9ydC5tZXRhLmVudi5NT0RFIDogdm9pZCAwKSAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIXByb3h5U3RhdGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJQbGVhc2UgdXNlIHByb3h5IG9iamVjdFwiKTtcbiAgfVxuICBsZXQgcHJvbWlzZTtcbiAgY29uc3Qgb3BzID0gW107XG4gIGNvbnN0IGFkZExpc3RlbmVyID0gcHJveHlTdGF0ZVszXTtcbiAgbGV0IGlzTGlzdGVuZXJBY3RpdmUgPSBmYWxzZTtcbiAgY29uc3QgbGlzdGVuZXIgPSAob3ApID0+IHtcbiAgICBvcHMucHVzaChvcCk7XG4gICAgaWYgKG5vdGlmeUluU3luYykge1xuICAgICAgY2FsbGJhY2sob3BzLnNwbGljZSgwKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBwcm9taXNlID0gdm9pZCAwO1xuICAgICAgICBpZiAoaXNMaXN0ZW5lckFjdGl2ZSkge1xuICAgICAgICAgIGNhbGxiYWNrKG9wcy5zcGxpY2UoMCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHJlbW92ZUxpc3RlbmVyID0gYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICBpc0xpc3RlbmVyQWN0aXZlID0gdHJ1ZTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBpc0xpc3RlbmVyQWN0aXZlID0gZmFsc2U7XG4gICAgcmVtb3ZlTGlzdGVuZXIoKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHNuYXBzaG90KHByb3h5T2JqZWN0LCBoYW5kbGVQcm9taXNlKSB7XG4gIGNvbnN0IHByb3h5U3RhdGUgPSBwcm94eVN0YXRlTWFwLmdldChwcm94eU9iamVjdCk7XG4gIGlmICgoaW1wb3J0Lm1ldGEuZW52ID8gaW1wb3J0Lm1ldGEuZW52Lk1PREUgOiB2b2lkIDApICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhcHJveHlTdGF0ZSkge1xuICAgIGNvbnNvbGUud2FybihcIlBsZWFzZSB1c2UgcHJveHkgb2JqZWN0XCIpO1xuICB9XG4gIGNvbnN0IFt0YXJnZXQsIGVuc3VyZVZlcnNpb24sIGNyZWF0ZVNuYXBzaG90XSA9IHByb3h5U3RhdGU7XG4gIHJldHVybiBjcmVhdGVTbmFwc2hvdCh0YXJnZXQsIGVuc3VyZVZlcnNpb24oKSwgaGFuZGxlUHJvbWlzZSk7XG59XG5mdW5jdGlvbiByZWYob2JqKSB7XG4gIHJlZlNldC5hZGQob2JqKTtcbiAgcmV0dXJuIG9iajtcbn1cbmNvbnN0IHVuc3RhYmxlX2J1aWxkUHJveHlGdW5jdGlvbiA9IGJ1aWxkUHJveHlGdW5jdGlvbjtcblxuZXhwb3J0IHsgZ2V0VmVyc2lvbiwgcHJveHksIHJlZiwgc25hcHNob3QsIHN1YnNjcmliZSwgdW5zdGFibGVfYnVpbGRQcm94eUZ1bmN0aW9uIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/valtio/esm/vanilla.mjs\n");

/***/ })

};
;