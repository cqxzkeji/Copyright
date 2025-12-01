import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import DataCollection from '../views/DataCollection.vue';
import DataFusion from '../views/DataFusion.vue';
import Simulation from '../views/Simulation.vue';
import DecisionSupport from '../views/DecisionSupport.vue';
import Monitoring from '../views/Monitoring.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/collection' },
      { path: 'collection', name: 'collection', component: DataCollection },
      { path: 'fusion', name: 'fusion', component: DataFusion },
      { path: 'simulation', name: 'simulation', component: Simulation },
      { path: 'decision', name: 'decision', component: DecisionSupport },
      { path: 'monitoring', name: 'monitoring', component: Monitoring }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
