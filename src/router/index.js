import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import OriginArchive from "../views/OriginArchive.vue";
import ProductionRecord from "../views/ProductionRecord.vue";
import Inspection from "../views/Inspection.vue";
import LogisticsTrace from "../views/LogisticsTrace.vue";
import TraceAnalysis from "../views/TraceAnalysis.vue";

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
    path: "/main",
    component: Main,
    redirect: "/main/origin",
    children: [
      {
        path: "origin",
        component: OriginArchive
      },
      {
        path: "production",
        component: ProductionRecord
      },
      {
        path: "inspection",
        component: Inspection
      },
      {
        path: "logistics",
        component: LogisticsTrace
      },
      {
        path: "analysis",
        component: TraceAnalysis
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
