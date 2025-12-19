<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <img src="/src/assets/field.svg" alt="logo" />
        <div>
          <h1>农产品供应链</h1>
          <p>信息化管理平台</p>
        </div>
      </div>
      <nav>
        <RouterLink to="/dashboard/source">源头信息管理</RouterLink>
        <RouterLink to="/dashboard/dispatch">供应链调度与流通</RouterLink>
        <RouterLink to="/dashboard/warehouse">仓储库存管理</RouterLink>
        <RouterLink to="/dashboard/quality">质量安全与追溯</RouterLink>
        <RouterLink to="/dashboard/analytics">数据分析与综合监管</RouterLink>
      </nav>
      <button class="logout" type="button" @click="handleLogout">退出登录</button>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>供应链运行总览</h2>
          <span>亮色自适应布局 · 今日状态汇总</span>
        </div>
        <div class="topbar-actions">
          <div class="tag">在线调度 12</div>
          <div class="tag">预警 3</div>
        </div>
      </header>
      <section class="panel-grid">
        <div class="panel">
          <h3>本周订单履约率</h3>
          <div class="metric">98.2%</div>
          <p>自动比对订单与配送回执</p>
        </div>
        <div class="panel">
          <h3>在途批次</h3>
          <div class="metric">42</div>
          <p>来自 8 个产地，覆盖 12 城市</p>
        </div>
        <div class="panel">
          <h3>仓库可用容量</h3>
          <div class="metric">76%</div>
          <p>高风险品类已完成温控校验</p>
        </div>
      </section>
      <section class="module-container">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { RouterLink, RouterView } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  router.push('/login');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #f6f8fb;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand img {
  width: 42px;
  height: 42px;
}

.brand h1 {
  font-size: 18px;
  margin: 0;
}

.brand p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  padding: 10px 12px;
  border-radius: 10px;
  color: #334155;
  text-decoration: none;
  background: #f8fafc;
}

nav a.router-link-active {
  background: #e0ecff;
  color: #1d4ed8;
  font-weight: 600;
}

.logout {
  margin-top: auto;
  border: none;
  background: #fef2f2;
  color: #dc2626;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.content {
  display: flex;
  flex-direction: column;
  padding: 24px 32px 40px;
  gap: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.topbar h2 {
  margin: 0;
  font-size: 24px;
}

.topbar span {
  color: #64748b;
  font-size: 13px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
  font-weight: 600;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

.panel h3 {
  margin: 0 0 8px;
  font-size: 15px;
}

.metric {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #1d4ed8;
}

.module-container {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
  }
}
</style>
