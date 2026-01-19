import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import Data from "../views/Data.vue";
import Training from "../views/Training.vue";
import Evaluation from "../views/Evaluation.vue";
import Deploy from "../views/Deploy.vue";
import Monitor from "../views/Monitor.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  {
    path: "/main",
    name: "Main",
    component: Main,
    redirect: "/main/data",
    children: [
      { path: "data", name: "Data", component: Data },
      { path: "training", name: "Training", component: Training },
      { path: "evaluation", name: "Evaluation", component: Evaluation },
      { path: "deploy", name: "Deploy", component: Deploy },
      { path: "monitor", name: "Monitor", component: Monitor }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
