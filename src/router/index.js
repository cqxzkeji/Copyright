import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainLayout from '../layouts/MainLayout.vue';
import CustomerManagement from '../views/CustomerManagement.vue';
import ProductCustomization from '../views/ProductCustomization.vue';
import QuotationOrderManagement from '../views/QuotationOrderManagement.vue';
import ProductionScheduling from '../views/ProductionScheduling.vue';
import AfterSalesAndQuality from '../views/AfterSalesAndQuality.vue';

const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/customer',
    children: [
      { path: 'customer', component: CustomerManagement },
      { path: 'product', component: ProductCustomization },
      { path: 'quotation', component: QuotationOrderManagement },
      { path: 'production', component: ProductionScheduling },
      { path: 'after-sales', component: AfterSalesAndQuality }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
