<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">智能多参数测量系统</div>
      <nav class="nav-links">
        <RouterLink to="/app/device">设备管理</RouterLink>
        <RouterLink to="/app/realtime">实时数据显示</RouterLink>
        <RouterLink to="/app/record">数据保存</RouterLink>
        <RouterLink to="/app/history">历史数据</RouterLink>
      </nav>
      <div class="meta">
        当前账号：管理员 · 亮色模式已启用
      </div>
    </aside>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
