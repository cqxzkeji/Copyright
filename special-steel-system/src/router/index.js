import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Standard from '../views/Standard.vue';
import Demand from '../views/Demand.vue';
import Match from '../views/Match.vue';
import Order from '../views/Order.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/main',
    component: Main,
    redirect: '/main/standard',
    children: [
      { path: 'standard', component: Standard },
      { path: 'demand', component: Demand },
      { path: 'match', component: Match },
      { path: 'order', component: Order },
      { path: 'analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
