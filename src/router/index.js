import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import BaseData from '../views/BaseData.vue';
import TaskModeling from '../views/TaskModeling.vue';
import GAOptimization from '../views/GAOptimization.vue';
import DispatchExecution from '../views/DispatchExecution.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/base-data' },
      { path: 'base-data', component: BaseData },
      { path: 'task-modeling', component: TaskModeling },
      { path: 'ga-optimization', component: GAOptimization },
      { path: 'dispatch-execution', component: DispatchExecution },
      { path: 'analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
