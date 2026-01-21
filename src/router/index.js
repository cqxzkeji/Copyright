import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import DataModel from "../views/DataModel.vue";
import Resilience from "../views/Resilience.vue";
import RiskPredict from "../views/RiskPredict.vue";
import Decision from "../views/Decision.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/", name: "Login", component: Login },
  {
    path: "/main",
    component: Main,
    redirect: "/main/data-model",
    children: [
      { path: "data-model", name: "DataModel", component: DataModel },
      { path: "resilience", name: "Resilience", component: Resilience },
      { path: "risk-predict", name: "RiskPredict", component: RiskPredict },
      { path: "decision", name: "Decision", component: Decision },
      { path: "dashboard", name: "Dashboard", component: Dashboard }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
