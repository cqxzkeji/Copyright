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
    path: '/',
    component: LoginView
  },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/source-records',
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
    path: '/login',
    redirect: '/'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
