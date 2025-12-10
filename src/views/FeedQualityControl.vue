<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>饲料质量控制</h2>
        <p class="muted">监测微生物、霉菌毒素与加工关键点，确保每批饲料稳定。</p>
      </div>
      <div class="module-actions">
        <button @click="startAudit">启动质控巡检</button>
        <button class="ghost" @click="showSampling = true">记录抽检</button>
        <button class="ghost" @click="showAlert = true">质控提醒</button>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>关键风险监测</h3>
        <canvas ref="chartRef" height="240"></canvas>
      </div>
      <div class="card">
        <h3>工艺节点概览</h3>
        <ul class="metric-list">
          <li v-for="step in steps" :key="step.name">
            <div class="step-header">
              <div>
                <p class="metric-name">{{ step.name }}</p>
                <p class="muted">{{ step.detail }}</p>
              </div>
              <span class="badge" :class="statusClass(step.status)">{{ step.status }}</span>
            </div>
            <div class="progress">
              <div class="progress-bar" :style="{ width: step.rate + '%' }"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="card">
      <div class="table-header">
        <h3>质控抽检记录</h3>
        <span class="muted">含菌落数、霉菌毒素、粒度 10 条记录</span>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>批次</th>
              <th>菌落总数(CFU/g)</th>
              <th>黄曲霉毒素(ppb)</th>
              <th>水分(%)</th>
              <th>粒度(μm)</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in records" :key="row.batch">
              <td>{{ row.batch }}</td>
              <td>{{ row.cfu }}</td>
              <td>{{ row.aflatoxin }}</td>
              <td>{{ row.moisture }}</td>
              <td>{{ row.granularity }}</td>
              <td><span class="badge" :class="statusClass(row.status)">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog v-model="showSampling" title="记录抽检" subtitle="填写抽检结果">
      <form class="modal-form" @submit.prevent="submitSampling">
        <label>批次编号</label>
        <input v-model="form.batch" required placeholder="如 QC-2403" />
        <label>水分(%)</label>
        <input v-model.number="form.moisture" type="number" min="0" step="0.1" />
        <div class="modal-actions">
          <button class="ghost" type="button" @click="showSampling = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showAlert" title="质控提醒">
      <p>近期气温升高，建议提高冷却段巡检频次，并监控原料入库温湿度。</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="巡检进度" subtitle="正在巡检制粒、冷却、包装三大环节">
      <div class="progress">
        <div class="progress-bar accent" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="muted" style="margin-top: 10px">预计 {{ 12 - Math.floor(progress / 10) }} 秒完成</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const chartRef = ref(null);
const chartInstance = ref(null);
const showSampling = ref(false);
const showAlert = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const timer = ref(null);

const form = reactive({ batch: '', moisture: 0 });

const steps = [
  { name: '粉碎与配料', detail: '粒度 450μm，配料误差 ±0.2%', rate: 92, status: '正常' },
  { name: '制粒与熟化', detail: '熟化温度 82℃，持时 90 秒', rate: 88, status: '关注' },
  { name: '冷却与筛分', detail: '成品温差 < 5℃，筛上物 3%', rate: 95, status: '正常' }
];

const records = reactive([
  { batch: 'QC-2301', cfu: '2.1×10³', aflatoxin: 8, moisture: 11.5, granularity: 480, status: '正常' },
  { batch: 'QC-2302', cfu: '2.3×10³', aflatoxin: 10, moisture: 11.9, granularity: 470, status: '正常' },
  { batch: 'QC-2303', cfu: '3.0×10³', aflatoxin: 14, moisture: 12.2, granularity: 465, status: '关注' },
  { batch: 'QC-2304', cfu: '2.0×10³', aflatoxin: 9, moisture: 11.3, granularity: 455, status: '正常' },
  { batch: 'QC-2305', cfu: '2.5×10³', aflatoxin: 12, moisture: 11.8, granularity: 460, status: '正常' },
  { batch: 'QC-2306', cfu: '3.2×10³', aflatoxin: 15, moisture: 12.4, granularity: 475, status: '关注' },
  { batch: 'QC-2307', cfu: '2.4×10³', aflatoxin: 10, moisture: 11.6, granularity: 452, status: '正常' },
  { batch: 'QC-2308', cfu: '2.2×10³', aflatoxin: 9, moisture: 11.5, granularity: 458, status: '正常' },
  { batch: 'QC-2309', cfu: '2.7×10³', aflatoxin: 11, moisture: 11.9, granularity: 462, status: '正常' },
  { batch: 'QC-2310', cfu: '3.1×10³', aflatoxin: 16, moisture: 12.5, granularity: 468, status: '关注' }
]);

const statusClass = (status) => (status === '关注' ? 'status-warning' : 'status-positive');

const buildChart = () => {
  chartInstance.value = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: ['菌落总数', '霉菌毒素', '水分', '粒度'],
      datasets: [
        {
          label: '警戒线',
          data: [3, 15, 12, 500],
          backgroundColor: 'rgba(60, 123, 230, 0.25)',
          borderColor: '#3c7be6'
        },
        {
          label: '当前批次',
          data: [2.1, 14, 11.5, 468],
          backgroundColor: 'rgba(245, 165, 36, 0.25)',
          borderColor: '#f59e0b'
        }
      ]
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      responsive: true
    }
  });
};

const startAudit = () => {
  progress.value = 0;
  showProgress.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer.value);
      showProgress.value = false;
      showAlert.value = true;
    } else {
      progress.value += 9;
    }
  }, 400);
};

const submitSampling = () => {
  showSampling.value = false;
  showAlert.value = true;
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

.metric-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.metric-name {
  margin: 0 0 4px;
  font-weight: 700;
}

.progress {
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.3s ease;
}

.progress-bar.accent {
  background: linear-gradient(90deg, #f59e0b, #facc15);
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
