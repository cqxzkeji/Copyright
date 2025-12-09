import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import WastewaterCollection from '../views/WastewaterCollection.vue';
import AdsorptionProcess from '../views/AdsorptionProcess.vue';
import PhosphorusRemoval from '../views/PhosphorusRemoval.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import ManagementDashboard from '../views/ManagementDashboard.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/wastewater' },
        { path: 'wastewater', component: WastewaterCollection },
        { path: 'adsorption', component: AdsorptionProcess },
        { path: 'removal', component: PhosphorusRemoval },
        { path: 'analysis', component: DataAnalysis },
        { path: 'management', component: ManagementDashboard }
      ]
    }
  ]
});

export default router;
