import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import DataCollection from '../views/DataCollection.vue'
import Analysis from '../views/Analysis.vue'
import Visualization from '../views/Visualization.vue'
import Control from '../views/Control.vue'
import Reports from '../views/Reports.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/dashboard',
      component: Dashboard,
      redirect: '/dashboard/data-collection',
      children: [
        { path: 'data-collection', component: DataCollection },
        { path: 'analysis', component: Analysis },
        { path: 'visualization', component: Visualization },
        { path: 'control', component: Control },
        { path: 'reports', component: Reports }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !localStorage.getItem('ferment-auth')) {
    next('/login')
    return
  }
  next()
})

export default router
