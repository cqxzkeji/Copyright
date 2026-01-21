<template>
  <div v-if="modelValue" class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal-card" :class="size">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" @click="close">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="secondary" @click="close">关闭</button>
          <button class="primary" @click="confirm">确认</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: "提示"
  },
  size: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const close = () => emit("update:modelValue", false);
const confirm = () => emit("confirm");
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 24px;
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  width: min(680px, 92vw);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-card.large {
  width: min(880px, 94vw);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 18px 22px;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 22px 20px;
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
  color: #475569;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.secondary {
  background: #f1f5f9;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  color: #1f2937;
}
</style>
