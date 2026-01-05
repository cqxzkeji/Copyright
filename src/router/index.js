import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import AssetLedger from '../views/AssetLedger.vue';
import Utilization from '../views/Utilization.vue';
import Monitoring from '../views/Monitoring.vue';
import Analytics from '../views/Analytics.vue';
import System from '../views/System.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/asset-ledger' },
      { path: 'asset-ledger', component: AssetLedger },
      { path: 'utilization', component: Utilization },
      { path: 'monitoring', component: Monitoring },
      { path: 'analytics', component: Analytics },
      { path: 'system', component: System }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
