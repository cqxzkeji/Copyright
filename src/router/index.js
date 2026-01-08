import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import WaterSupply from "../views/WaterSupply.vue";
import WaterQuality from "../views/WaterQuality.vue";
import SewageProcess from "../views/SewageProcess.vue";
import Analytics from "../views/Analytics.vue";
import Maintenance from "../views/Maintenance.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  {
    path: "/app",
    name: "app",
    component: Dashboard,
    meta: { layout: "main" }
  },
  { path: "/app/water-supply", component: WaterSupply, meta: { layout: "main" } },
  { path: "/app/water-quality", component: WaterQuality, meta: { layout: "main" } },
  { path: "/app/sewage-process", component: SewageProcess, meta: { layout: "main" } },
  { path: "/app/analytics", component: Analytics, meta: { layout: "main" } },
  { path: "/app/maintenance", component: Maintenance, meta: { layout: "main" } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.layout === "main" && from.path === "/login") {
    next();
  } else {
    next();
  }
});

export default router;
