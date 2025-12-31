<template>
  <div class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal-container">
      <div class="modal-header">
        <h3 style="margin: 0">{{ title }}</h3>
        <button class="button-secondary" @click="$emit('close')">关闭</button>
      </div>
      <div>
        <slot />
      </div>
      <div class="modal-footer" v-if="showFooter">
        <slot name="footer">
          <button class="button-primary" @click="$emit('confirm')">确认</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '提示' },
  showFooter: { type: Boolean, default: true }
})
</script>
