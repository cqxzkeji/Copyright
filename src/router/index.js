import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import Modeling from '../views/Modeling.vue';
import ParameterOptimization from '../views/ParameterOptimization.vue';
import PerformanceTesting from '../views/PerformanceTesting.vue';
import Simulation from '../views/Simulation.vue';
import ReportGeneration from '../views/ReportGeneration.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/app',
    component: MainLayout,
    children: [
      { path: '', redirect: '/app/modeling' },
      { path: 'modeling', component: Modeling },
      { path: 'optimization', component: ParameterOptimization },
      { path: 'testing', component: PerformanceTesting },
      { path: 'simulation', component: Simulation },
      { path: 'report', component: ReportGeneration }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
