import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import StandardManagement from '../views/StandardManagement.vue'
import SalesTracking from '../views/SalesTracking.vue'
import OrderProcessing from '../views/OrderProcessing.vue'
import QualityControl from '../views/QualityControl.vue'
import Analytics from '../views/Analytics.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/standards' },
      { path: 'standards', name: 'standards', component: StandardManagement },
      { path: 'sales', name: 'sales', component: SalesTracking },
      { path: 'orders', name: 'orders', component: OrderProcessing },
      { path: 'quality', name: 'quality', component: QualityControl },
      { path: 'analytics', name: 'analytics', component: Analytics }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/main')) {
    const authed = localStorage.getItem('yutegang-token') === 'approved'
    if (!authed) {
      return next('/login')
    }
  }
  next()
})

export default router
