import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import RobotControl from '../views/RobotControl.vue'
import MotionPlanning from '../views/MotionPlanning.vue'
import Coordination from '../views/Coordination.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import SystemManagement from '../views/SystemManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/app',
    component: Main,
    children: [
      {
        path: '',
        redirect: '/app/robot-control'
      },
      {
        path: 'robot-control',
        name: 'robot-control',
        component: RobotControl
      },
      {
        path: 'motion-planning',
        name: 'motion-planning',
        component: MotionPlanning
      },
      {
        path: 'coordination',
        name: 'coordination',
        component: Coordination
      },
      {
        path: 'data-analysis',
        name: 'data-analysis',
        component: DataAnalysis
      },
      {
        path: 'system-management',
        name: 'system-management',
        component: SystemManagement
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
