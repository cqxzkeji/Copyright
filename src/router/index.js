import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/main', name: 'main', component: Main }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
