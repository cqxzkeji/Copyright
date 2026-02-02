<template>
  <div class="modal-backdrop" @click.self="emitClose">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="ghost-btn" @click="emitClose">关闭</button>
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
const props = defineProps({
  title: {
    type: String,
    default: "提示"
  }
});

const emit = defineEmits(["close"]);

const emitClose = () => emit("close");
</script>
