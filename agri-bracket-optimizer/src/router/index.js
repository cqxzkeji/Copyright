import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import Param from "../views/Param.vue";
import Check from "../views/Check.vue";
import Optimize from "../views/Optimize.vue";
import Simulate from "../views/Simulate.vue";
import Report from "../views/Report.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  {
    path: "/main",
    component: Main,
    children: [
      { path: "", redirect: "/main/param" },
      { path: "param", name: "Param", component: Param },
      { path: "check", name: "Check", component: Check },
      { path: "optimize", name: "Optimize", component: Optimize },
      { path: "simulate", name: "Simulate", component: Simulate },
      { path: "report", name: "Report", component: Report }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
