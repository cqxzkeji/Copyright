import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import DataCollection from '../views/DataCollection.vue';
import DataProcessing from '../views/DataProcessing.vue';
import EnterpriseProfile from '../views/EnterpriseProfile.vue';
import Analysis from '../views/Analysis.vue';
import System from '../views/System.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      component: Main,
      redirect: '/main/data-collection',
      children: [
        {
          path: 'data-collection',
          name: 'data-collection',
          component: DataCollection
        },
        {
          path: 'data-processing',
          name: 'data-processing',
          component: DataProcessing
        },
        {
          path: 'enterprise-profile',
          name: 'enterprise-profile',
          component: EnterpriseProfile
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: Analysis
        },
        {
          path: 'system',
          name: 'system',
          component: System
        }
      ]
    }
  ]
});

export default router;
