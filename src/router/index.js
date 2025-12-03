import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ProductionSchedule from '../views/ProductionSchedule.vue';
import QualityControl from '../views/QualityControl.vue';
import MachineMonitoring from '../views/MachineMonitoring.vue';
import ReportGeneration from '../views/ReportGeneration.vue';
import Settings from '../views/Settings.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/production' },
      {
        path: 'production',
        name: 'production',
        component: ProductionSchedule
      },
      {
        path: 'quality',
        name: 'quality',
        component: QualityControl
      },
      {
        path: 'machines',
        name: 'machines',
        component: MachineMonitoring
      },
      {
        path: 'reports',
        name: 'reports',
        component: ReportGeneration
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
