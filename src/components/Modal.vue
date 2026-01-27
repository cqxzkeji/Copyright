<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="ghost" type="button" @click="close">✕</button>
      </div>
      <div class="modal-content">
        <slot />
      </div>
      <div v-if="!hideActions" class="modal-actions">
        <button class="ghost" type="button" @click="close">取消</button>
        <button class="primary" type="button" @click="confirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '弹窗',
  },
  hideActions: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'confirm']);

const close = () => emit('close');
const confirm = () => emit('confirm');
</script>

<style scoped>
.ghost {
  background: #e2e8f0;
  padding: 8px 14px;
  border-radius: 10px;
  color: #334155;
}

.primary {
  background: linear-gradient(90deg, #38bdf8, #4f46e5);
  padding: 8px 16px;
  border-radius: 10px;
  color: #ffffff;
  font-weight: 600;
}
</style>
