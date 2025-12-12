import { createRouter, createWebHashHistory } from 'vue-router';
import VideoDisplay from '../views/VideoDisplay.vue';
import VideoPlayer from '../views/VideoPlayer.vue';
import UserInteraction from '../views/UserInteraction.vue';
import SearchAndRecommend from '../views/SearchAndRecommend.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/videos', name: 'videos', component: VideoDisplay },
  { path: '/player', name: 'player', component: VideoPlayer },
  { path: '/interaction', name: 'interaction', component: UserInteraction },
  { path: '/search', name: 'search', component: SearchAndRecommend },
  { path: '/admin', name: 'admin', component: AdminDashboard }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
