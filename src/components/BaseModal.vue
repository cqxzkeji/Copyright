<template>
  <teleport to="body">
    <div v-if="show" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-card">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button type="button" class="ghost" @click="onClose">关闭</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer v-if="showFooter" class="modal-footer">
          <button type="button" class="secondary" @click="onClose">取消</button>
          <button type="button" class="primary" @click="onConfirm">确认</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: '' },
  showFooter: { type: Boolean, default: true },
  onClose: { type: Function, default: () => {} },
  onConfirm: { type: Function, default: () => {} }
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
  padding: 24px;
  z-index: 200;
}

.modal-card {
  width: min(640px, 90vw);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.modal-header,
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  gap: 12px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.modal-body {
  padding: 18px 20px 24px;
  color: #1e293b;
}

.modal-footer {
  justify-content: flex-end;
}

button {
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}

button.primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
}

button.secondary {
  background: #e2e8f0;
  color: #1e293b;
}

button.ghost {
  background: transparent;
  color: #64748b;
}

@media (max-width: 640px) {
  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
