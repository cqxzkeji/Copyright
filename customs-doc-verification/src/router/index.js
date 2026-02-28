import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import DocumentUpload from '../views/DocumentUpload.vue'
import DocumentReview from '../views/DocumentReview.vue'
import RiskAssessment from '../views/RiskAssessment.vue'
import ComplianceCheck from '../views/ComplianceCheck.vue'
import Analytics from '../views/Analytics.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/dashboard',
      component: Dashboard,
      redirect: '/dashboard/upload',
      children: [
        { path: 'upload', component: DocumentUpload },
        { path: 'review', component: DocumentReview },
        { path: 'risk', component: RiskAssessment },
        { path: 'compliance', component: ComplianceCheck },
        { path: 'analytics', component: Analytics }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('auth') === '1'
  if (to.path !== '/login' && !isAuthenticated) {
    next('/login')
    return
  }
  if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
    return
  }
  next()
})

export default router
