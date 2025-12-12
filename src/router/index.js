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
    name: 'login',
    component: Login
  },
  {
    path: '/main',
    component: MainLayout,
    children: [
      { path: '', redirect: '/main/content' },
      { path: 'content', component: ContentGeneration },
      { path: 'analysis', component: DataAnalysis },
      { path: 'training', component: ModelTraining },
      { path: 'ui', component: InteractiveUI },
      { path: 'management', component: ManagementDashboard }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
