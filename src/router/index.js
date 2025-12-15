import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import NetworkMonitoring from '../views/NetworkMonitoring.vue';
import PerformanceAnalysis from '../views/PerformanceAnalysis.vue';
import AlertManagement from '../views/AlertManagement.vue';
import Visualization from '../views/Visualization.vue';
import SystemSettings from '../views/SystemSettings.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/monitoring' },
      { path: 'monitoring', name: 'monitoring', component: NetworkMonitoring },
      { path: 'performance', name: 'performance', component: PerformanceAnalysis },
      { path: 'alerts', name: 'alerts', component: AlertManagement },
      { path: 'visualization', name: 'visualization', component: Visualization },
      { path: 'settings', name: 'settings', component: SystemSettings }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authed = Boolean(localStorage.getItem('authUser'));
  if (to.name !== 'login' && !authed) {
    next({ name: 'login' });
    return;
  }
  if (to.name === 'login' && authed) {
    next({ name: 'dashboard' });
    return;
  }
  next();
});

export default router;
