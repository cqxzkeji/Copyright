import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Layout from '../views/Layout.vue';
import DataCollect from '../views/DataCollect.vue';
import DataProcess from '../views/DataProcess.vue';
import Visualization from '../views/Visualization.vue';
import Intelligence from '../views/Intelligence.vue';
import SystemManage from '../views/SystemManage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: Login },
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', redirect: '/collect' },
        { path: '/collect', name: 'collect', component: DataCollect },
        { path: '/process', name: 'process', component: DataProcess },
        { path: '/visualization', name: 'visualization', component: Visualization },
        { path: '/intelligence', name: 'intelligence', component: Intelligence },
        { path: '/system', name: 'system', component: SystemManage }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    const authed = sessionStorage.getItem('bd-token');
    if (!authed) {
      next('/login');
      return;
    }
  }
  next();
});

export default router;
