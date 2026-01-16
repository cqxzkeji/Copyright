<template>
  <div class="app-shell">
    <aside class="sidebar">
      <h2>集群管理平台</h2>
      <nav class="nav-list">
        <RouterLink class="nav-item" to="/main/resource">资源接入与资产</RouterLink>
        <RouterLink class="nav-item" to="/main/jobs">作业调度与队列</RouterLink>
        <RouterLink class="nav-item" to="/main/monitoring">运行监控与告警</RouterLink>
        <RouterLink class="nav-item" to="/main/billing">权限与计费核算</RouterLink>
        <RouterLink class="nav-item" to="/main/ops">运维工单与审计</RouterLink>
      </nav>
    </aside>
    <div class="main-area">
      <header class="topbar">
        <div class="title">统一管理控制台</div>
        <div class="badge">在线 · {{ currentUser }}</div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentUser = ref('管理员 | 科研计算中心');
</script>
