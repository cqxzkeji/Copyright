<template>
  <div class="modal-backdrop" v-if="modelValue">
    <div class="modal-panel" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="secondary" @click="$emit('update:modelValue', false)">关闭</button>
      </div>
      <div>
        <slot />
      </div>
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '操作弹窗'
  }
});
</script>
