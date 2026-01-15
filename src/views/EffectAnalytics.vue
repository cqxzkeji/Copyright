<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h3>投放效果监测与数据分析</h3>
        <p>曝光、点击、转化与 ROI 数据可视化。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('export')">导出数据报表</button>
        <button class="outline" @click="openModal('abtest')">A/B 测试设置</button>
        <button class="outline" @click="openModal('roi')">ROI 分析</button>
        <button class="ghost" @click="openModal('compare')">对比分析</button>
        <button class="ghost" @click="openModal('alert')">监测预警</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h4>效果趋势</h4>
        <div class="line-chart">
          <div v-for="item in trend" :key="item.label" class="line-point">
            <span>{{ item.label }}</span>
            <div class="line-bar" :style="{ width: item.value + '%' }"></div>
            <em>{{ item.value }}%</em>
          </div>
        </div>
      </div>

      <div class="card">
        <h4>投放数据明细</h4>
        <table>
          <thead>
            <tr>
              <th>素材</th>
              <th>曝光</th>
              <th>点击</th>
              <th>转化</th>
              <th>ROI</th>
              <th>成本</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.impressions }}</td>
              <td>{{ row.clicks }}</td>
              <td>{{ row.conversions }}</td>
              <td>{{ row.roi }}</td>
              <td>{{ row.cost }}</td>
              <td>
                <button class="link" @click="openModal('detail', row)">详情</button>
                <button class="link" @click="openModal('optimize', row)">优化</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'export'">
        <label>
          报表格式
          <select v-model="form.format">
            <option>Excel</option>
            <option>PDF</option>
            <option>CSV</option>
          </select>
        </label>
        <label>
          时间范围
          <input v-model="form.range" placeholder="如：2024/05/01 - 2024/05/31" />
        </label>
      </template>

      <template v-else-if="activeModal === 'abtest'">
        <label>
          测试方案
          <input v-model="form.case" placeholder="如：两版文案对比" />
        </label>
        <label>
          流量分配
          <input v-model="form.split" placeholder="如：50% / 50%" />
        </label>
      </template>

      <template v-else-if="activeModal === 'roi'">
        <p>ROI 计算进度</p>
        <div class="progress">
          <div class="progress-bar" style="width: 82%"></div>
        </div>
        <p>已完成成本汇总与收入预估。</p>
      </template>

      <template v-else-if="activeModal === 'compare'">
        <p>请选择对比维度</p>
        <div class="compare-tags">
          <span>渠道</span>
          <span>地区</span>
          <span>人群</span>
          <span>素材版本</span>
        </div>
      </template>

      <template v-else-if="activeModal === 'alert'">
        <p>监测预警规则</p>
        <label>
          触发条件
          <input v-model="form.alert" placeholder="如：点击率低于 1%" />
        </label>
      </template>

      <template v-else-if="activeModal === 'detail'">
        <p><strong>{{ selectedRow.name }}</strong> 数据详情</p>
        <p>曝光：{{ selectedRow.impressions }} · 点击：{{ selectedRow.clicks }}</p>
        <p>转化：{{ selectedRow.conversions }} · ROI：{{ selectedRow.roi }}</p>
      </template>

      <template v-else-if="activeModal === 'optimize'">
        <p>填写优化建议：{{ selectedRow.name }}</p>
        <label>
          优化方向
          <textarea v-model="form.suggestion" rows="3" placeholder="填写优化策略"></textarea>
        </label>
      </template>

      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');
const selectedRow = ref({});
const form = ref({
  format: 'Excel',
  range: '',
  case: '',
  split: '50% / 50%',
  alert: '',
  suggestion: ''
});

const trend = [
  { label: '曝光', value: 76 },
  { label: '点击', value: 62 },
  { label: '转化', value: 48 },
  { label: '留存', value: 55 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `素材版本 ${index + 1}`,
  impressions: `${(index + 2) * 1200}`,
  clicks: `${(index + 2) * 110}`,
  conversions: `${(index + 2) * 18}`,
  roi: `${(1.2 + index * 0.05).toFixed(2)}x`,
  cost: `¥${(index + 2) * 3200}`
}));

const openModal = (type, row) => {
  activeModal.value = type;
  selectedRow.value = row || {};
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitle = computed(() => {
  const titles = {
    export: '报表导出',
    abtest: 'A/B 测试设置',
    roi: 'ROI 成本分析',
    compare: '多维度对比',
    alert: '监测预警',
    detail: '数据详情',
    optimize: '优化建议'
  };
  return titles[activeModal.value] || '操作';
});
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.page-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.outline {
  background: #fff;
  border: 1px solid #cbd5f5;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
  color: #475569;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.grid {
  display: grid;
  gap: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.line-chart {
  display: grid;
  gap: 12px;
}

.line-point {
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

.line-bar {
  height: 12px;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  border-radius: 999px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.link {
  background: transparent;
  border: none;
  color: #2563eb;
  cursor: pointer;
  margin-right: 8px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.compare-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.compare-tags span {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}
</style>
