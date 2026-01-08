<template>
  <div class="module">
    <div class="card-grid">
      <div class="card">
        <h3>多源数据接入概览</h3>
        <p>已接入国控站点 52 个，省控站点 38 个，气象观测 126 路。</p>
        <div class="chart">
          <div v-for="(item, index) in sourceLoad" :key="index" class="bar">
            <span :style="{ height: item.value + '%' }"></span>
            <label>{{ item.label }}</label>
          </div>
        </div>
      </div>
      <div class="card action-card">
        <h3>数据接入操作</h3>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('批量导入任务')">批量导入</button>
          <button class="ghost" type="button" @click="openModal('定时拉取配置')">定时拉取</button>
          <button class="ghost" type="button" @click="openModal('质量控制规则')">质量控制</button>
          <button class="ghost" type="button" @click="openModal('缺测补齐方案')">缺测补齐</button>
        </div>
        <ul class="status">
          <li>今日新增数据量：8.2 GB</li>
          <li>质量控制通过率：96.4%</li>
          <li>缺测补齐覆盖：95.1%</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>站点接入清单</h3>
        <button class="ghost" type="button" @click="openModal('数据质量汇总')">查看质量汇总</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>站点</th>
              <th>数据源</th>
              <th>最新时间</th>
              <th>PM2.5</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.source }}</td>
              <td>{{ row.time }}</td>
              <td>{{ row.value }}</td>
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
      <h4>数据任务表单</h4>
      <div class="modal-grid">
        <label>
          任务名称
          <input placeholder="例如：华北站点补录" />
        </label>
        <label>
          数据类型
          <select>
            <option>国控站点</option>
            <option>省控站点</option>
            <option>气象观测</option>
            <option>遥感反演</option>
          </select>
        </label>
        <label>
          时间范围
          <input placeholder="2024-08-01 ~ 2024-08-15" />
        </label>
        <label>
          质量阈值
          <input placeholder="例如：缺测率 < 5%" />
        </label>
      </div>
    </div>
    <div class="modal-section">
      <h4>执行进度</h4>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">当前处理进度 {{ progress }}%</p>
    </div>
    <div class="modal-section info">
      <strong>提示信息：</strong>
      <span>任务执行完成后将自动触发校验与归档流程。</span>
    </div>
  </ModalShell>
</template>

<script setup>
import { ref } from "vue";
import ModalShell from "../components/ModalShell.vue";

const activeModal = ref("");
const progress = ref(50);

const sourceLoad = [
  { label: "国控", value: 88 },
  { label: "省控", value: 76 },
  { label: "气象", value: 92 },
  { label: "排放", value: 64 },
  { label: "遥感", value: 71 },
  { label: "再分析", value: 85 },
];

const tableRows = Array.from({ length: 24 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    name: `站点-${id.toString().padStart(2, "0")}`,
    source: index % 2 === 0 ? "国控" : "省控",
    time: `2024-08-15 ${String(7 + (index % 10)).padStart(2, "0")}:00`,
    value: `${18 + (index % 12)} μg/m³`,
    status: index % 3 === 0 ? "正常" : index % 3 === 1 ? "待核查" : "补齐中",
    statusClass: index % 3 === 0 ? "ok" : index % 3 === 1 ? "warn" : "info",
  };
});

const openModal = (title) => {
  activeModal.value = title;
  progress.value = 35;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 13);
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.action-card {
  display: grid;
  gap: 16px;
}

.card h3 {
  margin: 0 0 12px;
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
  background: linear-gradient(180deg, #60a5fa, #2563eb);
  border-radius: 8px 8px 4px 4px;
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

.table-wrap table {
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
  text-align: left;
  background: #f8fafc;
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
