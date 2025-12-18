<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="emitClose">
    <div class="modal" role="dialog" aria-modal="true">
      <header>
        <h3>{{ title }}</h3>
        <button class="ghost" @click="emitClose">关闭</button>
      </header>
      <div class="body">
        <slot />
      </div>
      <footer v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const emitClose = () => emit('update:modelValue', false);
</script>
