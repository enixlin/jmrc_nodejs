import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vuex from "vuex";
import VueRouter from "vue-router";
import axios from "axios";






Vue.config.productionTip = false;

// Vue.use(EasyUI);
Vue.use(ElementUI);
Vue.use(axios);
Vue.use(Vuex);
Vue.use(VueRouter);

Vue.use(axios);

const Routers = [{
        path: "/login",
        component: (resolve) => require(["./components/Login/Login.vue"], resolve),
    },
    {
        path: "/main",
        component: (resolve) => require(["./components/Main/Main.vue"], resolve),
    }

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

    render: (h) => h(App),
}).$mount("#app");