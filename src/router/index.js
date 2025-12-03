import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import DesignInput from '../views/DesignInput.vue'
import DesignOutput from '../views/DesignOutput.vue'
import StandardEditor from '../views/StandardEditor.vue'
import DataAnalytics from '../views/DataAnalytics.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/design-input' },
      { path: 'design-input', name: 'DesignInput', component: DesignInput },
      { path: 'design-output', name: 'DesignOutput', component: DesignOutput },
      { path: 'standard-editor', name: 'StandardEditor', component: StandardEditor },
      { path: 'data-analytics', name: 'DataAnalytics', component: DataAnalytics },
      { path: 'settings', name: 'Settings', component: Settings }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
