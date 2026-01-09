<template>
  <div v-if="show" class="modal-overlay" @click.self="onClose">
    <div class="modal" :style="{ width: width }">
      <div class="section-header">
        <h3>{{ title }}</h3>
        <button class="btn secondary" type="button" @click="onClose">关闭</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  width: {
    type: String,
    default: 'min(600px, 100%)'
  }
});

const emit = defineEmits(['close']);

const onClose = () => emit('close');
</script>
