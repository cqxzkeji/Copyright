import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Data from '../views/Data.vue';
import Monitor from '../views/Monitor.vue';
import Warning from '../views/Warning.vue';
import Health from '../views/Health.vue';
import Report from '../views/Report.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/data' },
      { path: 'data', component: Data },
      { path: 'monitor', component: Monitor },
      { path: 'warning', component: Warning },
      { path: 'health', component: Health },
      { path: 'report', component: Report }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
