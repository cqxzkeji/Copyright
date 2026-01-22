<template>
  <teleport to="body">
    <div v-if="open" class="overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close" @click="emit('close')">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
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

const emit = defineEmits(["close"]);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 20px;
  max-width: 560px;
  width: 100%;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
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

.close {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  margin-top: 16px;
  color: #334155;
  font-size: 14px;
}
</style>
