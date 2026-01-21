import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import OrderBooking from '../views/OrderBooking.vue';
import HarvestPlan from '../views/HarvestPlan.vue';
import SalesManage from '../views/SalesManage.vue';
import CustomerManage from '../views/CustomerManage.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/order',
    children: [
      { path: 'order', component: OrderBooking },
      { path: 'harvest', component: HarvestPlan },
      { path: 'sales', component: SalesManage },
      { path: 'customer', component: CustomerManage },
      { path: 'analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
