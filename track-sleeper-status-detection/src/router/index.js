import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import DataCollection from '../views/DataCollection.vue';
import ImageProcessing from '../views/ImageProcessing.vue';
import StateDetection from '../views/StateDetection.vue';
import Analytics from '../views/Analytics.vue';
import Report from '../views/Report.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/data-collection' },
      { path: 'data-collection', name: 'data-collection', component: DataCollection },
      { path: 'image-processing', name: 'image-processing', component: ImageProcessing },
      { path: 'state-detection', name: 'state-detection', component: StateDetection },
      { path: 'analytics', name: 'analytics', component: Analytics },
      { path: 'report', name: 'report', component: Report },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
