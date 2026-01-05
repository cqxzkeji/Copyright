import { createRouter, createWebHistory } from 'vue-router';
import Main from '../views/Main.vue';
import Device from '../views/Device.vue';
import Collect from '../views/Collect.vue';
import Records from '../views/Records.vue';
import Trace from '../views/Trace.vue';
import Setting from '../views/Setting.vue';
import Login from '../views/Login.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/device' },
        { path: 'device', name: 'device', component: Device },
        { path: 'collect', name: 'collect', component: Collect },
        { path: 'records', name: 'records', component: Records },
        { path: 'trace', name: 'trace', component: Trace },
        { path: 'setting', name: 'setting', component: Setting }
      ]
    }
  ]
});

export default router;
