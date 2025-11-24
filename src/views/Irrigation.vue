<template>
  <div class="irrigation">
    <section class="summary">
      <div class="info">
        <h3>今日水量分配</h3>
        <p>总额度：1,250 m³ · 已使用 48%</p>
      </div>
      <div class="progress">
        <div class="bar" :style="{ width: usage + '%' }"></div>
      </div>
      <span>{{ usage }}%</span>
    </section>

    <section class="controls">
      <button @click="startPlan">启动精准灌溉</button>
      <button class="ghost" @click="openModal('创建轮灌计划', '根据 AI 预测生成 3 个轮灌方案，已保存至待执行列表。')">
        生成轮灌方案
      </button>
      <button class="ghost" @click="openModal('能耗校准', '泵房能耗正常，功率系数 0.92。')">能耗校准</button>
      <button class="ghost" @click="openModal('阀门巡检', '12 个阀门全部正常，无需人工处理。')">阀门巡检</button>
    </section>

    <section class="zones">
      <article v-for="zone in zones" :key="zone.name" class="zone">
        <div>
          <h4>{{ zone.name }}</h4>
          <p>需水量 {{ zone.need }} m³</p>
        </div>
        <button @click="openModal(zone.name, zone.plan)">查看方案</button>
      </article>
    </section>

    <ProgressModal
      v-if="progressVisible"
      title="精准灌溉执行中"
      description="正在按流量曲线调节泵速"
      :progress="execution"
      @close="progressVisible = false"
    />
    <ModalDialog v-if="modalVisible" :title="modalTitle" @close="modalVisible = false">
      <p>{{ modalContent }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProgressModal from '../components/ProgressModal.vue';
import ModalDialog from '../components/ModalDialog.vue';

const usage = 48;
const zones = [
  { name: '西南番茄区', need: 180, plan: '以 2.6 m³/h 流量运行 15 分钟。' },
  { name: '北部玉米区', need: 320, plan: '先进行 8 分钟预润，再转入滴灌。' },
  { name: '东部葡萄区', need: 260, plan: '夜间 21:00 进行，以降低蒸发损耗。' }
];

const progressVisible = ref(false);
const execution = ref(0);
const modalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
let timer;

const startPlan = () => {
  progressVisible.value = true;
  execution.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (execution.value >= 100) {
      clearInterval(timer);
      return;
    }
    execution.value += 12;
  }, 500);
};

const openModal = (title, content) => {
  modalVisible.value = true;
  modalTitle.value = title;
  modalContent.value = content;
};
</script>

<style scoped>
.irrigation {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary {
  background: #0f172a;
  color: #fff;
  padding: 1.5rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
}

.bar {
  background: linear-gradient(120deg, #34d399, #38bdf8);
  height: 100%;
  transition: width 0.3s ease;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

button {
  border: none;
  border-radius: 16px;
  padding: 0.65rem 1.25rem;
  cursor: pointer;
  font-weight: 600;
  background: #22c55e;
  color: #fff;
}

button.ghost {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}

.zones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.zone {
  background: #f8fafc;
  padding: 1.2rem;
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
