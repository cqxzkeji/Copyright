<template>
  <section class="dashboard">
    <div class="stats-grid">
      <div class="stat-card" v-for="card in statCards" :key="card.title">
        <p>{{ card.title }}</p>
        <h2>{{ card.value }}</h2>
        <span>{{ card.note }}</span>
      </div>
    </div>

    <div class="toolbar">
      <button class="primary" @click="openModal('refresh')">刷新指标</button>
      <button class="ghost" @click="openModal('progress')">查看进度</button>
      <button class="ghost" @click="openModal('alert')">新增预警</button>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <header>
          <h3>项目状态分布</h3>
          <button class="ghost" @click="openModal('chartInfo')">图表说明</button>
        </header>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="bar-row">
            <span>{{ item.label }}</span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="panel">
        <header>
          <h3>预算执行趋势</h3>
          <button class="ghost" @click="openModal('budget')">预算调整</button>
        </header>
        <svg viewBox="0 0 320 160" class="line-chart" aria-label="预算趋势图">
          <polyline
            fill="none"
            stroke="#2563eb"
            stroke-width="4"
            :points="linePoints"
          />
          <circle v-for="point in lineDots" :key="point.x" :cx="point.x" :cy="point.y" r="5" fill="#38bdf8" />
        </svg>
      </div>
    </div>

    <div class="table-panel">
      <header>
        <h3>重点项目概览</h3>
        <button class="ghost" @click="openModal('export')">导出清单</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>项目编号</th>
            <th>项目名称</th>
            <th>负责人</th>
            <th>进度</th>
            <th>预算</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in projectRows" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.progress }}%</td>
            <td>{{ item.budget }}</td>
            <td>
              <span class="status" :class="item.statusClass">{{ item.status }}</span>
            </td>
            <td>
              <button class="table-btn" @click="openRow(item)">查看详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="modalKey === 'refresh'" title="指标刷新" @close="closeModal">
      <p>已连接到实时数据源，确认刷新后将同步最新项目状态。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">确认刷新</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'progress'" title="整体进度" @close="closeModal">
      <p>当前全局项目交付完成度为 78%。</p>
      <div class="progress">
        <div class="progress-bar" style="width: 78%"></div>
      </div>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">已了解</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'alert'" title="新增预警" @close="closeModal">
      <form class="modal-form">
        <label>
          预警主题
          <input v-model="alertForm.title" type="text" placeholder="输入预警主题" />
        </label>
        <label>
          等级
          <select v-model="alertForm.level">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label>
          说明
          <textarea v-model="alertForm.detail" rows="3" placeholder="描述风险说明"></textarea>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">提交预警</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'chartInfo'" title="图表说明" @close="closeModal">
      <p>图表展示当前正在推进、待启动与已完成项目的比例分布。</p>
    </BaseModal>

    <BaseModal :open="modalKey === 'budget'" title="预算调整" @close="closeModal">
      <form class="modal-form">
        <label>
          调整方向
          <select v-model="budgetForm.direction">
            <option>增加</option>
            <option>减少</option>
          </select>
        </label>
        <label>
          调整金额（万元）
          <input v-model="budgetForm.amount" type="number" />
        </label>
        <label>
          调整原因
          <textarea v-model="budgetForm.reason" rows="3"></textarea>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">提交调整</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'export'" title="导出清单" @close="closeModal">
      <p>请选择导出格式并确认导出重点项目清单。</p>
      <div class="export-options">
        <button class="ghost" type="button" @click="closeModal">导出 PDF</button>
        <button class="ghost" type="button" @click="closeModal">导出 Excel</button>
      </div>
    </BaseModal>

    <BaseModal :open="modalKey === 'row'" title="项目详情" @close="closeModal">
      <div v-if="activeRow" class="modal-detail">
        <p>项目名称：{{ activeRow.name }}</p>
        <p>负责人：{{ activeRow.owner }}</p>
        <p>当前进度：{{ activeRow.progress }}%</p>
        <p>预算执行：{{ activeRow.budget }}</p>
        <p>状态：{{ activeRow.status }}</p>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modalKey = ref("");
const activeRow = ref(null);

const statCards = [
  { title: "进行中项目", value: "18", note: "较上周 +2" },
  { title: "预算执行率", value: "82%", note: "资金利用稳定" },
  { title: "高风险事项", value: "5", note: "需重点关注" },
  { title: "资源利用率", value: "74%", note: "人员负载良好" }
];

const chartData = [
  { label: "进行中", value: 56 },
  { label: "待启动", value: 24 },
  { label: "已完成", value: 20 }
];

const lineDots = [
  { x: 20, y: 120 },
  { x: 90, y: 80 },
  { x: 160, y: 60 },
  { x: 230, y: 70 },
  { x: 300, y: 40 }
];

const linePoints = computed(() => lineDots.map((point) => `${point.x},${point.y}`).join(" "));

const projectRows = Array.from({ length: 20 }, (_, index) => {
  const progress = 45 + (index % 6) * 7;
  return {
    id: `IT-${120 + index}`,
    name: `咨询项目 ${index + 1}`,
    owner: ["王立", "李娜", "赵峰", "孙琳"][index % 4],
    progress,
    budget: `${80 + index * 2} 万元`,
    status: progress > 75 ? "健康" : progress > 60 ? "关注" : "预警",
    statusClass: progress > 75 ? "ok" : progress > 60 ? "warn" : "risk"
  };
});

const alertForm = reactive({
  title: "",
  level: "中",
  detail: ""
});

const budgetForm = reactive({
  direction: "增加",
  amount: 10,
  reason: ""
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
.dashboard {
  display: grid;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 6px;
}

.stat-card h2 {
  font-size: 24px;
}

.stat-card span {
  color: #64748b;
  font-size: 13px;
}

.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 16px;
}

.panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chart {
  display: grid;
  gap: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 60px 1fr 50px;
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

.line-chart {
  width: 100%;
  height: 160px;
}

.table-panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  overflow-x: auto;
}

.table-panel header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-panel th,
.table-panel td {
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

.export-options {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.modal-detail {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}
</style>
