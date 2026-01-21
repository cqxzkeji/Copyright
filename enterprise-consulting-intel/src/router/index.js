import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import Intake from "../views/Intake.vue";
import ParsingKnowledge from "../views/ParsingKnowledge.vue";
import IntelligenceJudge from "../views/IntelligenceJudge.vue";
import WorkflowCase from "../views/WorkflowCase.vue";
import AnalyticsReport from "../views/AnalyticsReport.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/main",
      component: Main,
      redirect: "/main/intake",
      children: [
        { path: "intake", component: Intake },
        { path: "parsing", component: ParsingKnowledge },
        { path: "judge", component: IntelligenceJudge },
        { path: "workflow", component: WorkflowCase },
        { path: "analytics", component: AnalyticsReport }
      ]
    }
  ]
});

export default router;
