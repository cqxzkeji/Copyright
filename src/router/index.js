import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import UserManagement from '../views/UserManagement.vue';
import ProductManagement from '../views/ProductManagement.vue';
import OrderManagement from '../views/OrderManagement.vue';
import Marketing from '../views/Marketing.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideLayout: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '主仪表盘', requiresAuth: true }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { title: '用户管理', requiresAuth: true }
  },
  {
    path: '/products',
    name: 'ProductManagement',
    component: ProductManagement,
    meta: { title: '产品管理', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'OrderManagement',
    component: OrderManagement,
    meta: { title: '订单管理', requiresAuth: true }
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: Marketing,
    meta: { title: '营销与促销', requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: { title: '报表与数据分析', requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('loggedIn')) {
    next('/login');
    return;
  }
  next();
});

export default router;
