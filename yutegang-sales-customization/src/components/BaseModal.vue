<template>
  <div v-if="show" class="modal-overlay" role="dialog" aria-modal="true">
    <div class="modal-card" :style="{ width }">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" @click="$emit('close')">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="secondary" @click="$emit('close')">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  width: {
    type: String,
    default: "560px",
  },
});

defineEmits(["close"]);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 25, 45, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 999;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 25, 45, 0.2);
  max-width: 90vw;
}

.modal-header,
.modal-footer {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eef2ff;
}

.modal-footer {
  border-top: 1px solid #eef2ff;
  border-bottom: none;
  justify-content: flex-end;
  gap: 12px;
}

.modal-body {
  padding: 18px 20px;
  max-height: 60vh;
  overflow: auto;
}

.icon-button {
  border: none;
  background: #eef3ff;
  color: #345;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.secondary {
  background: #eef2ff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
