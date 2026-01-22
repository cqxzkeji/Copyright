import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Collect from "../views/Collect.vue";
import History from "../views/History.vue";
import Alarm from "../views/Alarm.vue";
import Setting from "../views/Setting.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/collect", name: "collect", component: Collect },
  { path: "/history", name: "history", component: History },
  { path: "/alarm", name: "alarm", component: Alarm },
  { path: "/setting", name: "setting", component: Setting }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
