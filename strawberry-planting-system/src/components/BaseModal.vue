<template>
  <teleport to="body">
    <div v-if="show" class="modal-mask" @click.self="onClose">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="btn ghost" @click="onClose">关闭</button>
        </div>
        <div>
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const onClose = () => emit('close')
</script>
