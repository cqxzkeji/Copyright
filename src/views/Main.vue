<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">联合验收系统</div>
      <nav class="menu">
        <router-link to="/main/project" class="menu-item">项目管理</router-link>
        <router-link to="/main/inspection" class="menu-item">验收计划</router-link>
        <router-link to="/main/rectification" class="menu-item">现场验收</router-link>
        <router-link to="/main/coordination" class="menu-item">部门协同</router-link>
        <router-link to="/main/report" class="menu-item">结果归档</router-link>
      </nav>
      <div class="sidebar-footer">亮色 · 自适应布局</div>
    </aside>
    <main class="content">
      <header class="header">
        <div>
          <div class="header-title">商业楼宇多业态工程竣工联合验收管理系统</div>
          <div class="header-sub">主界面加载功能模块到内容窗口，支持多部门协同验收。</div>
        </div>
        <div class="header-meta">
          <div class="badge">在线人数 28</div>
          <div class="badge">今日任务 12</div>
        </div>
      </header>
      <section class="module">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo {
  font-weight: 700;
  font-size: 18px;
  color: #2563eb;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #475569;
  font-weight: 500;
}

.menu-item.router-link-active {
  background: #eff6ff;
  color: #1d4ed8;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #94a3b8;
}

.content {
  flex: 1;
  padding: 24px 32px 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}

.header-sub {
  color: #64748b;
  font-size: 14px;
}

.header-meta {
  display: flex;
  gap: 10px;
}

.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    padding: 20px;
  }
}
</style>
