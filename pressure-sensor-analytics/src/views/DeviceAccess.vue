<template>
  <section class="module">
    <div class="cards">
      <div class="card">
        <h4>在线设备</h4>
        <p class="metric">{{ onlineCount }} / {{ devices.length }}</p>
        <span>实时接入 MQTT / Modbus / HTTP</span>
      </div>
      <div class="card">
        <h4>平均采样频率</h4>
        <p class="metric">20 Hz</p>
        <span>覆盖 12 条生产线</span>
      </div>
      <div class="card">
        <h4>校准提醒</h4>
        <p class="metric">{{ dueCalibration }}</p>
        <span>待处理校准任务</span>
      </div>
    </div>

    <div class="toolbar">
      <button type="button" @click="openModal('form', '新建设备')">新建设备</button>
      <button type="button" @click="openModal('progress', '批量导入')">批量导入</button>
      <button type="button" @click="openModal('form', '通道配置')">通道配置</button>
      <button type="button" @click="openModal('form', '校准管理')">校准管理</button>
      <button type="button" @click="openModal('info', '在线巡检')">在线巡检</button>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h4>设备建档列表</h4>
        <span>支持多协议在线状态监测</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>设备编号</th>
            <th>名称</th>
            <th>协议</th>
            <th>采样频率</th>
            <th>量程</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="device in devices" :key="device.id">
            <td>{{ device.id }}</td>
            <td>{{ device.name }}</td>
            <td>{{ device.protocol }}</td>
            <td>{{ device.frequency }} Hz</td>
            <td>{{ device.range }} MPa</td>
            <td>
              <span :class="['status', device.status === '在线' ? 'online' : 'offline']">
                {{ device.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button type="button" class="icon" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'form'" class="modal-form" @submit.prevent="submitForm">
            <label>
              设备名称
              <input v-model="form.name" type="text" required />
            </label>
            <label>
              接入协议
              <select v-model="form.protocol">
                <option>MQTT</option>
                <option>Modbus</option>
                <option>HTTP</option>
              </select>
            </label>
            <label>
              采样频率(Hz)
              <input v-model.number="form.frequency" type="number" min="1" required />
            </label>
            <label>
              量程(MPa)
              <input v-model.number="form.range" type="number" min="1" required />
            </label>
            <label>
              校准参数
              <input v-model="form.calibration" type="text" required />
            </label>
            <button type="submit" class="primary">保存并同步</button>
          </form>
          <div v-else-if="modal.type === 'progress'">
            <p>正在导入设备档案与通道模板...</p>
            <div class="progress">
              <div class="bar" :style="{ width: `${progress}%` }"></div>
            </div>
            <p class="progress-tip">已导入 {{ progress }}%</p>
          </div>
          <div v-else class="info-body">
            <p>巡检结果：{{ onlineCount }} 台在线，{{ devices.length - onlineCount }} 台离线。</p>
            <p>已生成巡检记录并推送运维通知。</p>
            <button type="button" class="primary" @click="closeModal">查看记录</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed, onBeforeUnmount } from "vue";

const devices = ref(
  Array.from({ length: 24 }, (_, index) => {
    const protocols = ["MQTT", "Modbus", "HTTP"];
    return {
      id: `PS-${String(index + 1).padStart(3, "0")}`,
      name: `高压传感器-${index + 1}`,
      protocol: protocols[index % protocols.length],
      frequency: 10 + (index % 5) * 5,
      range: 6 + (index % 4) * 2,
      status: index % 6 === 0 ? "离线" : "在线"
    };
  })
);

const modal = reactive({
  visible: false,
  type: "info",
  title: ""
});

const form = reactive({
  name: "",
  protocol: "MQTT",
  frequency: 20,
  range: 10,
  calibration: "0.98 / 1.02"
});

const progress = ref(0);
const timer = ref(null);

const openModal = (type, title) => {
  modal.visible = true;
  modal.type = type;
  modal.title = title;
  if (type === "progress") {
    progress.value = 0;
    timer.value = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer.value);
        timer.value = null;
      } else {
        progress.value += 8;
      }
    }, 120);
  }
};

const closeModal = () => {
  modal.visible = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const submitForm = () => {
  devices.value.unshift({
    id: `PS-${String(devices.value.length + 1).padStart(3, "0")}`,
    name: form.name,
    protocol: form.protocol,
    frequency: form.frequency,
    range: form.range,
    status: "在线"
  });
  closeModal();
};

const onlineCount = computed(() => devices.value.filter((item) => item.status === "在线").length);
const dueCalibration = computed(() => Math.max(3, Math.round(devices.value.length / 5)));

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.metric {
  font-size: 22px;
  font-weight: 700;
  margin: 8px 0;
}

.card span {
  color: #64748b;
  font-size: 13px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toolbar button {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.table-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.table-header span {
  color: #64748b;
  font-size: 13px;
}

.table-card table {
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

.status {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status.online {
  background: #dcfce7;
  color: #16a34a;
}

.status.offline {
  background: #fee2e2;
  color: #dc2626;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.primary {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.icon {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin: 12px 0;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #38bdf8);
  transition: width 0.2s ease;
}

.progress-tip {
  font-size: 13px;
  color: #64748b;
}
</style>
