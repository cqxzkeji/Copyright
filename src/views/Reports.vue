<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>数据报表</h2>
        <p class="muted">汇总成本、产出与合规指标，支持导出与自定义展示。</p>
      </div>
      <div class="module-actions">
        <button @click="exportReport">导出报表</button>
        <button class="ghost" @click="showCustom = true">自定义报表</button>
        <button class="ghost" @click="showInfo = true">说明</button>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>成本与产出趋势</h3>
        <canvas ref="chartRef" height="240"></canvas>
      </div>
      <div class="card">
        <h3>关键指标摘要</h3>
        <div class="summary">
          <div class="summary-item" v-for="item in summary" :key="item.label">
            <p class="muted">{{ item.label }}</p>
            <p class="summary-value">{{ item.value }}</p>
            <p class="badge" :class="item.status">{{ item.trend }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="table-header">
        <h3>周度绩效概览</h3>
        <span class="muted">展示 10 条周度饲料成本与转化效率数据</span>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>周次</th>
              <th>饲料成本(元/吨)</th>
              <th>料肉比</th>
              <th>日均增重(g)</th>
              <th>死亡率(%)</th>
              <th>合格率(%)</th>
              <th>收益指数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.week">
              <td>{{ row.week }}</td>
              <td>{{ row.cost }}</td>
              <td>{{ row.fcr }}</td>
              <td>{{ row.adg }}</td>
              <td>{{ row.mortality }}</td>
              <td>{{ row.passRate }}</td>
              <td>{{ row.roi }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog v-model="showCustom" title="自定义报表" subtitle="选择需要展示的指标">
      <form class="modal-form" @submit.prevent="submitCustom">
        <label>指标选择</label>
        <select v-model="form.metric">
          <option value="成本">成本</option>
          <option value="料肉比">料肉比</option>
          <option value="增重">增重</option>
        </select>
        <label>时间范围</label>
        <input v-model="form.range" placeholder="如：近8周" />
        <div class="modal-actions">
          <button class="ghost" type="button" @click="showCustom = false">取消</button>
          <button type="submit">生成</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showInfo" title="报表说明">
      <p>报表自动提取各模块的核心指标，导出时会附带生成时间与版本号。</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="导出进度" subtitle="正在生成 PDF 与 Excel">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="muted" style="margin-top: 10px">请勿关闭页面，完成后将自动下载。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const chartRef = ref(null);
const chartInstance = ref(null);
const showCustom = ref(false);
const showInfo = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const timer = ref(null);

const form = reactive({ metric: '成本', range: '近8周' });

const summary = [
  { label: '平均饲料成本', value: '2560 元/吨', trend: '较上周-1.8%', status: 'status-positive' },
  { label: '平均料肉比', value: '1.71', trend: '保持稳定', status: 'status-positive' },
  { label: 'ROI 指数', value: '1.42', trend: '逐步提升', status: 'status-positive' }
];

const rows = reactive([
  { week: '第1周', cost: 2620, fcr: 1.74, adg: 63, mortality: 1.2, passRate: 97.2, roi: 1.35 },
  { week: '第2周', cost: 2580, fcr: 1.72, adg: 65, mortality: 1.1, passRate: 97.4, roi: 1.38 },
  { week: '第3周', cost: 2570, fcr: 1.71, adg: 66, mortality: 1.0, passRate: 97.6, roi: 1.4 },
  { week: '第4周', cost: 2555, fcr: 1.7, adg: 67, mortality: 0.9, passRate: 97.8, roi: 1.42 },
  { week: '第5周', cost: 2540, fcr: 1.69, adg: 68, mortality: 0.9, passRate: 98.0, roi: 1.44 },
  { week: '第6周', cost: 2535, fcr: 1.7, adg: 67, mortality: 0.8, passRate: 98.1, roi: 1.45 },
  { week: '第7周', cost: 2525, fcr: 1.69, adg: 68, mortality: 0.8, passRate: 98.1, roi: 1.46 },
  { week: '第8周', cost: 2510, fcr: 1.68, adg: 69, mortality: 0.7, passRate: 98.3, roi: 1.48 },
  { week: '第9周', cost: 2495, fcr: 1.68, adg: 70, mortality: 0.7, passRate: 98.4, roi: 1.5 },
  { week: '第10周', cost: 2480, fcr: 1.67, adg: 71, mortality: 0.6, passRate: 98.6, roi: 1.52 }
]);

const buildChart = () => {
  chartInstance.value = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: rows.map((r) => r.week),
      datasets: [
        {
          label: '饲料成本',
          data: rows.map((r) => r.cost),
          borderColor: '#3c7be6',
          tension: 0.35,
          fill: false
        },
        {
          label: '料肉比',
          data: rows.map((r) => r.fcr),
          borderColor: '#f59e0b',
          tension: 0.35,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      scales: {
        y: { beginAtZero: false, title: { display: true, text: '成本' } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '料肉比' } }
      }
    }
  });
};

const exportReport = () => {
  progress.value = 0;
  showProgress.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer.value);
      showProgress.value = false;
      showInfo.value = true;
    } else {
      progress.value += 14;
    }
  }, 400);
};

const submitCustom = () => {
  showCustom.value = false;
  showInfo.value = true;
};

onMounted(buildChart);

onBeforeUnmount(() => {
  chartInstance.value?.destroy();
  clearInterval(timer.value);
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 16px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.module-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.muted {
  color: var(--muted);
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.summary-item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.summary-value {
  margin: 4px 0 6px;
  font-size: 20px;
  font-weight: 800;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.table-responsive {
  overflow-x: auto;
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form select,
.modal-form input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #f8fafc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
