<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-card" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" type="button" @click="onClose">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="primary" type="button" @click="onClose">完成</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  title: String
});

const emit = defineEmits(["close"]);

const onClose = () => {
  emit("close");
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 30, 60, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  width: min(680px, 96vw);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.16);
  overflow: hidden;
}

.modal-header {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e3e8f1;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.icon-button {
  border: none;
  background: #f1f4f9;
  color: #334155;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  display: grid;
  gap: 12px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e3e8f1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
