import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import MainLayout from "../views/MainLayout.vue";
import ProjectManage from "../views/ProjectManage.vue";
import AcceptanceManage from "../views/AcceptanceManage.vue";
import DataCollection from "../views/DataCollection.vue";
import ArchiveManage from "../views/ArchiveManage.vue";
import Statistics from "../views/Statistics.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/app",
    component: MainLayout,
    redirect: "/app/project",
    children: [
      { path: "project", component: ProjectManage },
      { path: "acceptance", component: AcceptanceManage },
      { path: "collection", component: DataCollection },
      { path: "archive", component: ArchiveManage },
      { path: "statistics", component: Statistics }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
