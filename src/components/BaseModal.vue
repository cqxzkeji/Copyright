<template>
  <div v-if="show" class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button type="button" class="icon-btn" @click="$emit('close')">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button type="button" class="secondary" @click="$emit('close')">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
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
  display: grid;
  place-items: center;
  z-index: 50;
}

.modal-card {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.icon-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  font-size: 14px;
  color: #374151;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary {
  border: 1px solid #d1d5db;
  background: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
