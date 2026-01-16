import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Content from "../views/Content.vue";
import Localization from "../views/Localization.vue";
import Materials from "../views/Materials.vue";
import Publish from "../views/Publish.vue";
import Analytics from "../views/Analytics.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login
  },
  {
    path: "/dashboard",
    component: Dashboard,
    redirect: "/dashboard/content",
    children: [
      {
        path: "content",
        name: "content",
        component: Content
      },
      {
        path: "localization",
        name: "localization",
        component: Localization
      },
      {
        path: "materials",
        name: "materials",
        component: Materials
      },
      {
        path: "publish",
        name: "publish",
        component: Publish
      },
      {
        path: "analytics",
        name: "analytics",
        component: Analytics
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
