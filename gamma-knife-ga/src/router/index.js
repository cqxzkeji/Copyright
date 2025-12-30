import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import Patient from '../views/Patient.vue'
import Target from '../views/Target.vue'
import Optimize from '../views/Optimize.vue'
import Dose from '../views/Dose.vue'
import ExportView from '../views/Export.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/patient' },
      { path: 'patient', component: Patient },
      { path: 'target', component: Target },
      { path: 'optimize', component: Optimize },
      { path: 'dose', component: Dose },
      { path: 'export', component: ExportView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
