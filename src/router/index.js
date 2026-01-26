import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import MainLayout from "../views/MainLayout.vue";
import DataCollection from "../views/DataCollection.vue";
import DataManagement from "../views/DataManagement.vue";
import DataAnalysis from "../views/DataAnalysis.vue";
import Reporting from "../views/Reporting.vue";
import Settings from "../views/Settings.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/app",
    component: MainLayout,
    redirect: "/app/data-collection",
    children: [
      { path: "data-collection", component: DataCollection },
      { path: "data-management", component: DataManagement },
      { path: "data-analysis", component: DataAnalysis },
      { path: "reporting", component: Reporting },
      { path: "settings", component: Settings }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
