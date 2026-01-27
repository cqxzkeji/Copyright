<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h3>试验/路试数据采集与管理</h3>
        <p>支持麦克风、加速度、转速/阶次、OBD/CAN 数据导入与批量校验。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('task')">创建采集任务</button>
        <button class="ghost" @click="openModal('verify')">数据校验</button>
        <button class="ghost" @click="openModal('tips')">导入提示</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>传感器接入概览</h4>
        <div class="sensor-grid">
          <div v-for="sensor in sensors" :key="sensor.name" class="sensor-item">
            <strong>{{ sensor.value }}</strong>
            <span>{{ sensor.name }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>采集波形示意</h4>
        <svg viewBox="0 0 240 80" class="spark">
          <polyline
            :points="wavePoints"
            fill="none"
            stroke="#2563eb"
            stroke-width="2"
          />
        </svg>
        <p class="hint">实时采样波形仅用于趋势展示。</p>
      </div>
    </section>

    <section class="table-card">
      <div class="table-header">
        <h4>数据批次清单</h4>
        <button class="ghost" @click="openModal('label')">批量标注</button>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>批次编号</th>
              <th>来源</th>
              <th>采集日期</th>
              <th>采样率</th>
              <th>校验结果</th>
              <th>版本</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.source }}</td>
              <td>{{ row.date }}</td>
              <td>{{ row.rate }}</td>
              <td><span class="tag">{{ row.check }}</span></td>
              <td>{{ row.version }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AppModal :visible="modalVisible" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'task'">
        <label>任务名称<input v-model="form.task" type="text" placeholder="路试A线采集" /></label>
        <label>传感器类型<select v-model="form.sensor">
          <option>麦克风阵列</option>
          <option>加速度计</option>
          <option>转速/阶次</option>
          <option>OBD/CAN</option>
        </select></label>
        <label>测点数量<input v-model="form.points" type="number" min="1" /></label>
      </template>
      <template v-else-if="modalType === 'verify'">
        <p>正在对导入数据执行完整性与噪声底噪检查。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>校验进度 {{ progress }}%</small>
      </template>
      <template v-else-if="modalType === 'label'">
        <label>批次编号<select v-model="form.batch">
          <option v-for="row in tableRows" :key="row.id">{{ row.id }}</option>
        </select></label>
        <label>标签说明<textarea v-model="form.note" rows="3" placeholder="输入工况说明与异常点"></textarea></label>
      </template>
      <template v-else>
        <p>建议上传前完成传感器编号与通道映射，系统将自动生成元数据。</p>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalVisible = ref(false);
const modalType = ref("task");
const progress = ref(40);

const sensors = [
  { name: "麦克风通道", value: 64 },
  { name: "加速度通道", value: 48 },
  { name: "转速/阶次", value: 12 },
  { name: "OBD/CAN", value: 18 }
];

const form = reactive({
  task: "",
  sensor: "麦克风阵列",
  points: 12,
  batch: "",
  note: ""
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `DC-${3200 + index}`,
  source: ["试验台架", "路试A线", "半消声室", "整车道路"][index % 4],
  date: `2024-0${(index % 8) + 1}-1${index % 9}`,
  rate: `${20 + (index % 6) * 5} kHz`,
  check: ["通过", "待复核", "缺失通道"][index % 3],
  version: `R${1 + (index % 3)}.${index % 5}`
}));

const wavePoints = computed(() => {
  const values = [12, 24, 18, 36, 20, 46, 28, 52, 36, 60, 40, 52, 34, 44, 30, 38, 20, 28, 16, 22];
  return values
    .map((value, index) => `${index * 12},${80 - value}`)
    .join(" ");
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  if (type === "verify") {
    progress.value = 30;
    const timer = setInterval(() => {
      progress.value = Math.min(progress.value + 10, 100);
      if (progress.value === 100) {
        clearInterval(timer);
      }
    }, 260);
  }
};

const closeModal = () => {
  modalVisible.value = false;
};

const modalTitle = computed(() => {
  const titles = {
    task: "创建采集任务",
    verify: "数据校验进度",
    label: "批量标注",
    tips: "导入提示"
  };
  return titles[modalType.value] || "提示";
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.module-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  border: 1px solid #d6deea;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.sensor-item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  display: grid;
  gap: 6px;
}

.spark {
  width: 100%;
  height: 80px;
  margin-top: 12px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
}

.hint {
  color: #64748b;
  margin: 8px 0 0;
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-scroll {
  overflow: auto;
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
  border-bottom: 1px solid #eef2f7;
}

.tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

input,
select,
textarea {
  padding: 8px 10px;
  border: 1px solid #d6deea;
  border-radius: 8px;
  font-family: inherit;
}

.progress {
  background: #edf2f8;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #22c55e);
}
</style>
