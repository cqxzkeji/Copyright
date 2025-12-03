<template>
  <div v-if="modelValue" class="overlay" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="secondary" @click="close">关闭</button>
      </div>
      <div>
        <slot />
      </div>
      <div class="modal-actions" v-if="showActions">
        <button class="secondary" @click="close">取消</button>
        <button @click="$emit('confirm')">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '操作' },
  showActions: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'confirm'])
const close = () => emit('update:modelValue', false)
</script>
