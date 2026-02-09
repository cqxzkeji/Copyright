import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../views/MainLayout.vue'
import ProjectSetup from '../views/ProjectSetup.vue'
import ResourceManagement from '../views/ResourceManagement.vue'
import ProgressMonitoring from '../views/ProgressMonitoring.vue'
import TeamManagement from '../views/TeamManagement.vue'
import FinancialReports from '../views/FinancialReports.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/dashboard',
      component: MainLayout,
      redirect: '/dashboard/project-setup',
      children: [
        { path: 'project-setup', component: ProjectSetup },
        { path: 'resource-management', component: ResourceManagement },
        { path: 'progress-monitoring', component: ProgressMonitoring },
        { path: 'team-management', component: TeamManagement },
        { path: 'financial-reports', component: FinancialReports }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('pms-auth') === 'true'
  if (to.path.startsWith('/dashboard') && !isAuth) {
    next('/login')
    return
  }
  if (to.path === '/login' && isAuth) {
    next('/dashboard/project-setup')
    return
  }
  next()
})

export default router
