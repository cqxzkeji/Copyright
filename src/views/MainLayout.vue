<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div>
        <h1>数据库智能运维</h1>
        <p style="color: #6b7280; margin-top: 6px; font-size: 13px;">五大模块统一控制</p>
      </div>
      <nav class="nav-links">
        <router-link class="nav-link" to="/app/database-management">数据库管理<span>01</span></router-link>
        <router-link class="nav-link" to="/app/performance-monitoring">性能监控<span>02</span></router-link>
        <router-link class="nav-link" to="/app/data-security">数据安全<span>03</span></router-link>
        <router-link class="nav-link" to="/app/automation">自动化运维<span>04</span></router-link>
        <router-link class="nav-link" to="/app/visualization">可视化展示<span>05</span></router-link>
      </nav>
      <div class="card">
        <p style="font-weight: 600;">当前环境</p>
        <p style="margin-top: 8px; color: #475569;">生产集群 · 华北 1 区</p>
      </div>
    </aside>
    <div class="main-content">
      <header class="topbar">
        <div>
          <p style="font-weight: 600;">欢迎回来，系统管理员</p>
          <p style="color: #6b7280; font-size: 13px;">今日数据库运行平稳，已启用智能巡检。</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: 600;">安全级别：高</p>
          <p style="color: #6b7280; font-size: 13px;">最近同步：{{ now }}</p>
        </div>
      </header>
      <main class="content-wrapper">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const now = ref(new Date().toLocaleString());
setInterval(() => {
  now.value = new Date().toLocaleString();
}, 10000);
</script>
