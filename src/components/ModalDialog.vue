<template>
  <div class="modal-backdrop" v-if="modelValue">
    <div class="modal-window">
      <div class="modal-header">
        <slot name="title">操作</slot>
        <button class="ghost" @click="$emit('update:modelValue', false)">关闭</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})

defineEmits(['update:modelValue'])
</script>
