import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Supply from '../views/Supply.vue';
import Product from '../views/Product.vue';
import Order from '../views/Order.vue';
import Operation from '../views/Operation.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/main',
    component: Main,
    children: [
      {
        path: '',
        redirect: '/main/dashboard'
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'supply',
        name: 'supply',
        component: Supply
      },
      {
        path: 'product',
        name: 'product',
        component: Product
      },
      {
        path: 'order',
        name: 'order',
        component: Order
      },
      {
        path: 'operation',
        name: 'operation',
        component: Operation
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
