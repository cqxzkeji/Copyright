import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import Control from '../views/Control.vue';
import Maintenance from '../views/Maintenance.vue';
import Analytics from '../views/Analytics.vue';
import Security from '../views/Security.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/app',
      component: MainLayout,
      children: [
        { path: 'dashboard', component: Dashboard },
        { path: 'control', component: Control },
        { path: 'maintenance', component: Maintenance },
        { path: 'analytics', component: Analytics },
        { path: 'security', component: Security }
      ]
    }
  ]
});

export default router;
