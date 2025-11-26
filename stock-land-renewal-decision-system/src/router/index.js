import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ParcelDatabase from '../views/ParcelDatabase.vue';
import PotentialEvaluation from '../views/PotentialEvaluation.vue';
import ScenarioSimulation from '../views/ScenarioSimulation.vue';
import ProjectPlanTracking from '../views/ProjectPlanTracking.vue';
import DecisionSupport from '../views/DecisionSupport.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/parcels' },
      { path: 'parcels', name: 'Parcels', component: ParcelDatabase },
      { path: 'potential', name: 'Potential', component: PotentialEvaluation },
      { path: 'scenarios', name: 'Scenarios', component: ScenarioSimulation },
      { path: 'projects', name: 'Projects', component: ProjectPlanTracking },
      { path: 'decision', name: 'Decision', component: DecisionSupport },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
