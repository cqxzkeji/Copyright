<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-dot"></span>
        <div>
          <strong>NVH综合优化</strong>
          <p>管理控制台</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/main/project-center">项目中心</router-link>
        <router-link to="/main/data-collection">数据采集</router-link>
        <router-link to="/main/analysis-diagnosis">分析诊断</router-link>
        <router-link to="/main/simulation-calibration">仿真校准</router-link>
        <router-link to="/main/optimization-tasks">优化协同</router-link>
        <router-link to="/main/report-knowledge">报告知识库</router-link>
      </nav>
    </aside>

    <section class="content-area">
      <header class="topbar">
        <div>
          <h2>汽车NVH综合优化管理软件</h2>
          <p>试验、分析、仿真、优化与知识沉淀的统一协同平台</p>
        </div>
        <div class="top-actions">
          <button class="ghost">项目概览</button>
          <button class="primary">快速创建</button>
        </div>
      </header>
      <main class="view-container">
        <router-view />
      </main>
    </section>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e5ebf5;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  display: inline-block;
}

.logo p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu a {
  padding: 10px 14px;
  border-radius: 10px;
  color: #334155;
  font-weight: 500;
  transition: all 0.2s ease;
}

.menu a.router-link-active {
  background: #e8f0ff;
  color: #1d4ed8;
}

.content-area {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  padding: 20px 32px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5ebf5;
}

.topbar h2 {
  margin: 0 0 6px;
}

.topbar p {
  margin: 0;
  color: #64748b;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  border: 1px solid #d6deea;
  color: #334155;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.view-container {
  padding: 24px 32px 40px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
