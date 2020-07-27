import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vuex from "vuex";
import VueRouter from "vue-router";
import axios from "axios";
import "normalize.css";
import echarts from "echarts";
// import "./Utils/directives.js";

import VueDragResize from "vue-drag-resize";
import VueDraggableResizable from "vue-draggable-resizable";
// import "vx-easyui/dist/themes/default/easyui.css";
// import "vx-easyui/dist/themes/icon.css";
// import "vx-easyui/dist/themes/vue.css";
// import EasyUI from "vx-easyui";

// 可选择导入默认样式
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

Vue.component("vue-draggable-resizable", VueDraggableResizable);

Vue.config.productionTip = false;

// Vue.use(EasyUI);
Vue.use(VueDragResize);
Vue.use(ElementUI);
Vue.use(axios);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(echarts);

const Routers = [
  {
    path: "/login",
    component: (resolve) => require(["./components/Login.vue"], resolve),
  },
  {
    path: "/charts",
    component: (resolve) => require(["./components/Charts.vue"], resolve),
  },
  {
    path: "/main",
    component: (resolve) => require(["./components/Main.vue"], resolve),
  },
  {
    path: "/settlement",
    component: (resolve) =>
      require(["./components/Settlement/Settlement.vue"], resolve),
  },
  {
    path: "/question",
    component: (resolve) => require(["./components/Question.vue"], resolve),
  },
  {
    path: "/user",
    component: (resolve) => require(["./components/User/Admin.vue"], resolve),
  },
];
const VueRouterConfig = {
  mode: "history",
  routes: Routers,
};

const router = new VueRouter(VueRouterConfig);
var store = new Vuex.Store({
  state: { authUser: {} },
  mutations: {
    login(state, payload) {
      state.authUser = payload;
    },
    logout(state) {
      state.authUser = null;
    },
  },
});

new Vue({
  router: router,
  axios: axios,
  store: store,
  echarts: echarts,
  render: (h) => h(App),
}).$mount("#app");
