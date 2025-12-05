<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-mask" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h3 style="margin: 0; font-size: 1.05rem; color: #1f2937;">{{ title }}</h3>
          <button class="btn secondary" @click="close">关闭</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-actions">
          <button class="btn secondary" @click="close">取消</button>
          <button class="btn" @click="confirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '操作' },
  confirmText: { type: String, default: '确认' }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => emit('update:modelValue', false);
const confirm = () => emit('confirm');
</script>
