<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">ARM</div>
        <div>
          <h2>精准控制平台</h2>
          <p>多臂协同系统</p>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/main/device" class="menu-item">设备接入与管理</RouterLink>
        <RouterLink to="/main/motion" class="menu-item">运动控制与轨迹规划</RouterLink>
        <RouterLink to="/main/collaboration" class="menu-item">多臂协同与自适应控制</RouterLink>
        <RouterLink to="/main/monitor" class="menu-item">运行监控与安全防护</RouterLink>
        <RouterLink to="/main/analysis" class="menu-item">数据分析与优化决策</RouterLink>
      </nav>
      <div class="status-card">
        <div>
          <strong>系统状态</strong>
          <p>在线设备 18 台 · 关键任务 6 项</p>
        </div>
        <span class="badge">运行中</span>
      </div>
    </aside>

    <main class="content">
      <header class="topbar">
        <div>
          <h1>自适应多维协同机器臂精准控制软件</h1>
          <p>多维协同、实时监控、智能优化</p>
        </div>
        <div class="topbar-stats">
          <div>
            <span>执行精度</span>
            <strong>99.82%</strong>
          </div>
          <div>
            <span>当前负载</span>
            <strong>68%</strong>
          </div>
        </div>
      </header>
      <section class="module-container">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  background: #2563eb;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #1e293b;
  font-size: 14px;
  transition: 0.2s;
}

.menu-item.router-link-active {
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

.status-card {
  margin-top: auto;
  padding: 16px;
  border-radius: 14px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
}

.badge {
  background: #22c55e;
  color: white;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.content {
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  padding: 24px 32px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.topbar h1 {
  font-size: 22px;
  margin-bottom: 6px;
}

.topbar-stats {
  display: flex;
  gap: 16px;
}

.topbar-stats div {
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 8px 24px rgba(148, 163, 184, 0.2);
  min-width: 120px;
  display: grid;
  gap: 4px;
  text-align: right;
}

.module-container {
  padding: 0 32px 32px;
}

@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 5;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .menu-item {
    font-size: 12px;
  }
}
</style>
