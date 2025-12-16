<template>
  <div v-if="modelValue" class="modal-mask" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn ghost" @click="close">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer" v-if="$slots.footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '操作' }
});

const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>
