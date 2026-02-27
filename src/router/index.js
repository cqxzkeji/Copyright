import { createRouter, createWebHashHistory } from 'vue-router'
import InventoryManagement from '../views/InventoryManagement.vue'
import InOutManagement from '../views/InOutManagement.vue'
import OrderTracking from '../views/OrderTracking.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import AlertManagement from '../views/AlertManagement.vue'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/dashboard',
    component: () => import('../views/DashboardLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard/inventory' },
      { path: 'inventory', name: 'inventory', component: InventoryManagement },
      { path: 'inout', name: 'inout', component: InOutManagement },
      { path: 'orders', name: 'orders', component: OrderTracking },
      { path: 'analysis', name: 'analysis', component: DataAnalysis },
      { path: 'alerts', name: 'alerts', component: AlertManagement }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authed = localStorage.getItem('warehouse-auth') === '1'
  if (to.path !== '/login' && !authed) return next('/login')
  if (to.path === '/login' && authed) return next('/dashboard')
  next()
})

export default router
