<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="logo">Mgoshort</div>
      <nav v-if="!isLoginPage" class="nav">
        <router-link class="nav-item" to="/videos">视频展示</router-link>
        <router-link class="nav-item" to="/player">播放</router-link>
        <router-link class="nav-item" to="/interaction">互动</router-link>
        <router-link class="nav-item" to="/search">搜索推荐</router-link>
        <router-link class="nav-item" to="/admin">管理分析</router-link>
      </nav>
      <div class="user" v-if="!isLoginPage">
        <span class="chip">欢迎回来</span>
      </div>
    </header>
    <main :class="['content', { fullscreen: isLoginPage }]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-weight: 800;
  color: #2563eb;
  font-size: 20px;
}

.nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.nav-item {
  padding: 10px 14px;
  border-radius: 12px;
  background: #eef2ff;
  color: #1f2937;
  font-weight: 600;
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, #4f46e5 0%, #60a5fa 100%);
  color: #fff;
}

.content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.content.fullscreen {
  max-width: 100%;
  padding: 0;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
