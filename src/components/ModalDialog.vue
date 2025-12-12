<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="emitClose">
      <div class="modal">
        <div class="flex-between" style="margin-bottom: 12px; gap: 8px;">
          <div style="font-weight: 800; font-size: 18px;">{{ title }}</div>
          <button style="padding: 6px 10px; background: #e0e7f5; color: var(--text);" @click="emitClose">关闭</button>
        </div>
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '操作弹窗' }
});
const emit = defineEmits(['update:modelValue']);

const emitClose = () => emit('update:modelValue', false);
</script>
