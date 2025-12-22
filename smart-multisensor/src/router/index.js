import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue";
import Monitor from "../views/Monitor.vue";
import Driver from "../views/Driver.vue";
import Device from "../views/Device.vue";
import Record from "../views/Record.vue";
import Report from "../views/Report.vue";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  {
    path: "/main",
    component: Main,
    redirect: "/main/monitor",
    children: [
      { path: "monitor", name: "monitor", component: Monitor },
      { path: "driver", name: "driver", component: Driver },
      { path: "device", name: "device", component: Device },
      { path: "record", name: "record", component: Record },
      { path: "report", name: "report", component: Report }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
