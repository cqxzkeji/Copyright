import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import AdCreative from '../views/AdCreative.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import AdOptimization from '../views/AdOptimization.vue';
import ROIAnalysis from '../views/ROIAnalysis.vue';
import Management from '../views/Management.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/app',
    component: MainLayout,
    children: [
      { path: '', redirect: '/app/ad-creative' },
      { path: 'ad-creative', component: AdCreative },
      { path: 'data-analysis', component: DataAnalysis },
      { path: 'ad-optimization', component: AdOptimization },
      { path: 'roi-analysis', component: ROIAnalysis },
      { path: 'management', component: Management },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
