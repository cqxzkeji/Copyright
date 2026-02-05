<template>
  <div class="page">
    <div class="section">
      <div class="section-header">
        <div>
          <h3>自动化资源调度中心</h3>
          <p>根据实时负载动态分配虚拟机与容器资源</p>
        </div>
        <div class="actions">
          <button @click="openForm">新增调度任务</button>
          <button class="outline" @click="openProgress">执行调度</button>
          <button class="ghost" @click="openInfo">调度策略提示</button>
        </div>
      </div>
      <BarChart :data="chartData" />
    </div>

    <DataTable :columns="columns" :rows="rows" />

    <BaseModal :open="modal.open" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'form'">
        <form class="modal-form" @submit.prevent="submitForm">
          <label>
            调度任务名称
            <input v-model="form.name" required placeholder="例如：华东集群弹性调度" />
          </label>
          <label>
            目标资源池
            <input v-model="form.pool" required placeholder="资源池/集群名称" />
          </label>
          <label>
            优先级
            <select v-model="form.priority">
              <option>高</option>
              <option>中</option>
              <option>低</option>
            </select>
          </label>
          <label>
            备注说明
            <textarea v-model="form.notes" rows="3" placeholder="填写调度策略说明"></textarea>
          </label>
          <div class="footer-actions">
            <button type="button" class="outline" @click="closeModal">取消</button>
            <button type="submit">确认创建</button>
          </div>
        </form>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <p>调度引擎正在分配计算资源，请保持等待。</p>
        <ProgressBar :value="progress" />
      </template>
      <template v-else>
        <p>{{ modal.message }}</p>
        <div class="footer-actions">
          <button type="button" class="outline" @click="closeModal">知道了</button>
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
  label: `P${index + 1}`,
  value: 30 + ((index * 9) % 60)
}));

const columns = [
  { key: "id", label: "任务编号" },
  { key: "name", label: "任务名称" },
  { key: "pool", label: "资源池" },
  { key: "priority", label: "优先级" },
  { key: "status", label: "状态" }
];

const rows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `RS-${100 + index}`,
    name: `自动调度-${index + 1}`,
    pool: index % 2 === 0 ? "容器池-A" : "虚拟机池-B",
    priority: index % 3 === 0 ? "高" : "中",
    status: index % 4 === 0 ? "执行中" : "待执行"
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
  pool: "",
  priority: "中",
  notes: ""
});

const progress = ref(0);
let timer;

const openForm = () => {
  modal.open = true;
  modal.type = "form";
  modal.title = "新增调度任务";
};

const openProgress = () => {
  modal.open = true;
  modal.type = "progress";
  modal.title = "执行资源调度";
  progress.value = 0;
  timer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + 15);
    if (progress.value >= 100) {
      window.clearInterval(timer);
    }
  }, 260);
};

const openInfo = () => {
  modal.open = true;
  modal.type = "info";
  modal.title = "调度策略提示";
  modal.message = "建议优先保障高频业务容器池的最低可用资源。";
};

const closeModal = () => {
  modal.open = false;
  if (timer) {
    window.clearInterval(timer);
  }
};

const submitForm = () => {
  rows.value.unshift({
    id: `RS-${Math.floor(200 + Math.random() * 200)}`,
    name: form.name,
    pool: form.pool,
    priority: form.priority,
    status: "待执行"
  });
  form.name = "";
  form.pool = "";
  form.priority = "中";
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
.modal-form textarea,
.modal-form select {
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
