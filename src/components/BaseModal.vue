<template>
  <div v-if="open" class="modal-mask">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <button class="modal-close" type="button" @click="onClose">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="modal-footer" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 12px;">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: {
    type: String,
    default: ''
  },
  onClose: {
    type: Function,
    default: () => {}
  }
});
</script>
