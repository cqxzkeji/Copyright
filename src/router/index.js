import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import MainLayout from "../views/MainLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import Scheduler from "../views/Scheduler.vue";
import Node from "../views/Node.vue";
import Storage from "../views/Storage.vue";
import Access from "../views/Access.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "login", component: Login },
    {
      path: "/app",
      component: MainLayout,
      redirect: "/app/dashboard",
      children: [
        { path: "dashboard", name: "dashboard", component: Dashboard },
        { path: "scheduler", name: "scheduler", component: Scheduler },
        { path: "node", name: "node", component: Node },
        { path: "storage", name: "storage", component: Storage },
        { path: "access", name: "access", component: Access }
      ]
    }
  ]
});

export default router;
