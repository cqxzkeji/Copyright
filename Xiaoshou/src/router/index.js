import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import OrderManagement from '../views/OrderManagement.vue';
import ProductCustomization from '../views/ProductCustomization.vue';
import SalesTracking from '../views/SalesTracking.vue';
import InventoryControl from '../views/InventoryControl.vue';
import ReportGeneration from '../views/ReportGeneration.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Main,
      children: [
        { path: '', redirect: '/orders' },
        { path: '/orders', component: OrderManagement },
        { path: '/products', component: ProductCustomization },
        { path: '/sales', component: SalesTracking },
        { path: '/inventory', component: InventoryControl },
        { path: '/reports', component: ReportGeneration }
      ]
    }
  ]
});

export default router;
