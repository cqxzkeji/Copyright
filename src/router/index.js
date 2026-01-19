import { createRouter, createWebHashHistory } from 'vue-router';
import DataCapture from '../views/DataCapture.vue';
import DataManagement from '../views/DataManagement.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import Visualization from '../views/Visualization.vue';
import DecisionSupport from '../views/DecisionSupport.vue';

const routes = [
  { path: '/', redirect: '/capture' },
  { path: '/capture', name: 'DataCapture', component: DataCapture },
  { path: '/management', name: 'DataManagement', component: DataManagement },
  { path: '/analysis', name: 'DataAnalysis', component: DataAnalysis },
  { path: '/visualization', name: 'Visualization', component: Visualization },
  { path: '/decision', name: 'DecisionSupport', component: DecisionSupport }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
