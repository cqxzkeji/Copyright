import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import DataCollection from '../views/DataCollection.vue';
import DataPreprocessing from '../views/DataPreprocessing.vue';
import InformationFusion from '../views/InformationFusion.vue';
import DataVisualization from '../views/DataVisualization.vue';
import SystemManagement from '../views/SystemManagement.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/collection', name: 'DataCollection', component: DataCollection },
  { path: '/preprocessing', name: 'DataPreprocessing', component: DataPreprocessing },
  { path: '/fusion', name: 'InformationFusion', component: InformationFusion },
  { path: '/visualization', name: 'DataVisualization', component: DataVisualization },
  { path: '/system', name: 'SystemManagement', component: SystemManagement }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next();
    return;
  }
  const authed = localStorage.getItem('msdfp-authed');
  if (!authed) {
    next('/');
  } else {
    next();
  }
});

export default router;
