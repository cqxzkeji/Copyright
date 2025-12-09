import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import PhosphorusAdsorption from '../views/PhosphorusAdsorption.vue';
import Remediation from '../views/Remediation.vue';
import ResourceRecovery from '../views/ResourceRecovery.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import Settings from '../views/Settings.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: '/main/adsorption' },
        { path: 'adsorption', component: PhosphorusAdsorption },
        { path: 'remediation', component: Remediation },
        { path: 'recovery', component: ResourceRecovery },
        { path: 'analysis', component: DataAnalysis },
        { path: 'settings', component: Settings }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('bentonite-auth') === 'true';
  if (to.path !== '/login' && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
