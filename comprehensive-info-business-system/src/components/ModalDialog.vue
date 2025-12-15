<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-mask" @keydown.esc="$emit('update:modelValue', false)">
      <div class="modal-panel" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div>
            <p class="section-title" style="margin: 0;">{{ title }}</p>
            <p v-if="description" class="subtext">{{ description }}</p>
          </div>
          <button class="ghost-btn" @click="$emit('update:modelValue', false)">关闭</button>
        </div>
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '操作弹窗'
  },
  description: {
    type: String,
    default: ''
  }
});
</script>
