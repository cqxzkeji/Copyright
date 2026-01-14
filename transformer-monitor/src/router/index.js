import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Device from '../views/Device.vue';
import Monitor from '../views/Monitor.vue';
import Analysis from '../views/Analysis.vue';
import Alarm from '../views/Alarm.vue';
import Report from '../views/Report.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/device',
    children: [
      { path: 'device', component: Device },
      { path: 'monitor', component: Monitor },
      { path: 'analysis', component: Analysis },
      { path: 'alarm', component: Alarm },
      { path: 'report', component: Report }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
