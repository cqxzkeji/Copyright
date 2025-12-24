<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true" @click.self="$emit('close')">
    <div class="modal">
      <header class="section-header" style="margin-bottom: 10px">
        <h3>{{ title }}</h3>
        <button class="btn secondary" @click="$emit('close')">关闭</button>
      </header>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '操作' }
});
</script>
