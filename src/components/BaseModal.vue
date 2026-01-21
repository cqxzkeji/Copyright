<template>
  <div v-if="modelValue" class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-card">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" @click="$emit('update:modelValue', false)">✕</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="primary" @click="$emit('update:modelValue', false)">确认</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 18, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
}

.modal-card {
  width: min(640px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(16, 24, 18, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
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

.modal-body {
  color: #37423c;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-button {
  border: none;
  background: #f2f5f3;
  color: #2f3b34;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}

.primary {
  background: var(--primary);
  border: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 999px;
  cursor: pointer;
}
</style>
