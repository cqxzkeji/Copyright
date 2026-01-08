import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import DataIngestion from "../views/DataIngestion.vue";
import EmissionBoundary from "../views/EmissionBoundary.vue";
import SimulationAssimilation from "../views/SimulationAssimilation.vue";
import ForecastWarning from "../views/ForecastWarning.vue";
import EvaluationDecision from "../views/EvaluationDecision.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/main",
      component: Main,
      redirect: "/main/data",
      children: [
        {
          path: "data",
          name: "DataIngestion",
          component: DataIngestion,
          meta: { title: "多源数据采集与接入" },
        },
        {
          path: "emission",
          name: "EmissionBoundary",
          component: EmissionBoundary,
          meta: { title: "排放与边界条件管理" },
        },
        {
          path: "simulation",
          name: "SimulationAssimilation",
          component: SimulationAssimilation,
          meta: { title: "污染过程模拟与同化校正" },
        },
        {
          path: "forecast",
          name: "ForecastWarning",
          component: ForecastWarning,
          meta: { title: "预报发布与预警联动" },
        },
        {
          path: "evaluation",
          name: "EvaluationDecision",
          component: EvaluationDecision,
          meta: { title: "评估分析与可视化决策" },
        },
      ],
    },
  ],
});

export default router;
