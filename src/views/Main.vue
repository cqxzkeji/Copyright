<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="badge">智慧农场</span>
        <h2>果蔬生长分析</h2>
      </div>
      <nav class="nav">
        <router-link to="/main/dashboard" class="nav-item">可视化看板</router-link>
        <router-link to="/main/ingestion" class="nav-item">数据采集与接入</router-link>
        <router-link to="/main/governance" class="nav-item">数据治理与指标计算</router-link>
        <router-link to="/main/growth" class="nav-item">生长分析与预测</router-link>
        <router-link to="/main/alerts" class="nav-item">预警联动与任务闭环</router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="badge">当前角色：管理员</div>
        <small>系统版本 v2.3.1</small>
      </div>
    </aside>
    <div class="content-area">
      <header class="topbar">
        <div>
          <h3>全域果蔬生长数据监控</h3>
          <span>今日采集数据 18,420 条 · 设备在线率 98.6%</span>
        </div>
        <div class="top-actions">
          <div class="info-chip">西南一号基地</div>
          <div class="info-chip">当前班次：白班</div>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  background: #f7f9fc;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #eef2f7;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand h2 {
  margin: 6px 0 0;
  font-size: 18px;
}

.nav {
  display: grid;
  gap: 10px;
}

.nav-item {
  padding: 10px 14px;
  border-radius: 12px;
  color: #334155;
  font-weight: 600;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.nav-item.router-link-active {
  background: #e0f2fe;
  color: #0369a1;
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 20px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #eef2f7;
  gap: 16px;
}

.topbar h3 {
  margin: 0 0 4px;
  font-size: 20px;
}

.topbar span {
  color: #64748b;
  font-size: 13px;
}

.top-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.info-chip {
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 999px;
  font-size: 12px;
  color: #334155;
}

.content {
  padding: 24px 28px 40px;
}

@media (max-width: 960px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .nav {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
