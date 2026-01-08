<template>
  <div class="module">
    <div class="module__header">
      <h2>销售报价与订单管理</h2>
      <div class="module__actions">
        <button class="btn btn--primary" @click="openModal('quote')">自动报价</button>
        <button class="btn btn--ghost" @click="openModal('order')">订单追踪</button>
        <button class="btn btn--ghost" @click="openModal('feedback')">反馈调整</button>
        <button class="btn btn--ghost" @click="openModal('tip')">按钮提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>报价概览</h3>
        <div class="stats">
          <div>
            <strong>¥ 18.6M</strong>
            <span>本月报价金额</span>
          </div>
          <div>
            <strong>72%</strong>
            <span>报价转化率</span>
          </div>
          <div>
            <strong>6</strong>
            <span>紧急订单数</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>订单状态分布</h3>
        <div class="status">
          <div v-for="item in statusData" :key="item.name" class="status__item">
            <strong>{{ item.value }}</strong>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>订单明细</h3>
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>报价金额</th>
            <th>交付日期</th>
            <th>状态</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.code }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.amount }}</td>
            <td>{{ order.delivery }}</td>
            <td><span class="tag" :class="order.statusClass">{{ order.status }}</span></td>
            <td>{{ order.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'quote'">
        <form class="form">
          <label>客户名称<input type="text" placeholder="华东机床" /></label>
          <label>产品规格<input type="text" placeholder="Φ120 × 5000" /></label>
          <label>采购数量<input type="number" placeholder="50" /></label>
          <label>附加服务
            <select>
              <option>超声波探伤</option>
              <option>表面喷涂</option>
              <option>冷拉矫直</option>
            </select>
          </label>
        </form>
      </template>
      <template v-else-if="modalType === 'order'">
        <p>订单执行进度已更新：</p>
        <div class="progress">
          <span :style="{ width: '84%' }"></span>
        </div>
        <p class="muted">预计 3 天内完成最后检验</p>
      </template>
      <template v-else-if="modalType === 'feedback'">
        <form class="form">
          <label>客户反馈<textarea rows="3" placeholder="调整交货批次与包装方式"></textarea></label>
          <label>调整内容<textarea rows="3" placeholder="增加2批分批交付"></textarea></label>
        </form>
      </template>
      <template v-else>
        <p>点击“自动报价”可快速生成客户专属报价单。</p>
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
const modalType = ref('quote');

const modalTitle = computed(() => {
  const titles = {
    quote: '自动报价生成',
    order: '订单状态追踪',
    feedback: '客户反馈调整',
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

const statusData = [
  { name: '已报价', value: 28 },
  { name: '执行中', value: 14 },
  { name: '待确认', value: 6 },
  { name: '已完成', value: 32 }
];

const orders = Array.from({ length: 20 }, (_, index) => {
  const statuses = [
    { label: '执行中', class: 'tag--mid' },
    { label: '已完成', class: 'tag--high' },
    { label: '待确认', class: 'tag--low' }
  ];
  const status = statuses[index % statuses.length];
  return {
    id: index + 1,
    code: `SO-${String(24001 + index)}`,
    customer: `客户${index + 1}`,
    amount: `¥ ${(85 + index * 2).toFixed(1)}万`,
    delivery: `2024-0${(index % 9) + 1}-2${index % 9}`,
    status: status.label,
    statusClass: status.class,
    owner: ['王琳', '刘强', '陈安', '周宁'][index % 4]
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

.status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.status__item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  background: #fee2e2;
  color: #b91c1c;
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
.form textarea,
.form select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
  font-family: inherit;
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
