import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import Ledger from "../views/Ledger.vue";
import Maintenance from "../views/Maintenance.vue";
import Alert from "../views/Alert.vue";
import Inventory from "../views/Inventory.vue";
import Analysis from "../views/Analysis.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: Login },
    {
      path: "/main",
      component: Main,
      redirect: "/main/ledger",
      children: [
        { path: "ledger", name: "ledger", component: Ledger },
        { path: "maintenance", name: "maintenance", component: Maintenance },
        { path: "alert", name: "alert", component: Alert },
        { path: "inventory", name: "inventory", component: Inventory },
        { path: "analysis", name: "analysis", component: Analysis }
      ]
    }
  ]
});

export default router;
