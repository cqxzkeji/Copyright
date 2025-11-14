import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ResourceCollection from '../views/ResourceCollection.vue';
import WasteTransportation from '../views/WasteTransportation.vue';
import InteractiveTraining from '../views/InteractiveTraining.vue';
import DataAnalytics from '../views/DataAnalytics.vue';
import ManagementDashboard from '../views/ManagementDashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/resource' },
      { path: 'resource', component: ResourceCollection },
      { path: 'transport', component: WasteTransportation },
      { path: 'training', component: InteractiveTraining },
      { path: 'analytics', component: DataAnalytics },
      { path: 'dashboard', component: ManagementDashboard }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
