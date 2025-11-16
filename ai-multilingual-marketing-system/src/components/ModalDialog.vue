<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal-window">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="close">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <button @click="close">关闭</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '信息' }
});
const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-window {
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 16px;
  padding: 0;
  width: min(90vw, 540px);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.7);
}

.modal-header,
.modal-footer {
  padding: 16px 24px;
  background: rgba(148, 163, 184, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.modal-body {
  padding: 24px;
  line-height: 1.6;
  color: var(--text);
}

button {
  background: var(--accent);
  color: #0f172a;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
}

.close-btn {
  background: transparent;
  color: var(--text);
  font-size: 1.2rem;
  padding: 4px 8px;
}
</style>
