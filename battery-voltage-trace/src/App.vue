<template>
  <div class="app-shell">
    <header class="top-bar">
      <div class="brand">
        <span class="brand-dot"></span>
        蓄电池电压检测数据溯源系统
      </div>
      <div class="top-actions" v-if="showShell">
        <span class="status-pill">系统在线</span>
        <button class="ghost" @click="logout">退出登录</button>
      </div>
    </header>
    <div class="main" :class="{ centered: !showShell }">
      <nav v-if="showShell" class="side-nav">
        <div class="nav-title">功能模块</div>
        <router-link to="/device" class="nav-item">设备管理</router-link>
        <router-link to="/connect" class="nav-item">WiFi/蓝牙接入</router-link>
        <router-link to="/trace" class="nav-item">数据存储与溯源</router-link>
      </nav>
      <section class="content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const showShell = computed(() => route.path !== '/login');

const logout = () => {
  router.push('/login');
};
</script>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f5f7fb;
  color: #1f2a44;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(31, 42, 68, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 18px;
}

.brand-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-pill {
  background: #e7f8ef;
  color: #1c7a4d;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.ghost {
  border: 1px solid #d6deed;
  background: #fff;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.main {
  display: grid;
  grid-template-columns: 240px 1fr;
  flex: 1;
}

.main.centered {
  grid-template-columns: 1fr;
}

.side-nav {
  background: #ffffff;
  padding: 24px 16px;
  border-right: 1px solid #eef1f6;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-title {
  font-size: 13px;
  color: #7d8aa5;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.nav-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #1f2a44;
  text-decoration: none;
  background: #f3f6fc;
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
  color: #fff;
}

.content {
  padding: 24px;
}

@media (max-width: 960px) {
  .main {
    grid-template-columns: 1fr;
  }

  .side-nav {
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid #eef1f6;
  }

  .content {
    padding: 16px;
  }
}
</style>
