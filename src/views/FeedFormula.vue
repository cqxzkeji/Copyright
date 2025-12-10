<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>饲料配比优化</h2>
        <p class="muted">根据畜禽阶段智能平衡营养与成本，实时验证配方结果。</p>
      </div>
      <div class="module-actions">
        <button @click="startOptimization">开始优化</button>
        <button class="ghost" @click="showForm = true">保存方案</button>
        <button class="ghost" @click="showHint = true">查看提示</button>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>配方成本与营养平衡</h3>
        <canvas ref="chartRef" height="240"></canvas>
      </div>
      <div class="card">
        <h3>营养指标达成率</h3>
        <ul class="metric-list">
          <li v-for="metric in metrics" :key="metric.label">
            <div>
              <p class="metric-name">{{ metric.label }}</p>
              <p class="muted">目标：{{ metric.target }}，当前：{{ metric.current }}</p>
            </div>
            <div class="progress">
              <div class="progress-bar" :style="{ width: metric.achieve + '%' }"></div>
            </div>
            <span class="badge" :class="metric.achieve >= 90 ? 'status-positive' : 'status-warning'">{{ metric.achieve }}%</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="card">
      <div class="table-header">
        <h3>配方对比（近十次计算）</h3>
        <span class="muted">包含能值、蛋白、成本等 10 条数据</span>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>配方名称</th>
              <th>代谢能(MJ/kg)</th>
              <th>粗蛋白(%)</th>
              <th>钙(%)</th>
              <th>磷(%)</th>
              <th>成本(元/吨)</th>
              <th>适用阶段</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in formulas" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.energy }}</td>
              <td>{{ item.protein }}</td>
              <td>{{ item.calcium }}</td>
              <td>{{ item.phosphorus }}</td>
              <td>{{ item.cost }}</td>
              <td>{{ item.stage }}</td>
              <td><span class="badge" :class="statusClass(item.status)">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog v-model="showForm" title="保存优化方案" subtitle="填写方案信息并提交审核">
      <form class="modal-form" @submit.prevent="submitForm">
        <label>方案名称</label>
        <input v-model="form.name" required placeholder="例如：肉鸡生长期高效配方" />
        <label>备注</label>
        <textarea v-model="form.note" rows="3" placeholder="输入方案背景、试验编号等" />
        <div class="modal-actions">
          <button class="ghost" type="button" @click="showForm = false">取消</button>
          <button type="submit">提交保存</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showHint" title="优化提示">
      <p>根据原料价格波动优先锁定高能值玉米批次，蛋白不足时自动提高豆粕占比 1-2%。</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="优化进度" subtitle="正在模拟 100 组配比方案" width="520px">
      <div class="progress-box">
        <div class="progress">
          <div class="progress-bar accent" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="muted">{{ progress }}% 已完成，预计 {{ 5 - Math.floor(progress / 25) }} 秒</p>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const chartRef = ref(null);
const chartInstance = ref(null);
const showForm = ref(false);
const showHint = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const timer = ref(null);

const form = reactive({ name: '', note: '' });

const formulas = reactive([
  { id: 1, name: '高效育肥一号', energy: 12.6, protein: 19.2, calcium: 0.9, phosphorus: 0.65, cost: 2680, stage: '育肥前期', status: '稳定' },
  { id: 2, name: '高效育肥二号', energy: 12.4, protein: 18.8, calcium: 0.88, phosphorus: 0.62, cost: 2635, stage: '育肥后期', status: '优化中' },
  { id: 3, name: '母猪维持', energy: 12.8, protein: 16.5, calcium: 0.92, phosphorus: 0.68, cost: 2550, stage: '妊娠期', status: '稳定' },
  { id: 4, name: '肉鸡速长', energy: 13.1, protein: 21.4, calcium: 0.94, phosphorus: 0.7, cost: 2750, stage: '快速育肥', status: '超标' },
  { id: 5, name: '蛋鸡稳产', energy: 11.9, protein: 17.8, calcium: 3.4, phosphorus: 0.55, cost: 2450, stage: '产蛋期', status: '稳定' },
  { id: 6, name: '反刍日粮A', energy: 11.3, protein: 15.2, calcium: 0.85, phosphorus: 0.54, cost: 2310, stage: '反刍育肥', status: '优化中' },
  { id: 7, name: '羔羊提增', energy: 11.6, protein: 18.6, calcium: 0.91, phosphorus: 0.6, cost: 2395, stage: '羔羊断奶', status: '稳定' },
  { id: 8, name: '青年猪生长', energy: 12.2, protein: 17.9, calcium: 0.86, phosphorus: 0.63, cost: 2520, stage: '青年猪', status: '稳定' },
  { id: 9, name: '肉牛提膘', energy: 10.8, protein: 14.4, calcium: 0.8, phosphorus: 0.52, cost: 2250, stage: '育肥期', status: '优化中' },
  { id: 10, name: '断奶补料', energy: 12.0, protein: 20.1, calcium: 0.9, phosphorus: 0.64, cost: 2690, stage: '断奶仔猪', status: '稳定' }
]);

const metrics = [
  { label: '可代谢能', target: '12.5 MJ/kg', current: '12.6 MJ/kg', achieve: 98 },
  { label: '粗蛋白', target: '19%', current: '19.2%', achieve: 95 },
  { label: '钙磷平衡', target: '0.9% / 0.6%', current: '0.9% / 0.65%', achieve: 92 },
  { label: '赖氨酸', target: '1.15%', current: '1.12%', achieve: 88 }
];

const statusClass = (status) => {
  if (status === '超标') return 'status-negative';
  if (status === '优化中') return 'status-warning';
  return 'status-positive';
};

const buildChart = () => {
  if (!chartRef.value) return;
  chartInstance.value = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: ['方案1', '方案2', '方案3', '方案4', '方案5', '方案6', '方案7', '方案8'],
      datasets: [
        {
          label: '成本 (元/吨)',
          data: [2700, 2650, 2600, 2580, 2550, 2530, 2520, 2500],
          borderColor: '#3c7be6',
          tension: 0.4,
          fill: false
        },
        {
          label: '可代谢能 (MJ/kg)',
          data: [12.2, 12.4, 12.5, 12.6, 12.5, 12.7, 12.6, 12.8],
          borderColor: '#f59e0b',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: false, title: { display: true, text: '成本' } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '能值' } }
      }
    }
  });
};

const startOptimization = () => {
  progress.value = 0;
  showProgress.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer.value);
      showProgress.value = false;
      showHint.value = true;
    } else {
      progress.value += 10;
    }
  }, 500);
};

const submitForm = () => {
  showForm.value = false;
  showHint.value = true;
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

.modal-form input,
.modal-form textarea {
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

.progress-box {
  display: grid;
  gap: 10px;
}
</style>
