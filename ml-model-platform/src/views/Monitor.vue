<template>
  <div class="module-page">
    <section class="summary">
      <div class="summary-card">
        <h3>实验运行</h3>
        <p>今日活跃</p>
        <strong>12</strong>
      </div>
      <div class="summary-card">
        <h3>算力使用</h3>
        <p>GPU 占用</p>
        <strong>76%</strong>
      </div>
      <div class="summary-card">
        <h3>告警事件</h3>
        <p>待处理</p>
        <strong>3</strong>
      </div>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>实验管理与系统监控</h2>
        <div class="actions">
          <button class="primary" @click="openModal('audit')">发起审计</button>
          <button class="ghost" @click="openModal('alert')">配置告警策略</button>
          <button class="ghost" @click="openModal('report')">生成资源报告</button>
        </div>
      </header>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-title">算力占用趋势</div>
          <div class="sparkline">
            <span v-for="point in usage" :key="point" :style="{ height: point + '%' }" />
          </div>
          <div class="legend">平均占用 76%</div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>实验编号</th>
                <th>资源池</th>
                <th>状态</th>
                <th>运行时长</th>
                <th>负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.pool }}</td>
                <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
                <td>{{ row.duration }}</td>
                <td>{{ row.owner }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <Modal :show="modal.type === 'audit'" title="任务审计" @close="closeModal">
      <form class="modal-form" @submit.prevent="submitModal('审计任务已提交')">
        <label>
          审计范围
          <select v-model="form.scope">
            <option>最近7天实验</option>
            <option>全部线上任务</option>
            <option>指定项目</option>
          </select>
        </label>
        <label>
          输出格式
          <select v-model="form.format">
            <option>PDF 报告</option>
            <option>CSV 列表</option>
          </select>
        </label>
        <label>
          审计说明
          <input v-model="form.note" placeholder="可填写说明" />
        </label>
        <button class="primary" type="submit">提交审计</button>
      </form>
    </Modal>

    <Modal :show="modal.type === 'alert'" title="告警策略配置" @close="closeModal">
      <p>当前策略将监控 GPU 占用、训练失败率与接口延迟。</p>
      <div class="info-box">
        <p>触发阈值：GPU > 85%，失败率 > 3%</p>
        <p>通知方式：企业微信 + 邮件</p>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="submitModal('告警策略已更新')">保存策略</button>
      </template>
    </Modal>

    <Modal :show="modal.type === 'report'" title="生成资源报告" @close="closeModal">
      <p>报告将包含 GPU/CPU 占用率、队列等待时间与异常列表。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }" />
      </div>
      <p class="progress-text">预计 1 分钟后完成</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">返回</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import Modal from "../components/Modal.vue";

const usage = [30, 42, 55, 68, 72, 78, 82, 76, 70, 64];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: `EX-${String(index + 1).padStart(2, "0")}`,
  pool: index % 2 === 0 ? "GPU-A" : "GPU-B",
  status: index % 3 === 0 ? "异常" : "运行中",
  statusClass: index % 3 === 0 ? "danger" : "success",
  duration: `${2 + index} 小时`,
  owner: ["周莹", "高飞", "余鹏", "马宁"][index % 4]
}));

const modal = reactive({ type: "", progress: 66 });
const form = reactive({
  scope: "最近7天实验",
  format: "PDF 报告",
  note: "关注GPU占用异常"
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
  gap: 16px;
}

.chart-title {
  font-size: 14px;
  color: #64748b;
}

.sparkline {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  align-items: end;
  gap: 6px;
  height: 160px;
}

.sparkline span {
  background: linear-gradient(180deg, #38bdf8, #2563eb);
  border-radius: 6px 6px 0 0;
}

.legend {
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

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.success {
  background: #dcfce7;
  color: #166534;
}

.tag.danger {
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
