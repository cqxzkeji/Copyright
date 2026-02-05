<template>
  <div class="page">
    <div class="section">
      <div class="section-header">
        <div>
          <h3>监控与预警系统</h3>
          <p>实时采集资源性能并自动触发预警</p>
        </div>
        <div class="actions">
          <button @click="openForm">配置预警阈值</button>
          <button class="outline" @click="openProgress">执行健康扫描</button>
          <button class="ghost" @click="openInfo">预警提示</button>
        </div>
      </div>
      <BarChart :data="chartData" />
    </div>

    <DataTable :columns="columns" :rows="rows" />

    <BaseModal :open="modal.open" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'form'">
        <form class="modal-form" @submit.prevent="submitForm">
          <label>
            监控项名称
            <input v-model="form.name" required placeholder="例如：数据库 CPU" />
          </label>
          <label>
            阈值范围
            <input v-model="form.range" required placeholder="例如：70% - 85%" />
          </label>
          <label>
            通知渠道
            <input v-model="form.channel" required placeholder="短信/邮件/IM" />
          </label>
          <label>
            说明
            <textarea v-model="form.notes" rows="3" placeholder="填写通知策略"></textarea>
          </label>
          <div class="footer-actions">
            <button type="button" class="outline" @click="closeModal">取消</button>
            <button type="submit">保存配置</button>
          </div>
        </form>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <p>健康扫描执行中，正在生成预警检测报告。</p>
        <ProgressBar :value="progress" />
      </template>
      <template v-else>
        <p>{{ modal.message }}</p>
        <div class="footer-actions">
          <button type="button" class="outline" @click="closeModal">已了解</button>
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

const chartData = Array.from({ length: 20 }, (_, index) => ({
  label: `M${index + 1}`,
  value: 45 + ((index * 6) % 50)
}));

const columns = [
  { key: "id", label: "告警编号" },
  { key: "name", label: "监控项" },
  { key: "value", label: "当前值" },
  { key: "range", label: "阈值" },
  { key: "status", label: "状态" }
];

const rows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `MN-${300 + index}`,
    name: `监控项-${index + 1}`,
    value: `${50 + (index % 45)}%`,
    range: "65% - 85%",
    status: index % 4 === 0 ? "预警" : "正常"
  }))
);

const modal = reactive({
  open: false,
  type: "info",
  title: "",
  message: ""
});

const form = reactive({
  name: "",
  range: "",
  channel: "",
  notes: ""
});

const progress = ref(0);
let timer;

const openForm = () => {
  modal.open = true;
  modal.type = "form";
  modal.title = "配置预警阈值";
};

const openProgress = () => {
  modal.open = true;
  modal.type = "progress";
  modal.title = "执行健康扫描";
  progress.value = 0;
  timer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + 14);
    if (progress.value >= 100) {
      window.clearInterval(timer);
    }
  }, 250);
};

const openInfo = () => {
  modal.open = true;
  modal.type = "info";
  modal.title = "预警提示";
  modal.message = "系统已启用多通道预警，当前无高危告警。";
};

const closeModal = () => {
  modal.open = false;
  if (timer) {
    window.clearInterval(timer);
  }
};

const submitForm = () => {
  rows.value.unshift({
    id: `MN-${Math.floor(400 + Math.random() * 200)}`,
    name: form.name,
    value: "--",
    range: form.range,
    status: "已配置"
  });
  form.name = "";
  form.range = "";
  form.channel = "";
  form.notes = "";
  modal.open = false;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
