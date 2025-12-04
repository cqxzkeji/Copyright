import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import CampaignTracking from '../views/CampaignTracking.vue';
import AudienceAnalysis from '../views/AudienceAnalysis.vue';
import ROIAnalysis from '../views/ROIAnalysis.vue';
import ConversionRate from '../views/ConversionRate.vue';
import Settings from '../views/Settings.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/app',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', name: 'dashboard', component: Dashboard },
        { path: 'campaigns', name: 'campaigns', component: CampaignTracking },
        { path: 'audience', name: 'audience', component: AudienceAnalysis },
        { path: 'roi', name: 'roi', component: ROIAnalysis },
        { path: 'conversion', name: 'conversion', component: ConversionRate },
        { path: 'settings', name: 'settings', component: Settings }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authed = sessionStorage.getItem('marketing-auth') === '1';
  if (to.meta.requiresAuth && !authed) {
    next('/login');
    return;
  }
  if (to.name === 'login' && authed) {
    next('/app/dashboard');
    return;
  }
  next();
});

export default router;
