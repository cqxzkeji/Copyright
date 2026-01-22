<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="logo-block">
        <div class="logo">AG</div>
        <div>
          <h1>农业机械动力支撑架</h1>
          <p>优化设计平台</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/main/param">参数建模</router-link>
        <router-link to="/main/check">强度校核</router-link>
        <router-link to="/main/optimize">结构优化</router-link>
        <router-link to="/main/simulate">仿真验证</router-link>
        <router-link to="/main/report">报告输出</router-link>
      </nav>
      <div class="sidebar-footer">
        <div>
          <strong>当前用户</strong>
          <p>工程师：农机设计组</p>
        </div>
        <router-link class="logout" to="/login">退出登录</router-link>
      </div>
    </aside>
    <section class="content-area">
      <header class="topbar">
        <div>
          <h2>农业机械动力支撑架优化软件</h2>
          <span>亮色 · 自适应布局 · 模块化设计</span>
        </div>
        <div class="status">
          <div>
            <p>项目代号</p>
            <strong>AGB-2024</strong>
          </div>
          <div>
            <p>协同进度</p>
            <strong>78%</strong>
          </div>
        </div>
      </header>
      <main class="module-area">
        <router-view />
      </main>
    </section>
  </div>
</template>

<style scoped>
.main-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid var(--border);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
  display: grid;
  place-items: center;
}

.logo-block h1 {
  font-size: 16px;
  margin: 0;
}

.logo-block p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu a {
  text-decoration: none;
  color: var(--text);
  padding: 10px 14px;
  border-radius: 12px;
  transition: 0.2s ease;
  background: transparent;
}

.menu a.router-link-active {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 600;
}

.menu a:hover {
  background: #f1f5ff;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
}

.sidebar-footer p {
  margin: 4px 0 0;
  color: var(--muted);
}

.logout {
  color: #f05f5f;
  text-decoration: none;
  font-weight: 600;
}

.content-area {
  display: flex;
  flex-direction: column;
  padding: 24px 28px;
  gap: 20px;
}

.topbar {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
  flex-wrap: wrap;
  gap: 16px;
}

.topbar h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.topbar span {
  color: var(--muted);
  font-size: 13px;
}

.status {
  display: flex;
  gap: 24px;
  font-size: 13px;
  color: var(--muted);
}

.status strong {
  display: block;
  font-size: 18px;
  color: var(--text);
}

.module-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 960px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
