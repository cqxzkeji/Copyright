import { createRouter, createWebHistory } from 'vue-router';
import SeedLibrary from '../views/SeedLibrary.vue';
import BreedingOptimization from '../views/BreedingOptimization.vue';
import GeneticMatching from '../views/GeneticMatching.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import Monitoring from '../views/Monitoring.vue';
import Settings from '../views/Settings.vue';
import Login from '../views/Login.vue';

export default function buildRouter(authState) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/login', name: 'login', component: Login },
      {
        path: '/',
        component: () => import('../views/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
          { path: '', redirect: '/seed-library' },
          { path: '/seed-library', name: 'seed-library', component: SeedLibrary },
          { path: '/breeding', name: 'breeding', component: BreedingOptimization },
          { path: '/matching', name: 'matching', component: GeneticMatching },
          { path: '/analysis', name: 'analysis', component: DataAnalysis },
          { path: '/monitoring', name: 'monitoring', component: Monitoring },
          { path: '/settings', name: 'settings', component: Settings }
        ]
      }
    ]
  });

  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !authState.isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  });

  return router;
}
