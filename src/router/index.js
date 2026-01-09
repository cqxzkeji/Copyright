import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../components/MainLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import LandInventory from '../views/LandInventory.vue';
import ValueAssessment from '../views/ValueAssessment.vue';
import ScenarioSimulation from '../views/ScenarioSimulation.vue';
import DecisionSupport from '../views/DecisionSupport.vue';
import ResultVisualization from '../views/ResultVisualization.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/overview',
    children: [
      { path: 'overview', name: 'Overview', component: Dashboard },
      { path: 'land-inventory', name: 'LandInventory', component: LandInventory },
      { path: 'value-assessment', name: 'ValueAssessment', component: ValueAssessment },
      { path: 'scenario-simulation', name: 'ScenarioSimulation', component: ScenarioSimulation },
      { path: 'decision-support', name: 'DecisionSupport', component: DecisionSupport },
      { path: 'result-visualization', name: 'ResultVisualization', component: ResultVisualization }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
