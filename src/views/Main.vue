<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">更新监测</div>
      <nav>
        <router-link to="/main/area-archive" active-class="active">基础档案</router-link>
        <router-link to="/main/process-monitoring" active-class="active">过程监测</router-link>
        <router-link to="/main/fund-resource" active-class="active">资金资源</router-link>
        <router-link to="/main/effect-evaluation" active-class="active">成效评估</router-link>
        <router-link to="/main/decision-dashboard" active-class="active">决策展示</router-link>
      </nav>
    </aside>
    <main class="content">
      <header>
        <div>
          <h1>片区更新全周期管理</h1>
          <p>亮色自适应布局 · 固定菜单栏 · 模块化内容窗</p>
        </div>
        <div class="user-chip">{{ timeLabel }}</div>
      </header>
      <section class="module-view">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const timeLabel = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
});
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0f172a;
  color: #e5e7eb;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 6px 0 18px rgba(0, 0, 0, 0.08);
}

.logo {
  font-weight: 700;
  font-size: 18px;
  padding: 12px;
  background: linear-gradient(135deg, #4f46e5, #22d3ee);
  border-radius: 12px;
  color: #fff;
  text-align: center;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  padding: 12px 14px;
  border-radius: 10px;
  color: #e5e7eb;
  text-decoration: none;
  transition: background 0.2s, transform 0.1s;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.active {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  color: #fff;
  font-weight: 700;
}

.content {
  background: #f6f9fc;
  padding: 18px 22px 32px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

header h1 {
  margin: 0;
  color: #1f2937;
}

header p {
  margin: 4px 0 0;
  color: #6b7280;
}

.user-chip {
  background: #eef2ff;
  color: #4338ca;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;
}

.module-view {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  flex: 1;
  min-height: 0;
}
</style>
