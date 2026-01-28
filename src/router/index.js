import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import FEAAnalysis from '../views/FEAAnalysis.vue';
import CollisionSimulation from '../views/CollisionSimulation.vue';
import DynamicsSimulation from '../views/DynamicsSimulation.vue';
import ThermalFluidAnalysis from '../views/ThermalFluidAnalysis.vue';
import StructuralOptimization from '../views/StructuralOptimization.vue';
import Reports from '../views/Reports.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    redirect: '/dashboard/fea',
    children: [
      { path: 'fea', name: 'FEA', component: FEAAnalysis },
      { path: 'collision', name: 'Collision', component: CollisionSimulation },
      { path: 'dynamics', name: 'Dynamics', component: DynamicsSimulation },
      { path: 'thermal', name: 'Thermal', component: ThermalFluidAnalysis },
      { path: 'structural', name: 'Structural', component: StructuralOptimization },
      { path: 'reports', name: 'Reports', component: Reports },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
