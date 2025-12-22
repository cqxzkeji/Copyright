import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import LiveDisplay from '../views/LiveDisplay.vue';
import Interaction from '../views/Interaction.vue';
import ProductLink from '../views/ProductLink.vue';
import AnchorManage from '../views/AnchorManage.vue';
import DataAnalysis from '../views/DataAnalysis.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/live-display', component: LiveDisplay },
  { path: '/interaction', component: Interaction },
  { path: '/product-link', component: ProductLink },
  { path: '/anchor-manage', component: AnchorManage },
  { path: '/data-analysis', component: DataAnalysis }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
