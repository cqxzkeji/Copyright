import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/MainLayout.vue';
import Login from '../views/Login.vue';
import DataCollection from '../views/DataCollection.vue';
import DataProcessing from '../views/DataProcessing.vue';
import DataStorage from '../views/DataStorage.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import Visualization from '../views/Visualization.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/collection',
    children: [
      { path: 'collection', component: DataCollection },
      { path: 'processing', component: DataProcessing },
      { path: 'storage', component: DataStorage },
      { path: 'analysis', component: DataAnalysis },
      { path: 'visualization', component: Visualization }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
