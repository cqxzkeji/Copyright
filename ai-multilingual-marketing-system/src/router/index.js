import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ContentGeneration from '../views/ContentGeneration.vue';
import ContentOptimization from '../views/ContentOptimization.vue';
import DataAnalytics from '../views/DataAnalytics.vue';
import ContentAudit from '../views/ContentAudit.vue';
import ContentManagement from '../views/ContentManagement.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/app',
    component: Main,
    children: [
      { path: '', redirect: '/app/content-generation' },
      { path: 'content-generation', component: ContentGeneration },
      { path: 'content-optimization', component: ContentOptimization },
      { path: 'data-analytics', component: DataAnalytics },
      { path: 'content-audit', component: ContentAudit },
      { path: 'content-management', component: ContentManagement }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('aims-auth') === 'approved';
  if (to.path.startsWith('/app') && !isLoggedIn) {
    next('/login');
    return;
  }
  if (to.path === '/login' && isLoggedIn) {
    next('/app/content-generation');
    return;
  }
  next();
});

export default router;
