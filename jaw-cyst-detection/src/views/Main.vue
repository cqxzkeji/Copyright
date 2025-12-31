<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">囊肿检测</div>
      <nav>
        <router-link v-for="item in menus" :key="item.path" :to="item.path" class="nav-item" :class="{ active: route.path === item.path }">
          {{ item.name }}
        </router-link>
      </nav>
      <button class="logout" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <div class="welcome">欢迎回来，{{ userName }}</div>
          <div class="muted">颌骨囊肿辅助检测系统</div>
        </div>
        <div class="badge">会话安全</div>
      </header>
      <section class="module">
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
  { name: 'CT影像管理', path: '/data' },
  { name: '模型训练', path: '/train' },
  { name: '辅助检测', path: '/detect' },
  { name: '结果复核', path: '/review' },
  { name: '系统管理', path: '/system' }
];

const userName = computed(() => {
  const token = localStorage.getItem('jwt-demo-token');
  return token ? token.replace('-token', '') : '访客';
});

const logout = () => {
  localStorage.removeItem('jwt-demo-token');
  router.push('/login');
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid var(--border);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 10px;
}

.nav-item {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 6px;
  background: #f3f4f6;
  display: block;
  font-weight: 700;
}

.nav-item.active {
  background: #e0e7ff;
  color: #3730a3;
}

.logout {
  margin-top: auto;
  background: #f97316;
}

.content {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.welcome {
  font-size: 18px;
  font-weight: 700;
}

.module {
  flex: 1;
  min-height: 80vh;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .logout {
    order: 10;
  }
}
</style>
