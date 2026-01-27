import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainLayout from '../views/MainLayout.vue';
import VehicleDiagnosis from '../views/VehicleDiagnosis.vue';
import FaultWarning from '../views/FaultWarning.vue';
import DataManagement from '../views/DataManagement.vue';
import SystemCalibration from '../views/SystemCalibration.vue';
import ReportGeneration from '../views/ReportGeneration.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/vehicle-diagnosis', component: VehicleDiagnosis },
      { path: '/fault-warning', component: FaultWarning },
      { path: '/data-management', component: DataManagement },
      { path: '/system-calibration', component: SystemCalibration },
      { path: '/report-generation', component: ReportGeneration }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
