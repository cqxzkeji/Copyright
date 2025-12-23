<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <h3>{{ title }}</h3>
      <slot />
      <div class="button-group" style="justify-content: flex-end; margin-top: 16px;">
        <button class="button ghost" @click="emit('close')">关闭</button>
        <button v-if="confirmText" class="button" @click="emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  confirmText: { type: String, default: '' }
})

const emit = defineEmits(['close', 'confirm'])
</script>
