<template>
  <div class="module analytics">
    <div class="intro">
      <h2>数据统计与分析</h2>
      <p>监控非遗文化与冰雪旅游场景的访问量、互动率与设备健康。</p>
      <div class="controls">
        <button class="primary" @click="refreshChart">刷新图表</button>
        <button @click="openModal('本周已完成 92% 的内容审核。')">审核进度</button>
      </div>
    </div>
    <div class="chart-card">
      <canvas ref="canvasRef"></canvas>
    </div>
    <section class="stats">
      <div class="stat" v-for="stat in stats" :key="stat.label">
        <h3>{{ stat.value }}</h3>
        <p>{{ stat.label }}</p>
        <button @click="openModal(stat.detail)">查看详情</button>
      </div>
    </section>
    <BaseModal v-model="showModal" title="分析提示">
      <p>{{ modalMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import BaseModal from '../components/BaseModal.vue';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const canvasRef = ref(null);
let chartInstance;

const stats = [
  { label: '沉浸互动率', value: '78%', detail: '互动率主要来自雪地滑行与乐器教学体验。' },
  { label: '设备在线率', value: '96%', detail: '北区 2 台终端处于节能模式，待激活即可。' },
  { label: '文旅订单转化', value: '42%', detail: '游客在体验后 42% 进行线路预约。' }
];

const showModal = ref(false);
const modalMessage = ref('');

const openModal = (msg) => {
  modalMessage.value = msg;
  showModal.value = true;
};

const initChart = () => {
  const ctx = canvasRef.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['非遗街区', '冰雪乐园', '极光营地', '苗寨体验'],
      datasets: [
        {
          label: '本周访客 (人次)',
          backgroundColor: ['#4c6ef5', '#5ce1e6', '#94a3b8', '#ff8fab'],
          data: [520, 680, 430, 390],
          borderRadius: 12
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `访客 ${context.parsed.y}`
          }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
};

const refreshChart = () => {
  if (!chartInstance) return;
  chartInstance.data.datasets[0].data = chartInstance.data.datasets[0].data.map((value) =>
    Math.round(value * (0.8 + Math.random() * 0.4))
  );
  chartInstance.update();
  openModal('图表数据已刷新，系随机模拟用于演示。');
};

onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.chart-card {
  height: 280px;
  background: #f8fbff;
  border-radius: 24px;
  padding: 16px;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.stat {
  flex: 1 1 200px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.primary,
button {
  border: none;
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
}

.stat button {
  align-self: flex-start;
  padding: 8px 14px;
}
</style>
