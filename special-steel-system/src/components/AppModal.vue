<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-mask">
      <div class="modal-card" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-btn" @click="$emit('update:modelValue', false)">×</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer v-if="showFooter" class="modal-footer">
          <button class="action-btn secondary" @click="$emit('update:modelValue', false)">关闭</button>
          <button class="action-btn" @click="$emit('confirm')">确认</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '操作窗口'
  },
  showFooter: {
    type: Boolean,
    default: true
  }
});

defineEmits(['update:modelValue', 'confirm']);
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 25, 45, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.modal-card {
  width: min(720px, 95vw);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 50px rgba(15, 27, 55, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #edf1f7;
}

.modal-body {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #edf1f7;
}

.icon-btn {
  border: none;
  background: #eef2ff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}
</style>
