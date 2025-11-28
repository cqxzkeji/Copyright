import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ArmControl from '../views/ArmControl.vue';
import TaskManagement from '../views/TaskManagement.vue';
import DataMonitoring from '../views/DataMonitoring.vue';
import PerformanceAnalysis from '../views/PerformanceAnalysis.vue';
import SystemSettings from '../views/SystemSettings.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/overview' },
      {
        path: 'overview',
        name: 'overview',
        component: DataMonitoring,
      },
      {
        path: 'arm-control',
        name: 'arm-control',
        component: ArmControl,
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: TaskManagement,
      },
      {
        path: 'monitoring',
        name: 'monitoring',
        component: DataMonitoring,
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: PerformanceAnalysis,
      },
      {
        path: 'settings',
        name: 'settings',
        component: SystemSettings,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
