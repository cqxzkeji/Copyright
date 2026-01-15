<template>
  <teleport to="body">
    <div v-if="open" class="modal-mask" @click.self="onClose">
      <div class="modal-card" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" type="button" @click="onClose">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <button class="secondary" type="button" @click="onClose">关闭</button>
          <button v-if="confirmText" class="primary" type="button" @click="onConfirm">
            {{ confirmText }}
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  open: Boolean,
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
const onConfirm = () => emit('confirm');
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(11, 24, 48, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 2000;
}

.modal-card {
  width: min(680px, 100%);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 45px rgba(15, 25, 45, 0.2);
  overflow: hidden;
}

.modal-header,
.modal-footer {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f3f6ff;
}

.modal-body {
  padding: 20px;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #5b6b82;
}

.modal-footer {
  gap: 12px;
  justify-content: flex-end;
}

.primary,
.secondary {
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 14px;
  border: none;
  cursor: pointer;
}

.primary {
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
  color: #fff;
}

.secondary {
  background: #e8edf7;
  color: #2f3c4a;
}
</style>
