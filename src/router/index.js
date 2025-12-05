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
    {
      path: '/',
      component: Dashboard,
      name: 'Dashboard'
    },
    { path: '/training', name: 'ModelTraining', component: ModelTraining },
    { path: '/evaluation', name: 'ModelEvaluation', component: ModelEvaluation },
    { path: '/tuning', name: 'HyperparameterTuning', component: HyperparameterTuning },
    { path: '/optimization', name: 'ModelOptimization', component: ModelOptimization },
    { path: '/preprocessing', name: 'DataPreprocessing', component: DataPreprocessing }
  ]
});

router.beforeEach((to, from, next) => {
  const authed = Boolean(sessionStorage.getItem('ml-auth'));
  if (to.meta.public || authed) {
    next();
    return;
  }
  next('/login');
});

export default router;
