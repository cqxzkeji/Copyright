import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Demand from '../views/Demand.vue';
import Design from '../views/Design.vue';
import Testing from '../views/Testing.vue';
import Production from '../views/Production.vue';
import Project from '../views/Project.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    meta: { layout: 'auth' }
  },
  {
    path: '/demand',
    component: Demand
  },
  {
    path: '/design',
    component: Design
  },
  {
    path: '/testing',
    component: Testing
  },
  {
    path: '/production',
    component: Production
  },
  {
    path: '/project',
    component: Project
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !localStorage.getItem('session-user')) {
    next('/login');
  } else if (to.path === '/login' && localStorage.getItem('session-user')) {
    next('/demand');
  } else {
    next();
  }
});

export default router;
