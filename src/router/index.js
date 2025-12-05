import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import ResourceManagement from '../views/ResourceManagement.vue';
import TaskScheduling from '../views/TaskScheduling.vue';
import PerformanceMonitoring from '../views/PerformanceMonitoring.vue';
import AlertManagement from '../views/AlertManagement.vue';
import Settings from '../views/Settings.vue';
import Login from '../views/Login.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Dashboard,
      children: [
        { path: '', redirect: '/resources' },
        { path: 'resources', component: ResourceManagement },
        { path: 'tasks', component: TaskScheduling },
        { path: 'performance', component: PerformanceMonitoring },
        { path: 'alerts', component: AlertManagement },
        { path: 'settings', component: Settings }
      ]
    }
  ]
});

export default router;
