import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import DataCollection from '../views/DataCollection.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import Report from '../views/Report.vue';
import SystemManage from '../views/SystemManage.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/',
    redirect: '/dashboard'
  },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/collection', name: 'DataCollection', component: DataCollection },
  { path: '/analysis', name: 'DataAnalysis', component: DataAnalysis },
  { path: '/report', name: 'Report', component: Report },
  { path: '/system', name: 'SystemManage', component: SystemManage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('bdv_user');
  if (to.name !== 'Login' && !token) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && token) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
