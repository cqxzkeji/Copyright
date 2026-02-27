<template>
  <div class="chart-card">
    <h4>{{ title }}</h4>
    <svg viewBox="0 0 600 240" class="chart">
      <polyline
        fill="none"
        stroke="#2f8cff"
        stroke-width="4"
        :points="points"
      />
      <line v-for="tick in 6" :key="tick" :x1="0" :y1="tick * 40" x2="600" :y2="tick * 40" class="grid" />
      <circle
        v-for="(value, index) in values"
        :key="index"
        :cx="index * (600 / (values.length - 1))"
        :cy="220 - value * 2"
        r="4"
        fill="#ff9f43"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  values: {
    type: Array,
    default: () => [40, 45, 32, 60, 75, 58, 80]
  }
})

const points = computed(() =>
  props.values
    .map((value, index) => `${index * (600 / (props.values.length - 1))},${220 - value * 2}`)
    .join(' ')
)
</script>

<style scoped>
.chart-card {
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 8px 25px rgba(52, 122, 193, 0.12);
}
.chart {
  width: 100%;
  height: 240px;
}
.grid {
  stroke: #e7eef8;
  stroke-width: 1;
}
</style>
