import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import ReportEntry from '../views/ReportEntry.vue'
import ReportApproval from '../views/ReportApproval.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import TaskManagement from '../views/TaskManagement.vue'
import Notification from '../views/Notification.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/report-entry' },
      { path: 'report-entry', component: ReportEntry },
      { path: 'report-approval', component: ReportApproval },
      { path: 'data-analysis', component: DataAnalysis },
      { path: 'task-management', component: TaskManagement },
      { path: 'notification', component: Notification }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
