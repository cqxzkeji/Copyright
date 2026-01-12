<template>
  <teleport to="body">
    <div v-if="open" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal-card">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" type="button" @click="$emit('close')">×</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button class="primary" type="button" @click="$emit('close')">确认</button>
          </slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ""
  }
});
defineEmits(["close"]);
</script>

<style scoped>
.modal-mask {
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
  width: min(680px, 94vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.modal-body {
  padding: 20px 22px;
  max-height: 65vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 22px 20px;
  border-top: 1px solid #e5e7eb;
}

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 20px;
  line-height: 1;
}

.primary {
  background: #2563eb;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
}
</style>
