import { createRouter, createWebHistory } from 'vue-router';

const Login = () => import('../views/Login.vue');
const Dashboard = () => import('../views/Dashboard.vue');
const WasteRegistration = () => import('../views/WasteRegistration.vue');
const TransportManagement = () => import('../views/TransportManagement.vue');
const StorageManagement = () => import('../views/StorageManagement.vue');
const ComplianceReport = () => import('../views/ComplianceReport.vue');
const Analytics = () => import('../views/Analytics.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          redirect: '/dashboard/waste-registration'
        },
        {
          path: 'waste-registration',
          name: 'waste-registration',
          component: WasteRegistration,
          meta: { title: '废物登记与分类管理' }
        },
        {
          path: 'transport',
          name: 'transport',
          component: TransportManagement,
          meta: { title: '运输与转移管理' }
        },
        {
          path: 'storage',
          name: 'storage',
          component: StorageManagement,
          meta: { title: '仓储管理与库存监控' }
        },
        {
          path: 'compliance',
          name: 'compliance',
          component: ComplianceReport,
          meta: { title: '合规性与监管报告' }
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: Analytics,
          meta: { title: '数据分析与可视化' }
        }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  const authed = window.localStorage.getItem('hwms-authed');
  if (to.name !== 'login' && !authed) {
    next({ name: 'login' });
  } else if (to.name === 'login' && authed) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
