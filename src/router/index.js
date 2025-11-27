import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import TrainingManagement from '../views/TrainingManagement.vue';
import DrillManagement from '../views/DrillManagement.vue';
import KnowledgeBase from '../views/KnowledgeBase.vue';
import PersonnelManagement from '../views/PersonnelManagement.vue';
import DataAnalytics from '../views/DataAnalytics.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/app',
    component: Dashboard,
    children: [
      {
        path: '',
        redirect: '/app/training'
      },
      {
        path: 'training',
        name: 'TrainingManagement',
        component: TrainingManagement
      },
      {
        path: 'drill',
        name: 'DrillManagement',
        component: DrillManagement
      },
      {
        path: 'knowledge',
        name: 'KnowledgeBase',
        component: KnowledgeBase
      },
      {
        path: 'personnel',
        name: 'PersonnelManagement',
        component: PersonnelManagement
      },
      {
        path: 'analytics',
        name: 'DataAnalytics',
        component: DataAnalytics
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
