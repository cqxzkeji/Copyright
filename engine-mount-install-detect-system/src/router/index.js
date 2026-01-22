import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import InstallConfig from '../views/InstallConfig.vue';
import ProcessMonitor from '../views/ProcessMonitor.vue';
import QualityDetect from '../views/QualityDetect.vue';
import AlarmReview from '../views/AlarmReview.vue';
import DataAnalysis from '../views/DataAnalysis.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/install-config',
    children: [
      { path: 'install-config', component: InstallConfig },
      { path: 'process-monitor', component: ProcessMonitor },
      { path: 'quality-detect', component: QualityDetect },
      { path: 'alarm-review', component: AlarmReview },
      { path: 'data-analysis', component: DataAnalysis }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
