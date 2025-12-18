import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import UserManagement from '../views/UserManagement.vue';
import ProductManagement from '../views/ProductManagement.vue';
import OrderManagement from '../views/OrderManagement.vue';
import LogisticsService from '../views/LogisticsService.vue';
import DataAnalytics from '../views/DataAnalytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/users' },
      { path: 'users', name: 'Users', component: UserManagement },
      { path: 'products', name: 'Products', component: ProductManagement },
      { path: 'orders', name: 'Orders', component: OrderManagement },
      { path: 'logistics', name: 'Logistics', component: LogisticsService },
      { path: 'analytics', name: 'Analytics', component: DataAnalytics }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
