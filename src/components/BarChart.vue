<template>
  <div class="chart-card">
    <div class="chart-title">{{ title }}</div>
    <svg :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="chart">
      <defs>
        <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#60a5fa" />
        </linearGradient>
      </defs>
      <g v-for="(value, index) in values" :key="index">
        <rect
          :x="index * barWidth + gap"
          :y="height - valueScale(value)"
          :width="barWidth - gap * 2"
          :height="valueScale(value)"
          rx="6"
          fill="url(#barGradient)"
        />
      </g>
    </svg>
    <div class="chart-labels">
      <span v-for="label in labels" :key="label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  labels: {
    type: Array,
    default: () => []
  },
  values: {
    type: Array,
    default: () => []
  }
});

const width = 480;
const height = 160;
const gap = 6;
const barWidth = computed(() => width / Math.max(props.values.length, 1));

const valueScale = (value) => {
  const max = Math.max(...props.values, 1);
  return Math.round((value / max) * (height - 12));
};
</script>

<style scoped>
.chart-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 12px;
}

.chart-title {
  font-weight: 600;
}

svg {
  width: 100%;
  height: 160px;
}

.chart-labels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(42px, 1fr));
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  text-align: center;
}
</style>
