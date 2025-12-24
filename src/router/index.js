import { createRouter, createWebHistory } from 'vue-router';
import ResourceManage from '../views/ResourceManage.vue';
import ProductOperate from '../views/ProductOperate.vue';
import OrderTrade from '../views/OrderTrade.vue';
import DataAnalytics from '../views/DataAnalytics.vue';
import SystemConfig from '../views/SystemConfig.vue';
import LoginPage from '../views/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/app',
    component: () => import('../views/LayoutShell.vue'),
    children: [
      { path: 'resource', name: 'resource', component: ResourceManage },
      { path: 'product', name: 'product', component: ProductOperate },
      { path: 'order', name: 'order', component: OrderTrade },
      { path: 'analytics', name: 'analytics', component: DataAnalytics },
      { path: 'system', name: 'system', component: SystemConfig },
      { path: '', redirect: '/app/resource' }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
