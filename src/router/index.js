import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainLayout from '../views/MainLayout.vue';
import CustomerManagement from '../views/CustomerManagement.vue';
import ProductCustomization from '../views/ProductCustomization.vue';
import QuotationOrder from '../views/QuotationOrder.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import ReportNotification from '../views/ReportNotification.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/customer',
    children: [
      { path: 'customer', component: CustomerManagement },
      { path: 'product', component: ProductCustomization },
      { path: 'quotation', component: QuotationOrder },
      { path: 'analysis', component: DataAnalysis },
      { path: 'report', component: ReportNotification }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
