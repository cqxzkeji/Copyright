<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h3>业务规则与决策支持</h3>
        <div class="actions">
          <button @click="openModal('model')">新建决策模型</button>
          <button @click="openModal('rule')">规则引擎配置</button>
          <button @click="openModal('reason')">智能推理</button>
          <button class="ghost" @click="openModal('report')">决策报告</button>
          <button class="ghost" @click="openProgress">推理进度</button>
          <button class="ghost" @click="openTip('决策建议已推送至业务看板。')">按钮提示</button>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h4>决策命中率</h4>
          <svg viewBox="0 0 320 140">
            <polygon points="160,20 260,60 230,120 90,120 60,60" fill="#fef3c7" />
            <polyline points="160,30 240,70 215,110 105,110 80,70 160,30" fill="none" stroke="#f59e0b" stroke-width="3" />
            <circle cx="160" cy="30" r="4" fill="#f59e0b" />
            <circle cx="240" cy="70" r="4" fill="#f59e0b" />
            <circle cx="215" cy="110" r="4" fill="#f59e0b" />
            <circle cx="105" cy="110" r="4" fill="#f59e0b" />
            <circle cx="80" cy="70" r="4" fill="#f59e0b" />
          </svg>
        </div>
        <div class="card">
          <h4>决策建议概览</h4>
          <div class="info-grid">
            <div>
              <span>实时规则</span>
              <strong>84 条</strong>
            </div>
            <div>
              <span>推理任务</span>
              <strong>12 个</strong>
            </div>
            <div>
              <span>建议采纳率</span>
              <strong>76%</strong>
            </div>
            <div>
              <span>待审批</span>
              <strong>9 项</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>决策任务清单</h3>
        <span class="sub">基于数据模型生成业务建议</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>规则集</th>
              <th>触发条件</th>
              <th>建议类型</th>
              <th>状态</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in decisionRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.rule }}</td>
              <td>{{ row.trigger }}</td>
              <td>{{ row.type }}</td>
              <td><span :class="['status', row.statusClass]">{{ row.status }}</span></td>
              <td>{{ row.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <BaseModal :show="modals.model" title="新建决策模型" @close="closeModal('model')">
    <form class="modal-form" @submit.prevent="submitModel">
      <label>
        模型名称
        <input v-model="forms.model.name" type="text" required />
      </label>
      <label>
        目标指标
        <input v-model="forms.model.kpi" type="text" placeholder="如：收入提升" />
      </label>
      <label>
        规则模板
        <select v-model="forms.model.template">
          <option value="营销策略">营销策略</option>
          <option value="风险控制">风险控制</option>
          <option value="运营效率">运营效率</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('model')">取消</button>
        <button type="submit">创建模型</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.rule" title="规则引擎配置" @close="closeModal('rule')">
    <form class="modal-form" @submit.prevent="submitRule">
      <label>
        规则名称
        <input v-model="forms.rule.name" type="text" placeholder="如：高价值客户流失预警" />
      </label>
      <label>
        条件表达式
        <input v-model="forms.rule.condition" type="text" placeholder="流失概率 > 0.7" />
      </label>
      <label>
        动作
        <select v-model="forms.rule.action">
          <option value="推送预警">推送预警</option>
          <option value="触发审批">触发审批</option>
          <option value="调整策略">调整策略</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('rule')">取消</button>
        <button type="submit">保存规则</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.reason" title="智能推理任务" @close="closeModal('reason')">
    <form class="modal-form" @submit.prevent="submitReason">
      <label>
        选择模型
        <input v-model="forms.reason.model" type="text" placeholder="如：增长决策模型" />
      </label>
      <label>
        推理范围
        <select v-model="forms.reason.scope">
          <option value="全量数据">全量数据</option>
          <option value="重点区域">重点区域</option>
          <option value="高价值客户">高价值客户</option>
        </select>
      </label>
      <label>
        输出格式
        <input v-model="forms.reason.output" type="text" placeholder="报表 + 建议清单" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('reason')">取消</button>
        <button type="submit">启动推理</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.report" title="决策报告生成" @close="closeModal('report')">
    <form class="modal-form" @submit.prevent="submitReport">
      <label>
        报告主题
        <input v-model="forms.report.title" type="text" placeholder="季度决策建议汇总" />
      </label>
      <label>
        负责人
        <input v-model="forms.report.owner" type="text" placeholder="数据运营组" />
      </label>
      <label>
        输出方式
        <select v-model="forms.report.channel">
          <option value="系统下载">系统下载</option>
          <option value="邮件发送">邮件发送</option>
          <option value="API 推送">API 推送</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('report')">取消</button>
        <button type="submit">生成报告</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.progress" title="推理进度" @close="closeModal('progress')">
    <div class="progress-card">
      <p>推理引擎正在计算业务建议。</p>
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
  rule: false,
  reason: false,
  report: false,
  progress: false,
  tip: false
});

const forms = reactive({
  model: { name: "", kpi: "", template: "营销策略" },
  rule: { name: "", condition: "", action: "推送预警" },
  reason: { model: "", scope: "全量数据", output: "" },
  report: { title: "", owner: "", channel: "系统下载" }
});

const tipMessage = ref("");
const progress = ref(0);
let progressTimer;

const decisionRows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `DS-${index + 1}`.padStart(6, "0"),
    rule: index % 2 === 0 ? "风险控制规则" : "营销策略规则",
    trigger: index % 3 === 0 ? "指标异常" : "阈值触发",
    type: index % 2 === 0 ? "预警建议" : "策略调整",
    status: index % 4 === 0 ? "推理中" : index % 3 === 0 ? "待审批" : "已发布",
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
  decisionRows.value.unshift({
    id: `DS-${decisionRows.value.length + 1}`.padStart(6, "0"),
    rule: forms.model.template,
    trigger: forms.model.kpi || "核心指标",
    type: "策略建议",
    status: "推理中",
    statusClass: "running",
    time: new Date().toISOString().slice(0, 10)
  });
  closeModal("model");
  openTip("决策模型已创建并进入推理流程。");
};

const submitRule = () => {
  closeModal("rule");
  openTip("规则引擎配置已保存并同步到实时引擎。");
};

const submitReason = () => {
  closeModal("reason");
  openTip("智能推理任务已启动，预计 5 分钟完成。");
};

const submitReport = () => {
  closeModal("report");
  openTip("决策报告正在生成并推送到指定渠道。");
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
    progress.value += 9;
  }, 240);
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
  background: #f59e0b;
  color: #fff;
  cursor: pointer;
}

.ghost {
  background: #fef3c7;
  color: #b45309;
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.info-grid span {
  font-size: 12px;
  color: #6b7280;
}

.info-grid strong {
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
  background: #fef3c7;
  color: #b45309;
}

.status.pending {
  background: #fde68a;
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
  background: linear-gradient(90deg, #fde68a, #f59e0b);
}

.sub {
  font-size: 13px;
  color: #6b7280;
}
</style>
