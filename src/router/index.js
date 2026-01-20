import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import DataIngest from '../views/DataIngest.vue';
import StreamCompute from '../views/StreamCompute.vue';
import Storage from '../views/Storage.vue';
import Visualization from '../views/Visualization.vue';
import Monitor from '../views/Monitor.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/ingest',
    children: [
      { path: 'ingest', name: 'DataIngest', component: DataIngest },
      { path: 'compute', name: 'StreamCompute', component: StreamCompute },
      { path: 'storage', name: 'Storage', component: Storage },
      { path: 'visualization', name: 'Visualization', component: Visualization },
      { path: 'monitor', name: 'Monitor', component: Monitor }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
