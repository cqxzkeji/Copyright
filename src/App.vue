<template>
  <div v-if="isLoginPage" class="login-only">
    <RouterView />
  </div>
  <div v-else class="app-shell">
    <header class="topbar">
      <div class="brand">ML Ops Studio</div>
      <div class="top-actions">
        <div class="tag">亮色 / 自适应布局</div>
        <button class="btn secondary" @click="openQuickHelp">功能提示</button>
        <button class="btn" @click="logout">退出登录</button>
      </div>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <nav>
          <RouterLink to="/" class="nav-item" :class="{ active: isActive('/') }">数据总览</RouterLink>
          <RouterLink to="/preprocessing" class="nav-item" :class="{ active: isActive('/preprocessing') }">数据预处理</RouterLink>
          <RouterLink to="/training" class="nav-item" :class="{ active: isActive('/training') }">模型训练</RouterLink>
          <RouterLink to="/evaluation" class="nav-item" :class="{ active: isActive('/evaluation') }">模型评估</RouterLink>
          <RouterLink to="/tuning" class="nav-item" :class="{ active: isActive('/tuning') }">超参数调优</RouterLink>
          <RouterLink to="/optimization" class="nav-item" :class="{ active: isActive('/optimization') }">模型优化</RouterLink>
        </nav>
      </aside>
      <main class="content">
        <RouterView />
      </main>
    </div>
    <BaseModal v-if="showHelp" title="使用说明" @close="showHelp = false">
      <p>左侧选择不同模块，操作按钮均会弹出对应功能的表单或进度窗。</p>
      <p>保持会话需在当前窗口操作，退出后需重新登录。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import BaseModal from './components/BaseModal.vue';

const route = useRoute();
const router = useRouter();
const showHelp = ref(false);
const authed = ref(Boolean(sessionStorage.getItem('ml-auth')));

const isLoginPage = computed(() => route.name === 'Login');

const logout = () => {
  sessionStorage.removeItem('ml-auth');
  authed.value = false;
  router.push('/login');
};

const openQuickHelp = () => {
  showHelp.value = true;
};

const isActive = (path) => route.path === path;

watch(
  () => route.fullPath,
  () => {
    authed.value = Boolean(sessionStorage.getItem('ml-auth'));
    if (!authed.value && route.name !== 'Login') {
      router.push('/login');
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  font-weight: 800;
  letter-spacing: 0.5px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 64px);
}

.sidebar {
  background: #fff;
  border-right: 1px solid var(--border);
  padding: 16px;
}

.nav-item {
  display: block;
  padding: 12px 14px;
  border-radius: 10px;
  color: #334155;
  font-weight: 600;
  margin-bottom: 8px;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(76, 124, 243, 0.1), rgba(90, 216, 166, 0.12));
  color: var(--text);
}

.content {
  padding: 20px;
  width: 100%;
}

.login-only {
  min-height: 100vh;
}
</style>
