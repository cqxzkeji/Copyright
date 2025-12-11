<template>
  <div class="layout" :class="{ 'layout--auth': isAuthPage }">
    <div v-if="!isAuthPage" class="sidebar">
      <div class="logo">Smart Class</div>
      <nav>
        <router-link to="/dashboard" class="nav-item" active-class="active">概览</router-link>
        <router-link to="/overview" class="nav-item" active-class="active">系统总览</router-link>
        <router-link to="/courses" class="nav-item" active-class="active">课程录制</router-link>
        <router-link to="/ai" class="nav-item" active-class="active">数字人助教</router-link>
        <router-link to="/analytics" class="nav-item" active-class="active">数据分析</router-link>
        <router-link to="/settings" class="nav-item" active-class="active">系统设置</router-link>
      </nav>
    </div>
    <div class="content">
      <header v-if="!isAuthPage" class="topbar">
        <div>
          <h1>智能录课数字人助教系统</h1>
          <p>亮色主题 · 自适应布局</p>
        </div>
        <div class="user-area">
          <span class="status-dot"></span>
          <span>已登录</span>
        </div>
      </header>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAuthPage = computed(() => route.name === 'Login');
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}

.layout--auth {
  display: block;
  background: #f5f7fb;
}

.sidebar {
  padding: 24px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.logo {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 16px;
  color: #2563eb;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #1f2937;
  background: #f8fafc;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: #e0ecff;
  color: #1d4ed8;
}

.active {
  background: #2563eb;
  color: #fff;
  border-color: #1d4ed8;
}

.content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar h1 {
  margin: 0;
  font-size: 22px;
}

.topbar p {
  margin: 2px 0 0;
  color: #6b7280;
}

.user-area {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-weight: 600;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: #22c55e;
  display: inline-block;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}
</style>
