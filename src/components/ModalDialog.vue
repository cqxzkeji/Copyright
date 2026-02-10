<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="modal-content">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="btn secondary" @click="$emit('close')">关闭</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: '提示' },
});
defineEmits(['close']);
</script>
