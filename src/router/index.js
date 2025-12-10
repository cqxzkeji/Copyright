import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ProductManagement from '../views/ProductManagement.vue';
import SalesManagement from '../views/SalesManagement.vue';
import InventoryTracking from '../views/InventoryTracking.vue';
import OrderProcessing from '../views/OrderProcessing.vue';
import Reports from '../views/Reports.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/products' },
      { path: 'products', component: ProductManagement },
      { path: 'sales', component: SalesManagement },
      { path: 'inventory', component: InventoryTracking },
      { path: 'orders', component: OrderProcessing },
      { path: 'reports', component: Reports }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
