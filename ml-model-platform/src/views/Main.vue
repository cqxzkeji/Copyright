<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">ML</div>
        <div>
          <p class="title">训练管理平台</p>
          <span class="subtitle">v2.4 生产版</span>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/main/data" class="menu-item">数据管理与特征工程</RouterLink>
        <RouterLink to="/main/training" class="menu-item">模型训练与算法管理</RouterLink>
        <RouterLink to="/main/evaluation" class="menu-item">模型评估与性能分析</RouterLink>
        <RouterLink to="/main/deploy" class="menu-item">模型部署与版本控制</RouterLink>
        <RouterLink to="/main/monitor" class="menu-item">实验管理与系统监控</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <p>今日资源配额：88%</p>
        <div class="quota">
          <div class="quota-bar" />
        </div>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>机器学习模型训练与管理平台</h2>
          <p>统一接入、标准训练、可视化评估与稳定部署</p>
        </div>
        <div class="user">
          <span class="badge">在线</span>
          <div class="avatar">AI</div>
        </div>
      </header>
      <section class="module">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #0f172a;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 28px;
  flex-shrink: 0;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #38bdf8;
  color: #0f172a;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 12px;
  color: #e2e8f0;
  text-decoration: none;
  background: rgba(148, 163, 184, 0.08);
  font-size: 14px;
  transition: 0.2s ease;
}

.menu-item.router-link-active {
  background: #2563eb;
  color: #fff;
}

.menu-item:hover {
  background: rgba(59, 130, 246, 0.3);
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #cbd5f5;
}

.quota {
  background: rgba(148, 163, 184, 0.25);
  border-radius: 10px;
  height: 8px;
  margin-top: 8px;
  overflow: hidden;
}

.quota-bar {
  width: 88%;
  height: 100%;
  background: #38bdf8;
}

.content {
  flex: 1;
  padding: 28px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.topbar h2 {
  margin: 0;
  font-size: 22px;
}

.topbar p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  background: #22c55e;
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  background: #dbeafe;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #2563eb;
  font-weight: 600;
}

.module {
  flex: 1;
}

@media (max-width: 1100px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .sidebar-footer {
    width: 100%;
  }
}

@media (max-width: 720px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .menu {
    width: 100%;
  }
}
</style>
