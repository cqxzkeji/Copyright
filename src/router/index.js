import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import CustomerManage from '../views/CustomerManage.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import RoleManagement from '../views/RoleManagement.vue';
import CRM from '../views/CRM.vue';
import ReportGeneration from '../views/ReportGeneration.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    redirect: '/dashboard/customer',
    children: [
      { path: 'customer', component: CustomerManage },
      { path: 'analysis', component: DataAnalysis },
      { path: 'roles', component: RoleManagement },
      { path: 'crm', component: CRM },
      { path: 'reports', component: ReportGeneration }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
