import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import TaskManagement from '../views/TaskManagement.vue';
import AcceptanceRecord from '../views/AcceptanceRecord.vue';
import StandardChecklist from '../views/StandardChecklist.vue';
import StatisticsAnalysis from '../views/StatisticsAnalysis.vue';
import SystemSettings from '../views/SystemSettings.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/tasks' },
      { path: 'tasks', component: TaskManagement },
      { path: 'records', component: AcceptanceRecord },
      { path: 'standards', component: StandardChecklist },
      { path: 'statistics', component: StatisticsAnalysis },
      { path: 'settings', component: SystemSettings }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
