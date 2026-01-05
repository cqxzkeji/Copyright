<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button style="background:#eef2ff;color:#111827" @click="close">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button style="background:#10b981" @click="confirm">确认</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '操作'
  },
  onConfirm: {
    type: Function,
    default: () => {}
  },
  onClose: {
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(['close', 'confirm']);

const close = () => {
  props.onClose();
  emit('close');
};

const confirm = () => {
  props.onConfirm();
  emit('confirm');
};
</script>
