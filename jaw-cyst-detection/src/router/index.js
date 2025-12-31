import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Data from '../views/Data.vue';
import Train from '../views/Train.vue';
import Detect from '../views/Detect.vue';
import Review from '../views/Review.vue';
import System from '../views/System.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: Login },
    {
      path: '/',
      component: Main,
      children: [
        { path: '', redirect: '/data' },
        { path: 'data', name: 'Data', component: Data },
        { path: 'train', name: 'Train', component: Train },
        { path: 'detect', name: 'Detect', component: Detect },
        { path: 'review', name: 'Review', component: Review },
        { path: 'system', name: 'System', component: System }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authed = localStorage.getItem('jwt-demo-token');
  if (to.name !== 'Login' && !authed) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && authed) {
    next({ path: '/data' });
  } else {
    next();
  }
});

export default router;
