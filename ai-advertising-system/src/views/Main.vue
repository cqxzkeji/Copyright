<template>
  <div class="layout">
    <aside>
      <div class="logo">AI 广告引擎</div>
      <nav>
        <button
          v-for="item in menu"
          :key="item.path"
          :class="['nav-btn', { active: isActive(item.path) }]"
          @click="navigate(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>
      <div class="status-card">
        <h4>系统健康度</h4>
        <p>{{ systemHealth }}</p>
        <button class="ghost" @click="showStatus = true" title="查看实时加载情况">查看加载</button>
      </div>
    </aside>
    <main>
      <header class="top-bar">
        <div>
          <h2>AI全链路数字广告智能设计与投放系统</h2>
          <p>一站式完成创意、投放、优化、分析与预算控制</p>
        </div>
        <div class="user-panel">
          <span>数字营销中台 · Admin</span>
          <button class="ghost" @click="handleLogout">退出</button>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>
    <ModalDialog v-model="showStatus" title="系统加载详情">
      <p>正在汇总各模块实时状态...</p>
      <div class="progress-shell">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <small>当前加载完成度：{{ progress }}%</small>
    </ModalDialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const route = useRoute();
const showStatus = ref(false);
const progress = ref(35);
const systemHealth = '99.3% · 运行稳定';

const menu = [
  { path: '/main/creative-design', label: '创意设计与生成' },
  { path: '/main/audience-targeting', label: '受众定向与个性化' },
  { path: '/main/campaign-management', label: '投放与实时优化' },
  { path: '/main/performance-analytics', label: '效果分析与报告' },
  { path: '/main/budget-control', label: '预算管理与成本控制' }
];

const isActive = (path) => route.path === path;
const navigate = (path) => router.push(path);
const handleLogout = () => router.push('/login');

onMounted(() => {
  const timer = setInterval(() => {
    progress.value = progress.value >= 100 ? 35 : progress.value + 5;
  }, 400);
  window.addEventListener('beforeunload', () => clearInterval(timer));
});
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

aside {
  width: 280px;
  background: #111827;
  color: #f9fafb;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
}

.logo {
  font-size: 1.3rem;
  font-weight: 700;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-btn {
  background: transparent;
  border: none;
  color: #cbd5f5;
  text-align: left;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.nav-btn.active,
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.status-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 16px;
  border-radius: 16px;
}

.status-card h4 {
  margin: 0 0 8px;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  padding: 24px 32px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.top-bar h2 {
  margin: 0;
}

.top-bar p {
  margin-top: 6px;
  color: #6b7280;
}

.user-panel {
  display: flex;
  gap: 12px;
  align-items: center;
}

.ghost {
  border: 1px solid #c7d2fe;
  background: transparent;
  border-radius: 10px;
  padding: 8px 14px;
  color: #6366f1;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 0 32px 32px;
}

.progress-shell {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(120deg, #34d399, #3b82f6);
  transition: width 0.3s;
}
</style>
