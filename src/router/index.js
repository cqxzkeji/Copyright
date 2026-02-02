import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import DataCollection from '../views/DataCollection.vue';
import LSTMTraining from '../views/LSTMTraining.vue';
import AttentionMechanism from '../views/AttentionMechanism.vue';
import RealTimeFeedback from '../views/RealTimeFeedback.vue';
import Visualization from '../views/Visualization.vue';
import ReportGeneration from '../views/ReportGeneration.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/data-collection', name: 'data-collection', component: DataCollection },
  { path: '/lstm-training', name: 'lstm-training', component: LSTMTraining },
  { path: '/attention', name: 'attention', component: AttentionMechanism },
  { path: '/real-time', name: 'real-time', component: RealTimeFeedback },
  { path: '/visualization', name: 'visualization', component: Visualization },
  { path: '/report', name: 'report', component: ReportGeneration }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
