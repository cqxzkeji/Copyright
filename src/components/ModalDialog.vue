<template>
  <div v-if="modelValue" class="modal-mask">
    <div class="modal-wrapper" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('update:modelValue', false)">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer" v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '操作'
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>
