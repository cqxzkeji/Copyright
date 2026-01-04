import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import PatientData from '../views/PatientData.vue';
import RiskAssessment from '../views/RiskAssessment.vue';
import FollowUpManagement from '../views/FollowUpManagement.vue';
import StatisticsAnalysis from '../views/StatisticsAnalysis.vue';
import SystemManagement from '../views/SystemManagement.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/patient-data' },
      { path: 'patient-data', name: 'PatientData', component: PatientData },
      { path: 'risk-assessment', name: 'RiskAssessment', component: RiskAssessment },
      { path: 'follow-up', name: 'FollowUpManagement', component: FollowUpManagement },
      { path: 'statistics', name: 'StatisticsAnalysis', component: StatisticsAnalysis },
      { path: 'system', name: 'SystemManagement', component: SystemManagement }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
