<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" type="button" @click="$emit('close')">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer v-if="showFooter" class="modal-footer">
        <button class="secondary" type="button" @click="$emit('close')">关闭</button>
        <button class="primary" type="button" @click="$emit('confirm')">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  showFooter: {
    type: Boolean,
    default: true
  }
});

defineEmits(['close', 'confirm']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(18, 30, 53, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 2000;
}

.modal-card {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(12, 29, 66, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eef2f7;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.icon-button {
  border: none;
  background: #f0f3f8;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  display: grid;
  gap: 16px;
  color: #364152;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px 20px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.secondary {
  background: #edf1f7;
  color: #1c2333;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
