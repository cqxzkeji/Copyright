import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Dashboard from '../views/Dashboard.vue';
import DataIngestion from '../views/DataIngestion.vue';
import DataGovernance from '../views/DataGovernance.vue';
import GrowthAnalysis from '../views/GrowthAnalysis.vue';
import AlertCenter from '../views/AlertCenter.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'ingestion', name: 'DataIngestion', component: DataIngestion },
      { path: 'governance', name: 'DataGovernance', component: DataGovernance },
      { path: 'growth', name: 'GrowthAnalysis', component: GrowthAnalysis },
      { path: 'alerts', name: 'AlertCenter', component: AlertCenter }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
