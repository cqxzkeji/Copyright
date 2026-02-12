import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/raw-material',
    children: [
      { path: 'raw-material', component: () => import('../views/RawMaterial.vue') },
      { path: 'formula', component: () => import('../views/Formula.vue') },
      { path: 'cost', component: () => import('../views/Cost.vue') },
      { path: 'production', component: () => import('../views/Production.vue') },
      { path: 'analysis', component: () => import('../views/Analysis.vue') },
      { path: 'setting', component: () => import('../views/Setting.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
