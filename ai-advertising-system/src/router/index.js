import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import CreativeDesign from '../views/CreativeDesign.vue';
import AudienceTargeting from '../views/AudienceTargeting.vue';
import CampaignManagement from '../views/CampaignManagement.vue';
import PerformanceAnalytics from '../views/PerformanceAnalytics.vue';
import BudgetControl from '../views/BudgetControl.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/creative-design' },
      { path: 'creative-design', component: CreativeDesign },
      { path: 'audience-targeting', component: AudienceTargeting },
      { path: 'campaign-management', component: CampaignManagement },
      { path: 'performance-analytics', component: PerformanceAnalytics },
      { path: 'budget-control', component: BudgetControl }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
