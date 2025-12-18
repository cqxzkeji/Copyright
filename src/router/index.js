import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Product from '../views/Product.vue';
import Inventory from '../views/Inventory.vue';
import Order from '../views/Order.vue';
import User from '../views/User.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/product' },
      { path: 'product', component: Product },
      { path: 'inventory', component: Inventory },
      { path: 'order', component: Order },
      { path: 'user', component: User },
      { path: 'analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
