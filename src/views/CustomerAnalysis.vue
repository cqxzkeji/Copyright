<template>
  <div class="module">
    <div class="module__header">
      <h2>客户需求分析</h2>
      <div class="module__actions">
        <button class="btn btn--primary" @click="openModal('add')">新增需求</button>
        <button class="btn btn--ghost" @click="openModal('forecast')">趋势预测</button>
        <button class="btn btn--ghost" @click="openModal('report')">生成报告</button>
        <button class="btn btn--ghost" @click="openModal('tip')">操作提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>需求概览</h3>
        <div class="stats">
          <div>
            <strong>128</strong>
            <span>本月需求数</span>
          </div>
          <div>
            <strong>32%</strong>
            <span>高合金占比</span>
          </div>
          <div>
            <strong>18</strong>
            <span>重点客户数</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>需求趋势图</h3>
        <div class="chart">
          <div v-for="item in trend" :key="item.month" class="bar">
            <span :style="{ height: item.value + '%' }"></span>
            <label>{{ item.month }}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>客户需求清单</h3>
      <table>
        <thead>
          <tr>
            <th>客户</th>
            <th>材质</th>
            <th>规格</th>
            <th>交货周期</th>
            <th>需求量(吨)</th>
            <th>优先级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in needs" :key="item.id">
            <td>{{ item.customer }}</td>
            <td>{{ item.material }}</td>
            <td>{{ item.spec }}</td>
            <td>{{ item.delivery }}</td>
            <td>{{ item.amount }}</td>
            <td>
              <span class="tag" :class="item.priorityClass">{{ item.priority }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'add'">
        <form class="form">
          <label>客户名称<input type="text" placeholder="安徽制造集团" /></label>
          <label>材质等级<input type="text" placeholder="SAE 4140" /></label>
          <label>规格<input type="text" placeholder="Φ85 × 6000" /></label>
          <label>交货时间<input type="date" /></label>
        </form>
      </template>
      <template v-else-if="modalType === 'forecast'">
        <p>系统已基于过去12个月的客户需求波动生成预测结果。</p>
        <ul class="list">
          <li>高合金订单预计提升 12%</li>
          <li>风电客户需求保持稳定增长</li>
          <li>交付窗口需要提前 5 天锁定产能</li>
        </ul>
      </template>
      <template v-else-if="modalType === 'report'">
        <p>报告生成中，请稍候查看进度。</p>
        <div class="progress">
          <span :style="{ width: '72%' }"></span>
        </div>
        <p class="muted">预计剩余时间 25 秒</p>
      </template>
      <template v-else>
        <p>点击表格中的客户需求可查看更完整的历史采购信息。</p>
      </template>
      <template #actions>
        <button class="btn btn--primary" @click="closeModal">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modalOpen = ref(false);
const modalType = ref('add');

const modalTitle = computed(() => {
  const titles = {
    add: '客户需求录入',
    forecast: '需求预测结果',
    report: '多维度报告生成',
    tip: '操作提示'
  };
  return titles[modalType.value] || '提示';
});

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const trend = [
  { month: '1月', value: 45 },
  { month: '2月', value: 52 },
  { month: '3月', value: 60 },
  { month: '4月', value: 50 },
  { month: '5月', value: 70 },
  { month: '6月', value: 78 },
  { month: '7月', value: 64 },
  { month: '8月', value: 80 },
  { month: '9月', value: 74 },
  { month: '10月', value: 88 },
  { month: '11月', value: 82 },
  { month: '12月', value: 90 }
];

const needs = Array.from({ length: 20 }, (_, index) => {
  const priorities = [
    { label: '高', class: 'tag--high' },
    { label: '中', class: 'tag--mid' },
    { label: '低', class: 'tag--low' }
  ];
  const priority = priorities[index % priorities.length];
  return {
    id: index + 1,
    customer: `客户${index + 1}`,
    material: ['40Cr', '20CrMnTi', 'SAE 4340'][index % 3],
    spec: `${60 + index} × 6000`,
    delivery: `${3 + (index % 4)}周`,
    amount: 40 + index * 2,
    priority: priority.label,
    priorityClass: priority.class
  };
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.module__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
}

.btn--primary {
  background: var(--primary);
  color: #fff;
}

.btn--ghost {
  background: #eef2ff;
  color: var(--primary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.stats div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stats strong {
  font-size: 20px;
}

.chart {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 8px;
  align-items: end;
  min-height: 160px;
}

.bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.bar span {
  width: 100%;
  background: linear-gradient(180deg, #93c5fd, #3b82f6);
  border-radius: 8px 8px 4px 4px;
  min-height: 20px;
}

.bar label {
  font-size: 11px;
  color: var(--muted);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  text-align: left;
  padding: 10px 6px;
  border-bottom: 1px solid var(--border);
}

th {
  color: var(--muted);
  font-weight: 600;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.tag--high {
  background: #fee2e2;
  color: #b91c1c;
}

.tag--mid {
  background: #fef3c7;
  color: #b45309;
}

.tag--low {
  background: #dcfce7;
  color: #15803d;
}

.form {
  display: grid;
  gap: 12px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.form input {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
}

.list {
  padding-left: 18px;
  display: grid;
  gap: 6px;
}

.progress {
  background: #e5e7eb;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #6366f1);
}

.muted {
  color: var(--muted);
  font-size: 12px;
  margin-top: 8px;
}
</style>
