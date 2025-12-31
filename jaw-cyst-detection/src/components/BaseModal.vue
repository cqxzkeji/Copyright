<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <span style="cursor: pointer; color: var(--muted);" @click="close">✕</span>
      </div>
      <div>
        <slot />
      </div>
      <div class="modal-actions">
        <button @click="confirm">{{ confirmText }}</button>
        <button style="background:#e5e7eb; color: #111827;" @click="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '操作' },
  confirmText: { type: String, default: '确定' }
});
const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => emit('update:modelValue', false);
const confirm = () => emit('confirm');
</script>
