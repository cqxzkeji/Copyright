import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import DataIngest from '../views/DataIngest.vue';
import RiskAssessment from '../views/RiskAssessment.vue';
import Decision from '../views/Decision.vue';
import Visualization from '../views/Visualization.vue';
import SystemManagement from '../views/SystemManagement.vue';
import MainLayout from '../components/MainLayout.vue';

const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/data-ingest' },
      { path: '/data-ingest', name: 'dataIngest', component: DataIngest },
      { path: '/risk', name: 'risk', component: RiskAssessment },
      { path: '/decision', name: 'decision', component: Decision },
      { path: '/visualization', name: 'visualization', component: Visualization },
      { path: '/management', name: 'management', component: SystemManagement }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authed = localStorage.getItem('asg-auth');
  if (to.path !== '/login' && !authed) {
    next('/login');
  } else if (to.path === '/login' && authed) {
    next('/data-ingest');
  } else {
    next();
  }
});

export default router;
