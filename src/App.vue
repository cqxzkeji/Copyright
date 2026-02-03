<template>
  <div v-if="isAuthLayout" class="app-layout">
    <aside class="sidebar">
      <h2>消防设备平台</h2>
      <nav class="nav-list">
        <RouterLink class="nav-link" to="/dashboard">运行总览</RouterLink>
        <RouterLink class="nav-link" to="/monitoring">设备运行监控</RouterLink>
        <RouterLink class="nav-link" to="/faults">故障与报警管理</RouterLink>
        <RouterLink class="nav-link" to="/maintenance">维护保养管理</RouterLink>
        <RouterLink class="nav-link" to="/analysis">历史数据分析</RouterLink>
        <RouterLink class="nav-link" to="/users">权限管理与审计</RouterLink>
      </nav>
    </aside>
    <main class="main-content">
      <div class="top-bar">
        <h1>消防设备运行监控与维护管理平台</h1>
        <button class="btn secondary" @click="logout">退出登录</button>
      </div>
      <RouterView />
    </main>
  </div>
  <RouterView v-else />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter, RouterView, RouterLink } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isAuthLayout = computed(() => route.meta.layout !== 'auth');

const logout = () => {
  localStorage.removeItem('fire-platform-auth');
  router.push('/login');
};
</script>
