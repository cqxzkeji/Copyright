<template>
  <div class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
        <button class="secondary-btn" type="button" @click="$emit('close')">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="secondary-btn" type="button" @click="$emit('close')">取消</button>
          <button class="primary-btn" type="button" @click="$emit('confirm')">确认</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>
