<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal" :style="{ maxWidth: width }">
      <header class="modal-header">
        <div>
          <p class="modal-title">{{ title }}</p>
          <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
        </div>
        <button class="ghost" @click="close">✕</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="ghost" @click="close">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '提醒' },
  subtitle: { type: String, default: '' },
  modelValue: { type: Boolean, default: false },
  width: { type: String, default: '640px' }
});

const emit = defineEmits(['update:modelValue']);
const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 999;
}

.modal {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border);
}

.modal-header,
.modal-footer {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f8fafc;
}

.modal-title {
  margin: 0;
  font-weight: 700;
  font-size: 18px;
}

.modal-subtitle {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.modal-body {
  padding: 20px;
  background: white;
  max-height: 60vh;
  overflow: auto;
}

button.ghost {
  background: #eef2ff;
  color: #312e81;
  box-shadow: none;
  padding: 8px 12px;
}

button.ghost:hover {
  box-shadow: 0 4px 10px rgba(60, 123, 230, 0.15);
}
</style>
