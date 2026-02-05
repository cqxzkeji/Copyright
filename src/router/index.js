import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import DataCollection from "../views/DataCollection.vue";
import DataStorage from "../views/DataStorage.vue";
import DataAnalysis from "../views/DataAnalysis.vue";
import DecisionSupport from "../views/DecisionSupport.vue";
import Monitoring from "../views/Monitoring.vue";

const routes = [
  {
    path: "/login",
    component: LoginView,
    meta: { layout: "empty" }
  },
  {
    path: "/",
    redirect: "/collection"
  },
  {
    path: "/collection",
    component: DataCollection
  },
  {
    path: "/storage",
    component: DataStorage
  },
  {
    path: "/analysis",
    component: DataAnalysis
  },
  {
    path: "/decision",
    component: DecisionSupport
  },
  {
    path: "/monitoring",
    component: Monitoring
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  if (to.path !== "/login") {
    const authed = localStorage.getItem("dip_authed");
    if (!authed) {
      return "/login";
    }
  }
});

export default router;
