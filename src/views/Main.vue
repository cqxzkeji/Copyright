<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">AD Studio</div>
      <nav class="menu">
        <router-link class="menu-item" to="/main/creative">创意与设计</router-link>
        <router-link class="menu-item" to="/main/production">生产与制作</router-link>
        <router-link class="menu-item" to="/main/publish">投放与发布</router-link>
        <router-link class="menu-item" to="/main/effect">效果分析</router-link>
        <router-link class="menu-item" to="/main/system">系统管理</router-link>
      </nav>
      <div class="sidebar-footer">
        <p>版本 1.0</p>
        <p>在线设计平台</p>
      </div>
    </aside>
    <div class="content">
      <header class="topbar">
        <div>
          <h2>广告设计生产与发布管理平台</h2>
          <p>多模块协作 · 全流程可视化 · 亮色自适应布局</p>
        </div>
        <div class="user-card">
          <span class="avatar">A</span>
          <div>
            <strong>管理员</strong>
            <p>design@adcloud.com</p>
          </div>
        </div>
      </header>
      <main class="module">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f4f7fb;
}

.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  color: #1d4ed8;
  margin-bottom: 24px;
}

.menu {
  display: grid;
  gap: 12px;
  flex: 1;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #0f172a;
  font-weight: 500;
}

.menu-item.router-link-active {
  background: #dbeafe;
  color: #1d4ed8;
}

.sidebar-footer {
  font-size: 12px;
  color: #64748b;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 32px 40px;
  gap: 20px;
}

.topbar {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

.topbar h2 {
  margin: 0 0 6px;
  font-size: 22px;
}

.topbar p {
  margin: 0;
  color: #64748b;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1d4ed8;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.module {
  flex: 1;
}

@media (max-width: 1024px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .menu {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    overflow-x: auto;
  }

  .sidebar-footer {
    display: none;
  }
}
</style>
