<template>
  <div class="app-shell">
    <header class="topbar">
      <div>
        <p class="muted">谷物良种基因库</p>
        <h2>智能匹配与繁育优化系统</h2>
      </div>
      <div class="topbar-actions">
        <div class="badge">安全连接</div>
        <button class="secondary" @click="openHelp = true">帮助</button>
        <button class="danger" @click="logout">退出</button>
      </div>
    </header>
    <div class="shell">
      <nav class="sidebar">
        <RouterLink to="/seed-library">基因库管理</RouterLink>
        <RouterLink to="/breeding">繁育优化</RouterLink>
        <RouterLink to="/matching">智能匹配</RouterLink>
        <RouterLink to="/analysis">数据分析</RouterLink>
        <RouterLink to="/monitoring">监控页面</RouterLink>
        <RouterLink to="/settings">系统设置</RouterLink>
      </nav>
      <main class="content">
        <router-view />
      </main>
    </div>
    <ModalDialog v-model="openHelp" title="帮助与提示">
      <p>每个功能模块都支持数据录入、校验与进度反馈，表格数据可直接复用到实验批次。</p>
      <p>点击按钮会以模态弹窗显示表单、进度条或操作提示，确保操作可视化可控。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const authState = inject('authState');
const openHelp = ref(false);

const logout = () => {
  localStorage.removeItem('authToken');
  authState.isAuthenticated = false;
  router.replace('/login');
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  background: linear-gradient(90deg, #e0f2fe, #fff1e6);
  border-bottom: 1px solid #e5e7eb;
}

.topbar h2 {
  margin: 4px 0 0;
}

.topbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  flex: 1;
  min-height: 0;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 10px;
}

.sidebar a {
  padding: 12px;
  border-radius: 12px;
  background: #f3f4f6;
  font-weight: 700;
  color: #111827;
}

.sidebar a.router-link-active {
  background: #e0f2fe;
  color: #075985;
  box-shadow: inset 0 0 0 2px #bae6fd;
}

.content {
  padding: 18px;
  overflow: auto;
}
</style>
