import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Dashboard from '../views/Dashboard.vue';
import LiveManage from '../views/LiveManage.vue';
import AnchorManage from '../views/AnchorManage.vue';
import OrderManage from '../views/OrderManage.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import SystemSetting from '../views/SystemSetting.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/dashboard',
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'live-manage', component: LiveManage },
      { path: 'anchor-manage', component: AnchorManage },
      { path: 'order-manage', component: OrderManage },
      { path: 'data-analysis', component: DataAnalysis },
      { path: 'system-setting', component: SystemSetting }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
