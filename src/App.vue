<template>
  <div>
    <header class="app-header" v-if="!isLoginPage">
      <div class="logo">多源数据采集与信息融合平台</div>
      <nav class="nav">
        <RouterLink to="/dashboard">总览</RouterLink>
        <RouterLink to="/collection">数据采集</RouterLink>
        <RouterLink to="/preprocessing">数据预处理</RouterLink>
        <RouterLink to="/fusion">信息融合</RouterLink>
        <RouterLink to="/visualization">数据可视化</RouterLink>
        <RouterLink to="/system">系统管理</RouterLink>
      </nav>
      <div class="user" @click="toggleUserModal">{{ userName }}</div>
    </header>
    <main :class="['main-area', { full: isLoginPage }]">
      <RouterView />
    </main>
    <div v-if="showUser" class="modal-overlay" @click.self="showUser = false">
      <div class="modal">
        <div class="modal-header">
          <h3>当前用户</h3>
          <button class="ghost" @click="showUser = false">关闭</button>
        </div>
        <p>欢迎回来，{{ userName }}。请选择需要跳转的功能模块。</p>
        <div class="modal-actions">
          <RouterLink to="/dashboard" @click="showUser = false"><button>回到总览</button></RouterLink>
          <button class="secondary" @click="logout">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const showUser = ref(false);
const userName = localStorage.getItem('msdfp-user') || '演示用户';

const isLoginPage = computed(() => route.path === '/');

const toggleUserModal = () => {
  showUser.value = true;
};

const logout = () => {
  localStorage.removeItem('msdfp-authed');
  router.push('/');
};
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 22px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
}

.logo {
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.5px;
}

.nav {
  display: flex;
  gap: 14px;
  font-size: 14px;
}

.nav a {
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--text);
  transition: background 0.2s ease;
}

.nav a.router-link-active {
  background: #eef2ff;
  color: var(--primary);
}

.user {
  background: #eef2ff;
  color: var(--primary);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 14px;
}

.main-area {
  padding: 18px;
}

.main-area.full {
  padding: 0;
}

@media (max-width: 900px) {
  .nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
