<template>
  <RouterView v-if="isLogin" />
  <div v-else class="app-shell">
    <header class="top-bar">
      <div class="title">集中供水与污水处理全过程监控管理平台</div>
      <div>值班员：王安 | 今日告警 3 项</div>
    </header>
    <div class="main-layout">
      <nav class="sidebar">
        <RouterLink class="nav-item" :class="navClass('/app')" to="/app">
          综合监控总览
        </RouterLink>
        <RouterLink
          class="nav-item"
          :class="navClass('/app/water-supply')"
          to="/app/water-supply"
        >
          水源与供水设施监控
        </RouterLink>
        <RouterLink
          class="nav-item"
          :class="navClass('/app/water-quality')"
          to="/app/water-quality"
        >
          水质在线监测与预警
        </RouterLink>
        <RouterLink
          class="nav-item"
          :class="navClass('/app/sewage-process')"
          to="/app/sewage-process"
        >
          污水处理过程监控
        </RouterLink>
        <RouterLink
          class="nav-item"
          :class="navClass('/app/analytics')"
          to="/app/analytics"
        >
          数据分析与运行评估
        </RouterLink>
        <RouterLink
          class="nav-item"
          :class="navClass('/app/maintenance')"
          to="/app/maintenance"
        >
          运维管理与应急调度
        </RouterLink>
      </nav>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isLogin = computed(() => route.path === "/login");

const navClass = (path) => {
  if (route.path === path) {
    return "active";
  }
  if (path !== "/app" && route.path.startsWith(path)) {
    return "active";
  }
  return "";
};
</script>
