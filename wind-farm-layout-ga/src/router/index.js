import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import SiteData from '../views/SiteData.vue'
import ConstraintConfig from '../views/ConstraintConfig.vue'
import GAOptimize from '../views/GAOptimize.vue'
import SimulationCompare from '../views/SimulationCompare.vue'
import ReportExport from '../views/ReportExport.vue'

const routes = [
  { path: '/', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/site' },
      { path: 'site', name: 'site', component: SiteData },
      { path: 'constraint', name: 'constraint', component: ConstraintConfig },
      { path: 'ga', name: 'ga', component: GAOptimize },
      { path: 'simulation', name: 'simulation', component: SimulationCompare },
      { path: 'report', name: 'report', component: ReportExport }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('wf-token')) {
    next({ name: 'login' })
    return
  }
  next()
})

export default router
