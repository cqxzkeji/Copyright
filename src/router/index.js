import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import FormulaRecommend from '../views/FormulaRecommend.vue'
import FormulaOptimization from '../views/FormulaOptimization.vue'
import CostAccounting from '../views/CostAccounting.vue'
import InventoryManagement from '../views/InventoryManagement.vue'
import ReportTracking from '../views/ReportTracking.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    redirect: '/dashboard/recommend',
    children: [
      { path: 'recommend', component: FormulaRecommend },
      { path: 'optimization', component: FormulaOptimization },
      { path: 'cost', component: CostAccounting },
      { path: 'inventory', component: InventoryManagement },
      { path: 'report', component: ReportTracking },
      { path: 'settings', component: Settings }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.path !== '/login' && !sessionStorage.getItem('afs_token')) {
    return '/login'
  }
  if (to.path === '/login' && sessionStorage.getItem('afs_token')) {
    return '/dashboard'
  }
})

export default router
