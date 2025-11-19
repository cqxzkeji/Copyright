<template>
  <svg :viewBox="`0 0 ${props.width} ${props.height}`" class="chart">
    <polyline :points="points" fill="none" stroke="#2c64ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <polyline :points="baseline" fill="none" stroke="#e0e7ff" stroke-width="2" stroke-dasharray="6 6" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  values: { type: Array, default: () => [] },
  width: { type: Number, default: 240 },
  height: { type: Number, default: 120 }
});

const normalized = computed(() => {
  if (!props.values.length) return [];
  const max = Math.max(...props.values);
  const min = Math.min(...props.values);
  return props.values.map((value) => (max === min ? 0.5 : (value - min) / (max - min)));
});

const points = computed(() => {
  if (!props.values.length) return '';
  const step = props.width / (props.values.length - 1 || 1);
  return normalized.value
    .map((n, index) => `${index * step},${props.height - n * props.height}`)
    .join(' ');
});

const baseline = computed(() => `0,${props.height} ${props.width},${props.height}`);
</script>

<style scoped>
.chart {
  width: 100%;
  height: 120px;
}
</style>
