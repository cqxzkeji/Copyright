<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">地下室验收</div>
      <nav>
        <router-link to="/main/tasks">验收任务管理</router-link>
        <router-link to="/main/records">验收记录与问题跟踪</router-link>
        <router-link to="/main/standards">验收标准与清单</router-link>
        <router-link to="/main/statistics">数据统计与分析</router-link>
        <router-link to="/main/settings">系统配置与权限管理</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h1 class="header-title">公共区域装修验收跟踪系统</h1>
          <p class="subtle">地下室及裙楼公区 | 自适应亮色界面</p>
        </div>
        <div class="badge">V1.0</div>
      </header>
      <section class="module-area">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #2563eb, #22d3ee);
  color: white;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand {
  font-size: 20px;
  font-weight: 800;
}

nav {
  display: grid;
  gap: 12px;
}

nav a {
  color: white;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  font-weight: 600;
}

nav a.router-link-active {
  background: white;
  color: #2563eb;
}

.content {
  padding: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.module-area {
  display: block;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    overflow-x: auto;
  }

  nav {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    align-items: center;
  }
}
</style>
