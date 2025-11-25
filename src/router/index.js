import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import ProjectPlanning from '../views/ProjectPlanning.vue'
import ProgressTracking from '../views/ProgressTracking.vue'
import SpatialData from '../views/SpatialData.vue'
import PerformanceAnalysis from '../views/PerformanceAnalysis.vue'
import ArchiveManagement from '../views/ArchiveManagement.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: 'planning', component: ProjectPlanning },
      { path: 'progress', component: ProgressTracking },
      { path: 'spatial', component: SpatialData },
      { path: 'performance', component: PerformanceAnalysis },
      { path: 'archive', component: ArchiveManagement },
      { path: '', redirect: 'planning' }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
