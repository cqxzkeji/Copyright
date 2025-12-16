<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal">
      <header class="topbar" style="margin-bottom: 12px;">
        <h3 style="font-size: 18px;">{{ title }}</h3>
        <button style="background: #e2e8f0; color: #0f172a; padding: 6px 10px;" @click="close">关闭</button>
      </header>
      <div>
        <slot />
      </div>
      <footer style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 8px;">
        <button style="background: #e2e8f0; color: #0f172a;" @click="close">取消</button>
        <button @click="$emit('confirm')">确定</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '操作确认'
  }
});
const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => emit('update:modelValue', false);
</script>
