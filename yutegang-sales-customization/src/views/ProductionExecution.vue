<template>
  <div class="module-page">
    <section class="module-header">
      <div>
        <h3>生产调度与执行</h3>
        <p>调度产线资源，监控生产执行进度与质量指标。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openForm">新增调度</button>
        <button class="ghost" @click="openProgress">执行监控</button>
        <button class="ghost" @click="openTips">调度提示</button>
      </div>
    </section>

    <section class="card-grid">
      <ChartPanel
        title="产线负荷"
        subtitle="今日负荷占比"
        :labels="['A线', 'B线', 'C线', 'D线']"
        :values="[78, 64, 52, 40]"
      />
      <ChartPanel
        title="关键工序良率"
        subtitle="本周合格率"
        :labels="['冶炼', '轧制', '热处理']"
        :values="[88, 76, 70]"
      />
      <div class="summary-card">
        <h4>执行重点</h4>
        <ul>
          <li>本周夜班产线需加强温控监测。</li>
          <li>关键设备保养安排在周五。</li>
          <li>订单 QO-011 需优先排产。</li>
        </ul>
      </div>
    </section>

    <DataTable :headers="headers" :rows="rows" />

    <BaseModal
      :show="formModal"
      title="生产调度安排"
      width="640px"
      @close="formModal = false"
    >
      <form class="modal-form">
        <label>
          订单编号
          <input v-model="form.order" placeholder="如：QO-011" />
        </label>
        <label>
          产线选择
          <input v-model="form.line" placeholder="A线/B线/C线" />
        </label>
        <label>
          班次安排
          <input v-model="form.shift" placeholder="白班/夜班" />
        </label>
        <label>
          预计产量
          <input v-model="form.output" placeholder="如：60 吨" />
        </label>
        <label>
          质量控制点
          <input v-model="form.quality" placeholder="关键工序检查项" />
        </label>
      </form>
      <template #footer>
        <button class="secondary" @click="formModal = false">取消</button>
        <button class="primary" @click="saveForm">提交调度</button>
      </template>
    </BaseModal>

    <BaseModal
      :show="progressModal"
      title="生产执行进度"
      width="560px"
      @close="progressModal = false"
    >
      <div class="progress-card">
        <p>系统正在同步实时生产执行数据。</p>
        <div class="progress">
          <div class="bar" />
        </div>
        <ul>
          <li>工单派发完成</li>
          <li>原料准备完成</li>
          <li>热处理执行中</li>
          <li>质量检验待确认</li>
        </ul>
      </div>
    </BaseModal>

    <BaseModal
      :show="tipsModal"
      title="调度提醒"
      width="520px"
      @close="tipsModal = false"
    >
      <ul class="tips">
        <li>高温工序需提前检查冷却系统。</li>
        <li>高优先级订单需至少预留 15% 产能。</li>
        <li>夜班生产需增加巡检频次。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import DataTable from "../components/DataTable.vue";
import ChartPanel from "../components/ChartPanel.vue";

const headers = [
  "工单编号",
  "订单编号",
  "产线",
  "班次",
  "计划产量",
  "执行状态",
  "完成率",
];

const rows = [
  ["PE-001", "QO-002", "A线", "白班", "80 吨", "执行中", "65%"],
  ["PE-002", "QO-003", "B线", "夜班", "60 吨", "执行中", "48%"],
  ["PE-003", "QO-004", "C线", "白班", "70 吨", "待开始", "0%"],
  ["PE-004", "QO-005", "D线", "夜班", "50 吨", "准备中", "15%"],
  ["PE-005", "QO-006", "A线", "白班", "90 吨", "执行中", "72%"],
  ["PE-006", "QO-007", "B线", "夜班", "65 吨", "执行中", "51%"],
  ["PE-007", "QO-008", "C线", "白班", "55 吨", "待开始", "0%"],
  ["PE-008", "QO-009", "D线", "夜班", "45 吨", "准备中", "20%"],
  ["PE-009", "QO-010", "A线", "白班", "85 吨", "执行中", "67%"],
  ["PE-010", "QO-011", "B线", "夜班", "75 吨", "执行中", "58%"],
  ["PE-011", "QO-012", "C线", "白班", "60 吨", "待开始", "0%"],
  ["PE-012", "QO-013", "D线", "夜班", "70 吨", "准备中", "12%"],
  ["PE-013", "QO-014", "A线", "白班", "90 吨", "执行中", "74%"],
  ["PE-014", "QO-015", "B线", "夜班", "80 吨", "执行中", "60%"],
  ["PE-015", "QO-016", "C线", "白班", "55 吨", "待开始", "0%"],
  ["PE-016", "QO-017", "D线", "夜班", "65 吨", "准备中", "18%"],
  ["PE-017", "QO-018", "A线", "白班", "70 吨", "执行中", "69%"],
  ["PE-018", "QO-019", "B线", "夜班", "60 吨", "执行中", "52%"],
  ["PE-019", "QO-020", "C线", "白班", "58 吨", "待开始", "0%"],
  ["PE-020", "QO-021", "D线", "夜班", "62 吨", "准备中", "22%"],
  ["PE-021", "QO-022", "A线", "白班", "95 吨", "执行中", "71%"],
  ["PE-022", "QO-001", "B线", "夜班", "66 吨", "执行中", "49%"],
];

const formModal = ref(false);
const progressModal = ref(false);
const tipsModal = ref(false);
const form = reactive({
  order: "",
  line: "",
  shift: "",
  output: "",
  quality: "",
});

const openForm = () => {
  formModal.value = true;
};

const openProgress = () => {
  progressModal.value = true;
};

const openTips = () => {
  tipsModal.value = true;
};

const saveForm = () => {
  formModal.value = false;
};
</script>

<style scoped>
.module-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.08);
}

.module-header h3 {
  margin: 0 0 6px;
}

.module-header p {
  margin: 0;
  color: #6b79a6;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ghost,
.primary,
.secondary {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eef2ff;
  color: #3c4c7b;
}

.primary {
  background: #3b6af7;
  color: #ffffff;
}

.secondary {
  background: #eef2ff;
  color: #3c4c7b;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 10px 30px rgba(18, 38, 63, 0.08);
}

.summary-card ul {
  margin: 8px 0 0;
  padding-left: 18px;
  color: #5a6798;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form input {
  border: 1px solid #e1e8ff;
  border-radius: 10px;
  padding: 10px 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #4b5d8f;
}

.progress-card ul {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #5a6798;
}

.progress {
  width: 100%;
  height: 10px;
  background: #eef2ff;
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0;
}

.bar {
  height: 100%;
  width: 70%;
  background: linear-gradient(90deg, #6fa0ff, #9cc1ff);
}

.tips {
  padding-left: 18px;
  color: #4b5d8f;
  display: grid;
  gap: 8px;
}
</style>
