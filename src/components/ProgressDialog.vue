<template>
  <div v-if="modelValue" class="overlay" @click.self="$emit('update:modelValue', false)">
    <div class="dialog">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('update:modelValue', false)">×</button>
      </header>
      <section class="body">
        <p class="hint">{{ description }}</p>
        <div class="bar">
          <div class="value" :style="{ width: `${progress}%` }"></div>
        </div>
        <p class="percentage">{{ progress }}%</p>
      </section>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '进度' },
  description: { type: String, default: '正在处理...' },
  progress: { type: Number, default: 0 }
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 60;
}

.dialog {
  background: var(--surface);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  width: min(440px, 100%);
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--border);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
}

.close {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #9ca3af;
}

.hint {
  margin: 0 0 6px;
  color: #4b5563;
}

.bar {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.value {
  height: 100%;
  background: linear-gradient(120deg, var(--primary), #34d399);
}

.percentage {
  margin: 6px 0 0;
  font-weight: 600;
  color: #111827;
}
</style>
