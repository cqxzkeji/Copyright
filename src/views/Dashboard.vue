<template>
  <div class="dashboard-shell">
    <aside class="sidebar">
      <div class="brand">
        <span>♻️</span>
        <div>
          <p>Hazardous</p>
          <strong>Waste OPS</strong>
        </div>
      </div>
      <nav>
        <button
          v-for="item in navLinks"
          :key="item.route"
          :class="['nav-btn', { active: currentPath === item.route }]"
          @click="navigate(item.route)"
        >
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>
      <div class="sidebar-footer">
        <p>帮助与说明</p>
        <button class="ghost" @click="helpOpen = true">使用指引</button>
      </div>
    </aside>
    <main class="main">
      <header class="main-header">
        <div>
          <p class="eyebrow">欢迎回来</p>
          <h2>{{ greeting }}</h2>
        </div>
        <div class="spark-card">
          <p>七日危废波动 (吨)</p>
          <svg viewBox="0 0 120 40">
            <polyline :points="sparkline" />
          </svg>
          <div class="spark-values">
            <span>总量：{{ totalTon }} 吨</span>
            <span>峰值：{{ peakTon }} 吨</span>
          </div>
        </div>
      </header>
      <section class="content-panel">
        <router-view />
      </section>
    </main>
    <ModalDialog v-if="helpOpen" title="系统使用提示" primary-text="我已了解" @confirm="helpOpen = false" @close="helpOpen = false">
      <p>左侧导航用于切换五大功能模块，所有操作均会在主内容区展示并以弹窗的形式进行确认。</p>
      <p>仪表盘顶部展示近七日危废波动趋势，可帮助您预判仓储和运输能力。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const route = useRoute();
const navLinks = [
  { label: '废物登记与分类管理', route: '/dashboard/waste-registration', icon: '🗂️' },
  { label: '运输与转移管理', route: '/dashboard/transport', icon: '🚚' },
  { label: '仓储管理与库存监控', route: '/dashboard/storage', icon: '🏭' },
  { label: '合规性与监管报告', route: '/dashboard/compliance', icon: '📑' },
  { label: '数据分析与可视化', route: '/dashboard/analytics', icon: '📈' }
];

const sparkSource = [40, 55, 60, 48, 70, 85, 78];
const sparkline = computed(() => sparkSource.map((value, index) => `${(index / (sparkSource.length - 1)) * 120},${40 - (value / 100) * 40}`).join(' '));
const totalTon = sparkSource.reduce((acc, curr) => acc + curr, 0);
const peakTon = Math.max(...sparkSource);
const greeting = '今日监控 26 条告警，全部已处理';
const helpOpen = ref(false);

const currentPath = computed(() => route.path);
const navigate = (path) => {
  if (path !== currentPath.value) {
    router.push(path);
  }
};
</script>

<style scoped>
.dashboard-shell {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
}

.sidebar {
  width: 280px;
  background: #111827;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
}

.brand {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.brand span {
  font-size: 1.8rem;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: transparent;
  color: inherit;
  justify-content: flex-start;
}

.nav-btn.active,
.nav-btn:hover {
  background: rgba(148, 163, 184, 0.2);
}

.main {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
  align-items: center;
}

.eyebrow {
  color: #64748b;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.spark-card {
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
}

.spark-card svg {
  width: 160px;
  height: 55px;
}

polyline {
  fill: none;
  stroke: #2563eb;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.spark-values {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #475569;
}

.content-panel {
  flex: 1;
  background: #fff;
  border-radius: 28px;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  min-height: 65vh;
}

.sidebar-footer {
  margin-top: auto;
  background: rgba(15, 23, 42, 0.6);
  padding: 1rem;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-footer .ghost {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-radius: 12px;
  padding: 0.6rem 1rem;
}

@media (max-width: 1100px) {
  .dashboard-shell {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
}
</style>
