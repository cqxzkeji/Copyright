import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import TrademarkManagement from '../views/TrademarkManagement.vue'
import CopyrightManagement from '../views/CopyrightManagement.vue'
import UserManagement from '../views/UserManagement.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import SystemConfig from '../views/SystemConfig.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'auth' }
  },
  {
    path: '/trademark',
    name: 'TrademarkManagement',
    component: TrademarkManagement,
    meta: { layout: 'main', title: '商标管理' }
  },
  {
    path: '/copyright',
    name: 'CopyrightManagement',
    component: CopyrightManagement,
    meta: { layout: 'main', title: '版权管理' }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { layout: 'main', title: '用户管理与权限控制' }
  },
  {
    path: '/analysis',
    name: 'DataAnalysis',
    component: DataAnalysis,
    meta: { layout: 'main', title: '数据统计与分析' }
  },
  {
    path: '/system',
    name: 'SystemConfig',
    component: SystemConfig,
    meta: { layout: 'main', title: '系统配置与维护' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
