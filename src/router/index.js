import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Data from '../views/Data.vue';
import Production from '../views/Production.vue';
import Resource from '../views/Resource.vue';
import Analysis from '../views/Analysis.vue';
import System from '../views/System.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/app',
      component: Dashboard,
      redirect: '/app/data',
      children: [
        { path: 'data', component: Data },
        { path: 'production', component: Production },
        { path: 'resource', component: Resource },
        { path: 'analysis', component: Analysis },
        { path: 'system', component: System }
      ]
    }
  ]
});

export default router;
