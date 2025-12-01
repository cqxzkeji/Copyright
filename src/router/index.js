import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import WaterQuality from '../views/WaterQuality.vue';
import DeviceStatus from '../views/DeviceStatus.vue';
import DataStorage from '../views/DataStorage.vue';
import Optimization from '../views/Optimization.vue';
import { useAuthStore } from '../stores/auth';

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
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'water-quality', name: 'water-quality', component: WaterQuality },
      { path: 'device-status', name: 'device-status', component: DeviceStatus },
      { path: 'data-storage', name: 'data-storage', component: DataStorage },
      { path: 'optimization', name: 'optimization', component: Optimization }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!auth.state.loggedIn && to.name !== 'login') {
    return { name: 'login' };
  }
  if (auth.state.loggedIn && to.name === 'login') {
    return { name: 'dashboard' };
  }
  return true;
});

export default router;
