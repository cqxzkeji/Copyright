<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="ghost" @click="emit('close')">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <button class="ghost" @click="emit('close')">取消</button>
        <button v-if="primaryText" class="primary" @click="emit('confirm')">{{ primaryText }}</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  primaryText: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['close', 'confirm']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  padding: 1rem;
}

.modal-card {
  width: min(480px, 100%);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  color: #475569;
  font-size: 0.95rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

button.ghost {
  background: transparent;
  color: #475569;
  padding: 0.35rem 0.75rem;
}

button.primary {
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  color: #fff;
  border-radius: 999px;
  padding: 0.45rem 1.4rem;
}
</style>
