import { createRouter, createWebHistory } from 'vue-router';
import ContentRegistration from '../views/ContentRegistration.vue';
import ProtectionMonitoring from '../views/ProtectionMonitoring.vue';
import LicensingManagement from '../views/LicensingManagement.vue';
import TransactionTransfer from '../views/TransactionTransfer.vue';
import DataAnalyticsReport from '../views/DataAnalyticsReport.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/registration' },
    { path: '/registration', component: ContentRegistration },
    { path: '/protection', component: ProtectionMonitoring },
    { path: '/licensing', component: LicensingManagement },
    { path: '/transactions', component: TransactionTransfer },
    { path: '/analytics', component: DataAnalyticsReport }
  ]
});

export default router;
