import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import ContentCollection from '../views/ContentCollection.vue'
import DataFusion from '../views/DataFusion.vue'
import ContentCreation from '../views/ContentCreation.vue'
import InteractiveExperience from '../views/InteractiveExperience.vue'
import Analytics from '../views/Analytics.vue'

const routes = [
  { path: '/', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/collection' },
      { path: 'collection', component: ContentCollection },
      { path: 'fusion', component: DataFusion },
      { path: 'creation', component: ContentCreation },
      { path: 'interactive', component: InteractiveExperience },
      { path: 'analytics', component: Analytics }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
