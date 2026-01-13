<template>
  <div class="card">
    <div class="section-title">{{ title }}</div>
    <svg viewBox="0 0 320 120" width="100%" height="120">
      <defs>
        <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#14b8a6" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#line)"
        stroke-width="3"
        :points="points"
      />
      <circle v-for="(point, idx) in pointList" :key="idx" :cx="point.x" :cy="point.y" r="4" fill="#2563eb" />
    </svg>
    <div class="stat">
      <div>
        <div class="stat-value">{{ value }}</div>
        <div class="stat-label">{{ subtitle }}</div>
      </div>
      <span class="badge">{{ badge }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  value: String,
  subtitle: String,
  badge: String,
  data: {
    type: Array,
    default: () => [20, 40, 30, 60, 45, 70, 55]
  }
});

const pointList = computed(() => {
  const max = Math.max(...props.data);
  const min = Math.min(...props.data);
  const range = max - min || 1;
  return props.data.map((item, idx) => ({
    x: 20 + idx * 45,
    y: 100 - ((item - min) / range) * 70
  }));
});

const points = computed(() => pointList.value.map((item) => `${item.x},${item.y}`).join(" "));
</script>
