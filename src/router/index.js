import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import SceneDisplay from "../views/SceneDisplay.vue";
import ResourceModeling from "../views/ResourceModeling.vue";
import InteractiveLearning from "../views/InteractiveLearning.vue";
import Analytics from "../views/Analytics.vue";
import ManagementDashboard from "../views/ManagementDashboard.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/app",
    component: Main,
    redirect: "/app/scene",
    children: [
      { path: "scene", name: "SceneDisplay", component: SceneDisplay },
      { path: "modeling", name: "ResourceModeling", component: ResourceModeling },
      { path: "learning", name: "InteractiveLearning", component: InteractiveLearning },
      { path: "analytics", name: "Analytics", component: Analytics },
      { path: "management", name: "ManagementDashboard", component: ManagementDashboard }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
