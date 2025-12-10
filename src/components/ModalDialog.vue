<template>
  <div class="modal-overlay" v-if="modelValue">
    <div class="modal" role="dialog" aria-modal="true">
      <header>
        <span>{{ title }}</span>
        <button class="btn secondary" @click="$emit('update:modelValue', false)">关闭</button>
      </header>
      <div class="content">
        <slot />
      </div>
      <footer style="margin-top: 12px; display: flex; gap: 10px; justify-content: flex-end">
        <slot name="footer">
          <button class="btn" @click="$emit('confirm')">确认</button>
          <button class="btn secondary" @click="$emit('update:modelValue', false)">取消</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '操作窗口'
  }
});

defineEmits(['update:modelValue', 'confirm']);
</script>
