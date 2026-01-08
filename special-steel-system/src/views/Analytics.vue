<template>
  <div class="page">
    <div class="header card">
      <div>
        <p class="section-title">数据分析与决策支持</p>
        <p class="sub">分析匹配效果与销售数据，辅助标准优化</p>
      </div>
      <div class="actions">
        <button class="action-btn" @click="openModal('report')">生成分析报告</button>
        <button class="action-btn secondary" @click="openModal('model')">优化模型</button>
        <button class="action-btn secondary" @click="openModal('share')">共享看板</button>
        <button class="action-btn secondary" @click="openModal('tip')">操作提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <p class="section-title">匹配效果趋势</p>
        <div class="line-chart">
          <div v-for="point in trend" :key="point.month" class="line-point" :style="{ left: point.x, bottom: point.y }">
            <span>{{ point.value }}%</span>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline :points="trendLine" fill="none" stroke="#2f6df6" stroke-width="2" />
          </svg>
        </div>
      </div>
      <div class="card">
        <p class="section-title">重点行业占比</p>
        <img :src="sectorImage" alt="行业占比" />
        <ul class="sector-list">
          <li v-for="sector in sectors" :key="sector.name">
            <span>{{ sector.name }}</span>
            <strong>{{ sector.value }}%</strong>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <p class="section-title">销售与标准优化建议（{{ insights.length }} 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>月份</th>
            <th>匹配成功率</th>
            <th>销售额(万元)</th>
            <th>主要标准</th>
            <th>建议动作</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in insights" :key="item.month">
            <td>{{ item.month }}</td>
            <td>{{ item.match }}%</td>
            <td>{{ item.sales }}</td>
            <td>{{ item.standard }}</td>
            <td>{{ item.action }}</td>
            <td>{{ item.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal v-model="modalVisible" :title="modalTitle" @confirm="modalVisible = false">
      <div v-if="modalType === 'report'" class="modal-block">
        <p>系统将输出包含趋势、行业与订单的综合报告。</p>
        <div class="progress-bar">
          <span :style="{ width: `${reportProgress}%` }"></span>
        </div>
        <p class="status">生成进度 {{ reportProgress }}%</p>
      </div>
      <div v-else-if="modalType === 'model'" class="form-grid">
        <label>
          优化目标
          <select class="input">
            <option>提升匹配成功率</option>
            <option>缩短交付周期</option>
            <option>提升利润率</option>
          </select>
        </label>
        <label>
          权重调整
          <input class="input" placeholder="标准权重: 0.45" />
        </label>
        <label>
          算法版本
          <input class="input" placeholder="Match-Engine 3.2" />
        </label>
        <label>
          预期效果
          <input class="input" placeholder="提升匹配率 4%" />
        </label>
      </div>
      <div v-else-if="modalType === 'share'" class="modal-block">
        <p>选择共享对象与有效期。</p>
        <label>
          共享对象
          <select class="input">
            <option>销售总监</option>
            <option>技术中心</option>
            <option>经营管理层</option>
          </select>
        </label>
        <label>
          有效期
          <select class="input">
            <option>7天</option>
            <option>30天</option>
            <option>90天</option>
          </select>
        </label>
      </div>
      <div v-else class="modal-block">
        <p>提示：报告将结合销售、匹配与标准版本迭代数据。</p>
        <ul>
          <li>可在模型优化中调整权重，提升重点行业命中率。</li>
          <li>共享看板支持按角色控制权限。</li>
        </ul>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import AppModal from '../components/AppModal.vue';

const trend = [
  { month: '1月', value: 78, x: '5%', y: '20%' },
  { month: '2月', value: 82, x: '20%', y: '35%' },
  { month: '3月', value: 80, x: '35%', y: '30%' },
  { month: '4月', value: 86, x: '50%', y: '55%' },
  { month: '5月', value: 88, x: '65%', y: '62%' },
  { month: '6月', value: 91, x: '80%', y: '75%' },
  { month: '7月', value: 93, x: '92%', y: '82%' }
];

const trendLine = computed(() =>
  trend
    .map((point, index) => {
      const x = 5 + index * 15;
      const y = 100 - point.value;
      return `${x},${y}`;
    })
    .join(' ')
);

const sectorImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" rx="20" fill="%23f4f7ff"/><circle cx="90" cy="90" r="60" fill="%232f6df6"/><path d="M90 90 L150 40 A70 70 0 0 1 210 120 Z" fill="%238fb1ff"/><path d="M90 90 L210 120 A70 70 0 0 1 60 150 Z" fill="%23c7d9ff"/><text x="200" y="70" font-size="12" fill="%233a4d7a">轴承钢</text><text x="200" y="90" font-size="12" fill="%233a4d7a">模具钢</text><text x="200" y="110" font-size="12" fill="%233a4d7a">能源装备</text></svg>';

const sectors = [
  { name: '轴承钢', value: 42 },
  { name: '模具钢', value: 28 },
  { name: '能源装备', value: 18 },
  { name: '航空材料', value: 12 }
];

const insights = ref(
  Array.from({ length: 20 }, (_, i) => ({
    month: `2024-${(i + 1).toString().padStart(2, '0')}`,
    match: 75 + (i % 10),
    sales: (680 + i * 12).toFixed(1),
    standard: ['STD-2024-03', 'STD-2024-07', 'STD-2024-11'][i % 3],
    action: ['优化洁净度', '缩短热处理', '提升交期预测'][i % 3],
    owner: ['数据分析', '标准室', '销售中心'][i % 3]
  }))
);

const modalVisible = ref(false);
const modalType = ref('report');
const modalTitle = ref('生成分析报告');
const reportProgress = ref(12);

const openModal = (type) => {
  modalType.value = type;
  modalTitle.value =
    type === 'report' ? '生成分析报告' : type === 'model' ? '优化模型' : type === 'share' ? '共享看板' : '操作提示';
  modalVisible.value = true;
};

watch(modalVisible, (visible) => {
  if (visible && modalType.value === 'report') {
    reportProgress.value = 10;
    const timer = setInterval(() => {
      reportProgress.value += 18;
      if (reportProgress.value >= 100) {
        reportProgress.value = 100;
        clearInterval(timer);
      }
    }, 200);
  }
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: #6b7a99;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.line-chart {
  position: relative;
  height: 200px;
  background: #f5f8ff;
  border-radius: 16px;
  overflow: hidden;
}

.line-chart svg {
  width: 100%;
  height: 100%;
}

.line-point {
  position: absolute;
  transform: translate(-50%, 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #2f6df6;
}

.line-point::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2f6df6;
  box-shadow: 0 0 0 4px rgba(47, 109, 246, 0.2);
}

.card img {
  width: 100%;
  border-radius: 16px;
  margin-bottom: 12px;
}

.sector-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sector-list li {
  display: flex;
  justify-content: space-between;
  color: #4d5b7c;
}

.modal-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status {
  color: #2f6df6;
}
</style>
