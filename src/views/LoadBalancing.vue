<template>
  <div class="page">
    <div class="section">
      <div class="section-header">
        <div>
          <h3>负载均衡与流量管理</h3>
          <p>智能调度多节点流量，保障高可用性</p>
        </div>
        <div class="actions">
          <button @click="openForm">新增转发策略</button>
          <button class="outline" @click="openProgress">执行流量切换</button>
          <button class="ghost" @click="openInfo">流量提醒</button>
        </div>
      </div>
      <BarChart :data="chartData" />
    </div>

    <DataTable :columns="columns" :rows="rows" />

    <BaseModal :open="modal.open" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'form'">
        <form class="modal-form" @submit.prevent="submitForm">
          <label>
            策略名称
            <input v-model="form.name" required placeholder="例如：核心 API 流量切换" />
          </label>
          <label>
            目标集群
            <input v-model="form.cluster" required placeholder="集群名称" />
          </label>
          <label>
            分发比例
            <input v-model="form.ratio" required placeholder="例如：50/30/20" />
          </label>
          <label>
            说明
            <textarea v-model="form.notes" rows="3" placeholder="填写策略说明"></textarea>
          </label>
          <div class="footer-actions">
            <button type="button" class="outline" @click="closeModal">取消</button>
            <button type="submit">保存策略</button>
          </div>
        </form>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <p>流量切换执行中，正在分配新的权重。</p>
        <ProgressBar :value="progress" />
      </template>
      <template v-else>
        <p>{{ modal.message }}</p>
        <div class="footer-actions">
          <button type="button" class="outline" @click="closeModal">好的</button>
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
  label: `L${index + 1}`,
  value: 42 + ((index * 5) % 55)
}));

const columns = [
  { key: "id", label: "策略编号" },
  { key: "name", label: "策略名称" },
  { key: "cluster", label: "目标集群" },
  { key: "ratio", label: "分发比例" },
  { key: "status", label: "状态" }
];

const rows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `LB-${400 + index}`,
    name: `流量策略-${index + 1}`,
    cluster: index % 2 === 0 ? "集群-A" : "集群-B",
    ratio: index % 3 === 0 ? "50/30/20" : "60/40",
    status: index % 4 === 0 ? "切换中" : "稳定"
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
  cluster: "",
  ratio: "",
  notes: ""
});

const progress = ref(0);
let timer;

const openForm = () => {
  modal.open = true;
  modal.type = "form";
  modal.title = "新增转发策略";
};

const openProgress = () => {
  modal.open = true;
  modal.type = "progress";
  modal.title = "执行流量切换";
  progress.value = 0;
  timer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + 11);
    if (progress.value >= 100) {
      window.clearInterval(timer);
    }
  }, 240);
};

const openInfo = () => {
  modal.open = true;
  modal.type = "info";
  modal.title = "流量提醒";
  modal.message = "当前高峰流量已均衡分配至 3 个核心节点。";
};

const closeModal = () => {
  modal.open = false;
  if (timer) {
    window.clearInterval(timer);
  }
};

const submitForm = () => {
  rows.value.unshift({
    id: `LB-${Math.floor(500 + Math.random() * 200)}`,
    name: form.name,
    cluster: form.cluster,
    ratio: form.ratio,
    status: "稳定"
  });
  form.name = "";
  form.cluster = "";
  form.ratio = "";
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
