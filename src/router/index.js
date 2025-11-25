import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import DataInput from '../views/DataInput.vue';
import ModelConfig from '../views/ModelConfig.vue';
import SimulationRunner from '../views/SimulationRunner.vue';
import Visualization from '../views/Visualization.vue';
import ForecastPublish from '../views/ForecastPublish.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/data-input' },
        { path: 'data-input', component: DataInput },
        { path: 'model-config', component: ModelConfig },
        { path: 'simulation', component: SimulationRunner },
        { path: 'visualization', component: Visualization },
        { path: 'publish', component: ForecastPublish }
      ]
    }
  ]
});

export default router;
