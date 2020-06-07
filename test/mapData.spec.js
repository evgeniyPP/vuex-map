import Vue from 'vue';
import Vuex from 'vuex';
import { mapData } from '../dist/vuex-map.common';

Vue.use(Vuex);

export default describe('mapData', () => {
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
});
