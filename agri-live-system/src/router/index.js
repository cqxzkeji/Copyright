import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainLayout from '../views/MainLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import LiveManage from '../views/LiveManage.vue'
import AnchorManage from '../views/AnchorManage.vue'
import OrderManage from '../views/OrderManage.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import SystemSetting from '../views/SystemSetting.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      component: MainLayout,
      redirect: '/main/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'live-manage',
          name: 'LiveManage',
          component: LiveManage
        },
        {
          path: 'anchor-manage',
          name: 'AnchorManage',
          component: AnchorManage
        },
        {
          path: 'order-manage',
          name: 'OrderManage',
          component: OrderManage
        },
        {
          path: 'data-analysis',
          name: 'DataAnalysis',
          component: DataAnalysis
        },
        {
          path: 'system-setting',
          name: 'SystemSetting',
          component: SystemSetting
        }
      ]
    }
  ]
})

export default router
