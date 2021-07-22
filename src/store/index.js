import Vue from 'vue';
import Vuex from '@/plugin/Vuex';
// import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    ADD_COUNT(state) {
      state.count++
    }
  },
  actions: {
    ADD_COUNT_ACTIONS({ commit }) {
      setTimeout(() => {
        commit('ADD_COUNT')
      }, 1000);
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  },
});
