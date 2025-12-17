import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Product from '../views/Product.vue';
import Order from '../views/Order.vue';
import Inventory from '../views/Inventory.vue';
import Analytics from '../views/Analytics.vue';
import System from '../views/System.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/app',
    component: Main,
    children: [
      { path: '', redirect: '/app/products' },
      { path: 'products', component: Product },
      { path: 'orders', component: Order },
      { path: 'inventory', component: Inventory },
      { path: 'analytics', component: Analytics },
      { path: 'system', component: System }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
