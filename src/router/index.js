import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../views/MainLayout.vue'
import TradeInfo from '../views/TradeInfo.vue'
import Contract from '../views/Contract.vue'
import Payment from '../views/Payment.vue'
import MarketAnalysis from '../views/MarketAnalysis.vue'
import Logistics from '../views/Logistics.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/main',
    component: MainLayout,
    redirect: '/main/trade-info',
    children: [
      { path: 'trade-info', component: TradeInfo },
      { path: 'contract', component: Contract },
      { path: 'payment', component: Payment },
      { path: 'market-analysis', component: MarketAnalysis },
      { path: 'logistics', component: Logistics }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/main') && !localStorage.getItem('cbtm_user')) {
    next('/login')
  } else if (to.path === '/login' && localStorage.getItem('cbtm_user')) {
    next('/main/trade-info')
  } else {
    next()
  }
})

export default router
