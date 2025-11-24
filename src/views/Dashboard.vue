<template>
  <div class="dashboard">
    <section class="stats">
      <article v-for="item in overview" :key="item.label" class="card">
        <header>
          <p>{{ item.label }}</p>
          <span :class="['chip', item.trend > 0 ? 'up' : 'down']">
            {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}%
          </span>
        </header>
        <strong>{{ item.value }}</strong>
        <div class="sparkline">
          <span v-for="(val, index) in item.series" :key="index" :style="{ height: val + '%' }"></span>
        </div>
      </article>
    </section>

    <section class="flex panels">
      <div class="panel chart">
        <div class="panel-head">
          <h3>墒情趋势</h3>
          <button class="ghost" @click="openModal('soil')">预警说明</button>
        </div>
        <div class="chart-grid">
          <div v-for="(item, index) in soilMoisture" :key="item.label" class="bar">
            <div class="fill" :style="{ height: item.value + '%' }"></div>
            <small>{{ item.label }}</small>
            <span>{{ item.value }}%</span>
          </div>
        </div>
      </div>
      <div class="panel tasks">
        <div class="panel-head">
          <h3>今日调度</h3>
          <button @click="triggerInspection">运行自检</button>
        </div>
        <ul>
          <li v-for="task in tasks" :key="task.name">
            <div>
              <p>{{ task.name }}</p>
              <small>{{ task.time }}</small>
            </div>
            <button class="ghost" @click="openModal(task.name)">详情</button>
          </li>
        </ul>
      </div>
    </section>

    <ModalDialog v-if="modalVisible" :title="modalTitle" @close="modalVisible = false">
      <p>{{ modalContent }}</p>
    </ModalDialog>
    <ProgressModal
      v-if="inspectionVisible"
      title="系统自检"
      description="正在校验节点连通性与数据完整性"
      :progress="inspectionProgress"
      @close="inspectionVisible = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const overview = [
  { label: '在线传感器', value: '36 台', trend: 8, series: [30, 40, 50, 60, 65, 70] },
  { label: '平均墒情', value: '52%', trend: -5, series: [80, 70, 60, 55, 52, 52] },
  { label: '可用水量', value: '1,250 m³', trend: 14, series: [20, 30, 45, 60, 75, 85] },
  { label: '作物长势指数', value: '87', trend: 3, series: [60, 65, 70, 74, 80, 87] }
];

const soilMoisture = [
  { label: '1号区', value: 48 },
  { label: '2号区', value: 35 },
  { label: '3号区', value: 62 },
  { label: '4号区', value: 55 },
  { label: '5号区', value: 41 }
];

const tasks = [
  { name: '无人机巡检', time: '09:30 - 自动完成' },
  { name: '滴灌带冲洗', time: '13:00 - 待启动' },
  { name: '养分配方调整', time: '15:30 - 等待审核' }
];

const modalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const inspectionVisible = ref(false);
const inspectionProgress = ref(0);
let timer;

const openModal = (key) => {
  modalVisible.value = true;
  modalTitle.value = key === 'soil' ? '墒情预警说明' : key;
  modalContent.value =
    key === 'soil'
      ? '2号区墒情低至 35%，建议在 2 小时内安排滴灌 15 分钟，防止土壤板结。'
      : `${key} 正在等待执行，系统已根据气象和能耗预测调整优先级。`;
};

const triggerInspection = () => {
  inspectionVisible.value = true;
  inspectionProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (inspectionProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    inspectionProgress.value += 15;
  }, 500);
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.card {
  background: #f8fafc;
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chip {
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  color: #fff;
}

.chip.up {
  background: #22c55e;
}

.chip.down {
  background: #ef4444;
}

strong {
  font-size: 1.5rem;
}

.sparkline {
  display: flex;
  gap: 0.25rem;
  align-items: flex-end;
  height: 50px;
}

.sparkline span {
  flex: 1;
  border-radius: 6px;
  background: rgba(79, 70, 229, 0.2);
}

.panels {
  gap: 1.5rem;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  min-width: 280px;
  background: #f8fafc;
  border-radius: 22px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-grid {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.bar {
  flex: 1;
  text-align: center;
}

.fill {
  width: 100%;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(180deg, #34d399, #22d3ee);
  transition: height 0.3s ease;
}

.bar span {
  display: block;
  margin-top: 0.35rem;
  font-weight: 600;
}

.tasks ul {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0.75rem 1rem;
  border-radius: 12px;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.35rem 0.95rem;
  cursor: pointer;
  font-weight: 600;
  background: #22c55e;
  color: #fff;
}

button.ghost {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}
</style>
