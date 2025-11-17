<template>
  <div class="overlay" v-if="modelValue">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('update:modelValue', false)">×</button>
      </header>
      <div class="content">
        <p>{{ description }}</p>
        <div class="bar">
          <div class="fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="percent">{{ progress }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '执行进度' },
  description: { type: String, default: '' },
  progress: { type: Number, default: 0 }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 14, 40, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}
.modal {
  width: min(440px, 92vw);
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 10px 45px rgba(9, 10, 38, 0.18);
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.close {
  border: none;
  background: transparent;
  font-size: 1.25rem;
  cursor: pointer;
}
.content {
  color: #4b5563;
}
.bar {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
  margin: 0.75rem 0;
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #34d399);
}
.percent {
  font-weight: 600;
  color: #1f2937;
  text-align: right;
}
</style>
