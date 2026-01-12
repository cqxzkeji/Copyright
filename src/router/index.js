import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import ProjectManagement from "../views/ProjectManagement.vue";
import ResourcePlanning from "../views/ResourcePlanning.vue";
import RiskManagement from "../views/RiskManagement.vue";
import Analytics from "../views/Analytics.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/projects",
    name: "ProjectManagement",
    component: ProjectManagement
  },
  {
    path: "/resources",
    name: "ResourcePlanning",
    component: ResourcePlanning
  },
  {
    path: "/risks",
    name: "RiskManagement",
    component: RiskManagement
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: Analytics
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
