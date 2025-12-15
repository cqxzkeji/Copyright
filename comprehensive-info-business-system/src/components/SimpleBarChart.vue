<template>
  <div class="card" :style="{ padding: '14px' }">
    <div class="flex-between" style="margin-bottom: 8px;">
      <div>
        <p class="section-title" style="margin: 0;">{{ title }}</p>
        <p class="subtext">{{ subtitle }}</p>
      </div>
      <span class="badge">{{ data.length }} 指标</span>
    </div>
    <div class="chart-grid">
      <div
        v-for="item in data"
        :key="item.label"
        class="bar-row"
        :title="`${item.label}：${item.value}`"
      >
        <span class="bar-label">{{ item.label }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.min(item.value, 120)}%` }"></div>
        </div>
        <span class="bar-value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '指标概览' },
  subtitle: { type: String, default: '' },
  data: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.chart-grid {
  display: grid;
  gap: 10px;
}

.bar-row {
  display: grid;
  grid-template-columns: 130px 1fr 60px;
  align-items: center;
  gap: 10px;
}

.bar-label {
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
}

.bar-track {
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  height: 12px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  border-radius: inherit;
  transition: width 0.3s ease;
}

.bar-value {
  font-weight: 800;
  text-align: right;
  color: #0f172a;
}

@media (max-width: 640px) {
  .bar-row {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .bar-value {
    text-align: left;
  }
}
</style>
