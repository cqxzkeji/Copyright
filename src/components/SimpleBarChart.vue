<template>
  <div class="chart-wrap">
    <div v-for="item in data" :key="item.label" class="bar-row">
      <span class="bar-label">{{ item.label }}</span>
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: `${item.value}%` }"></div>
      </div>
      <span class="bar-value">{{ item.value }}%</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] },
});
</script>
