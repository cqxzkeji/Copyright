import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import SupplierManagement from '../views/SupplierManagement.vue';
import WarehouseInventory from '../views/WarehouseInventory.vue';
import LogisticsDispatch from '../views/LogisticsDispatch.vue';
import SupplyOrder from '../views/SupplyOrder.vue';
import DataAnalytics from '../views/DataAnalytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/supplier-management',
    name: 'supplier-management',
    component: SupplierManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/warehouse-inventory',
    name: 'warehouse-inventory',
    component: WarehouseInventory,
    meta: { requiresAuth: true }
  },
  {
    path: '/logistics-dispatch',
    name: 'logistics-dispatch',
    component: LogisticsDispatch,
    meta: { requiresAuth: true }
  },
  {
    path: '/supply-order',
    name: 'supply-order',
    component: SupplyOrder,
    meta: { requiresAuth: true }
  },
  {
    path: '/data-analytics',
    name: 'data-analytics',
    component: DataAnalytics,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) {
    return true;
  }
  const isAuthed = localStorage.getItem('agri-auth') === 'true';
  if (!isAuthed) {
    return { path: '/login' };
  }
  return true;
});

export default router;
