import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import ImageUpload from '../views/ImageUpload.vue';
import ImageProcessing from '../views/ImageProcessing.vue';
import FeatureExtraction from '../views/FeatureExtraction.vue';
import RecognitionResults from '../views/RecognitionResults.vue';
import Analysis from '../views/Analysis.vue';
import Settings from '../views/Settings.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/home',
    component: Home,
    children: [
      { path: '', redirect: '/home/upload' },
      { path: 'upload', name: 'upload', component: ImageUpload },
      { path: 'processing', name: 'processing', component: ImageProcessing },
      { path: 'features', name: 'features', component: FeatureExtraction },
      { path: 'results', name: 'results', component: RecognitionResults },
      { path: 'analysis', name: 'analysis', component: Analysis },
      { path: 'settings', name: 'settings', component: Settings }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
