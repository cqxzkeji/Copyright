import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../views/MainLayout.vue'
import TaskScheduling from '../views/TaskScheduling.vue'
import MultiDroneCoordination from '../views/MultiDroneCoordination.vue'
import RealTimeMonitoring from '../views/RealTimeMonitoring.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import SafetyAndControl from '../views/SafetyAndControl.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    {
      path: '/system',
      component: MainLayout,
      children: [
        { path: '', redirect: '/system/task-scheduling' },
        { path: 'task-scheduling', component: TaskScheduling },
        { path: 'multi-drone', component: MultiDroneCoordination },
        { path: 'monitoring', component: RealTimeMonitoring },
        { path: 'data-analysis', component: DataAnalysis },
        { path: 'safety-control', component: SafetyAndControl },
      ],
    },
  ],
})

export default router
