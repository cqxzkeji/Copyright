<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h3>监控与预警系统</h3>
        <div class="actions">
          <button @click="openModal('rule')">新增预警规则</button>
          <button @click="openModal('monitor')">模型监控</button>
          <button @click="openModal('alert')">实时告警</button>
          <button class="ghost" @click="openModal('report')">预警报告</button>
          <button class="ghost" @click="openProgress">监控进度</button>
          <button class="ghost" @click="openTip('报警已发送至值班人员。')">按钮提示</button>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h4>实时监控曲线</h4>
          <svg viewBox="0 0 320 140">
            <polyline
              fill="none"
              stroke="#ef4444"
              stroke-width="3"
              points="10,100 50,90 90,92 130,70 170,80 210,60 250,66 290,50"
            />
          </svg>
        </div>
        <div class="card">
          <h4>预警统计</h4>
          <div class="stats">
            <div>
              <span>今日告警</span>
              <strong>28 条</strong>
            </div>
            <div>
              <span>已处理</span>
              <strong>21 条</strong>
            </div>
            <div>
              <span>待处理</span>
              <strong>7 条</strong>
            </div>
            <div>
              <span>模型异常</span>
              <strong>3 次</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>预警事件记录</h3>
        <span class="sub">实时监控数据流与分析过程</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>事件编号</th>
              <th>监控对象</th>
              <th>触发规则</th>
              <th>等级</th>
              <th>状态</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in alertRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.target }}</td>
              <td>{{ row.rule }}</td>
              <td>{{ row.level }}</td>
              <td><span :class="['status', row.statusClass]">{{ row.status }}</span></td>
              <td>{{ row.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <BaseModal :show="modals.rule" title="新增预警规则" @close="closeModal('rule')">
    <form class="modal-form" @submit.prevent="submitRule">
      <label>
        规则名称
        <input v-model="forms.rule.name" type="text" required />
      </label>
      <label>
        触发条件
        <input v-model="forms.rule.condition" type="text" placeholder="响应时间 > 2 秒" />
      </label>
      <label>
        告警等级
        <select v-model="forms.rule.level">
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('rule')">取消</button>
        <button type="submit">保存规则</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.monitor" title="模型监控设置" @close="closeModal('monitor')">
    <form class="modal-form" @submit.prevent="submitMonitor">
      <label>
        监控模型
        <input v-model="forms.monitor.model" type="text" placeholder="如：实时风控模型" />
      </label>
      <label>
        监控指标
        <input v-model="forms.monitor.metric" type="text" placeholder="准确率、延迟" />
      </label>
      <label>
        采样频率
        <select v-model="forms.monitor.rate">
          <option value="每分钟">每分钟</option>
          <option value="每5分钟">每5分钟</option>
          <option value="每小时">每小时</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('monitor')">取消</button>
        <button type="submit">开启监控</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.alert" title="实时告警推送" @close="closeModal('alert')">
    <form class="modal-form" @submit.prevent="submitAlert">
      <label>
        接收人
        <input v-model="forms.alert.receiver" type="text" placeholder="值班负责人" />
      </label>
      <label>
        告警通道
        <select v-model="forms.alert.channel">
          <option value="短信">短信</option>
          <option value="邮件">邮件</option>
          <option value="IM 消息">IM 消息</option>
        </select>
      </label>
      <label>
        备注
        <input v-model="forms.alert.note" type="text" placeholder="需要关注的问题" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('alert')">取消</button>
        <button type="submit">发送告警</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.report" title="预警报告生成" @close="closeModal('report')">
    <form class="modal-form" @submit.prevent="submitReport">
      <label>
        报告周期
        <select v-model="forms.report.period">
          <option value="日报">日报</option>
          <option value="周报">周报</option>
          <option value="月报">月报</option>
        </select>
      </label>
      <label>
        报告范围
        <input v-model="forms.report.scope" type="text" placeholder="如：全量告警" />
      </label>
      <label>
        输出方式
        <select v-model="forms.report.channel">
          <option value="下载">下载</option>
          <option value="邮件">邮件</option>
          <option value="API">API</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('report')">取消</button>
        <button type="submit">生成报告</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.progress" title="监控进度" @close="closeModal('progress')">
    <div class="progress-card">
      <p>监控任务正在同步实时数据流。</p>
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
  rule: false,
  monitor: false,
  alert: false,
  report: false,
  progress: false,
  tip: false
});

const forms = reactive({
  rule: { name: "", condition: "", level: "中" },
  monitor: { model: "", metric: "", rate: "每5分钟" },
  alert: { receiver: "", channel: "短信", note: "" },
  report: { period: "周报", scope: "", channel: "下载" }
});

const tipMessage = ref("");
const progress = ref(0);
let progressTimer;

const alertRows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `MT-${index + 1}`.padStart(6, "0"),
    target: index % 2 === 0 ? "数据流监控" : "模型服务",
    rule: index % 3 === 0 ? "延迟异常" : "阈值触发",
    level: index % 3 === 0 ? "高" : index % 2 === 0 ? "中" : "低",
    status: index % 4 === 0 ? "处理中" : index % 3 === 0 ? "待确认" : "已恢复",
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

const submitRule = () => {
  alertRows.value.unshift({
    id: `MT-${alertRows.value.length + 1}`.padStart(6, "0"),
    target: "数据流监控",
    rule: forms.rule.condition || "自定义规则",
    level: forms.rule.level,
    status: "待确认",
    statusClass: "pending",
    time: new Date().toISOString().slice(0, 10)
  });
  closeModal("rule");
  openTip("预警规则已保存并开始生效。");
};

const submitMonitor = () => {
  closeModal("monitor");
  openTip("监控任务已开启并进入实时监控队列。");
};

const submitAlert = () => {
  closeModal("alert");
  openTip("实时告警已发送至指定接收人。");
};

const submitReport = () => {
  closeModal("report");
  openTip("预警报告已生成并准备推送。");
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
    progress.value += 11;
  }, 220);
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
  background: #ef4444;
  color: #fff;
  cursor: pointer;
}

.ghost {
  background: #fee2e2;
  color: #b91c1c;
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

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stats span {
  font-size: 12px;
  color: #6b7280;
}

.stats strong {
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
  background: #fee2e2;
  color: #b91c1c;
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
  background: linear-gradient(90deg, #fecaca, #ef4444);
}

.sub {
  font-size: 13px;
  color: #6b7280;
}
</style>
