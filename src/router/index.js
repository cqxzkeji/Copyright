import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Resource from '../views/Resource.vue';
import Scene from '../views/Scene.vue';
import Interactive from '../views/Interactive.vue';
import Manage from '../views/Manage.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/resource' },
      { path: 'resource', name: 'resource', component: Resource },
      { path: 'scene', name: 'scene', component: Scene },
      { path: 'interactive', name: 'interactive', component: Interactive },
      { path: 'manage', name: 'manage', component: Manage },
      { path: 'analytics', name: 'analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
