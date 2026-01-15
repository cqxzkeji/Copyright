import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import DeviceControl from '../views/DeviceControl.vue';
import Monitoring from '../views/Monitoring.vue';
import Maintenance from '../views/Maintenance.vue';
import Analysis from '../views/Analysis.vue';
import System from '../views/System.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      component: Dashboard,
      redirect: '/dashboard/device-control',
      children: [
        {
          path: 'device-control',
          name: 'device-control',
          component: DeviceControl
        },
        {
          path: 'monitoring',
          name: 'monitoring',
          component: Monitoring
        },
        {
          path: 'maintenance',
          name: 'maintenance',
          component: Maintenance
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: Analysis
        },
        {
          path: 'system',
          name: 'system',
          component: System
        }
      ]
    }
  ]
});

export default router;
