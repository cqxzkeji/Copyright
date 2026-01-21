import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import Environment from '../views/Environment.vue'
import Control from '../views/Control.vue'
import GrowthMonitor from '../views/GrowthMonitor.vue'
import Alarm from '../views/Alarm.vue'
import Management from '../views/Management.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/environment',
    children: [
      { path: 'environment', component: Environment },
      { path: 'control', component: Control },
      { path: 'growth', component: GrowthMonitor },
      { path: 'alarm', component: Alarm },
      { path: 'management', component: Management }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
