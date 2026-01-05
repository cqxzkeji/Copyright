import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ProjectArchive from '../views/ProjectArchive.vue';
import DataCollection from '../views/DataCollection.vue';
import ProcessMonitor from '../views/ProcessMonitor.vue';
import Evaluation from '../views/Evaluation.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/project-archive' },
      { path: 'project-archive', component: ProjectArchive },
      { path: 'data-collection', component: DataCollection },
      { path: 'process-monitor', component: ProcessMonitor },
      { path: 'evaluation', component: Evaluation },
      { path: 'dashboard', component: Dashboard }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
