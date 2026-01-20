<template>
  <div class="progress-wrap">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
    <div class="progress-label">{{ progress }}%</div>
  </div>
</template>

<script setup>
defineProps({
  progress: { type: Number, default: 0 }
});
</script>

<style scoped>
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track {
  flex: 1;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #6366f1);
  transition: width 0.2s ease;
}

.progress-label {
  width: 48px;
  text-align: right;
  font-weight: 600;
  color: #334155;
}
</style>
