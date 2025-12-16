<template>
  <div v-if="modelValue" class="modal-backdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <header>
        <h3>{{ title }}</h3>
        <button class="btn" @click="$emit('update:modelValue', false)">关闭</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer>
        <button class="btn" @click="$emit('update:modelValue', false)">取消</button>
        <button class="btn primary" @click="confirm">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '操作'
  }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};
</script>
