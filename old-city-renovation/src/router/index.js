import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import BaseInfo from '../views/BaseInfo.vue';
import Project from '../views/Project.vue';
import Construction from '../views/Construction.vue';
import Feedback from '../views/Feedback.vue';
import Analysis from '../views/Analysis.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/base' },
      { path: 'base', name: 'base', component: BaseInfo },
      { path: 'project', name: 'project', component: Project },
      { path: 'construction', name: 'construction', component: Construction },
      { path: 'feedback', name: 'feedback', component: Feedback },
      { path: 'analysis', name: 'analysis', component: Analysis }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
