import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import ProjectCenter from "../views/ProjectCenter.vue";
import DataCollection from "../views/DataCollection.vue";
import AnalysisDiagnosis from "../views/AnalysisDiagnosis.vue";
import SimulationCalibration from "../views/SimulationCalibration.vue";
import OptimizationTasks from "../views/OptimizationTasks.vue";
import ReportKnowledge from "../views/ReportKnowledge.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/main",
    component: Main,
    redirect: "/main/project-center",
    children: [
      {
        path: "project-center",
        name: "ProjectCenter",
        component: ProjectCenter
      },
      {
        path: "data-collection",
        name: "DataCollection",
        component: DataCollection
      },
      {
        path: "analysis-diagnosis",
        name: "AnalysisDiagnosis",
        component: AnalysisDiagnosis
      },
      {
        path: "simulation-calibration",
        name: "SimulationCalibration",
        component: SimulationCalibration
      },
      {
        path: "optimization-tasks",
        name: "OptimizationTasks",
        component: OptimizationTasks
      },
      {
        path: "report-knowledge",
        name: "ReportKnowledge",
        component: ReportKnowledge
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
