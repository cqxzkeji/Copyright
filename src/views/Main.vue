<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">港口排程</div>
      <nav>
        <RouterLink to="/main/base-data">①资源与基础资料</RouterLink>
        <RouterLink to="/main/task-modeling">②任务建模与数据接入</RouterLink>
        <RouterLink to="/main/ga-optimization">③遗传算法调度优化</RouterLink>
        <RouterLink to="/main/dispatch-execution">④调度执行与协同指挥</RouterLink>
        <RouterLink to="/main/analytics">⑤可视化分析与绩效评估</RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>智能排程工作台</h2>
          <p>装卸全链路数据驱动与遗传算法调度求解</p>
        </div>
        <div class="tag-row">
          <span class="badge info">租户：{{ tenant }}</span>
          <span class="badge success">班次：夜班</span>
          <span class="badge warning">安全校核启用</span>
        </div>
      </header>
      <section class="work-area">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tenant = ref('东港码头');
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #165dff 0%, #7ad7ff 100%);
  color: #0a1b33;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  background: #fff;
  color: #1852a0;
  padding: 12px 10px;
  border-radius: 12px;
  text-align: center;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  background: rgba(255, 255, 255, 0.8);
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  color: #0f2b52;
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.08);
}

nav a.router-link-active {
  background: #fff;
  color: #0d47a1;
  box-shadow: 0 12px 24px rgba(0, 82, 204, 0.2);
}

.content {
  padding: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  background: #fff;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(15, 75, 145, 0.1);
}

.work-area {
  margin-top: 16px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  nav a {
    flex: 1 1 45%;
  }
}
</style>
