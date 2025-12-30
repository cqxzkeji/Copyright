import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import DataManagement from '../views/DataManagement.vue'
import ShopModeling from '../views/ShopModeling.vue'
import PSOOptimize from '../views/PSOOptimize.vue'
import SimulationCompare from '../views/SimulationCompare.vue'
import DashboardReport from '../views/DashboardReport.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/data' },
        { path: 'data', component: DataManagement },
        { path: 'modeling', component: ShopModeling },
        { path: 'pso', component: PSOOptimize },
        { path: 'simulation', component: SimulationCompare },
        { path: 'dashboard', component: DashboardReport }
      ]
    }
  ]
})

export default router
