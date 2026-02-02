import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import TrainingManagement from '../views/TrainingManagement.vue';
import DrillManagement from '../views/DrillManagement.vue';
import KnowledgeBase from '../views/KnowledgeBase.vue';
import SafetyInspection from '../views/SafetyInspection.vue';
import Reports from '../views/Reports.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/training' },
      { path: 'training', component: TrainingManagement },
      { path: 'drill', component: DrillManagement },
      { path: 'knowledge', component: KnowledgeBase },
      { path: 'inspection', component: SafetyInspection },
      { path: 'reports', component: Reports }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
