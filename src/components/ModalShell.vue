<template>
  <div class="modal-mask" @click.self="onClose">
    <div class="modal-card">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-btn" type="button" @click="onClose">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <button class="ghost" type="button" @click="onClose">关闭</button>
        <button class="primary" type="button" @click="onConfirm">确认执行</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close", "confirm"]);

const onClose = () => emit("close");
const onConfirm = () => emit("confirm");
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  padding: 24px;
}

.modal-card {
  width: min(720px, 100%);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  padding: 18px 22px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-body {
  padding: 20px 22px;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 22px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.icon-btn {
  border: none;
  background: #f1f5f9;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  color: #334155;
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  padding: 8px 18px;
  cursor: pointer;
}
</style>
