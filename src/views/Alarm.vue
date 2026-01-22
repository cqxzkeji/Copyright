<template>
  <section class="alarm">
    <div class="panel">
      <div class="panel-header">
        <h3>异常告警概览</h3>
        <div class="panel-actions">
          <button class="ghost-button" @click="openModal('rule')">阈值规则</button>
          <button class="primary-button" @click="openModal('test')">告警测试</button>
        </div>
      </div>
      <div class="summary-grid">
        <div v-for="item in summary" :key="item.title" class="summary-card">
          <p>{{ item.title }}</p>
          <h3>{{ item.value }}</h3>
          <span>{{ item.desc }}</span>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>告警列表</h3>
        <div class="panel-actions">
          <button class="ghost-button" @click="openModal('batch')">批量处理</button>
          <button class="primary-button" @click="openModal('dispatch')">派单处理</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>设备</th>
              <th>异常参数</th>
              <th>当前值</th>
              <th>阈值</th>
              <th>等级</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.device }}</td>
              <td>{{ row.param }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.threshold }}</td>
              <td><span class="level" :class="row.levelType">{{ row.level }}</span></td>
              <td>{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>响应进度</h3>
        <button class="ghost-button" @click="openModal('progress')">查看进度</button>
      </div>
      <div class="progress-track">
        <div v-for="step in steps" :key="step.name" class="progress-step">
          <div class="circle" :class="step.status"></div>
          <div>
            <h4>{{ step.name }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <Modal :open="modalType === 'rule'" title="阈值规则" @close="closeModal">
      <form class="modal-form">
        <label>温度告警阈值
          <input type="number" placeholder="例如 80" />
        </label>
        <label>压力告警阈值
          <input type="number" placeholder="例如 120" />
        </label>
        <label>电流告警阈值
          <input type="number" placeholder="例如 25" />
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">保存规则</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'test'" title="告警测试" @close="closeModal">
      <p>系统将模拟一次高等级告警，确认通知流程。</p>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">开始测试</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'batch'" title="批量处理" @close="closeModal">
      <p>已选择 5 条告警记录。</p>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">稍后</button>
        <button class="primary-button" @click="closeModal">确认处理</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'dispatch'" title="派单处理" @close="closeModal">
      <form class="modal-form">
        <label>派单人员
          <input type="text" placeholder="输入值班人员" />
        </label>
        <label>处理优先级
          <select>
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">提交派单</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'progress'" title="处理进度" @close="closeModal">
      <p>当前告警响应完成度 {{ progress }}%。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">完成</button>
      </div>
    </Modal>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalType = ref("");
const progress = ref(56);
let timer;

const openModal = (type) => {
  modalType.value = type;
  if (type === "progress") {
    progress.value = 56;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 6, 100);
    }, 450);
  }
};

const closeModal = () => {
  modalType.value = "";
  clearInterval(timer);
};

onBeforeUnmount(() => clearInterval(timer));

const summary = [
  { title: "今日告警", value: "12", desc: "高等级 3 条" },
  { title: "待处理", value: "5", desc: "2 条已派单" },
  { title: "已恢复", value: "7", desc: "平均恢复 18 分钟" }
];

const rows = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  device: `设备-${(index % 4) + 1}`,
  param: ["温度", "压力", "电流"][index % 3],
  value: (80 + (index % 6) * 3).toFixed(1),
  threshold: index % 2 === 0 ? "上限" : "下限",
  level: index % 4 === 0 ? "高" : index % 3 === 0 ? "中" : "低",
  levelType: index % 4 === 0 ? "high" : index % 3 === 0 ? "medium" : "low",
  status: index % 5 === 0 ? "处理中" : "未处理"
}));

const steps = [
  { name: "告警触发", desc: "参数超出阈值", status: "done" },
  { name: "通知值班", desc: "短信与系统推送", status: "done" },
  { name: "现场处理", desc: "工程师处理中", status: "active" },
  { name: "复核关闭", desc: "等待确认", status: "pending" }
];
</script>

<style scoped>
.alarm {
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.summary-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px;
  border: 1px solid #e2e8f0;
}

.summary-card p {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 13px;
}

.summary-card h3 {
  margin: 0;
  font-size: 22px;
  color: #ef4444;
}

.summary-card span {
  font-size: 12px;
  color: #475569;
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

.level {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.level.high {
  background: #fee2e2;
  color: #991b1b;
}

.level.medium {
  background: #fef3c7;
  color: #92400e;
}

.level.low {
  background: #dcfce7;
  color: #166534;
}

.progress-track {
  display: grid;
  gap: 12px;
}

.progress-step {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.circle {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #cbd5f5;
}

.circle.done {
  background: #22c55e;
}

.circle.active {
  background: #f97316;
}

.circle.pending {
  background: #94a3b8;
}

.progress {
  margin: 16px 0;
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #ef4444, #f97316);
  transition: width 0.3s ease;
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
