<template>
  <div v-if="show" class="modal-backdrop" @click.self="onClose">
    <div class="modal">
      <header class="modal__header">
        <h3>{{ title }}</h3>
        <button class="modal__close" @click="onClose">✕</button>
      </header>
      <section class="modal__body">
        <slot />
      </section>
      <footer class="modal__footer">
        <button class="btn btn--ghost" @click="onClose">关闭</button>
        <slot name="actions" />
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '提示'
  }
});

const emit = defineEmits(['close']);

const onClose = () => emit('close');
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.modal__body {
  padding: 18px 20px;
  color: var(--muted);
}

.modal__footer {
  padding: 12px 20px 18px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal__close {
  font-size: 16px;
  color: var(--muted);
}

.btn {
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
}

.btn--primary {
  background: var(--primary);
  color: #fff;
}

.btn--ghost {
  background: #eef2ff;
  color: var(--primary);
}
</style>
