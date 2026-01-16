<template>
  <div v-if="open" class="modal-backdrop" @click.self="onClose">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-btn" type="button" @click="onClose">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <button class="btn ghost" type="button" @click="onClose">关闭</button>
        <button v-if="confirmText" class="btn" type="button" @click="onConfirm">{{ confirmText }}</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: {
    type: String,
    default: '提示'
  },
  confirmText: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);

const onClose = () => emit('close');
const onConfirm = () => emit('confirm');
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  width: min(520px, 92vw);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px 0 22px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.icon-btn {
  border: none;
  background: #f1f5f9;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  padding: 16px 22px;
  color: #334155;
}

.modal-footer {
  padding: 0 22px 18px 22px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.btn.ghost {
  background: #e2e8f0;
  color: #1e293b;
}
</style>
