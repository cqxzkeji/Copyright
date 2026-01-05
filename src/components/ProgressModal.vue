<template>
  <ModalDialog :open="open" @close="$emit('close')" @confirm="$emit('confirm')">
    <template #title>
      <h3 style="margin:0;font-size:18px;">{{ title }}</h3>
    </template>
    <div class="input-row">
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:600;">
        <span>{{ subtitle }}</span>
        <span>{{ progress }}%</span>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import ModalDialog from './ModalDialog.vue';

defineProps({
  open: Boolean,
  title: { type: String, default: '正在处理' },
  subtitle: { type: String, default: '系统处理中，请稍候' },
  progress: { type: Number, default: 0 }
});
</script>
