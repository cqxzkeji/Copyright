import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import RockFormation from '../views/RockFormation.vue';
import Tools from '../views/Tools.vue';
import InteractiveLearning from '../views/InteractiveLearning.vue';
import Assessment from '../views/Assessment.vue';
import ManagementDashboard from '../views/ManagementDashboard.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/rock-formation' },
        { path: 'rock-formation', component: RockFormation },
        { path: 'tools', component: Tools },
        { path: 'interactive', component: InteractiveLearning },
        { path: 'assessment', component: Assessment },
        { path: 'management', component: ManagementDashboard }
      ]
    }
  ]
});

export default router;
