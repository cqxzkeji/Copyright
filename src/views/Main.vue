<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">CKD</div>
        <div>
          <p class="title">健康监测平台</p>
          <small>慢性肾脏病全周期管理</small>
        </div>
      </div>
      <nav>
        <RouterLink v-for="item in menu" :key="item.path" :to="item.path" class="nav-link" active-class="active">
          <span>{{ item.label }}</span>
          <span class="arrow">→</span>
        </RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="top-bar">
        <div>
          <p class="eyebrow">欢迎进入</p>
          <h2>慢性肾脏病健康数据监测与分析平台</h2>
        </div>
        <RouterLink to="/login" class="btn secondary">退出</RouterLink>
      </header>
      <section class="content-body">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
const menu = [
  { path: '/main/data', label: '健康数据采集' },
  { path: '/main/monitor', label: '指标监测分析' },
  { path: '/main/warning', label: '风险预警管理' },
  { path: '/main/health', label: '健康管理建议' },
  { path: '/main/report', label: '统计分析与报告' }
];
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #0ea5e9, #6366f1);
  color: #fff;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-weight: 800;
}

.title {
  margin: 0;
  font-weight: 700;
  font-size: 18px;
}

nav {
  display: grid;
  gap: 10px;
}

.nav-link {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 12px 14px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.nav-link:hover,
.nav-link.active {
  background: #fff;
  color: #0f172a;
}

.content {
  padding: 22px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.eyebrow {
  margin: 0;
  color: #94a3b8;
}

.content-body {
  background: rgba(255, 255, 255, 0.9);
  padding: 18px;
  border-radius: 18px;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
  min-height: calc(100vh - 120px);
}

@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  nav {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    width: 100%;
  }
}
</style>
