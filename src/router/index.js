import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainLayout from '../views/MainLayout.vue'
import TradeInfo from '../views/TradeInfo.vue'
import Contract from '../views/Contract.vue'
import Payment from '../views/Payment.vue'
import MarketAnalysis from '../views/MarketAnalysis.vue'
import Logistics from '../views/Logistics.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/main',
      component: MainLayout,
      children: [
        { path: '', redirect: '/main/trade-info' },
        { path: 'trade-info', component: TradeInfo },
        { path: 'contract', component: Contract },
        { path: 'payment', component: Payment },
        { path: 'market-analysis', component: MarketAnalysis },
        { path: 'logistics', component: Logistics },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const loggedIn = sessionStorage.getItem('loggedIn') === '1'
  if (to.path.startsWith('/main') && !loggedIn) return '/login'
  if (to.path === '/login' && loggedIn) return '/main'
  return true
})

export default router
