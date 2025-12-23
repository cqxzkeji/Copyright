import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/MainLayout.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ProductManage from '../views/ProductManage.vue';
import OrderLogistics from '../views/OrderLogistics.vue';
import Marketing from '../views/Marketing.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import SystemSetting from '../views/SystemSetting.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/dashboard', component: Dashboard },
      { path: '/products', component: ProductManage },
      { path: '/orders', component: OrderLogistics },
      { path: '/marketing', component: Marketing },
      { path: '/analysis', component: DataAnalysis },
      { path: '/settings', component: SystemSetting }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
