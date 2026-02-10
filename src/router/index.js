import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainLayout from '../views/MainLayout.vue';
import ClientManagement from '../views/ClientManagement.vue';
import ServiceRequest from '../views/ServiceRequest.vue';
import ServiceMonitoring from '../views/ServiceMonitoring.vue';
import ClientInteraction from '../views/ClientInteraction.vue';
import BusinessReports from '../views/BusinessReports.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    {
      path: '/main',
      component: MainLayout,
      children: [
        { path: '', redirect: '/main/client-management' },
        { path: 'client-management', component: ClientManagement },
        { path: 'service-request', component: ServiceRequest },
        { path: 'service-monitoring', component: ServiceMonitoring },
        { path: 'client-interaction', component: ClientInteraction },
        { path: 'business-reports', component: BusinessReports },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/main') && !localStorage.getItem('hh_logged_in')) {
    next('/login');
    return;
  }
  if (to.path === '/login' && localStorage.getItem('hh_logged_in')) {
    next('/main');
    return;
  }
  next();
});

export default router;
