import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import TransportMonitor from '../views/TransportMonitor.vue';
import DispatchManagement from '../views/DispatchManagement.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import EquipmentManagement from '../views/EquipmentManagement.vue';
import UserManagement from '../views/UserManagement.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: 'monitor', component: TransportMonitor },
      { path: 'dispatch', component: DispatchManagement },
      { path: 'analysis', component: DataAnalysis },
      { path: 'equipment', component: EquipmentManagement },
      { path: 'users', component: UserManagement }
    ],
    redirect: '/dashboard/monitor'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
