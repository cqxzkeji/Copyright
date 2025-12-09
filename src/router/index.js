import { createRouter, createWebHistory } from 'vue-router'
import RawMaterial from '../views/RawMaterial.vue'
import AdsorbentPreparation from '../views/AdsorbentPreparation.vue'
import PerformanceTest from '../views/PerformanceTest.vue'
import AdsorptionMechanism from '../views/AdsorptionMechanism.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import LoginView from '../views/Login.vue'
import MainLayout from '../views/MainLayout.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  {
    path: '/app',
    component: MainLayout,
    children: [
      { path: 'raw-material', name: 'RawMaterial', component: RawMaterial },
      { path: 'adsorbent-preparation', name: 'AdsorbentPreparation', component: AdsorbentPreparation },
      { path: 'performance-test', name: 'PerformanceTest', component: PerformanceTest },
      { path: 'adsorption-mechanism', name: 'AdsorptionMechanism', component: AdsorptionMechanism },
      { path: 'data-analysis', name: 'DataAnalysis', component: DataAnalysis }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
