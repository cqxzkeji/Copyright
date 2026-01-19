<template>
  <div class="module-page">
    <section class="summary">
      <div class="summary-card">
        <h3>训练任务</h3>
        <p>并行运行</p>
        <strong>6</strong>
      </div>
      <div class="summary-card">
        <h3>算法库</h3>
        <p>可用算法</p>
        <strong>24</strong>
      </div>
      <div class="summary-card">
        <h3>日志流</h3>
        <p>最新告警</p>
        <strong>2</strong>
      </div>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>训练调度与算法管理</h2>
        <div class="actions">
          <button class="primary" @click="openModal('train')">创建训练任务</button>
          <button class="ghost" @click="openModal('hyper')">超参搜索</button>
          <button class="ghost" @click="openModal('log')">查看日志提示</button>
        </div>
      </header>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-title">损失函数曲线</div>
          <svg viewBox="0 0 240 140" class="line-chart" aria-hidden="true">
            <polyline
              points="0,110 30,90 60,85 90,70 120,55 150,50 180,45 210,42 240,40"
              fill="none"
              stroke="#2563eb"
              stroke-width="4"
            />
            <polyline
              points="0,120 30,105 60,95 90,80 120,70 150,60 180,56 210,54 240,52"
              fill="none"
              stroke="#38bdf8"
              stroke-width="3"
            />
          </svg>
          <div class="legend">
            <span><i class="dot primary" />训练集</span>
            <span><i class="dot secondary" />验证集</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>实验编号</th>
                <th>算法</th>
                <th>状态</th>
                <th>指标</th>
                <th>负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.algorithm }}</td>
                <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
                <td>{{ row.metric }}</td>
                <td>{{ row.owner }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <Modal :show="modal.type === 'train'" title="新建训练任务" @close="closeModal">
      <form class="modal-form" @submit.prevent="submitModal('训练任务已加入调度队列')">
        <label>
          任务名称
          <input v-model="form.name" required placeholder="例如：风控模型V5" />
        </label>
        <label>
          选择算法
          <select v-model="form.algorithm">
            <option>XGBoost</option>
            <option>LightGBM</option>
            <option>Transformer</option>
            <option>ResNet</option>
          </select>
        </label>
        <label>
          资源规格
          <select v-model="form.resource">
            <option>CPU · 中</option>
            <option>GPU · T4</option>
            <option>GPU · A100</option>
          </select>
        </label>
        <button class="primary" type="submit">提交任务</button>
      </form>
    </Modal>

    <Modal :show="modal.type === 'hyper'" title="超参搜索进度" @close="closeModal">
      <p>系统正在并行探索学习率、树深度与正则项组合。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }" />
      </div>
      <p class="progress-text">已完成 {{ modal.progress }}% / 40 组实验</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">继续监控</button>
      </template>
    </Modal>

    <Modal :show="modal.type === 'log'" title="日志提示" @close="closeModal">
      <p>检测到 2 条训练异常告警，请优先关注：</p>
      <ul class="info-list">
        <li>实验 TR-07：验证集 AUC 下降 4%</li>
        <li>实验 TR-12：GPU 占用达到 98%</li>
      </ul>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">稍后查看</button>
        <button class="primary" type="button" @click="submitModal('已生成训练告警报告')">生成报告</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import Modal from "../components/Modal.vue";

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: `TR-${String(index + 1).padStart(2, "0")}`,
  algorithm: ["XGBoost", "Transformer", "LightGBM", "ResNet"][index % 4],
  status: index % 3 === 0 ? "运行中" : "已完成",
  statusClass: index % 3 === 0 ? "warning" : "success",
  metric: `${(0.82 + index * 0.004).toFixed(3)} AUC`,
  owner: ["李青", "张旭", "周然", "林沐"][index % 4]
}));

const modal = reactive({ type: "", progress: 64 });
const form = reactive({
  name: "风控模型V5",
  algorithm: "XGBoost",
  resource: "GPU · T4"
});

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = "";
};

const submitModal = (message) => {
  modal.type = "";
  modal.notice = message;
  modal.progress = 78;
};
</script>

<style scoped>
.module-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.summary-card h3 {
  margin: 0;
  font-size: 15px;
}

.summary-card p {
  margin: 6px 0 12px;
  color: #64748b;
  font-size: 13px;
}

.summary-card strong {
  font-size: 24px;
  color: #2563eb;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary,
.ghost {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.ghost {
  background: #e0f2fe;
  color: #0f172a;
}

.panel-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.chart {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  height: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-title {
  font-size: 14px;
  color: #64748b;
}

.line-chart {
  width: 100%;
  height: 160px;
}

.legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #64748b;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
  margin-right: 6px;
}

.dot.primary {
  background: #2563eb;
}

.dot.secondary {
  background: #38bdf8;
}

.table-wrap {
  overflow-x: auto;
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-wrap th,
.table-wrap td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.success {
  background: #dcfce7;
  color: #166534;
}

.tag.warning {
  background: #fef9c3;
  color: #854d0e;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.modal-form input,
.modal-form select {
  border: 1px solid #cbd5f5;
  padding: 8px 10px;
  border-radius: 8px;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
}

.progress-text {
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
}

.info-list {
  padding-left: 20px;
  color: #475569;
}

@media (max-width: 960px) {
  .panel-body {
    grid-template-columns: 1fr;
  }
}
</style>
