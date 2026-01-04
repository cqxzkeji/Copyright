<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="emit('update:modelValue', false)">
    <div class="modal-card">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn secondary" @click="emit('update:modelValue', false)">关闭</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '提示'
  }
});

const emit = defineEmits(['update:modelValue']);
</script>
