import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import MotionCapture from '../views/MotionCapture.vue'
import MotionAnalysis from '../views/MotionAnalysis.vue'
import TrainingMode from '../views/TrainingMode.vue'
import DataMonitor from '../views/DataMonitor.vue'
import ProgressTrack from '../views/ProgressTrack.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/motion-capture',
    children: [
      { path: 'motion-capture', name: 'MotionCapture', component: MotionCapture },
      { path: 'motion-analysis', name: 'MotionAnalysis', component: MotionAnalysis },
      { path: 'training-mode', name: 'TrainingMode', component: TrainingMode },
      { path: 'data-monitor', name: 'DataMonitor', component: DataMonitor },
      { path: 'progress-track', name: 'ProgressTrack', component: ProgressTrack },
      { path: 'settings', name: 'Settings', component: Settings }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
