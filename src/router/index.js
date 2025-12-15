import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../components/MainLayout.vue';
import DataCollection from '../views/DataCollection.vue';
import DataProcessing from '../views/DataProcessing.vue';
import InfoService from '../views/InfoService.vue';
import Visualization from '../views/Visualization.vue';
import SystemManagement from '../views/SystemManagement.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/app',
      component: MainLayout,
      children: [
        { path: '', redirect: '/app/data-collection' },
        { path: 'data-collection', component: DataCollection },
        { path: 'data-processing', component: DataProcessing },
        { path: 'info-service', component: InfoService },
        { path: 'visualization', component: Visualization },
        { path: 'system-management', component: SystemManagement }
      ]
    }
  ]
});

export default router;
