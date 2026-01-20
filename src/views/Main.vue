<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">FV</div>
        <div>
          <h2>果蔬平台</h2>
          <span>智能种植中心</span>
        </div>
      </div>
      <nav>
        <RouterLink to="/main/monitor" class="nav-item">环境监测展示</RouterLink>
        <RouterLink to="/main/control" class="nav-item">智能调控控制</RouterLink>
        <RouterLink to="/main/warning" class="nav-item">生长预警分析</RouterLink>
        <RouterLink to="/main/management" class="nav-item">环境数据采集</RouterLink>
        <RouterLink to="/main/system-setting" class="nav-item">系统配置与基础管理</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span class="badge">在线设备 86</span>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h1>果蔬栽培环境监测与智能调控平台</h1>
          <p>实时环境数据与设备调控全景概览</p>
        </div>
        <div class="user">
          <div class="avatar">管</div>
          <div>
            <strong>管理员</strong>
            <p>东区示范基地</p>
          </div>
        </div>
      </header>
      <section class="content-body">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid var(--border);
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sidebar-header .logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.sidebar-header h2 {
  font-size: 18px;
}

.sidebar-header span {
  font-size: 12px;
  color: var(--muted);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--text);
  font-size: 14px;
  background: transparent;
  transition: 0.2s ease;
}

.nav-item.router-link-active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.nav-item:hover {
  background: #f3f4f6;
}

.sidebar-footer {
  margin-top: auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 24px 32px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
}

.topbar h1 {
  font-size: 20px;
}

.topbar p {
  color: var(--muted);
  margin-top: 6px;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 10px 16px;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.user .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 600;
}

.user p {
  font-size: 12px;
  color: var(--muted);
}

.content-body {
  padding: 24px 32px 32px;
}

@media (max-width: 1024px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
