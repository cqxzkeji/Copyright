<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <h2>农产品供应链调度</h2>
        <span>Dispatch & Trace</span>
      </div>
      <nav>
        <RouterLink to="/app/source-records" class="nav-item">产地/主体与批次档案</RouterLink>
        <RouterLink to="/app/dispatch-scheduling" class="nav-item">供应链调度与运输协同</RouterLink>
        <RouterLink to="/app/warehousing-inventory" class="nav-item">仓储库存与出入库流转</RouterLink>
        <RouterLink to="/app/quality-traceability" class="nav-item">质量检测与溯源追踪</RouterLink>
        <RouterLink to="/app/analytics-dashboard" class="nav-item">监控预警与数据分析</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span>在线用户</span>
        <strong>运营中心</strong>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h1>调度指挥中心</h1>
          <p>系统运行状态正常 · {{ now }}</p>
        </div>
        <div class="topbar-actions">
          <button class="btn secondary">今日报表</button>
          <button class="btn">新建任务</button>
        </div>
      </header>
      <section class="content-body">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const now = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #f5f7fb;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 10px 0 30px rgba(31, 42, 68, 0.08);
}

.brand h2 {
  font-size: 20px;
  margin-bottom: 6px;
}

.brand span {
  font-size: 12px;
  color: #7a879f;
}

nav {
  display: grid;
  gap: 8px;
}

.nav-item {
  padding: 10px 14px;
  border-radius: 12px;
  color: #4f5f78;
  font-size: 14px;
  transition: 0.2s ease;
}

.nav-item.router-link-active {
  background: #eef4ff;
  color: #2f80ed;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  padding: 12px;
  background: #f5f8ff;
  border-radius: 14px;
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #6c7a96;
}

.sidebar-footer strong {
  color: #1f2a44;
  font-size: 15px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.topbar h1 {
  font-size: 26px;
  margin-bottom: 6px;
}

.topbar p {
  color: #7a879f;
  font-size: 14px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    width: 100%;
  }

  .content {
    padding: 16px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
