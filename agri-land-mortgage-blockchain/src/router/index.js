import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Dashboard from '../views/Dashboard.vue';
import LandAssets from '../views/LandAssets.vue';
import LoanProcess from '../views/LoanProcess.vue';
import ChainEvidence from '../views/ChainEvidence.vue';
import PostLoanRisk from '../views/PostLoanRisk.vue';
import SystemSetting from '../views/SystemSetting.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'land-assets', name: 'land-assets', component: LandAssets },
      { path: 'loan-process', name: 'loan-process', component: LoanProcess },
      { path: 'chain-evidence', name: 'chain-evidence', component: ChainEvidence },
      { path: 'post-loan-risk', name: 'post-loan-risk', component: PostLoanRisk },
      { path: 'system-setting', name: 'system-setting', component: SystemSetting }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
