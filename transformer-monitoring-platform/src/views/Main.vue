<template>
  <div class="layout">
    <aside class="sidebar card">
      <div class="logo">监测平台</div>
      <nav class="nav">
        <button
          v-for="item in menus"
          :key="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          @click="go(item.path)"
        >
          <span class="dot" :style="{ background: item.color }"></span>
          {{ item.label }}
        </button>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar card">
        <div>
          <h2>实时运行总览</h2>
          <p class="muted">集中展示采集、分析、预警与健康管理模块</p>
        </div>
        <div class="user">
          <span class="chip">{{ accountLabel }}</span>
          <button class="btn ghost" @click="logout">退出登录</button>
        </div>
      </header>
      <section class="panel card">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menus = [
  { path: '/main/overview', label: '数据采集与监测', color: '#1e88e5' },
  { path: '/main/deformation', label: '变形诊断与分析', color: '#6d28d9' },
  { path: '/main/warning', label: '异常检测与预警', color: '#fb8c00' },
  { path: '/main/health', label: '健康评估与寿命', color: '#43a047' },
  { path: '/main/system', label: '系统运维配置', color: '#0ea5e9' },
];

const go = (path) => router.push(path);
const isActive = (path) => route.path === path;

const accountLabel = computed(() => sessionStorage.getItem('account') || '值班工程师');

const logout = () => {
  sessionStorage.clear();
  router.push('/login');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 18px;
  padding: 18px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo {
  font-weight: 800;
  font-size: 18px;
}

.nav {
  display: grid;
  gap: 8px;
}

.nav-item {
  border: 1px solid var(--border);
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  color: var(--text);
  font-weight: 600;
}

.nav-item .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.nav-item.active {
  border-color: var(--primary);
  box-shadow: 0 8px 18px rgba(33, 150, 243, 0.1);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.muted {
  margin: 2px 0 0;
  color: var(--muted);
}

.panel {
  min-height: 70vh;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    overflow-x: auto;
  }

  .nav {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
  }

  .content {
    order: -1;
  }
}
</style>
