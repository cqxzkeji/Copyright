<template>
  <div class="modal-backdrop" @click.self="onClose">
    <div class="modal-card">
      <header style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h3 style="margin:0;color:#111827;">{{ title }}</h3>
        <button class="secondary-btn" @click="onClose">关闭</button>
      </header>
      <div style="margin-top:12px;max-height:60vh;overflow:auto;">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '操作' }
})
const emit = defineEmits(['close'])
const onClose = () => emit('close')
</script>
