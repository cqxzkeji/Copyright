import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Gallery from '../views/Gallery.vue';
import Share from '../views/Share.vue';
import Interaction from '../views/Interaction.vue';
import Analytics from '../views/Analytics.vue';
import Admin from '../views/Admin.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      children: [
        { path: '', redirect: '/gallery' },
        { path: 'gallery', name: 'gallery', component: Gallery },
        { path: 'share', name: 'share', component: Share },
        { path: 'interaction', name: 'interaction', component: Interaction },
        { path: 'analytics', name: 'analytics', component: Analytics },
        { path: 'admin', name: 'admin', component: Admin }
      ]
    }
  ]
});

export default router;
