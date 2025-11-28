<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">协同机械臂</div>
      <nav class="menu">
        <RouterLink to="/app/robot-control" class="menu-item" active-class="active">机器人控制</RouterLink>
        <RouterLink to="/app/motion-planning" class="menu-item" active-class="active">运动规划</RouterLink>
        <RouterLink to="/app/coordination" class="menu-item" active-class="active">协同调度</RouterLink>
        <RouterLink to="/app/data-analysis" class="menu-item" active-class="active">数据分析</RouterLink>
        <RouterLink to="/app/system-management" class="menu-item" active-class="active">系统管理</RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <div class="crumb">自适应多维协同机器臂精准控制软件</div>
          <small>亮色界面 · 自适应布局 · 模块化装载</small>
        </div>
        <div class="user">
          <div class="avatar">LC</div>
          <div>
            <div class="highlight">云端控制中心</div>
            <small>超级管理员</small>
          </div>
        </div>
      </header>
      <section class="module">
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
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 4px 0 24px rgba(15, 23, 42, 0.06);
}

.logo {
  font-weight: 800;
  font-size: 20px;
  color: #0f172a;
  letter-spacing: 0.5px;
}

.menu {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #475569;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
  background: #f8fafc;
  border: 1px solid transparent;
}

.menu-item:hover,
.menu-item.active {
  color: #0f172a;
  background: #e0ebff;
  border-color: #bfdbfe;
}

.content {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topbar {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.crumb {
  font-weight: 800;
  color: #0f172a;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.module {
  display: block;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  .menu {
    grid-template-columns: repeat(5, minmax(140px, 1fr));
  }
}
</style>
