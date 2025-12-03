import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import CustomerManagement from '../views/CustomerManagement.vue';
import ProductCatalog from '../views/ProductCatalog.vue';
import OrderManagement from '../views/OrderManagement.vue';
import CustomizationEngine from '../views/CustomizationEngine.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/customers' },
      { path: 'customers', component: CustomerManagement },
      { path: 'products', component: ProductCatalog },
      { path: 'orders', component: OrderManagement },
      { path: 'engine', component: CustomizationEngine },
      { path: 'analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
