import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import DeviceMonitoring from '../views/DeviceMonitoring.vue';
import MaintenanceManagement from '../views/MaintenanceManagement.vue';
import InspectionManagement from '../views/InspectionManagement.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import SecuritySettings from '../views/SecuritySettings.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  { path: '/', name: 'login', component: LoginView },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/monitoring' },
      { path: 'monitoring', name: 'monitoring', component: DeviceMonitoring },
      { path: 'maintenance', name: 'maintenance', component: MaintenanceManagement },
      { path: 'inspection', name: 'inspection', component: InspectionManagement },
      { path: 'analysis', name: 'analysis', component: DataAnalysis },
      { path: 'security', name: 'security', component: SecuritySettings }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
