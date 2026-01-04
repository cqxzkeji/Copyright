import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import AreaArchive from '../views/AreaArchive.vue';
import ProcessMonitoring from '../views/ProcessMonitoring.vue';
import FundResource from '../views/FundResource.vue';
import EffectEvaluation from '../views/EffectEvaluation.vue';
import DecisionDashboard from '../views/DecisionDashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/area-archive',
    children: [
      { path: 'area-archive', component: AreaArchive },
      { path: 'process-monitoring', component: ProcessMonitoring },
      { path: 'fund-resource', component: FundResource },
      { path: 'effect-evaluation', component: EffectEvaluation },
      { path: 'decision-dashboard', component: DecisionDashboard }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
