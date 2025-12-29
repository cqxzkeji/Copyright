import { createRouter, createWebHistory } from 'vue-router';
import Collect from '../views/Collect.vue';
import Analysis from '../views/Analysis.vue';
import Match from '../views/Match.vue';
import Track from '../views/Track.vue';
import System from '../views/System.vue';

const routes = [
  { path: '/', redirect: '/collect' },
  { path: '/collect', component: Collect },
  { path: '/analysis', component: Analysis },
  { path: '/match', component: Match },
  { path: '/track', component: Track },
  { path: '/system', component: System }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
