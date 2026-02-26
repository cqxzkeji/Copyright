import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import MarketMonitor from '../views/MarketMonitor.vue';
import RiskAssessment from '../views/RiskAssessment.vue';
import ComplianceCheck from '../views/ComplianceCheck.vue';
import SupplyChainOptimization from '../views/SupplyChainOptimization.vue';
import Reports from '../views/Reports.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/dashboard',
      component: MainLayout,
      children: [
        { path: '', redirect: '/dashboard/market' },
        { path: 'market', component: MarketMonitor },
        { path: 'risk', component: RiskAssessment },
        { path: 'compliance', component: ComplianceCheck },
        { path: 'supply', component: SupplyChainOptimization },
        { path: 'reports', component: Reports }
      ]
    }
  ]
});

router.beforeEach((to) => {
  if (to.path.startsWith('/dashboard') && !sessionStorage.getItem('trade-auth')) {
    return '/login';
  }
  return true;
});

export default router;
