<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <header>
        <h3 style="margin:0">{{ title }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </header>
      <slot />
      <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:10px">
        <button class="btn ghost" @click="emit('close')">关闭</button>
        <button class="btn" @click="emit('confirm')">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' }
});
const emit = defineEmits(['close', 'confirm']);
</script>
