<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card flat-card">
      <header>
        <h3>{{ title }}</h3>
      </header>
      <section>
        <slot />
      </section>
      <footer class="modal-actions">
        <button class="primary-btn" @click="close">好的</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '提示'
  }
});

const emit = defineEmits(['close']);
const close = () => emit('close');
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: min(480px, 90vw);
}

.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>
