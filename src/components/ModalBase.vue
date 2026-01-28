<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-card" :style="{ width }">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" @click="emit('close')">✕</button>
        </header>
        <div class="modal-body">
          <slot />
        </div>
        <footer class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: String,
  width: {
    type: String,
    default: '520px'
  }
});

const emit = defineEmits(['close']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
}

.modal-body {
  padding: 20px 22px;
  overflow-y: auto;
}

.modal-footer {
  padding: 14px 22px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 18px;
}
</style>
