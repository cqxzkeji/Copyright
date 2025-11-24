<template>
  <ModalDialog :title="title" width="460px" @close="emit('close')">
    <div class="progress-wrap">
      <div class="label">{{ description }}</div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: percentage + '%' }"></div>
      </div>
      <div class="value">{{ percentage.toFixed(0) }}%</div>
    </div>
  </ModalDialog>
</template>

<script setup>
import ModalDialog from './ModalDialog.vue';

const props = defineProps({
  title: { type: String, default: '处理进度' },
  description: { type: String, default: '正在处理最新任务…' },
  percentage: { type: Number, default: 0 }
});
const emit = defineEmits(['close']);
</script>

<style scoped>
.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.progress-bar {
  width: 100%;
  height: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.progress {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, #3dd598, #42a5f5);
  transition: width 0.3s ease;
}
.label {
  font-size: 0.95rem;
  opacity: 0.9;
}
.value {
  font-weight: 600;
  text-align: right;
}
</style>
