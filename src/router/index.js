import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import DataIntegration from '../views/DataIntegration.vue';
import ResilienceAssessment from '../views/ResilienceAssessment.vue';
import RiskPrediction from '../views/RiskPrediction.vue';
import WarningResponse from '../views/WarningResponse.vue';
import SystemManagement from '../views/SystemManagement.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login, meta: { public: true } },
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/data', name: 'DataIntegration', component: DataIntegration },
  { path: '/resilience', name: 'ResilienceAssessment', component: ResilienceAssessment },
  { path: '/prediction', name: 'RiskPrediction', component: RiskPrediction },
  { path: '/warning', name: 'WarningResponse', component: WarningResponse },
  { path: '/system', name: 'SystemManagement', component: SystemManagement }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authed = localStorage.getItem('resilience-authed');
  if (!to.meta.public && !authed) {
    next('/login');
  } else if (to.path === '/login' && authed) {
    next('/');
  } else {
    next();
  }
});

export default router;
