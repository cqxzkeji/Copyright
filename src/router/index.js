import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import SpeechRecognition from '../views/SpeechRecognition.vue';
import Translation from '../views/Translation.vue';
import MultiModalInput from '../views/MultiModalInput.vue';
import UserSettings from '../views/UserSettings.vue';
import SpeechFeedback from '../views/SpeechFeedback.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { layout: 'auth' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/speech-recognition',
    name: 'SpeechRecognition',
    component: SpeechRecognition
  },
  {
    path: '/translation',
    name: 'Translation',
    component: Translation
  },
  {
    path: '/multi-modal',
    name: 'MultiModalInput',
    component: MultiModalInput
  },
  {
    path: '/user-settings',
    name: 'UserSettings',
    component: UserSettings
  },
  {
    path: '/speech-feedback',
    name: 'SpeechFeedback',
    component: SpeechFeedback
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
