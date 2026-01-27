import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Project from '../views/Project.vue';
import Requirement from '../views/Requirement.vue';
import Design from '../views/Design.vue';
import Verify from '../views/Verify.vue';
import Change from '../views/Change.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/main',
      component: Main,
      redirect: '/main/project',
      children: [
        { path: 'project', component: Project },
        { path: 'requirement', component: Requirement },
        { path: 'design', component: Design },
        { path: 'verify', component: Verify },
        { path: 'change', component: Change },
      ],
    },
  ],
});

export default router;
