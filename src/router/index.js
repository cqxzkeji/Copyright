import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import MainLayout from '../views/MainLayout.vue'
import Upload from '../views/Upload.vue'
import Play from '../views/Play.vue'
import Interaction from '../views/Interaction.vue'
import Search from '../views/Search.vue'
import Analytics from '../views/Analytics.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/main',
      component: MainLayout,
      redirect: '/main/upload',
      children: [
        { path: 'upload', name: 'upload', component: Upload },
        { path: 'play', name: 'play', component: Play },
        { path: 'interaction', name: 'interaction', component: Interaction },
        { path: 'search', name: 'search', component: Search },
        { path: 'analytics', name: 'analytics', component: Analytics }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('mgoshort-auth') === 'true'
  if (to.path.startsWith('/main') && !loggedIn) {
    next('/login')
    return
  }
  if (to.path === '/login' && loggedIn) {
    next('/main/upload')
    return
  }
  next()
})

export default router
