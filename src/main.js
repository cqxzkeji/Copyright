import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const authState = reactive({
  loggedIn: Boolean(localStorage.getItem('loggedIn')),
  user: localStorage.getItem('user') || '',
});

const app = createApp(App);
app.provide('auth', authState);
app.use(router);
app.mount('#app');
