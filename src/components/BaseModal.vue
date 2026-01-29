<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="onClose">
      <div class="modal" role="dialog" aria-modal="true">
        <header>
          <h3>{{ title }}</h3>
          <button class="secondary-button" type="button" @click="onClose">关闭</button>
        </header>
        <div class="modal-body">
          <slot />
        </div>
        <footer v-if="showFooter" class="modal-footer">
          <slot name="footer">
            <button class="secondary-button" type="button" @click="onClose">取消</button>
            <button class="primary-button" type="button" @click="onConfirm">确认</button>
          </slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: {
    type: String,
    default: ''
  },
  showFooter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const onClose = () => emit('close')
const onConfirm = () => emit('confirm')
</script>
