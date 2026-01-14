import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import DeviceConfig from '../views/DeviceConfig.vue';
import TaskPlanning from '../views/TaskPlanning.vue';
import ProcessControl from '../views/ProcessControl.vue';
import Monitoring from '../views/Monitoring.vue';
import Analytics from '../views/Analytics.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: Login },
    {
      path: '/main',
      component: Main,
      redirect: '/main/device',
      children: [
        { path: 'device', name: 'device', component: DeviceConfig },
        { path: 'task', name: 'task', component: TaskPlanning },
        { path: 'process', name: 'process', component: ProcessControl },
        { path: 'monitor', name: 'monitor', component: Monitoring },
        { path: 'analytics', name: 'analytics', component: Analytics }
      ]
    }
  ]
});

export default router;
