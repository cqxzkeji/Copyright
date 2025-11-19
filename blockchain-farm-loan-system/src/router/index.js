import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import FarmInfoManagement from '../views/FarmInfoManagement.vue';
import LoanApplication from '../views/LoanApplication.vue';
import LoanContractManagement from '../views/LoanContractManagement.vue';
import BlockchainData from '../views/BlockchainData.vue';
import FinanceRiskManagement from '../views/FinanceRiskManagement.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/farms' },
        { path: 'farms', component: FarmInfoManagement },
        { path: 'application', component: LoanApplication },
        { path: 'contracts', component: LoanContractManagement },
        { path: 'blockchain', component: BlockchainData },
        { path: 'finance', component: FinanceRiskManagement }
      ]
    }
  ]
});

export default router;
