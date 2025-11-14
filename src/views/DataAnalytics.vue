<template>
  <div class="module-grid">
    <div class="flat-card" style="grid-column: span 2">
      <header class="section-header">
        <div>
          <h3>危废收储趋势</h3>
          <p>多源数据融合分析 · 支持 VR 大屏</p>
        </div>
        <button class="primary-btn" @click="exportReport">导出报表</button>
      </header>
      <div class="chart-placeholder">
        <div v-for="value in trend" :key="value" class="chart-bar" :style="{ height: value + '%' }"></div>
      </div>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>指标概览</h3>
          <p>同比增速、能耗、碳排</p>
        </div>
        <button class="secondary-btn" @click="refreshKpi">刷新</button>
      </header>
      <ul class="kpi-list">
        <li v-for="kpi in kpis" :key="kpi.label">
          <div>
            <strong>{{ kpi.label }}</strong>
            <p>{{ kpi.desc }}</p>
          </div>
          <span>{{ kpi.value }}</span>
        </li>
      </ul>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>AI 预测</h3>
          <p>预测未来 7 天危废入场量</p>
        </div>
        <button class="primary-btn" @click="runPrediction">重新预测</button>
      </header>
      <div class="prediction">
        <p>预计入场总量：<strong>{{ prediction.total }} 吨</strong></p>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: prediction.confidence + '%' }"></div>
        </div>
        <p class="progress-label">可信度 {{ prediction.confidence }}%</p>
      </div>
    </div>
  </div>
  <BaseModal v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
    <p>{{ modal.message }}</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const trend = [65, 72, 58, 80, 90];
const kpis = ref([
  { label: '收集量', desc: '较上月 +18%', value: '125 吨' },
  { label: '热值利用', desc: '焚烧余热回收', value: '86%' },
  { label: '碳排抵消', desc: '绿证抵扣', value: '42 tCO₂e' }
]);
const prediction = reactive({ total: 132, confidence: 78 });
const modal = reactive({ visible: false, title: '', message: '' });

const exportReport = () => {
  modal.visible = true;
  modal.title = '报表导出';
  modal.message = '系统已将报表推送到管理员邮箱，包含 VR 大屏素材。';
};

const refreshKpi = () => {
  kpis.value = kpis.value.map((kpi) => ({
    ...kpi,
    value: kpi.label === '收集量' ? '128 吨' : kpi.value
  }));
};

const runPrediction = () => {
  prediction.total += 2;
  prediction.confidence = Math.min(100, prediction.confidence + 3);
  modal.visible = true;
  modal.title = '预测完成';
  modal.message = `最新预测总量 ${prediction.total} 吨，可信度 ${prediction.confidence}%。`;
};
</script>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.kpi-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-list li {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
}

.prediction {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
