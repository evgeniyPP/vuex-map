/*!
 * vuex v3.4.0
 * (c) 2020 Evan You
 * @license MIT
 */
'use strict';

var vuex = require('vuex/dist/vuex.common.js');

/**
 * Works similar to mapGetters but if it does not find a getter with the given name, it looks for a value in the state
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 */
var mapData = normalizeNamespace(function (namespace, data) {
  var res = {};
  if (process.env.NODE_ENV !== 'production' && !isValidMap(data)) {
    console.error('[vuex] mapData: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(data).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    // The namespace has been mutated by normalizeNamespace
    var gettersVal = namespace + val;
    res[key] = function mappedGetter() {
      if (namespace && !getModuleByNamespace(this.$store, 'mapData', namespace)) {
        return;
      }

      var state = this.$store.state;
      var getters = this.$store.getters;

      if (gettersVal in getters) {
        return getters[gettersVal];
      }

      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapData', namespace);
        state = module.context.state;
        getters = module.context.getters;
      }

      return typeof val === 'function' ? val.call(this, state, getters) : state[val];
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res;
});

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap(map) {
  if (!isValidMap(map)) {
    return [];
  }
  return Array.isArray(map)
    ? map.map(function (key) {
        return { key: key, val: key };
      })
    : Object.keys(map).map(function (key) {
        return { key: key, val: map[key] };
      });
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap(map) {
  return Array.isArray(map) || isObject$1(map);
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace(fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map);
  };
}

/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
function getModuleByNamespace(store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error('[vuex] module namespace not found in ' + helper + '(): ' + namespace);
  }
  return module;
}

function isObject$1(obj) {
  return obj !== null && typeof obj === 'object';
}

var index_cjs = {
  Store: vuex.Store,
  install: vuex.install,
  version: vuex.version,
  mapData: mapData,
};

module.exports = index_cjs;
