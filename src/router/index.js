import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Dashboard from '../views/Dashboard.vue';
import FEAAnalysis from '../views/FEAAnalysis.vue';
import MBDAnalysis from '../views/MBDAnalysis.vue';
import CFDAnalysis from '../views/CFDAnalysis.vue';
import ThermalAnalysis from '../views/ThermalAnalysis.vue';
import VibrationNoise from '../views/VibrationNoise.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    {
      path: '/main',
      component: Main,
      redirect: '/main/dashboard',
      children: [
        { path: 'dashboard', name: 'Dashboard', component: Dashboard },
        { path: 'fea', name: 'FEAAnalysis', component: FEAAnalysis },
        { path: 'mbd', name: 'MBDAnalysis', component: MBDAnalysis },
        { path: 'cfd', name: 'CFDAnalysis', component: CFDAnalysis },
        { path: 'thermal', name: 'ThermalAnalysis', component: ThermalAnalysis },
        { path: 'vibration', name: 'VibrationNoise', component: VibrationNoise }
      ]
    }
  ]
});

export default router;
