import { createRouter, createWebHashHistory } from 'vue-router'
import DataCollection from '../views/DataCollection.vue'
import DataPreprocessing from '../views/DataPreprocessing.vue'
import DataStorage from '../views/DataStorage.vue'
import Analysis from '../views/Analysis.vue'
import Reporting from '../views/Reporting.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue') },
  {
    path: '/platform',
    component: () => import('../views/MainLayout.vue'),
    redirect: '/platform/collection',
    children: [
      { path: 'collection', component: DataCollection },
      { path: 'preprocessing', component: DataPreprocessing },
      { path: 'storage', component: DataStorage },
      { path: 'analysis', component: Analysis },
      { path: 'reporting', component: Reporting }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.path.startsWith('/platform') && !localStorage.getItem('token')) return '/login'
  if (to.path === '/login' && localStorage.getItem('token')) return '/platform/collection'
})

export default router
