<template>
  <div class="grid grid-2">
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">决策支持</div>
          <h3>统计分析</h3>
        </div>
        <div class="actions">
          <button class="btn btn-outline" @click="refresh">刷新数据</button>
          <button class="btn btn-primary" @click="openSummary">生成摘要</button>
        </div>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>当前值</th>
            <th>趋势</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in metrics" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.trend }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">成果图</div>
          <h3>能源与费用趋势</h3>
        </div>
        <button class="btn btn-outline" @click="openInfo">图表说明</button>
      </header>
      <div class="chart">
        <div v-for="item in charts" :key="item.label" class="chart-row">
          <div class="label">{{ item.label }}</div>
          <div class="chart-bar">
            <div class="fill" :style="{ width: item.value + '%' }"></div>
          </div>
          <span class="value">{{ item.value }}%</span>
        </div>
      </div>
    </div>
  </div>
  <BaseModal v-if="showSummary" title="决策摘要" @close="showSummary = false" :actions="summaryActions">
    <p>拆除阶段成本控制良好，建议继续压缩运输环节；绿建材料投入有利于后期能耗。</p>
  </BaseModal>
  <BaseModal v-if="showInfo" title="图表说明" @close="showInfo = false" :actions="infoActions">
    <p>能源强度与费用指数均为实时计算，亮色表示下降趋势，需关注费用上升段。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = reactive([
  { name: '投资完成率', value: '62%', trend: '↑ 6%' },
  { name: '风险闭合率', value: '78%', trend: '↑ 3%' },
  { name: '拆除周期', value: '42天', trend: '↓ 2天' },
  { name: '能耗指数', value: '0.86', trend: '↓ 0.05' },
  { name: '费用指数', value: '1.12', trend: '↑ 0.04' }
]);

const charts = reactive([
  { label: '能源强度', value: 48 },
  { label: '费用指数', value: 62 },
  { label: '周转效率', value: 74 },
  { label: '安全指数', value: 82 },
  { label: '满意度', value: 69 }
]);

const showSummary = ref(false);
const showInfo = ref(false);

const refresh = () => {
  metrics.forEach(item => {
    if (item.name === '投资完成率') item.value = '68%';
    if (item.name === '风险闭合率') item.value = '81%';
  });
};

const openSummary = () => (showSummary.value = true);
const openInfo = () => (showInfo.value = true);

const summaryActions = [{ label: '确定', primary: true, onClick: () => (showSummary.value = false) }];
const infoActions = [{ label: '了解', primary: true, onClick: () => (showInfo.value = false) }];
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.chart {
  display: grid;
  gap: 12px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 3fr 0.6fr;
  align-items: center;
  gap: 10px;
}

.chart-bar {
  background: rgba(45, 123, 255, 0.1);
  height: 14px;
  border-radius: 999px;
}

.fill {
  height: 100%;
  background: linear-gradient(120deg, #2d7bff, #4fe1b9);
}

.label {
  font-weight: 600;
}

.value {
  font-weight: 700;
}
</style>
