<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">流量分析平台</div>
      <div style="margin-bottom: 12px; color: var(--muted); font-size: 14px;">模块导航</div>
      <nav>
        <button
          v-for="item in menu"
          :key="item.path"
          :class="{ active: $route.path === item.path }"
          @click="go(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <div style="font-weight: 700;">{{ currentLabel }}</div>
          <div style="color: var(--muted); font-size: 14px;">基于机器学习的恶意流量识别与行为分析</div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <button style="background: #e2e8f0; color: var(--text);" @click="showNotice = true">公告</button>
          <button @click="logout">退出登录</button>
        </div>
      </header>
      <router-view />
    </main>
  </div>
  <ModalDialog v-model="showNotice" title="操作提示" @confirm="showNotice = false">
    <p style="color: var(--muted);">每个功能模块已按要求加载为独立页面，所有按钮均触发专属弹窗或流程。</p>
  </ModalDialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const route = useRoute();
const showNotice = ref(false);

const menu = [
  { path: '/data-collection', label: '流量数据采集与接入' },
  { path: '/data-processing', label: '特征提取与恶意流量分析' },
  { path: '/info-service', label: '恶意行为识别与检测服务' },
  { path: '/visualization', label: '安全态势可视化与报表' },
  { path: '/system-management', label: '系统配置与权限管理' }
];

const go = (path) => router.push(path);
const logout = () => {
  sessionStorage.removeItem('mtas_token');
  router.push('/login');
};

const currentLabel = computed(() => menu.find((m) => m.path === route.path)?.label || '控制台');
</script>
