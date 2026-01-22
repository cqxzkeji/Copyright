<template>
  <section class="dashboard">
    <div class="cards">
      <div v-for="card in metrics" :key="card.label" class="card">
        <div>
          <p>{{ card.label }}</p>
          <h3>{{ card.value }}</h3>
        </div>
        <span class="trend" :class="card.status">{{ card.delta }}</span>
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <div class="panel-header">
          <h3>实时曲线总览</h3>
          <div class="panel-actions">
            <button class="ghost-button" @click="openModal('curve')">曲线配置</button>
            <button class="primary-button" @click="openModal('sync')">立即同步</button>
          </div>
        </div>
        <svg class="chart" viewBox="0 0 520 220">
          <polyline :points="tempPoints" fill="none" stroke="#2563eb" stroke-width="3" />
          <polyline :points="pressurePoints" fill="none" stroke="#22c55e" stroke-width="3" />
          <polyline :points="currentPoints" fill="none" stroke="#f97316" stroke-width="3" />
        </svg>
        <div class="legend">
          <span><i class="dot temp"></i>温度</span>
          <span><i class="dot pressure"></i>压力</span>
          <span><i class="dot current"></i>电流</span>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>设备运行概览</h3>
          <button class="ghost-button" @click="openModal('status')">状态说明</button>
        </div>
        <div class="status-list">
          <div v-for="item in statusList" :key="item.name" class="status-item">
            <div>
              <h4>{{ item.name }}</h4>
              <p>{{ item.desc }}</p>
            </div>
            <span class="badge" :class="item.level">{{ item.levelLabel }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>实时采集数据表</h3>
        <div class="panel-actions">
          <button class="ghost-button" @click="openModal('filter')">筛选条件</button>
          <button class="primary-button" @click="openModal('export')">导出快照</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>设备</th>
              <th>温度(°C)</th>
              <th>压力(kPa)</th>
              <th>电流(A)</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.time }}</td>
              <td>{{ row.device }}</td>
              <td>{{ row.temp }}</td>
              <td>{{ row.pressure }}</td>
              <td>{{ row.current }}</td>
              <td><span class="table-status" :class="row.statusType">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :open="modalType === 'curve'" title="曲线配置" @close="closeModal">
      <form class="modal-form">
        <label>刷新频率
          <select>
            <option>5 秒</option>
            <option>10 秒</option>
            <option>30 秒</option>
          </select>
        </label>
        <label>显示通道
          <div class="checkbox-group">
            <label><input type="checkbox" checked /> 温度</label>
            <label><input type="checkbox" checked /> 压力</label>
            <label><input type="checkbox" checked /> 电流</label>
          </div>
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">保存</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'sync'" title="实时数据同步" @close="closeModal">
      <p>正在同步最新数据流，请稍候。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">完成</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'status'" title="状态说明" @close="closeModal">
      <ul class="info-list">
        <li>正常：设备运行稳定，参数在阈值内。</li>
        <li>关注：存在波动趋势，需要持续观察。</li>
        <li>告警：指标超出阈值，将触发通知。</li>
      </ul>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">知道了</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'filter'" title="筛选条件" @close="closeModal">
      <form class="modal-form">
        <label>设备编号
          <input type="text" placeholder="例如：设备-02" />
        </label>
        <label>状态
          <select>
            <option>全部</option>
            <option>正常</option>
            <option>关注</option>
            <option>告警</option>
          </select>
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">应用</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'export'" title="导出快照" @close="closeModal">
      <p>导出内容包含当前 30 分钟内的采集数据。</p>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">确认导出</button>
      </div>
    </Modal>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalType = ref("");
const progress = ref(35);
let timer;

const openModal = (type) => {
  modalType.value = type;
  if (type === "sync") {
    progress.value = 35;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 10, 100);
    }, 500);
  }
};

const closeModal = () => {
  modalType.value = "";
  clearInterval(timer);
};

onBeforeUnmount(() => clearInterval(timer));

const metrics = [
  { label: "今日采集量", value: "4,820 条", delta: "+6.2%", status: "up" },
  { label: "在线设备", value: "28 / 30", delta: "正常", status: "steady" },
  { label: "告警数量", value: "3 条", delta: "-2", status: "down" },
  { label: "数据完整率", value: "99.2%", delta: "稳定", status: "steady" }
];

const statusList = [
  { name: "设备 A - 冷却系统", desc: "温度曲线稳定", level: "good", levelLabel: "正常" },
  { name: "设备 B - 供电模块", desc: "电流峰值增大", level: "warn", levelLabel: "关注" },
  { name: "设备 C - 压力腔体", desc: "压力处于告警阈值", level: "alert", levelLabel: "告警" }
];

const tempSeries = [22, 24, 23, 26, 27, 25, 28, 30, 29, 31, 30, 32, 33];
const pressureSeries = [90, 92, 91, 95, 96, 94, 97, 98, 96, 99, 97, 98, 100];
const currentSeries = [12, 13, 12, 14, 15, 14, 16, 18, 17, 19, 18, 20, 19];

const buildPoints = (series, height = 200, width = 500, padding = 10) => {
  const max = Math.max(...series);
  const min = Math.min(...series);
  return series
    .map((value, index) => {
      const x = padding + (index / (series.length - 1)) * width;
      const y = padding + (1 - (value - min) / (max - min)) * height;
      return `${x},${y}`;
    })
    .join(" ");
};

const tempPoints = computed(() => buildPoints(tempSeries));
const pressurePoints = computed(() => buildPoints(pressureSeries));
const currentPoints = computed(() => buildPoints(currentSeries));

const tableRows = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  time: `10:${(index + 10).toString().padStart(2, "0")}`,
  device: `设备-${(index % 5) + 1}`,
  temp: (24 + index % 6).toFixed(1),
  pressure: (92 + (index % 7)).toFixed(1),
  current: (12 + (index % 4)).toFixed(1),
  status: index % 8 === 0 ? "告警" : index % 5 === 0 ? "关注" : "正常",
  statusType: index % 8 === 0 ? "alert" : index % 5 === 0 ? "warn" : "good"
}));
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.card p {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 13px;
}

.card h3 {
  margin: 0;
  font-size: 22px;
}

.trend {
  font-weight: 700;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 999px;
}

.trend.up {
  background: #dcfce7;
  color: #166534;
}

.trend.down {
  background: #fee2e2;
  color: #991b1b;
}

.trend.steady {
  background: #e0f2fe;
  color: #0369a1;
}

.panel-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 20px;
}

.panel {
  background: white;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #e2e8f0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.chart {
  width: 100%;
  height: 220px;
  background: linear-gradient(180deg, #f8fafc, #ffffff);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.legend {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 13px;
  color: #475569;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-right: 6px;
}

.dot.temp {
  background: #2563eb;
}

.dot.pressure {
  background: #22c55e;
}

.dot.current {
  background: #f97316;
}

.status-list {
  display: grid;
  gap: 14px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}

.status-item h4 {
  margin: 0 0 4px;
}

.status-item p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge.good {
  background: #dcfce7;
  color: #166534;
}

.badge.warn {
  background: #fef3c7;
  color: #92400e;
}

.badge.alert {
  background: #fee2e2;
  color: #991b1b;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f1f5f9;
  font-weight: 600;
}

.table-status {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.table-status.good {
  background: #dcfce7;
  color: #166534;
}

.table-status.warn {
  background: #fef3c7;
  color: #92400e;
}

.table-status.alert {
  background: #fee2e2;
  color: #991b1b;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.modal-form input,
.modal-form select {
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  padding: 8px 10px;
  background: #f8fafc;
}

.checkbox-group {
  display: flex;
  gap: 10px;
  font-size: 13px;
}

.progress {
  margin: 16px 0;
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  transition: width 0.3s ease;
}

.info-list {
  padding-left: 18px;
  margin: 0;
}

@media (max-width: 960px) {
  .panel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
