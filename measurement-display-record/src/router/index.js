import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Layout from '../views/Layout.vue';
import Device from '../views/Device.vue';
import Realtime from '../views/Realtime.vue';
import Record from '../views/Record.vue';
import History from '../views/History.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/app',
    component: Layout,
    redirect: '/app/device',
    children: [
      { path: 'device', component: Device },
      { path: 'realtime', component: Realtime },
      { path: 'record', component: Record },
      { path: 'history', component: History }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
