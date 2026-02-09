<template>
  <div class="mask" @click.self="$emit('close')">
    <div class="dialog">
      <h3>{{ title }}</h3>
      <div class="content"><slot /></div>
      <div class="actions">
        <button class="btn-secondary" @click="$emit('close')">取消</button>
        <button class="btn-primary" @click="$emit('confirm')">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: { type: String, default: '提示' } })
defineEmits(['close', 'confirm'])
</script>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(19, 33, 68, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dialog {
  width: min(540px, 92vw);
  background: #fff;
  border-radius: 14px;
  padding: 16px;
}
.actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
</style>
