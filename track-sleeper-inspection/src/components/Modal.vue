<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-panel">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <button class="ghost-btn" type="button" @click="onClose">关闭</button>
      </div>
      <slot />
      <div class="modal-actions">
        <slot name="actions">
          <button class="secondary-btn" type="button" @click="onClose">取消</button>
          <button class="primary-btn" type="button" @click="onConfirm">确认</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  onClose: { type: Function, required: true },
  onConfirm: { type: Function, required: true },
});
</script>
