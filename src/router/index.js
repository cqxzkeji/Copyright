import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import PerformanceMonitor from '../views/PerformanceMonitor.vue';
import SecurityManagement from '../views/SecurityManagement.vue';
import FaultRecovery from '../views/FaultRecovery.vue';
import ReportAnalytics from '../views/ReportAnalytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/performance' },
      { path: 'performance', component: PerformanceMonitor },
      { path: 'security', component: SecurityManagement },
      { path: 'fault', component: FaultRecovery },
      { path: 'report', component: ReportAnalytics }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
