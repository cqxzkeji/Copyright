import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import ProjectSetup from "../views/ProjectSetup.vue";
import ProductionCollab from "../views/ProductionCollab.vue";
import ProgressCostQuality from "../views/ProgressCostQuality.vue";
import DeliveryOps from "../views/DeliveryOps.vue";
import AnalyticsArchive from "../views/AnalyticsArchive.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: Login },
    {
      path: "/main",
      component: Main,
      redirect: "/main/project",
      children: [
        { path: "project", name: "project", component: ProjectSetup },
        { path: "production", name: "production", component: ProductionCollab },
        { path: "progress", name: "progress", component: ProgressCostQuality },
        { path: "delivery", name: "delivery", component: DeliveryOps },
        { path: "analytics", name: "analytics", component: AnalyticsArchive }
      ]
    }
  ]
});

export default router;
