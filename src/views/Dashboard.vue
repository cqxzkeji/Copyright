<template>
  <div class="page">
    <div class="cards">
      <div class="card">
        <h4>整体资源池</h4>
        <p>可用计算单元</p>
        <strong>{{ summary.totalUnits }} 核心</strong>
      </div>
      <div class="card">
        <h4>实时负载</h4>
        <p>最新 5 分钟</p>
        <strong>{{ summary.currentLoad }}%</strong>
      </div>
      <div class="card">
        <h4>告警状态</h4>
        <p>待处理事件</p>
        <strong>{{ summary.alerts }} 条</strong>
      </div>
      <div class="card">
        <h4>成本预测</h4>
        <p>本月预算消耗</p>
        <strong>{{ summary.cost }}%</strong>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div>
          <h3>云资源实时趋势</h3>
          <p>监控核心资源利用率变化</p>
        </div>
        <div class="actions">
          <button @click="openForm('report')">生成日报</button>
          <button class="outline" @click="openProgress('refresh')">刷新指标</button>
          <button class="ghost" @click="openInfo('notice')">通知运维</button>
        </div>
      </div>
      <BarChart :data="trendData" />
    </div>

    <div class="section">
      <div class="section-header">
        <div>
          <h3>核心业务运行清单</h3>
          <p>记录近 20 条业务运行与资源分配</p>
        </div>
      </div>
      <DataTable :columns="columns" :rows="rows" />
    </div>

    <BaseModal :open="modal.open" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'form'">
        <form class="modal-form" @submit.prevent="submitForm">
          <label>
            报表名称
            <input v-model="form.name" required placeholder="例如：核心资源日报" />
          </label>
          <label>
            发送对象
            <input v-model="form.target" required placeholder="运维负责人/部门" />
          </label>
          <label>
            备注说明
            <textarea v-model="form.notes" rows="3" placeholder="填写报表说明"></textarea>
          </label>
          <div class="footer-actions">
            <button type="button" class="outline" @click="closeModal">取消</button>
            <button type="submit">确认生成</button>
          </div>
        </form>
      </template>

      <template v-else-if="modal.type === 'progress'">
        <p>正在同步最新监控指标，请稍候...</p>
        <ProgressBar :value="progress" />
      </template>

      <template v-else>
        <p>{{ modal.message }}</p>
        <div class="footer-actions">
          <button type="button" class="outline" @click="closeModal">我知道了</button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import ProgressBar from "../components/ProgressBar.vue";
import BarChart from "../components/BarChart.vue";
import DataTable from "../components/DataTable.vue";

const summary = reactive({
  totalUnits: 1280,
  currentLoad: 72,
  alerts: 3,
  cost: 61
});

const trendData = Array.from({ length: 20 }, (_, index) => ({
  label: `T${index + 1}`,
  value: 40 + ((index * 7) % 55)
}));

const columns = [
  { key: "id", label: "序号" },
  { key: "service", label: "业务名称" },
  { key: "region", label: "区域" },
  { key: "load", label: "负载" },
  { key: "status", label: "状态" }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  service: `核心业务-${String(index + 1).padStart(2, "0")}`,
  region: index % 2 === 0 ? "华东-1" : "华南-2",
  load: `${55 + (index % 40)}%`,
  status: index % 3 === 0 ? "稳定" : "可扩展"
}));

const modal = reactive({
  open: false,
  type: "info",
  title: "",
  message: ""
});

const form = reactive({
  name: "",
  target: "",
  notes: ""
});

const progress = ref(0);
let timer;

const openForm = () => {
  modal.open = true;
  modal.type = "form";
  modal.title = "生成资源日报";
};

const openProgress = () => {
  modal.open = true;
  modal.type = "progress";
  modal.title = "刷新监控指标";
  progress.value = 0;
  timer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + 12);
    if (progress.value >= 100) {
      window.clearInterval(timer);
    }
  }, 300);
};

const openInfo = () => {
  modal.open = true;
  modal.type = "info";
  modal.title = "通知已发送";
  modal.message = "已向运维团队推送高优先级运行提醒。";
};

const closeModal = () => {
  modal.open = false;
  if (timer) {
    window.clearInterval(timer);
  }
};

const submitForm = () => {
  modal.open = false;
  form.name = "";
  form.target = "";
  form.notes = "";
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.card h4 {
  margin: 0 0 6px;
}

.card p {
  margin: 0 0 12px;
  color: #64748b;
}

.section {
  background: #ffffff;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.section-header h3 {
  margin: 0 0 6px;
}

.section-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background: #3b82f6;
  color: #ffffff;
  cursor: pointer;
}

button.outline {
  background: #e0f2fe;
  color: #0284c7;
}

button.ghost {
  background: #f1f5f9;
  color: #475569;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-form input,
.modal-form textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
</style>
