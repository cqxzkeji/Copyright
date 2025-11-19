<template>
  <div class="module">
    <header>
      <div>
        <h2>数据分析与报表</h2>
        <p>聚合巡检、维护、产线运行指标，生成班次级别的决策数据</p>
      </div>
      <button @click="showExport">导出报表</button>
    </header>
    <section class="cards">
      <article class="card" v-for="card in cards" :key="card.label">
        <p>{{ card.label }}</p>
        <strong>{{ card.value }}</strong>
        <small>{{ card.desc }}</small>
      </article>
    </section>
    <section class="chart-section">
      <div ref="chartEl" class="chart"></div>
    </section>
  </div>

  <BaseModal
    v-if="exportModal"
    :show="exportModal"
    title="导出报表"
    @close="exportModal = false"
  >
    <p>已生成包含巡检完成率、故障时长、库存消耗等 8 项指标的报表，并发送至管理层邮箱。</p>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import BaseModal from '../components/BaseModal.vue';

const cards = [
  { label: '巡检完成率', value: '88%', desc: '同比 +6%' },
  { label: '平均修复时长', value: '1.6h', desc: '同比 -12%' },
  { label: '停机总时长', value: '4.1h', desc: '目标 6h' }
];

const chartEl = ref(null);
let chartInstance;
const exportModal = ref(false);

const renderChart = () => {
  if (!chartInstance) {
    chartInstance = echarts.init(chartEl.value);
  }
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['故障数量', '停机时长'] },
    xAxis: { type: 'category', data: ['一月', '二月', '三月', '四月', '五月', '六月'] },
    yAxis: { type: 'value' },
    series: [
      { name: '故障数量', type: 'bar', data: [12, 9, 14, 8, 7, 10], color: '#38bdf8' },
      { name: '停机时长', type: 'line', data: [6, 5.4, 4.8, 4.3, 4.1, 4], color: '#f472b6', smooth: true }
    ],
    grid: { left: 40, right: 20, top: 30, bottom: 30 }
  });
};

onMounted(() => {
  renderChart();
  window.addEventListener('resize', renderChart);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderChart);
  chartInstance?.dispose();
});

const showExport = () => {
  exportModal.value = true;
};
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

button {
  border: none;
  background: #ef4444;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
}

.cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.card {
  flex: 1 1 200px;
  background: #fee2e2;
  border-radius: 16px;
  padding: 16px;
}

.chart-section {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
}

.chart {
  width: 100%;
  min-height: 320px;
}
</style>
