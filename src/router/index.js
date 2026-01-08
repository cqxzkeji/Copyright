import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainLayout from '../views/MainLayout.vue';
import CustomerAnalysis from '../views/CustomerAnalysis.vue';
import ProductCustomization from '../views/ProductCustomization.vue';
import QuoteOrderManagement from '../views/QuoteOrderManagement.vue';
import InventoryProduction from '../views/InventoryProduction.vue';
import DataAnalysis from '../views/DataAnalysis.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/dashboard',
      component: MainLayout,
      redirect: '/dashboard/customer',
      children: [
        {
          path: 'customer',
          component: CustomerAnalysis
        },
        {
          path: 'customization',
          component: ProductCustomization
        },
        {
          path: 'quote-order',
          component: QuoteOrderManagement
        },
        {
          path: 'inventory',
          component: InventoryProduction
        },
        {
          path: 'data-analysis',
          component: DataAnalysis
        }
      ]
    }
  ]
});

export default router;
