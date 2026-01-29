<template>
  <div v-if="show" class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal" :style="{ width: width }">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="modal-close" type="button" @click="$emit('close')">×</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: 'min(720px, 100%)'
  }
});

defineEmits(['close']);
</script>
