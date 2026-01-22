<template>
  <section class="history">
    <div class="panel">
      <div class="panel-header">
        <h3>历史数据查询</h3>
        <div class="panel-actions">
          <button class="ghost-button" @click="openModal('query')">条件查询</button>
          <button class="primary-button" @click="openModal('export')">导出历史</button>
        </div>
      </div>
      <div class="filter-grid">
        <div class="filter-card">
          <h4>今日检索量</h4>
          <p>2,320 条</p>
        </div>
        <div class="filter-card">
          <h4>归档批次</h4>
          <p>6 组</p>
        </div>
        <div class="filter-card">
          <h4>主要参数</h4>
          <p>温度 / 压力 / 电流</p>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>趋势对比图</h3>
        <button class="ghost-button" @click="openModal('compare')">生成对比</button>
      </div>
      <div class="bar-chart">
        <div v-for="item in chartData" :key="item.label" class="bar-item">
          <span>{{ item.label }}</span>
          <div class="bar">
            <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
          </div>
          <strong>{{ item.value }}%</strong>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>历史记录列表</h3>
        <button class="ghost-button" @click="openModal('detail')">查看归档说明</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>日期</th>
              <th>设备</th>
              <th>参数</th>
              <th>平均值</th>
              <th>最大值</th>
              <th>记录状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.date }}</td>
              <td>{{ row.device }}</td>
              <td>{{ row.param }}</td>
              <td>{{ row.avg }}</td>
              <td>{{ row.max }}</td>
              <td><span class="tag" :class="row.type">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :open="modalType === 'query'" title="条件查询" @close="closeModal">
      <form class="modal-form">
        <label>时间范围
          <input type="text" placeholder="2024-01-01 至 2024-01-31" />
        </label>
        <label>参数类型
          <select>
            <option>全部</option>
            <option>温度</option>
            <option>压力</option>
            <option>电流</option>
          </select>
        </label>
        <label>设备编号
          <input type="text" placeholder="设备-01" />
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">查询</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'export'" title="导出历史" @close="closeModal">
      <p>导出将包含查询范围内所有历史数据。</p>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">确认导出</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'compare'" title="趋势对比" @close="closeModal">
      <p>系统已选择最近 30 天数据生成对比报告。</p>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">下载报告</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'detail'" title="归档说明" @close="closeModal">
      <ul class="info-list">
        <li>历史数据每天 02:00 自动归档。</li>
        <li>系统保留原始数据 180 天。</li>
        <li>归档包支持导出为 CSV 与 JSON。</li>
      </ul>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">了解</button>
      </div>
    </Modal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/Modal.vue";

const modalType = ref("");

const openModal = (type) => {
  modalType.value = type;
};

const closeModal = () => {
  modalType.value = "";
};

const chartData = [
  { label: "温度稳定度", value: 86 },
  { label: "压力稳定度", value: 78 },
  { label: "电流稳定度", value: 90 },
  { label: "数据完整率", value: 96 }
];

const rows = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  date: `2024-03-${(index + 1).toString().padStart(2, "0")}`,
  device: `设备-${(index % 5) + 1}`,
  param: ["温度", "压力", "电流"][index % 3],
  avg: (22 + (index % 6) * 0.8).toFixed(1),
  max: (28 + (index % 7) * 0.9).toFixed(1),
  status: index % 6 === 0 ? "需复核" : "已归档",
  type: index % 6 === 0 ? "warn" : "good"
}));
</script>

<style scoped>
.history {
  display: grid;
  gap: 20px;
}

.panel {
  background: #fff;
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

.panel-actions {
  display: flex;
  gap: 10px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.filter-card {
  background: #f8fafc;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filter-card h4 {
  margin: 0 0 6px;
  font-size: 14px;
}

.filter-card p {
  margin: 0;
  font-weight: 600;
  color: #2563eb;
}

.bar-chart {
  display: grid;
  gap: 12px;
}

.bar-item {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.bar {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
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
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

th {
  background: #f1f5f9;
}

.tag {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.tag.good {
  background: #dcfce7;
  color: #166534;
}

.tag.warn {
  background: #fef3c7;
  color: #92400e;
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

.info-list {
  padding-left: 18px;
  margin: 0;
}

.primary-button,
.ghost-button {
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  background: #2563eb;
  color: #fff;
}

.ghost-button {
  background: #fff;
  border-color: #d1d5db;
}
</style>
