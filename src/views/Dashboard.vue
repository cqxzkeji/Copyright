<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="logo">智慧农业管理</div>
      <div class="badge">实时监测中</div>
      <nav class="nav-group">
        <router-link to="/app/data" class="nav-item" :class="{ active: isActive('/app/data') }">
          📡 数据采集管理
        </router-link>
        <router-link to="/app/production" class="nav-item" :class="{ active: isActive('/app/production') }">
          🌱 生产管理
        </router-link>
        <router-link to="/app/resource" class="nav-item" :class="{ active: isActive('/app/resource') }">
          🚜 资源管理
        </router-link>
        <router-link to="/app/analysis" class="nav-item" :class="{ active: isActive('/app/analysis') }">
          📈 分析决策
        </router-link>
        <router-link to="/app/system" class="nav-item" :class="{ active: isActive('/app/system') }">
          ⚙️ 系统运行
        </router-link>
      </nav>
      <div style="margin-top: auto; color: var(--muted); font-size: 13px;">
        当前用户：管理员
      </div>
    </aside>
    <div class="main-content">
      <header class="topbar">
        <div style="font-size: 18px; font-weight: 700;">智慧农业管理系统控制台</div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="chip">在线设备 86</span>
          <button class="button-secondary" type="button" @click="logout">退出登录</button>
        </div>
      </header>
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isActive = (path) => route.path === path;

const logout = () => {
  router.push('/login');
};
</script>
