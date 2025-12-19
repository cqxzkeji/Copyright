import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import MainLayout from "../views/MainLayout.vue";
import LiveRoom from "../views/LiveRoom.vue";
import ProductManagement from "../views/ProductManagement.vue";
import ContentLibrary from "../views/ContentLibrary.vue";
import OrderManagement from "../views/OrderManagement.vue";
import AnalyticsDashboard from "../views/AnalyticsDashboard.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/app",
    component: MainLayout,
    redirect: "/app/live-room",
    children: [
      { path: "live-room", name: "LiveRoom", component: LiveRoom },
      { path: "products", name: "ProductManagement", component: ProductManagement },
      { path: "content", name: "ContentLibrary", component: ContentLibrary },
      { path: "orders", name: "OrderManagement", component: OrderManagement },
      { path: "analytics", name: "AnalyticsDashboard", component: AnalyticsDashboard }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
