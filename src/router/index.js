import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainLayout from '../views/MainLayout.vue';
import SourceManagement from '../views/SourceManagement.vue';
import SupplyChainDispatch from '../views/SupplyChainDispatch.vue';
import WarehouseInventory from '../views/WarehouseInventory.vue';
import QualityTraceability from '../views/QualityTraceability.vue';
import DataAnalytics from '../views/DataAnalytics.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    {
      path: '/dashboard',
      component: MainLayout,
      redirect: '/dashboard/source',
      children: [
        { path: 'source', component: SourceManagement },
        { path: 'dispatch', component: SupplyChainDispatch },
        { path: 'warehouse', component: WarehouseInventory },
        { path: 'quality', component: QualityTraceability },
        { path: 'analytics', component: DataAnalytics }
      ]
    }
  ]
});

export default router;
