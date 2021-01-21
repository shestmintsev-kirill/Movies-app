import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Header from "./components/Header.vue";
import store from "./store";
import "./plugins/bootstrap";

Vue.config.productionTip = false;
Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: App
    },
    {
      path: "/",
      component: Header
    }
  ]
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
