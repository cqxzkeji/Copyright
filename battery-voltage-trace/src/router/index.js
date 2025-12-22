import Login from '../views/Login.vue';
import DeviceManage from '../views/DeviceManage.vue';
import ConnectManage from '../views/ConnectManage.vue';
import DataTrace from '../views/DataTrace.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/device',
    name: 'DeviceManage',
    component: DeviceManage
  },
  {
    path: '/connect',
    name: 'ConnectManage',
    component: ConnectManage
  },
  {
    path: '/trace',
    name: 'DataTrace',
    component: DataTrace
  }
];

export default routes;
