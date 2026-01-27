<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h3>方案优化与任务协同</h3>
        <p>支持 DOE、参数扫描与多目标优化，形成改进工单闭环。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('doe')">新建DOE</button>
        <button class="ghost" @click="openModal('optimize')">启动优化</button>
        <button class="ghost" @click="openModal('weights')">权重说明</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>优化权衡</h4>
        <div class="pareto">
          <div v-for="point in pareto" :key="point.label" class="pareto-item">
            <span>{{ point.label }}</span>
            <div class="pareto-bar">
              <div class="pareto-fill" :style="{ width: point.value + '%' }"></div>
            </div>
            <strong>{{ point.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>工单状态</h4>
        <div class="metrics">
          <div>
            <p>待执行</p>
            <strong>14</strong>
          </div>
          <div>
            <p>评审中</p>
            <strong>7</strong>
          </div>
          <div>
            <p>已完成</p>
            <strong>22</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-header">
        <h4>优化工单列表</h4>
        <button class="ghost" @click="openModal('assign')">分配责任人</button>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>工单编号</th>
              <th>优化目标</th>
              <th>关键参数</th>
              <th>截止时间</th>
              <th>责任人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.target }}</td>
              <td>{{ row.parameter }}</td>
              <td>{{ row.deadline }}</td>
              <td>{{ row.owner }}</td>
              <td><span class="tag">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AppModal :visible="modalVisible" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'doe'">
        <label>试验类型<select v-model="form.design">
          <option>正交试验</option>
          <option>响应面</option>
          <option>全因子</option>
        </select></label>
        <label>参数因子<input v-model="form.factors" type="text" placeholder="悬置刚度、阻尼" /></label>
        <label>目标指标<input v-model="form.objective" type="text" placeholder="噪声、振动、成本" /></label>
      </template>
      <template v-else-if="modalType === 'optimize'">
        <p>正在执行多目标优化计算，请稍候。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>优化进度 {{ progress }}%</small>
      </template>
      <template v-else-if="modalType === 'assign'">
        <label>工单编号<select v-model="form.ticket">
          <option v-for="row in tableRows" :key="row.id">{{ row.id }}</option>
        </select></label>
        <label>责任人<input v-model="form.owner" type="text" placeholder="输入负责人" /></label>
      </template>
      <template v-else>
        <p>系统默认噪声权重 40%、振动 35%、重量 15%、成本 10%。</p>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalVisible = ref(false);
const modalType = ref("doe");
const progress = ref(42);

const pareto = [
  { label: "噪声", value: 72 },
  { label: "振动", value: 64 },
  { label: "重量", value: 48 },
  { label: "成本", value: 36 }
];

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `OPT-${900 + index}`,
  target: ["降低风噪", "提升舒适性", "降低车内啸叫", "减小传动振动"][index % 4],
  parameter: ["悬置刚度", "隔音棉厚度", "轮胎花纹", "动力总成支架"][index % 4],
  deadline: `2024-1${index % 9}-0${(index % 6) + 1}`,
  owner: ["赵工", "李工", "吴工", "周工"][index % 4],
  status: ["待执行", "评审中", "已完成"][index % 3]
}));

const form = reactive({
  design: "正交试验",
  factors: "",
  objective: "",
  ticket: "",
  owner: ""
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  if (type === "optimize") {
    progress.value = 34;
    const timer = setInterval(() => {
      progress.value = Math.min(progress.value + 9, 100);
      if (progress.value === 100) {
        clearInterval(timer);
      }
    }, 260);
  }
};

const closeModal = () => {
  modalVisible.value = false;
};

const modalTitle = computed(() => {
  const titles = {
    doe: "新建DOE方案",
    optimize: "优化进度",
    assign: "分配责任人",
    weights: "权重说明"
  };
  return titles[modalType.value] || "提示";
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.module-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  border: 1px solid #d6deea;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.pareto {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.pareto-item {
  display: grid;
  grid-template-columns: 60px 1fr 40px;
  gap: 12px;
  align-items: center;
}

.pareto-bar {
  background: #edf2f8;
  border-radius: 999px;
  height: 8px;
  overflow: hidden;
}

.pareto-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
}

.metrics {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.metrics strong {
  font-size: 20px;
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-scroll {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2f7;
}

.tag {
  background: #ede9fe;
  color: #5b21b6;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

input,
select {
  padding: 8px 10px;
  border: 1px solid #d6deea;
  border-radius: 8px;
}

.progress {
  background: #edf2f8;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #22c55e);
}
</style>
