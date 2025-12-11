import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import CourseRecording from '../views/CourseRecording.vue';
import AIInstructor from '../views/AIInstructor.vue';
import Analytics from '../views/Analytics.vue';
import Settings from '../views/Settings.vue';
import SystemOverview from '../views/SystemOverview.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/overview', name: 'SystemOverview', component: SystemOverview },
  { path: '/courses', name: 'CourseRecording', component: CourseRecording },
  { path: '/ai', name: 'AIInstructor', component: AIInstructor },
  { path: '/analytics', name: 'Analytics', component: Analytics },
  { path: '/settings', name: 'Settings', component: Settings }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !sessionStorage.getItem('loggedIn')) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
