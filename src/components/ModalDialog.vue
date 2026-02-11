<template>
  <div v-if="visible" class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card">
      <header>
        <h3>{{ title }}</h3>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <button class="btn" @click="$emit('close')">取消</button>
        <button v-if="confirmText" class="btn primary" @click="$emit('confirm')">{{ confirmText }}</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: { type: String, default: '提示' },
  confirmText: { type: String, default: '' }
})
defineEmits(['close', 'confirm'])
</script>
