<template>
  <div class="module">
    <div class="module__header">
      <h2>数据分析与决策支持</h2>
      <div class="module__actions">
        <button class="btn btn--primary" @click="openModal('performance')">业绩分析</button>
        <button class="btn btn--ghost" @click="openModal('market')">市场趋势</button>
        <button class="btn btn--ghost" @click="openModal('satisfaction')">客户反馈</button>
        <button class="btn btn--ghost" @click="openModal('tip')">按钮提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>核心指标</h3>
        <div class="stats">
          <div>
            <strong>¥ 52.4M</strong>
            <span>季度销售额</span>
          </div>
          <div>
            <strong>94%</strong>
            <span>交付准时率</span>
          </div>
          <div>
            <strong>4.7</strong>
            <span>客户满意度</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>需求预测曲线</h3>
        <svg viewBox="0 0 320 120" class="line">
          <polyline
            fill="none"
            stroke="#3b82f6"
            stroke-width="3"
            :points="linePoints"
          />
          <circle v-for="(point, index) in lineArray" :key="index" :cx="point.x" :cy="point.y" r="4" fill="#60a5fa" />
        </svg>
      </div>
    </div>

    <div class="card">
      <h3>市场与客户分析</h3>
      <table>
        <thead>
          <tr>
            <th>区域</th>
            <th>客户数</th>
            <th>平均订单额</th>
            <th>增长率</th>
            <th>满意度</th>
            <th>机会评级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in market" :key="item.id">
            <td>{{ item.region }}</td>
            <td>{{ item.customers }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.growth }}</td>
            <td>{{ item.score }}</td>
            <td><span class="tag" :class="item.levelClass">{{ item.level }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'performance'">
        <p>销售业绩已达到季度目标的 87%。</p>
        <ul class="list">
          <li>高合金产品贡献 42%</li>
          <li>重点客户续签率 91%</li>
          <li>销售毛利率提升 2.4%</li>
        </ul>
      </template>
      <template v-else-if="modalType === 'market'">
        <p>市场趋势预测中，请稍候。</p>
        <div class="progress">
          <span :style="{ width: '63%' }"></span>
        </div>
        <p class="muted">正在同步行业需求指数</p>
      </template>
      <template v-else-if="modalType === 'satisfaction'">
        <form class="form">
          <label>客户评分<input type="number" placeholder="4.8" /></label>
          <label>反馈摘要<textarea rows="3" placeholder="交付及时，质量稳定"></textarea></label>
        </form>
      </template>
      <template v-else>
        <p>可通过表格筛选不同区域的市场机会。</p>
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
const modalType = ref('performance');

const modalTitle = computed(() => {
  const titles = {
    performance: '销售业绩分析',
    market: '市场趋势预测',
    satisfaction: '客户满意度反馈',
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

const lineArray = [
  { x: 20, y: 80 },
  { x: 60, y: 68 },
  { x: 100, y: 60 },
  { x: 140, y: 50 },
  { x: 180, y: 56 },
  { x: 220, y: 44 },
  { x: 260, y: 38 },
  { x: 300, y: 30 }
];

const linePoints = lineArray.map((point) => `${point.x},${point.y}`).join(' ');

const market = Array.from({ length: 20 }, (_, index) => {
  const levels = [
    { label: 'A', class: 'tag--high' },
    { label: 'B', class: 'tag--mid' },
    { label: 'C', class: 'tag--low' }
  ];
  const level = levels[index % levels.length];
  return {
    id: index + 1,
    region: ['华东', '华北', '华南', '西南'][index % 4],
    customers: 20 + index,
    amount: `¥ ${(120 + index * 3).toFixed(1)}万`,
    growth: `${8 + (index % 5)}%`,
    score: (4.2 + (index % 4) * 0.1).toFixed(1),
    level: level.label,
    levelClass: level.class
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

.line {
  width: 100%;
  height: 160px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
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
