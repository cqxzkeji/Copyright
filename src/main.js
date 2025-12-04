import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './styles.css';

const app = createApp(App);
const authState = reactive({ isAuthenticated: !!localStorage.getItem('authToken') });

app.provide('authState', authState);
app.use(router(authState));
app.mount('#app');
