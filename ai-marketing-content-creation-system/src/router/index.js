import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ContentCreation from '../views/ContentCreation.vue';
import VisualAssetEditor from '../views/VisualAssetEditor.vue';
import Collaboration from '../views/Collaboration.vue';
import CrossPlatform from '../views/CrossPlatform.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/workspace',
    component: Main,
    redirect: '/workspace/content',
    children: [
      { path: 'content', component: ContentCreation },
      { path: 'visual', component: VisualAssetEditor },
      { path: 'collaboration', component: Collaboration },
      { path: 'cross-platform', component: CrossPlatform },
      { path: 'analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
