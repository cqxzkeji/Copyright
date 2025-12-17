<template>
  <div class="modal-mask" v-if="modelValue">
    <div class="modal-shell" role="dialog" aria-modal="true">
      <header class="modal-header">
        <div class="flex-between" style="width: 100%">
          <h3 style="margin: 0">{{ title }}</h3>
          <button class="btn ghost" @click="$emit('update:modelValue', false)">关闭</button>
        </div>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="btn ghost" @click="$emit('update:modelValue', false)">取消</button>
          <button class="btn primary" @click="$emit('confirm')">确定</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '弹窗' }
});
defineEmits(['update:modelValue', 'confirm']);
</script>
