<template>
  <div class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <button class="ghost-btn" type="button" @click="onClose">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <button class="ghost-btn" type="button" @click="onClose">取消</button>
        <button class="primary-btn" type="button" @click="onConfirm">确认</button>
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

const emit = defineEmits(["close", "confirm"]);
const onClose = () => emit("close");
const onConfirm = () => emit("confirm");
</script>
