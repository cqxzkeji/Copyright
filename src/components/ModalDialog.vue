<template>
  <div v-if="modelValue" class="modal-mask" @click.self="$emit('update:modelValue', false)">
    <div class="modal-box">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-btn" @click="$emit('update:modelValue', false)">✕</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="btn secondary" @click="$emit('update:modelValue', false)">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' }
})
defineEmits(['update:modelValue'])
</script>
