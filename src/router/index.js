import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainLayout from '../views/MainLayout.vue'
import ContentGeneration from '../views/ContentGeneration.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import ModelTraining from '../views/ModelTraining.vue'
import InteractiveUI from '../views/InteractiveUI.vue'
import ManagementDashboard from '../views/ManagementDashboard.vue'

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
    component: MainLayout,
    children: [
      { path: '', redirect: '/main/content' },
      { path: 'content', name: 'content', component: ContentGeneration },
      { path: 'analysis', name: 'analysis', component: DataAnalysis },
      { path: 'training', name: 'training', component: ModelTraining },
      { path: 'ui', name: 'ui', component: InteractiveUI },
      { path: 'management', name: 'management', component: ManagementDashboard }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
