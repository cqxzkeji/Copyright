<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h3 style="margin:0;">{{ title }}</h3>
        <button style="background:#e7f3ff;color:#14416f;padding:6px 10px;" @click="emit('close')">关闭</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ title: String });
const emit = defineEmits(['close']);
</script>
