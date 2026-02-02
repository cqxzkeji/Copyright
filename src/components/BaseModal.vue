<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal" :style="{ width }">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn" @click="close">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="btn" @click="close">知道了</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '提示'
  },
  width: {
    type: String,
    default: 'min(560px, 100%)'
  }
});

const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>
