<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">SC</div>
        <div>
          <div class="brand-title">工业供应链韧性</div>
          <div class="brand-subtitle">智能风险预测平台</div>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/main/data-model">数据整合建模</RouterLink>
        <RouterLink to="/main/resilience">韧性评估</RouterLink>
        <RouterLink to="/main/risk-predict">风险识别预测</RouterLink>
        <RouterLink to="/main/decision">应急决策优化</RouterLink>
        <RouterLink to="/main/dashboard">监控展示预警</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="tag">在线运行</div>
        <p>数据刷新：每5分钟</p>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>供应链运行总览</h2>
          <p>实时追踪关键节点，支持跨模块联动分析。</p>
        </div>
        <div class="top-actions">
          <button class="secondary">同步外部数据</button>
          <button>发布协同计划</button>
        </div>
      </header>
      <section class="page">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #1c3f8c;
  color: #fff;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand-title {
  font-size: 16px;
  font-weight: 700;
}

.brand-subtitle {
  font-size: 12px;
  opacity: 0.8;
}

.menu {
  display: grid;
  gap: 12px;
}

.menu a {
  padding: 10px 14px;
  border-radius: 10px;
  color: #e8f0ff;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
}

.menu a.router-link-active {
  background: #ffffff;
  color: #1c3f8c;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  opacity: 0.9;
}

.content {
  flex: 1;
  background: #f4f7fb;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: #fff;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(15, 27, 61, 0.08);
  gap: 16px;
}

.topbar p {
  margin: 4px 0 0;
  color: #5b6b88;
}

.top-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .sidebar-footer {
    width: 100%;
  }
}
</style>
