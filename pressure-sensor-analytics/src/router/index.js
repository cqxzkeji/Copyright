import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import DeviceAccess from "../views/DeviceAccess.vue";
import DataAcquisition from "../views/DataAcquisition.vue";
import RealtimeMonitoring from "../views/RealtimeMonitoring.vue";
import IntelligentAnalysis from "../views/IntelligentAnalysis.vue";
import ReportSystem from "../views/ReportSystem.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/main",
      component: Main,
      redirect: "/main/device",
      children: [
        { path: "device", component: DeviceAccess },
        { path: "acquisition", component: DataAcquisition },
        { path: "monitoring", component: RealtimeMonitoring },
        { path: "analysis", component: IntelligentAnalysis },
        { path: "report", component: ReportSystem }
      ]
    }
  ]
});

export default router;
