import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import ProjectManagement from '../views/ProjectManagement.vue';
import AcceptancePlanning from '../views/AcceptancePlanning.vue';
import InspectionFeedback from '../views/InspectionFeedback.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import DocumentManagement from '../views/DocumentManagement.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/project-management',
    component: ProjectManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/acceptance-planning',
    component: AcceptancePlanning,
    meta: { requiresAuth: true },
  },
  {
    path: '/inspection-feedback',
    component: InspectionFeedback,
    meta: { requiresAuth: true },
  },
  {
    path: '/data-analysis',
    component: DataAnalysis,
    meta: { requiresAuth: true },
  },
  {
    path: '/document-management',
    component: DocumentManagement,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = Boolean(localStorage.getItem('loggedIn'));
  if (to.path === '/login' && loggedIn) {
    next('/project-management');
    return;
  }
  if (to.meta.requiresAuth && !loggedIn) {
    next('/login');
    return;
  }
  next();
});

export default router;
