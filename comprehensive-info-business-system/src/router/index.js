import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import InfoManagement from '../views/InfoManagement.vue';
import ProcessManagement from '../views/ProcessManagement.vue';
import OperationMonitoring from '../views/OperationMonitoring.vue';
import InformationService from '../views/InformationService.vue';
import SystemSettings from '../views/SystemSettings.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        redirect: '/dashboard/info'
      },
      {
        path: 'info',
        name: 'InfoManagement',
        component: InfoManagement
      },
      {
        path: 'process',
        name: 'ProcessManagement',
        component: ProcessManagement
      },
      {
        path: 'operation',
        name: 'OperationMonitoring',
        component: OperationMonitoring
      },
      {
        path: 'service',
        name: 'InformationService',
        component: InformationService
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: SystemSettings
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
