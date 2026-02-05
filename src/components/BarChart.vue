<template>
  <div class="chart">
    <div v-for="(point, index) in data" :key="index" class="bar">
      <div class="bar-fill" :style="{ height: `${point.value}%` }"></div>
      <span>{{ point.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] }
});
</script>

<style scoped>
.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
  align-items: end;
  gap: 12px;
  height: 200px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
}

.bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
}

.bar-fill {
  width: 100%;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(180deg, #60a5fa, #34d399);
  min-height: 16px;
  transition: height 0.3s ease;
}
</style>
