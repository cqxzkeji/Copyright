import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ArchiveManagement from '../views/ArchiveManagement.vue';
import CategoryManagement from '../views/CategoryManagement.vue';
import PermissionManagement from '../views/PermissionManagement.vue';
import ArchiveSearch from '../views/ArchiveSearch.vue';
import ExportShare from '../views/Export.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/archive' },
      { path: 'archive', name: 'ArchiveManagement', component: ArchiveManagement },
      { path: 'category', name: 'CategoryManagement', component: CategoryManagement },
      { path: 'permission', name: 'PermissionManagement', component: PermissionManagement },
      { path: 'search', name: 'ArchiveSearch', component: ArchiveSearch },
      { path: 'export', name: 'ExportShare', component: ExportShare }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
