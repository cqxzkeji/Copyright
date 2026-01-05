<template>
  <div class="dashboard-grid">
    <div class="card">
      <div class="flex-between">
        <h2 class="section-title">电压数据采集</h2>
        <div class="table-actions">
          <button class="btn" @click="startTask">启动采集</button>
          <button class="btn secondary" @click="stopTask">停止采集</button>
        </div>
      </div>
      <p class="hint">实时采集蓄电池电压，任务状态：{{ taskStatus }}</p>
      <div class="chart-box">
        <svg viewBox="0 0 300 140" style="width: 100%; height: 160px;">
          <polyline
            :points="chartPoints"
            fill="url(#grad)"
            stroke="var(--primary)"
            stroke-width="2"
          />
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#2c7ef8" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div class="status-list">
          <div class="kpi" v-for="kpi in kpis" :key="kpi.label">
            <span>{{ kpi.label }}</span>
            <strong>{{ kpi.value }}</strong>
            <small>{{ kpi.tip }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">采集任务</h3>
        <button class="btn" @click="openPlanModal">创建任务</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务名</th>
            <th>设备</th>
            <th>采集频率</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name">
            <td>{{ task.name }}</td>
            <td>{{ task.device }}</td>
            <td>{{ task.rate }}s</td>
            <td><span :class="['badge', statusClass(task.status)]">{{ task.status }}</span></td>
            <td class="table-actions">
              <button class="btn" @click="showTask(task)">查看</button>
              <button class="btn secondary" @click="pauseTask(task)">暂停</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="modal.type" class="modal-backdrop">
    <div class="modal-card">
      <div class="flex-between">
        <h3>{{ modal.title }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <div v-if="modal.type === 'progress'">
        <p>采集任务：{{ modal.content }}</p>
        <div class="progress-bar">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p style="color: var(--muted);">当前进度 {{ progress }}%</p>
      </div>
      <div v-else-if="modal.type === 'plan'">
        <div class="form-grid">
          <div>
            <label>任务名称</label>
            <input v-model="plan.name" class="input" placeholder="如：凌晨巡检" />
          </div>
          <div>
            <label>设备编号</label>
            <input v-model="plan.device" class="input" placeholder="选择设备" />
          </div>
          <div>
            <label>采集频率(秒)</label>
            <input v-model.number="plan.rate" class="input" type="number" min="1" />
          </div>
          <div>
            <label>时长(分钟)</label>
            <input v-model.number="plan.duration" class="input" type="number" min="1" />
          </div>
        </div>
        <div class="flex-between" style="margin-top: 12px;">
          <span class="chip">配置后会生成任务</span>
          <button class="btn" @click="createTask">保存任务</button>
        </div>
      </div>
      <div v-else-if="modal.type === 'view'">
        <p>任务：{{ currentTask.name }} ｜ 设备：{{ currentTask.device }}</p>
        <p>频率：{{ currentTask.rate }}s ｜ 状态：{{ currentTask.status }}</p>
        <p>运行时长：{{ currentTask.duration }} 分钟</p>
        <div class="progress-bar">
          <span :style="{ width: currentTask.percent + '%' }"></span>
        </div>
        <p style="color: var(--muted);">完成度 {{ currentTask.percent }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const voltageSamples = ref([12.4, 12.6, 12.7, 12.5, 12.8, 12.6, 12.7]);
const tasks = reactive([
  { name: '夜间巡检', device: 'D-001', rate: 5, status: '运行中', percent: 78, duration: 30 },
  { name: '白班抽检', device: 'D-004', rate: 10, status: '排队', percent: 12, duration: 20 },
  { name: '告警复测', device: 'D-011', rate: 3, status: '运行中', percent: 43, duration: 15 }
]);
const kpis = ref([
  { label: '实时平均电压', value: '12.6 V', tip: '采集窗口内平均值' },
  { label: '在线设备', value: '18 台', tip: 'WiFi / 蓝牙在线数量' },
  { label: '正在采集', value: '2 个任务', tip: '当前运行任务数' },
  { label: '今日数据量', value: '15.2 万条', tip: '自动存储入库' }
]);

const taskStatus = ref('待命');
const modal = reactive({ type: '', title: '', content: '' });
const progress = ref(0);
const plan = reactive({ name: '', device: '', rate: 5, duration: 15 });
const currentTask = ref({});

const chartPoints = computed(() => {
  const max = 13;
  const step = 300 / (voltageSamples.value.length - 1);
  return voltageSamples.value
    .map((v, i) => `${i * step},${140 - (v / max) * 120}`)
    .join(' ');
});

const statusClass = (status) => (status === '运行中' ? 'success' : 'warning');

const startTask = () => {
  taskStatus.value = '采集中';
  modal.type = 'progress';
  modal.title = '采集任务启动中';
  modal.content = '实时采集电压';
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 15);
    if (progress.value >= 100) clearInterval(timer);
  }, 500);
};

const stopTask = () => {
  taskStatus.value = '已停止';
  modal.type = 'progress';
  modal.title = '采集停止';
  modal.content = '正在安全收尾';
  progress.value = 100;
};

const openPlanModal = () => {
  modal.type = 'plan';
  modal.title = '新建采集任务';
};

const createTask = () => {
  tasks.push({
    name: plan.name || `临时任务${tasks.length + 1}`,
    device: plan.device || 'D-001',
    rate: plan.rate || 5,
    status: '排队',
    percent: 0,
    duration: plan.duration || 10
  });
  closeModal();
};

const showTask = (task) => {
  currentTask.value = task;
  modal.type = 'view';
  modal.title = '任务详情';
};

const pauseTask = (task) => {
  task.status = '排队';
  currentTask.value = task;
  modal.type = 'progress';
  modal.title = '任务暂停';
  modal.content = `任务 ${task.name} 正在暂停`; 
  progress.value = task.percent;
};

const closeModal = () => {
  modal.type = '';
};
</script>

<style scoped>
.hint {
  color: var(--muted);
  margin: 6px 0 12px;
}
</style>
