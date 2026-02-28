import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import RiskMonitoring from '../views/RiskMonitoring.vue';
import ComplianceCheck from '../views/ComplianceCheck.vue';
import Reports from '../views/Reports.vue';
import ComplianceGuide from '../views/ComplianceGuide.vue';
import Audit from '../views/Audit.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        { path: '', redirect: '/dashboard/risk' },
        { path: 'risk', component: RiskMonitoring },
        { path: 'check', component: ComplianceCheck },
        { path: 'reports', component: Reports },
        { path: 'guide', component: ComplianceGuide },
        { path: 'audit', component: Audit },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !sessionStorage.getItem('ccs_token')) {
    next('/login');
    return;
  }
  if (to.path === '/login' && sessionStorage.getItem('ccs_token')) {
    next('/dashboard/risk');
    return;
  }
  next();
});

export default router;
