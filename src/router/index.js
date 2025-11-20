import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../views/DashboardLayout.vue'
import UserBehavior from '../views/UserBehavior.vue'
import AlgorithmEngine from '../views/AlgorithmEngine.vue'
import ContentGeneration from '../views/ContentGeneration.vue'
import RealTimeRecommendation from '../views/RealTimeRecommendation.vue'
import DataMonitoring from '../views/DataMonitoring.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirect: { name: 'user-behavior' }
      },
      {
        path: 'user-behavior',
        name: 'user-behavior',
        component: UserBehavior,
        meta: { title: '用户行为分析' }
      },
      {
        path: 'algorithm-engine',
        name: 'algorithm-engine',
        component: AlgorithmEngine,
        meta: { title: '推荐算法引擎' }
      },
      {
        path: 'content-generation',
        name: 'content-generation',
        component: ContentGeneration,
        meta: { title: '推荐内容生成' }
      },
      {
        path: 'real-time',
        name: 'real-time',
        component: RealTimeRecommendation,
        meta: { title: '实时推荐系统' }
      },
      {
        path: 'data-monitoring',
        name: 'data-monitoring',
        component: DataMonitoring,
        meta: { title: '数据监控与反馈' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
