<template>
  <div class="page">
    <div class="summary">
      <div class="card">
        <h3>在线设备</h3>
        <strong>18</strong>
        <p class="muted">实时心跳正常</p>
      </div>
      <div class="card">
        <h3>待连接</h3>
        <strong>4</strong>
        <p class="muted">需要授权</p>
      </div>
      <div class="card">
        <h3>告警设备</h3>
        <strong>2</strong>
        <p class="muted">需维护</p>
      </div>
      <div class="card actions">
        <button class="primary" @click="openModal('scan')">扫描传感器</button>
        <button class="ghost" @click="openModal('connect')">批量连接</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>在线传感器列表</h3>
        <div class="card-actions">
          <button class="ghost" @click="openModal('assign')">分组</button>
          <button class="primary" @click="openModal('authorize')">授权设备</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>设备编号</th>
              <th>类型</th>
              <th>位置</th>
              <th>状态</th>
              <th>信号强度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devices" :key="device.id">
              <td>{{ device.id }}</td>
              <td>{{ device.type }}</td>
              <td>{{ device.location }}</td>
              <td>{{ device.status }}</td>
              <td>{{ device.signal }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>连接队列</h3>
        <button class="primary" @click="openModal('queue')">调整优先级</button>
      </div>
      <div class="queue">
        <div class="queue-item" v-for="item in queue" :key="item.name">
          <span>{{ item.name }}</span>
          <strong>{{ item.priority }}</strong>
        </div>
      </div>
    </div>

    <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <template v-if="activeModal === 'scan'">
          <h3>扫描进度</h3>
          <p class="muted">正在搜索附近传感器。</p>
          <div class="progress">
            <div class="bar" :style="{ width: scanProgress + '%' }"></div>
          </div>
          <div class="modal-actions">
            <button class="primary" @click="completeScan">完成扫描</button>
          </div>
        </template>

        <template v-else-if="activeModal === 'connect'">
          <h3>批量连接</h3>
          <form class="modal-form" @submit.prevent="submitModal">
            <label>
              <span>连接策略</span>
              <select v-model="form.strategy">
                <option>按信号强度</option>
                <option>按区域优先</option>
                <option>按设备类型</option>
              </select>
            </label>
            <label>
              <span>超时设置</span>
              <input v-model="form.timeout" type="number" min="10" max="120" />
            </label>
            <div class="modal-actions">
              <button class="ghost" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">开始连接</button>
            </div>
          </form>
        </template>

        <template v-else>
          <h3>提示信息</h3>
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

const devices = [
  { id: "R-001", type: "雷达", location: "北区入口", status: "在线", signal: "92%" },
  { id: "C-014", type: "摄像头", location: "西侧通道", status: "在线", signal: "88%" },
  { id: "R-011", type: "雷达", location: "南区平台", status: "在线", signal: "85%" },
  { id: "T-004", type: "热成像", location: "东区仓库", status: "告警", signal: "64%" },
  { id: "C-021", type: "摄像头", location: "西区车道", status: "在线", signal: "90%" },
  { id: "R-009", type: "雷达", location: "中控楼顶", status: "在线", signal: "91%" },
  { id: "I-006", type: "惯导", location: "移动平台", status: "在线", signal: "86%" },
  { id: "C-023", type: "摄像头", location: "南区广场", status: "待连接", signal: "70%" },
  { id: "R-015", type: "雷达", location: "北区外围", status: "在线", signal: "89%" },
  { id: "C-032", type: "摄像头", location: "西区仓库", status: "待连接", signal: "68%" }
];

const queue = [
  { name: "北区雷达组", priority: "高" },
  { name: "西区摄像头", priority: "中" },
  { name: "热成像模块", priority: "中" },
  { name: "移动平台", priority: "低" }
];

const activeModal = ref("");
const scanProgress = ref(64);
const form = reactive({
  strategy: "按信号强度",
  timeout: 45
});

const modalMessage = computed(() => {
  const messages = {
    assign: "设备已分配到各自区域分组。",
    authorize: "授权请求已发送至安全管理员。",
    queue: "优先级调整完成，队列已更新。"
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

const completeScan = () => {
  scanProgress.value = 100;
  activeModal.value = "";
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 12px;
}

.card.actions {
  align-content: center;
  gap: 12px;
}

.card h3 {
  margin: 0;
  font-size: 15px;
}

.card strong {
  font-size: 24px;
  color: #1e3a8a;
}

.muted {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eff6ff;
  border: none;
  color: #2563eb;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-actions {
  display: flex;
  gap: 10px;
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

.queue {
  display: grid;
  gap: 10px;
}

.queue-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 14px;
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
</style>
