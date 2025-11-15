import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import WasteRegistration from '../views/WasteRegistration.vue';
import TransportManagement from '../views/TransportManagement.vue';
import StorageManagement from '../views/StorageManagement.vue';
import ComplianceReport from '../views/ComplianceReport.vue';
import Analytics from '../views/Analytics.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: Login },
    { path: '/dashboard', name: 'dashboard', component: Dashboard },
    { path: '/waste-registration', name: 'waste-registration', component: WasteRegistration },
    { path: '/transport-management', name: 'transport-management', component: TransportManagement },
    { path: '/storage-management', name: 'storage-management', component: StorageManagement },
    { path: '/compliance', name: 'compliance', component: ComplianceReport },
    { path: '/analytics', name: 'analytics', component: Analytics }
  ]
});

export default router;
