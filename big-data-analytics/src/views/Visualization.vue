<template>
  <div class="module">
    <div class="panel charts">
      <div class="panel-header">
        <h3>实时指标可视化</h3>
        <small>刷新频率 5 秒</small>
      </div>
      <div class="chart-grid">
        <div class="chart-card">
          <canvas ref="trafficChart"></canvas>
          <button @click="openInfo('流量曲线展示最近 30 次批次 TPS 波动')">图表说明</button>
        </div>
        <div class="chart-card">
          <canvas ref="regionChart"></canvas>
          <button @click="openInfo('地区活跃用户 Top5 条形图')">图表说明</button>
        </div>
      </div>
      <div class="actions">
        <button @click="refreshCharts">刷新样本数据</button>
      </div>
    </div>

    <div class="panel events">
      <div class="panel-header">
        <h3>实时事件播报</h3>
        <small>自动推送异常指标</small>
      </div>
      <ul>
        <li v-for="event in events" :key="event.id">
          <strong>{{ event.title }}</strong>
          <span>{{ event.detail }}</span>
          <button class="ghost" @click="openInfo(event.detail)">查看详情</button>
        </li>
      </ul>
    </div>

    <BaseModal v-model="modal.show" :title="modal.title">
      <p>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { Chart } from 'chart.js/auto';
import BaseModal from '../components/BaseModal.vue';

const trafficChart = ref();
const regionChart = ref();
let trafficInstance;
let regionInstance;

const modal = reactive({ show: false, title: '提示', message: '' });

const events = reactive([
  { id: 1, title: '地域告警', detail: '华南 TPS 高于阈值 35%' },
  { id: 2, title: '用户画像', detail: '实时画像新客 1.4 倍提升' },
  { id: 3, title: '链路延迟', detail: 'Flink Task 102 分片背压' }
]);

const randomSeries = () => Array.from({ length: 6 }, () => Math.round(Math.random() * 1000 + 200));

const buildCharts = () => {
  const trafficData = randomSeries();
  trafficInstance?.destroy();
  regionInstance?.destroy();
  trafficInstance = new Chart(trafficChart.value, {
    type: 'line',
    data: {
      labels: Array.from({ length: trafficData.length }, (_, idx) => `批次 ${idx + 1}`),
      datasets: [
        {
          label: 'TPS',
          data: trafficData,
          borderColor: '#0ea5e9',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(14, 165, 233, 0.12)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { color: '#475569' } }, y: { ticks: { color: '#475569' } } }
    }
  });

  regionInstance = new Chart(regionChart.value, {
    type: 'bar',
    data: {
      labels: ['华北', '华东', '华南', '西南', '东北'],
      datasets: [
        {
          label: '活跃用户',
          backgroundColor: '#34d399',
          data: randomSeries().slice(0, 5)
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { color: '#475569' } }, y: { ticks: { color: '#475569' } } }
    }
  });
};

const refreshCharts = () => {
  buildCharts();
  openInfo('图表数据已刷新，模拟新的实时采样结果');
};

const openInfo = (message) => {
  modal.title = '可视化提醒';
  modal.message = message;
  modal.show = true;
};

onMounted(buildCharts);
onBeforeUnmount(() => {
  trafficInstance?.destroy();
  regionInstance?.destroy();
});
</script>

<style scoped>
.module {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.panel {
  flex: 1 1 360px;
  background: #fff;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}
.chart-card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
canvas {
  max-width: 100%;
}
.actions {
  margin-top: 1rem;
}
button {
  border: none;
  border-radius: 16px;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(120deg, #6366f1, #ec4899);
  color: #fff;
  cursor: pointer;
}
button.ghost {
  background: rgba(236, 72, 153, 0.12);
  color: #be185d;
}
.events ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.events li {
  background: #f8fafc;
  border-radius: 18px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.events strong {
  color: #0f172a;
}
.events span {
  color: #475569;
}
</style>
