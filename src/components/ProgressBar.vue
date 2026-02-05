<template>
  <div class="progress">
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${value}%` }"></div>
    </div>
    <span>{{ value }}%</span>
  </div>
</template>

<script setup>
defineProps({
  value: { type: Number, default: 0 }
});
</script>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track {
  flex: 1;
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #3b82f6);
  transition: width 0.3s ease;
}
</style>
