import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../layouts/MainLayout.vue';
import DailyReport from '../views/DailyReport.vue';
import Statistics from '../views/Statistics.vue';
import DataSync from '../views/DataSync.vue';
import UserManagement from '../views/UserManagement.vue';
import Settings from '../views/Settings.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/app',
      component: MainLayout,
      children: [
        { path: '', redirect: '/app/daily' },
        { path: 'daily', component: DailyReport },
        { path: 'statistics', component: Statistics },
        { path: 'data-sync', component: DataSync },
        { path: 'users', component: UserManagement },
        { path: 'settings', component: Settings }
      ]
    }
  ]
});

export default router;
