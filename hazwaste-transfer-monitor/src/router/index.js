import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import WasteLedger from '../views/WasteLedger.vue';
import TransferDispatch from '../views/TransferDispatch.vue';
import RealTimeMonitor from '../views/RealTimeMonitor.vue';
import ManifestCompliance from '../views/ManifestCompliance.vue';
import AnalyticsReport from '../views/AnalyticsReport.vue';

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/ledger' },
      { path: 'ledger', name: 'ledger', component: WasteLedger },
      { path: 'dispatch', name: 'dispatch', component: TransferDispatch },
      { path: 'monitor', name: 'monitor', component: RealTimeMonitor },
      { path: 'compliance', name: 'compliance', component: ManifestCompliance },
      { path: 'analytics', name: 'analytics', component: AnalyticsReport }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('hazwaste-auth') === 'true';
  if (to.path !== '/login' && !isAuthenticated) {
    next('/login');
    return;
  }
  if (to.path === '/login' && isAuthenticated) {
    next('/main');
    return;
  }
  next();
});

export default router;
