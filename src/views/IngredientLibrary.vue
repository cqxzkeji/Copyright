<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>饲料原料库</h2>
        <p class="muted">管理玉米、豆粕等基础原料的营养档案与库存动态。</p>
      </div>
      <div class="module-actions">
        <button @click="showAdd = true">新增原料</button>
        <button class="ghost" @click="syncStock">同步库存</button>
        <button class="ghost" @click="showInfo = true">原料提示</button>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>库存分布</h3>
        <canvas ref="chartRef" height="240"></canvas>
      </div>
      <div class="card">
        <h3>原料安全状态</h3>
        <div class="summary">
          <div class="summary-item" v-for="item in summary" :key="item.label">
            <p class="muted">{{ item.label }}</p>
            <p class="summary-value">{{ item.value }}</p>
            <p class="badge" :class="item.status">{{ item.note }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="table-header">
        <h3>原料营养档案</h3>
        <span class="muted">包含能值、蛋白、库存 10 条记录</span>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>原料</th>
              <th>等级</th>
              <th>代谢能(MJ/kg)</th>
              <th>粗蛋白(%)</th>
              <th>水分(%)</th>
              <th>库存(吨)</th>
              <th>批次</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ingredients" :key="item.name + item.batch">
              <td>{{ item.name }}</td>
              <td>{{ item.grade }}</td>
              <td>{{ item.energy }}</td>
              <td>{{ item.protein }}</td>
              <td>{{ item.moisture }}</td>
              <td>{{ item.stock }}</td>
              <td>{{ item.batch }}</td>
              <td><span class="badge" :class="statusClass(item.status)">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog v-model="showAdd" title="新增原料" subtitle="填写原料基础信息">
      <form class="modal-form" @submit.prevent="submitIngredient">
        <label>原料名称</label>
        <input v-model="form.name" required placeholder="例如：高能玉米" />
        <label>库存(吨)</label>
        <input v-model.number="form.stock" type="number" min="0" />
        <div class="modal-actions">
          <button class="ghost" type="button" @click="showAdd = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showInfo" title="使用提示">
      <p>检测水分超过 13% 的玉米需优先烘干；豆粕存放超过 30 天需复检霉菌毒素。</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="同步进度" subtitle="正在与仓储系统同步库存">
      <div class="progress">
        <div class="progress-bar accent" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="muted" style="margin-top: 10px">同步完成后将自动刷新库存分布图。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const chartRef = ref(null);
const chartInstance = ref(null);
const showAdd = ref(false);
const showInfo = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const timer = ref(null);

const form = reactive({ name: '', stock: 0 });

const summary = [
  { label: '安全库存', value: '6/8 种原料', note: '库存充足', status: 'status-positive' },
  { label: '待复检批次', value: '2 批', note: '需复检', status: 'status-warning' },
  { label: '低库存原料', value: '1 种', note: '优先采购', status: 'status-warning' }
];

const ingredients = reactive([
  { name: '玉米', grade: '一级', energy: 13.2, protein: 8.5, moisture: 12.5, stock: 420, batch: 'C-2311', status: '合格' },
  { name: '豆粕', grade: '43%蛋白', energy: 12.8, protein: 43.2, moisture: 11.0, stock: 260, batch: 'S-2308', status: '合格' },
  { name: '菜粕', grade: '36%蛋白', energy: 11.1, protein: 36.5, moisture: 11.8, stock: 140, batch: 'R-2306', status: '合格' },
  { name: 'DDGS', grade: '高能', energy: 14.0, protein: 27.5, moisture: 10.5, stock: 90, batch: 'D-2302', status: '合格' },
  { name: '鱼粉', grade: '65%蛋白', energy: 12.5, protein: 65.0, moisture: 8.2, stock: 45, batch: 'F-2305', status: '需复检' },
  { name: '磷酸氢钙', grade: '优级品', energy: 0, protein: 0, moisture: 4.0, stock: 35, batch: 'P-2307', status: '合格' },
  { name: '石粉', grade: '饲料级', energy: 0, protein: 0, moisture: 2.0, stock: 50, batch: 'L-2304', status: '合格' },
  { name: '赖氨酸', grade: '98%', energy: 0, protein: 0, moisture: 1.0, stock: 12, batch: 'AA-2301', status: '合格' },
  { name: '苏氨酸', grade: '98%', energy: 0, protein: 0, moisture: 1.2, stock: 10, batch: 'AA-2302', status: '合格' },
  { name: '玉米胚芽粕', grade: '20%蛋白', energy: 11.6, protein: 20.0, moisture: 12.0, stock: 70, batch: 'G-2303', status: '需复检' }
]);

const statusClass = (status) => (status === '需复检' ? 'status-warning' : 'status-positive');

const buildChart = () => {
  const labels = ingredients.map((item) => item.name);
  const data = ingredients.map((item) => item.stock);
  chartInstance.value = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#3c7be6', '#6ec1e4', '#f5a524', '#34d399', '#a855f7', '#f97316', '#60a5fa', '#f472b6', '#22c55e', '#eab308']
        }
      ]
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      cutout: '60%'
    }
  });
};

const submitIngredient = () => {
  ingredients.push({
    name: form.name,
    grade: '待定',
    energy: 0,
    protein: 0,
    moisture: 0,
    stock: form.stock,
    batch: '待分配',
    status: '需复检'
  });
  showAdd.value = false;
  showInfo.value = true;
};

const syncStock = () => {
  progress.value = 0;
  showProgress.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer.value);
      showProgress.value = false;
      showInfo.value = true;
    } else {
      progress.value += 15;
    }
  }, 400);
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
