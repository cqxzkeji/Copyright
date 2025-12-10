import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import AnimalRecords from '../views/AnimalRecords.vue';
import HealthMonitoring from '../views/HealthMonitoring.vue';
import FeedManagement from '../views/FeedManagement.vue';
import Analytics from '../views/Analytics.vue';
import Settings from '../views/Settings.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        { path: '', redirect: '/dashboard/animals' },
        { path: 'animals', component: AnimalRecords },
        { path: 'health', component: HealthMonitoring },
        { path: 'feed', component: FeedManagement },
        { path: 'analytics', component: Analytics },
        { path: 'settings', component: Settings }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authed = !!localStorage.getItem('livestock-token');
  if (to.path !== '/login' && !authed) {
    next('/login');
  } else if (to.path === '/login' && authed) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
