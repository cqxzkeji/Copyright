<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="ghost" type="button" @click="$emit('close')">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="primary" type="button" @click="$emit('close')">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
});

defineEmits(['close']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  width: min(720px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.modal-header,
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
}

.modal-body {
  padding: 20px;
  display: grid;
  gap: 12px;
  color: #334155;
}

.ghost {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #64748b;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
