<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>营养分析</h2>
        <p class="muted">监测关键营养素含量与合规性，快速定位异常批次。</p>
      </div>
      <div class="module-actions">
        <button @click="runAnalysis">重新分析</button>
        <button class="ghost" @click="showThreshold = true">设置阈值</button>
        <button class="ghost" @click="showExplain = true">指标说明</button>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>核心营养素对标</h3>
        <canvas ref="chartRef" height="240"></canvas>
      </div>
      <div class="card">
        <h3>检测结果摘要</h3>
        <div class="summary">
          <div class="summary-item" v-for="item in summary" :key="item.label">
            <p class="muted">{{ item.label }}</p>
            <p class="summary-value">{{ item.value }}</p>
            <p class="badge" :class="item.type">{{ item.trend }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="table-header">
        <h3>营养成分检测记录</h3>
        <span class="muted">近 10 次批次检测，覆盖蛋白、纤维、氨基酸等</span>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>批次</th>
              <th>粗蛋白(%)</th>
              <th>粗纤维(%)</th>
              <th>赖氨酸(%)</th>
              <th>蛋氨酸(%)</th>
              <th>钙(%)</th>
              <th>磷(%)</th>
              <th>水分(%)</th>
              <th>结论</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in records" :key="row.batch">
              <td>{{ row.batch }}</td>
              <td>{{ row.protein }}</td>
              <td>{{ row.fiber }}</td>
              <td>{{ row.lysine }}</td>
              <td>{{ row.methionine }}</td>
              <td>{{ row.calcium }}</td>
              <td>{{ row.phosphorus }}</td>
              <td>{{ row.moisture }}</td>
              <td><span class="badge" :class="statusClass(row.status)">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog v-model="showThreshold" title="阈值设置" subtitle="为关键指标设定预警范围">
      <form class="modal-form" @submit.prevent="saveThreshold">
        <label>粗蛋白目标 (%)</label>
        <input v-model.number="threshold.protein" type="number" step="0.1" min="0" />
        <label>水分上限 (%)</label>
        <input v-model.number="threshold.moisture" type="number" step="0.1" min="0" />
        <div class="modal-actions">
          <button class="ghost" type="button" @click="showThreshold = false">取消</button>
          <button type="submit">保存阈值</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showExplain" title="指标说明">
      <p>粗蛋白与氨基酸决定增重效率；纤维和水分异常会影响适口性与储存安全。</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="分析进度" subtitle="重新分析需要约 8 秒">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="muted" style="margin-top: 10px">正在校验光谱数据与化学检测结果...</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const chartRef = ref(null);
const chartInstance = ref(null);
const showThreshold = ref(false);
const showExplain = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const timer = ref(null);

const threshold = reactive({ protein: 19, moisture: 12 });

const summary = [
  { label: '合格批次占比', value: '92%', trend: '稳中向好', type: 'status-positive' },
  { label: '需复检批次', value: '2 批', trend: '已复检', type: 'status-warning' },
  { label: '营养波动指数', value: '0.34', trend: '轻微波动', type: 'status-warning' }
];

const records = reactive([
  { batch: 'B2301', protein: 19.3, fiber: 4.1, lysine: 1.16, methionine: 0.55, calcium: 0.93, phosphorus: 0.62, moisture: 11.2, status: '合格' },
  { batch: 'B2302', protein: 18.9, fiber: 4.5, lysine: 1.12, methionine: 0.53, calcium: 0.91, phosphorus: 0.6, moisture: 11.8, status: '需复检' },
  { batch: 'B2303', protein: 19.6, fiber: 4.0, lysine: 1.2, methionine: 0.57, calcium: 0.95, phosphorus: 0.64, moisture: 10.9, status: '合格' },
  { batch: 'B2304', protein: 19.1, fiber: 4.2, lysine: 1.15, methionine: 0.54, calcium: 0.92, phosphorus: 0.61, moisture: 11.5, status: '合格' },
  { batch: 'B2305', protein: 18.7, fiber: 4.6, lysine: 1.1, methionine: 0.52, calcium: 0.9, phosphorus: 0.58, moisture: 12.1, status: '需复检' },
  { batch: 'B2306', protein: 19.4, fiber: 4.0, lysine: 1.17, methionine: 0.56, calcium: 0.94, phosphorus: 0.63, moisture: 10.8, status: '合格' },
  { batch: 'B2307', protein: 19.8, fiber: 3.9, lysine: 1.21, methionine: 0.58, calcium: 0.96, phosphorus: 0.65, moisture: 10.5, status: '合格' },
  { batch: 'B2308', protein: 19.0, fiber: 4.3, lysine: 1.14, methionine: 0.54, calcium: 0.92, phosphorus: 0.6, moisture: 11.6, status: '合格' },
  { batch: 'B2309', protein: 18.8, fiber: 4.4, lysine: 1.12, methionine: 0.53, calcium: 0.91, phosphorus: 0.59, moisture: 11.9, status: '合格' },
  { batch: 'B2310', protein: 19.5, fiber: 4.0, lysine: 1.18, methionine: 0.57, calcium: 0.95, phosphorus: 0.63, moisture: 10.7, status: '合格' }
]);

const statusClass = (status) => (status === '需复检' ? 'status-warning' : 'status-positive');

const buildChart = () => {
  chartInstance.value = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: ['粗蛋白', '粗纤维', '赖氨酸', '蛋氨酸', '钙', '磷', '水分'],
      datasets: [
        {
          label: '目标值',
          data: [19, 4.3, 1.15, 0.55, 0.92, 0.6, 11.5],
          backgroundColor: 'rgba(60, 123, 230, 0.3)',
          borderColor: '#3c7be6',
          borderWidth: 1
        },
        {
          label: '当前批次',
          data: [19.3, 4.1, 1.16, 0.55, 0.93, 0.62, 11.2],
          backgroundColor: 'rgba(245, 165, 36, 0.3)',
          borderColor: '#f59e0b',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
};

const runAnalysis = () => {
  progress.value = 0;
  showProgress.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer.value);
      showProgress.value = false;
      showExplain.value = true;
    } else {
      progress.value += 12;
    }
  }, 400);
};

const saveThreshold = () => {
  showThreshold.value = false;
  showExplain.value = true;
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
