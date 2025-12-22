import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import routes from './router/index.js';

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

createApp(App).use(router).mount('#app');
