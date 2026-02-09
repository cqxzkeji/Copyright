<template>
  <div v-if="visible" class="modal-mask" @click.self="$emit('close')">
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-content">
        <slot />
      </div>
      <div class="modal-footer">
        <button class="secondary" @click="$emit('close')">取消</button>
        <button v-if="showConfirm" class="primary" @click="$emit('confirm')">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String,
  showConfirm: { type: Boolean, default: true }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.modal-mask { position: fixed; inset: 0; background: rgba(23,35,61,.38); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box { width: min(560px, 92vw); background: #fff; border-radius: 14px; box-shadow: 0 16px 40px rgba(56,92,171,.24); overflow: hidden; }
.modal-header, .modal-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: #f6f9ff; }
.modal-content { padding: 18px; max-height: 60vh; overflow: auto; }
.icon-btn { border: none; background: transparent; font-size: 18px; cursor: pointer; }
button { border: none; border-radius: 8px; padding: 8px 14px; cursor: pointer; }
.primary { background: #2d7ef7; color: #fff; }
.secondary { background: #e8eefb; color: #2c3f74; }
</style>
