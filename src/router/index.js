import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import MainLayout from "../views/MainLayout.vue";
import DataCollection from "../views/DataCollection.vue";
import FeatureExtraction from "../views/FeatureExtraction.vue";
import ModelOptimization from "../views/ModelOptimization.vue";
import AnomalyDetection from "../views/AnomalyDetection.vue";
import ResultVisualization from "../views/ResultVisualization.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: LoginView },
    {
      path: "/app",
      component: MainLayout,
      redirect: "/app/data-collection",
      children: [
        { path: "data-collection", component: DataCollection },
        { path: "feature-extraction", component: FeatureExtraction },
        { path: "model-optimization", component: ModelOptimization },
        { path: "anomaly-detection", component: AnomalyDetection },
        { path: "result-visualization", component: ResultVisualization }
      ]
    }
  ]
});

export default router;
