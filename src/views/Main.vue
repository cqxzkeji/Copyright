<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">CutPro</div>
        <span>高精度切割控制</span>
      </div>
      <nav class="menu">
        <RouterLink to="/main/device" class="menu-item">设备接入与参数配置</RouterLink>
        <RouterLink to="/main/task" class="menu-item">任务编排与路径规划</RouterLink>
        <RouterLink to="/main/process" class="menu-item">运动控制与过程执行</RouterLink>
        <RouterLink to="/main/monitor" class="menu-item">在线监测与质量保障</RouterLink>
        <RouterLink to="/main/analytics" class="menu-item">数据统计与系统管理</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <p>当前班组：白班 A 组</p>
        <p>设备在线：8 / 8</p>
      </div>
    </aside>
    <div class="content-area">
      <header class="topbar">
        <div class="status-group">
          <span class="status-chip online">系统运行中</span>
          <span class="status-chip">主控版本 V5.2.1</span>
          <span class="status-chip">环境温度 23.8℃</span>
        </div>
        <div class="user">
          <span>操作员：王工</span>
          <RouterLink to="/" class="logout">退出</RouterLink>
        </div>
      </header>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.main-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--card);
  border-right: 1px solid var(--border);
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: grid;
  gap: 8px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
}

.menu {
  display: grid;
  gap: 12px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  color: var(--muted);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.menu-item.router-link-active {
  color: var(--primary);
  background: var(--primary-soft);
  border-color: #d7e4ff;
  font-weight: 600;
}

.menu-item:hover {
  background: #f5f6ff;
}

.sidebar-footer {
  margin-top: auto;
  color: var(--muted);
  font-size: 13px;
  display: grid;
  gap: 6px;
}

.content-area {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.status-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.status-chip {
  background: #f3f4f6;
  color: var(--muted);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.status-chip.online {
  background: #e8f7f1;
  color: #11845e;
}

.user {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
}

.logout {
  background: #fff1f1;
  color: #ef4444;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.main-content {
  padding: 24px;
  flex: 1;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 220px 1fr;
  }
}

@media (max-width: 860px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    height: auto;
  }
}
</style>
