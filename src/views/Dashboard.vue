<template>
  <div class="module-shell">
    <section class="module-header">
      <div>
        <h2>系统监控与管理</h2>
        <p>实时追踪机动平台、能源与链路状态，保障联合作战能力。</p>
      </div>
      <div class="header-btns">
        <button class="secondary-btn" @click="openModal('全域巡检', '巡检指令已下发，15 个节点同步执行。')">触发巡检</button>
        <button class="primary-btn" @click="startProgress">同步状态</button>
      </div>
    </section>

    <div class="card-grid">
      <div class="card" v-for="metric in metrics" :key="metric.label">
        <p class="tag">{{ metric.label }}</p>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.desc }}</small>
      </div>
    </div>

    <div class="chart-panel">
      <Line :data="chartData" :options="chartOptions" />
      <div class="chart-actions">
        <button class="secondary-btn" @click="openModal('告警趋势', '过去 24h 告警降低 18%，策略调整有效。')">查看告警</button>
        <button class="secondary-btn" @click="refreshMetrics">刷新数据</button>
      </div>
    </div>

    <BaseModal v-if="modal" :title="modal.title" @close="modal = null">
      {{ modal.message }}
    </BaseModal>

    <BaseModal v-if="showProgress" title="同步状态">
      <p>已完成 {{ progress }}% ，等待全部节点响应...</p>
      <div class="progress-shell">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import { Line } from 'vue-chartjs';
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

const modal = ref(null);
const showProgress = ref(false);
const progress = ref(0);
let timer;

const metrics = ref([
  { label: '能源剩余', value: '87%', desc: '可支撑 36h 联合作业' },
  { label: '链路健康', value: '99.2%', desc: '卫星链路 5 条 / 5 条在线' },
  { label: '无人单元', value: '142', desc: '处于随时可调度状态' },
  { label: '任务执行', value: '18', desc: '同步执行中' }
]);

const chartData = computed(() => ({
  labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
  datasets: [
    {
      label: '设备在线率 %',
      data: [95, 96, 97, 94, 98, 99],
      borderColor: 'rgba(5,195,221,1)',
      backgroundColor: 'rgba(5,195,221,0.2)',
      fill: true,
      tension: 0.4
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#cbd5f5' } }
  },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
  }
};

const openModal = (title, message) => {
  modal.value = { title, message };
};

const refreshMetrics = () => {
  metrics.value = metrics.value.map((metric) => ({
    ...metric,
    value: typeof metric.value === 'string' && metric.value.includes('%')
      ? `${Math.min(100, Math.max(80, Math.round(Math.random() * 20 + 80)))}%`
      : Math.round(Math.random() * 160)
  }));
  openModal('数据已刷新', '同步完成，指标已经校准。');
};

const startProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 600);
    } else {
      progress.value += 10;
    }
  }, 300);
};
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-panel {
  flex: 1;
  min-height: 320px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-panel canvas {
  flex: 1;
}

.chart-actions {
  display: flex;
  gap: 0.8rem;
}

.header-btns {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
</style>
