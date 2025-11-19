<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="brand">钢轨灰斑识别</div>
      <nav>
        <a v-for="link in links" :key="link.to" :class="['nav-link', { active: route.path.includes(link.to) }]" @click.prevent="router.push(link.route)">
          <span>{{ link.label }}</span>
        </a>
      </nav>
      <button class="system-check" @click="openSystemModal">系统联机检测</button>
    </aside>
    <main class="content">
      <header class="top-bar">
        <div>
          <h2>智能识别监控面板</h2>
          <p>实时掌握钢轨断口灰斑检测全流程</p>
        </div>
        <div class="flex gap">
          <div class="tooltip-button">
            <button type="button" @click="showTip('系统将对所有传感器进行快速巡检')">巡检提示</button>
            <span>点击查看巡检提示</span>
          </div>
          <button type="button" @click="startGlobalProgress">一键推送</button>
        </div>
      </header>
      <section class="status-grid">
        <div class="card">
          <h4>检测准确率</h4>
          <MiniChart :values="[92, 94, 95, 96, 97, 97.5, 98]" />
          <strong>98.0%</strong>
        </div>
        <div class="card">
          <h4>处理吞吐量</h4>
          <MiniChart :values="[210, 240, 230, 250, 280, 320, 340]" />
          <strong>340 帧/分钟</strong>
        </div>
        <div class="card">
          <h4>待处理工单</h4>
          <p class="huge">12</p>
          <p>优先处理灰斑等级≥2的断口</p>
        </div>
      </section>
      <section class="module-wrapper">
        <router-view />
      </section>
    </main>
  </div>
  <BaseModal :show="systemModal" title="系统联机检测" @close="systemModal = false">
    <p>当前 48 路传感器中 48 路在线，数据链路延迟均值 38ms，工作稳定。</p>
  </BaseModal>
  <BaseModal :show="globalProgressModal" title="推送进度" @close="globalProgressModal = false">
    <p>正在向线路指挥中心同步策略…</p>
    <div class="progress-bar">
      <div class="progress-bar__inner" :style="{ width: globalProgress + '%' }"></div>
    </div>
    <p>{{ globalProgress }}%</p>
  </BaseModal>
  <BaseModal :show="tipModal" title="巡检提示" @close="tipModal = false">
    <p>{{ tipContent }}</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MiniChart from '../components/MiniChart.vue';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const route = useRoute();

const links = [
  { label: '数据采集与预处理', route: '/main/data-collection', to: 'data-collection' },
  { label: '断口灰斑检测', route: '/main/crack-detection', to: 'crack-detection' },
  { label: '算法优化与训练', route: '/main/algorithm-optimization', to: 'algorithm-optimization' },
  { label: '数据分析与报告', route: '/main/data-analysis', to: 'data-analysis' },
  { label: '系统管理', route: '/main/management', to: 'management' }
];

const systemModal = ref(false);
const globalProgressModal = ref(false);
const globalProgress = ref(0);
const tipModal = ref(false);
const tipContent = ref('');

const openSystemModal = () => (systemModal.value = true);

const startGlobalProgress = () => {
  globalProgressModal.value = true;
  globalProgress.value = 0;
  const timer = setInterval(() => {
    globalProgress.value += 10;
    if (globalProgress.value >= 100) {
      globalProgress.value = 100;
      clearInterval(timer);
    }
  }, 250);
};

const showTip = (text) => {
  tipContent.value = text;
  tipModal.value = true;
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #101729;
  color: #c7d2fe;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.4rem;
  gap: 1.5rem;
}

.brand {
  font-weight: 700;
  font-size: 1.3rem;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.8rem 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
  background: #2c64ff;
  color: #fff;
}

.system-check {
  margin-top: auto;
  background: #0f172a;
  border: 1px solid #1d2a46;
}

.content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.status-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.status-grid .card {
  flex: 1;
  min-width: 220px;
}

.huge {
  font-size: 3rem;
  margin: 0;
}

.module-wrapper {
  flex: 1;
  display: flex;
}

.gap {
  gap: 0.8rem;
}
</style>
