import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import DeviceAccess from "../views/DeviceAccess.vue";
import MotionOrchestration from "../views/MotionOrchestration.vue";
import CalibrationMonitor from "../views/CalibrationMonitor.vue";
import AlarmMaintenance from "../views/AlarmMaintenance.vue";
import AnalyticsAuth from "../views/AnalyticsAuth.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/main",
    component: Main,
    redirect: "/main/device",
    children: [
      { path: "device", component: DeviceAccess },
      { path: "motion", component: MotionOrchestration },
      { path: "calibration", component: CalibrationMonitor },
      { path: "alarm", component: AlarmMaintenance },
      { path: "analytics", component: AnalyticsAuth }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
