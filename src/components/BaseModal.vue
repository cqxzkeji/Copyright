<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal-card" role="dialog" aria-modal="true">
      <header class="section-title">
        <h3>{{ title }}</h3>
        <button class="btn ghost" type="button" @click="close">关闭</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer class="modal-actions">
        <slot name="actions">
          <button class="btn ghost" type="button" @click="close">取消</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '提示' },
  modelValue: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>
