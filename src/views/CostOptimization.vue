<template>
  <div class="page">
    <div class="section">
      <div class="section-header">
        <div>
          <h3>成本优化与分析</h3>
          <p>监控费用消耗并推荐最优资源分配方案</p>
        </div>
        <div class="actions">
          <button @click="openForm">生成优化方案</button>
          <button class="outline" @click="openProgress">同步费用报表</button>
          <button class="ghost" @click="openInfo">成本提示</button>
        </div>
      </div>
      <BarChart :data="chartData" />
    </div>

    <DataTable :columns="columns" :rows="rows" />

    <BaseModal :open="modal.open" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'form'">
        <form class="modal-form" @submit.prevent="submitForm">
          <label>
            优化方案名称
            <input v-model="form.name" required placeholder="例如：存储降本计划" />
          </label>
          <label>
            目标费用区间
            <input v-model="form.target" required placeholder="例如：减少 15%" />
          </label>
          <label>
            负责人
            <input v-model="form.owner" required placeholder="填写负责人" />
          </label>
          <label>
            备注说明
            <textarea v-model="form.notes" rows="3" placeholder="填写优化说明"></textarea>
          </label>
          <div class="footer-actions">
            <button type="button" class="outline" @click="closeModal">取消</button>
            <button type="submit">提交方案</button>
          </div>
        </form>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <p>费用报表生成中，正在同步账单数据。</p>
        <ProgressBar :value="progress" />
      </template>
      <template v-else>
        <p>{{ modal.message }}</p>
        <div class="footer-actions">
          <button type="button" class="outline" @click="closeModal">收到</button>
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
  label: `C${index + 1}`,
  value: 38 + ((index * 7) % 58)
}));

const columns = [
  { key: "id", label: "账单编号" },
  { key: "service", label: "费用项" },
  { key: "month", label: "月份" },
  { key: "cost", label: "费用" },
  { key: "status", label: "优化状态" }
];

const rows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `CO-${500 + index}`,
    service: index % 2 === 0 ? "计算资源" : "存储资源",
    month: `2024-${String((index % 12) + 1).padStart(2, "0")}`,
    cost: `¥${(12 + index) * 1200}`,
    status: index % 3 === 0 ? "待优化" : "已评估"
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
  target: "",
  owner: "",
  notes: ""
});

const progress = ref(0);
let timer;

const openForm = () => {
  modal.open = true;
  modal.type = "form";
  modal.title = "生成成本优化方案";
};

const openProgress = () => {
  modal.open = true;
  modal.type = "progress";
  modal.title = "同步费用报表";
  progress.value = 0;
  timer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + 13);
    if (progress.value >= 100) {
      window.clearInterval(timer);
    }
  }, 260);
};

const openInfo = () => {
  modal.open = true;
  modal.type = "info";
  modal.title = "成本提示";
  modal.message = "建议调整夜间低负载资源规格，预计节省 12% 成本。";
};

const closeModal = () => {
  modal.open = false;
  if (timer) {
    window.clearInterval(timer);
  }
};

const submitForm = () => {
  rows.value.unshift({
    id: `CO-${Math.floor(600 + Math.random() * 200)}`,
    service: form.name,
    month: "2024-12",
    cost: "待评估",
    status: "待优化"
  });
  form.name = "";
  form.target = "";
  form.owner = "";
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
