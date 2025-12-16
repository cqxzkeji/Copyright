<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const menu = [
  { path: '/dashboard', label: '业务数据可视化仪表板' },
  { path: '/collection', label: '数据采集与整合' },
  { path: '/analysis', label: '数据分析与指标计算' },
  { path: '/report', label: '报表生成与导出' },
  { path: '/system', label: '系统管理与权限控制' }
];

const isLogin = computed(() => route.name === 'Login');

const logout = () => {
  localStorage.removeItem('bdv_user');
  router.push('/login');
};
</script>

<template>
  <div v-if="isLogin">
    <RouterView />
  </div>
  <div v-else class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span>📊</span>
        <span>企业业务数据可视化展示系统</span>
      </div>
      <div class="chip-row" style="align-items: center">
        <span class="badge">欢迎回来</span>
        <button class="ghost" @click="logout">退出登录</button>
      </div>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <RouterLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          {{ item.label }}
        </RouterLink>
      </aside>
      <main class="main">
        <RouterView />
      </main>
    </div>
  </div>
</template>
