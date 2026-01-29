import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import FunctionalGroupAnalysis from '../views/FunctionalGroupAnalysis.vue';
import DrugActivityPrediction from '../views/DrugActivityPrediction.vue';
import SARAnalysis from '../views/SARAnalysis.vue';
import MolecularSimulation from '../views/MolecularSimulation.vue';
import CaseStudies from '../views/CaseStudies.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/app',
    component: Main,
    redirect: '/app/functional-groups',
    children: [
      { path: 'functional-groups', component: FunctionalGroupAnalysis },
      { path: 'drug-activity', component: DrugActivityPrediction },
      { path: 'sar', component: SARAnalysis },
      { path: 'simulation', component: MolecularSimulation },
      { path: 'cases', component: CaseStudies }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
