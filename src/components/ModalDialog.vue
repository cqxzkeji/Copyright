<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>
      <section class="modal-body">
        <slot>
          <p>{{ message }}</p>
        </slot>
      </section>
      <footer class="modal-footer">
        <button class="primary" @click="$emit('confirm')">{{ confirmText }}</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '提示' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '知道了' }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #fff;
  width: min(520px, 90%);
  border-radius: 18px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  color: #4b5563;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.primary {
  background: linear-gradient(135deg, #1abc9c, #16a085);
  color: #fff;
}
</style>
