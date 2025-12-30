import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import DataCollect from '../views/DataCollect.vue'
import Process from '../views/Process.vue'
import Quality from '../views/Quality.vue'
import Stats from '../views/Stats.vue'
import System from '../views/System.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Dashboard, meta: { hideNav: true, isLogin: true } },
  {
    path: '/home',
    component: Dashboard,
    children: [
      { path: '', redirect: '/home/data' },
      { path: 'data', component: DataCollect },
      { path: 'process', component: Process },
      { path: 'quality', component: Quality },
      { path: 'stats', component: Stats },
      { path: 'system', component: System }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
