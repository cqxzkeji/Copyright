import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ProjectDatabase from '../views/ProjectDatabase.vue';
import IndicatorModel from '../views/IndicatorModel.vue';
import FeasibilityAssessment from '../views/FeasibilityAssessment.vue';
import ImplementationTracking from '../views/ImplementationTracking.vue';
import RiskDecision from '../views/RiskDecision.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/project-database' },
        { path: 'project-database', component: ProjectDatabase },
        { path: 'indicator-model', component: IndicatorModel },
        { path: 'feasibility', component: FeasibilityAssessment },
        { path: 'implementation', component: ImplementationTracking },
        { path: 'risk', component: RiskDecision },
      ],
    },
  ],
});

export default router;
