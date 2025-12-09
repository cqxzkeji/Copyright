<template>
  <div class="overlay" v-if="visible">
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal__header">
        <div class="modal__title">{{ title }}</div>
        <button class="modal__close" @click="$emit('close')">×</button>
      </header>
      <div class="modal__body">
        <slot />
      </div>
      <footer class="modal__footer" v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '弹窗'
  },
  visible: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  z-index: 999;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  width: min(560px, 92vw);
  box-shadow: 0 10px 45px rgba(15, 23, 42, 0.18);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.modal__title {
  font-weight: 700;
  color: #0f172a;
}

.modal__close {
  border: none;
  background: #f1f5f9;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
}

.modal__body {
  padding: 12px 2px 8px;
  color: #1f2937;
  line-height: 1.6;
}

.modal__footer {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal__footer button {
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
</style>
