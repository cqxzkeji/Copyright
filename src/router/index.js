import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import EquipmentMonitoring from '../views/EquipmentMonitoring.vue';
import FaultAlarm from '../views/FaultAlarm.vue';
import Maintenance from '../views/Maintenance.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import UserManagement from '../views/UserManagement.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'auth' }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/monitoring',
    name: 'Monitoring',
    component: EquipmentMonitoring
  },
  {
    path: '/faults',
    name: 'Faults',
    component: FaultAlarm
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: Maintenance
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: DataAnalysis
  },
  {
    path: '/users',
    name: 'Users',
    component: UserManagement
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  if (to.meta.layout === 'auth') {
    return true;
  }
  const authed = localStorage.getItem('fire-platform-auth') === 'true';
  if (!authed) {
    return { path: '/login' };
  }
  return true;
});

export default router;
