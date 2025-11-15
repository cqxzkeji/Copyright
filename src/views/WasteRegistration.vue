<template>
  <div class="module-shell">
    <header class="module-header">
      <div>
        <p class="eyebrow">废物登记</p>
        <h3>共 {{ wastes.length }} 条记录 · 最新 {{ wastes[0]?.code }}</h3>
      </div>
      <div class="actions">
        <button @click="openForm">新增废物</button>
        <button class="ghost" @click="guidelineOpen = true">分类指南</button>
      </div>
    </header>
    <section class="category-chart">
      <article v-for="item in categoryStats" :key="item.name" class="category-card">
        <header>
          <p>{{ item.name }}</p>
          <strong>{{ item.weight }} 吨</strong>
        </header>
        <div class="bar">
          <div :style="{ width: item.percent + '%' }"></div>
        </div>
        <span>{{ item.percent }}%</span>
      </article>
    </section>
    <section class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>类别</th>
            <th>危废特性</th>
            <th>重量(吨)</th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in wastes" :key="record.id">
            <td>{{ record.code }}</td>
            <td>{{ record.category }}</td>
            <td>{{ record.type }}</td>
            <td>{{ record.weight }}</td>
            <td>
              <span class="status" :class="record.status">{{ record.status }}</span>
            </td>
            <td>
              <button class="ghost" @click="showDetail(record)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <ModalDialog
      v-if="formOpen"
      title="新增危废登记"
      primary-text="确认登记"
      @close="formOpen = false"
      @confirm="submitForm"
    >
      <form class="modal-form" @submit.prevent>
        <label>
          登记编号
          <input v-model="form.code" placeholder="HW-2025-001" required />
        </label>
        <label>
          危废特性
          <input v-model="form.type" placeholder="易燃/腐蚀等" required />
        </label>
        <label>
          分类
          <select v-model="form.category" required>
            <option disabled value="">请选择</option>
            <option value="HW08">HW08 废矿物油与含油废物</option>
            <option value="HW17">HW17 表面处理废物</option>
            <option value="HW48">HW48 有机溶剂废物</option>
          </select>
        </label>
        <label>
          重量 (吨)
          <input v-model.number="form.weight" type="number" step="0.1" min="0.1" required />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-if="guidelineOpen" title="分类指南" primary-text="关闭" @close="guidelineOpen = false" @confirm="guidelineOpen = false">
      <ul class="guideline">
        <li>依据《国家危险废物名录》确定 HW 编码，确保录入信息准确。</li>
        <li>每条记录需包含来源工序、特性、重量与暂存要求。</li>
        <li>分类完成后自动推送至运输模块，实现流程闭环。</li>
      </ul>
    </ModalDialog>

    <ModalDialog
      v-if="detailRecord"
      :title="detailRecord.code + ' - 详情'"
      primary-text="完成复核"
      @close="detailRecord = null"
      @confirm="acknowledge"
    >
      <p>特性：{{ detailRecord.type }}</p>
      <p>分类：{{ detailRecord.category }}</p>
      <p>重量：{{ detailRecord.weight }} 吨</p>
      <p>状态：{{ detailRecord.status }}</p>
      <p>来源工序：酸洗+脱脂线</p>
      <p>暂存要求：防爆库，24 小时内转运。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const wastes = ref([
  { id: 1, code: 'HW-2025-021', category: 'HW17', type: '酸性蚀刻液', weight: 3.4, status: '在库' },
  { id: 2, code: 'HW-2025-019', category: 'HW48', type: '含苯废液', weight: 1.2, status: '待转运' },
  { id: 3, code: 'HW-2025-015', category: 'HW08', type: '含油抹布', weight: 0.8, status: '已转运' }
]);

const formOpen = ref(false);
const guidelineOpen = ref(false);
const detailRecord = ref(null);
const form = reactive({ code: '', type: '', category: '', weight: 0 });

const openForm = () => {
  form.code = `HW-2025-${Math.floor(Math.random() * 90 + 10)}`;
  form.type = '';
  form.category = '';
  form.weight = 0;
  formOpen.value = true;
};

const submitForm = () => {
  wastes.value.unshift({
    id: Date.now(),
    code: form.code,
    category: form.category,
    type: form.type,
    weight: form.weight,
    status: '待转运'
  });
  formOpen.value = false;
};

const showDetail = (record) => {
  detailRecord.value = record;
};

const acknowledge = () => {
  detailRecord.value = null;
};

const categoryStats = computed(() => {
  const groups = wastes.value.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.weight);
    return acc;
  }, {});
  const total = Object.values(groups).reduce((acc, curr) => acc + curr, 0) || 1;
  return Object.entries(groups).map(([name, weight]) => ({
    name,
    weight: weight.toFixed(1),
    percent: Math.round((weight / total) * 100)
  }));
});
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

button {
  background: linear-gradient(120deg, #f97316, #ec4899);
  color: #fff;
  border-radius: 16px;
  padding: 0.7rem 1.6rem;
}

button.ghost {
  background: rgba(15, 23, 42, 0.05);
  color: #0f172a;
}

.category-chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.category-card {
  background: #f1f5f9;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-card header {
  display: flex;
  justify-content: space-between;
}

.bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
}

.bar div {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #2563eb, #9333ea);
}

.table-wrapper {
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.status.在库 {
  background: #dbeafe;
  color: #1d4ed8;
}

.status.待转运 {
  background: #fee2e2;
  color: #dc2626;
}

.status.已转运 {
  background: #dcfce7;
  color: #15803d;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.modal-form input,
.modal-form select {
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.7rem 1rem;
}

.guideline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #475569;
}
</style>
