import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import SceneDisplay from '../views/SceneDisplay.vue';
import ResourceModeling from '../views/ResourceModeling.vue';
import InteractiveLearning from '../views/InteractiveLearning.vue';
import Analytics from '../views/Analytics.vue';
import ManagementDashboard from '../views/ManagementDashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/scene-display' },
      { path: 'scene-display', name: 'sceneDisplay', component: SceneDisplay },
      { path: 'resource-modeling', name: 'resourceModeling', component: ResourceModeling },
      { path: 'interactive-learning', name: 'interactiveLearning', component: InteractiveLearning },
      { path: 'analytics', name: 'analytics', component: Analytics },
      { path: 'management', name: 'management', component: ManagementDashboard }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
