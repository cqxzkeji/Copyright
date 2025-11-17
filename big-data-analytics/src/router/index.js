import { createRouter, createWebHistory } from 'vue-router';

const Login = () => import('../views/Login.vue');
const Dashboard = () => import('../views/Dashboard.vue');
const DataCollection = () => import('../views/DataCollection.vue');
const DataProcessing = () => import('../views/DataProcessing.vue');
const DataStorage = () => import('../views/DataStorage.vue');
const Visualization = () => import('../views/Visualization.vue');
const Monitoring = () => import('../views/Monitoring.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard/data-collection' },
        { path: 'data-collection', component: DataCollection, meta: { requiresAuth: true } },
        { path: 'data-processing', component: DataProcessing, meta: { requiresAuth: true } },
        { path: 'data-storage', component: DataStorage, meta: { requiresAuth: true } },
        { path: 'visualization', component: Visualization, meta: { requiresAuth: true } },
        { path: 'monitoring', component: Monitoring, meta: { requiresAuth: true } }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authenticated = localStorage.getItem('bd-login') === '1';
  if (to.meta.requiresAuth && !authenticated) {
    next({ name: 'login' });
    return;
  }
  if (to.name === 'login' && authenticated) {
    next('/dashboard');
    return;
  }
  next();
});

export default router;
