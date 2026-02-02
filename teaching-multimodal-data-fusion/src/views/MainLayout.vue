<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">多模态融合平台</div>
      <nav class="menu">
        <RouterLink class="menu-item" to="/app/data-collection">数据采集与预处理</RouterLink>
        <RouterLink class="menu-item" to="/app/data-fusion">数据融合与分析</RouterLink>
        <RouterLink class="menu-item" to="/app/adaptive-optimization">自适应优化</RouterLink>
        <RouterLink class="menu-item" to="/app/visualization">可视化展示与反馈</RouterLink>
        <RouterLink class="menu-item" to="/app/system-management">系统管理与安全</RouterLink>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <div class="topbar-title">教学场景多模态数据自适应融合处理系统</div>
          <div class="topbar-subtitle">统一调度 · 实时感知 · 自适应优化</div>
        </div>
        <div class="topbar-actions">
          <span class="user">管理员</span>
          <button class="btn ghost" type="button" @click="logout">退出</button>
        </div>
      </header>
      <section class="content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.setItem('tm_logged_in', 'false');
  router.push('/login');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e4e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  font-weight: 700;
  font-size: 18px;
  color: #2b4c9c;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 600;
  color: #3c4b6b;
}

.menu-item.router-link-active {
  background: #eef3ff;
  color: #2b5bd7;
}

.main {
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e4e8f0;
}

.topbar-title {
  font-weight: 700;
}

.topbar-subtitle {
  font-size: 12px;
  color: #6c7a94;
  margin-top: 4px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user {
  font-weight: 600;
  color: #2b4c9c;
}

.content {
  flex: 1;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    height: auto;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
