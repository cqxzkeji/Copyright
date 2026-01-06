import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Customer from '../views/Customer.vue';
import ProductStandard from '../views/ProductStandard.vue';
import Quotation from '../views/Quotation.vue';
import OrderExecution from '../views/OrderExecution.vue';
import Analytics from '../views/Analytics.vue';
import Shell from '../views/Shell.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/app',
    component: Shell,
    children: [
      { path: '', redirect: 'overview' },
      { path: 'overview', name: 'Dashboard', component: Dashboard },
      { path: 'customers', name: 'Customer', component: Customer },
      { path: 'product', name: 'ProductStandard', component: ProductStandard },
      { path: 'quotation', name: 'Quotation', component: Quotation },
      { path: 'order', name: 'OrderExecution', component: OrderExecution },
      { path: 'analytics', name: 'Analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const authed = localStorage.getItem('steel_token');
  if (!authed) {
    next('/login');
  } else {
    next();
  }
});

export default router;
