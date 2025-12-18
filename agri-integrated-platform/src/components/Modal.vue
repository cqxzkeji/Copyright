<template>
  <div v-if="show" class="modal-mask" @click.self="onClose">
    <div class="modal-container">
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="modal-close" @click="onClose">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: { type: String, default: '详情' }
});
const emit = defineEmits(['close']);
const onClose = () => emit('close');
</script>
