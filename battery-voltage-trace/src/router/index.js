import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Device from '../views/Device.vue';
import Collect from '../views/Collect.vue';
import Trace from '../views/Trace.vue';
import Analysis from '../views/Analysis.vue';
import Report from '../views/Report.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/app',
    component: Main,
    children: [
      { path: '', redirect: '/app/device' },
      { path: 'device', component: Device },
      { path: 'collect', component: Collect },
      { path: 'trace', component: Trace },
      { path: 'analysis', component: Analysis },
      { path: 'report', component: Report }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authed = localStorage.getItem('bv-auth') === '1';
  if (to.path !== '/login' && !authed) {
    next('/login');
  } else if (to.path === '/login' && authed) {
    next('/app');
  } else {
    next();
  }
});

export default router;
