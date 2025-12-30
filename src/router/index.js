import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import WarehouseCenter from '../views/WarehouseCenter.vue';
import OrdersDemand from '../views/OrdersDemand.vue';
import DispatchOptimization from '../views/DispatchOptimization.vue';
import ExecutionMonitor from '../views/ExecutionMonitor.vue';
import AnalyticsDashboard from '../views/AnalyticsDashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/warehouse',
    children: [
      { path: 'warehouse', component: WarehouseCenter },
      { path: 'orders', component: OrdersDemand },
      { path: 'dispatch', component: DispatchOptimization },
      { path: 'execution', component: ExecutionMonitor },
      { path: 'analytics', component: AnalyticsDashboard }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
