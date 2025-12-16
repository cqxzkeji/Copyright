import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import DataCollection from '../views/DataCollection.vue';
import DataProcessing from '../views/DataProcessing.vue';
import InfoService from '../views/InfoService.vue';
import Visualization from '../views/Visualization.vue';
import SystemManagement from '../views/SystemManagement.vue';
import ShellLayout from '../views/ShellLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: ShellLayout,
    children: [
      { path: '', redirect: '/data-collection' },
      { path: '/data-collection', name: 'dataCollection', component: DataCollection },
      { path: '/data-processing', name: 'dataProcessing', component: DataProcessing },
      { path: '/info-service', name: 'infoService', component: InfoService },
      { path: '/visualization', name: 'visualization', component: Visualization },
      { path: '/system-management', name: 'systemManagement', component: SystemManagement }
    ],
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authed = sessionStorage.getItem('mtas_token');
  if (to.meta.requiresAuth && !authed) {
    next({ name: 'login' });
    return;
  }
  if (to.name === 'login' && authed) {
    next('/');
    return;
  }
  next();
});

export default router;
