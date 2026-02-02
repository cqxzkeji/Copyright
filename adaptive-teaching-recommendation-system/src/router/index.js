import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import DataCollection from "../views/DataCollection.vue";
import Diagnostic from "../views/Diagnostic.vue";
import Recommendation from "../views/Recommendation.vue";
import Dashboard from "../views/Dashboard.vue";
import Security from "../views/Security.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login,
    meta: {
      layout: "auth"
    }
  },
  {
    path: "/data",
    component: DataCollection,
    meta: {
      title: "数据采集与多模态处理",
      subtitle: "实时汇聚视频、音频与传感器信号"
    }
  },
  {
    path: "/diagnostic",
    component: Diagnostic,
    meta: {
      title: "诊断与分析",
      subtitle: "定位课堂关键瓶颈与注意力波动"
    }
  },
  {
    path: "/recommendation",
    component: Recommendation,
    meta: {
      title: "自适应优化推荐",
      subtitle: "生成个性化优化方案与互动策略"
    }
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      title: "结果展示与反馈",
      subtitle: "课堂效果可视化与动态反馈"
    }
  },
  {
    path: "/security",
    component: Security,
    meta: {
      title: "数据存储与安全管理",
      subtitle: "数据治理、审计与权限合规"
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
