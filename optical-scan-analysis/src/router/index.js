import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import DataCollection from "../views/DataCollection.vue";
import DataProcessing from "../views/DataProcessing.vue";
import Modeling from "../views/3DModeling.vue";
import OpticalAnalysis from "../views/OpticalAnalysis.vue";
import ReportGeneration from "../views/ReportGeneration.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard
  },
  {
    path: "/data-collection",
    name: "data-collection",
    component: DataCollection
  },
  {
    path: "/data-processing",
    name: "data-processing",
    component: DataProcessing
  },
  {
    path: "/3d-modeling",
    name: "3d-modeling",
    component: Modeling
  },
  {
    path: "/optical-analysis",
    name: "optical-analysis",
    component: OpticalAnalysis
  },
  {
    path: "/report-generation",
    name: "report-generation",
    component: ReportGeneration
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
