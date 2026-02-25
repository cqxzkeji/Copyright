import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'
import UploadView from '../views/Upload.vue'
import PlayView from '../views/Play.vue'
import InteractionView from '../views/Interaction.vue'
import SearchView from '../views/Search.vue'
import AnalyticsView from '../views/Analytics.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/main',
    component: MainLayout,
    redirect: '/main/upload',
    children: [
      { path: 'upload', component: UploadView },
      { path: 'play', component: PlayView },
      { path: 'interaction', component: InteractionView },
      { path: 'search', component: SearchView },
      { path: 'analytics', component: AnalyticsView }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('mgoshort-login') === 'true'
  if (to.path.startsWith('/main') && !isLogin) {
    next('/login')
  } else {
    next()
  }
})

export default router
