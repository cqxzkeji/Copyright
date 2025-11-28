<template>
  <div v-if="show" class="overlay" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <span>{{ title }}</span>
        <button @click="close" style="background:#e2e8f0;color:#0f172a;box-shadow:none;">关闭</button>
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
  show: Boolean,
  title: {
    type: String,
    default: '操作'
  }
})

const emit = defineEmits(['close'])

const close = () => emit('close')
</script>
