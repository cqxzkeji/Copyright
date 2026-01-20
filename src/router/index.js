import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import Monitor from "../views/Monitor.vue";
import Control from "../views/Control.vue";
import Warning from "../views/Warning.vue";
import Management from "../views/Management.vue";
import SystemSetting from "../views/SystemSetting.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/main",
      component: Main,
      redirect: "/main/monitor",
      children: [
        { path: "monitor", component: Monitor },
        { path: "control", component: Control },
        { path: "warning", component: Warning },
        { path: "management", component: Management },
        { path: "system-setting", component: SystemSetting }
      ]
    }
  ]
});

export default router;
