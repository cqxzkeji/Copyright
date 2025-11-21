import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ProjectManagement from '../views/ProjectManagement.vue';
import ConsultingServices from '../views/ConsultingServices.vue';
import CRM from '../views/CRM.vue';
import ResourceManagement from '../views/ResourceManagement.vue';
import DataAnalysis from '../views/DataAnalysis.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/projects', name: 'projects', component: ProjectManagement },
  { path: '/consulting', name: 'consulting', component: ConsultingServices },
  { path: '/crm', name: 'crm', component: CRM },
  { path: '/resources', name: 'resources', component: ResourceManagement },
  { path: '/analysis', name: 'analysis', component: DataAnalysis }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
