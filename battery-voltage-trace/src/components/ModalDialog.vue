<template>
  <div class="modal-backdrop" v-if="modelValue">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn btn-ghost" @click="close">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div v-if="withFooter" class="modal-footer" style="margin-top: 14px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-ghost" @click="close">取消</button>
        <button class="btn btn-primary" @click="confirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '弹窗' },
  withFooter: { type: Boolean, default: true }
});
const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => emit('update:modelValue', false);
const confirm = () => emit('confirm');
</script>
