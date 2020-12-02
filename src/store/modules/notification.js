import mutations from "@/store/mutations";

const { SHOW_TOAST_NOTIFY } = mutations;

const notificationStore = {
  state: {
    messagePool: [] //массив сообщений
  },
  getters: {
    messagePool: ({ messagePool }) => messagePool[messagePool.length - 1] //буду получать всегда и выводить последнее сообщеение, вотчить буду в компоненте
  },
  mutations: {
    [SHOW_TOAST_NOTIFY](state, msg) {
      state.messagePool.push(msg); // в state буду пушить msg
    }
  },
  actions: {
    showNotify({ commit }, msg) {
      commit(SHOW_TOAST_NOTIFY, msg); //actions для пуша msg
    }
  }
};

export default notificationStore;
