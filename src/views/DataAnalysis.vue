<template>
  <div class="module">
    <header>
      <div>
        <h2>数据分析与统计</h2>
        <p>执行指标建模、变化检测与多维图表展示。</p>
      </div>
      <button class="ghost" @click="generateReport">生成报告</button>
    </header>

    <section class="analysis-grid">
      <div class="card">
        <h3>时序变化</h3>
        <canvas ref="lineRef" height="140"></canvas>
      </div>
      <div class="card">
        <h3>专题占比</h3>
        <canvas ref="pieRef" height="140"></canvas>
      </div>
    </section>

    <section class="actions">
      <button @click="simulateAnalysis">执行变化检测</button>
      <p v-if="analysisMessage">{{ analysisMessage }}</p>
    </section>

    <ModalDialog v-if="report" title="报告生成" @close="report = null">
      <p>{{ report }}</p>
      <template #footer>
        <button class="ghost" @click="report = null">关闭</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Chart from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const lineRef = ref(null);
const pieRef = ref(null);
let lineChart;
let pieChart;
const analysisMessage = ref('');
const report = ref(null);

const buildCharts = () => {
  lineChart = new Chart(lineRef.value, {
    type: 'bar',
    data: {
      labels: ['一月', '二月', '三月', '四月', '五月'],
      datasets: [
        {
          label: '耕地变化 (km²)',
          data: [20, 35, 18, 42, 30],
          backgroundColor: '#4cafef'
        }
      ]
    },
    options: { plugins: { legend: { display: false } } }
  });

  pieChart = new Chart(pieRef.value, {
    type: 'doughnut',
    data: {
      labels: ['耕地', '建设用地', '林地', '水域'],
      datasets: [{ data: [35, 25, 30, 10], backgroundColor: ['#3dd598', '#ffd166', '#8ecae6', '#ff6b6b'] }]
    },
    options: { plugins: { legend: { labels: { color: '#fff' } } } }
  });
};

const simulateAnalysis = () => {
  analysisMessage.value = '正在比对 2023-2024 年度影像...';
  setTimeout(() => {
    analysisMessage.value = '发现 12 处新增建设区域，3 处农田退化待核查。';
  }, 1200);
};

const generateReport = () => {
  report.value = '专题报告已生成，包含 26 页图表与结论摘要，已推送到共享目录。';
};

onMounted(() => {
  buildCharts();
});

onUnmounted(() => {
  lineChart?.destroy();
  pieChart?.destroy();
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.analysis-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 280px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 16px;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
button {
  padding: 10px 20px;
  border-radius: 14px;
  background: linear-gradient(120deg, #43cea2, #185a9d);
  color: #fff;
}
.ghost {
  background: rgba(255, 255, 255, 0.15);
}
</style>
