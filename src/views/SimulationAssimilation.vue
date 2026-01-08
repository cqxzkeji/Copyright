<template>
  <div class="module">
    <div class="card-grid">
      <div class="card">
        <h3>模拟任务看板</h3>
        <div class="kpi-grid">
          <div class="kpi">
            <span>运行中</span>
            <strong>6</strong>
          </div>
          <div class="kpi">
            <span>排队中</span>
            <strong>4</strong>
          </div>
          <div class="kpi">
            <span>完成率</span>
            <strong>92%</strong>
          </div>
        </div>
        <div class="timeline">
          <div v-for="(slot, index) in timeline" :key="index" class="slot">
            <span>{{ slot.time }}</span>
            <strong>{{ slot.label }}</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>同化校正效果</h3>
        <p>PM2.5 偏差订正后准确率提升 12.6%。</p>
        <div class="chart">
          <div v-for="(item, index) in biasTrend" :key="index" class="bar">
            <span :style="{ height: item.value + '%' }"></span>
            <label>{{ item.label }}</label>
          </div>
        </div>
      </div>
      <div class="card action-card">
        <h3>模拟与同化操作</h3>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('新建模拟方案')">新建模拟方案</button>
          <button class="ghost" type="button" @click="openModal('同化订正参数')">同化订正参数</button>
          <button class="ghost" type="button" @click="openModal('网格配置')">网格配置</button>
          <button class="ghost" type="button" @click="openModal('回算时段管理')">回算时段管理</button>
        </div>
        <ul class="status">
          <li>最新运行：2024-08-15 06:00 回算</li>
          <li>同化观测站点：128 个</li>
          <li>模型方案：WRF-CMAQ / CAMx</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>模拟任务队列</h3>
        <button class="ghost" type="button" @click="openModal('任务排队策略')">排队策略</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>方案</th>
              <th>时段</th>
              <th>网格</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.plan }}</td>
              <td>{{ row.period }}</td>
              <td>{{ row.grid }}</td>
              <td>
                <span class="tag" :class="row.statusClass">{{ row.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalShell
    v-if="activeModal"
    :title="activeModal"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="modal-section">
      <h4>模拟参数表单</h4>
      <div class="modal-grid">
        <label>
          模式方案
          <select>
            <option>WRF-CMAQ</option>
            <option>CAMx</option>
            <option>NAQPMS</option>
          </select>
        </label>
        <label>
          起报时间
          <input placeholder="2024-08-15 00:00" />
        </label>
        <label>
          同化窗口
          <input placeholder="6 小时" />
        </label>
        <label>
          观测权重
          <input placeholder="例如：0.7" />
        </label>
      </div>
    </div>
    <div class="modal-section">
      <h4>运行进度</h4>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">当前处理进度 {{ progress }}%</p>
    </div>
    <div class="modal-section info">
      <strong>提示信息：</strong>
      <span>任务提交后将自动进入调度队列并推送运行日志。</span>
    </div>
  </ModalShell>
</template>

<script setup>
import { ref } from "vue";
import ModalShell from "../components/ModalShell.vue";

const activeModal = ref("");
const progress = ref(52);

const timeline = [
  { time: "00:00", label: "输入场准备" },
  { time: "02:00", label: "WRF驱动" },
  { time: "04:00", label: "化学机制" },
  { time: "06:00", label: "同化订正" },
  { time: "08:00", label: "结果入库" },
];

const biasTrend = [
  { label: "D-4", value: 45 },
  { label: "D-3", value: 52 },
  { label: "D-2", value: 60 },
  { label: "D-1", value: 68 },
  { label: "D0", value: 74 },
];

const tableRows = Array.from({ length: 24 }, (_, index) => ({
  id: `SIM-${(index + 1).toString().padStart(3, "0")}`,
  plan: index % 2 === 0 ? "WRF-CMAQ" : "CAMx",
  period: `2024-08-${String(8 + (index % 8)).padStart(2, "0")} 00:00 - 24:00`,
  grid: index % 3 === 0 ? "9km/3km" : index % 3 === 1 ? "12km" : "3km",
  status: index % 3 === 0 ? "运行中" : index % 3 === 1 ? "排队中" : "已完成",
  statusClass: index % 3 === 0 ? "info" : index % 3 === 1 ? "warn" : "ok",
}));

const openModal = (title) => {
  activeModal.value = title;
  progress.value = 44;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 11);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 160);
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.card h3 {
  margin: 0 0 12px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.kpi {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 4px;
  color: #64748b;
}

.kpi strong {
  font-size: 20px;
  color: #1d4ed8;
}

.timeline {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.slot {
  background: #eff6ff;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  color: #1e40af;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 160px;
  margin-top: 16px;
}

.bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  height: 100%;
  font-size: 12px;
  color: #64748b;
}

.bar span {
  display: block;
  width: 100%;
  background: linear-gradient(180deg, #93c5fd, #2563eb);
  border-radius: 8px 8px 4px 4px;
}

.action-card {
  display: grid;
  gap: 16px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.status {
  margin: 0;
  padding-left: 16px;
  color: #64748b;
  font-size: 14px;
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  text-align: left;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #dcfce7;
  color: #15803d;
}

.tag.warn {
  background: #fef9c3;
  color: #b45309;
}

.tag.info {
  background: #e0f2fe;
  color: #0369a1;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  border: 1px solid #cbd5f5;
  color: #334155;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.modal-section {
  margin-bottom: 20px;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
}

.info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  color: #475569;
}
</style>
