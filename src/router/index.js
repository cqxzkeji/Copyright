import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import SceneDisplay from '../views/SceneDisplay.vue';
import ResourceModeling from '../views/ResourceModeling.vue';
import InteractiveLearning from '../views/InteractiveLearning.vue';
import Analytics from '../views/Analytics.vue';
import ManagementDashboard from '../views/ManagementDashboard.vue';

const routes = [
  { path: '/', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: 'scene', name: 'scene', component: SceneDisplay },
      { path: 'modeling', name: 'modeling', component: ResourceModeling },
      { path: 'learning', name: 'learning', component: InteractiveLearning },
      { path: 'analytics', name: 'analytics', component: Analytics },
      { path: 'management', name: 'management', component: ManagementDashboard },
      { path: '', redirect: { name: 'scene' } }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
