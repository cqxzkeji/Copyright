import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainShell from '../views/MainShell.vue';
import LayoutEditor from '../views/LayoutEditor.vue';
import ContentManagement from '../views/ContentManagement.vue';
import TemplateGallery from '../views/TemplateGallery.vue';
import PreviewAndExport from '../views/PreviewAndExport.vue';
import Analytics from '../views/Analytics.vue';
import UserProfile from '../views/UserProfile.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    {
      path: '/app',
      component: MainShell,
      children: [
        { path: '', redirect: '/app/layout' },
        { path: 'layout', component: LayoutEditor },
        { path: 'content', component: ContentManagement },
        { path: 'templates', component: TemplateGallery },
        { path: 'preview', component: PreviewAndExport },
        { path: 'analytics', component: Analytics },
        { path: 'profile', component: UserProfile }
      ]
    }
  ]
});

export default router;
