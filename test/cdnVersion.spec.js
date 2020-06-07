global.Vue = require('vue/dist/vue');
global.Vuex = require('vuex/dist/vuex');
global.VuexMap = require('../dist/vuex-map.cdn');

const { mapData, mapMethods } = VuexMap;

describe('substitutes', () => {
  describe('mapGetters with', () => {
    it('array syntax', () => {
      const store = new Vuex.Store({
        state: { count: 0 },
        mutations: {
          inc: (state) => state.count++,
          dec: (state) => state.count--,
        },
        getters: {
          hasAny: ({ count }) => count > 0,
          negative: ({ count }) => count < 0,
        },
      });
      const vm = new Vue({
        store,
        computed: mapData(['hasAny', 'negative']),
      });
      expect(vm.hasAny).toBe(false);
      expect(vm.negative).toBe(false);
      store.commit('inc');
      expect(vm.hasAny).toBe(true);
      expect(vm.negative).toBe(false);
      store.commit('dec');
      store.commit('dec');
      expect(vm.hasAny).toBe(false);
      expect(vm.negative).toBe(true);
    });

    it('object syntax', () => {
      const store = new Vuex.Store({
        state: { count: 0 },
        mutations: {
          inc: (state) => state.count++,
          dec: (state) => state.count--,
        },
        getters: {
          hasAny: ({ count }) => count > 0,
          negative: ({ count }) => count < 0,
        },
      });
      const vm = new Vue({
        store,
        computed: mapData({
          a: 'hasAny',
          b: 'negative',
        }),
      });
      expect(vm.a).toBe(false);
      expect(vm.b).toBe(false);
      store.commit('inc');
      expect(vm.a).toBe(true);
      expect(vm.b).toBe(false);
      store.commit('dec');
      store.commit('dec');
      expect(vm.a).toBe(false);
      expect(vm.b).toBe(true);
    });

    it('namespace', () => {
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            state: { count: 0 },
            mutations: {
              inc: (state) => state.count++,
              dec: (state) => state.count--,
            },
            getters: {
              hasAny: ({ count }) => count > 0,
              negative: ({ count }) => count < 0,
            },
          },
        },
      });
      const vm = new Vue({
        store,
        computed: mapData('foo', {
          a: 'hasAny',
          b: 'negative',
        }),
      });
      expect(vm.a).toBe(false);
      expect(vm.b).toBe(false);
      store.commit('foo/inc');
      expect(vm.a).toBe(true);
      expect(vm.b).toBe(false);
      store.commit('foo/dec');
      store.commit('foo/dec');
      expect(vm.a).toBe(false);
      expect(vm.b).toBe(true);
    });

    it('undefined getters', () => {
      jest.spyOn(console, 'error').mockImplementation();
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            state: { count: 0 },
            mutations: {
              inc: (state) => state.count++,
              dec: (state) => state.count--,
            },
            getters: {
              hasAny: ({ count }) => count > 0,
              negative: ({ count }) => count < 0,
            },
          },
        },
      });
      const vm = new Vue({
        store,
        computed: mapData('foo'),
      });
      expect(vm.a).toBeUndefined();
      expect(vm.b).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        '[vuex] mapData: mapper parameter must be either an Array or an Object'
      );
    });
  });

  describe('mapState with', () => {
    it('array syntax', () => {
      const store = new Vuex.Store({
        state: {
          a: 1,
        },
      });
      const vm = new Vue({
        store,
        computed: mapData(['a']),
      });
      expect(vm.a).toBe(1);
      store.state.a++;
      expect(vm.a).toBe(2);
    });

    it('object syntax', () => {
      const store = new Vuex.Store({
        state: {
          a: 1,
        },
        getters: {
          b: () => 2,
        },
      });
      const vm = new Vue({
        store,
        computed: mapData({
          a: (state, getters) => {
            return state.a + getters.b;
          },
        }),
      });
      expect(vm.a).toBe(3);
      store.state.a++;
      expect(vm.a).toBe(4);
    });

    it('namespace', () => {
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            state: { a: 1 },
            getters: {
              b: (state) => state.a + 1,
            },
          },
        },
      });
      const vm = new Vue({
        store,
        computed: mapData('foo', {
          a: (state, getters) => {
            return state.a + getters.b;
          },
        }),
      });
      expect(vm.a).toBe(3);
      store.state.foo.a++;
      expect(vm.a).toBe(5);
      store.replaceState({
        foo: { a: 3 },
      });
      expect(vm.a).toBe(7);
    });

    it('namespace and a nested module', () => {
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            state: { a: 1 },
            modules: {
              bar: {
                state: { b: 2 },
              },
            },
          },
        },
      });
      const vm = new Vue({
        store,
        computed: mapData('foo', {
          value: (state) => state,
        }),
      });
      expect(vm.value.a).toBe(1);
      expect(vm.value.bar.b).toBe(2);
      expect(vm.value.b).toBeUndefined();
    });

    it('undefined states', () => {
      jest.spyOn(console, 'error').mockImplementation();
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            state: { a: 1 },
          },
        },
      });
      const vm = new Vue({
        store,
        computed: mapData('foo'),
      });
      expect(vm.a).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        '[vuex] mapData: mapper parameter must be either an Array or an Object'
      );
    });
  });
});

describe('obscures a state value by a getter with', () => {
  it('array syntax', () => {
    const store = new Vuex.Store({
      state: {
        a: 'state value',
      },
      getters: {
        a: () => 'getter value',
      },
    });
    const vm = new Vue({
      store,
      computed: mapData(['a']),
    });
    expect(vm.a).toBe('getter value');
  });

  it('object syntax', () => {
    const store = new Vuex.Store({
      state: {
        a: 1,
      },
      getters: {
        a: () => 2,
      },
    });
    const vm = new Vue({
      store,
      computed: mapData({
        a: 'a',
      }),
    });
    expect(vm.a).toBe(2);
  });

  it('namespace', () => {
    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          state: { a: 1 },
          getters: {
            a: () => 2,
          },
        },
      },
    });
    const vm = new Vue({
      store,
      computed: mapData('foo', {
        a: 'a',
      }),
    });
    expect(vm.a).toBe(2);
  });
});

describe('mapMethods substitute with', () => {
  describe('mapActions', () => {
    it('array syntax', () => {
      const a = jest.fn();
      const b = jest.fn();
      const store = new Vuex.Store({
        actions: {
          a,
          b,
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods(['a', 'b']),
      });
      vm.a();
      expect(a).toHaveBeenCalled();
      expect(b).not.toHaveBeenCalled();
      vm.b();
      expect(b).toHaveBeenCalled();
    });

    it('object syntax', () => {
      const a = jest.fn();
      const b = jest.fn();
      const store = new Vuex.Store({
        actions: {
          a,
          b,
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods({
          foo: 'a',
          bar: 'b',
        }),
      });
      vm.foo();
      expect(a).toHaveBeenCalled();
      expect(b).not.toHaveBeenCalled();
      vm.bar();
      expect(b).toHaveBeenCalled();
    });

    it('function syntax', () => {
      const a = jest.fn();
      const store = new Vuex.Store({
        actions: { a },
      });
      const vm = new Vue({
        store,
        methods: mapMethods({
          foo({ dispatch }, arg) {
            dispatch('a', arg + 'bar');
          },
        }),
      });
      vm.foo('foo');
      expect(a.mock.calls[0][1]).toBe('foobar');
    });

    it('namespace', () => {
      const a = jest.fn();
      const b = jest.fn();
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            actions: {
              a,
              b,
            },
          },
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods('foo/', {
          foo: 'a',
          bar: 'b',
        }),
      });
      vm.foo();
      expect(a).toHaveBeenCalled();
      expect(b).not.toHaveBeenCalled();
      vm.bar();
      expect(b).toHaveBeenCalled();
    });

    it('function syntax and namespace', () => {
      const a = jest.fn();
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            actions: { a },
          },
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods('foo/', {
          foo({ dispatch }, arg) {
            dispatch('a', arg + 'bar');
          },
        }),
      });
      vm.foo('foo');
      expect(a.mock.calls[0][1]).toBe('foobar');
    });

    it('undefined actions', () => {
      jest.spyOn(console, 'error').mockImplementation();
      const a = jest.fn();
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            actions: {
              a,
            },
          },
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods('foo/'),
      });
      expect(vm.a).toBeUndefined();
      expect(a).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        '[vuex] mapMethods: mapper parameter must be either an Array or an Object'
      );
    });
  });

  describe('mapMutations', () => {
    it('array syntax', () => {
      const store = new Vuex.Store({
        state: { count: 0 },
        mutations: {
          inc: (state) => state.count++,
          dec: (state) => state.count--,
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods(['inc', 'dec']),
      });
      vm.inc();
      expect(store.state.count).toBe(1);
      vm.dec();
      expect(store.state.count).toBe(0);
    });

    it('object syntax', () => {
      const store = new Vuex.Store({
        state: { count: 0 },
        mutations: {
          inc: (state) => state.count++,
          dec: (state) => state.count--,
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods({
          plus: 'inc',
          minus: 'dec',
        }),
      });
      vm.plus();
      expect(store.state.count).toBe(1);
      vm.minus();
      expect(store.state.count).toBe(0);
    });

    it('function syntax', () => {
      const store = new Vuex.Store({
        state: { count: 0 },
        mutations: {
          inc(state, amount) {
            state.count += amount;
          },
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods({
          plus({ commit }, amount) {
            commit('inc', amount + 1);
          },
        }),
      });
      vm.plus(42);
      expect(store.state.count).toBe(43);
    });

    it('namespace', () => {
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            state: { count: 0 },
            mutations: {
              inc: (state) => state.count++,
              dec: (state) => state.count--,
            },
          },
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods('foo', {
          plus: 'inc',
          minus: 'dec',
        }),
      });
      vm.plus();
      expect(store.state.foo.count).toBe(1);
      vm.minus();
      expect(store.state.foo.count).toBe(0);
    });

    it('function syntax and namespace', () => {
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            state: { count: 0 },
            mutations: {
              inc(state, amount) {
                state.count += amount;
              },
            },
          },
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods('foo', {
          plus({ commit }, amount) {
            commit('inc', amount + 1);
          },
        }),
      });
      vm.plus(42);
      expect(store.state.foo.count).toBe(43);
    });

    it('undefined mutations', () => {
      jest.spyOn(console, 'error').mockImplementation();
      const store = new Vuex.Store({
        modules: {
          foo: {
            namespaced: true,
            state: { count: 0 },
            mutations: {
              inc: (state) => state.count++,
              dec: (state) => state.count--,
            },
          },
        },
      });
      const vm = new Vue({
        store,
        methods: mapMethods('foo'),
      });
      expect(vm.inc).toBeUndefined();
      expect(vm.dec).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        '[vuex] mapMethods: mapper parameter must be either an Array or an Object'
      );
    });
  });
});

describe('obscures a mutation by an action with', () => {
  it('array syntax', () => {
    const a = jest.fn();
    const b = jest.fn();
    const store = new Vuex.Store({
      mutations: {
        a,
      },
      actions: {
        a: b,
      },
    });
    const vm = new Vue({
      store,
      methods: mapMethods(['a']),
    });
    vm.a();
    expect(b).toHaveBeenCalled();
    expect(a).not.toHaveBeenCalled();
  });

  it('object syntax', () => {
    const a = jest.fn();
    const b = jest.fn();
    const store = new Vuex.Store({
      mutations: {
        a,
      },
      actions: {
        a: b,
      },
    });
    const vm = new Vue({
      store,
      methods: mapMethods({
        foo: 'a',
      }),
    });
    vm.foo();
    expect(b).toHaveBeenCalled();
    expect(a).not.toHaveBeenCalled();
  });

  it('function syntax', () => {
    const a = jest.fn();
    const b = jest.fn();
    const store = new Vuex.Store({
      mutations: {
        a,
      },
      actions: {
        a: b,
      },
    });
    const vm = new Vue({
      store,
      methods: mapMethods({
        foo({ dispatch }, arg) {
          dispatch('a', arg + 'bar');
        },
      }),
    });
    vm.foo('foo');
    expect(b).toHaveBeenCalled();
    expect(a).not.toHaveBeenCalled();
    expect(b.mock.calls[0][1]).toBe('foobar');
  });

  it('namespace', () => {
    const a = jest.fn();
    const b = jest.fn();
    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          mutations: {
            a,
          },
          actions: {
            a: b,
          },
        },
      },
    });
    const vm = new Vue({
      store,
      methods: mapMethods('foo/', {
        foo: 'a',
      }),
    });
    vm.foo();
    expect(b).toHaveBeenCalled();
    expect(a).not.toHaveBeenCalled();
  });

  it('function syntax and namespace', () => {
    const a = jest.fn();
    const b = jest.fn();
    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          mutations: {
            a,
          },
          actions: {
            a: b,
          },
        },
      },
    });
    const vm = new Vue({
      store,
      methods: mapMethods('foo/', {
        foo({ dispatch }, arg) {
          dispatch('a', arg + 'bar');
        },
      }),
    });
    vm.foo('foo');
    expect(b).toHaveBeenCalled();
    expect(a).not.toHaveBeenCalled();
    expect(b.mock.calls[0][1]).toBe('foobar');
  });
});
