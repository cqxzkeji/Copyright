<template>
  <div class="module">
    <div class="module__header">
      <h2>库存与生产调度管理</h2>
      <div class="module__actions">
        <button class="btn btn--primary" @click="openModal('inventory')">库存预警</button>
        <button class="btn btn--ghost" @click="openModal('schedule')">生产调度</button>
        <button class="btn btn--ghost" @click="openModal('progress')">进度追踪</button>
        <button class="btn btn--ghost" @click="openModal('tip')">按钮提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>库存状态</h3>
        <div class="stats">
          <div>
            <strong>6,420 吨</strong>
            <span>当前库存</span>
          </div>
          <div>
            <strong>18</strong>
            <span>待入库批次</span>
          </div>
          <div>
            <strong>4</strong>
            <span>预警项目</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>生产资源分布</h3>
        <div class="resource">
          <div v-for="item in resources" :key="item.name" class="resource__item">
            <span>{{ item.name }}</span>
            <div class="resource__bar">
              <span :style="{ width: item.value + '%' }"></span>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>库存与生产计划</h3>
      <table>
        <thead>
          <tr>
            <th>物料</th>
            <th>规格</th>
            <th>库存(吨)</th>
            <th>安全库存</th>
            <th>生产计划</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventory" :key="item.id">
            <td>{{ item.material }}</td>
            <td>{{ item.spec }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.safe }}</td>
            <td>{{ item.plan }}</td>
            <td><span class="tag" :class="item.statusClass">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'inventory'">
        <p>以下物料库存低于安全阈值：</p>
        <ul class="list">
          <li>40Cr Φ80 - 库存 120 吨</li>
          <li>20CrMnTi Φ90 - 库存 95 吨</li>
          <li>42CrMo Φ110 - 库存 110 吨</li>
        </ul>
      </template>
      <template v-else-if="modalType === 'schedule'">
        <form class="form">
          <label>生产线<input type="text" placeholder="热轧一线" /></label>
          <label>排产批次<input type="text" placeholder="2024-07-18" /></label>
          <label>重点订单<input type="text" placeholder="风电主轴订单" /></label>
        </form>
      </template>
      <template v-else-if="modalType === 'progress'">
        <p>当前主线生产进度：</p>
        <div class="progress">
          <span :style="{ width: '76%' }"></span>
        </div>
        <p class="muted">热处理已完成，正在进行精加工</p>
      </template>
      <template v-else>
        <p>通过库存预警可快速触发补货或生产调整。</p>
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
const modalType = ref('inventory');

const modalTitle = computed(() => {
  const titles = {
    inventory: '库存预警清单',
    schedule: '生产调度表单',
    progress: '生产进度追踪',
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

const resources = [
  { name: '热轧线', value: 82 },
  { name: '锻造线', value: 68 },
  { name: '热处理', value: 74 },
  { name: '精加工', value: 60 }
];

const inventory = Array.from({ length: 20 }, (_, index) => {
  const statuses = [
    { label: '正常', class: 'tag--high' },
    { label: '预警', class: 'tag--mid' },
    { label: '紧缺', class: 'tag--low' }
  ];
  const status = statuses[index % statuses.length];
  return {
    id: index + 1,
    material: ['40Cr', '42CrMo', '20CrMnTi', '18CrNiMo7-6'][index % 4],
    spec: `Φ${70 + index} × 6000`,
    stock: 80 + index * 4,
    safe: 120,
    plan: `${20 + index} 吨`,
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

.resource {
  display: grid;
  gap: 10px;
}

.resource__item {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  gap: 10px;
  align-items: center;
  font-size: 13px;
}

.resource__bar {
  background: #e5e7eb;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
}

.resource__bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #6366f1);
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
  background: #fee2e2;
  color: #b91c1c;
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
