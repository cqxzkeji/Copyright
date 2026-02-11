import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../views/MainLayout.vue'
import ImageGeneration from '../views/ImageGeneration.vue'
import ResourceScheduling from '../views/ResourceScheduling.vue'
import DataProcessing from '../views/DataProcessing.vue'
import ProgressMonitoring from '../views/ProgressMonitoring.vue'
import CrossPlatformPublishing from '../views/CrossPlatformPublishing.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    {
      path: '/main',
      component: MainLayout,
      redirect: '/main/image-generation',
      children: [
        { path: 'image-generation', component: ImageGeneration },
        { path: 'resource-scheduling', component: ResourceScheduling },
        { path: 'data-processing', component: DataProcessing },
        { path: 'progress-monitoring', component: ProgressMonitoring },
        { path: 'cross-platform-publishing', component: CrossPlatformPublishing }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('smart-image-token')
  if (to.path.startsWith('/main') && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/main/image-generation')
  } else {
    next()
  }
})

export default router
