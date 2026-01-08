<template>
  <div class="module">
    <div class="module__header">
      <h2>产品标准与定制</h2>
      <div class="module__actions">
        <button class="btn btn--primary" @click="openModal('design')">定制设计</button>
        <button class="btn btn--ghost" @click="openModal('standard')">标准管理</button>
        <button class="btn btn--ghost" @click="openModal('export')">方案导出</button>
        <button class="btn btn--ghost" @click="openModal('tip')">按钮提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>标准库概况</h3>
        <div class="stats">
          <div>
            <strong>64</strong>
            <span>国家/行业标准</span>
          </div>
          <div>
            <strong>28</strong>
            <span>客户定制模板</span>
          </div>
          <div>
            <strong>12</strong>
            <span>重点应用场景</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>标准匹配热度</h3>
        <div class="heat">
          <div v-for="(item, index) in heatMap" :key="item.name" class="heat__row">
            <span>{{ item.name }}</span>
            <div class="heat__bar">
              <span :style="{ width: item.value + '%' }" :class="['heat__fill', `heat__fill--${index % 4}`]" />
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>定制方案清单</h3>
      <table>
        <thead>
          <tr>
            <th>方案编号</th>
            <th>客户行业</th>
            <th>执行标准</th>
            <th>热处理</th>
            <th>力学指标</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in plans" :key="item.id">
            <td>{{ item.code }}</td>
            <td>{{ item.industry }}</td>
            <td>{{ item.standard }}</td>
            <td>{{ item.heat }}</td>
            <td>{{ item.metric }}</td>
            <td>
              <span class="tag" :class="item.statusClass">{{ item.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'design'">
        <form class="form">
          <label>客户行业<input type="text" placeholder="轨交" /></label>
          <label>目标标准<input type="text" placeholder="EN 10297" /></label>
          <label>规格范围<input type="text" placeholder="Φ40-120" /></label>
          <label>特殊要求<textarea rows="3" placeholder="耐疲劳、低温冲击"></textarea></label>
        </form>
      </template>
      <template v-else-if="modalType === 'standard'">
        <p>当前标准库已同步最新的国标与行业标准。</p>
        <ul class="list">
          <li>新增：GB/T 3077-2023 结构钢</li>
          <li>更新：ASTM A29 条款 5.2</li>
          <li>新增：风电主轴专用标准模板</li>
        </ul>
      </template>
      <template v-else-if="modalType === 'export'">
        <p>系统正在生成可视化定制方案。</p>
        <div class="progress">
          <span :style="{ width: '68%' }"></span>
        </div>
        <p class="muted">预计完成时间 30 秒</p>
      </template>
      <template v-else>
        <p>点击“定制设计”可生成可视化钢材产品规格。</p>
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
const modalType = ref('design');

const modalTitle = computed(() => {
  const titles = {
    design: '定制产品设计',
    standard: '钢材标准数据库',
    export: '方案导出进度',
    tip: '提示信息'
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

const heatMap = [
  { name: '汽车零部件', value: 82 },
  { name: '风电装备', value: 74 },
  { name: '轨道交通', value: 68 },
  { name: '工程机械', value: 64 },
  { name: '模具制造', value: 58 }
];

const plans = Array.from({ length: 20 }, (_, index) => {
  const statuses = [
    { label: '评审中', class: 'tag--mid' },
    { label: '已发布', class: 'tag--high' },
    { label: '待确认', class: 'tag--low' }
  ];
  const status = statuses[index % statuses.length];
  return {
    id: index + 1,
    code: `STD-${2024 + (index % 2)}-${String(index + 1).padStart(3, '0')}`,
    industry: ['风电', '汽车', '轨交', '工程机械'][index % 4],
    standard: ['GB/T 3077', 'ASTM A29', 'EN 10297'][index % 3],
    heat: ['调质', '正火', '退火'][index % 3],
    metric: `${850 + index * 3} MPa`,
    status: status.label,
    statusClass: status.class
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

.heat {
  display: grid;
  gap: 10px;
}

.heat__row {
  display: grid;
  grid-template-columns: 90px 1fr 50px;
  gap: 10px;
  align-items: center;
  font-size: 13px;
}

.heat__bar {
  background: #e5e7eb;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
}

.heat__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.heat__fill--0 {
  background: linear-gradient(90deg, #60a5fa, #2563eb);
}

.heat__fill--1 {
  background: linear-gradient(90deg, #34d399, #059669);
}

.heat__fill--2 {
  background: linear-gradient(90deg, #fbbf24, #f97316);
}

.heat__fill--3 {
  background: linear-gradient(90deg, #f472b6, #db2777);
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
  background: #dcfce7;
  color: #15803d;
}

.tag--mid {
  background: #fef3c7;
  color: #b45309;
}

.tag--low {
  background: #e0f2fe;
  color: #0369a1;
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

.form input,
.form textarea {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
  font-family: inherit;
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
