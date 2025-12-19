import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../views/MainLayout.vue'
import SourceRecords from '../views/SourceRecords.vue'
import DispatchScheduling from '../views/DispatchScheduling.vue'
import WarehousingInventory from '../views/WarehousingInventory.vue'
import QualityTraceability from '../views/QualityTraceability.vue'
import AnalyticsDashboard from '../views/AnalyticsDashboard.vue'

const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/source-records',
    children: [
      {
        path: 'source-records',
        component: SourceRecords
      },
      {
        path: 'dispatch-scheduling',
        component: DispatchScheduling
      },
      {
        path: 'warehousing-inventory',
        component: WarehousingInventory
      },
      {
        path: 'quality-traceability',
        component: QualityTraceability
      },
      {
        path: 'analytics-dashboard',
        component: AnalyticsDashboard
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
