import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import InfoService from '../views/InfoService.vue';
import ProductTrade from '../views/ProductTrade.vue';
import OrderLogistics from '../views/OrderLogistics.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import SystemManage from '../views/SystemManage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '',
          redirect: '/info'
        },
        {
          path: '/info',
          name: 'info',
          component: InfoService
        },
        {
          path: '/products',
          name: 'products',
          component: ProductTrade
        },
        {
          path: '/orders',
          name: 'orders',
          component: OrderLogistics
        },
        {
          path: '/analysis',
          name: 'analysis',
          component: DataAnalysis
        },
        {
          path: '/system',
          name: 'system',
          component: SystemManage
        }
      ]
    }
  ]
});

export default router;
