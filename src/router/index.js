import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import DatabaseManagement from '../views/DatabaseManagement.vue';
import PerformanceMonitoring from '../views/PerformanceMonitoring.vue';
import DataSecurity from '../views/DataSecurity.vue';
import Automation from '../views/Automation.vue';
import Visualization from '../views/Visualization.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/database-management',
    children: [
      {
        path: 'database-management',
        component: DatabaseManagement
      },
      {
        path: 'performance-monitoring',
        component: PerformanceMonitoring
      },
      {
        path: 'data-security',
        component: DataSecurity
      },
      {
        path: 'automation',
        component: Automation
      },
      {
        path: 'visualization',
        component: Visualization
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
