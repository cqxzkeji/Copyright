<template>
  <div class="backdrop" @click.self="close">
    <div class="modal">
      <header class="modal__header">
        <h3>{{ title }}</h3>
        <button class="close" @click="close">×</button>
      </header>
      <section class="modal__body">
        <slot />
      </section>
      <footer class="modal__footer" v-if="showActions">
        <button class="btn ghost" @click="close">取消</button>
        <button class="btn primary" @click="$emit('confirm')">确定</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '操作' },
  showActions: { type: Boolean, default: true }
});

const emit = defineEmits(['close', 'confirm']);
const close = () => emit('close');
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 50;
}

.modal {
  background: #ffffff;
  width: min(600px, 100%);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal__body {
  padding: 20px;
  line-height: 1.6;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
}

.close {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.btn {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn.primary {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.btn.ghost:hover {
  background: #f3f4f6;
}
</style>
