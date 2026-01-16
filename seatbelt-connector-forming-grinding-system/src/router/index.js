import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import FormingControl from '../views/FormingControl.vue';
import GrindingDispatch from '../views/GrindingDispatch.vue';
import ProductionPlan from '../views/ProductionPlan.vue';
import QualityTrace from '../views/QualityTrace.vue';
import Analytics from '../views/Analytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/forming' },
      { path: 'forming', component: FormingControl },
      { path: 'grinding', component: GrindingDispatch },
      { path: 'planning', component: ProductionPlan },
      { path: 'quality', component: QualityTrace },
      { path: 'analytics', component: Analytics }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
