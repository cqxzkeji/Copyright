import { createRouter, createWebHistory } from 'vue-router';
import DataCollection from '../views/DataCollection.vue';
import DataProcessing from '../views/DataProcessing.vue';
import RealTimeMonitoring from '../views/RealTimeMonitoring.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import DeviceManagement from '../views/DeviceManagement.vue';
import Login from '../views/Login.vue';

const routes = [
  { path: '/', redirect: '/collection' },
  { path: '/login', component: Login },
  { path: '/collection', component: DataCollection, meta: { requiresAuth: true } },
  { path: '/processing', component: DataProcessing, meta: { requiresAuth: true } },
  { path: '/monitoring', component: RealTimeMonitoring, meta: { requiresAuth: true } },
  { path: '/analysis', component: DataAnalysis, meta: { requiresAuth: true } },
  { path: '/devices', component: DeviceManagement, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('iot-token')) {
    next('/login');
  } else if (to.path === '/login' && localStorage.getItem('iot-token')) {
    next('/collection');
  } else {
    next();
  }
});

export default router;
