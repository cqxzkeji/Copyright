import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import LandData from '../views/LandData.vue';
import SimulationDesign from '../views/SimulationDesign.vue';
import ComplianceCheck from '../views/ComplianceCheck.vue';
import ConstructionControl from '../views/ConstructionControl.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/land-data' },
      { path: 'land-data', name: 'LandData', component: LandData },
      { path: 'simulation', name: 'SimulationDesign', component: SimulationDesign },
      { path: 'compliance', name: 'ComplianceCheck', component: ComplianceCheck },
      { path: 'construction', name: 'ConstructionControl', component: ConstructionControl },
      { path: 'analytics', name: 'Analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
