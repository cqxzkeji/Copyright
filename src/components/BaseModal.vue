<template>
  <div class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal-card">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn ghost" type="button" @click="$emit('close')">关闭</button>
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
    default: '提示',
  },
});
</script>
