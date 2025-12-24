<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h3 style="margin:0;font-size:18px;color:#1f2a44;">{{ title }}</h3>
        <button class="secondary-btn" @click="close">关闭</button>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '操作'
  }
});
const emit = defineEmits(['close']);
const close = () => emit('close');
</script>
