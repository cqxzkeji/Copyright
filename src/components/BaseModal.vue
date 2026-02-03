<template>
  <div class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <span class="modal-close" @click="$emit('close')">关闭</span>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});

defineEmits(['close']);
</script>
