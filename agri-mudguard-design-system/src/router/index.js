import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import ParamModeling from "../views/ParamModeling.vue";
import AssemblyDesign from "../views/AssemblyDesign.vue";
import PerformanceAnalysis from "../views/PerformanceAnalysis.vue";
import Simulation from "../views/Simulation.vue";
import DesignManage from "../views/DesignManage.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  { path: "/param-modeling", component: ParamModeling },
  { path: "/assembly-design", component: AssemblyDesign },
  { path: "/performance-analysis", component: PerformanceAnalysis },
  { path: "/simulation", component: Simulation },
  { path: "/design-manage", component: DesignManage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
