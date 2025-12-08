<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="modal-close" aria-label="关闭" @click="close">×</button>
      </div>
      <slot />
      <div v-if="actions?.length" class="modal-actions">
        <button
          v-for="(action, index) in actions"
          :key="index"
          class="primary-btn"
          type="button"
          @click="action.onClick ? action.onClick(close) : close()"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  actions: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-actions {
  margin-top: 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
