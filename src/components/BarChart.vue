<template>
  <div style="width: 100%;">
    <svg :viewBox="`0 0 ${width} ${height}`" style="width: 100%; height: 240px;">
      <g v-for="(item, index) in normalized" :key="item.label">
        <rect
          :x="padding + index * barGap"
          :y="height - padding - item.barHeight"
          :width="barWidth"
          :height="item.barHeight"
          :fill="item.color || '#2563eb'"
          rx="6"
        />
        <text
          :x="padding + index * barGap + barWidth / 2"
          :y="height - padding + 14"
          font-size="12"
          text-anchor="middle"
          fill="#0f172a"
        >{{ item.label }}</text>
        <text
          :x="padding + index * barGap + barWidth / 2"
          :y="height - padding - item.barHeight - 6"
          font-size="12"
          font-weight="700"
          text-anchor="middle"
          fill="#0f172a"
        >{{ item.value }}</text>
      </g>
      <line :x1="padding" :x2="width - padding / 2" :y1="height - padding" :y2="height - padding" stroke="#e2e8f0" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: { type: Array, default: () => [] }
});

const width = 800;
const height = 280;
const padding = 40;
const barWidth = 40;
const barGap = 70;

const normalized = computed(() => {
  const max = Math.max(...props.data.map((i) => i.value), 1);
  return props.data.map((item) => ({
    ...item,
    barHeight: ((height - padding * 2) * item.value) / max
  }));
});
</script>
