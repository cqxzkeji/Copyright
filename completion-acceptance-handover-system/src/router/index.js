import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import AcceptancePlan from "../views/AcceptancePlan.vue";
import AcceptanceProcess from "../views/AcceptanceProcess.vue";
import Rectification from "../views/Rectification.vue";
import HandoverCertificate from "../views/HandoverCertificate.vue";
import ArchiveAnalysis from "../views/ArchiveAnalysis.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/dashboard", component: Dashboard },
    { path: "/acceptance-plan", component: AcceptancePlan },
    { path: "/acceptance-process", component: AcceptanceProcess },
    { path: "/rectification", component: Rectification },
    { path: "/handover-certificate", component: HandoverCertificate },
    { path: "/archive-analysis", component: ArchiveAnalysis }
  ]
});

export default router;
