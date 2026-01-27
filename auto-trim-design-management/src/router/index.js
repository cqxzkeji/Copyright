import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import ProjectPlatform from '../views/ProjectPlatform.vue';
import PartDesignBOM from '../views/PartDesignBOM.vue';
import ChangeReview from '../views/ChangeReview.vue';
import PrototypeValidation from '../views/PrototypeValidation.vue';
import SupplierArchive from '../views/SupplierArchive.vue';

const routes = [
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
    redirect: '/main/project',
    children: [
      {
        path: 'project',
        component: ProjectPlatform,
        meta: { title: '项目与车型平台管理' }
      },
      {
        path: 'parts',
        component: PartDesignBOM,
        meta: { title: '内外饰零部件设计与BOM管理' }
      },
      {
        path: 'change',
        component: ChangeReview,
        meta: { title: '变更与评审签审流程' }
      },
      {
        path: 'prototype',
        component: PrototypeValidation,
        meta: { title: '试制验证与问题闭环' }
      },
      {
        path: 'supplier',
        component: SupplierArchive,
        meta: { title: '供应商协同与资料归档' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
