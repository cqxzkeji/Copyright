import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import ResourceScheduling from "../views/ResourceScheduling.vue";
import AutoScaling from "../views/AutoScaling.vue";
import Monitoring from "../views/Monitoring.vue";
import LoadBalancing from "../views/LoadBalancing.vue";
import CostOptimization from "../views/CostOptimization.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      component: MainLayout,
      children: [
        { path: "", redirect: "/dashboard" },
        { path: "dashboard", name: "dashboard", component: Dashboard },
        {
          path: "resource-scheduling",
          name: "resource-scheduling",
          component: ResourceScheduling
        },
        { path: "auto-scaling", name: "auto-scaling", component: AutoScaling },
        { path: "monitoring", name: "monitoring", component: Monitoring },
        { path: "load-balancing", name: "load-balancing", component: LoadBalancing },
        {
          path: "cost-optimization",
          name: "cost-optimization",
          component: CostOptimization
        }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const isAuthed = localStorage.getItem("crm-auth") === "true";
  if (!isAuthed && to.path !== "/login") {
    return "/login";
  }
  if (isAuthed && to.path === "/login") {
    return "/dashboard";
  }
  return true;
});

export default router;
