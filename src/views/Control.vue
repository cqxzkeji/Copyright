<template>
  <div class="module-shell">
    <section class="module-header">
      <div>
        <h2>设备控制与调度</h2>
        <p>集中编队指令、调度策略与多集群联动。</p>
      </div>
      <div class="header-btns">
        <button class="secondary-btn" @click="setScenario('夜间巡逻', '夜间巡逻队列已就位，预计 12 分钟全部到岗。')">夜巡编队</button>
        <button class="primary-btn" @click="startDeployment">下发调度</button>
      </div>
    </section>

    <div class="device-grid">
      <div class="card device" v-for="device in devices" :key="device.id">
        <div class="device-header">
          <h3>{{ device.name }}</h3>
          <span class="tag">{{ device.status }}</span>
        </div>
        <p>{{ device.desc }}</p>
        <div class="device-actions">
          <button class="secondary-btn" @click="toggle(device.id)">{{ device.active ? '挂起' : '激活' }}</button>
          <button class="secondary-btn" @click="inspect(device)">校验链路</button>
        </div>
      </div>
    </div>

    <div class="queue-panel">
      <h3>调度队列</h3>
      <ul>
        <li v-for="task in queue" :key="task.id">
          <span>{{ task.name }}</span>
          <button class="secondary-btn" @click="setScenario(task.name, task.detail)">详情</button>
        </li>
      </ul>
    </div>

    <BaseModal v-if="modal" :title="modal.title" @close="modal = null">
      <p>{{ modal.message }}</p>
      <template #footer></template>
    </BaseModal>

    <BaseModal v-if="showProgress" title="调度执行">
      <p>调度已完成 {{ progress }}%，请保持链路畅通。</p>
      <div class="progress-shell">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const devices = ref([
  { id: 1, name: '北区机动平台', status: '可执行', active: true, desc: '6x6 轮式平台，携带侦察模块' },
  { id: 2, name: '能源补给站', status: '自检中', active: false, desc: '移动能源集装箱，容量 1.2MWh' },
  { id: 3, name: '南域水面无人艇', status: '巡航', active: true, desc: '具备潮流补偿与水下探测' },
  { id: 4, name: '空基光电阵列', status: '待机', active: false, desc: '超光谱成像系统，支持 120km 侦察' }
]);

const queue = ref([
  { id: 1, name: '边界巡逻', detail: '沿北部预定航线巡逻并回传影像' },
  { id: 2, name: '能源补给', detail: '前推 2 号中继站执行补能任务' },
  { id: 3, name: '联合侦察', detail: '空地协同侦察，对重点目标标绘' }
]);

const modal = ref(null);
const showProgress = ref(false);
const progress = ref(0);
let timer;

const setScenario = (title, message) => {
  modal.value = { title, message };
};

const toggle = (id) => {
  devices.value = devices.value.map((device) =>
    device.id === id
      ? {
          ...device,
          active: !device.active,
          status: device.active ? '挂起' : '可执行'
        }
      : device
  );
  setScenario('状态切换', '设备状态已同步至所有调度节点。');
};

const inspect = (device) => {
  setScenario('链路校验', `${device.name} 的链路延迟 16ms，稳定性 99.3%。`);
};

const startDeployment = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 600);
      setScenario('调度完成', '所有指令均已确认执行。');
    } else {
      progress.value += 12;
    }
  }, 350);
};
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.device-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.device {
  flex: 1 1 260px;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.device-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.queue-panel {
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.queue-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.queue-panel li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}

.queue-panel li:last-child {
  border-bottom: none;
}
</style>
