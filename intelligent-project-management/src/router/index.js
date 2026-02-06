import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainLayout from '../components/MainLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import ProjectPlanning from '../views/ProjectPlanning.vue'
import ResourceOptimization from '../views/ResourceOptimization.vue'
import DecisionSupport from '../views/DecisionSupport.vue'
import Collaboration from '../views/Collaboration.vue'
import RiskManagement from '../views/RiskManagement.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/app',
    component: MainLayout,
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'planning', name: 'planning', component: ProjectPlanning },
      { path: 'resources', name: 'resources', component: ResourceOptimization },
      { path: 'decision', name: 'decision', component: DecisionSupport },
      { path: 'collaboration', name: 'collaboration', component: Collaboration },
      { path: 'risk', name: 'risk', component: RiskManagement }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthed = localStorage.getItem('ipm-auth') === 'true'
  if (to.path !== '/login' && !isAuthed) {
    next('/login')
    return
  }
  if (to.path === '/login' && isAuthed) {
    next('/app/dashboard')
    return
  }
  next()
})

export default router
