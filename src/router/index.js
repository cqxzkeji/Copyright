import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../views/MainLayout.vue'
import DataCollection from '../views/DataCollection.vue'
import AcademicPlanning from '../views/AcademicPlanning.vue'
import ProgressTracking from '../views/ProgressTracking.vue'
import Recommendations from '../views/Recommendations.vue'
import DataAnalysis from '../views/DataAnalysis.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/dashboard',
      component: MainLayout,
      redirect: '/dashboard/data-collection',
      children: [
        { path: 'data-collection', component: DataCollection },
        { path: 'academic-planning', component: AcademicPlanning },
        { path: 'progress-tracking', component: ProgressTracking },
        { path: 'recommendations', component: Recommendations },
        { path: 'data-analysis', component: DataAnalysis }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('academic-token')
  if (to.path !== '/login' && !token) next('/login')
  else if (to.path === '/login' && token) next('/dashboard/data-collection')
  else next()
})

export default router
