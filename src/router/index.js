import { createRouter, createWebHashHistory } from 'vue-router';
import CreativePlanning from '../views/CreativePlanning.vue';
import ResourceManagement from '../views/ResourceManagement.vue';
import ProjectManagement from '../views/ProjectManagement.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import FeedbackDisplay from '../views/FeedbackDisplay.vue';

const routes = [
  { path: '/', redirect: '/creative-planning' },
  { path: '/creative-planning', name: 'CreativePlanning', component: CreativePlanning },
  { path: '/resource-management', name: 'ResourceManagement', component: ResourceManagement },
  { path: '/project-management', name: 'ProjectManagement', component: ProjectManagement },
  { path: '/data-analysis', name: 'DataAnalysis', component: DataAnalysis },
  { path: '/feedback-display', name: 'FeedbackDisplay', component: FeedbackDisplay }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
