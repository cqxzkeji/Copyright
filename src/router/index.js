import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import ImageGeneration from '../views/ImageGeneration.vue'
import ResourceManagement from '../views/ResourceManagement.vue'
import ImageEditing from '../views/ImageEditing.vue'
import Publish from '../views/Publish.vue'
import Analytics from '../views/Analytics.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        { path: '', redirect: '/dashboard/generation' },
        { path: 'generation', component: ImageGeneration },
        { path: 'resources', component: ResourceManagement },
        { path: 'editing', component: ImageEditing },
        { path: 'publish', component: Publish },
        { path: 'analytics', component: Analytics }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !localStorage.getItem('auth-token')) {
    next('/login')
    return
  }
  if (to.path === '/login' && localStorage.getItem('auth-token')) {
    next('/dashboard')
    return
  }
  next()
})

export default router
