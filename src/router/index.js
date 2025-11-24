import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import FiberModeling from '../views/FiberModeling.vue';
import ParameterControl from '../views/ParameterControl.vue';
import MaterialAnalysis from '../views/MaterialAnalysis.vue';
import DataVisualization from '../views/DataVisualization.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    name: 'main',
    component: Main,
    redirect: '/main/modeling',
    children: [
      { path: 'modeling', name: 'modeling', component: FiberModeling },
      { path: 'control', name: 'control', component: ParameterControl },
      { path: 'analysis', name: 'analysis', component: MaterialAnalysis },
      { path: 'visualization', name: 'visualization', component: DataVisualization }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authed = localStorage.getItem('loggedIn') === 'true';
  if (to.name !== 'login' && !authed) {
    next({ name: 'login' });
    return;
  }
  if (to.name === 'login' && authed) {
    next({ name: 'main' });
    return;
  }
  next();
});

export default router;
