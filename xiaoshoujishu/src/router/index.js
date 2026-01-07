import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainLayout from '../views/MainLayout.vue'
import SalesAnalysis from '../views/SalesAnalysis.vue'
import TechStandard from '../views/TechStandard.vue'
import CustomerDemand from '../views/CustomerDemand.vue'
import ReverseInference from '../views/ReverseInference.vue'
import Reports from '../views/Reports.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/app',
      component: MainLayout,
      redirect: '/app/sales',
      children: [
        { path: 'sales', component: SalesAnalysis },
        { path: 'standards', component: TechStandard },
        { path: 'customer', component: CustomerDemand },
        { path: 'reverse', component: ReverseInference },
        { path: 'reports', component: Reports }
      ]
    }
  ]
})

export default router
