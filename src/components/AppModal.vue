<template>
  <div v-if="open" class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <button class="btn light" @click="$emit('close')">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-actions">
        <button class="btn light" @click="$emit('close')">取消</button>
        <button class="btn" @click="$emit('confirm')">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: {
    type: String,
    default: ""
  }
});

defineEmits(["close", "confirm"]);
</script>
