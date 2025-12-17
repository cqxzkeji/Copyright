import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import Product from '../views/Product.vue'
import Trade from '../views/Trade.vue'
import Order from '../views/Order.vue'
import AfterSales from '../views/AfterSales.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/products' },
        { path: 'products', name: 'products', component: Product },
        { path: 'trade', name: 'trade', component: Trade },
        { path: 'orders', name: 'orders', component: Order },
        { path: 'after-sales', name: 'after-sales', component: AfterSales },
        { path: 'dashboard', name: 'dashboard', component: Dashboard }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authed = localStorage.getItem('agri-token')
  if (to.path !== '/login' && !authed) {
    next('/login')
  } else if (to.path === '/login' && authed) {
    next('/main')
  } else {
    next()
  }
})

export default router
