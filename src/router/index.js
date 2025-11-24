import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../layouts/MainLayout.vue';

const childRoutes = [
  {
    path: '',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: 'farm-monitoring',
    name: 'farmMonitoring',
    component: () => import('../views/FarmMonitoring.vue')
  },
  {
    path: 'irrigation',
    name: 'irrigation',
    component: () => import('../views/Irrigation.vue')
  },
  {
    path: 'crop-management',
    name: 'cropManagement',
    component: () => import('../views/CropManagement.vue')
  },
  {
    path: 'data-analysis',
    name: 'dataAnalysis',
    component: () => import('../views/DataAnalysis.vue')
  },
  {
    path: 'resource-management',
    name: 'resourceManagement',
    component: () => import('../views/ResourceManagement.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: Login },
    {
      path: '/',
      component: MainLayout,
      children: childRoutes
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

export default router;
