<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal-card" :style="{ width }">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" type="button" @click="close">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <button class="secondary" type="button" @click="close">关闭</button>
          <button class="primary" type="button" @click="$emit('confirm')">确认</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '520px' }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  max-width: 96vw;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
  display: grid;
  gap: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px 20px;
}

.icon-button {
  border: none;
  background: #f1f5f9;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  color: #1f2937;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
