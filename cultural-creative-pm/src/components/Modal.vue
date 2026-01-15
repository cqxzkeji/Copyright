<template>
  <teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="onClose">
      <div class="modal-card">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" type="button" @click="onClose">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <button class="secondary" type="button" @click="onClose">关闭</button>
          <button class="primary" type="button" @click="onConfirm">确认</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["close", "confirm"]);

const onClose = () => {
  emit("close");
};

const onConfirm = () => {
  emit("confirm");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px 24px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  display: grid;
  gap: 12px;
  font-size: 14px;
  color: #3b465f;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-footer button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.modal-footer .secondary {
  background: #eef2ff;
  color: #3b4c8a;
}

.modal-footer .primary {
  background: linear-gradient(120deg, #4f46e5, #22c1c3);
  color: #fff;
}
</style>
