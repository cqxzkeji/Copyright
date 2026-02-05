<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal-card">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="ghost" type="button" @click="$emit('close')">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "" }
});

defineEmits(["close"]);
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
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: min(720px, 100%);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 20px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
}

.modal-body {
  padding: 16px 24px 0;
  overflow: auto;
}

.modal-footer {
  padding: 20px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.ghost {
  border: none;
  background: #f1f5f9;
  border-radius: 999px;
  width: 36px;
  height: 36px;
  cursor: pointer;
}
</style>
