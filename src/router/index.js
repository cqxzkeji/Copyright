import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Device from '../views/Device.vue';
import Vision from '../views/Vision.vue';
import Control from '../views/Control.vue';
import Task from '../views/Task.vue';
import Analysis from '../views/Analysis.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/device' },
        { path: 'device', name: 'device', component: Device },
        { path: 'vision', name: 'vision', component: Vision },
        { path: 'control', name: 'control', component: Control },
        { path: 'task', name: 'task', component: Task },
        { path: 'analysis', name: 'analysis', component: Analysis }
      ]
    }
  ]
});

export default router;
