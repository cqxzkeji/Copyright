<template>
  <div v-if="show" class="modal-overlay" role="dialog" aria-modal="true">
    <div class="modal-card" :style="{ width }">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close" type="button" @click="$emit('close')">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="button secondary" type="button" @click="$emit('close')">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '520px'
  }
});

defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #edf2f7;
}

.modal-body {
  padding: 16px 20px;
  overflow-y: auto;
}

.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.close {
  background: #f8fafc;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 18px;
  line-height: 1;
}
</style>
