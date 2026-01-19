<template>
  <div class="module-page">
    <section class="summary">
      <div class="summary-card">
        <h3>线上服务</h3>
        <p>稳定运行</p>
        <strong>5</strong>
      </div>
      <div class="summary-card">
        <h3>版本库</h3>
        <p>待发布</p>
        <strong>3</strong>
      </div>
      <div class="summary-card">
        <h3>推理接口</h3>
        <p>QPS 峰值</p>
        <strong>1.8k</strong>
      </div>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>模型部署与版本控制</h2>
        <div class="actions">
          <button class="primary" @click="openModal('release')">发布新版本</button>
          <button class="ghost" @click="openModal('rollback')">快速回滚</button>
          <button class="ghost" @click="openModal('endpoint')">配置推理接口</button>
        </div>
      </header>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-title">在线预测负载</div>
          <div class="load">
            <div v-for="point in loadPoints" :key="point.label" class="load-point">
              <span>{{ point.label }}</span>
              <div class="bar">
                <div class="bar-fill" :style="{ width: point.value + '%' }" />
              </div>
            </div>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>模型版本</th>
                <th>运行环境</th>
                <th>状态</th>
                <th>QPS</th>
                <th>负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.version">
                <td>{{ row.version }}</td>
                <td>{{ row.env }}</td>
                <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
                <td>{{ row.qps }}</td>
                <td>{{ row.owner }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <Modal :show="modal.type === 'release'" title="发布模型版本" @close="closeModal">
      <form class="modal-form" @submit.prevent="submitModal('新版本已发布到线上环境')">
        <label>
          版本标签
          <input v-model="form.version" required placeholder="例如：V4.6" />
        </label>
        <label>
          灰度比例
          <select v-model="form.traffic">
            <option>10%</option>
            <option>30%</option>
            <option>50%</option>
            <option>100%</option>
          </select>
        </label>
        <label>
          回滚策略
          <input v-model="form.strategy" placeholder="例如：连续5分钟错误率>2%" />
        </label>
        <button class="primary" type="submit">确认发布</button>
      </form>
    </Modal>

    <Modal :show="modal.type === 'rollback'" title="回滚进度" @close="closeModal">
      <p>正在切换到稳定版本 V4.2，预计 90 秒完成。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }" />
      </div>
      <p class="progress-text">当前回滚完成 {{ modal.progress }}%</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">继续监控</button>
      </template>
    </Modal>

    <Modal :show="modal.type === 'endpoint'" title="推理接口配置" @close="closeModal">
      <p>接口将支持实时与批量预测，请填写基础信息。</p>
      <div class="info-box">
        <p>访问地址：/api/predict/v4</p>
        <p>鉴权方式：JWT Token</p>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="submitModal('推理接口配置已保存')">保存配置</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import Modal from "../components/Modal.vue";

const loadPoints = [
  { label: "API-01", value: 64 },
  { label: "API-02", value: 82 },
  { label: "API-03", value: 55 },
  { label: "API-04", value: 90 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  version: `V4.${index + 1}`,
  env: index % 2 === 0 ? "生产环境" : "预发布",
  status: index % 3 === 0 ? "灰度中" : "运行中",
  statusClass: index % 3 === 0 ? "warning" : "success",
  qps: `${1200 + index * 20}`,
  owner: ["唐婉", "陈宇", "石磊", "邵琳"][index % 4]
}));

const modal = reactive({ type: "", progress: 58 });
const form = reactive({
  version: "V4.6",
  traffic: "30%",
  strategy: "连续5分钟错误率>2%"
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
  modal.progress = 88;
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

.load {
  display: grid;
  gap: 10px;
}

.load-point {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: #475569;
}

.bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
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
