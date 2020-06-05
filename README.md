> **Add-on for Vuex to substitute default mappers.**

- [Original issue](https://github.com/vuejs/vuex/issues/1762)

### What problems does it solve?

The add-on adds two new mappers - `mapData` and `mapFunction`.

`mapData` replaces `mapState` and `mapGetters`. In case Vuex store does not find a suitable getter, it looks for a value in the state and returns it.

Similarly, `mapFunction` replaces `mapMutations` and `mapActions`. If Vuex does not find an action with the given name, it finds a mutation with that name and commits it.

> `mapData` is ready to use. `mapFunction` is still in production.

### How to use?

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

#### `mapData` with modules

`mapData` adds some restrictions when used with modules:

- All modules have to be `namespaced: true`;
- The only syntax available is 

```javascript
mapData("<module key>", { <variable>: "<getter/state key>" })
```

For example:

```javascript
computed: mapData('some/nested/module', {
  count: 'count'
})
```

You can still get your global module values/getters by array syntax.

### License

[MIT](http://opensource.org/licenses/MIT)
