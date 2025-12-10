<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">🐮 智能养殖中心</div>
      <router-link
        v-for="item in navs"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        :class="{ active: $route.path === item.path }"
      >
        <span>{{ item.label }}</span>
      </router-link>
      <button class="button secondary" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

const navs = computed(() => [
  { label: '畜牧档案管理', path: '/dashboard/animals' },
  { label: '健康监控与分析', path: '/dashboard/health' },
  { label: '饲料管理', path: '/dashboard/feed' },
  { label: '数据分析与报告', path: '/dashboard/analytics' },
  { label: '系统设置', path: '/dashboard/settings' }
]);

const logout = () => {
  localStorage.removeItem('livestock-token');
  router.push('/login');
};
</script>
