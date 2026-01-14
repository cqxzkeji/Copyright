import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import DeviceAccess from "../views/DeviceAccess.vue";
import ImageDetection from "../views/ImageDetection.vue";
import ConditionAssessment from "../views/ConditionAssessment.vue";
import AlarmWorkorder from "../views/AlarmWorkorder.vue";
import AnalyticsReport from "../views/AnalyticsReport.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/main",
      component: Main,
      redirect: "/main/device",
      children: [
        { path: "device", component: DeviceAccess },
        { path: "image", component: ImageDetection },
        { path: "assessment", component: ConditionAssessment },
        { path: "alarm", component: AlarmWorkorder },
        { path: "analytics", component: AnalyticsReport },
      ],
    },
  ],
});

export default router;
