import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import CourseManagement from '../views/CourseManagement.vue';
import SpacePlanning from '../views/SpacePlanning.vue';
import DataCollection from '../views/DataCollection.vue';
import UserExperience from '../views/UserExperience.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
  { path: '/', name: 'login', component: Login },
  {
    path: '/app',
    component: MainLayout,
    children: [
      { path: 'course', component: CourseManagement },
      { path: 'planning', component: SpacePlanning },
      { path: 'data', component: DataCollection },
      { path: 'experience', component: UserExperience },
      { path: 'admin', component: AdminDashboard },
      { path: '', redirect: 'course' }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
