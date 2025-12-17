import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Dashboard from '../views/Dashboard.vue';
import Product from '../views/Product.vue';
import Trade from '../views/Trade.vue';
import Order from '../views/Order.vue';
import AfterSales from '../views/AfterSales.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    children: [
      { path: '', redirect: '/main/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'product', name: 'Product', component: Product },
      { path: 'trade', name: 'Trade', component: Trade },
      { path: 'order', name: 'Order', component: Order },
      { path: 'after-sales', name: 'AfterSales', component: AfterSales },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
