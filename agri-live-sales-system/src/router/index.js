import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import LiveManage from '../views/LiveManage.vue'
import ProductManage from '../views/ProductManage.vue'
import OrderManage from '../views/OrderManage.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import SystemSetting from '../views/SystemSetting.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/live', component: LiveManage },
    { path: '/products', component: ProductManage },
    { path: '/orders', component: OrderManage },
    { path: '/analysis', component: DataAnalysis },
    { path: '/settings', component: SystemSetting }
  ]
})

export default router
