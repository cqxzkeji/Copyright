import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import DataImport from '../views/DataImport.vue';
import MapViewer from '../views/MapViewer.vue';
import DataQuery from '../views/DataQuery.vue';
import DataAnalysis from '../views/DataAnalysis.vue';
import DataExport from '../views/DataExport.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/data-import' },
      { path: 'data-import', name: 'data-import', component: DataImport },
      { path: 'map-viewer', name: 'map-viewer', component: MapViewer },
      { path: 'data-query', name: 'data-query', component: DataQuery },
      { path: 'data-analysis', name: 'data-analysis', component: DataAnalysis },
      { path: 'data-export', name: 'data-export', component: DataExport }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
