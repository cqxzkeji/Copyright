<template>
  <div v-if="show" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card" :style="{ width }">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" type="button" @click="emit('close')">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer v-if="showFooter" class="modal-footer">
        <button class="secondary" type="button" @click="emit('close')">关闭</button>
        <button class="primary" type="button" @click="emit('confirm')">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: "提示"
  },
  width: {
    type: String,
    default: "520px"
  },
  showFooter: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["close", "confirm"]);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  padding: 24px;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  width: min(90vw, 520px);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-body {
  padding: 16px 24px 24px;
  overflow: auto;
}

.modal-footer {
  padding: 12px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e2e8f0;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  border: none;
  color: #1f2a37;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
