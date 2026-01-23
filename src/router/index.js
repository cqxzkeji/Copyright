import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Project from '../views/Project.vue';
import Inspection from '../views/Inspection.vue';
import Rectification from '../views/Rectification.vue';
import Coordination from '../views/Coordination.vue';
import Report from '../views/Report.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/project',
    children: [
      { path: 'project', component: Project },
      { path: 'inspection', component: Inspection },
      { path: 'rectification', component: Rectification },
      { path: 'coordination', component: Coordination },
      { path: 'report', component: Report }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
