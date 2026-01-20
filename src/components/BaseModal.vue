<template>
  <div class="modal-overlay" @click.self="onClose">
    <div class="modal" role="dialog" aria-modal="true">
      <header>
        <h3>{{ title }}</h3>
        <p v-if="description" class="modal-description">{{ description }}</p>
      </header>
      <slot />
      <div class="modal-actions">
        <button class="btn secondary" type="button" @click="onClose">取消</button>
        <button class="btn" type="button" @click="onConfirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' }
})

const emit = defineEmits(['close', 'confirm'])

const onClose = () => emit('close')
const onConfirm = () => emit('confirm')
</script>

<style scoped>
.modal-description {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 12px;
}
</style>
