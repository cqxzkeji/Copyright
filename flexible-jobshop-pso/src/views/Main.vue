<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">PSO Scheduler</div>
      <nav>
        <router-link to="/main/data" active-class="active">数据管理</router-link>
        <router-link to="/main/modeling" active-class="active">资源建模</router-link>
        <router-link to="/main/pso" active-class="active">PSO优化</router-link>
        <router-link to="/main/simulation" active-class="active">仿真对比</router-link>
        <router-link to="/main/dashboard" active-class="active">看板报表</router-link>
      </nav>
    </aside>
    <div class="content">
      <header class="topbar">
        <div>
          <h2>柔性车间作业调度优化</h2>
          <p>亮色主题 · 响应式布局</p>
        </div>
        <div class="user">
          <span class="badge success">在线</span>
          <span>调度员</span>
        </div>
      </header>
      <main class="main-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #4f46e5, #22d3ee);
  color: white;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  padding: 10px 12px;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
}

nav a.active {
  background: white;
  color: #4338ca;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}

.content {
  display: flex;
  flex-direction: column;
}

.topbar {
  background: white;
  border-bottom: 1px solid #e0e7ff;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar h2 {
  margin: 0;
  color: #312e81;
}

.topbar p {
  margin: 2px 0 0 0;
  color: #6b7280;
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-area {
  padding: 16px;
  min-height: 0;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
