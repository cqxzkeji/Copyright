import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import DeviceControl from '../views/DeviceControl.vue';
import MotionPlanning from '../views/MotionPlanning.vue';
import AdaptiveControl from '../views/AdaptiveControl.vue';
import OperationMonitoring from '../views/OperationMonitoring.vue';
import DataAnalysis from '../views/DataAnalysis.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/main',
      component: Main,
      children: [
        {
          path: '',
          redirect: '/main/device'
        },
        {
          path: 'device',
          component: DeviceControl
        },
        {
          path: 'motion',
          component: MotionPlanning
        },
        {
          path: 'adaptive',
          component: AdaptiveControl
        },
        {
          path: 'monitoring',
          component: OperationMonitoring
        },
        {
          path: 'analysis',
          component: DataAnalysis
        }
      ]
    }
  ]
});

export default router;
