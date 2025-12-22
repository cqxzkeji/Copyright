<template>
  <div class="page">
    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h3>雷达实时画面</h3>
          <div class="card-actions">
            <button class="ghost" @click="openModal('calibration')">校准</button>
            <button class="primary" @click="openModal('scan')">开始扫描</button>
          </div>
        </div>
        <div class="radar">
          <svg viewBox="0 0 260 260" aria-label="雷达图">
            <circle cx="130" cy="130" r="120" />
            <circle cx="130" cy="130" r="90" />
            <circle cx="130" cy="130" r="60" />
            <circle cx="130" cy="130" r="30" />
            <line x1="130" y1="10" x2="130" y2="250" />
            <line x1="10" y1="130" x2="250" y2="130" />
            <path d="M130 130 L130 10 A120 120 0 0 1 225 55 Z" />
          </svg>
          <div class="radar-info">
            <div>
              <span>角度</span>
              <strong>68°</strong>
            </div>
            <div>
              <span>半径</span>
              <strong>32.4m</strong>
            </div>
            <div>
              <span>目标数</span>
              <strong>14</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>摄像头画面</h3>
          <div class="card-actions">
            <button class="ghost" @click="openModal('snapshot')">截图</button>
            <button class="primary" @click="openModal('switch')">切换视角</button>
          </div>
        </div>
        <div class="camera-grid">
          <div class="camera">
            <span>前置广角</span>
          </div>
          <div class="camera">
            <span>侧向视觉</span>
          </div>
          <div class="camera">
            <span>热成像</span>
          </div>
          <div class="camera">
            <span>夜视</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>实时目标列表</h3>
        <div class="card-actions">
          <button class="ghost" @click="openModal('filter')">筛选</button>
          <button class="primary" @click="openModal('export')">导出</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>类型</th>
              <th>距离</th>
              <th>速度</th>
              <th>置信度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in targets" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.range }}</td>
              <td>{{ item.speed }}</td>
              <td>{{ item.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <template v-if="activeModal === 'scan'">
          <h3>启动雷达扫描</h3>
          <form class="modal-form" @submit.prevent="submitModal">
            <label>
              <span>扫描半径</span>
              <input v-model="form.radius" type="number" min="10" max="120" />
            </label>
            <label>
              <span>扫描频率</span>
              <select v-model="form.frequency">
                <option>1 Hz</option>
                <option>5 Hz</option>
                <option>10 Hz</option>
              </select>
            </label>
            <label>
              <span>目标阈值</span>
              <input v-model="form.threshold" type="number" min="1" max="100" />
            </label>
            <div class="modal-actions">
              <button type="button" class="ghost" @click="closeModal">取消</button>
              <button type="submit" class="primary">开始扫描</button>
            </div>
          </form>
        </template>

        <template v-else-if="activeModal === 'snapshot'">
          <h3>截图保存</h3>
          <form class="modal-form" @submit.prevent="submitModal">
            <label>
              <span>截图名称</span>
              <input v-model="form.snapshot" type="text" placeholder="例如：雷达-0920" />
            </label>
            <label>
              <span>保存位置</span>
              <select v-model="form.location">
                <option>本地存储</option>
                <option>云端空间</option>
                <option>项目档案</option>
              </select>
            </label>
            <div class="modal-actions">
              <button type="button" class="ghost" @click="closeModal">取消</button>
              <button type="submit" class="primary">确认截图</button>
            </div>
          </form>
        </template>

        <template v-else-if="activeModal === 'calibration'">
          <h3>雷达校准进度</h3>
          <p class="muted">正在对齐天线阵列与角度基准。</p>
          <div class="progress">
            <div class="bar" :style="{ width: calibrationProgress + '%' }"></div>
          </div>
          <div class="modal-actions">
            <button class="primary" @click="completeCalibration">完成校准</button>
          </div>
        </template>

        <template v-else>
          <h3>提示</h3>
          <p class="muted">{{ modalMessage }}</p>
          <div class="modal-actions">
            <button class="primary" @click="closeModal">知道了</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const targets = [
  { id: "T-001", type: "行人", range: "12.4m", speed: "1.2m/s", score: "92%" },
  { id: "T-002", type: "车辆", range: "28.1m", speed: "6.4m/s", score: "88%" },
  { id: "T-003", type: "行人", range: "19.5m", speed: "0.8m/s", score: "91%" },
  { id: "T-004", type: "无人机", range: "42.0m", speed: "9.1m/s", score: "86%" },
  { id: "T-005", type: "设备", range: "8.8m", speed: "0.2m/s", score: "95%" },
  { id: "T-006", type: "车辆", range: "33.4m", speed: "5.2m/s", score: "90%" },
  { id: "T-007", type: "行人", range: "15.6m", speed: "1.5m/s", score: "87%" },
  { id: "T-008", type: "设备", range: "10.2m", speed: "0.3m/s", score: "93%" },
  { id: "T-009", type: "车辆", range: "25.9m", speed: "4.8m/s", score: "89%" },
  { id: "T-010", type: "行人", range: "18.7m", speed: "1.0m/s", score: "94%" }
];

const activeModal = ref("");
const calibrationProgress = ref(68);
const form = reactive({
  radius: 80,
  frequency: "5 Hz",
  threshold: 60,
  snapshot: "雷达-0920",
  location: "本地存储"
});

const modalMessage = computed(() => {
  const messages = {
    switch: "已切换至备用视角，摄像头温度校验中。",
    filter: "筛选条件已应用，显示置信度高于 85% 目标。",
    export: "实时列表已导出到报告中心。"
  };
  return messages[activeModal.value] || "操作完成。";
});

const openModal = (key) => {
  activeModal.value = key;
};

const closeModal = () => {
  activeModal.value = "";
};

const submitModal = () => {
  activeModal.value = "";
};

const completeCalibration = () => {
  calibrationProgress.value = 100;
  activeModal.value = "";
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eff6ff;
  border: none;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
}

.radar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 16px;
}

.radar svg {
  width: 100%;
  max-width: 240px;
  justify-self: center;
}

.radar circle,
.radar line {
  fill: none;
  stroke: #dbeafe;
  stroke-width: 2;
}

.radar path {
  fill: rgba(37, 99, 235, 0.2);
  stroke: #2563eb;
  stroke-width: 2;
}

.radar-info {
  display: grid;
  gap: 12px;
}

.radar-info span {
  font-size: 12px;
  color: #94a3b8;
}

.radar-info strong {
  font-size: 18px;
  color: #1e3a8a;
}

.camera-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.camera {
  background: linear-gradient(135deg, #c7d2fe, #bfdbfe);
  border-radius: 14px;
  padding: 20px;
  min-height: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  color: #1e3a8a;
  font-weight: 600;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
 td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  color: #475569;
  font-weight: 600;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  z-index: 30;
}

.modal {
  width: min(420px, 90vw);
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: grid;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar {
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  height: 100%;
}

.muted {
  color: #64748b;
  margin: 0;
}

@media (max-width: 768px) {
  .radar {
    grid-template-columns: 1fr;
  }
}
</style>
