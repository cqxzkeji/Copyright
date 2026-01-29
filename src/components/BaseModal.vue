<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click="onBackdrop">
      <div class="modal" @click.stop>
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" type="button" @click="close">×</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button class="primary" type="button" @click="close">知道了</button>
          </slot>
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
    default: ''
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const onBackdrop = () => {
  close();
};
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

.modal {
  background: #fff;
  border-radius: 16px;
  width: min(720px, 95vw);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
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
  color: #0f172a;
}

.modal-body {
  padding: 16px 24px;
  overflow: auto;
  color: #334155;
}

.modal-footer {
  padding: 12px 24px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
  color: #64748b;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
}
</style>
