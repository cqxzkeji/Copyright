import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import EquipmentControl from '../views/EquipmentControl.vue';
import CuttingTask from '../views/CuttingTask.vue';
import PrecisionCalibration from '../views/PrecisionCalibration.vue';
import MaintenanceTracking from '../views/MaintenanceTracking.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import SystemSettings from '../views/SystemSettings.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/app',
    component: Main,
    children: [
      {
        path: '',
        redirect: '/app/equipment-control'
      },
      {
        path: 'equipment-control',
        name: 'EquipmentControl',
        component: EquipmentControl
      },
      {
        path: 'cutting-task',
        name: 'CuttingTask',
        component: CuttingTask
      },
      {
        path: 'precision-calibration',
        name: 'PrecisionCalibration',
        component: PrecisionCalibration
      },
      {
        path: 'maintenance-tracking',
        name: 'MaintenanceTracking',
        component: MaintenanceTracking
      },
      {
        path: 'data-analysis',
        name: 'DataAnalysis',
        component: DataAnalysis
      },
      {
        path: 'system-settings',
        name: 'SystemSettings',
        component: SystemSettings
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
