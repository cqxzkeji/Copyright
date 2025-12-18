import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Production from '../views/Production.vue';
import SupplyChain from '../views/SupplyChain.vue';
import Sales from '../views/Sales.vue';
import Traceability from '../views/Traceability.vue';
import Analytics from '../views/Analytics.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/app',
      component: Dashboard,
      children: [
        { path: '', redirect: '/app/production' },
        { path: 'production', component: Production },
        { path: 'supply', component: SupplyChain },
        { path: 'sales', component: Sales },
        { path: 'trace', component: Traceability },
        { path: 'analytics', component: Analytics }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !sessionStorage.getItem('agri-user')) {
    next('/login');
  } else {
    next();
  }
});

export default router;
