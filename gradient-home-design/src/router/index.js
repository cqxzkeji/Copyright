import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ColorPicker from '../views/ColorPicker.vue';
import LayoutVisualizer from '../views/LayoutVisualizer.vue';
import DesignCustomization from '../views/DesignCustomization.vue';
import ReportGenerator from '../views/ReportGenerator.vue';
import Settings from '../views/Settings.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/app',
    component: Dashboard,
    children: [
      { path: '', redirect: '/app/gradients' },
      { path: 'gradients', name: 'gradients', component: ColorPicker },
      { path: 'layouts', name: 'layouts', component: LayoutVisualizer },
      { path: 'customization', name: 'customization', component: DesignCustomization },
      { path: 'reports', name: 'reports', component: ReportGenerator },
      { path: 'settings', name: 'settings', component: Settings }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
