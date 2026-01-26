import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import MainLayout from "../views/MainLayout.vue";
import SupplierManagement from "../views/SupplierManagement.vue";
import InventoryManagement from "../views/InventoryManagement.vue";
import OrderManagement from "../views/OrderManagement.vue";
import LogisticsManagement from "../views/LogisticsManagement.vue";
import DataAnalysis from "../views/DataAnalysis.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView
    },
    {
      path: "/app",
      component: MainLayout,
      children: [
        {
          path: "suppliers",
          name: "SupplierManagement",
          component: SupplierManagement
        },
        {
          path: "inventory",
          name: "InventoryManagement",
          component: InventoryManagement
        },
        {
          path: "orders",
          name: "OrderManagement",
          component: OrderManagement
        },
        {
          path: "logistics",
          name: "LogisticsManagement",
          component: LogisticsManagement
        },
        {
          path: "analytics",
          name: "DataAnalysis",
          component: DataAnalysis
        },
        {
          path: "",
          redirect: "/app/suppliers"
        }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const isAuthenticated = localStorage.getItem("scm-auth") === "true";
  if (to.path.startsWith("/app") && !isAuthenticated) {
    return "/login";
  }
  if (to.path === "/login" && isAuthenticated) {
    return "/app/suppliers";
  }
  return true;
});

export default router;
