<template>
  <div class="content-card">
    <div class="section-title">生产管理</div>
    <div class="actions-row">
      <button class="primary-btn" @click="showPlanModal = true">新增生产计划</button>
      <button class="secondary-btn" @click="showInputModal = true">投入品登记</button>
      <button class="secondary-btn" @click="startWorkOrder">启动工单进度</button>
    </div>

    <div class="card-grid" style="margin-top: 16px; align-items: stretch;">
      <div class="stat-card" style="grid-column: span 2; min-width: 320px;">
        <strong>周度产量监控 (吨)</strong>
        <canvas ref="yieldCanvas" height="120"></canvas>
      </div>
      <div class="stat-card">
        <div class="stat-label">当前在产地块</div>
        <div class="stat-value">18</div>
        <span class="badge">水肥一体化 12 · 露地 6</span>
      </div>
      <div class="stat-card">
        <div class="stat-label">农机在线率</div>
        <div class="stat-value">92%</div>
        <span class="badge">7 台田间作业</span>
      </div>
    </div>

    <div class="table-wrapper" style="margin-top: 18px;">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom: 8px;">
        <strong>生产批次进度</strong>
        <span class="tag">总计 {{ batches.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>批次号</th>
            <th>作物</th>
            <th>负责人</th>
            <th>播种日期</th>
            <th>预计收获</th>
            <th>进度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in batches" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.crop }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.sow }}</td>
            <td>{{ row.harvest }}</td>
            <td>
              <div class="progress-track" style="width:140px;">
                <div class="progress-bar" :style="{ width: row.progress + '%' }"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Modal title="新增生产计划" :show="showPlanModal" @close="showPlanModal = false">
    <form class="form-grid" @submit.prevent="submitPlan">
      <label>作物名称<input v-model="planForm.crop" required /></label>
      <label>计划播种日期<input v-model="planForm.date" type="date" required /></label>
      <label>预计亩产(kg)<input v-model.number="planForm.yield" type="number" min="0" /></label>
      <label>责任人<input v-model="planForm.owner" /></label>
      <label style="grid-column: span 2;">备注<textarea v-model="planForm.note" rows="3"></textarea></label>
      <div style="grid-column: span 2; display:flex; gap:10px; justify-content:flex-end;">
        <button class="secondary-btn" type="button" @click="showPlanModal = false">取消</button>
        <button class="primary-btn" type="submit">提交计划</button>
      </div>
    </form>
  </Modal>

  <Modal title="投入品登记" :show="showInputModal" @close="showInputModal = false">
    <form class="form-grid" @submit.prevent="submitInput">
      <label>投入品名称<input v-model="inputForm.name" required /></label>
      <label>使用剂量(L/kg)<input v-model="inputForm.dosage" required /></label>
      <label>使用时间<input v-model="inputForm.time" type="datetime-local" required /></label>
      <label>对应批次<select v-model="inputForm.batch">
        <option v-for="row in batches" :key="row.id" :value="row.id">{{ row.id }}</option>
      </select></label>
      <label style="grid-column: span 2;">安全间隔(日)<input type="number" min="0" v-model.number="inputForm.interval" /></label>
      <div style="grid-column: span 2; display:flex; gap:10px; justify-content:flex-end;">
        <button class="secondary-btn" type="button" @click="showInputModal = false">取消</button>
        <button class="primary-btn" type="submit">登记投入</button>
      </div>
    </form>
  </Modal>

  <Modal title="工单执行进度" :show="showProgressModal" @close="showProgressModal = false">
    <p>正在下发田间作业指令，实时追踪执行。</p>
    <div class="progress-track" style="margin: 12px 0;">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <p style="margin:0;">当前进度：{{ progress }}%</p>
  </Modal>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import Modal from '../components/Modal.vue';

const batches = [
  { id: 'PD-2301', crop: '番茄', owner: '李明', sow: '2024-03-01', harvest: '2024-05-28', progress: 82 },
  { id: 'PD-2302', crop: '黄瓜', owner: '王芳', sow: '2024-03-05', harvest: '2024-06-02', progress: 68 },
  { id: 'PD-2303', crop: '草莓', owner: '张伟', sow: '2024-02-25', harvest: '2024-05-10', progress: 91 },
  { id: 'PD-2304', crop: '生菜', owner: '刘洋', sow: '2024-03-12', harvest: '2024-04-25', progress: 55 },
  { id: 'PD-2305', crop: '青椒', owner: '赵敏', sow: '2024-02-28', harvest: '2024-06-06', progress: 44 },
  { id: 'PD-2306', crop: '玉米', owner: '宋涛', sow: '2024-03-10', harvest: '2024-07-20', progress: 38 },
  { id: 'PD-2307', crop: '大豆', owner: '陈强', sow: '2024-02-18', harvest: '2024-06-30', progress: 60 },
  { id: 'PD-2308', crop: '油菜', owner: '孙丽', sow: '2024-01-30', harvest: '2024-05-05', progress: 88 },
  { id: 'PD-2309', crop: '辣椒', owner: '周杰', sow: '2024-03-08', harvest: '2024-06-15', progress: 52 },
  { id: 'PD-2310', crop: '茄子', owner: '吴敏', sow: '2024-02-22', harvest: '2024-05-30', progress: 73 }
];

const showPlanModal = ref(false);
const showInputModal = ref(false);
const showProgressModal = ref(false);
const progress = ref(0);
const intervalId = ref(null);

const planForm = reactive({ crop: '', date: '', yield: '', owner: '', note: '' });
const inputForm = reactive({ name: '', dosage: '', time: '', batch: batches[0].id, interval: 0 });

const yieldCanvas = ref(null);
let chartInstance;

onMounted(() => {
  chartInstance = new Chart(yieldCanvas.value, {
    type: 'line',
    data: {
      labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周'],
      datasets: [
        {
          label: '产量',
          data: [220, 240, 260, 310, 330, 360, 420, 450, 470, 520],
          borderColor: '#36b3f9',
          backgroundColor: 'rgba(54, 179, 249, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#2ec4b6'
        }
      ]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
  clearInterval(intervalId.value);
});

const submitPlan = () => {
  alert(`已提交 ${planForm.crop} 计划，播种日 ${planForm.date}`);
  showPlanModal.value = false;
};

const submitInput = () => {
  alert(`已登记 ${inputForm.name} 到批次 ${inputForm.batch}`);
  showInputModal.value = false;
};

const startWorkOrder = () => {
  progress.value = 0;
  showProgressModal.value = true;
  clearInterval(intervalId.value);
  intervalId.value = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(intervalId.value);
      return;
    }
    progress.value += 10;
  }, 400);
};
</script>
