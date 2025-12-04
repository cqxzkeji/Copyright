import { createRouter, createWebHistory } from 'vue-router'
import UserBehavior from '../views/UserBehavior.vue'
import Recommendation from '../views/Recommendation.vue'
import DataCollection from '../views/DataCollection.vue'
import Analytics from '../views/Analytics.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', redirect: '/behavior' },
  { path: '/behavior', component: UserBehavior },
  { path: '/recommendation', component: Recommendation },
  { path: '/collection', component: DataCollection },
  { path: '/analytics', component: Analytics },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
