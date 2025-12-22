<template>
  <div class="modal-backdrop" @click.self="onClose">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" @click="onClose">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <button class="secondary" @click="onClose">关闭</button>
        <button class="primary" v-if="confirmText" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);

const onClose = () => emit('close');
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}

.modal-card {
  width: min(560px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modal-header {
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 18px 20px;
  display: grid;
  gap: 12px;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  color: #1e293b;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
