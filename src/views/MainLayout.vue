<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">StreamIQ</div>
        <p>实时流计算平台</p>
      </div>
      <nav class="menu">
        <router-link class="menu-item" to="/app/ingest">实时数据接入</router-link>
        <router-link class="menu-item" to="/app/compute">流式计算分析</router-link>
        <router-link class="menu-item" to="/app/storage">数据存储管理</router-link>
        <router-link class="menu-item" to="/app/visualization">可视化分析展示</router-link>
        <router-link class="menu-item" to="/app/monitor">运行监控与告警</router-link>
      </nav>
      <div class="sidebar-footer">
        <span>在线节点 128</span>
        <span>版本 v3.2.1</span>
      </div>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #f8fafc;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
}

.brand {
  padding: 12px 12px 24px;
  border-radius: 16px;
  background: #f1f5f9;
  margin-bottom: 24px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
}

.brand p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #e0f2fe;
  color: #0f172a;
}

.menu-item.router-link-active {
  background: #dbeafe;
  color: #1d4ed8;
  box-shadow: inset 0 0 0 1px #bfdbfe;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.content {
  flex: 1;
  padding: 24px;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    padding: 16px;
  }
}
</style>
