import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../views/MainLayout.vue'
import DataCollection from '../views/DataCollection.vue'
import DataProcessing from '../views/DataProcessing.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import DataVisualization from '../views/DataVisualization.vue'
import BusinessIntelligence from '../views/BusinessIntelligence.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    {
      path: '/app',
      component: MainLayout,
      children: [
        { path: '', redirect: '/app/collection' },
        { path: 'collection', component: DataCollection },
        { path: 'processing', component: DataProcessing },
        { path: 'analysis', component: DataAnalysis },
        { path: 'visualization', component: DataVisualization },
        { path: 'business', component: BusinessIntelligence }
      ]
    }
  ]
})

export default router
