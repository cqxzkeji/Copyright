<template>
  <div v-if="isLogin" class="login-wrapper">
    <router-view />
  </div>
  <div v-else class="app-shell">
    <aside class="sidebar">
      <h1>光学扫描分析平台</h1>
      <nav class="nav-links">
        <RouterLink to="/dashboard">主控制面板</RouterLink>
        <RouterLink to="/data-collection">光学扫描采集</RouterLink>
        <RouterLink to="/data-processing">数据处理优化</RouterLink>
        <RouterLink to="/3d-modeling">3D建模可视化</RouterLink>
        <RouterLink to="/optical-analysis">光学性能分析</RouterLink>
        <RouterLink to="/report-generation">报告生成导出</RouterLink>
      </nav>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isLogin = computed(() => route.name === "login");
</script>
