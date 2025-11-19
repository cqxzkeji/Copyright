import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import DeviceManagement from '../views/DeviceManagement.vue';
import MaintenancePlan from '../views/MaintenancePlan.vue';
import InventoryManagement from '../views/InventoryManagement.vue';
import RepairPersonnel from '../views/RepairPersonnel.vue';
import DataAnalysis from '../views/DataAnalysis.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      component: MainLayout,
      children: [
        { path: '', redirect: '/dashboard/devices' },
        { path: 'devices', name: 'devices', component: DeviceManagement },
        { path: 'plans', name: 'plans', component: MaintenancePlan },
        { path: 'inventory', name: 'inventory', component: InventoryManagement },
        { path: 'personnel', name: 'personnel', component: RepairPersonnel },
        { path: 'analysis', name: 'analysis', component: DataAnalysis }
      ]
    }
  ]
});

export default router;
