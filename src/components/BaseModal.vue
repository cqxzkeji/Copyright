<template>
  <div v-if="modelValue" class="modal-backdrop" @click="close">
    <div class="modal" :style="{ width }" @click.stop>
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close" @click="close">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer class="modal-footer" v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' },
  width: { type: String, default: '520px' }
});

const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(31, 45, 61, 0.25);
  overflow: hidden;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #eef0f4;
}

.modal-body {
  padding: 16px;
  overflow: auto;
}

.modal-footer {
  padding: 12px 16px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.close {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #9ca3af;
}
</style>
