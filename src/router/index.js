import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Partner from '../views/Partner.vue';
import Order from '../views/Order.vue';
import Logistics from '../views/Logistics.vue';
import Analytics from '../views/Analytics.vue';
import Settings from '../views/Settings.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/partner' },
      { path: 'partner', component: Partner },
      { path: 'order', component: Order },
      { path: 'logistics', component: Logistics },
      { path: 'analytics', component: Analytics },
      { path: 'settings', component: Settings },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
