import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import SensorManage from '../views/SensorManage.vue';
import RealtimeMonitor from '../views/RealtimeMonitor.vue';
import DriverManage from '../views/DriverManage.vue';
import DataRecord from '../views/DataRecord.vue';
import SystemConfig from '../views/SystemConfig.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/sensors' },
      { path: 'sensors', name: 'sensors', component: SensorManage },
      { path: 'monitor', name: 'monitor', component: RealtimeMonitor },
      { path: 'drivers', name: 'drivers', component: DriverManage },
      { path: 'records', name: 'records', component: DataRecord },
      { path: 'config', name: 'config', component: SystemConfig }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
