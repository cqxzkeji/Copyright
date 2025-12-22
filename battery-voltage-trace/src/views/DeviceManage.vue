<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>设备管理</h2>
        <p>实时掌握蓄电池采集终端状态与巡检节奏</p>
      </div>
      <div class="action-group">
        <button class="primary" @click="openModal('add')">新增设备</button>
        <button class="secondary" @click="openModal('patrol')">批量巡检</button>
        <button class="secondary" @click="openModal('tip')">状态提示</button>
      </div>
    </div>

    <div class="stats">
      <div class="card">
        <h3>在线设备</h3>
        <strong>{{ onlineCount }}</strong>
        <span>较昨日 +3</span>
      </div>
      <div class="card">
        <h3>异常告警</h3>
        <strong>{{ alertCount }}</strong>
        <span>待处理 2</span>
      </div>
      <div class="card">
        <h3>巡检完成率</h3>
        <strong>92%</strong>
        <span>本周计划</span>
      </div>
    </div>

    <div class="layout">
      <div class="panel">
        <h3>设备列表</h3>
        <table>
          <thead>
            <tr>
              <th>设备编号</th>
              <th>站点</th>
              <th>电压(V)</th>
              <th>健康度</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devices" :key="device.id">
              <td>{{ device.id }}</td>
              <td>{{ device.site }}</td>
              <td>{{ device.voltage }}</td>
              <td>{{ device.health }}%</td>
              <td>
                <span class="tag" :class="device.statusClass">{{ device.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel">
        <h3>采集覆盖示意</h3>
        <div class="chart-box">
          <svg viewBox="0 0 320 200" class="chart">
            <rect x="0" y="0" width="320" height="200" rx="16" fill="#f4f7ff" />
            <polyline
              points="20,140 60,120 100,130 140,90 180,100 220,70 260,80 300,50"
              fill="none"
              stroke="#5b74ff"
              stroke-width="4"
            />
            <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="5" fill="#7fb0ff" />
          </svg>
          <div class="legend">
            <div>
              <span class="dot"></span>
              设备巡检覆盖率曲线
            </div>
            <p>采集网络覆盖稳定，建议新增边缘节点 2 台。</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button class="close" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'add'" @submit.prevent="submitDevice">
            <label>
              设备编号
              <input v-model="form.id" required placeholder="例如：DV-1201" />
            </label>
            <label>
              站点名称
              <input v-model="form.site" required placeholder="例如：北区 3 号机房" />
            </label>
            <label>
              初始电压
              <input v-model="form.voltage" required type="number" step="0.01" />
            </label>
            <label>
              健康度
              <input v-model="form.health" required type="number" min="0" max="100" />
            </label>
            <div class="modal-actions">
              <button class="secondary" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">提交登记</button>
            </div>
          </form>

          <div v-else-if="modal.type === 'patrol'" class="progress-box">
            <p>正在同步巡检结果，请保持网络稳定。</p>
            <div class="progress">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-text">已完成 {{ progress }}%</div>
            <button class="primary" @click="closeModal" :disabled="progress < 100">完成</button>
          </div>

          <div v-else class="tip-box">
            <p>今日设备状态稳定，3 台设备建议补充电压采样。</p>
            <button class="primary" @click="closeModal">知道了</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';

const devices = ref([
  { id: 'DV-1001', site: '南区 A1', voltage: 12.41, health: 96, status: '在线', statusClass: 'ok' },
  { id: 'DV-1002', site: '南区 A2', voltage: 12.12, health: 93, status: '在线', statusClass: 'ok' },
  { id: 'DV-1003', site: '南区 A3', voltage: 11.98, health: 88, status: '预警', statusClass: 'warn' },
  { id: 'DV-1004', site: '东区 B1', voltage: 12.55, health: 97, status: '在线', statusClass: 'ok' },
  { id: 'DV-1005', site: '东区 B2', voltage: 12.22, health: 90, status: '在线', statusClass: 'ok' },
  { id: 'DV-1006', site: '东区 B3', voltage: 11.76, health: 82, status: '预警', statusClass: 'warn' },
  { id: 'DV-1007', site: '西区 C1', voltage: 12.63, health: 98, status: '在线', statusClass: 'ok' },
  { id: 'DV-1008', site: '西区 C2', voltage: 12.18, health: 91, status: '在线', statusClass: 'ok' },
  { id: 'DV-1009', site: '北区 D1', voltage: 12.05, health: 87, status: '预警', statusClass: 'warn' },
  { id: 'DV-1010', site: '北区 D2', voltage: 12.47, health: 95, status: '在线', statusClass: 'ok' }
]);

const points = [
  { x: 20, y: 140 },
  { x: 60, y: 120 },
  { x: 100, y: 130 },
  { x: 140, y: 90 },
  { x: 180, y: 100 },
  { x: 220, y: 70 },
  { x: 260, y: 80 },
  { x: 300, y: 50 }
];

const form = reactive({
  id: '',
  site: '',
  voltage: 12.4,
  health: 95
});

const modal = reactive({
  visible: false,
  type: 'add',
  title: ''
});

const progress = ref(0);
let timer;

const onlineCount = computed(() => devices.value.filter((item) => item.status === '在线').length);
const alertCount = computed(() => devices.value.filter((item) => item.status !== '在线').length);

const openModal = (type) => {
  modal.visible = true;
  modal.type = type;
  modal.title = type === 'add' ? '新增设备登记' : type === 'patrol' ? '巡检进度' : '设备状态提醒';
};

const closeModal = () => {
  modal.visible = false;
  progress.value = 0;
  clearInterval(timer);
};

const submitDevice = () => {
  devices.value.unshift({
    id: form.id,
    site: form.site,
    voltage: Number(form.voltage).toFixed(2),
    health: Number(form.health),
    status: '在线',
    statusClass: 'ok'
  });
  form.id = '';
  form.site = '';
  form.voltage = 12.4;
  form.health = 95;
  closeModal();
};

watch(
  () => modal.type,
  (value) => {
    if (value === 'patrol' && modal.visible) {
      progress.value = 0;
      clearInterval(timer);
      timer = setInterval(() => {
        progress.value = Math.min(progress.value + 12, 100);
        if (progress.value >= 100) {
          clearInterval(timer);
        }
      }, 400);
    }
  }
);
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.page-header h2 {
  margin: 0 0 6px;
}

.page-header p {
  margin: 0;
  color: #6f7b94;
}

.action-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary,
.secondary {
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
}

.primary {
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
  color: #fff;
}

.secondary {
  background: #f1f5ff;
  color: #3a4a70;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(31, 42, 68, 0.08);
}

.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #7d8aa5;
}

.card strong {
  font-size: 24px;
}

.card span {
  display: block;
  color: #98a3ba;
  margin-top: 6px;
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.panel {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(31, 42, 68, 0.08);
}

.panel h3 {
  margin-top: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  text-align: left;
  padding: 10px 6px;
  border-bottom: 1px solid #eef1f6;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #e7f8ef;
  color: #1c7a4d;
}

.tag.warn {
  background: #fff4e5;
  color: #c57600;
}

.chart-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart {
  width: 100%;
}

.legend {
  font-size: 13px;
  color: #7d8aa5;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #7fb0ff;
  margin-right: 6px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal {
  background: #fff;
  width: min(480px, 92vw);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(31, 42, 68, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  margin-top: 16px;
}

.modal-body form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-body input {
  border: 1px solid #d9e1f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.progress {
  background: #f0f3fa;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
  margin: 16px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
  transition: width 0.4s ease;
}

.progress-text {
  color: #6f7b94;
  margin-bottom: 12px;
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
