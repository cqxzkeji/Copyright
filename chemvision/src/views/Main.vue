<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">CV</div>
        <div>
          <h2>ChemVision</h2>
          <p>教学平台</p>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/app/functional-groups" class="menu-item">
          官能团分析
        </RouterLink>
        <RouterLink to="/app/drug-activity" class="menu-item">
          药物活性预测
        </RouterLink>
        <RouterLink to="/app/sar" class="menu-item">
          SAR 结构-活性
        </RouterLink>
        <RouterLink to="/app/simulation" class="menu-item">
          分子模拟互动
        </RouterLink>
        <RouterLink to="/app/cases" class="menu-item">
          教学案例库
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span>当前学期：2024-2025</span>
        <span>教学实验室 · 结构药学</span>
      </div>
    </aside>

    <main class="content">
      <header class="topbar">
        <div>
          <h1>ChemVision 功能模块</h1>
          <p>模块内容在右侧加载，支持快速切换与实时数据更新。</p>
        </div>
        <div class="topbar-info">
          <div>
            <span>在线课堂</span>
            <strong>12</strong>
          </div>
          <div>
            <span>当前实验</span>
            <strong>5</strong>
          </div>
        </div>
      </header>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #f5f7fb;
}

.sidebar {
  background: #ffffff;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  border-right: 1px solid #edf0f6;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2f5bff, #54b8ff);
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
}

.brand h2 {
  margin: 0;
  font-size: 18px;
}

.brand p {
  margin: 2px 0 0;
  color: #8792a8;
  font-size: 12px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #42526e;
  font-weight: 600;
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.menu-item.router-link-active {
  background: #eef3ff;
  color: #2f5bff;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #8a96ad;
  font-size: 12px;
}

.content {
  padding: 28px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.topbar h1 {
  margin: 0 0 6px;
  font-size: 24px;
}

.topbar p {
  margin: 0;
  color: #66728a;
}

.topbar-info {
  display: flex;
  gap: 20px;
}

.topbar-info div {
  background: #ffffff;
  padding: 10px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(31, 42, 68, 0.08);
  text-align: center;
}

.topbar-info span {
  display: block;
  font-size: 12px;
  color: #7a879f;
}

.topbar-info strong {
  font-size: 18px;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    padding: 20px;
  }
}
</style>
