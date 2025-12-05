import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import TaskManagement from '../views/TaskManagement.vue';
import Monitoring from '../views/Monitoring.vue';
import ResourceManagement from '../views/ResourceManagement.vue';
import ReportGeneration from '../views/ReportGeneration.vue';
import Settings from '../views/Settings.vue';
import Login from '../views/Login.vue';

const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    component: Dashboard,
    children: [
      { path: '', redirect: '/tasks' },
      { path: '/tasks', name: 'tasks', component: TaskManagement },
      { path: '/monitoring', name: 'monitoring', component: Monitoring },
      { path: '/resources', name: 'resources', component: ResourceManagement },
      { path: '/reports', name: 'reports', component: ReportGeneration },
      { path: '/settings', name: 'settings', component: Settings },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('dts-auth') === 'yes';
  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
