import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import DataAcquisition from '../views/DataAcquisition.vue';
import DeformationAnalysis from '../views/DeformationAnalysis.vue';
import WarningCenter from '../views/WarningCenter.vue';
import HealthAssessment from '../views/HealthAssessment.vue';
import SystemManagement from '../views/SystemManagement.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/overview' },
      {
        path: 'overview',
        name: 'Overview',
        component: DataAcquisition,
      },
      {
        path: 'deformation',
        name: 'DeformationAnalysis',
        component: DeformationAnalysis,
      },
      {
        path: 'warning',
        name: 'WarningCenter',
        component: WarningCenter,
      },
      {
        path: 'health',
        name: 'HealthAssessment',
        component: HealthAssessment,
      },
      {
        path: 'system',
        name: 'SystemManagement',
        component: SystemManagement,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = sessionStorage.getItem('loggedIn') === 'true';
  if (to.path !== '/login' && !loggedIn) {
    next('/login');
  } else if (to.path === '/login' && loggedIn) {
    next('/main');
  } else {
    next();
  }
});

export default router;
