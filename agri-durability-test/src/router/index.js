import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import ParamConfig from "../views/ParamConfig.vue";
import TestControl from "../views/TestControl.vue";
import DataMonitor from "../views/DataMonitor.vue";
import Analysis from "../views/Analysis.vue";
import Report from "../views/Report.vue";

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
    component: Dashboard,
    redirect: "/dashboard/param",
    children: [
      {
        path: "param",
        name: "ParamConfig",
        component: ParamConfig
      },
      {
        path: "test",
        name: "TestControl",
        component: TestControl
      },
      {
        path: "monitor",
        name: "DataMonitor",
        component: DataMonitor
      },
      {
        path: "analysis",
        name: "Analysis",
        component: Analysis
      },
      {
        path: "report",
        name: "Report",
        component: Report
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
