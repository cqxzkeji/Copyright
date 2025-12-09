import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import MoodTracking from '../views/MoodTracking.vue';
import CognitiveAnalysis from '../views/CognitiveAnalysis.vue';
import BehaviorInsights from '../views/BehaviorInsights.vue';
import ReportGeneration from '../views/ReportGeneration.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/mood', name: 'Mood', component: MoodTracking },
  { path: '/cognition', name: 'Cognition', component: CognitiveAnalysis },
  { path: '/behavior', name: 'Behavior', component: BehaviorInsights },
  { path: '/report', name: 'Report', component: ReportGeneration }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
