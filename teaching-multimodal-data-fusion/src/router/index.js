import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainLayout from '../views/MainLayout.vue';
import DataCollection from '../views/DataCollection.vue';
import DataFusion from '../views/DataFusion.vue';
import AdaptiveOptimization from '../views/AdaptiveOptimization.vue';
import Visualization from '../views/Visualization.vue';
import SystemManagement from '../views/SystemManagement.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/app',
    component: MainLayout,
    children: [
      { path: '', redirect: '/app/data-collection' },
      { path: 'data-collection', component: DataCollection },
      { path: 'data-fusion', component: DataFusion },
      { path: 'adaptive-optimization', component: AdaptiveOptimization },
      { path: 'visualization', component: Visualization },
      { path: 'system-management', component: SystemManagement }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem('tm_logged_in') === 'true';
  if (to.path.startsWith('/app') && !isLoggedIn) {
    return '/login';
  }
  if (to.path === '/login' && isLoggedIn) {
    return '/app/data-collection';
  }
  return true;
});

export default router;
