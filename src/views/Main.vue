<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">CS</div>
        <div>
          <div class="title">座椅设计管理</div>
          <div class="subtitle">Engineering Suite</div>
        </div>
      </div>
      <nav class="nav">
        <RouterLink to="/main/project" class="nav-item">项目管理</RouterLink>
        <RouterLink to="/main/requirement" class="nav-item">需求标准</RouterLink>
        <RouterLink to="/main/design" class="nav-item">设计配置</RouterLink>
        <RouterLink to="/main/verify" class="nav-item">验证管理</RouterLink>
        <RouterLink to="/main/change" class="nav-item">变更归档</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span>亮色自适应布局</span>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div>
          <h2>汽车座椅工程设计管理系统</h2>
          <p>集成项目、需求、设计、验证、变更全流程管理。</p>
        </div>
        <div class="topbar-actions">
          <div class="status">
            <strong>当前用户</strong>
            <span>座椅工程师</span>
          </div>
          <RouterLink to="/login" class="ghost">退出登录</RouterLink>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 220px;
  background: #ffffff;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-right: 1px solid #e2e8f0;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #38bdf8, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
}

.title {
  font-weight: 700;
}

.subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 12px;
  color: #475569;
  font-weight: 600;
}

.nav-item.router-link-active {
  background: #e0f2fe;
  color: #0369a1;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #94a3b8;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 24px 30px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.topbar h2 {
  margin: 0;
}

.topbar p {
  margin: 6px 0 0;
  color: #64748b;
}

.topbar-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.status {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #475569;
}

.ghost {
  padding: 8px 14px;
  border-radius: 10px;
  background: #e2e8f0;
  color: #334155;
  font-weight: 600;
}

.content {
  padding: 10px 30px 30px;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    align-items: center;
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
