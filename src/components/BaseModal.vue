<template>
  <div class="modal-mask" @click.self="onClose">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <button class="btn ghost" type="button" @click="onClose">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ""
  },
  onClose: {
    type: Function,
    default: () => {}
  }
});
</script>
