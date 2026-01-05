<template>
  <div class="layout">
    <header class="topbar">
      <div>
        <p class="eyebrow">VR 非遗文化场景再现与展示系统</p>
        <h1>数字化保护 · 场景化传播</h1>
      </div>
      <div class="user">
        <span class="status">运营管理员</span>
        <div class="avatar">HD</div>
      </div>
    </header>
    <div class="body">
      <nav class="sidebar">
        <router-link to="/main/resource" class="nav-item" :class="{ active: isActive('resource') }">
          资源采集与管理
        </router-link>
        <router-link to="/main/scene" class="nav-item" :class="{ active: isActive('scene') }">
          VR 场景再现
        </router-link>
        <router-link to="/main/interactive" class="nav-item" :class="{ active: isActive('interactive') }">
          交互体验与学习
        </router-link>
        <router-link to="/main/manage" class="nav-item" :class="{ active: isActive('manage') }">
          内容管理与发布
        </router-link>
        <router-link to="/main/analytics" class="nav-item" :class="{ active: isActive('analytics') }">
          数据统计与分析
        </router-link>
      </nav>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const isActive = (name) => route.name === name;
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  padding: 14px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow {
  margin: 0;
  color: #4b5671;
  font-weight: 700;
}

.topbar h1 {
  margin: 4px 0 0;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status {
  padding: 6px 12px;
  background: #eef3ff;
  border-radius: 999px;
  color: var(--primary);
  font-weight: 700;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f9dff, #7bd8ff);
  display: grid;
  place-items: center;
  color: #0f1c3f;
  font-weight: 800;
}

.body {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 90px);
}

.sidebar {
  background: #f4f8ff;
  border-right: 1px solid var(--border);
  padding: 12px;
}

.nav-item {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 8px;
  font-weight: 700;
  color: #1f2a44;
  background: #ffffff;
  border: 1px solid transparent;
}

.nav-item.active {
  border-color: var(--primary);
  box-shadow: 0 10px 30px rgba(79, 157, 255, 0.18);
}

.content {
  padding: 20px;
  background: var(--bg);
}

@media (max-width: 960px) {
  .body {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 8px;
  }

  .nav-item {
    margin: 0;
  }
}
</style>
