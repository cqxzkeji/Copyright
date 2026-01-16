import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Sensor from '../views/Sensor.vue';
import Status from '../views/Status.vue';
import Decision from '../views/Decision.vue';
import Warning from '../views/Warning.vue';
import Data from '../views/Data.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        { path: '', redirect: '/dashboard/sensor' },
        { path: 'sensor', name: 'Sensor', component: Sensor },
        { path: 'status', name: 'Status', component: Status },
        { path: 'decision', name: 'Decision', component: Decision },
        { path: 'warning', name: 'Warning', component: Warning },
        { path: 'data', name: 'Data', component: Data }
      ]
    }
  ]
});

export default router;
