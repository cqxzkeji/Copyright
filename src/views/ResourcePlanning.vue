<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openModal('plan')">新建资源计划</button>
      <button class="ghost" @click="openModal('allocate')">资源调度</button>
      <button class="ghost" @click="openModal('capacity')">容量评估</button>
      <button class="ghost" @click="openModal('guide')">使用指引</button>
    </div>

    <div class="grid">
      <div class="panel">
        <header>
          <h3>资源池概览</h3>
          <button class="ghost" @click="openModal('pool')">池说明</button>
        </header>
        <div class="resource-cards">
          <div class="resource-card" v-for="item in poolCards" :key="item.name">
            <h4>{{ item.name }}</h4>
            <p>{{ item.count }} 人</p>
            <span>{{ item.note }}</span>
          </div>
        </div>
      </div>
      <div class="panel">
        <header>
          <h3>本月资源利用率</h3>
          <button class="ghost" @click="openModal('util')">详细分析</button>
        </header>
        <div class="util-bars">
          <div v-for="item in utilization" :key="item.label" class="util-row">
            <span>{{ item.label }}</span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <header>
        <h3>资源调度明细</h3>
        <button class="ghost" @click="openModal('export')">导出资源表</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>资源编号</th>
            <th>人员</th>
            <th>角色</th>
            <th>项目</th>
            <th>工时占比</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in resourceRows" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.project }}</td>
            <td>{{ item.workload }}%</td>
            <td>
              <span class="status" :class="item.statusClass">{{ item.status }}</span>
            </td>
            <td>
              <button class="table-btn" @click="openRow(item)">查看排期</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="modalKey === 'plan'" title="新建资源计划" @close="closeModal">
      <form class="modal-form">
        <label>
          计划周期
          <select v-model="planForm.period">
            <option>2024 Q3</option>
            <option>2024 Q4</option>
            <option>2025 Q1</option>
          </select>
        </label>
        <label>
          重点岗位
          <input v-model="planForm.role" type="text" placeholder="输入岗位" />
        </label>
        <label>
          目标说明
          <textarea v-model="planForm.goal" rows="3" placeholder="描述资源目标"></textarea>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">提交计划</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'allocate'" title="资源调度" @close="closeModal">
      <form class="modal-form">
        <label>
          资源人员
          <input v-model="allocateForm.name" type="text" placeholder="输入人员" />
        </label>
        <label>
          调度项目
          <input v-model="allocateForm.project" type="text" placeholder="输入项目" />
        </label>
        <label>
          工时占比
          <input v-model="allocateForm.workload" type="number" min="0" max="100" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">确认调度</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'capacity'" title="容量评估" @close="closeModal">
      <p>当前可用资源容量 68%，预计下月紧张度提升。</p>
      <div class="progress">
        <div class="progress-bar" style="width: 68%"></div>
      </div>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">查看建议</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'guide'" title="资源使用指引" @close="closeModal">
      <ul class="tip-list">
        <li>优先保障关键交付项目。</li>
        <li>跨项目资源需提前一周申请。</li>
        <li>保证每月资源评估更新。</li>
      </ul>
    </BaseModal>

    <BaseModal :open="modalKey === 'pool'" title="资源池说明" @close="closeModal">
      <p>资源池按照岗位与技能等级划分，支持快速调度。</p>
    </BaseModal>

    <BaseModal :open="modalKey === 'util'" title="利用率分析" @close="closeModal">
      <p>高负载岗位集中在架构师与安全专家，请关注补充。</p>
    </BaseModal>

    <BaseModal :open="modalKey === 'export'" title="导出资源表" @close="closeModal">
      <p>请选择需要导出的资源范围。</p>
      <div class="export-options">
        <button class="ghost" type="button" @click="closeModal">导出全部</button>
        <button class="ghost" type="button" @click="closeModal">导出本月</button>
      </div>
    </BaseModal>

    <BaseModal :open="modalKey === 'row'" title="排期详情" @close="closeModal">
      <div v-if="activeRow" class="detail">
        <p>人员：{{ activeRow.name }}</p>
        <p>当前项目：{{ activeRow.project }}</p>
        <p>工时占比：{{ activeRow.workload }}%</p>
        <p>状态：{{ activeRow.status }}</p>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modalKey = ref("");
const activeRow = ref(null);

const poolCards = [
  { name: "架构师", count: 12, note: "支持大规模设计" },
  { name: "项目经理", count: 9, note: "全周期管控" },
  { name: "数据分析", count: 14, note: "指标分析" },
  { name: "安全专家", count: 6, note: "合规保障" }
];

const utilization = [
  { label: "咨询团队", value: 76 },
  { label: "交付团队", value: 68 },
  { label: "数据团队", value: 82 },
  { label: "安全团队", value: 64 }
];

const resourceRows = Array.from({ length: 20 }, (_, index) => {
  const workload = 55 + (index % 6) * 6;
  return {
    id: `R-${300 + index}`,
    name: ["张晓", "高远", "李珊", "周明"][index % 4],
    role: ["架构师", "顾问", "数据分析", "安全专家"][index % 4],
    project: `项目 ${index + 1}`,
    workload,
    status: workload > 75 ? "高负载" : workload > 60 ? "可用" : "充裕",
    statusClass: workload > 75 ? "risk" : workload > 60 ? "warn" : "ok"
  };
});

const planForm = reactive({
  period: "2024 Q3",
  role: "",
  goal: ""
});

const allocateForm = reactive({
  name: "",
  project: "",
  workload: 60
});

const openModal = (key) => {
  modalKey.value = key;
};

const closeModal = () => {
  modalKey.value = "";
  activeRow.value = null;
};

const openRow = (row) => {
  activeRow.value = row;
  modalKey.value = "row";
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  padding: 10px 18px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
}

.ghost {
  padding: 10px 18px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #334155;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  overflow-x: auto;
  display: grid;
  gap: 16px;
}

.panel header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.resource-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.resource-card {
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
  display: grid;
  gap: 6px;
}

.resource-card span {
  font-size: 12px;
  color: #64748b;
}

.util-bars {
  display: grid;
  gap: 12px;
}

.util-row {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  align-items: center;
  gap: 12px;
}

.bar {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}

.panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.panel th,
.panel td {
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.ok {
  background: #dcfce7;
  color: #16a34a;
}

.status.warn {
  background: #fef9c3;
  color: #ca8a04;
}

.status.risk {
  background: #fee2e2;
  color: #dc2626;
}

.table-btn {
  padding: 6px 10px;
  border-radius: 8px;
  background: #e0ecff;
  color: #1d4ed8;
}

.modal-form {
  display: grid;
  gap: 14px;
}

.modal-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
  margin: 12px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}

.tip-list {
  display: grid;
  gap: 10px;
  color: #475569;
  font-size: 14px;
  padding-left: 16px;
}

.export-options {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.detail {
  display: grid;
  gap: 8px;
  color: #334155;
  font-size: 14px;
}
</style>
