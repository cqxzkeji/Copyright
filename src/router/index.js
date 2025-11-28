import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import ArmControl from '../views/ArmControl.vue'
import Calibration from '../views/Calibration.vue'
import PerformanceMonitor from '../views/PerformanceMonitor.vue'
import TaskManagement from '../views/TaskManagement.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      name: 'main',
      component: Main,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/main/arm-control' },
        {
          path: 'arm-control',
          name: 'arm-control',
          component: ArmControl,
          meta: { requiresAuth: true }
        },
        {
          path: 'calibration',
          name: 'calibration',
          component: Calibration,
          meta: { requiresAuth: true }
        },
        {
          path: 'performance',
          name: 'performance',
          component: PerformanceMonitor,
          meta: { requiresAuth: true }
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: TaskManagement,
          meta: { requiresAuth: true }
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authed = localStorage.getItem('smart-arm-auth') === 'true'
  if (to.meta.requiresAuth && !authed) {
    next('/login')
  } else if (to.name === 'login' && authed) {
    next('/main')
  } else {
    next()
  }
})

export default router
