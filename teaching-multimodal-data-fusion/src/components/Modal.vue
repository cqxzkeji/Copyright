<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <button class="btn ghost" type="button" @click="close">关闭</button>
      </div>
      <div>
        <slot />
      </div>
      <div class="modal-actions">
        <slot name="actions">
          <button class="btn" type="button" @click="close">知道了</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

const close = () => emit('close');
</script>
