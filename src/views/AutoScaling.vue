<template>
  <div class="page">
    <div class="section">
      <div class="section-header">
        <div>
          <h3>弹性伸缩管理</h3>
          <p>自动扩缩资源确保业务高峰稳定运行</p>
        </div>
        <div class="actions">
          <button @click="openForm">新增伸缩策略</button>
          <button class="outline" @click="openProgress">模拟扩容</button>
          <button class="ghost" @click="openInfo">容量建议</button>
        </div>
      </div>
      <BarChart :data="chartData" />
    </div>

    <DataTable :columns="columns" :rows="rows" />

    <BaseModal :open="modal.open" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'form'">
        <form class="modal-form" @submit.prevent="submitForm">
          <label>
            伸缩策略名称
            <input v-model="form.name" required placeholder="例如：营销活动扩容" />
          </label>
          <label>
            触发阈值
            <input v-model="form.threshold" required placeholder="CPU 超过 70%" />
          </label>
          <label>
            最大实例数
            <input v-model="form.max" required type="number" min="1" />
          </label>
          <label>
            说明
            <textarea v-model="form.notes" rows="3" placeholder="填写业务说明"></textarea>
          </label>
          <div class="footer-actions">
            <button type="button" class="outline" @click="closeModal">取消</button>
            <button type="submit">保存策略</button>
          </div>
        </form>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <p>正在执行弹性扩容流程，请稍候...</p>
        <ProgressBar :value="progress" />
      </template>
      <template v-else>
        <p>{{ modal.message }}</p>
        <div class="footer-actions">
          <button type="button" class="outline" @click="closeModal">明白了</button>
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
  label: `S${index + 1}`,
  value: 35 + ((index * 8) % 55)
}));

const columns = [
  { key: "id", label: "策略编号" },
  { key: "name", label: "策略名称" },
  { key: "threshold", label: "触发阈值" },
  { key: "max", label: "最大实例" },
  { key: "status", label: "状态" }
];

const rows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `AS-${200 + index}`,
    name: `弹性策略-${index + 1}`,
    threshold: `${60 + (index % 30)}%`,
    max: 12 + (index % 6),
    status: index % 2 === 0 ? "启用" : "监控中"
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
  threshold: "",
  max: 10,
  notes: ""
});

const progress = ref(0);
let timer;

const openForm = () => {
  modal.open = true;
  modal.type = "form";
  modal.title = "新增伸缩策略";
};

const openProgress = () => {
  modal.open = true;
  modal.type = "progress";
  modal.title = "模拟扩容执行";
  progress.value = 0;
  timer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + 10);
    if (progress.value >= 100) {
      window.clearInterval(timer);
    }
  }, 240);
};

const openInfo = () => {
  modal.open = true;
  modal.type = "info";
  modal.title = "容量建议";
  modal.message = "根据历史流量，建议高峰时段预留 20% 以上扩容空间。";
};

const closeModal = () => {
  modal.open = false;
  if (timer) {
    window.clearInterval(timer);
  }
};

const submitForm = () => {
  rows.value.unshift({
    id: `AS-${Math.floor(300 + Math.random() * 200)}`,
    name: form.name,
    threshold: form.threshold,
    max: form.max,
    status: "启用"
  });
  form.name = "";
  form.threshold = "";
  form.max = 10;
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
