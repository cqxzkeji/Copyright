import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import DataCollection from '../views/DataCollection.vue';
import DataProcessing from '../views/DataProcessing.vue';
import PerceptionAnalysis from '../views/PerceptionAnalysis.vue';
import FusionAlgorithm from '../views/FusionAlgorithm.vue';
import Visualization from '../views/Visualization.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/data-collection' },
        { path: 'data-collection', component: DataCollection },
        { path: 'data-processing', component: DataProcessing },
        { path: 'perception-analysis', component: PerceptionAnalysis },
        { path: 'fusion-algorithm', component: FusionAlgorithm },
        { path: 'visualization', component: Visualization }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/main') && !sessionStorage.getItem('token')) {
    next({ path: '/' });
    return;
  }
  next();
});

export default router;
