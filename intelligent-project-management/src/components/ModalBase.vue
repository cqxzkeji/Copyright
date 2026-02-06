<template>
  <div v-if="show" class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-card" :style="{ width }">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-btn" type="button" @click="$emit('close')">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  width: { type: String, default: '520px' }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 2000;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px 8px;
}

.modal-header h3 {
  font-size: 18px;
  color: #0f172a;
}

.modal-body {
  padding: 12px 20px 20px;
  overflow-y: auto;
}

.modal-footer {
  padding: 12px 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-btn {
  background: #eef2ff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #475569;
}
</style>
