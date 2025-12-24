import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import CodeManage from '../views/CodeManage.vue'
import FieldCollect from '../views/FieldCollect.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import SystemManage from '../views/SystemManage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/code' },
      { path: 'code', component: CodeManage },
      { path: 'collect', component: FieldCollect },
      { path: 'analysis', component: DataAnalysis },
      { path: 'system', component: SystemManage },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
