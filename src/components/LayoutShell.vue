<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="logo">IoT 数据采集</div>
      <button
        v-for="link in links"
        :key="link.path"
        class="menu-button"
        :class="{ active: route.path === link.path }"
        @click="navigate(link.path)"
      >
        <span>{{ link.label }}</span>
        <span class="status-pill">模块</span>
      </button>
      <div class="card" style="margin-top: auto;">
        <div class="small-text">在线设备</div>
        <div class="section-title" style="margin: 8px 0;">
          <h3 style="font-size: 16px;">128</h3>
          <span class="badge">实时</span>
        </div>
        <div class="chart-bar" style="height: 8px;"></div>
      </div>
    </aside>
    <main class="main-content">
      <header class="header">
        <div>
          <div class="small-text">欢迎回来</div>
          <strong>{{ title }}</strong>
        </div>
        <div class="pill-list">
          <span>云端同步</span>
          <span>高可用</span>
          <span>轻量亮色</span>
          <button class="menu-button" @click="logout" style="padding: 10px 14px; gap: 8px;">
            退出登录
          </button>
        </div>
      </header>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const links = [
  { label: '数据采集与接入', path: '/collection' },
  { label: '数据处理与存储', path: '/processing' },
  { label: '实时监控与报警', path: '/monitoring' },
  { label: '数据分析与可视化', path: '/analysis' },
  { label: '设备管理与维护', path: '/devices' }
];

const title = computed(() => links.find((l) => l.path === route.path)?.label || '系统');

const navigate = (path) => router.push(path);
const logout = () => {
  localStorage.removeItem('iot-token');
  router.push('/login');
};
</script>
