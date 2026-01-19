<template>
  <div class="module-page">
    <section class="summary">
      <div class="summary-card">
        <h3>评估任务</h3>
        <p>等待分析</p>
        <strong>9</strong>
      </div>
      <div class="summary-card">
        <h3>最佳模型</h3>
        <p>当前 AUC</p>
        <strong>0.934</strong>
      </div>
      <div class="summary-card">
        <h3>指标库</h3>
        <p>活跃指标</p>
        <strong>16</strong>
      </div>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>评估与性能分析</h2>
        <div class="actions">
          <button class="primary" @click="openModal('metric')">配置评估指标</button>
          <button class="ghost" @click="openModal('roc')">生成 ROC 曲线</button>
          <button class="ghost" @click="openModal('report')">导出评估报告</button>
        </div>
      </header>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-title">混淆矩阵概览</div>
          <div class="matrix">
            <div v-for="cell in matrix" :key="cell.label" class="cell">
              <strong>{{ cell.value }}</strong>
              <span>{{ cell.label }}</span>
            </div>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>模型版本</th>
                <th>准确率</th>
                <th>召回率</th>
                <th>AUC</th>
                <th>RMSE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.version">
                <td>{{ row.version }}</td>
                <td>{{ row.acc }}</td>
                <td>{{ row.recall }}</td>
                <td>{{ row.auc }}</td>
                <td>{{ row.rmse }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <Modal :show="modal.type === 'metric'" title="配置评估指标" @close="closeModal">
      <form class="modal-form" @submit.prevent="submitModal('评估指标已更新')">
        <label>
          目标数据集
          <select v-model="form.dataset">
            <option>验证集 V4</option>
            <option>测试集 V4</option>
            <option>线上回放集</option>
          </select>
        </label>
        <label>
          主要指标
          <select v-model="form.primary">
            <option>AUC</option>
            <option>Recall</option>
            <option>Precision</option>
          </select>
        </label>
        <label>
          辅助指标
          <input v-model="form.secondary" placeholder="例如：F1、KS" />
        </label>
        <button class="primary" type="submit">保存配置</button>
      </form>
    </Modal>

    <Modal :show="modal.type === 'roc'" title="ROC 曲线生成中" @close="closeModal">
      <p>系统正在计算 8 个阈值区间的真阳率与假阳率。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }" />
      </div>
      <p class="progress-text">预计剩余 2 分钟</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">返回评估</button>
      </template>
    </Modal>

    <Modal :show="modal.type === 'report'" title="评估报告提醒" @close="closeModal">
      <p>报告将包含 AUC、召回率、混淆矩阵与模型对比图。</p>
      <div class="info-box">
        <p>导出格式：PDF</p>
        <p>收件人：评估小组、业务负责人</p>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="submitModal('评估报告已发送')">确认导出</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import Modal from "../components/Modal.vue";

const matrix = [
  { label: "TP", value: 842 },
  { label: "FP", value: 63 },
  { label: "FN", value: 71 },
  { label: "TN", value: 980 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  version: `V${(4 - index * 0.1).toFixed(1)}`,
  acc: `${(0.88 - index * 0.002).toFixed(3)}`,
  recall: `${(0.84 - index * 0.003).toFixed(3)}`,
  auc: `${(0.94 - index * 0.002).toFixed(3)}`,
  rmse: `${(0.32 + index * 0.004).toFixed(3)}`
}));

const modal = reactive({ type: "", progress: 72 });
const form = reactive({
  dataset: "验证集 V4",
  primary: "AUC",
  secondary: "F1、KS"
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
  modal.progress = 95;
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

.matrix {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.cell {
  background: #e0f2fe;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cell strong {
  font-size: 22px;
  color: #0f172a;
}

.cell span {
  font-size: 12px;
  color: #64748b;
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

.info-box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
  margin-top: 12px;
}

@media (max-width: 960px) {
  .panel-body {
    grid-template-columns: 1fr;
  }
}
</style>
