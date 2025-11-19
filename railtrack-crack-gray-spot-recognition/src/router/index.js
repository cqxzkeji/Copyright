import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import DataCollection from '../views/DataCollection.vue';
import CrackDetection from '../views/CrackDetection.vue';
import AlgorithmOptimization from '../views/AlgorithmOptimization.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import Management from '../views/Management.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/data-collection' },
      { path: 'data-collection', name: 'data-collection', component: DataCollection },
      { path: 'crack-detection', name: 'crack-detection', component: CrackDetection },
      { path: 'algorithm-optimization', name: 'algorithm-optimization', component: AlgorithmOptimization },
      { path: 'data-analysis', name: 'data-analysis', component: DataAnalysis },
      { path: 'management', name: 'management', component: Management }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
