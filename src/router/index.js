import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import MaterialLibrary from '../views/MaterialLibrary.vue'
import MultiscaleModeling from '../views/MultiscaleModeling.vue'
import SimulationAnalysis from '../views/SimulationAnalysis.vue'
import OptimizationDesign from '../views/OptimizationDesign.vue'
import ValidationReport from '../views/ValidationReport.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/materials' },
      { path: 'materials', name: 'MaterialLibrary', component: MaterialLibrary },
      { path: 'multiscale', name: 'MultiscaleModeling', component: MultiscaleModeling },
      { path: 'simulation', name: 'SimulationAnalysis', component: SimulationAnalysis },
      { path: 'optimization', name: 'OptimizationDesign', component: OptimizationDesign },
      { path: 'validation', name: 'ValidationReport', component: ValidationReport }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
