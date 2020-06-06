[![npm version](https://badge.fury.io/js/vuex-map.svg)](https://badge.fury.io/js/vuex-map)
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

- [Github repository](https://github.com/evgeniyPP/vuex-map)
- [Original issue](https://github.com/vuejs/vuex/issues/1762)
- [Документация на русском](https://github.com/evgeniyPP/vuex-map/blob/master/README.ru.md)

## What problems does it solve?

The add-on adds two new mappers - `mapData` and `mapMethods`.

`mapData` replaces `mapState` and `mapGetters`. Works like `mapGetters`, but in case Vuex store does not find a suitable getter, it looks for a value in the state and returns it.

Similarly, `mapMethods` replaces `mapMutations` and `mapActions`. Works like `mapActions`, but if Vuex does not find an action with the given name, it finds a mutation with that name and commits it.

> `mapData` and `mapMethods` – these names are not settled yet. You can suggest your options in [this issue](https://github.com/evgeniyPP/vuex-map/issues/1).

## Install

> Requires vuex@^3.4.0 (>=3.4.0 <4.0.0). Otherwise, it will load a copy of the appropriate version of Vuex into `node_modules`.

```bash
npm i vuex-map
```

```javascript
import { mapData, mapMethods } from 'vuex-map';

export default {
  ...
}
```

## Use

**You can use the usual vuex syntax.**

#### `mapData`

Use `mapData` if you want to get values from `state` or `getters`.

```javascript
computed: mapData(['text'])
```

or

```javascript
computed: {
  ...mapData(['text'])
}
```

#### `mapMethods`

Use `mapMethods` if you want to get methods from `mutations` or `actions`.

The usual vuex syntax, nothing special.

```javascript
methods: mapMethods(['increment'])
```

```javascript
methods: {
  ...mapMethods(['increment'])
}
```

With modules:

```javascript
methods: mapMethods('some/nested/module', ['increment'])
```

#### `mapMethods` with function syntax

There is one case where the syntax of `mapMethods` is different from `mapActions`. This is when it is used with function syntax.

In the function, as the first parameter, instead of `commit` or `dispatch`, you get the `{ commit, dispatch }` object, from which you select the function you need: `commit` for commit a mutation or `dispatch` for action dispatching.

For example:

```javascript
mapMethods({
  foo({ dispatch }, arg) {
    dispatch('increment');
  }
})
```

This greatly reduces the usefulness of `mapMethods`. Therefore, using `mapMethods` with function syntax is not recommended.

## TODO:

- Reduce minimum version requirements for Vuex;
- Add types;
- Set up our own work environment. While we use vuex scripts.
