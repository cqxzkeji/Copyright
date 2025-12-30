<template>
  <div class="layout">
    <aside class="sidebar">
      <div>
        <h2>主控面板</h2>
        <p style="margin:4px 0 12px;color:#5f6a7a">五大模块快速切换</p>
      </div>
      <RouterLink class="nav-link" to="/main/patient">患者与影像</RouterLink>
      <RouterLink class="nav-link" to="/main/target">靶点勾画</RouterLink>
      <RouterLink class="nav-link" to="/main/optimize">遗传优化</RouterLink>
      <RouterLink class="nav-link" to="/main/dose">剂量评估</RouterLink>
      <RouterLink class="nav-link" to="/main/export">计划导出</RouterLink>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
