<template>
  <div class="module">
    <section class="panel">
      <div>
        <h3>数据分析与效果优化</h3>
        <p>统一监测曝光、互动、转化与 ROI，智能推荐下一步优化动作。</p>
      </div>
      <div class="action-row">
        <button @click="emit('open-modal', '洞察刷新', '数据已更新，最新 CTR +12%。')">刷新数据</button>
        <button @click="emit('open-modal', '智能诊断', '系统建议将高意向人群加入再营销池。')">诊断</button>
        <button @click="toggleForecast">预测走势</button>
      </div>
    </section>

    <section class="panel grid">
      <div class="chart">
        <h4>核心指标 (近 7 天)</h4>
        <div class="line-chart">
          <div v-for="point in trend" :key="point.day" class="point" :style="{ height: point.value + '%' }">
            <span>{{ point.value }}%</span>
          </div>
        </div>
      </div>
      <div class="kpi">
        <article v-for="item in kpis" :key="item.label">
          <p>{{ item.label }}</p>
          <h3>{{ item.value }}</h3>
          <small :class="{ up: item.delta > 0, down: item.delta < 0 }">
            {{ item.delta > 0 ? '+' : '' }}{{ item.delta }}%
          </small>
        </article>
      </div>
    </section>

    <div v-if="forecastVisible" class="inline-modal">
      <div class="inline-card">
        <h4>趋势预测</h4>
        <p>智能回归模型预测：转化率将在 7 天后提升 8%。</p>
        <div class="progress">
          <div class="progress-fill" :style="{ width: 80 + '%' }"></div>
        </div>
        <button @click="forecastVisible = false">关闭预测</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['open-modal']);
const forecastVisible = ref(false);
const trend = reactive([
  { day: '一', value: 45 },
  { day: '二', value: 52 },
  { day: '三', value: 60 },
  { day: '四', value: 55 },
  { day: '五', value: 62 },
  { day: '六', value: 70 },
  { day: '日', value: 73 }
]);

const kpis = reactive([
  { label: '曝光量', value: '1.2 亿', delta: 5 },
  { label: '互动率', value: '8.3%', delta: 2 },
  { label: '转化率', value: '4.1%', delta: -1 },
  { label: 'ROI', value: '3.5', delta: 6 }
]);

const toggleForecast = () => (forecastVisible.value = !forecastVisible.value);
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel {
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.5rem;
}

.action-row {
  display: flex;
  gap: 0.75rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  background: #cbd5f5;
  color: #0f172a;
  cursor: pointer;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.chart {
  flex: 2;
}

.line-chart {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  height: 200px;
  background: white;
  border-radius: 18px;
  padding: 1rem;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.point {
  flex: 1;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.8), rgba(99, 102, 241, 0));
  border-radius: 12px 12px 0 0;
  position: relative;
}

.point span {
  position: absolute;
  top: -1.5rem;
  font-size: 0.85rem;
}

.kpi {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.kpi article {
  background: white;
  border-radius: 18px;
  padding: 1rem;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

small {
  font-weight: bold;
}

small.up {
  color: #16a34a;
}

small.down {
  color: #dc2626;
}

.inline-modal {
  position: relative;
}

.inline-card {
  position: absolute;
  right: 0;
  bottom: 0;
  background: white;
  padding: 1.5rem;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.2);
}

.progress {
  width: 300px;
  height: 12px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #fb7185, #facc15);
}
</style>
