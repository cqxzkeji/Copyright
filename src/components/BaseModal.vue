<template>
  <div class="modal-overlay" @click.self="onClose">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <button class="btn btn-secondary" type="button" @click="onClose">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div v-if="$slots.actions" class="modal-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "提示"
  }
});

const emit = defineEmits(["close"]);

const onClose = () => emit("close");
</script>
