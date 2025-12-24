import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Shell from '../views/Shell.vue';
import Dashboard from '../views/Dashboard.vue';
import Product from '../views/Product.vue';
import Order from '../views/Order.vue';
import Marketing from '../views/Marketing.vue';
import System from '../views/System.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/app',
      component: Shell,
      children: [
        { path: '', redirect: '/app/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: Dashboard },
        { path: 'product', name: 'product', component: Product },
        { path: 'order', name: 'order', component: Order },
        { path: 'marketing', name: 'marketing', component: Marketing },
        { path: 'system', name: 'system', component: System }
      ]
    }
  ]
});

export default router;
