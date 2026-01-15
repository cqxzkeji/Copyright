import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import CreativeDesign from '../views/CreativeDesign.vue';
import ProductionManage from '../views/ProductionManage.vue';
import PublishManage from '../views/PublishManage.vue';
import EffectAnalytics from '../views/EffectAnalytics.vue';
import SystemSetting from '../views/SystemSetting.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/creative',
    children: [
      { path: 'creative', component: CreativeDesign },
      { path: 'production', component: ProductionManage },
      { path: 'publish', component: PublishManage },
      { path: 'effect', component: EffectAnalytics },
      { path: 'system', component: SystemSetting }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
