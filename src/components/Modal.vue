<template>
  <div v-if="show" class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal-card">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" type="button" @click="onClose">✕</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="primary" type="button" @click="onClose">完成</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  onClose: {
    type: Function,
    required: true
  }
});
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.modal-card {
  background: var(--card);
  width: min(640px, 100%);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 18px;
}

.modal-body {
  color: var(--muted);
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-button {
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
}

.primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  cursor: pointer;
}
</style>
