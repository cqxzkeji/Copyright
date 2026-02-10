<template>
  <div v-if="modelValue" class="modal-mask" @click.self="close">
    <div class="modal-box">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="close">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <button class="btn secondary" @click="close">取消</button>
        <button v-if="showConfirm" class="btn" @click="$emit('confirm')">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' },
  showConfirm: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-box {
  width: min(560px, 92vw);
  background: white;
  border-radius: 14px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.2);
}
.modal-header,
.modal-footer {
  padding: 14px 18px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-footer {
  border-bottom: none;
  border-top: 1px solid #e2e8f0;
  justify-content: flex-end;
  gap: 10px;
}
.modal-body {
  padding: 18px;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
}
.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  color: white;
  background: #3b82f6;
  cursor: pointer;
}
.btn.secondary {
  color: #334155;
  background: #e2e8f0;
}
</style>
