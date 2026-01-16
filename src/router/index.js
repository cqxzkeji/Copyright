import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ResourceAccess from '../views/ResourceAccess.vue';
import JobScheduling from '../views/JobScheduling.vue';
import MonitoringAlerts from '../views/MonitoringAlerts.vue';
import BillingRbac from '../views/BillingRbac.vue';
import OpsAudit from '../views/OpsAudit.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    children: [
      { path: '', redirect: '/main/resource' },
      { path: 'resource', component: ResourceAccess },
      { path: 'jobs', component: JobScheduling },
      { path: 'monitoring', component: MonitoringAlerts },
      { path: 'billing', component: BillingRbac },
      { path: 'ops', component: OpsAudit }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
