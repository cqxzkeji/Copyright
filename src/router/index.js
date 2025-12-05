import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import ModelTraining from '../views/ModelTraining.vue';
import ModelEvaluation from '../views/ModelEvaluation.vue';
import HyperparameterTuning from '../views/HyperparameterTuning.vue';
import ModelOptimization from '../views/ModelOptimization.vue';
import DataPreprocessing from '../views/DataPreprocessing.vue';
import Login from '../views/Login.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: Login, meta: { public: true } },
    { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/training', name: 'ModelTraining', component: ModelTraining, meta: { requiresAuth: true } },
    { path: '/evaluation', name: 'ModelEvaluation', component: ModelEvaluation, meta: { requiresAuth: true } },
    { path: '/tuning', name: 'HyperparameterTuning', component: HyperparameterTuning, meta: { requiresAuth: true } },
    { path: '/optimization', name: 'ModelOptimization', component: ModelOptimization, meta: { requiresAuth: true } },
    { path: '/preprocessing', name: 'DataPreprocessing', component: DataPreprocessing, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  const authed = Boolean(sessionStorage.getItem('ml-auth'));
  if (to.meta.public) {
    next();
    return;
  }

  if (to.meta.requiresAuth && !authed) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  next();
});

export default router;
