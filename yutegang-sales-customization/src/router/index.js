import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import CustomerDemand from "../views/CustomerDemand.vue";
import ProductCustomization from "../views/ProductCustomization.vue";
import QuoteOrderManagement from "../views/QuoteOrderManagement.vue";
import ProductionExecution from "../views/ProductionExecution.vue";
import DataAnalysis from "../views/DataAnalysis.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  {
    path: "/dashboard",
    component: () => import("../views/MainLayout.vue"),
    children: [
      { path: "", redirect: "/dashboard/customer" },
      { path: "customer", component: CustomerDemand },
      { path: "product", component: ProductCustomization },
      { path: "quote", component: QuoteOrderManagement },
      { path: "production", component: ProductionExecution },
      { path: "analysis", component: DataAnalysis },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
