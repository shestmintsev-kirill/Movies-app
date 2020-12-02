import mutations from "@/store/mutations";

const { TOGGLE_LOADER } = mutations;

const loaderStore = {
  state: {
    isShowLoader: false
  },
  getters: {
    //буду получать текущее состояние прелодера
    isShowLoader: ({ isShowLoader }) => isShowLoader
  },
  mutations: {
    //в мутиции буду получать текущий state сторы и значение которое будет передаваться
    [TOGGLE_LOADER](state, boolean) {
      state.isShowLoader = boolean;
    }
  },
  actions: {
    //импортируем commit с context и буду принимать булевое значение
    toggleLoader({ commit }, boolean) {
      commit(TOGGLE_LOADER, boolean);
    }
  }
};

export default loaderStore;
