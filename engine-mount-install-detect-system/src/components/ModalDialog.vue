<template>
  <teleport to="body">
    <div v-if="open" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal-header">
          <strong>{{ title }}</strong>
          <button class="button ghost" type="button" @click="$emit('close')">关闭</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: {
    type: String,
    default: '提示'
  }
});

defineEmits(['close']);
</script>
