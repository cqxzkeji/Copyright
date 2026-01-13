import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import Device from '../views/Device.vue'
import Motion from '../views/Motion.vue'
import Collaboration from '../views/Collaboration.vue'
import Monitor from '../views/Monitor.vue'
import Analysis from '../views/Analysis.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/device',
    children: [
      { path: 'device', component: Device },
      { path: 'motion', component: Motion },
      { path: 'collaboration', component: Collaboration },
      { path: 'monitor', component: Monitor },
      { path: 'analysis', component: Analysis }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
