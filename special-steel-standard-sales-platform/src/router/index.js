import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import StandardManage from '../views/StandardManage.vue';
import DemandMatch from '../views/DemandMatch.vue';
import QuotationOrder from '../views/QuotationOrder.vue';
import ProcessCollaboration from '../views/ProcessCollaboration.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import MainLayout from '../layouts/MainLayout.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'standard', name: 'StandardManage', component: StandardManage },
      { path: 'demand', name: 'DemandMatch', component: DemandMatch },
      { path: 'quotation', name: 'QuotationOrder', component: QuotationOrder },
      { path: 'process', name: 'ProcessCollaboration', component: ProcessCollaboration },
      { path: 'analysis', name: 'DataAnalysis', component: DataAnalysis }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
