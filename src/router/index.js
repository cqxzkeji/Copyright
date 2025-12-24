import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ResourceManage from '../views/ResourceManage.vue';
import ProductOperate from '../views/ProductOperate.vue';
import OrderTrade from '../views/OrderTrade.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import SystemSetting from '../views/SystemSetting.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    name: 'main',
    component: Main,
    children: [
      { path: '', redirect: '/main/resource' },
      { path: 'resource', name: 'resource', component: ResourceManage },
      { path: 'product', name: 'product', component: ProductOperate },
      { path: 'order', name: 'order', component: OrderTrade },
      { path: 'analysis', name: 'analysis', component: DataAnalysis },
      { path: 'setting', name: 'setting', component: SystemSetting }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
