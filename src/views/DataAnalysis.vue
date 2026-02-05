<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h3>数据智能分析与挖掘</h3>
        <div class="actions">
          <button @click="openModal('model')">新建分析模型</button>
          <button @click="openModal('batch')">批量分析</button>
          <button @click="openModal('stream')">实时分析</button>
          <button class="ghost" @click="openModal('report')">报表生成</button>
          <button class="ghost" @click="openProgress">分析进度</button>
          <button class="ghost" @click="openTip('分析结果已推送至可视化看板。')">按钮提示</button>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h4>模型准确率趋势</h4>
          <svg viewBox="0 0 320 140">
            <polyline
              fill="none"
              stroke="#8b5cf6"
              stroke-width="3"
              :points="linePoints"
            />
            <circle v-for="(point, idx) in lineCoords" :key="idx" :cx="point.x" :cy="point.y" r="4" fill="#8b5cf6" />
          </svg>
        </div>
        <div class="card">
          <h4>分析类型分布</h4>
          <div class="stat-list">
            <div>
              <span>机器学习</span>
              <strong>42%</strong>
            </div>
            <div>
              <span>深度学习</span>
              <strong>28%</strong>
            </div>
            <div>
              <span>统计分析</span>
              <strong>30%</strong>
            </div>
            <div>
              <span>实时任务</span>
              <strong>16 个</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>分析任务清单</h3>
        <span class="sub">支持实时与批量数据分析</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>模型名称</th>
              <th>分析类型</th>
              <th>样本量</th>
              <th>结果状态</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in analysisRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.sample }}</td>
              <td><span :class="['status', row.statusClass]">{{ row.status }}</span></td>
              <td>{{ row.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <BaseModal :show="modals.model" title="新建分析模型" @close="closeModal('model')">
    <form class="modal-form" @submit.prevent="submitModel">
      <label>
        模型名称
        <input v-model="forms.model.name" type="text" placeholder="如：客户流失预测" required />
      </label>
      <label>
        分析类型
        <select v-model="forms.model.type">
          <option value="机器学习">机器学习</option>
          <option value="深度学习">深度学习</option>
          <option value="统计分析">统计分析</option>
        </select>
      </label>
      <label>
        特征字段
        <input v-model="forms.model.features" type="text" placeholder="如：活跃度、消费频次" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('model')">取消</button>
        <button type="submit">创建模型</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.batch" title="批量分析任务" @close="closeModal('batch')">
    <form class="modal-form" @submit.prevent="submitBatch">
      <label>
        数据集
        <input v-model="forms.batch.dataset" type="text" placeholder="如：近半年交易数据" />
      </label>
      <label>
        调度时间
        <input v-model="forms.batch.schedule" type="text" placeholder="今晚 22:00" />
      </label>
      <label>
        输出格式
        <select v-model="forms.batch.format">
          <option value="可视化报告">可视化报告</option>
          <option value="CSV">CSV</option>
          <option value="JSON">JSON</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('batch')">取消</button>
        <button type="submit">提交任务</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.stream" title="实时分析配置" @close="closeModal('stream')">
    <form class="modal-form" @submit.prevent="submitStream">
      <label>
        流数据来源
        <input v-model="forms.stream.source" type="text" placeholder="Kafka Topic" />
      </label>
      <label>
        延迟阈值
        <input v-model="forms.stream.latency" type="text" placeholder="如：3 秒" />
      </label>
      <label>
        告警规则
        <input v-model="forms.stream.rule" type="text" placeholder="波动超过 10%" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('stream')">取消</button>
        <button type="submit">启动实时分析</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.report" title="报表生成" @close="closeModal('report')">
    <form class="modal-form" @submit.prevent="submitReport">
      <label>
        报表主题
        <input v-model="forms.report.title" type="text" placeholder="如：营销效果分析" />
      </label>
      <label>
        时间范围
        <input v-model="forms.report.range" type="text" placeholder="2024/07 - 2024/09" />
      </label>
      <label>
        输出方式
        <select v-model="forms.report.channel">
          <option value="系统看板">系统看板</option>
          <option value="邮件推送">邮件推送</option>
          <option value="PDF 下载">PDF 下载</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('report')">取消</button>
        <button type="submit">生成报表</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.progress" title="分析进度" @close="closeModal('progress')">
    <div class="progress-card">
      <p>批量分析任务正在计算模型结果。</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <strong>{{ progress }}%</strong>
    </div>
    <template #footer>
      <button type="button" class="secondary" @click="closeModal('progress')">关闭</button>
    </template>
  </BaseModal>

  <BaseModal :show="modals.tip" title="提示信息" @close="closeModal('tip')">
    <p>{{ tipMessage }}</p>
    <template #footer>
      <button type="button" class="secondary" @click="closeModal('tip')">知道了</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modals = reactive({
  model: false,
  batch: false,
  stream: false,
  report: false,
  progress: false,
  tip: false
});

const forms = reactive({
  model: { name: "", type: "机器学习", features: "" },
  batch: { dataset: "", schedule: "", format: "可视化报告" },
  stream: { source: "", latency: "", rule: "" },
  report: { title: "", range: "", channel: "系统看板" }
});

const tipMessage = ref("");
const progress = ref(0);
let progressTimer;

const lineCoords = [
  { x: 20, y: 110 },
  { x: 80, y: 90 },
  { x: 140, y: 70 },
  { x: 200, y: 60 },
  { x: 260, y: 50 },
  { x: 300, y: 40 }
];

const linePoints = lineCoords.map((point) => `${point.x},${point.y}`).join(" ");

const analysisRows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `AN-${index + 1}`.padStart(6, "0"),
    name: index % 2 === 0 ? "需求预测模型" : "用户画像聚类",
    type: index % 3 === 0 ? "深度学习" : index % 2 === 0 ? "机器学习" : "统计分析",
    sample: `${(index + 2) * 3} 万`,
    status: index % 4 === 0 ? "运行中" : index % 3 === 0 ? "待审核" : "已完成",
    statusClass: index % 4 === 0 ? "running" : index % 3 === 0 ? "pending" : "done",
    time: `2024-09-${(index % 28) + 1}`.padStart(10, "0")
  }))
);

const openModal = (name) => {
  modals[name] = true;
};

const closeModal = (name) => {
  modals[name] = false;
};

const openTip = (message) => {
  tipMessage.value = message;
  modals.tip = true;
};

const submitModel = () => {
  analysisRows.value.unshift({
    id: `AN-${analysisRows.value.length + 1}`.padStart(6, "0"),
    name: forms.model.name,
    type: forms.model.type,
    sample: "5 万",
    status: "运行中",
    statusClass: "running",
    time: new Date().toISOString().slice(0, 10)
  });
  closeModal("model");
  openTip("新建模型已加入训练队列。");
};

const submitBatch = () => {
  closeModal("batch");
  openTip("批量分析任务已加入调度。");
};

const submitStream = () => {
  closeModal("stream");
  openTip("实时分析已启动，并开始监控异常指标。");
};

const submitReport = () => {
  closeModal("report");
  openTip("报表生成任务已发送至可视化中心。");
};

const openProgress = () => {
  modals.progress = true;
  progress.value = 0;
  if (progressTimer) {
    clearInterval(progressTimer);
  }
  progressTimer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(progressTimer);
      return;
    }
    progress.value += 7;
  }, 260);
};

onBeforeUnmount(() => {
  if (progressTimer) {
    clearInterval(progressTimer);
  }
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  background: #7c3aed;
  color: #fff;
  cursor: pointer;
}

.ghost {
  background: #ede9fe;
  color: #6d28d9;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.stat-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-list span {
  font-size: 12px;
  color: #6b7280;
}

.stat-list strong {
  display: block;
  font-size: 18px;
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
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
}

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.running {
  background: #ede9fe;
  color: #6d28d9;
}

.status.pending {
  background: #fef3c7;
  color: #b45309;
}

.status.done {
  background: #ecfdf3;
  color: #047857;
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
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.progress-card {
  display: grid;
  gap: 12px;
}

.progress-bar {
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c4b5fd, #7c3aed);
}

.sub {
  font-size: 13px;
  color: #6b7280;
}
</style>
