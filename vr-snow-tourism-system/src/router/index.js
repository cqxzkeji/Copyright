import { createRouter, createWebHashHistory } from 'vue-router';

import UserManagement from '../views/UserManagement.vue';
import SceneDisplay from '../views/SceneDisplay.vue';
import InteractiveActivities from '../views/InteractiveActivities.vue';
import VirtualTour from '../views/VirtualTour.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  { path: '/', redirect: '/users' },
  { path: '/users', component: UserManagement },
  { path: '/scenes', component: SceneDisplay },
  { path: '/activities', component: InteractiveActivities },
  { path: '/tour', component: VirtualTour },
  { path: '/analytics', component: Analytics }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
